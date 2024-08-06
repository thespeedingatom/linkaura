'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { signIn } from '@/lib/firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/chat');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="bg-primary p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-heading font-bold mb-6 text-text-dark">Login to Linkaura</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <Button type="submit" variant="secondary" className="w-full">
          Log In
        </Button>
      </form>
      <p className="mt-4 text-sm text-text-dark text-center">
        Don't have an account? <Link href="/register" className="text-secondary hover:underline">Register here</Link>
      </p>
    </div>
  );
}