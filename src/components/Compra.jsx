import React, { useState } from 'react';
import './Compra.css';

const productoDemo = {
  nombre: 'Beckham Hotel Collection Bed Pillows Standard/Queen Size Set of 2',
  descripcion: 'Almohadas de gel de lujo, tamaño Queen, soporte suave para dormir boca arriba, de lado o boca abajo. Diseñadas con tecnología de enfriamiento avanzada y materiales hipoalergénicos para un descanso reparador y libre de interrupciones.',
  precio: 10.00,
  descuento: 20,
  agotado: false,
  imagen: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
  miniaturas: [
    'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg',
    'https://images.pexels.com/photos/2040907/pexels-photo-2040907.jpeg',
    'https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg'
  ],
  categoria: 'Dormitorio',
  details: {
    unidad: 'Set de 2Set de 2Set de 2Set de 2Set de 2Set de 2Set de 2Set de 2Set de 2Set de 2Set de 2Set de 2',
    material: 'Gel Fibra',
    color: 'Blanco Puro',
    tamaño: 'Standard/Queen Size',
    unidad2: 'Set de 2',
    material2: 'Gel Fibra',
    color2: 'Blanco Puro',
    tamaño2: 'Standard/Queen Size',
    material3: 'Gel Fibra',
    color3: 'Blanco Puro',
    tamaño3: 'Standard/Queen Size',
    material4: 'Gel Fibra',
    color4: 'Blanco Puro',
    tamaño4: 'Standard/Queen Size',
  }
};

const Compra = () => {
  const [cantidad, setCantidad] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imgActual, setImgActual] = useState(0);

  // Calcular precio con descuento
  const tieneDescuento = productoDemo.descuento && productoDemo.descuento > 0;
  const precioOriginal = productoDemo.precio;
  const precioFinal = tieneDescuento
    ? +(precioOriginal * (1 - productoDemo.descuento / 100)).toFixed(2)
    : precioOriginal;

  // Modal: la imagen principal es la posición 0, luego las miniaturas
  const imagenesModal = [productoDemo.imagen, ...productoDemo.miniaturas];
  const abrirModal = (idx) => {
    setImgActual(idx);
    setModalAbierto(true);
  };
  const cerrarModal = () => setModalAbierto(false);
  const siguienteImg = () => setImgActual((imgActual + 1) % imagenesModal.length);
  const anteriorImg = () => setImgActual((imgActual - 1 + imagenesModal.length) % imagenesModal.length);

  return (
    <div className="compra-ecommerce">
      <nav className="compra-breadcrumbs">
        <span>Inicio</span> <span className="sep">›</span> <span>Hogar</span> <span className="sep">›</span> <span className="actual">Dormitorio</span>
      </nav>
      <div className="compra-main">
        <div className="compra-gallery">
          <div className="compra-img-main" onClick={() => abrirModal(0)} style={{cursor:'zoom-in'}}>
            <span className="compra-badge-nuevo">NUEVO</span>
            <img src={productoDemo.imagen} alt={productoDemo.nombre} />
          </div>
          <div className="compra-thumbs">
            {productoDemo.miniaturas.map((src, idx) => (
              <img key={idx} src={src} alt={`thumb${idx+1}`} style={{cursor:'zoom-in'}} onClick={() => abrirModal(idx+1)} />
            ))}
          </div>

          {/* Modal de galería de imágenes */}
          {modalAbierto && (
            <div className="modal-galeria" onClick={cerrarModal}>
              <div className="modal-galeria-botones">
                <button className="modal-cerrar" onClick={cerrarModal}>&times;</button>
                <button className="modal-anterior" onClick={anteriorImg}>&lt;</button>
                <button className="modal-siguiente" onClick={siguienteImg}>&gt;</button>
              </div>
              <div className="modal-galeria-contenido" onClick={e => e.stopPropagation()}>
                <img src={imagenesModal[imgActual]} alt={`img${imgActual+1}`} className="modal-img" />
              </div>
            </div>
          )}

          {/* Selector de cantidad y botón WhatsApp debajo de la galería */}
          <div className="compra-cantidad-box compra-cantidad-center">
            <button onClick={() => setCantidad(c => Math.max(0, c - 1))} disabled={cantidad === 0}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => setCantidad(c => c + 1)} disabled={productoDemo.agotado}>+</button>
          </div>
          {productoDemo.agotado ? (
            <div className="agotado-msg">AGOTADO</div>
          ) : (
            <button className="compra-whatsapp-btn">
              PEDIR POR WHATSAPP
            </button>
          )}
        </div>
        <div className="compra-info">
          <span className="compra-coleccion">BECKHAM HOTEL COLLECTION</span>
          <h1 className="compra-title">{productoDemo.nombre}</h1>
          {/* Calificación y reseñas eliminadas */}
          <div className="compra-precio-box">
            {tieneDescuento && (
              <span className="compra-precio-original">${precioOriginal.toFixed(2)}</span>
            )}
            <span className="compra-precio">${precioFinal.toFixed(2)}</span>
            {tieneDescuento && (
              <span className="compra-descuento">-{productoDemo.descuento}% DCTO</span>
            )}
          </div>
          <div className="compra-stock">
            <span className="agotado">AGOTADO / 0 UNIDADES DISPONIBLES</span>
          </div>
          <p className="compra-descripcion">{productoDemo.descripcion}</p>
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
