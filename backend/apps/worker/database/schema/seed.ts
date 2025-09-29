import { randomUUID } from 'node:crypto'

export async function seed(db: any) {
  // Departments
  await db.exec("INSERT OR IGNORE INTO departments (id, name) VALUES ('dept-default','General')");
  // Roles
  await db.exec("INSERT OR IGNORE INTO roles (id, name) VALUES ('role-admin','Admin')");
  // Modules
  const modules = ['dashboard','members','orders','products','inventory','marketing','notifications','notification-center','settings','analytics']
  for (const m of modules) {
    await db.exec(`INSERT OR IGNORE INTO modules (id, name) VALUES ('mod-${m}', '${m}')`)
  }
  // Role -> modules full access
  for (const m of modules) {
    await db.exec(`INSERT OR IGNORE INTO role_modules (role_id, module_id) VALUES ('role-admin','mod-${m}')`)
  }
  // Default admin (password_hash is PBKDF2 JSON string; to be set by reset flow later)
  const adminId = 'admin-default'
  const pwd = { algo: 'pbkdf2', hash: '', salt: '', iterations: 210000, keylen: 32, digest: 'sha256' }
  await db.exec(`INSERT OR IGNORE INTO admins (id, email, display_name, department_id, password_hash) VALUES ('${adminId}', 'admin@example.com', 'Default Admin', 'dept-default', '${JSON.stringify(pwd).replaceAll('"', '""')}')`)
  await db.exec(`INSERT OR IGNORE INTO admin_roles (admin_id, role_id) VALUES ('${adminId}', 'role-admin')`)
}