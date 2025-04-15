import React, { useState } from 'react';
import axios from 'axios';

const LoadChatBot = () => {
  const [ragName, setRagName] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...files, ...e.dataTransfer.files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ragName.trim() || files.length === 0) {
      alert('Proszę podać nazwę i dodać pliki PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('rag_name', ragName);
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post('http://localhost:8000/chatbot/upload_pdfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.reply);
      setFiles([]);
      setRagName('');
    } catch (error) {
      console.error('Błąd przy wysyłaniu:', error);
      alert('Wystąpił błąd przy ładowaniu plików.');
    }
  };

  return (
    <div>
      <h2>Załaduj Chatbota z plików PDF</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ragName}
          onChange={(e) => setRagName(e.target.value)}
          placeholder="Wprowadź nazwę RAG-a"
        />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: '2px dashed #aaa',
            padding: '1rem',
            marginTop: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
          }}
        >
          <p>Przeciągnij i upuść pliki tutaj lub kliknij, aby dodać</p>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'block', marginTop: '0.5rem' }}
          />
        </div>
        {files.length > 0 && (
          <div>
            <h4>Wybrane pliki:</h4>
            <ul>
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit">Załaduj Chatbota</button>
      </form>
    </div>
  );
};

export default LoadChatBot;
