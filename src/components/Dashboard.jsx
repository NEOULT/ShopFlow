import React, { useState } from 'react'
import StatsGrid from './StatsGrid'
import ProductTable from './ProductTable'
import ProductCreate from './ProductCreate'
import './Dashboard.css'
import Sidebar from './Sidebar'
import './Sidebar.css'
import CategoriesManager from './CategoriesManager'
import LabelsManager from './LabelsManager'

function Dashboard({ sidebarOpen = true }) {
  const [section, setSection] = useState('inicio');

  return (
    <main className="dashboard admin-layout">
      <Sidebar currentSection={section} onChange={setSection} open={sidebarOpen} />
      <div className="admin-content">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>
              {section === 'inicio' && 'Panel de Productos'}
              {section === 'productos' && 'Crear Producto'}
              {section === 'categorias' && 'Categorías'}
              {section === 'etiquetas' && 'Etiquetas'}
            </h1>
            {section === 'inicio' && <p>Gestiona tu inventario, precios y existencias.</p>}
            {section === 'productos' && <p>Agrega un nuevo producto al catálogo.</p>}
            {section === 'categorias' && <p>Administra categorías del catálogo.</p>}
            {section === 'etiquetas' && <p>Administra las etiquetas visuales de productos.</p>}
          </div>
          {section === 'inicio' && (
            <div className="dashboard-actions">
              <button className="btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generar PDF
              </button>
            </div>
          )}
        </div>
        {section === 'inicio' && (
          <>
            <StatsGrid />
            <ProductTable />
          </>
        )}
        {section === 'productos' && <ProductCreate />}
        {section === 'categorias' && <CategoriesManager />}
        {section === 'etiquetas' && <LabelsManager />}
      </div>
    </main>
  )
}

export default Dashboard
