if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
//add secret keys via .env
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishableKey = process.env.PUBLISHABLE_KEY

console.log(stripePublishableKey, stripeSecretKey);
const express = require ('express');
//create express app
const app = express();
const fs = require('fs');


//set view engine for express app as ejs
app.set('view engine', 'ejs');
//static html files live in public folder
app.use(express.static('public'))


//add get route for store
app.get('/store', function(req,res) {
    fs.readFile('items.json', function(err, data) {
    if (err) {
        //if err send 500 error code
        res.status(500).end()
    } else {
        //else render store.ejs by parsing JSON from items.json
        //using store.ejs instead of store.html to use template
        res.render('store.ejs', {
            //send json to HTML template
            items: JSON.parse(data),
            //send stripe public key
            stripePublishableKey: stripePublishableKey
        });
        }
    })
});

//start server
app.listen(3000);