

import React, { useState, useEffect } from 'react';
import './Compra.css';
import { useParams } from 'react-router-dom';
import { productsService } from '../services/products.service';
 
const phone = import.meta.env.VITE_PHONE_NUMBER;

const Compra = () => {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imgActual, setImgActual] = useState(0);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    productsService.get(id)
      .then(data => setProducto(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Mapeo correcto de los campos del producto
  const productoDemo = producto ? {
    name: producto.product_na || producto.name || "Producto de ejemplo",
    description: producto.product_de || producto.description || "Sin descripción",
    price: typeof producto.product_pr === 'number' ? producto.product_pr : (Number(producto.product_pr) || producto.price || 0),
    discount: typeof producto.product_di === 'number' ? producto.product_di : (Number(producto.product_di) || producto.discount || 0),
    stock: typeof producto.product_st === 'number' ? producto.product_st : (Number(producto.product_st) ?? producto.stock ?? 0),
    label: producto.product_label && (producto.product_label.label_te || producto.product_label.text) ? {
      text: producto.product_label.label_te || producto.product_label.text,
      bgColor: producto.product_label.label_bg || producto.product_label.bg || '#000',
      textColor: producto.product_label.label_tc || producto.product_label.color || '#fff'
    } : undefined,
    image: producto.product_im || producto.image || '',
    thumbnails: Array.isArray(producto.product_th) ? producto.product_th.filter(Boolean) : (producto.thumbnails ? producto.thumbnails.filter(Boolean) : []),
    category: producto.product_ca?.name || producto.category || '',
    details: (producto.product_de_obj && typeof producto.product_de_obj === 'object' && !Array.isArray(producto.product_de_obj)) ? producto.product_de_obj : (producto.details || {}),
  } : {
    name: "Producto de ejemplo",
    description: "Sin descripción",
    price: 0,
    discount: 0,
    stock: 0,
    label: undefined,
    image: '',
    thumbnails: [],
    category: '',
    details: {},
  };

  // Calcular precio con descuento
  const hasDiscount = Boolean(productoDemo.discount && productoDemo.discount > 0);
  console.log("aña",hasDiscount);
  
  const originalPrice = productoDemo.price;
  const finalPrice = hasDiscount
    ? +(originalPrice * (1 - productoDemo.discount / 100)).toFixed(2)
    : originalPrice;

  // Modal: la imagen principal es la posición 0, luego las miniaturas
  const modalImages = [productoDemo.image, ...(productoDemo.thumbnails || [])];
  const openModal = (idx) => {
    setImgActual(idx);
    setModalAbierto(true);
  };
  const closeModal = () => setModalAbierto(false);
  const nextImg = () => setImgActual((imgActual + 1) % modalImages.length);
  const prevImg = () => setImgActual((imgActual - 1 + modalImages.length) % modalImages.length);


  if (loading) {
    return <div className="compra-ecommerce"><div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Cargando producto...</div></div>;
  }
  if (error || !producto) {
    return <div className="compra-ecommerce"><div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>No se pudo cargar el producto.</div></div>;
  }

  return (
    <div className="compra-ecommerce">
      <nav className="compra-breadcrumbs" style={{display:'flex',alignItems:'center',gap:8}}>
        <button onClick={() => window.history.back()} style={{background:'none',border:'none',cursor:'pointer',padding:0,marginRight:8}} title="Volver">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#64748b" strokeWidth="2"><path d="M13 17l-5-5 5-5"/></svg>
        </button>
        <span>Inicio</span> <span className="sep">›</span> <span className="actual">{productoDemo.name}</span>
      </nav>
      <div className="compra-main">
        <div className="compra-gallery">
          <div className="compra-img-main" onClick={() => openModal(0)} style={{cursor:'zoom-in'}}>
            {productoDemo.label && (
              <span
                className="compra-badge-nuevo"
                style={{
                  backgroundColor: productoDemo.label.bgColor,
                  color: productoDemo.label.textColor,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '0.9em',
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 2
                }}
              >
                {productoDemo.label.text}
              </span>
            )}
            <img src={productoDemo.image} alt={productoDemo.name} />
          </div>
          <div className="compra-thumbs">
            {(productoDemo.thumbnails || []).map((src, idx) => (
              <img key={idx} src={src} alt={`thumb${idx+1}`} style={{cursor:'zoom-in'}} onClick={() => openModal(idx+1)} />
            ))}
          </div>

          {/* Modal de galería de imágenes */}
          {modalAbierto && (
            <div className="modal-galeria">
              <div className="modal-galeria-contenido" onClick={e => e.stopPropagation()}>
                <button className="modal-cerrar" onClick={closeModal}>&times;</button>
                <img src={modalImages[imgActual]} alt={`img${imgActual+1}`} className="modal-img" />
                <div className="modal-controles">
                  <button className="modal-anterior" onClick={prevImg}>&lt;</button>
                  <button className="modal-siguiente" onClick={nextImg}>&gt;</button>
                </div>
              </div>
            </div>
          )}

          {/* Selector de cantidad y botón WhatsApp debajo de la galería */}
          <div className="compra-cantidad-box compra-cantidad-center">
            <button onClick={() => setCantidad(c => Math.max(0, c - 1))} disabled={cantidad === 0}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => setCantidad(c => Math.min(productoDemo.stock, cantidad + 1))} disabled={productoDemo.stock <= 0 || cantidad >= productoDemo.stock}>+</button>
          </div>
          {productoDemo.stock <= 0 ? (
            <div className="agotado-msg">OUT OF STOCK</div>
          ) : (
            <button
              className="compra-whatsapp-btn"
              onClick={() => {
                const baseUrl = `https://wa.me/${phone}`;                
                const url = window.location.origin + '/compra/' + id;
                const msg = `Hola, quiero comprar el producto: ${productoDemo.name} ${url}\nCantidad: ${cantidad > 0 ? cantidad : 1}`.replace(/\n/g, '%0A');
                window.open(`${baseUrl}?text=${msg}`, '_blank', 'noopener,noreferrer');
              }}
              type="button"
            >
              COMPRAR VIA WHATSAPP
            </button>
          )}
        </div>
        <div className="compra-info">
          <h1 className="compra-title">{productoDemo.name}</h1>
          {/* Rating and reviews removed */}
          <div className="compra-precio-box">
            {hasDiscount && (
              <span className="compra-precio-original">COP${originalPrice.toFixed(2)}</span>
            )}
            <span className="compra-precio">COP${finalPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="compra-descuento">-{productoDemo.discount}% OFF</span>
            )}
          </div>
          <div className="compra-stock">
            {productoDemo.stock <= 0 ? (
              <span className="agotado">OUT OF STOCK / 0 DISPONIBLES</span>
            ) : (
              <span className="disponible">{productoDemo.stock} DISPONIBLES</span>
            )}
          </div>
          <p className="compra-descripcion">{productoDemo.description}</p>
          <div className="compra-detalles-grid">
            {Object.entries(productoDemo.details || {}).map(([key, value]) => (
              <div key={key}>
                <span className="label">{key.toUpperCase()}</span>
                <span className="detail-value" title={value}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compra;
