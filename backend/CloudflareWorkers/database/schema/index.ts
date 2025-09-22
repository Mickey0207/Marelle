import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// 簡單的 ID 生成函數
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// 用戶表
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 商品表
export const products = sqliteTable('products', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  originalPrice: real('original_price'),
  category: text('category').notNull(),
  brand: text('brand'),
  sku: text('sku').unique(),
  stock: integer('stock').notNull().default(0),
  images: text('images'), // JSON array of image URLs
  status: text('status').notNull().default('active'), // active, inactive, draft
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 訂單表
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull(),
  orderNumber: text('order_number').notNull().unique(),
  status: text('status').notNull().default('pending'), // pending, processing, shipped, delivered, cancelled
  totalAmount: real('total_amount').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  billingAddress: text('billing_address'),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 訂單項目表
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  orderId: text('order_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 庫存記錄表
export const inventory = sqliteTable('inventory', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  productId: text('product_id').notNull(),
  type: text('type').notNull(), // in, out, adjustment
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  reference: text('reference'), // order_id, supplier_id, etc.
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 供應商表
export const suppliers = sqliteTable('suppliers', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  contact: text('contact'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  notes: text('notes'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 優惠券表
export const coupons = sqliteTable('coupons', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // percentage, fixed_amount
  value: real('value').notNull(),
  minAmount: real('min_amount'),
  maxDiscount: real('max_discount'),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').notNull().default(0),
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;