import React from 'react'
import StatsGrid from './StatsGrid'
import ProductTable from './ProductTable'
import './Dashboard.css'

function Dashboard() {
  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Panel de Productos</h1>
          <p>Gestiona tu inventario, precios y existencias en tiempo real.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generar PDF
          </button>
          <button className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Registrar un producto
          </button>
        </div>
      </div>
      <StatsGrid />
      <ProductTable />
    </main>
  )
}

export default Dashboard
