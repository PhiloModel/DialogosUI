import React, { useState } from 'react';
import { sendMessage } from '../services/api';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Dodaj wiadomość użytkownika do historii
    const newHistory = [...chatHistory, { sender: 'user', text: message }];
    setChatHistory(newHistory);
    setMessage('');

    // Wyślij wiadomość do backendu i pobierz odpowiedź chatbota
    try {
      const response = await sendMessage(message);
      // Zakładamy, że backend zwraca odpowiedź w postaci { reply: "tekst odpowiedzi" }
      setChatHistory([...newHistory, { sender: 'bot', text: response.reply }]);
    } catch (error) {
      setChatHistory([...newHistory, { sender: 'bot', text: 'Błąd podczas wysyłania wiadomości.' }]);
    }
  };

  return (
    <Container className="mt-4">
      <h1>Chat z Chatbotem</h1>
      <ListGroup className="mb-4">
        {chatHistory.map((msg, index) => (
          <ListGroup.Item key={index} variant={msg.sender === 'bot' ? 'secondary' : ''}>
            <strong>{msg.sender === 'bot' ? 'Bot:' : 'Ty:'}</strong> {msg.text}
          </ListGroup.Item>
        ))}
      </ListGroup>
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
