import React, { useState } from 'react';
import axios from 'axios';
import SelectRAG from '../components/SelectRAG';

const LoadRAGPage = () => {
  const [ragName, setRagName] = useState('');
  const [files, setFiles] = useState([]);

  // Obsługa zmiany plików z inputa
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // Obsługa przeciągania i upuszczania plików
  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...files, ...e.dataTransfer.files]);
  };

  // Zapobieganie domyślnej akcji przy przeciąganiu
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ragName.trim() || files.length === 0) {
      alert('Proszę wprowadzić nazwę modelu oraz wybrać przynajmniej jeden plik PDF.');
      return;
    }

    // Przygotowujemy dane do wysłania używając FormData
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
      setRagName('');
      setFiles([]);
    } catch (error) {
      console.error('Błąd przy wysyłaniu plików:', error);
      alert('Wystąpił błąd podczas ładowania modelu.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
            <SelectRAG />
      <h2>Ładuj lub stwórz model RAG</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ragName}
          onChange={(e) => setRagName(e.target.value)}
          placeholder="Wprowadź nazwę modelu RAG"
          style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%' }}
        />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: '2px dashed #ccc',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          <p>Przeciągnij i upuść pliki PDF tutaj lub kliknij, aby wybrać</p>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'block', margin: '0 auto' }}
          />
        </div>
        {files.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h4>Wgrane pliki:</h4>
            <ul>
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>
          Załaduj model
        </button>
      </form>
    </div>
  );
};

export default LoadRAGPage;
