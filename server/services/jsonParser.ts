// Centralized JSON Repair and Parsing Service for AI Outputs
// Handles balanced bracket extraction, trailing commas, unescaped string control characters, and truncated outputs

/**
 * Extracts the first balanced JSON structure (either {...} or [...])
 */
export function extractBalancedJSON(text: string): string {
  if (!text) return text;

  let startIdx = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{' || text[i] === '[') {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return text;

  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  let endIdx = -1;

  for (let i = startIdx; i < text.length; i++) {
    const char = text[i];
    if (char === '\\') {
      escaped = !escaped;
      continue;
    }
    if (char === '"' && !escaped) {
      inString = !inString;
    } else if (!inString) {
      if (char === '{') {
        stack.push('}');
      } else if (char === '[') {
        stack.push(']');
      } else if (char === '}' || char === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === char) {
          stack.pop();
          if (stack.length === 0) {
            endIdx = i;
            break;
          }
        }
      }
    }
    escaped = false;
  }

  if (endIdx !== -1) {
    return text.substring(startIdx, endIdx + 1);
  }

  return text.substring(startIdx);
}

/**
 * Clean and safely parse JSON response from Gemini output string with auto-repair
 */
export function parseJSONFromResponse<T = any>(rawText: string): T {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response from AI');
  }

  // 1. Basic strip of markdown code fences & trim
  let cleanText = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  // 2. Extract balanced root object/array
  cleanText = extractBalancedJSON(cleanText);

  // Direct Attempt 1: standard JSON.parse
  try {
    return JSON.parse(cleanText);
  } catch (err: any) {
    // If error mentions position after JSON, slice at that position
    const posMatch = /position\s+(\d+)/i.exec(err?.message || '');
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      if (pos > 0 && pos < cleanText.length) {
        try {
          return JSON.parse(cleanText.slice(0, pos));
        } catch (_) {}
      }
    }
  }

  // Repair Attempt 2: Strip trailing commas before closing braces/brackets
  let modified = cleanText.replace(/,\s*([}\]])/g, '$1');
  try {
    return JSON.parse(modified);
  } catch (err: any) {
    const posMatch = /position\s+(\d+)/i.exec(err?.message || '');
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      if (pos > 0 && pos < modified.length) {
        try {
          return JSON.parse(modified.slice(0, pos));
        } catch (_) {}
      }
    }
  }

  // Repair Attempt 3: Escape raw unescaped newlines/tabs inside string literals
  try {
    let inString = false;
    let escaped = false;
    const charArray = modified.split('');
    for (let i = 0; i < charArray.length; i++) {
      const c = charArray[i];
      if (c === '\\') {
        escaped = !escaped;
        continue;
      }
      if (c === '"' && !escaped) {
        inString = !inString;
      }
      if (inString && (c === '\n' || c === '\r')) {
        charArray[i] = '\\n';
      }
      if (inString && c === '\t') {
        charArray[i] = ' ';
      }
      escaped = false;
    }
    modified = charArray.join('');
    return JSON.parse(modified);
  } catch (_) {}

  // Repair Attempt 4: Handle truncated JSON outputs by closing open quotes and matching brackets
  try {
    const stack: string[] = [];
    let inString = false;
    let escaped = false;

    for (let i = 0; i < modified.length; i++) {
      const c = modified[i];
      if (c === '\\') {
        escaped = !escaped;
        continue;
      }
      if (c === '"' && !escaped) {
        inString = !inString;
      } else if (!inString) {
        if (c === '{') stack.push('}');
        else if (c === '[') stack.push(']');
        else if (c === '}' || c === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === c) {
            stack.pop();
          }
        }
      }
      escaped = false;
    }

    let repaired = modified;
    if (inString) {
      repaired += '"';
    }
    // Remove hanging commas or uncompleted key-values
    repaired = repaired.replace(/,\s*$/, '');
    repaired = repaired.replace(/("[^"]*"\s*:\s*)$/, '');
    repaired = repaired.replace(/,\s*([}\]])/g, '$1');

    while (stack.length > 0) {
      const closing = stack.pop();
      repaired += closing;
    }
    repaired = repaired.replace(/,\s*([}\]])/g, '$1');

    return JSON.parse(repaired);
  } catch (err: any) {
    console.warn('All JSON repair attempts failed:', err?.message || err, 'Snippet:', rawText.slice(0, 300));
    throw new Error(`Failed to parse structured response from AI: ${err?.message || 'SyntaxError'}`);
  }
}
