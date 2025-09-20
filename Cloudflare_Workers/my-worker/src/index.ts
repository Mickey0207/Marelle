/**
 * Cloudflare Workers with D1 Database and R2 Storage
 * 支援前台和後台分離的認證系統
 * 
 * API Endpoints:
 * 
 * 前台用戶 API:
 * - POST /api/front/register - 前台用戶註冊
 * - POST /api/front/login - 前台用戶登入
 * - GET /api/front/profile - 獲取前台用戶資料
 * - GET /api/front/orders - 獲取用戶訂單
 * 
 * 後台管理員 API:
 * - POST /api/admin/login - 管理員登入
 * - POST /api/admin/create-admin - 創建新管理員（僅超級管理員）
 * - GET /api/admin/users - 獲取前台用戶列表
 * - GET /api/admin/orders - 獲取所有訂單
 * 
 * 產品 API:
 * - GET /api/products - 獲取所有產品
 * - POST /api/admin/products - 創建新產品（僅管理員）
 * 
 * 檔案 API:
 * - POST /api/upload - 上傳檔案到 R2
 * - GET /api/file/:key - 從 R2 下載檔案
 */

interface FrontUser {
	id?: number;
	name: string;
	email: string;
	password?: string;
	password_hash?: string;
	phone?: string;
	address?: string;
	created_at?: string;
	is_active?: boolean;
}

interface AdminUser {
	id?: number;
	username: string;
	email: string;
	password?: string;
	password_hash?: string;
	role: 'super_admin' | 'admin' | 'editor';
	permissions?: string;
	created_by?: number;
	created_at?: string;
	is_active?: boolean;
}

interface Product {
	id?: number;
	name: string;
	description?: string;
	price: number;
	stock: number;
	image_url?: string;
	category?: string;
	is_active?: boolean;
	created_by?: number;
}

interface Session {
	id: string;
	user_id?: number;
	admin_id?: number;
	user_type: 'front_user' | 'admin_user';
	expires_at: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		// 設置 CORS 標頭
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		};

		// 處理 OPTIONS 請求
		if (method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			// API 路由處理
			if (path === '/' && method === 'GET') {
				return new Response(JSON.stringify({
					message: 'Marelle 電商 API - 前後台分離版本',
					version: '2.0.0',
					endpoints: {
						front_user: [
							'POST /api/front/register - 前台用戶註冊',
							'POST /api/front/login - 前台用戶登入',
							'GET /api/front/profile - 獲取用戶資料',
							'GET /api/front/orders - 獲取用戶訂單'
						],
						admin: [
							'POST /api/admin/login - 管理員登入',
							'POST /api/admin/create-admin - 創建新管理員',
							'GET /api/admin/users - 獲取前台用戶列表',
							'GET /api/admin/orders - 獲取所有訂單'
						],
						products: [
							'GET /api/products - 獲取所有產品',
							'POST /api/admin/products - 創建新產品'
						],
						files: [
							'POST /api/upload - 上傳檔案',
							'GET /api/file/:key - 下載檔案'
						]
					}
				}), {
					headers: { ...corsHeaders, 'Content-Type': 'application/json' }
				});
			}

			// 前台用戶 API
			if (path === '/api/front/register' && method === 'POST') {
				return await registerFrontUser(request, env);
			}
			if (path === '/api/front/login' && method === 'POST') {
				return await loginFrontUser(request, env);
			}
			if (path === '/api/front/profile' && method === 'GET') {
				return await getFrontUserProfile(request, env);
			}
			if (path === '/api/front/orders' && method === 'GET') {
				return await getFrontUserOrders(request, env);
			}

			// 後台管理員 API
			if (path === '/api/admin/login' && method === 'POST') {
				return await loginAdmin(request, env);
			}
			if (path === '/api/admin/create-admin' && method === 'POST') {
				return await createAdmin(request, env);
			}
			if (path === '/api/admin/users' && method === 'GET') {
				return await getAdminUsers(request, env);
			}
			if (path === '/api/admin/orders' && method === 'GET') {
				return await getAdminOrders(request, env);
			}

			// 產品 API
			if (path === '/api/products' && method === 'GET') {
				return await getProducts(env);
			}
			if (path === '/api/admin/products' && method === 'POST') {
				return await createProduct(request, env);
			}

			// 檔案上傳下載
			if (path === '/api/upload' && method === 'POST') {
				return await uploadFile(request, env);
			}
			if (path.startsWith('/api/file/') && method === 'GET') {
				const key = path.replace('/api/file/', '');
				return await downloadFile(key, env);
			}

			return new Response('Not Found', { 
				status: 404, 
				headers: corsHeaders 
			});

		} catch (error) {
			console.error('Error:', error);
			return new Response(JSON.stringify({ 
				error: 'Internal Server Error',
				message: error instanceof Error ? error.message : 'Unknown error'
			}), {
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}
	},
} satisfies ExportedHandler<Env>;

// 工具函數
function generateSessionId(): string {
	return crypto.randomUUID();
}

