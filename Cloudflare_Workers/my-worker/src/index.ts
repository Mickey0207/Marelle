/**
 * Cloudflare Workers with D1 Database and R2 Storage
 * 
 * API Endpoints:
 * - GET /users - 獲取所有使用者
 * - POST /users - 創建新使用者
 * - GET /products - 獲取所有產品
 * - POST /products - 創建新產品
 * - POST /upload - 上傳檔案到 R2
 * - GET /file/:key - 從 R2 下載檔案
 */

interface User {
	id?: number;
	name: string;
	email: string;
	created_at?: string;
}

interface Product {
	id?: number;
	name: string;
	description?: string;
	price: number;
	stock: number;
	image_url?: string;
	created_at?: string;
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
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		// 處理 OPTIONS 請求
		if (method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			// 路由處理
			if (path === '/' && method === 'GET') {
				return new Response(JSON.stringify({
					message: 'Cloudflare Workers API with D1 & R2',
					endpoints: [
						'GET /users - 獲取所有使用者',
						'POST /users - 創建新使用者',
						'GET /products - 獲取所有產品', 
						'POST /products - 創建新產品',
						'POST /upload - 上傳檔案到 R2',
						'GET /file/:key - 從 R2 下載檔案'
					]
				}), {
					headers: { ...corsHeaders, 'Content-Type': 'application/json' }
				});
			}

			// 使用者相關 API
			if (path === '/users' && method === 'GET') {
				return await getUsers(env);
			}

			if (path === '/users' && method === 'POST') {
				return await createUser(request, env);
			}

			// 產品相關 API
			if (path === '/products' && method === 'GET') {
				return await getProducts(env);
			}

			if (path === '/products' && method === 'POST') {
				return await createProduct(request, env);
			}

			// R2 檔案上傳
			if (path === '/upload' && method === 'POST') {
				return await uploadFile(request, env);
			}

			// R2 檔案下載
			if (path.startsWith('/file/') && method === 'GET') {
				const key = path.replace('/file/', '');
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

// 獲取所有使用者
async function getUsers(env: Env): Promise<Response> {
	const result = await env.my_database.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
	
	return new Response(JSON.stringify({
		success: true,
		data: result.results
	}), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}

// 創建新使用者
async function createUser(request: Request, env: Env): Promise<Response> {
	const user: User = await request.json();
	
	if (!user.name || !user.email) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Name and email are required'
		}), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}

	const result = await env.my_database.prepare(
		'INSERT INTO users (name, email) VALUES (?, ?) RETURNING *'
	).bind(user.name, user.email).first();

	return new Response(JSON.stringify({
		success: true,
		data: result
	}), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}

// 獲取所有產品
async function getProducts(env: Env): Promise<Response> {
	const result = await env.my_database.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
	
	return new Response(JSON.stringify({
		success: true,
		data: result.results
	}), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}

// 創建新產品
async function createProduct(request: Request, env: Env): Promise<Response> {
	const product: Product = await request.json();
	
	if (!product.name || !product.price) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Name and price are required'
		}), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}

	const result = await env.my_database.prepare(
		'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?) RETURNING *'
	).bind(
		product.name, 
		product.description || '', 
		product.price, 
		product.stock || 0,
		product.image_url || ''
	).first();

	return new Response(JSON.stringify({
		success: true,
		data: result
	}), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}

// 上傳檔案到 R2
async function uploadFile(request: Request, env: Env): Promise<Response> {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	
	if (!file) {
		return new Response(JSON.stringify({
			success: false,
			error: 'No file provided'
		}), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
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
			url: `/file/${key}`
		}
	}), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}

// 從 R2 下載檔案
async function downloadFile(key: string, env: Env): Promise<Response> {
	const object = await env.my_bucket.get(key);
	
	if (!object) {
		return new Response('File not found', { 
			status: 404,
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		});
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('Access-Control-Allow-Origin', '*');
	
	return new Response(object.body, { headers });
}
