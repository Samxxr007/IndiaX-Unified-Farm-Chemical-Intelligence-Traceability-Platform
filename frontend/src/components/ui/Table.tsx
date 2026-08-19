import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, MoreVertical } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'danger';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  actions?: TableAction<T>[];
  onRowClick?: (item: T) => void;
  pageSize?: number;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  actions,
  onRowClick,
  pageSize = 10,
  emptyMessage = 'No records found',
  isLoading = false,
  className = '',
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleActionClick = (e: React.MouseEvent, action: TableAction<T>, item: T) => {
    e.stopPropagation();
    setActiveActionRow(null);
    action.onClick(item);
  };

  return (
    <div className={`w-full overflow-hidden rounded-md border border-border bg-white ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-text-primary">
          <thead className="bg-slate-50 text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{ width: col.width }}
                  className={`px-4 py-3 text-${col.align || 'left'} select-none`}
                >
                  <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end w-full' : ''}`}>
                    <span>{col.header}</span>
                    {col.sortable && <ChevronsUpDown className="w-3.5 h-3.5 text-text-muted" />}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right w-12">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Loading operational dataset...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-10 text-center text-text-secondary text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => {
                const rowKey = keyExtractor(item);
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors duration-100 ${
                      onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50/60'
                    } ${rowIdx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'}`}
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-4 py-3.5 text-${col.align || 'left'} text-sm text-text-primary align-middle`}
                      >
                        {col.render
                          ? col.render(item, rowIdx)
                          : typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : col.accessor
                          ? (item[col.accessor] as unknown as React.ReactNode)
                          : null}
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="px-4 py-3.5 text-right align-middle relative">
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionRow(activeActionRow === rowKey ? null : rowKey);
                            }}
                            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-slate-100 focus:outline-none"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {activeActionRow === rowKey && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveActionRow(null);
                                }}
                              />
                              <div className="absolute right-4 mt-1 w-44 rounded-md bg-white shadow-dropdown border border-border py-1 z-30 divide-y divide-slate-100">
                                {actions.map((act, actIdx) => (
                                  <button
                                    key={actIdx}
                                    type="button"
                                    onClick={(e) => handleActionClick(e, act, item)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                                      act.variant === 'danger'
                                        ? 'text-status-danger hover:bg-rose-50'
                                        : 'text-text-primary hover:bg-slate-50'
                                    }`}
                                  >
                                    {act.icon && <span className="w-3.5 h-3.5 shrink-0">{act.icon}</span>}
                                    <span>{act.label}</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50 text-xs text-text-secondary">
          <div>
            Showing <span className="font-semibold text-text-primary">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-text-primary">{Math.min(currentPage * pageSize, data.length)}</span> of{' '}
            <span className="font-semibold text-text-primary">{data.length}</span> records
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-border bg-white text-text-primary hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-border bg-white text-text-primary hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
