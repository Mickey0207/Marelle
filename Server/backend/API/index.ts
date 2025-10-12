import { Hono } from 'hono'
import authApp from './auth/index'
import adminApp from './admin/index'

const app = new Hono()
app.route('/', authApp)
app.route('/', adminApp)

export default app
