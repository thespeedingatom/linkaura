import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChatRoomClient from './ChatRoomClient';
import { getRoomData } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { roomId: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const roomData = await getRoomData(params.roomId);
  if (!roomData) return { title: 'Room Not Found' };
  return { title: `Chat Room: ${roomData.name}` };
}

async function ChatRoomPage({ params }: PageProps) {
  const roomData = await getRoomData(params.roomId);

  if (!roomData) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold">Chat Room: {roomData.name}</h1>
      </header>
      <ChatRoomClient roomId={params.roomId} initialData={roomData} />
    </div>
  );
}

export default ChatRoomPage;