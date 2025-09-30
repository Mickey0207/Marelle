// Minimal mock products dataset and helpers

export function formatPrice(value) {
  try {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(Number(value || 0));
  } catch {
    return `NT$ ${Number(value || 0).toLocaleString('zh-TW')}`;
  }
}

export const mockProducts = [
  {
    id: 1,
    name: '優雅白色連衣裙',
    baseSKU: 'DRS-WHITE-001',
    price: 1280,
    originalPrice: 1580,
    inStock: true,
    slug: 'elegant-white-dress',
    status: 'active',
    visibility: 'visible',
    hasVariants: true,
    category: '女裝',
    categoryId: 'c-f-w-1',
    image: 'https://picsum.photos/seed/dress/320/240',
    skuVariants: [
      { id: 'v1', sku: 'DRS-WHITE-001-S', spec: 'S', config: { color: '白', size: 'S' }, barcode: '4710000000011' },
      { id: 'v2', sku: 'DRS-WHITE-001-M', spec: 'M', config: { color: '白', size: 'M' }, barcode: '4710000000012' },
      { id: 'v3', sku: 'DRS-WHITE-001-L', spec: 'L', config: { color: '白', size: 'L' }, barcode: '4710000000013' },
    ],
  },
  {
    id: 2,
    name: '經典黑色西裝外套',
    baseSKU: 'JKT-BLACK-001',
    price: 2480,
    inStock: true,
    slug: 'classic-black-blazer',
    status: 'active',
    visibility: 'visible',
    hasVariants: false,
    category: '男裝',
    categoryId: 'c-m-t-1',
    image: 'https://picsum.photos/seed/blazer/320/240',
    skuVariants: [
      { id: 'v1', sku: 'JKT-BLACK-001', spec: 'F', config: { size: 'F' }, barcode: '4710000000101' },
    ],
  },
  {
    id: 3,
    name: '時尚牛仔褲',
    baseSKU: 'JEAN-STD-001',
    price: 980,
    inStock: true,
    slug: 'fashion-jeans',
    status: 'active',
    visibility: 'visible',
    hasVariants: true,
    category: '通用',
    categoryId: 'c-u-b-1',
    image: 'https://picsum.photos/seed/jeans/320/240',
    skuVariants: [
      { id: 'v1', sku: 'JEAN-STD-001-30', spec: '30', config: { size: '30' }, barcode: '4710000000201' },
      { id: 'v2', sku: 'JEAN-STD-001-32', spec: '32', config: { size: '32' }, barcode: '4710000000202' },
      { id: 'v3', sku: 'JEAN-STD-001-34', spec: '34', config: { size: '34' }, barcode: '4710000000203' },
    ],
  },
];
