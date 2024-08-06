import React, { useState } from 'react';
import Button from './Button';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the message to your backend
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary"
        placeholder="Type your message..."
      />
      <Button type="submit" variant="secondary" className="rounded-l-none">
        Send
      </Button>
    </form>
  );
};

export default ChatInput;