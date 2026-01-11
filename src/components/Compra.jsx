import React, { useState } from 'react';
import './Compra.css';

const productoDemo = {
  name: "Beckham Hotel Collection Bed Pillows Standard/Queen Size Set of 2",
  description: "Luxury gel pillows, Queen size, soft support for back, side, or stomach sleepers. Designed with advanced cooling technology and hypoallergenic materials for a restful and uninterrupted sleep.",
  price: 10.00,
  discount: 20,
  stock: 0, // Number of units available
  label: {
    text: "NEW",
    bgColor: "#00C853", // green
    textColor: "#FFFFFF"
  },
  image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
  thumbnails: [
    "https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg",
    "https://images.pexels.com/photos/2040907/pexels-photo-2040907.jpeg",
    "https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg"
  ],
  category: "Bedroom",
  details: {
    unit: "Set of 2",
    material: "Gel Fiber",
    color: "Pure White",
    size: "Standard/Queen Size",
    firmness: "Soft-Medium",
    technology: "Advanced Cooling",
    hygiene: "Hypoallergenic and dust mite resistant",
    washing: "Machine washable"
  }
}


const Compra = () => {
  const [cantidad, setCantidad] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imgActual, setImgActual] = useState(0);

  // Calcular precio con descuento
  const hasDiscount = productoDemo.discount && productoDemo.discount > 0;
  const originalPrice = productoDemo.price;
  const finalPrice = hasDiscount
    ? +(originalPrice * (1 - productoDemo.discount / 100)).toFixed(2)
    : originalPrice;

  // Modal: la imagen principal es la posición 0, luego las miniaturas
  const modalImages = [productoDemo.image, ...productoDemo.thumbnails];
  const openModal = (idx) => {
    setImgActual(idx);
    setModalAbierto(true);
  };
  const closeModal = () => setModalAbierto(false);
  const nextImg = () => setImgActual((imgActual + 1) % modalImages.length);
  const prevImg = () => setImgActual((imgActual - 1 + modalImages.length) % modalImages.length);

  return (
    <div className="compra-ecommerce">
      <nav className="compra-breadcrumbs">
        <span>Inicio</span> <span className="sep">›</span> <span>Hogar</span> <span className="sep">›</span> <span className="actual">Dormitorio</span>
      </nav>
      <div className="compra-main">
        <div className="compra-gallery">
          <div className="compra-img-main" onClick={() => openModal(0)} style={{cursor:'zoom-in'}}>
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
            <img src={productoDemo.image} alt={productoDemo.name} />
          </div>
          <div className="compra-thumbs">
            {productoDemo.thumbnails.map((src, idx) => (
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
            <button onClick={() => setCantidad(c => c + 1)} disabled={productoDemo.stock <= 0}>+</button>
          </div>
          {productoDemo.stock <= 0 ? (
            <div className="agotado-msg">OUT OF STOCK</div>
          ) : (
            <button className="compra-whatsapp-btn">
              ORDER VIA WHATSAPP
            </button>
          )}
        </div>
        <div className="compra-info">
          <h1 className="compra-title">{productoDemo.name}</h1>
          {/* Rating and reviews removed */}
          <div className="compra-precio-box">
            {hasDiscount && (
              <span className="compra-precio-original">${originalPrice.toFixed(2)}</span>
            )}
            <span className="compra-precio">${finalPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="compra-descuento">-{productoDemo.discount}% OFF</span>
            )}
          </div>
          <div className="compra-stock">
            {productoDemo.stock <= 0 ? (
              <span className="agotado">OUT OF STOCK / 0 AVAILABLE</span>
            ) : (
              <span className="disponible">{productoDemo.stock} AVAILABLE</span>
            )}
          </div>
          <p className="compra-descripcion">{productoDemo.description}</p>
          <div className="compra-detalles-grid">
            {Object.entries(productoDemo.details).map(([key, value]) => (
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
