'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="main-wrapper">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="dashboard-content">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
