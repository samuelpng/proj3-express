const express = require('express');
const router = express.Router();
const cartServices = require('../../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async function (req, res) {
    //create the line items
    const cartItems = await cartServices.getCart((req.session.user.id))
    let lineItems = [];
    let meta = [] //store variant id and how amny the user is buying
    for (let item of cartItems) {
        const eachLineItem = {
            //each keys in line items is prefixed by stripe
            name: item.related('variant').related('product').get('name'),
            images: [item.related('variant').get('image_url')],
            amount: item.related('variant').related('product').get('cost'),
            quantity: item.get('quantity'),
            currency: 'SGD'
        }

        // if (item.related('variant').related('product').get('image_url')) {

        //     eachLineItem.images = [item.related('variant').get('image_url')]
        // }
        lineItems.push(eachLineItem)
        meta.push({
            customer_id: item.get('customer_id'),
            variant_id: item.get('variant_id'),
            quantity: item.get('quantity')
        })
    }
    //create stripe payment
    let metaData = JSON.stringify(meta)
    //the key/value pairs in the payment are defined by Stripes
    const payment = {
        payment_method_types: ['card', 'grabpay'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        shipping_address_collection: {
            allowed_countries: ["SG"]
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: 0,
                        currency: "SGD",
                    },
                    display_name: "Free shipping",
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 3,
                        },
                        maximum: {
                            unit: "business_day",
                            value: 5,
                        },
                    },
                },
            }
        ],
        //in the metadata the keys are up to us but values must be a string
        metadata: {
            orders: metaData,
            customer_id: req.session.user.id
        }
    }

    //register payment session
    let stripeSession = await Stripe.checkout.sessions.create(payment);

    //use stripe to pay
    res.render('checkout/checkout', {
        sessionId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })

})

router.get('/success', function (req, res) {
    res.send('Payment success')
})

router.get('/cancelled', function (req, res) {
    res.send('Payment cancelled')
})

module.exports = router