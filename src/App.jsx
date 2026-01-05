import React, { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Catalog from './components/Catalog'
import Compra from './components/Compra'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('catalog');

  // Nueva vista: 'compra'
  return (
    <div className="app">
      {currentView === 'catalog' && (
        <Catalog 
          onNavigateToAdmin={() => setCurrentView('admin')} 
          onComprar={() => setCurrentView('compra')}
        />
      )}
      {currentView === 'admin' && (
        <>
          <Header onNavigateToCatalog={() => setCurrentView('catalog')} />
          <Dashboard />
        </>
      )}
      {currentView === 'compra' && (
        <Compra />
      )}
    </div>
  );
}

export default App
