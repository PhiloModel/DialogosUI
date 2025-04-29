import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const fetchModels = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/files/list_pdfs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.names;
  } catch (error) {
    console.error('Błąd przy pobieraniu modeli:', error);
    throw error;
  }
};

const SelectFiles = ({ setSelectedModels }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const toggleModelSelection = (modelName) => {
    setSelectedFiles(prev => {
      if (prev.includes(modelName)) {
        return prev.filter(name => name !== modelName);
      } else {
        return [...prev, modelName];
      }
    });
    // Update parent component with selected models
    setSelectedModels(prev => {
      if (prev.includes(modelName)) {
        return prev.filter(name => name !== modelName);
      } else {
        return [...prev, modelName];
      }
    });
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
            onClick={() => toggleModelSelection(name)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: selectedFiles.includes(name) ? '#4CAF50' : '#eee',
              color: selectedFiles.includes(name) ? 'white' : 'black',
              border: selectedFiles.includes(name) ? '2px solid #4CAF50' : '2px solid #ccc',
              cursor: 'pointer'
            }}
          >
            {name}
          </button>
        ))}
      </div>
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p>Wybrane notatki: {selectedFiles.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default SelectFiles;