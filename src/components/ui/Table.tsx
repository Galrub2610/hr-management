import React from 'react';
import classNames from 'classnames';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { DEFAULT_SORT } from '../../config/constants';

export interface Column<T> {
  key: string;
  header?: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  getValue?: (item: T) => string | number | null;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T) => string | number;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  rowClassName?: string | ((item: T) => string);
  className?: string;
  stickyHeader?: boolean;
  compact?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

export function Table<T extends Record<string, any>>({
  data = [],
  columns,
  keyExtractor = (item: T) => item.id || Math.random().toString(),
  loading = false,
  error,
  emptyMessage = 'אין נתונים להצגה',
  sortColumn,
  sortDirection = 'asc',
  onSort,
  rowClassName,
  className,
  stickyHeader = false,
  compact = false,
  striped = true,
  hoverable = true,
  bordered = false,
}: TableProps<T>) {
  const tableClasses = classNames(
    'min-w-full divide-y divide-gray-200',
    {
      'border border-gray-200': bordered
    },
    className
  );

  const headerClasses = classNames(
    'text-right text-sm font-medium text-gray-500 tracking-wider px-6 py-3',
    {
      'sticky top-0 bg-white shadow-sm z-10': stickyHeader
    }
  );

  const cellClasses = classNames(
    'whitespace-nowrap text-sm text-gray-900',
    {
      'px-6 py-4': !compact,
      'px-4 py-2': compact
    }
  );

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    const isActive = sortColumn === column.key;
    const Icon = isActive && sortDirection === 'desc' ? ChevronDownIcon : ChevronUpIcon;

    return (
      <Icon
        className={classNames(
          'mr-2 h-4 w-4 inline-block transition-colors',
          {
            'text-gray-900': isActive,
            'text-gray-400': !isActive
          }
        )}
      />
    );
  };

  const handleHeaderClick = (column: Column<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  // מיון ברירת מחדל לפי א-ב
  const sortedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return [...data].sort((a: T, b: T) => {
      try {
        // אם יש עמודה ממוינת, נשתמש בה
        if (sortColumn && sortDirection) {
          const column = columns.find(col => col.key === sortColumn);
          if (column) {
            const aValue = column.getValue ? column.getValue(a) : a[column.key];
            const bValue = column.getValue ? column.getValue(b) : b[column.key];
            
            // אם אחד הערכים הוא null או undefined, נשים אותו בסוף
            if (aValue == null) return 1;
            if (bValue == null) return -1;
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sortDirection === 'asc' 
                ? aValue.localeCompare(bValue, DEFAULT_SORT.LOCALE, DEFAULT_SORT.LOCALE_OPTIONS)
                : bValue.localeCompare(aValue, DEFAULT_SORT.LOCALE, DEFAULT_SORT.LOCALE_OPTIONS);
            }
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
              return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
          }
        }
        
        // אחרת, נמיין לפי העמודה הראשונה שניתנת למיון
        const firstSortableColumn = columns.find(col => col.sortable);
        if (firstSortableColumn) {
          const aValue = firstSortableColumn.getValue ? firstSortableColumn.getValue(a) : a[firstSortableColumn.key];
          const bValue = firstSortableColumn.getValue ? firstSortableColumn.getValue(b) : b[firstSortableColumn.key];
          
          // אם אחד הערכים הוא null או undefined, נשים אותו בסוף
          if (aValue == null) return 1;
          if (bValue == null) return -1;
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue, DEFAULT_SORT.LOCALE, DEFAULT_SORT.LOCALE_OPTIONS);
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return aValue - bValue;
          }
        }
      } catch (error) {
        console.error('Error sorting data:', error);
      }
      
      return 0;
    });
  }, [data, columns, sortColumn, sortDirection]);

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={classNames(
                  headerClasses,
                  {
                    'cursor-pointer hover:bg-gray-100': column.sortable
                  },
                  column.headerClassName
                )}
                onClick={() => handleHeaderClick(column)}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>{column.header || column.key}</span>
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={classNames(
                  {
                    'hover:bg-gray-50': hoverable,
                    'even:bg-gray-50': striped
                  },
                  typeof rowClassName === 'function' ? rowClassName(item) : rowClassName
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={classNames(cellClasses, column.className)}
                  >
                    {column.render
                      ? column.render(item)
                      : item[column.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 