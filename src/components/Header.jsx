import React from 'react'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#3b82f6"/>
            <rect x="6" y="6" width="12" height="12" rx="1" fill="white"/>
            <rect x="8" y="8" width="8" height="8" rx="1" fill="#3b82f6"/>
          </svg>
          <div className="logo-text">
            <div className="site-name">arepa.rdi.store</div>
            <div className="site-subtitle">Panel de Administración</div>
          </div>
        </div>
      </div>
      <div className="header-right">
        <button className="notification-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="user-info">
          <div className="user-details">
            <div className="user-name">JUAN ANGEL CAMARILLO ...</div>
            <div className="user-role">Administrador</div>
          </div>
          <div className="user-avatar">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face" alt="Usuario" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
