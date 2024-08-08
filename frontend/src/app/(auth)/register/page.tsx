'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { signUp } from '@/lib/firebase/auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      // No need to call backend login endpoint
      router.push('/chat');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create an account. Please try again.');
      }
    }
  };

  return (
    <div className="bg-primary p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-heading font-bold mb-6 text-text-dark">Create an Account</h1>
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
          Register
        </Button>
      </form>
      <p className="mt-4 text-sm text-text-dark text-center">
        Already have an account? <Link href="/login" className="text-secondary hover:underline">Log in here</Link>
      </p>
    </div>
  );
}