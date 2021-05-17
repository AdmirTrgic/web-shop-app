const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');

const errorHandler = require('./helpers/error-handler');

require('dotenv/config');

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
	.connect(process.env.CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		dbName: 'eshop-db',
	})
	.then(() => {
		console.log('Database connection is ready...');
	})
	.catch((err) => {
		console.log(err);
	});

app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000');
});
