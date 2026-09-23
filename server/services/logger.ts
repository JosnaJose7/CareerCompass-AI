/**
 * Structured Server-Side Logger
 * Strips sensitive data (API keys, bearer tokens, passwords, raw PDF text)
 */

export interface LogMeta {
  route?: string;
  method?: string;
  uid?: string;
  status?: number;
  durationMs?: number;
  errorCode?: string;
  [key: string]: any;
}

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Mask potential API keys, Bearer tokens, or long base64 strings
    if (value.startsWith('Bearer ')) {
      return 'Bearer [REDACTED_TOKEN]';
    }
    if (/AIza[0-9A-Za-z-_]{35}/.test(value)) {
      return value.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_GEMINI_KEY]');
    }
    if (value.length > 500) {
      return `${value.substring(0, 80)}... [TRUNCATED ${value.length} chars]`;
    }
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    const copy: Record<string, any> = Array.isArray(value) ? [] : {};
    for (const key of Object.keys(value)) {
      const lower = key.toLowerCase();
      if (lower.includes('password') || lower.includes('secret') || lower.includes('token') || lower.includes('apikey') || lower.includes('pdfbase64')) {
        copy[key] = '[REDACTED]';
      } else {
        copy[key] = sanitizeValue(value[key]);
      }
    }
    return copy;
  }
  return value;
}

export const logger = {
  info(message: string, meta: LogMeta = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level: 'INFO',
      message,
      ...sanitizeValue(meta)
    };
    console.log(JSON.stringify(entry));
  },

  warn(message: string, meta: LogMeta = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level: 'WARN',
      message,
      ...sanitizeValue(meta)
    };
    console.warn(JSON.stringify(entry));
  },

  error(message: string, error?: any, meta: LogMeta = {}) {
    const timestamp = new Date().toISOString();
    let sanitizedErrorMsg = 'Unknown error';
    let errorCode = meta.errorCode || 'SERVER_ERROR';

    if (error instanceof Error) {
      sanitizedErrorMsg = error.message;
      if ('code' in error) {
        errorCode = String((error as any).code);
      }
    } else if (typeof error === 'string') {
      sanitizedErrorMsg = error;
    } else if (error && typeof error === 'object') {
      sanitizedErrorMsg = error.message || JSON.stringify(sanitizeValue(error));
    }

    // Never print stack traces containing file paths or environment variables
    const entry = {
      timestamp,
      level: 'ERROR',
      message,
      errorMessage: sanitizeValue(sanitizedErrorMsg),
      errorCode,
      ...sanitizeValue(meta)
    };
    console.error(JSON.stringify(entry));
  }
};
