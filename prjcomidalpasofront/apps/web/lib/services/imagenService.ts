/**
 * imagenService.ts — asigna imágenes locales a ítems del API (la BD no tiene URLs).
 * Estrategia en 3 niveles: diccionario exacto → keywords → pool por categoría (hash determinístico).
 */

const PLACEHOLDER = '/images/presentacion1.jpg'

// ─── Normalización ────────────────────────────────────────────────────────────

export function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

// ─── Nivel 1: diccionario exacto (nombres conocidos de lib/data.ts) ──────────

const IMAGEN_POR_NOMBRE: Record<string, string> = {
  'menu campesino': '/images/menu1.jpg',
  'menu verde': '/images/menu2.jpg',
  'menu express': '/images/menu3.jpg',
  'menu del mar': '/images/menu4.jpg',
  'menu ejecutivo': '/images/menu5.png',
  'bowl de pollo asado': '/images/alacarta1.jpg',
  'pasta primavera': '/images/alacarta2.jpg',
  'ensalada cesar': '/images/alacarta3.jpg',
  'tacos de res': '/images/alacarta4.jpg',
  'wrap integral': '/images/alacarta5.jpg',
  'brownie de chocolate': '/images/postre1.jpg',
  'flan casero': '/images/postre2.jpg',
  'cheesecake de frutos rojos': '/images/postre3.jpg',
  'torta de zanahoria': '/images/postre4.jpg',
  'helado artesanal': '/images/postre5.jpg',
  'tiramisu express': '/images/postre6.jpg',
  'arroz integral': '/images/base1.jpg',
  'quinoa': '/images/base2.jpg',
  'lechuga mixta': '/images/base3.jpg',
  'pasta integral': '/images/base4.jpg',
  'pollo a la plancha': '/images/proteina1.jpg',
  'carne de res': '/images/proteina2.jpg',
  'proteina vegetal': '/images/proteina3.jpg',
  'limonada natural': '/images/bebida1.jpg',
  'agua saborizada': '/images/bebida2.jpg',
  'te helado': '/images/bebida3.jpg',
}

// ─── Nivel 2: keywords en el nombre ──────────────────────────────────────────

const POOL_POSTRES = ['/images/postre1.jpg', '/images/postre2.jpg', '/images/postre3.jpg', '/images/postre4.jpg', '/images/postre5.jpg', '/images/postre6.jpg']
const POOL_BEBIDAS = ['/images/bebida1.jpg', '/images/bebida2.jpg', '/images/bebida3.jpg']
const POOL_PROTEINAS = ['/images/proteina1.jpg', '/images/proteina2.jpg', '/images/proteina3.jpg']
const POOL_MENUS = ['/images/menu1.jpg', '/images/menu2.jpg', '/images/menu3.jpg', '/images/menu4.jpg', '/images/menu5.png']
const POOL_CARTA = ['/images/alacarta1.jpg', '/images/alacarta2.jpg', '/images/alacarta3.jpg', '/images/alacarta4.jpg', '/images/alacarta5.jpg']
const POOL_BASES = ['/images/base1.jpg', '/images/base2.jpg', '/images/base3.jpg', '/images/base4.jpg']

const KEYWORD_POOLS: Array<{ keywords: string[]; pool: string[] }> = [
  { keywords: ['brownie', 'flan', 'cheesecake', 'torta', 'helado', 'tiramisu', 'postre', 'dulce'], pool: POOL_POSTRES },
  { keywords: ['limonada', 'agua', 'jugo', 'bebida', 'refresco', 'chicha', 'te '], pool: POOL_BEBIDAS },
  { keywords: ['pollo', 'carne', 'res', 'pescado', 'proteina'], pool: POOL_PROTEINAS },
  { keywords: ['menu'], pool: POOL_MENUS },
  { keywords: ['arroz', 'quinoa', 'lechuga', 'pasta', 'base'], pool: POOL_BASES },
]

// ─── Nivel 3: pool por categoría ─────────────────────────────────────────────

const POOL_POR_CATEGORIA: Array<{ match: string[]; pool: string[] }> = [
  { match: ['menu'], pool: POOL_MENUS },
  { match: ['postre'], pool: POOL_POSTRES },
  { match: ['bebida'], pool: POOL_BEBIDAS },
  { match: ['carta'], pool: POOL_CARTA },
]

// ─── Hash determinístico (mismo id → misma imagen) ───────────────────────────

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

// ─── API pública ──────────────────────────────────────────────────────────────

export function getImagenItem(nombre: string, categoria: string, id: string): string {
  const nombreNorm = normalizar(nombre)

  // 1. match exacto
  const exacta = IMAGEN_POR_NOMBRE[nombreNorm]
  if (exacta) return exacta

  // 2. keywords en nombre
  for (const { keywords, pool } of KEYWORD_POOLS) {
    if (keywords.some((k) => nombreNorm.includes(k))) {
      return pool[hashString(id) % pool.length]
    }
  }

  // 3. pool por categoría
  const catNorm = normalizar(categoria)
  for (const { match, pool } of POOL_POR_CATEGORIA) {
    if (match.some((m) => catNorm.includes(m))) {
      return pool[hashString(id) % pool.length]
    }
  }

  return PLACEHOLDER
}
