import React from 'react';
import { ListGroup, Button, Spinner } from 'react-bootstrap';

const Sidebar = ({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onCreateNewChat, 
  loading, 
  error 
}) => {
  return (
    <div className="sidebar p-3" style={{ width: '250px', borderRight: '1px solid #dee2e6' }}>
      <Button 
        variant="primary" 
        className="w-100 mb-3" 
        onClick={onCreateNewChat}
      >
        Nowy Chat
      </Button>
      
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" size="sm" />
        </div>
      )}

      <ListGroup>
        {chats.map((chat) => (
          <ListGroup.Item
            key={chat.id}
            active={currentChatId === chat.id}
            onClick={() => onSelectChat(chat.id)}
            style={{ cursor: 'pointer' }}
          >
            <div>{chat.name}</div>
            <small className="text-muted">
              {new Date(chat.timestamp).toLocaleString()}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {chats.length === 0 && !loading && (
        <p className="text-center text-muted mt-3">
          Brak dostępnych chatów
        </p>
      )}
    </div>
  );
};

export default Sidebar;