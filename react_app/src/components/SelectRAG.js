import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SelectRAG = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchModels = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Nie znaleziono tokenu. Zaloguj się ponownie.');
      }

      const response = await axios.get('http://localhost:8000/chatbot/list_rags', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Token:', token);
      console.log('Odpowiedź z serwera:', response.data);
      console.log('Odpowiedź z serwera:', response.data.names);
      if (!response.data || !Array.isArray(response.data.names)) {
        throw new Error('Nieprawidłowa odpowiedź z serwera');
      }

      setModels(response.data.names);
    } catch (error) {
      console.error('Błąd przy pobieraniu modeli RAG:', error);
      
      if (error.response?.status === 401) {
        setError('Sesja wygasła. Zaloguj się ponownie.');
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      setError(error.message || 'Wystąpił błąd podczas pobierania modeli RAG');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadModel = async (modelName) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Nie znaleziono tokenu. Zaloguj się ponownie.');
      }

      // Match the ChatbotRequest model from FastAPI
      const requestData = {
        rag_name: modelName,
        dir_path: '' // Add required field from ChatbotRequest model
      };

      const response = await axios.post(
        'http://localhost:8000/chatbot/load_private',  // Changed endpoint
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.reply) {
        throw new Error('Nieprawidłowa odpowiedź z serwera');
      }

      alert(response.data.reply);

    } catch (error) {
      console.error('Błąd przy ładowaniu modelu RAG:', error);
      
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        const validationError = error.response.data?.detail?.[0]?.msg || 
                              'Nieprawidłowe dane żądania';
        setError(validationError);
        return;
      }

      // ...rest of error handling...
      if (error.response?.status === 401) {
        setError('Sesja wygasła. Zaloguj się ponownie.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      setError(error.response?.data?.detail || error.message || 
              'Wystąpił błąd podczas ładowania modelu RAG');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div>
      <h2>Wybierz model RAG</h2>
      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
        }}>
          {error}
        </div>
      )}
      {loading && <p>Ładowanie...</p>}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {models.map((name) => (
          <button
            key={name}
            onClick={() => loadModel(name)}
            style={{
              padding: '10px 20px',
              margin: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
              backgroundColor: '#f0f0f0'
            }}
            disabled={loading}
          >
            {name}
          </button>
        ))}
      </div>
      {models.length === 0 && !loading && !error && (
        <p>Brak dostępnych modeli RAG</p>
      )}
    </div>
  );
};

export default SelectRAG;