// Utility functions to convert between camelCase and snake_case

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function isDateObject(value: any): boolean {
  return value instanceof Date || 
         (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Date') ||
         (value && typeof value.getTime === 'function');
}

export function convertKeysToSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToSnakeCase);
  if (isDateObject(obj)) return obj.toISOString();
  
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = toSnakeCase(key);
      let value = obj[key];
      
      // Format date_of_birth and appointment_date as YYYY-MM-DD (date only)
      if ((key === 'dateOfBirth' || key === 'appointmentDate') && isDateObject(value)) {
        result[snakeKey] = value.toISOString().split('T')[0];
      } else if (isDateObject(value)) {
        // Other dates keep full ISO format
        result[snakeKey] = value.toISOString();
      } else {
        result[snakeKey] = convertKeysToSnakeCase(value);
      }
    }
  }
  return result;
}

export function convertKeysToCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToCamelCase);
  
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = toCamelCase(key);
      const value = (obj as any)[key];
      if (isDateObject(value)) {
        if (camelKey === 'dateOfBirth' || camelKey === 'appointmentDate') {
          result[camelKey] = new Date(value).toISOString().split('T')[0];
        } else {
          result[camelKey] = new Date(value).toISOString();
        }
      } else {
        result[camelKey] = convertKeysToCamelCase(value);
      }
    }
  }
  return result;
}
