import React from 'react';
import './ProductCard.css';

const splitText = (text, maxLength, maxLines = 2) => {
  if (!text) return '';
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';
  for (let word of words) {
    if ((currentLine + ' ' + word).trim().length > maxLength) {
      lines.push(currentLine.trim());
      currentLine = word;
      if (lines.length === maxLines) break;
    } else {
      currentLine += ' ' + word;
    }
  }
  if (lines.length < maxLines && currentLine) lines.push(currentLine.trim());
  let result = lines.join('\n');
  if (lines.length === maxLines && words.join(' ').length > result.replace(/\n/g, ' ').length) {
    result = result.replace(/\n/g, '\n') + '...';
  }
  return result;
};

const ProductCard = ({ name, description, price, originalPrice, image, badge, badgeType, label, onComprar }) => {
  const nameDisplay = splitText(name, 40, 2); // 2 lines, 40 chars per line
  const descDisplay = splitText(description, 70, 2); // 2 lines, 70 chars per line

  const labelText = label?.label_te ?? label?.text;
  const labelBg = label?.label_bg ?? label?.bg;
  const labelColor = label?.label_tc ?? label?.color;

  return (
    <div className="product-card">
      {labelText ? (
        <span
          className="product-badge"
          style={labelBg || labelColor ? { background: labelBg, color: labelColor } : undefined}
        >
          {labelText}
        </span>
      ) : badge ? (
        <span className={`product-badge ${badgeType}`}>{badge}</span>
      ) : null}
      <div className="product-image">
        <img src={image} alt={name} loading="lazy" />
      </div>
      <div className="product-info">
        <h3 className="product-name">
          {nameDisplay.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h3>
        <p className="product-description">
          {descDisplay.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>
        <div className="product-actions">
          <div className="product-pricing">
            <span className="product-price">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="product-original-price">${originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="add-to-cart-btn" onClick={onComprar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            AÑADIR
          </button>
        </div>
        <button className="more-info-btn">MÁS INFORMACIÓN</button>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
