import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary p-4">
        <div className="container mx-auto">
          <Link href="/" className="text-2xl font-heading font-bold text-text-dark hover:text-secondary transition-colors">
            Linkaura
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      <footer className="bg-primary p-4 text-center text-text-dark">
        <p>&copy; {new Date().getFullYear()} Linkaura. All rights reserved.</p>
      </footer>
    </div>
  );
}