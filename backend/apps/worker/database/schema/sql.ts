export const schemaSQL = `
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  department_id TEXT,
  line_user_id TEXT,
  line_display_name TEXT,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  FOREIGN KEY(department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS admin_roles (
  admin_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  PRIMARY KEY (admin_id, role_id),
  FOREIGN KEY(admin_id) REFERENCES admins(id),
  FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS role_modules (
  role_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  PRIMARY KEY (role_id, module_id),
  FOREIGN KEY(role_id) REFERENCES roles(id),
  FOREIGN KEY(module_id) REFERENCES modules(id)
);
`;

let initialized = false;
export async function ensureSchema(db: any) {
  if (initialized) return;
  await db.exec(schemaSQL);
  initialized = true;
}