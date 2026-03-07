const askForm = document.getElementById('askForm');
const questionInput = document.getElementById('questionInput');
const transcriptInput = document.getElementById('transcriptInput');
const liveModeButton = document.getElementById('liveModeButton');
const listenStatus = document.getElementById('listenStatus');
const messages = document.getElementById('messages');
const statusLabel = document.getElementById('status');
const sizeButtons = document.querySelectorAll('.size-btn');
const panel = document.getElementById('chatPanel');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';
const AUTO_SEND_DELAY_MS = 1300;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;
let liveModeEnabled = false;
let isGenerating = false;
let autoSendTimer = null;
let lastAutoSentQuestion = '';

function addMessage(role, text) {
  const bubble = document.createElement('div');
  bubble.className = `msg ${role}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  panel.scrollTop = panel.scrollHeight;
}

function applyPanelSize(size) {
  panel.classList.remove('panel-small', 'panel-medium', 'panel-large');
  panel.classList.add(`panel-${size}`);

  sizeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.size === size);
  });
}

function clearAutoSendTimer() {
  if (!autoSendTimer) return;
  clearTimeout(autoSendTimer);
  autoSendTimer = null;
}

function setListeningState(listening, message) {
  isListening = listening;
  liveModeButton.classList.toggle('active', listening || liveModeEnabled);
  listenStatus.textContent = message;
}

function setLiveMode(enabled) {
  liveModeEnabled = enabled;
  liveModeButton.textContent = enabled ? 'Stop Live Mode' : 'Start Live Mode';

  if (!enabled) {
    clearAutoSendTimer();
    lastAutoSentQuestion = '';
    if (isListening && recognition) {
      recognition.stop();
    }
    setListeningState(false, 'Mic idle');
  }
}

async function submitLiveQuestion(question) {
  const normalizedQuestion = question.trim();
  if (!normalizedQuestion || isGenerating || normalizedQuestion === lastAutoSentQuestion) {
    return;
  }

  lastAutoSentQuestion = normalizedQuestion;
  isGenerating = true;
  await generateAnswer(normalizedQuestion);
  isGenerating = false;

  transcriptInput.value = '';
  questionInput.value = '';
  statusLabel.textContent = 'Auto-sent. Keep speaking for the next question.';
}

function scheduleAutoSend() {
  clearAutoSendTimer();

  autoSendTimer = setTimeout(async () => {
    if (!liveModeEnabled) return;

    const question = questionInput.value.trim() || transcriptInput.value.trim();
    await submitLiveQuestion(question);
  }, AUTO_SEND_DELAY_MS);
}

function setupRecognition() {
  if (!SpeechRecognition) {
    liveModeButton.disabled = true;
    listenStatus.textContent = 'Speech recognition not supported in this browser.';
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    setListeningState(true, 'Listening...');
  };

  recognition.onresult = (event) => {
    let finalText = '';
    let interimText = '';

    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += `${transcript} `;
      } else {
        interimText += transcript;
      }
    }

    if (finalText) {
      transcriptInput.value = `${transcriptInput.value}${finalText}`.trimStart();
    }

    if (liveModeEnabled) {
      const autoFilled = `${transcriptInput.value} ${interimText}`.trim();
      questionInput.value = autoFilled;
      scheduleAutoSend();
    }

    listenStatus.textContent = interimText ? `Listening... ${interimText}` : 'Listening...';
  };

  recognition.onerror = (event) => {
    setListeningState(false, `Mic error: ${event.error}`);
    setLiveMode(false);
  };

  recognition.onend = () => {
    if (liveModeEnabled) {
      recognition.start();
      return;
    }
    setListeningState(false, 'Mic idle');
  };
}

async function generateAnswer(question) {
  const apiKey = localStorage.getItem('OPENAI_API_KEY') || '';
  if (!apiKey) {
    statusLabel.textContent =
      'Set OPENAI_API_KEY in localStorage before calling ChatGPT (see README).';
    return;
  }

  addMessage('user', question);
  statusLabel.textContent = 'Generating answer...';

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are an ethical interview coach. Give concise response suggestions in 4-8 bullet points and a 1-minute spoken answer.',
          },
          { role: 'user', content: question },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'No response received.';
    addMessage('assistant', text);
    statusLabel.textContent = 'Done';
  } catch (error) {
    statusLabel.textContent = `Failed: ${error.message}`;
    addMessage(
      'assistant',
      'I could not generate a response. Please check your API key and network.',
    );
  }
}

function handleLiveModeClick() {
  if (!recognition) return;

  if (!liveModeEnabled) {
    setLiveMode(true);
    transcriptInput.value = '';
    questionInput.value = '';
    recognition.start();
    statusLabel.textContent =
      'Live Mode started. Speak naturally—questions will auto-send after a brief pause.';
    return;
  }

  setLiveMode(false);
  statusLabel.textContent = 'Live Mode stopped.';
}

sizeButtons.forEach((button) => {
  button.addEventListener('click', () => applyPanelSize(button.dataset.size));
});

liveModeButton.addEventListener('click', handleLiveModeClick);

askForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();
  if (!question) return;

  questionInput.value = '';
  await generateAnswer(question);
});

setupRecognition();
