'use client';

const playSound = (type) => {
  if (typeof window === 'undefined') return;

  const sounds = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // High pitched ding
    error: 'https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3',   // Error buz
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',   // Soft click
    rank: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'     // Level up fanfare
  };

  const audio = new Audio(sounds[type]);
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Audio play prevented by browser policy'));
};

export default playSound;
