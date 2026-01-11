import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentSection, onChange, open = false }) => {
  const items = [
    { key: 'inicio', label: 'Inicio' },
    { key: 'categorias', label: 'Categorías' },
  ];

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-brand">Admin</div>
      <nav className="admin-nav">
        {items.map(item => (
          <button
            key={item.key}
            className={`admin-nav-item ${currentSection === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
