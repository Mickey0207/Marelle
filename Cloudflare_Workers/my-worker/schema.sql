-- 創建使用者表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 創建產品表
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 創建訂單表
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 插入範例資料
INSERT OR IGNORE INTO users (name, email) VALUES 
  ('張三', 'zhang@example.com'),
  ('李四', 'li@example.com'),
  ('王五', 'wang@example.com');

INSERT OR IGNORE INTO products (name, description, price, stock, image_url) VALUES 
  ('筆記型電腦', '高效能商務筆電', 35000.00, 10, 'laptop.jpg'),
  ('無線滑鼠', '人體工學設計無線滑鼠', 890.00, 50, 'mouse.jpg'),
  ('機械鍵盤', '青軸機械鍵盤', 2500.00, 25, 'keyboard.jpg');

INSERT OR IGNORE INTO orders (user_id, total_amount, status) VALUES 
  (1, 35890.00, 'completed'),
  (2, 2500.00, 'pending'),
  (3, 890.00, 'shipped');