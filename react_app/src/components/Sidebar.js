import React from 'react';
import { ListGroup, Button, Spinner } from 'react-bootstrap';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  // Parse timestamp from format "YYYYMMDDHHmmss"
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(8, 10);
  const minute = timestamp.slice(10, 12);
  const second = timestamp.slice(12, 14);

  // Create date string in local format
  const date = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}`
  );

  return date.toLocaleString();
};

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
              {formatTimestamp(chat.timestamp)}
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