import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const ModelSelector = ({ onModelSelect }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selecting, setSelecting] = useState(false);

  
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:8000/chatbot/available_models', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && Array.isArray(response.data.models)) {
        setModels(response.data.models);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setError(error.response?.data?.detail || 'Błąd podczas pobierania listy modeli');
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = async (model) => {
    setSelecting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        'http://localhost:8000/chatbot/select_model',
        { model_name: model },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.selected_model) {
        setSelectedModel(model);
        if (onModelSelect) {
          onModelSelect(model);
        }
        // Optional: Show success message
        setError(null);
      }
    } catch (error) {
      console.error('Error selecting model:', error);
      setError(
        error.response?.data?.detail || 
        'Błąd podczas wyboru modelu'
      );
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div className="mb-4">
      <h3>Dostępne Modele</h3>
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      {loading ? (
        <div className="text-center p-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Ładowanie...</span>
          </Spinner>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {models.map((model) => (
            <Card 
              key={model}
              className={`model-card ${selectedModel === model ? 'border-primary' : ''}`}
              style={{
                cursor: 'pointer',
                minWidth: '150px',
                maxWidth: '200px',
                flex: '0 0 auto'
              }}
              onClick={() => handleModelSelect(model)}
            >
              <Card.Body className="p-2">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-truncate me-2">{model}</div>
                  {selectedModel === model && (
                    <span className="text-primary">✓</span>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;