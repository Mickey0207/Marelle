// 階層導航結構與相關產生函式
export const navigationConfig = [
  { name: '居家生活', slug: 'home', children: [ { name: '家具', slug: 'furniture' }, { name: '收納', slug: 'storage' } ] },
  { name: '廚房餐飲', slug: 'kitchen', children: [ { name: '餐具', slug: 'tableware' }, { name: '杯壺', slug: 'drinkware' } ] }
];

export function generateRoutePath(base, segments = []) {
  return [base.replace(/\/$/, ''), ...segments].join('/');
}

export function formatNavigationForNavbar() {
  return [
    { name: '首頁', href: '/' },
    { name: '商品', href: '/products', mega: true, columns: [
      { title: '居家生活', items: navigationConfig[0].children.map(c => ({ name: c.name, href: generateRoutePath('/products', ['home', c.slug]) })) },
      { title: '廚房餐飲', items: navigationConfig[1].children.map(c => ({ name: c.name, href: generateRoutePath('/products', ['kitchen', c.slug]) })) },
    ]}
  ];
}
