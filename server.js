if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishableKey = process.env.PUBLISHABLE_KEY

console.log(stripePublishableKey, stripeSecretKey);

const express = require ('express');
//create express app
const app = express();

//set view engine for express app as ejs
app.set('view engine', 'ejs');
//static html files live in public folder
app.use(express.static('public'))

//start server
app.listen(3000);