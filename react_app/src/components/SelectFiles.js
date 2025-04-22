import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SelectFiles = ({ setSelectedModel }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState(''); // nowy stan na aktywny model

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:8000/files/list_pdfs');
      setModels(response.data.names);
    } catch (error) {
      console.error('Błąd przy pobieraniu modeli:', error);
    }
  };

  const loadModel = async (modelName) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/files/load_pdfs', {
        rag_name: modelName,
        dir_path: ''
      });
      alert(`Załadowano model: ${modelName}`);
      setSelectedModel(modelName);
      setActiveModel(modelName); // ustawiamy podświetlenie
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
      <h2>Wybierz notatki</h2>
      {loading && <p>Ładowanie...</p>}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {models.map((name) => (
          <button
            key={name}
            onClick={() => loadModel(name)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: activeModel === name ? '#4CAF50' : '#eee',
              color: activeModel === name ? 'white' : 'black',
              border: activeModel === name ? '2px solid #4CAF50' : '2px solid #ccc',
              cursor: 'pointer'
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectFiles;
