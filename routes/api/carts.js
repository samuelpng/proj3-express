const cartServices = require('../../services/cart_services')
const express = require('express')
const { checkIfAuthenticated } = require('../../middlewares');
// const { Router } = require('express')

const router = express.Router()

router.get('/', async function(req,res) {
    console.log('customer Id =>', req.customer)
    const cartItems = await cartServices.getCart(req.customer.id)
    res.json(cartItems)
})

router.post('/:variant_id/add', async function(req,res) {
    console.log(req.body)
    const customerId = req.body.customer_id;
    const variantId = req.body.variant_id
    const addToCart = await cartServices.addToCart(customerId, variantId, 1)
    if (addToCart) {
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

router.post('/:variant_id/update', async function(req,res){
    const customerId = req.body.customer_id;
    const variantId = req.body.variant_id
    if (req.body.newQuantity > 0){
        await cartServices.updateQuantity(customerId, variantId, req.body.newQuantity);
        req.flash('success_messages', 'Quantity has been updated')
        res.redirect('/cart')
    } else {
        req.flash('error_messages', 'Quantity must be greater than 0')
        res.redirect('/cart');
    }
})

router.get('/:variant_id/delete', async function (req,res) {
    await cartServices.remove(req.session.user.id, req.params.variant_id)
    req.flash('success_messages', 'product has been removed from the shopping cart')
    res.redirect('/cart')
})

router.delete('/:variant/delete', async function (req, res) {
    const userId = req.session.user_id;
    const variantId = req.params.variant_id;

    const result = await cartServices.remove(userId, variantId);
    if (result) {
        sendResponse(res, 200, {
            message: 'Item successfully removed from cart'
        })
    } else {
        sendDatabaseError(res)
    }
})

module.exports = router