async function hashPassword(password: string): Promise<string> {
	// 簡單的密碼雜湊，生產環境應使用 bcrypt
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
	const inputHash = await hashPassword(password);
	return inputHash === hash;
}

function getAuthToken(request: Request): string | null {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}
	return authHeader.substring(7);
}

async function verifySession(sessionId: string, env: Env): Promise<Session | null> {
	const result = await env.my_database.prepare(
		'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
	).bind(sessionId).first();
	
	return result as Session | null;
}

// 前台用戶相關函數
async function registerFrontUser(request: Request, env: Env): Promise<Response> {
	const userData: FrontUser = await request.json() as FrontUser;
	
	if (!userData.name || !userData.email || !userData.password) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Name, email and password are required'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	// 檢查 email 是否已存在
	const existingUser = await env.my_database.prepare(
		'SELECT id FROM front_users WHERE email = ?'
	).bind(userData.email).first();

	if (existingUser) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Email already registered'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const passwordHash = await hashPassword(userData.password);
	
	const result = await env.my_database.prepare(
		'INSERT INTO front_users (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?) RETURNING id, name, email, phone, address, created_at'
	).bind(
		userData.name, 
		userData.email, 
		passwordHash, 
		userData.phone || null,
		userData.address || null
	).first();

	// 創建會話
	const sessionId = generateSessionId();
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7天後過期
	
	await env.my_database.prepare(
		'INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)'
	).bind(sessionId, result?.id, 'front_user', expiresAt).run();

	return new Response(JSON.stringify({
		success: true,
		data: {
			user: result,
			token: sessionId
		}
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

async function loginFrontUser(request: Request, env: Env): Promise<Response> {
	const loginData = await request.json() as { email: string; password: string };
	
	if (!loginData.email || !loginData.password) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Email and password are required'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const user = await env.my_database.prepare(
		'SELECT id, name, email, password_hash, phone, address FROM front_users WHERE email = ? AND is_active = 1'
	).bind(loginData.email).first();

	if (!user || !await verifyPassword(loginData.password, user.password_hash)) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Invalid email or password'
		}), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	// 創建會話
	const sessionId = generateSessionId();
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
	
	await env.my_database.prepare(
		'INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)'
	).bind(sessionId, user.id, 'front_user', expiresAt).run();

	// 移除密碼雜湊
	delete user.password_hash;

	return new Response(JSON.stringify({
		success: true,
		data: {
			user: user,
			token: sessionId
		}
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

async function getFrontUserProfile(request: Request, env: Env): Promise<Response> {
	const token = getAuthToken(request);
	if (!token) {
		return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const session = await verifySession(token, env);
	if (!session || session.user_type !== 'front_user') {
		return new Response(JSON.stringify({ success: false, error: 'Invalid session' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const user = await env.my_database.prepare(
		'SELECT id, name, email, phone, address, created_at FROM front_users WHERE id = ?'
	).bind(session.user_id).first();

	return new Response(JSON.stringify({
		success: true,
		data: user
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

async function getFrontUserOrders(request: Request, env: Env): Promise<Response> {
	const token = getAuthToken(request);
	if (!token) {
		return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const session = await verifySession(token, env);
	if (!session || session.user_type !== 'front_user') {
		return new Response(JSON.stringify({ success: false, error: 'Invalid session' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const orders = await env.my_database.prepare(`
		SELECT o.*, GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
		FROM orders o 
		LEFT JOIN order_items oi ON o.id = oi.order_id
		LEFT JOIN products p ON oi.product_id = p.id
		WHERE o.user_id = ?
		GROUP BY o.id
		ORDER BY o.created_at DESC
	`).bind(session.user_id).all();

	return new Response(JSON.stringify({
		success: true,
		data: orders.results
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

// 後台管理員相關函數
async function loginAdmin(request: Request, env: Env): Promise<Response> {
	const loginData = await request.json() as { username: string; password: string };
	
	if (!loginData.username || !loginData.password) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Username and password are required'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const admin = await env.my_database.prepare(
		'SELECT id, username, email, password_hash, role, permissions FROM admin_users WHERE username = ? AND is_active = 1'
	).bind(loginData.username).first();

	if (!admin || !await verifyPassword(loginData.password, admin.password_hash)) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Invalid username or password'
		}), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	// 更新最後登入時間
	await env.my_database.prepare(
		'UPDATE admin_users SET last_login_at = datetime("now") WHERE id = ?'
	).bind(admin.id).run();

	// 創建會話
	const sessionId = generateSessionId();
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24小時後過期
	
	await env.my_database.prepare(
		'INSERT INTO sessions (id, admin_id, user_type, expires_at) VALUES (?, ?, ?, ?)'
	).bind(sessionId, admin.id, 'admin_user', expiresAt).run();

	// 移除密碼雜湊
	delete admin.password_hash;

	return new Response(JSON.stringify({
		success: true,
		data: {
			admin: admin,
			token: sessionId
		}
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

async function createAdmin(request: Request, env: Env): Promise<Response> {
	const token = getAuthToken(request);
	if (!token) {
		return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const session = await verifySession(token, env);
	if (!session || session.user_type !== 'admin_user') {
		return new Response(JSON.stringify({ success: false, error: 'Invalid session' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	// 檢查是否為超級管理員
	const currentAdmin = await env.my_database.prepare(
		'SELECT role FROM admin_users WHERE id = ?'
	).bind(session.admin_id).first();

	if (!currentAdmin || currentAdmin.role !== 'super_admin') {
		return new Response(JSON.stringify({
			success: false,
			error: 'Only super admin can create new admins'
		}), {
			status: 403,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const adminData: AdminUser = await request.json();
	
	if (!adminData.username || !adminData.email || !adminData.password) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Username, email and password are required'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	// 檢查用戶名和 email 是否已存在
	const existingAdmin = await env.my_database.prepare(
		'SELECT id FROM admin_users WHERE username = ? OR email = ?'
	).bind(adminData.username, adminData.email).first();

	if (existingAdmin) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Username or email already exists'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const passwordHash = await hashPassword(adminData.password);
	
	const result = await env.my_database.prepare(
		'INSERT INTO admin_users (username, email, password_hash, role, permissions, created_by) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, username, email, role, created_at'
	).bind(
		adminData.username, 
		adminData.email, 
		passwordHash, 
		adminData.role || 'admin',
		adminData.permissions || '{}',
		session.admin_id
	).first();

	return new Response(JSON.stringify({
		success: true,
		data: result
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

async function getAdminUsers(request: Request, env: Env): Promise<Response> {
	const token = getAuthToken(request);
	if (!token) {
		return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const session = await verifySession(token, env);
	if (!session || session.user_type !== 'admin_user') {
		return new Response(JSON.stringify({ success: false, error: 'Invalid session' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const users = await env.my_database.prepare(
		'SELECT id, name, email, phone, created_at, is_active FROM front_users ORDER BY created_at DESC'
	).all();

	return new Response(JSON.stringify({
		success: true,
		data: users.results
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

async function getAdminOrders(request: Request, env: Env): Promise<Response> {
	const token = getAuthToken(request);
	if (!token) {
		return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const session = await verifySession(token, env);
	if (!session || session.user_type !== 'admin_user') {
		return new Response(JSON.stringify({ success: false, error: 'Invalid session' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const orders = await env.my_database.prepare(`
		SELECT o.*, u.name as user_name, u.email as user_email,
		       GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
		FROM orders o 
		LEFT JOIN front_users u ON o.user_id = u.id
		LEFT JOIN order_items oi ON o.id = oi.order_id
		LEFT JOIN products p ON oi.product_id = p.id
		GROUP BY o.id
		ORDER BY o.created_at DESC
	`).all();

	return new Response(JSON.stringify({
		success: true,
		data: orders.results
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

// 產品相關函數
async function getProducts(env: Env): Promise<Response> {
	const products = await env.my_database.prepare(
		'SELECT id, name, description, price, stock, image_url, category FROM products WHERE is_active = 1 ORDER BY created_at DESC'
	).all();
	
	return new Response(JSON.stringify({
		success: true,
		data: products.results
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

async function createProduct(request: Request, env: Env): Promise<Response> {
	const token = getAuthToken(request);
	if (!token) {
		return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const session = await verifySession(token, env);
	if (!session || session.user_type !== 'admin_user') {
		return new Response(JSON.stringify({ success: false, error: 'Invalid session' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const product: Product = await request.json();
	
	if (!product.name || !product.price) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Name and price are required'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const result = await env.my_database.prepare(
		'INSERT INTO products (name, description, price, stock, image_url, category, created_by) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *'
	).bind(
		product.name, 
		product.description || '', 
		product.price, 
		product.stock || 0,
		product.image_url || '',
		product.category || '',
		session.admin_id
	).first();

	return new Response(JSON.stringify({
		success: true,
		data: result
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

// 檔案上傳下載函數（保持不變）
async function uploadFile(request: Request, env: Env): Promise<Response> {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	
	if (!file) {
		return new Response(JSON.stringify({
			success: false,
			error: 'No file provided'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	const key = `uploads/${Date.now()}-${file.name}`;
	const arrayBuffer = await file.arrayBuffer();
	
	await env.my_bucket.put(key, arrayBuffer, {
		httpMetadata: {
			contentType: file.type,
		}
	});

	return new Response(JSON.stringify({
		success: true,
		data: {
			key: key,
			filename: file.name,
			size: file.size,
			type: file.type,
			url: `/api/file/${key}`
		}
	}), {
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

async function downloadFile(key: string, env: Env): Promise<Response> {
	const object = await env.my_bucket.get(key);
	
	if (!object) {
		return new Response('File not found', { 
			status: 404,
			headers: { 'Access-Control-Allow-Origin': '*' }
		});
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('Access-Control-Allow-Origin', '*');
	
	return new Response(object.body, { headers });
}
