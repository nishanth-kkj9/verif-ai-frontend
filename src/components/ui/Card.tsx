import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  bordered?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  bordered = true,
  hover = false,
  className,
  ...props
}) => {
  return (
    <div
      className={`
        rounded-xl bg-slate-800/40 backdrop-blur-sm
        ${bordered ? 'border border-slate-700/50' : ''}
        ${hover ? 'hover:border-slate-600/50 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer' : ''}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';

// Card subcomponents
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => (
  <div className={`p-4 border-b border-slate-700/30 ${className || ''}`} {...props}>
    {children}
  </div>
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className, ...props }) => (
  <div className={`p-4 ${className || ''}`} {...props}>
    {children}
  </div>
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => (
  <div className={`p-4 border-t border-slate-700/30 flex items-center justify-between ${className || ''}`} {...props}>
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';
