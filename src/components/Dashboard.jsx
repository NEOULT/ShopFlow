import React, { useState } from 'react'
import StatsGrid from './StatsGrid'
import ProductTable from './ProductTable'
import './Dashboard.css'
import Sidebar from './Sidebar'
import './Sidebar.css'

function Dashboard({ sidebarOpen = true }) {
  const [section, setSection] = useState('inicio');

  return (
    <main className="dashboard admin-layout">
      <Sidebar currentSection={section} onChange={setSection} open={sidebarOpen} />
      <div className="admin-content">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>{section === 'inicio' ? 'Panel de Productos' : 'Categorías'}</h1>
          {section === 'inicio' && (
            <p>Gestiona tu inventario, precios y existencias en tiempo real.</p>
          )}
          {section === 'categorias' && (
            <p>Administra categorías, etiquetas y colecciones.</p>
          )}
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
      {section === 'inicio' && (
        <>
          <StatsGrid />
          <ProductTable />
        </>
      )}
      {section === 'categorias' && (
        <div style={{background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:16}}>
          <h2 style={{marginTop:0}}>Gestión de categorías</h2>
          <p style={{color:'#64748b'}}>Aquí podrás crear, editar y organizar categorías. (Vista en construcción)</p>
        </div>
      )}
      </div>
    </main>
  )
}

export default Dashboard
