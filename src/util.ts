/* eslint-disable no-console, no-sequences, no-continue */
export function deepEqual(a: any, b: any, seen = new WeakMap()) {
  // Strict equality check (handles primitives, null, undefined, same reference)
  if (a === b) return true;
  // Type checking
  if (typeof a !== typeof b) return console.warn('Type mismatch', a, b), false;
  if (a == null || b == null) return console.warn('Null mismatch', a, b), false;
  // Handle circular references
  if (typeof a === 'object') {
    if (seen.has(a)) return seen.get(a) === b ? true : (console.warn('Circular reference mismatch', a, b), false);
    seen.set(a, b);
  }
  // Handle arrays
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return console.warn('Array length mismatch', a, b), false;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], seen)) return console.warn('Array element mismatch', a[i], b[i]), false;
    }
    return true;
  }
  // Handle Date objects
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  // Handle RegExp objects
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString() ? true : (console.warn('RegExp mismatch', a, b), false);
  }
  // Handle plain objects
  if (typeof a === 'object' && a.constructor === Object && b.constructor === Object) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return console.warn('Object key length mismatch', keysA.length, keysB.length), false;
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keysA) {
      if (key === 'position') continue; // skip position key since we're formatting
      if (!keysB.includes(key)) return console.warn('Object key mismatch', key, a, b), false;
      if (!deepEqual(a[key], b[key], seen)) return console.warn('Object value mismatch', key, a[key], b[key]), false;
    }
    return true;
  }
  console.warn('Object mismatch', a, b);
  // For other object types, use strict equality, which failed above
  return false;
}

export function deepEqualWithFunctions(a: any, b: any, seen = new WeakMap()) {
  if (a === b) return true;
  if (typeof a !== typeof b) return console.warn('Type mismatch', a, b), false;
  if (a == null || b == null) return console.warn('Null mismatch', a, b), false;
  // Handle functions
  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString() ? true : (console.warn('Function mismatch', a, b), false);
  }
  // Delegate to main comparison
  return deepEqual(a, b, seen);
}
