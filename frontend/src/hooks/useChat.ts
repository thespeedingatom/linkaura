// src/hooks/useChat.ts
import { useState, useEffect } from 'react';
import { Message, User } from '@/types';
import { api } from '@/lib/api';

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoomData() {
      try {
        setIsLoading(true);
        const data = await api.getRoomData(roomId);
        setMessages(data.messages);
        setUsers(data.users);
      } catch (err) {
        setError('Failed to fetch room data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoomData();
  }, [roomId]);

  const sendMessage = async (content: string, id: any) => {
    try {
      const newMessage = await api.sendMessage(roomId, content);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      return newMessage;
    } catch (err) {
      setError('Failed to send message');
      throw err; // Re-throw the error so the component can handle it if needed
    }
  };

  return { messages, sendMessage, users, error, isLoading };
}