var express = require('express');
var router = express.Router();
var fs = require('fs');

var Shopbag = require('../cart/cart');
var products = JSON.parse(fs.readFileSync('./src/products.json', 'utf8'));

router.get('/', function (req, res, next) {
    var productId = products && products[0].id;

    res.render('index',
        {
            title: 'Semusi Shopping Cart',
            products: products

        }
    );
});

router.get('/add/:id', function(req, res, next) {

    var productId = req.params.id;
    var cart = new Shopbag(req.session.cart ? req.session.cart : {});
    var product = products.filter(function(item) {
        return item.id == productId;
    });
    cart.add(product[0], productId);
    req.session.cart = cart;
    res.redirect('/');

});

router.get('/cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('cart', {
            products: null
        });
    }
    var cart = new Shopbag(req.session.cart);
    res.render('cart', {
        title: 'Semusi Shopping Cart',
        products: cart.getItems(),
        totalPrice: cart.totalPrice
    });
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Shopbag(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

module.exports = router;
