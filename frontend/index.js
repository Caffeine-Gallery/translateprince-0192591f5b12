import { backend } from 'declarations/backend';

const inputEl = document.getElementById('input');
const languageEl = document.getElementById('language');
const translateBtn = document.getElementById('translate');
const outputEl = document.getElementById('output');
const speakBtn = document.getElementById('speak');
const historyEl = document.getElementById('history');

translateBtn.addEventListener('click', async () => {
  const text = inputEl.value;
  const targetLang = languageEl.value;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200) {
      const translatedText = data.responseData.translatedText;
      outputEl.textContent = translatedText;

      // Add translation to backend
      await backend.addTranslation(text, translatedText, targetLang);

      // Update history
      updateHistory();
    } else {
      outputEl.textContent = 'Translation failed. Please try again.';
    }
  } catch (error) {
    console.error('Translation error:', error);
    outputEl.textContent = 'An error occurred. Please try again.';
  }
});

speakBtn.addEventListener('click', () => {
  const text = outputEl.textContent;
  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageEl.value;
    speechSynthesis.speak(utterance);
  }
});

async function updateHistory() {
  const translations = await backend.getTranslations();
  historyEl.innerHTML = '';
  translations.forEach(([original, translated, language]) => {
    const li = document.createElement('li');
    li.textContent = `${original} -> ${translated} (${language})`;
    historyEl.appendChild(li);
  });
}

// Initial history load
updateHistory();
