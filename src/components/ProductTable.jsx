import React from 'react'
import './ProductTable.css'

function ProductTable() {
  const products = [
    {
      id: 1,
      name: 'Beckham Hotel Collection Bed Pillows Standard/Queen Size Set...',
      sku: 'BHC-001',
      category: 'Hogar y Cocina',
      subcategory: 'Ropa de cama',
      barcode: '888119078846',
      price: '10,00 $',
      stock: '1 unidad',
      stockStatus: 'low',
      updated: '24 Oct 2023',
      image: 'https://images.pexels.com/photos/6862450/pexels-photo-6862450.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      id: 2,
      name: "Nike Air Max 270 React Men's Running Shoes",
      sku: 'NIK-092',
      category: 'Ropa y Accesorios',
      subcategory: 'Calzado',
      barcode: '193154267891',
      price: '125,00 $',
      stock: '45 unidades',
      stockStatus: 'good',
      updated: '22 Oct 2023',
      image: 'https://images.pexels.com/photos/2404959/pexels-photo-2404959.png?auto=compress&cs=tinysrgb&h=350'
    },
    {
      id: 3,
      name: 'Apple Watch Series 7 GPS, 41mm Midnight Aluminum Case',
      sku: 'APL-W07',
      category: 'Electrónica',
      subcategory: 'Wearables',
      barcode: '194252576123',
      price: '399,00 $',
      stock: '5 unidades',
      stockStatus: 'medium',
      updated: '20 Oct 2023',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&h=350'
    }
  ]

  const getStockBadge = (status, stock) => {
    switch (status) {
      case 'low':
        return <span className="stock-badge stock-badge--low">{stock}</span>
      case 'medium':
        return <span className="stock-badge stock-badge--medium">{stock}</span>
      case 'good':
        return <span className="stock-badge stock-badge--good">{stock}</span>
      default:
        return <span className="stock-badge">{stock}</span>
    }
  }

  return (
    <div className="product-table-container">
      <div className="table-controls">
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          <input type="text" placeholder="Buscar por nombre, código de barras o SKU" />
        </div>
        <div className="filter-controls">
          <select className="category-filter">
            <option>Categoría</option>
            <option>Hogar y Cocina</option>
            <option>Ropa y Accesorios</option>
            <option>Electrónica</option>
          </select>
          <button className="filters-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Filtros
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>PRODUCTO</th>
              <th>CATEGORÍA</th>
              <th>CÓDIGO DE BARRAS</th>
              <th>PRECIO</th>
              <th>EXISTENCIAS</th>
              <th>ACTUALIZADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <div className="product-name">{product.name}</div>
                      <div className="product-sku">SKU: {product.sku}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="category-info">
                    <div className="category-main">{product.category}</div>
                    <div className="category-sub">{product.subcategory}</div>
                  </div>
                </td>
                <td className="barcode">{product.barcode}</td>
                <td className="price">{product.price}</td>
                <td>{getStockBadge(product.stockStatus, product.stock)}</td>
                <td className="updated">{product.updated}</td>
                <td>
                  <div className="actions">
                    <button className="action-btn edit-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </button>
                    <button className="action-btn menu-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <circle cx="12" cy="5" r="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <circle cx="12" cy="19" r="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="results-info">
          Mostrando <strong>1 a 3</strong> de <strong>1245</strong> resultados
        </div>
        <div className="pagination">
          <button className="pagination-btn" disabled>Anterior</button>
          <button className="pagination-btn pagination-btn--active">Siguiente</button>
        </div>
      </div>
    </div>
  )
}

export default ProductTable
