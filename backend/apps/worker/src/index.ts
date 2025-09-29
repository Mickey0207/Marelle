import { cors } from 'hono/cors'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ensureSchema } from '../database/schema/sql'
import { seed } from '../database/schema/seed'

type Bindings = { DB: D1Database; ENVIRONMENT: string; JWT_SECRET?: string }

// zod-first OpenAPI app
const openapi = new OpenAPIHono<{ Bindings: Bindings }>()

const HealthSchema = z.object({ success: z.boolean(), data: z.object({ status: z.literal('ok') }) })

openapi.openapi(
	createRoute({
		method: 'get',
		path: '/api/health',
		responses: {
			200: {
				description: 'OK',
				content: { 'application/json': { schema: HealthSchema } },
			},
		},
		summary: 'Health check',
		tags: ['system'],
	}),
	(c) => c.json({ success: true as const, data: { status: 'ok' as const } })
)

	// Bootstrap schema/seed on first request (lazy)
	openapi.use('*', async (c, next) => {
		await ensureSchema(c.env.DB)
		await seed(c.env.DB)
		await next()
	})

	// Schemas
	const Email = z.string().email()
	const Password = z.string().min(12)

	// Auth routes
	openapi.openapi(
		createRoute({
			method: 'post',
			path: '/api/auth/login',
			request: {
				body: {
					content: {
						'application/json': {
							schema: z.object({ email: Email, password: Password }),
						},
					},
				},
			},
			responses: {
				200: {
					description: 'OK',
					content: {
						'application/json': {
							schema: z.object({ success: z.literal(true), data: z.object({ accessToken: z.string() }) }),
						},
					},
				},
				401: { description: 'Invalid credentials' },
			},
			tags: ['auth'],
			summary: 'Admin login',
		}),
		async (c) => {
			// TODO: verify password with PBKDF2 JSON
			const { email } = await c.req.json()
			// Temporary allow default admin for skeleton
			const token = btoa(`${email}:${Date.now()}`)
			return c.json({ success: true as const, data: { accessToken: token } })
		}
	)

	// Admin list
	openapi.openapi(
		createRoute({
			method: 'get',
			path: '/api/admin/list',
			responses: {
				200: {
					description: 'OK',
					content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), email: z.string(), display_name: z.string().nullable(), line_display_name: z.string().nullable() })) }) } },
				},
			},
			tags: ['admin'],
			summary: 'List admins',
		}),
		async (c) => {
			const rs = await c.env.DB.prepare('SELECT id,email,display_name,line_display_name FROM admins').all()
			return c.json({ success: true as const, data: (rs.results ?? []) as any[] })
		}
	)

	// Settings: departments/roles/modules options
	for (const def of [
		{ table: 'departments', id: 'id', name: 'name', path: 'departments' },
		{ table: 'roles', id: 'id', name: 'name', path: 'roles' },
		{ table: 'modules', id: 'id', name: 'name', path: 'modules' },
	] as const) {
		openapi.openapi(
			createRoute({
				method: 'get',
				path: `/api/settings/${def.path}`,
				responses: { 200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), name: z.string() })) }) } } } },
				tags: ['settings'],
				summary: `List ${def.path}`,
			}),
			async (c) => {
				const rs = await c.env.DB.prepare(`SELECT ${def.id} as id, ${def.name} as name FROM ${def.table}`).all()
				return c.json({ success: true as const, data: (rs.results ?? []) as any[] })
			}
		)
	}

// Serve spec/docs from the openapi app
openapi.doc('/openapi.json', {
	openapi: '3.1.0',
	info: { title: 'Marelle API', version: '0.1.0' },
})

openapi.get('/docs', (c) =>
	c.html(`<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<title>Marelle API Docs</title>
			<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
		</head>
		<body>
			<div id="swagger-ui"></div>
			<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
			<script>
				window.onload = () => {
					window.ui = SwaggerUIBundle({ url: '/openapi.json', dom_id: '#swagger-ui' })
				}
			</script>
		</body>
	</html>`)
)

	// Mount CORS to openapi app as well
	openapi.use('*', cors({ origin: ['http://localhost:3001', 'http://127.0.0.1:3001'], allowHeaders: ['*'], allowMethods: ['GET','POST','PUT','DELETE','OPTIONS'], credentials: true }))

	export default openapi
