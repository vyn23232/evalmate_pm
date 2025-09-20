import React from 'react';
import './Card.css';

function Card({
  children,
  title,
  subtitle,
  header,
  footer,
  variant = 'default',
  size = 'default',
  interactive = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const cardClass = [
    'card',
    variant !== 'default' && `card--${variant}`,
    size === 'compact' && 'card--compact',
    size === 'full-bleed' && 'card--full-bleed',
    interactive && 'card--interactive',
    loading && 'card--loading',
    (!header && !title && !footer) && 'card--simple',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClass}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {(header || title || subtitle) && (
        <div className="card__header">
          {header || (
            <>
              {title && <h3 className="card__title">{title}</h3>}
              {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}
      
      <div className="card__body">
        {children}
      </div>
      
      {footer && (
        <div className="card__footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;