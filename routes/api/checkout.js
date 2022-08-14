const express = require('express');
const router = express.Router();
const cartServices = require('../../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async function (req, res) {
    //create the line items
    const items = await cartServices.getCart(req.session.user.id)
    let lineItems = [];
    let meta = [] //store variant id and how amny the user is buying
    for (let item of items) {
        const eachLineItem = {
            //each keys in line items is prefixed by stripe
            name: item.related('variant').related('product').get('name'),
            images: item.related('variant').related('product').get('image_url'),
            amount: item.related('variant').related('product').get('cost'),
            quantity: item.get('quantity'),
            currency: 'SGD'
        }
        //check if there is images
        if (item.related('variant').related('product').get('image_url')) {
            //stripe expect image to be in array
            eachLineItem.images = [item.related('variant').get('image_url')]
        }
        lineItems.push(eachLineItem)
        meta.push({
            variant_id: item.get('variant_id'),
            quantity: item.get('quantity')
        })
    }
    //create stripe payment
    let metaData = JSON.stringify(meta)
    //the key/value pairs in the payment are defined by Stripes
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        //in the metadata the keys are up to us but values must be a string
        metadata: {
            orders: metaData,
            customer_id: req.session.user.id
        }
    }

    //register payment session
    let stripeSession = await Stripe.checkout.sessions.create(payment);

    //use stripe to pay
    res.render('checkout/checkout',{
        sessionId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })

})

router.get('/success', function(req,res){
    res.send('Payment success')
})

router.get('/cancelled', function(req,res){
    res.send('Payment cancelled')
})

module.exports = router