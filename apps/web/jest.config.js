const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Apunta al directorio raíz de la app Next.js
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  // Entorno node para tests de servicios (funciones puras, sin DOM)
  testEnvironment: 'node',

  // Mapeo de alias @/ → raíz del proyecto (igual que tsconfig paths)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Solo buscar tests en __tests__/
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],

  // Reporte de cobertura
  collectCoverageFrom: [
    'lib/services/**/*.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(config)
