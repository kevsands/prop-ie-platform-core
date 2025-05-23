/**
 * SQL Sanitizer for preventing SQL injection attacks
 */

/**
 * Sanitizes a SQL identifier (table name, column name, etc.)
 * @param identifier The identifier to sanitize
 * @returns Sanitized identifier
 */
export function sanitizeSqlIdentifier(identifier: string): string {
  // Remove any non-alphanumeric characters except underscores
  const sanitized = identifier.replace(/[^a-zA-Z0-9_]/g, '');
  
  // Ensure it starts with a letter or underscore
  if (!/^[a-zA-Z_]/.test(sanitized)) {
    throw new Error('Invalid SQL identifier: must start with a letter or underscore');
  }
  
  return sanitized;
}

/**
 * Sanitizes a SQL value
 * @param value The value to sanitize
 * @returns Sanitized value
 */
export function sanitizeSqlValue(value: any): string {
  if (value === null) {
    return 'NULL';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  if (typeof value === 'string') {
    // Escape single quotes and backslashes
    return `'${value.replace(/['\\]/g, '\\$&')}'`;
  }
  
  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }
  
  throw new Error(`Cannot sanitize value of type ${typeof value}`);
}

/**
 * Sanitizes a SQL query
 * @param query The query to sanitize
 * @returns Sanitized query
 */
export function sanitizeSqlQuery(query: string): string {
  // Remove comments
  query = query.replace(/--.*$/gm, '');
  
  // Remove multiple spaces
  query = query.replace(/\s+/g, ' ').trim();
  
  // Ensure the query ends with a semicolon
  if (!query.endsWith(';')) {
    query += ';';
  }
  
  return query;
} 