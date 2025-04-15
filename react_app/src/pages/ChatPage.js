import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import LoadChatBot from '../components/LoadChatBot';  
import SelectRAG from '../components/SelectRAG';

const ChatPage = () => {
  // Stan do przechowywania bieżącej wiadomości użytkownika
  const [message, setMessage] = useState('');
  // Historia konwersacji jako tablica obiektów { sender: 'user'|'bot', text: string }
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault(); // zapobiega przeładowaniu strony
    if (!message.trim()) return;

    // Dodaj wiadomość użytkownika do historii
    const newHistory = [...chatHistory, { sender: 'user', text: message }];
    setChatHistory(newHistory);
    setMessage(''); // wyczyść pole tekstowe

    try {
      // Wysyłamy POST do backendu. Upewnij się, że adres baseURL jest poprawny.
      const response = await axios.post('http://localhost:8000/chatbot/query', {
        message: message
      });
      // Zakładamy, że backend zwraca odpowiedź w postaci { reply: "Odpowiedź bota" }
      const reply = response.data.reply;
      setChatHistory([...newHistory, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      // W przypadku błędu dodajemy komunikat o błędzie do historii
      setChatHistory([...newHistory, { sender: 'bot', text: 'Wystąpił błąd. Spróbuj ponownie.' }]);
    }
  };

  return (
    <Container className="mt-4">
        <LoadChatBot />
        <SelectRAG />
      <h1>Chat z Chatbotem</h1>
      {/* Wyświetlanie historii konwersacji */}
      <ListGroup className="mb-4">
        {chatHistory.map((msg, index) => (
          <ListGroup.Item 
            key={index} 
            variant={msg.sender === 'bot' ? 'secondary' : 'light'}
          >
            <strong>{msg.sender === 'bot' ? 'Bot:' : 'Ty:'}</strong> {msg.text}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {/* Formularz do wysyłania wiadomości */}
      <Form onSubmit={handleSend}>
        <Form.Group controlId="chatMessage">
          <Form.Control
            type="text"
            placeholder="Wpisz wiadomość..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">
          Wyślij
        </Button>
      </Form>
    </Container>
  );
};

export default ChatPage;
