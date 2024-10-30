export async function textToSpeech(text: string, voiceId: string, rate: number): Promise<AudioBuffer> {
  // Implementation using Web Speech API as fallback
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    
    utterance.onend = () => resolve(new AudioContext().createBuffer(1, 1, 44100));
    utterance.onerror = reject;
    
    window.speechSynthesis.speak(utterance);
  });
}

export async function speechToText(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob);
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('voicebloom-settings')?.apiKey || ''}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const data = await response.json();
  return data.text;
}