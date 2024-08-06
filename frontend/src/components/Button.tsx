import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded font-semibold transition-colors";
  const variantStyles = {
    primary: "bg-primary text-text-dark hover:bg-opacity-90",
    secondary: "bg-secondary text-text-light hover:bg-opacity-90",
    accent: "bg-accent text-text-light hover:bg-opacity-90"
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;