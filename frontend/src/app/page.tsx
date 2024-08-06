import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary">
      <h1 className="text-4xl font-bold mb-8 font-heading text-text-dark">Welcome to Linkaura</h1>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-secondary text-text-light rounded hover:bg-opacity-90 transition-colors">Login</Link>
        <Link href="/register" className="px-4 py-2 bg-accent text-text-light rounded hover:bg-opacity-90 transition-colors">Register</Link>
      </div>
    </main>
  )
}