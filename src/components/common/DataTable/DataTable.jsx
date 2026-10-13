import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import styles from './DataTable.module.css';

export const DataTable = ({
  columns = [],
  data = [],
  keyField = '_id',
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  emptyMessage = 'No records found',
  pageSize = 10,
  className = '',
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Selection
  const allCurrentSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedKeys.includes(row[keyField]));

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allCurrentSelected) {
      const currentIds = new Set(paginatedData.map((r) => r[keyField]));
      onSelectionChange(selectedKeys.filter((id) => !currentIds.has(id)));
    } else {
      const newKeys = new Set([...selectedKeys, ...paginatedData.map((r) => r[keyField])]);
      onSelectionChange(Array.from(newKeys));
    }
  };

  const toggleSelectRow = (key) => {
    if (!onSelectionChange) return;
    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {selectable && (
                <th className={`${styles.th} ${styles.checkboxCell}`}>
                  <input
                    type="checkbox"
                    checked={allCurrentSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all rows on current page"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key || col.field}
                  className={`${styles.th} ${col.sortable ? styles.sortable : ''}`}
                  onClick={() => col.sortable && handleSort(col.field)}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                >
                  <span className={styles.thContent}>
                    {col.title}
                    {col.sortable && sortField === col.field && (
                      sortDirection === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className={styles.emptyState}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selectedKeys.includes(row[keyField]);
                return (
                  <tr
                    key={row[keyField]}
                    className={`${styles.tr} ${isSelected ? styles.trSelected : ''}`}
                  >
                    {selectable && (
                      <td className={`${styles.td} ${styles.checkboxCell}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(row[keyField])}
                          aria-label={`Select row ${row[keyField]}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key || col.field}
                        className={styles.td}
                        style={{ textAlign: col.align || 'left' }}
                      >
                        {col.render ? col.render(row[col.field], row) : row[col.field]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {sortedData.length > pageSize && (
        <div className={styles.pagination}>
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className={styles.paginationActions}>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FiChevronLeft size={16} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
