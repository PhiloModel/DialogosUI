import React, { useEffect, useState } from 'react';
import axios from 'axios';


// Export the fetchModels function
export const fetchModels = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    const response = await axios.get('http://localhost:8000/files/list_pdfs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Odpowiedź z serwera:', response.data.names);
    return response.data.names;
  } catch (error) {
    console.error('Błąd przy pobieraniu modeli:', error);
    throw error;
  }
};

const SelectFiles = ({ setSelectedModel }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState('');

  
  const loadModel = async (modelName) => {
    setLoading(true);
    
    try {
      
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/files/load_pdfs',
        { rag_name: modelName, dir_path: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Załadowano model: ${modelName}`);
      setSelectedModel(modelName);
      setActiveModel(modelName);
      const modelNames = await fetchModels();
      setModels(modelNames);

    } catch (error) {
      console.error('Błąd przy ładowaniu modelu:', error);
    }
    setLoading(false);
  };

  const loadModels = async () => {
    try {
      const modelNames = await fetchModels();
      setModels(modelNames);
    } catch (error) {
      console.error('Błąd przy pobieraniu modeli:', error);
    }
  };

  useEffect(() => {
    loadModels();
    
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
