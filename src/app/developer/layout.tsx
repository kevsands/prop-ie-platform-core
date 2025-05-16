'use client';

/**
 * Simplified Developer Layout for Build Testing
 */
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface DeveloperLayoutProps {
  children: ReactNode;
}

export default function DeveloperLayout({ children }: DeveloperLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Simplified sidebar */}
      <div className="w-64 h-full bg-white border-r hidden md:block">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Developer Portal</h2>
          <p className="text-sm text-gray-500">Property management platform</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/developer" className={`flex items-center p-2 rounded-md ${pathname === '/developer' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
                <span className="mr-3">🏠</span>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/developer/developments" className={`flex items-center p-2 rounded-md ${pathname === '/developer/developments' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
                <span className="mr-3">🏗️</span>
                <span>Developments</span>
              </a>
            </li>
            <li>
              <a href="/developer/documents" className={`flex items-center p-2 rounded-md ${pathname === '/developer/documents' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
                <span className="mr-3">📄</span>
                <span>Documents</span>
              </a>
            </li>
            <li>
              <a href="/developer/htb" className={`flex items-center p-2 rounded-md ${pathname.startsWith('/developer/htb') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
                <span className="mr-3">💰</span>
                <span>Help-to-Buy</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-4 mt-8">
          <div className="bg-amber-100 p-3 rounded-md text-amber-800 text-sm">
            Temporarily simplified sidebar for build testing
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Simple header */}
        <header className="flex items-center justify-between border-b h-16 px-4">
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
            ≡ Menu
          </button>
          <div className="flex items-center gap-4">
            <span className="font-medium">Developer User</span>
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}