import { motion } from "framer-motion";
import React from "react";

const Card = React.memo(function Card({ children, className = "", hover = false, ...props }) {
  return (
    <motion.div
      {...(hover && { whileHover: { y: -2 } })}
      className={`bg-surface border border-border rounded-xl shadow-sm transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
});

const CardHeader = React.memo(function CardHeader({ children, className = "", ...props }) {
  return <div className={`p-5 pb-0 ${className}`} {...props}>{children}</div>;
});

const CardTitle = React.memo(function CardTitle({ children, className = "", ...props }) {
  return <h3 className={`text-lg font-semibold text-text tracking-tight ${className}`} {...props}>{children}</h3>;
});

const CardDescription = React.memo(function CardDescription({ children, className = "", ...props }) {
  return <p className={`text-xs text-muted leading-relaxed mt-1 ${className}`} {...props}>{children}</p>;
});

const CardBody = React.memo(function CardBody({ children, className = "", ...props }) {
  return <div className={`p-5 ${className}`} {...props}>{children}</div>;
});

const CardFooter = React.memo(function CardFooter({ children, className = "", ...props }) {
  return <div className={`p-5 pt-0 border-t border-border flex items-center justify-between ${className}`} {...props}>{children}</div>;
});

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
export default Card;
