import 'jest-preset-angular/setup-jest';
import crypto from 'crypto'

// otherwise creating a UUID throws an error during tests
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr:any) => crypto.randomBytes(arr.length)
  }
});
