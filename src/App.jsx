import React, { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Catalog from './components/Catalog'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('catalog')

  return (
    <div className="app">
      {currentView === 'catalog' ? (
        <Catalog onNavigateToAdmin={() => setCurrentView('admin')} />
      ) : (
        <>
          <Header onNavigateToCatalog={() => setCurrentView('catalog')} /> 
          <Dashboard />
        </>
      )}
    </div>
  )
}

export default App
