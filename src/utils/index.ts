export function mergeObjects(a: Record<string, any>, b: Record<string, any>) {
   if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
      return b;
   }

   const result: Record<string, any> = {};
   for (const key in a) {
      if (key in b) {
         if (typeof a[key] === 'object' && typeof b[key] === 'object') {
            result[key] = mergeObjects(a[key], b[key]);
         } else {
            result[key] = b[key];
         }
      } else {
         result[key] = a[key];
      }
   }

   for (const key in b) {
      if (!(key in a)) {
         result[key] = b[key];
      }
   }

   return result;
}

export function deepEqual(a: any, b: any): boolean {
   if (a === b) {
      return true;
   }

   if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
      return false;
   }
   if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
         return false;
      }
      for (let i = 0; i < a.length; i++) {
         if (!deepEqual(a[i], b[i])) {
            return false;
         }
      }
      return true;
   }

   const keysA = Object.keys(a);
   const keysB = Object.keys(b);

   if (keysA.length !== keysB.length) {
      return false;
   }

   for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
         return false;
      }
   }

   return true;
}

export function safeMergeObjects(a: Record<string, any>, b: Record<string, any>) {
   const newObject = mergeObjects(a, b);
   if (deepEqual(a, newObject)) {
      return a;
   } else {
      return newObject;
   }
}

export function safeFlattenObjects(array: any[]) {
   return array.reduce((acc, val) => safeMergeObjects(acc, val), {})
}