-- 創建前台用戶表
CREATE TABLE IF NOT EXISTS front_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- 創建後台管理員表
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin', -- 'super_admin', 'admin', 'editor'
  permissions TEXT, -- JSON 字符串存儲權限
  created_by INTEGER, -- 創建此管理員的超級管理員 ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- 創建產品表
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INTEGER, -- 創建此產品的管理員 ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- 創建前台用戶訂單表
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  shipping_address TEXT,
  phone TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES front_users(id)
);

-- 創建訂單項目表
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 創建會話表（用於用戶認證）
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  admin_id INTEGER,
  user_type TEXT NOT NULL, -- 'front_user' or 'admin_user'
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES front_users(id),
  FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);

-- 插入超級管理員（預設帳號）
INSERT OR IGNORE INTO admin_users (username, email, password_hash, role, permissions) VALUES 
  ('super_admin', 'admin@marelle.com', '$2a$10$example.hash.here', 'super_admin', '{"all": true}');

-- 插入範例產品
INSERT OR IGNORE INTO products (name, description, price, stock, category, created_by) VALUES 
  ('筆記型電腦', '高效能商務筆電', 35000.00, 10, '電腦', 1),
  ('無線滑鼠', '人體工學設計無線滑鼠', 890.00, 50, '週邊', 1),
  ('機械鍵盤', '青軸機械鍵盤', 2500.00, 25, '週邊', 1),
  ('智慧手機', '最新款智慧手機', 25000.00, 30, '手機', 1),
  ('平板電腦', '10吋高解析度平板', 18000.00, 15, '平板', 1);

-- 插入範例前台用戶（用於測試）
INSERT OR IGNORE INTO front_users (name, email, password_hash, phone) VALUES 
  ('張小明', 'zhang@example.com', '$2a$10$example.hash.here', '0912345678'),
  ('李小華', 'li@example.com', '$2a$10$example.hash.here', '0987654321'),
  ('王小美', 'wang@example.com', '$2a$10$example.hash.here', '0955123456');

-- 插入範例訂單
INSERT OR IGNORE INTO orders (user_id, total_amount, status, shipping_address, phone) VALUES 
  (1, 35890.00, 'delivered', '台北市信義區信義路五段7號', '0912345678'),
  (2, 2500.00, 'shipped', '台中市西屯區台灣大道三段99號', '0987654321'),
  (3, 890.00, 'pending', '高雄市前鎮區中山四路100號', '0955123456');

-- 插入範例訂單項目
INSERT OR IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES 
  (1, 1, 1, 35000.00),
  (1, 2, 1, 890.00),
  (2, 3, 1, 2500.00),
  (3, 2, 1, 890.00);