export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface BuilderItem {
  id: string
  name: string
  image: string
  price: number
}

export const menus: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Menú Campesino',
    description: 'Bandeja con arroz, frijoles, carne a la plancha, ensalada fresca y jugo natural.',
    price: 16900,
    image: '/images/menu1.jpg',
    category: 'menu',
  },
  {
    id: 'menu-2',
    name: 'Menú Verde',
    description: 'Bowl vegetariano con quinoa, vegetales asados, aguacate y aderezo de limón.',
    price: 15900,
    image: '/images/menu2.jpg',
    category: 'menu',
  },
  {
    id: 'menu-3',
    name: 'Menú Express',
    description: 'Sándwich integral con pollo, ensalada de col y papas horneadas.',
    price: 14900,
    image: '/images/menu3.jpg',
    category: 'menu',
  },
  {
    id: 'menu-4',
    name: 'Menú del Mar',
    description: 'Bowl de atún fresco con arroz, pepino, zanahoria y salsa de soya.',
    price: 18900,
    image: '/images/menu4.jpg',
    category: 'menu',
  },
  {
    id: 'menu-5',
    name: 'Menú Ejecutivo',
    description: 'Sopa del día + plato fuerte + postre casero + bebida incluida.',
    price: 22900,
    image: '/images/menu5.png',
    category: 'menu',
  },
]

export const alaCartaItems: MenuItem[] = [
  {
    id: 'carta-1',
    name: 'Bowl de Pollo Asado',
    description: 'Pollo marinado con hierbas, sobre base de arroz integral y vegetales frescos.',
    price: 12900,
    image: '/images/alacarta1.jpg',
    category: 'carta',
  },
  {
    id: 'carta-2',
    name: 'Pasta Primavera',
    description: 'Pasta al dente con salsa de tomates frescos, albahaca y vegetales de temporada.',
    price: 11900,
    image: '/images/alacarta2.jpg',
    category: 'carta',
  },
  {
    id: 'carta-3',
    name: 'Ensalada César',
    description: 'Lechuga romana, crutones caseros, parmesano y aderezo césar tradicional.',
    price: 10900,
    image: '/images/alacarta3.jpg',
    category: 'carta',
  },
  {
    id: 'carta-4',
    name: 'Tacos de Res',
    description: 'Tres tacos con carne de res, pico de gallo, aguacate y crema.',
    price: 13900,
    image: '/images/alacarta4.jpg',
    category: 'carta',
  },
  {
    id: 'carta-5',
    name: 'Wrap Integral',
    description: 'Tortilla integral rellena de pollo, vegetales y salsa de yogur.',
    price: 11500,
    image: '/images/alacarta5.jpg',
    category: 'carta',
  },
]

export const postresItems: MenuItem[] = [
  {
    id: 'postre-1',
    name: 'Brownie de Chocolate',
    description: 'Brownie húmedo con nueces y salsa de chocolate oscuro.',
    price: 6900,
    image: '/images/postre1.jpg',
    category: 'postre',
  },
  {
    id: 'postre-2',
    name: 'Flan Casero',
    description: 'Flan de vainilla con caramelo líquido, receta tradicional.',
    price: 5900,
    image: '/images/postre2.jpg',
    category: 'postre',
  },
  {
    id: 'postre-3',
    name: 'Cheesecake de Frutos Rojos',
    description: 'Base de galleta, crema de queso y coulis de frutos rojos.',
    price: 7500,
    image: '/images/postre3.jpg',
    category: 'postre',
  },
  {
    id: 'postre-4',
    name: 'Torta de Zanahoria',
    description: 'Esponjosa y húmeda, con frosting de queso crema.',
    price: 6500,
    image: '/images/postre4.jpg',
    category: 'postre',
  },
  {
    id: 'postre-5',
    name: 'Helado Artesanal',
    description: 'Dos bolas de helado artesanal en sabores del día.',
    price: 5500,
    image: '/images/postre5.jpg',
    category: 'postre',
  },
  {
    id: 'postre-6',
    name: 'Tiramisú Express',
    description: 'Capas de bizcocho, mascarpone y cacao en polvo.',
    price: 7900,
    image: '/images/postre6.jpg',
    category: 'postre',
  },
]

export const bases: BuilderItem[] = [
  { id: 'base-1', name: 'Arroz Integral', image: '/images/base1.jpg', price: 0 },
  { id: 'base-2', name: 'Quinoa', image: '/images/base2.jpg', price: 1000 },
  { id: 'base-3', name: 'Lechuga Mixta', image: '/images/base3.jpg', price: 0 },
  { id: 'base-4', name: 'Pasta Integral', image: '/images/base4.jpg', price: 500 },
]

export const proteinas: BuilderItem[] = [
  { id: 'prot-1', name: 'Pollo a la Plancha', image: '/images/proteina1.jpg', price: 4500 },
  { id: 'prot-2', name: 'Carne de Res', image: '/images/proteina2.jpg', price: 5500 },
  { id: 'prot-3', name: 'Proteína Vegetal', image: '/images/proteina3.jpg', price: 4000 },
]

export const toppingsItems: BuilderItem[] = [
  { id: 'top-1', name: 'Aguacate + Tomates Cherry', image: '/images/topping1.jpg', price: 2000 },
  { id: 'top-2', name: 'Mix de Quesos', image: '/images/topping2.jpg', price: 1500 },
]

export const bebidas: BuilderItem[] = [
  { id: 'beb-1', name: 'Limonada Natural', image: '/images/bebida1.jpg', price: 3500 },
  { id: 'beb-2', name: 'Agua Saborizada', image: '/images/bebida2.jpg', price: 2500 },
  { id: 'beb-3', name: 'Té Helado', image: '/images/bebida3.jpg', price: 3000 },
]

export const BOWL_BASE_PRICE = 10900
