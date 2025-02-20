// src/components/ui/Card.tsx
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={`bg-white shadow-md p-4 rounded-lg ${className}`}>{children}</div>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={`text-lg font-bold mb-2 ${className}`}>{children}</div>;
}
