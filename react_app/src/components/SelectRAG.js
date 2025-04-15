import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SelectRAG = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:8000/chatbot/list');
      setModels(response.data.names);
    } catch (error) {
      console.error('Błąd przy pobieraniu modeli:', error);
    }
  };

  const loadModel = async (modelName) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/chatbot/load', {
        rag_name: modelName,
        dir_path: '' // jeśli nie trzeba podawać ponownie ścieżki
      });
      alert(response.data.reply);
    } catch (error) {
      console.error('Błąd przy ładowaniu modelu:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div>
      <h2>Wybierz model RAG</h2>
      {loading && <p>Ładowanie...</p>}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {models.map((name) => (
          <button key={name} onClick={() => loadModel(name)}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectRAG;
