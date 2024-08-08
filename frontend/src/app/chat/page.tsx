'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { api } from '@/lib/api';
import { Message, User } from '@/types/index';
import ChatRoomClient from '@/components/ChatRoomClient';
import UserList from '@/components/UserList';

interface ChatRoom {
  id: string;
  name: string;
  participantsCount: number;
}

const ChatHomePage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const { messages, sendMessage, users, error, isLoading } = useChat(selectedRoomId as string);

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      const fetchedRooms = await api.getRooms();
      setRooms(fetchedRooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      // Consider using a toast notification here
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      setIsCreatingRoom(true);
      try {
        const newRoom = await api.createRoom(newRoomName);
        setRooms([...rooms, newRoom]);
        setNewRoomName('');
        setSelectedRoomId(newRoom.id);
      } catch (error) {
        console.error('Failed to create room:', error);
        // Consider using a toast notification here
      } finally {
        setIsCreatingRoom(false);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-4">Please log in to access chat rooms.</p>
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-screen flex">
      <div className="w-1/3 pr-4">
        <h1 className="text-3xl font-bold mb-6">Linkaura Chat</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create a New Room</h2>
          <form onSubmit={handleCreateRoom} className="flex gap-2">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name"
              className="flex-grow px-3 py-2 border rounded"
            />
            <button
              type="submit"
              disabled={isCreatingRoom}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            >
              {isCreatingRoom ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
          {rooms.length > 0 ? (
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li 
                  key={room.id} 
                  className={`bg-white p-4 rounded shadow cursor-pointer ${selectedRoomId === room.id ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  {room.name}
                  <span className="ml-2 text-gray-500">({room.participantsCount} participants)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rooms available. Create one to get started!</p>
          )}
        </div>
      </div>
      
      <div className="w-2/3 pl-4 border-l">
        {selectedRoomId ? (
          <ChatRoomClient
            roomId={selectedRoomId}
            messages={messages}
            sendMessage={sendMessage}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>Select a room to start chatting</p>
          </div>
        )}
      </div>
      
      {selectedRoomId && (
        <div className="w-1/4 pl-4 border-l">
          <UserList users={users} />
        </div>
      )}
    </div>
  );
};

export default ChatHomePage;