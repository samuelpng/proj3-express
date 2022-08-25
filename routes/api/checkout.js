const express = require('express');
const { createOrder, createOrderItem } = require('../../dal/orders');
const { getVariantById } = require('../../dal/products');
const router = express.Router();
const cartServices = require('../../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


//!!!!!!!  to change req.sessions.user.id to req.customer.customer_id !!!!!!!!!!!!

router.get('/', async function (req, res) {
    //1. create the line items
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

    //2. create stripe payment
    let metaData = JSON.stringify(meta)
    //the key/value pairs in the payment are defined by Stripes
    const payment = {
        payment_method_types: ['card', 'grabpay'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        billing_address_collection: 'required',
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
                    display_name: "Free Shipping",
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 3,
                        },
                        maximum: {
                            unit: "business_day",
                            value: 5,
                        }
                    }
                }
            },
            {
                shipping_rate_data: {
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: 500,
                        currency: "SGD",
                    },
                    display_name: "Express Delivery",
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 3,
                        },
                        maximum: {
                            unit: "business_day",
                            value: 5,
                        }
                    }
                }
            }
        ],
        mode: 'payment',
        //in the metadata the keys are up to us but values must be a string
        metadata: {
            orders: metaData
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

router.post('/process_payment', express.raw({ type: 'application/json' }), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event = null;

    try {
        event = Stripe.webhooks.constructEvent(
            payload,
            sigHeader,
            endpointSecret
        );
        if (event.type == "checkout.session.completed" || event.type == 'checkout.session.async_payment_succeeded') {
            let eventData = event.data.object

            const metadata = JSON.parse(event.data.object.metadata.orders);
            const customerId = metadata[0].customer_id; 

            const paymentIntent = await Stripe.paymentIntents.retrieve(
                eventData.payment_intent
            );
            
            const chargeId = paymentIntent.charges.data[0].id;
  
            const charge = await Stripe.charges.retrieve(chargeId);       

            const shippingRate = await Stripe.shippingRates.retrieve(
                eventData.shipping_rate
            );

            const orderData = {
                total_amount: eventData.amount_total,
                customer_id: customerId,
                order_status_id: 3, //set order status as paid
                payment_type: charge.payment_method_details.type,
                receipt_url: charge.receipt_url,
                order_date: new Date(event.created * 1000),
                payment_intent: eventData.payment_intent,
                shipping_option: shippingRate.display_name,
                billing_address_line1: eventData.customer_details.address.line1,
                billing_address_line2: eventData.customer_details.address.line2,
                billing_address_postal: eventData.customer_details.address.postal_code,
                billing_address_country: eventData.customer_details.address.country,
                shipping_address_line1: eventData.shipping.address.line1,
                shipping_address_line2: eventData.shipping.address.line2,
                shipping_address_postal: eventData.shipping.address.postal_code,
                shipping_address_country: eventData.shipping.address.country
            }
    
            const order = await createOrder(orderData)
    
            const orderId = order.get('id')
            const variantId = metadata[0].variant_id;
            const quantity =  metadata[0].quantity
    
            const orderItemData = {
                order_id: orderId,
                variant_id: variantId,
                quantity: quantity
            }
            await createOrderItem(orderItemData)

            //update stock variant
            const stock = await cartServices.getStock(variantId)
            
            const variant = await getVariantById(variantId)

            variant.set({stock: stock - quantity})

            await variant.save()
    
            //empty user cart
            await cartServices.emptyCart(customerId) //to change to customer Id
            res.status(201)
            res.json({
                'success': "Order successfully made"
            })
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router