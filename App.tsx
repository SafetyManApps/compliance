import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Documents } from './pages/Documents';
import { Suppliers } from './pages/Suppliers';
import { SupplierParts } from './pages/SupplierParts';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export type Page = 'dashboard' | 'products' | 'documents' | 'suppliers' | 'supplier-parts' | 'reports' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'documents':
        return <Documents />;
      case 'suppliers':
        return <Suppliers />;
      case 'supplier-parts':
        return <SupplierParts />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          currentPage={currentPage}
        />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;