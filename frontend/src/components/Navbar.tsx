import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-secondary text-text-light p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold font-heading">Linkaura</Link>
        <div className="space-x-4">
          <Link href="/chat" className="hover:text-primary transition-colors">Chat</Link>
          <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
        </div>
      </div>
    </nav>
  )
}