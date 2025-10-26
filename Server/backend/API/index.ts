import { Hono } from 'hono'
import authApp from './auth/index'
import adminApp from './admin/index'
import categoriesApp from './categories/index'
import productsApp from './products/index'
import frontendAuthApp from '../../fronted/API/auth/index'
import frontendAddressesApp from '../../fronted/API/addresses/index'
import frontendEcpayApp from '../../fronted/API/ecpay/index'
import frontendCartApp from '../../fronted/API/cart/index'
import frontendCategoriesApp from '../../fronted/API/categories/index'
import frontendProductsApp from '../../fronted/API/products/index'
import frontendLogisticsEcpayApp from '../../fronted/API/logistics/ecpay/index'
import ordersApp from './orders/index'

const app = new Hono()
app.route('/', authApp)
app.route('/', adminApp)
app.route('/', categoriesApp)
app.route('/', productsApp)
app.route('/', frontendAuthApp)
app.route('/', frontendAddressesApp)
app.route('/', frontendEcpayApp)
app.route('/', frontendCartApp)
app.route('/', frontendCategoriesApp)
app.route('/', frontendProductsApp)
app.route('/', frontendLogisticsEcpayApp)
app.route('/', ordersApp)

export default app
