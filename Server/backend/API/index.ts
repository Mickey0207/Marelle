import { Hono } from 'hono'
import authApp from './auth/index'
import adminApp from './admin/index'
import frontendAuthApp from '../../fronted/API/auth/index'

const app = new Hono()
app.route('/', authApp)
app.route('/', adminApp)
app.route('/', frontendAuthApp)

export default app
