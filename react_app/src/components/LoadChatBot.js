import React, { useState } from 'react';
import axios from 'axios';

const LoadChatBot = () => {
  const [dirPath, setDirPath] = useState(''); // Stan do przechowywania ścieżki do folderu

  // Funkcja do obsługi wysyłania zapytania
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dirPath.trim()) {
      alert('Proszę wprowadzić ścieżkę do folderu.');
      return;
    }

    try {
      // Wysłanie żądania POST do backendu
      const response = await axios.post('http://localhost:8000/chatbot/create', { dir_path: dirPath });

      // Wyświetlenie odpowiedzi serwera
      alert(response.data.reply);

      // Resetowanie stanu po wysłaniu zapytania
      setDirPath('');
    } catch (error) {
      console.error('Błąd podczas ładowania chatbota:', error);
      alert('Wystąpił błąd podczas ładowania chatbota.');
    }
  };

  return (
    <div>
      <h2>Załaduj Chatbota</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={dirPath}
          onChange={(e) => setDirPath(e.target.value)} // Zaktualizowanie stanu
          placeholder="Wprowadź ścieżkę do folderu PDF"
        />
        <button type="submit">Załaduj Chatbota</button>
      </form>
    </div>
  );
};

export default LoadChatBot;
