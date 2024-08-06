import React from 'react';

interface ChatMessageProps {
  user: string;
  message: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ user, message }) => {
  return (
    <div className="mb-4">
      <span className="font-semibold text-secondary">{user}: </span>
      <span className="text-text-dark">{message}</span>
    </div>
  );
};

export default ChatMessage;