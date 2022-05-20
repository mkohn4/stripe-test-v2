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
const stripe = require('stripe')(stripeSecretKey);


//set view engine for express app as ejs
app.set('view engine', 'ejs');
//parse body element as JSON
app.use(express.json());
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
//add post route for checkout
app.post('/purchase', function(req,res) {
    fs.readFile('items.json', function(err, data) {
    if (err) {
        //if err send 500 error code
        res.status(500).end()
    } else {
        //log server purchased to confirm purchase
        console.log('purchased');
        //parse data into json
        const itemsJSON = JSON.parse(data);
        //concatenate all music and merch items together
        const itemsArray = itemsJSON.music.concat(itemsJSON.merch);
        //start total at 0
        let total = 0;
        //for each element in the body of the fetch post request
        req.body.items.forEach(function(item) {
            //find the item in the local items.json based on id chosen by user and output json
            const itemJson = itemsArray.find(function(i) {
                return i.id == item.id;
            })
            //increment total by json Price and total quantity per item
            total = total+ itemJson.price * item.quantity
        })
        //create stripe charge
        stripe.charges.create({
            amount: total,
            source: req.body.stripeTokenId,
            currency: 'usd'
        }).then(function() {
            console.log('successful charge');
            res.json({message: 'Successfully Purchased Items'});
        }).catch(err => (console.log(err)));

        }
    })
});

//start server
app.listen(3000);