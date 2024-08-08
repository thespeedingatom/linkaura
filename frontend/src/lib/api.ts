import { getIdToken } from './firebase/auth';
import { Message } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getIdToken();
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}

export const api = {
  getUser: async () => {
    return fetchWithAuth('/user');
  },
  getRoomData: async (roomId: string) => {
    return fetchWithAuth(`/chat/room/${roomId}`);
  },
  sendMessage: async (roomId: string, content: string): Promise<Message> => {
    return fetchWithAuth(`/chat/room/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  getRooms: async (): Promise<ChatRoom[]> => {
    return fetchWithAuth('/rooms');
  },
  createRoom: async (name: string): Promise<ChatRoom> => {
    return fetchWithAuth('/create_room', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
};

export const { getUser, getRoomData, sendMessage } = api;