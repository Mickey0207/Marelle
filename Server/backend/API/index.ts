import { Hono } from 'hono'
import authApp from './auth/index'
import adminApp from './admin/index'
import frontendAuthApp from '../../fronted/API/auth/index'
import frontendAddressesApp from '../../fronted/API/addresses/index'
import frontendEcpayApp from '../../fronted/API/ecpay/index'

const app = new Hono()
app.route('/', authApp)
app.route('/', adminApp)
app.route('/', frontendAuthApp)
app.route('/', frontendAddressesApp)
app.route('/', frontendEcpayApp)

export default app
