import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';  // Importujemy Sidebar
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import SelectRAG from '../components/SelectRAG';
import ModelSelector from '../components/ModelSelector';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chats, setChats] = useState([]); 
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);


  const fetchChatHistory = async (chatId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      console.log(`Fetching chat history for chat ID: ${chatId}`); // Debug log
  
      // Frontend usage
      const response = await axios.get(
        `http://localhost:8000/chatbot/get_chat_history/${chatId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

      console.log('Response from server:', response.data); // Debug log
      if (response.data) {
        console.log('Received chat history:', response.data); // Debug log
        
        // Validate response structure
        if (!response.data.messages || !Array.isArray(response.data.messages)) {
          throw new Error('Invalid chat history format');
        }
  
        // Format messages for display
        const formattedHistory = response.data.messages.map(msg => ({
          sender: msg.role === 'assistant' ? 'bot' : 'user',
          text: msg.content,
          timestamp: msg.timestamp || new Date().toISOString()
        }));
        
        setChatHistory(formattedHistory);
  
        // Update chat name if different
        if (response.data.chat_name) {
          setChats(prevChats => prevChats.map(chat => 
            chat.id === chatId 
              ? { ...chat, name: response.data.chat_name }
              : chat
          ));
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error.response || error);
      
      if (error.response?.status === 404) {
        console.log('Creating new chat history for:', chatId);
        // Initialize empty chat history for new chat
        setChatHistory([]);
        setError(null); // Clear any previous errors
      } else if (error.response?.status === 401) {
        setError('Sesja wygasła. Zaloguj się ponownie.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setError(
          error.response?.data?.detail || 
          error.message || 
          'Błąd podczas ładowania historii czatu'
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Update handleSelectChat to load chat history
  const handleSelectChat = async (chatId) => {
    setCurrentChatId(chatId);
    setChatHistory([]); // Clear current history
    setLoading(true);
    await fetchChatHistory(chatId);
    setLoading(false);
  };

  // Fetch chat sessions from backend
  const fetchChatSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:8000/chatbot/chat_sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.chats) {
        setChats(response.data.chats);
        // If no chat is selected and we have chats, select the most recent one
        if (!currentChatId && response.data.chats.length > 0) {
          setCurrentChatId(response.data.chats[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      setError(error.response?.data?.detail || 'Failed to load chat sessions');
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChatId) return;

    const newHistory = [...chatHistory, { sender: 'user', text: message }];
    setChatHistory(newHistory);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Find current chat name from chats array
      const currentChat = chats.find(chat => chat.id === currentChatId);
      if (!currentChat) {
        throw new Error('Selected chat not found');
      }

      const response = await axios.post(
        'http://localhost:8000/chatbot/query',
        {
          message: message,
          chat_id: currentChatId,
          chat_name: currentChat.name
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.reply) {
        throw new Error('Invalid response format');
      }

      setChatHistory([...newHistory, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = 'Wystąpił błąd. Spróbuj ponownie.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Model RAG nie jest załadowany. Proszę załadować model.';
      } else if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      
      setChatHistory([...newHistory, { sender: 'bot', text: errorMessage }]);
    }
  };

  // Load chat sessions on component mount
  useEffect(() => {
    fetchChatSessions();
  }, []);

  const handleCreateNewChat = async () => {
    const timestamp = new Date().toISOString();
    const chatName = `Chat ${chats.length + 1}`;
    const newChat = {
      id: Date.now().toString(),
      name: chatName,
      timestamp: timestamp
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    setChatHistory([]);
  };

  // Add handler for model selection
  const handleModelSelect = (model) => {
    setSelectedModel(model);
    console.log('Selected model:', model);
  };


  return (
    <Container fluid className="d-flex">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onCreateNewChat={handleCreateNewChat}
        loading={loading}
        error={error}
      />
      <Container className="mt-4">
        <SelectRAG />
        <ModelSelector onModelSelect={handleModelSelect} />
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <h1>Chat z Chatbotem</h1>
        {currentChatId && (
          <>
            <ListGroup className="mb-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center p-3">
                  <span className="spinner-border spinner-border-sm me-2" />
                  Ładowanie historii...
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <ListGroup.Item 
                    key={index} 
                    variant={msg.sender === 'bot' ? 'secondary' : 'light'}
                    className={`mb-2 ${msg.sender === 'bot' ? 'bg-light' : 'bg-white'}`}
                  >
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong>{msg.sender === 'bot' ? 'Bot:' : 'Ty:'}</strong>
                        {msg.timestamp && (
                          <small className="text-muted">
                            {new Date(msg.timestamp).toLocaleString()}
                          </small>
                        )}
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
            <Form onSubmit={handleSend}>
              <Form.Group controlId="chatMessage">
                <Form.Control
                  type="text"
                  placeholder="Wpisz wiadomość..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>
              <Button 
                variant="primary" 
                type="submit" 
                className="mt-2"
                disabled={loading || !message.trim()}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij'}
              </Button>
            </Form>
          </>
        )}
      </Container>
    </Container>
  );
};

export default ChatPage;

