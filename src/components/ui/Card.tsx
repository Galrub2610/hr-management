// src/components/ui/Card.tsx
import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  noPadding?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  actions,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  noPadding = false,
  bordered = true,
  hoverable = false,
  onClick
}) => {
  const cardClasses = cn(
    'bg-white rounded-lg overflow-hidden',
    {
      'border border-gray-200': bordered,
      'hover:shadow-lg transition-shadow duration-200 cursor-pointer': hoverable || onClick,
      'shadow-sm': !hoverable
    },
    className
  );

  const headerClasses = cn(
    'px-6 py-4',
    {
      'border-b border-gray-200': bordered
    },
    headerClassName
  );

  const contentClasses = cn(
    {
      'px-6 py-4': !noPadding
    },
    contentClassName
  );

  const footerClasses = cn(
    'px-6 py-4 bg-gray-50',
    {
      'border-t border-gray-200': bordered
    },
    footerClassName
  );

  const renderHeader = () => {
    if (!title && !subtitle && !actions) return null;

    return (
      <div className={headerClasses}>
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!children) return null;

    return (
      <div className={contentClasses}>
        {children}
      </div>
    );
  };

  const renderFooter = () => {
    if (!footer) return null;

    return (
      <div className={footerClasses}>
        {footer}
      </div>
    );
  };

  const cardContent = (
    <>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(cardClasses, 'w-full text-right')}
        onClick={onClick}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
};

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
    type: 'increase' | 'decrease';
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className
}) => {
  const trendColor = trend
    ? trend.type === 'increase'
      ? 'text-green-600'
      : 'text-red-600'
    : '';

  return (
    <Card
      className={cn('h-full', className)}
      noPadding
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {title}
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {value}
            </p>
          </div>
          {icon && (
            <div className="p-3 bg-primary-50 rounded-full">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-4">
          {trend && (
            <div className="flex items-center text-sm">
              <span className={cn('font-medium', trendColor)}>
                {trend.value}%
              </span>
              <span className="mr-2 text-gray-500">
                {trend.label}
              </span>
            </div>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
