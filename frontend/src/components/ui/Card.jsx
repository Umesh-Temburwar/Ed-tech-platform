import { motion } from "framer-motion";
import React from "react";

const Card = React.memo(function Card({ children, className = "", hover = false, ...props }) {
  return (
    <motion.div
      {...(hover && { whileHover: { y: -4, scale: 1.01 } })}
      className={`bg-white/[0.03] border border-white/[0.06] backdrop-blur-md rounded-2xl shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
});

const CardHeader = React.memo(function CardHeader({ children, className = "", ...props }) {
  return <div className={`p-6 pb-0 ${className}`} {...props}>{children}</div>;
});

const CardTitle = React.memo(function CardTitle({ children, className = "", ...props }) {
  return <h3 className={`text-xl font-semibold text-white ${className}`} {...props}>{children}</h3>;
});

const CardDescription = React.memo(function CardDescription({ children, className = "", ...props }) {
  return <p className={`text-gray-400 ${className}`} {...props}>{children}</p>;
});

const CardBody = React.memo(function CardBody({ children, className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>;
});

const CardFooter = React.memo(function CardFooter({ children, className = "", ...props }) {
  return <div className={`p-6 pt-0 border-t border-white/[0.06] ${className}`} {...props}>{children}</div>;
});

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
export default Card;
