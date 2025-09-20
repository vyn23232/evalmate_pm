import React from 'react';
import './Button.css';

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  iconOnly = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const buttonClass = [
    'button',
    `button--${variant}`,
    size === 'small' && 'button--small',
    size === 'large' && 'button--large',
    fullWidth && 'button--full-width',
    iconOnly && 'button--icon-only',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="button__loading-spinner" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;