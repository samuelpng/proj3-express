const cartServices = require('../../services/cart_services')
const express = require('express')
const { checkIfAuthenticated } = require('../../middlewares');
// const { Router } = require('express')

const router = express.Router()

router.get('/', async function(req,res) {
    const cartItems = await cartServices.getCart(req.session.user.id)
    res.render('cart/index', {
        'cartItems': cartItems.toJSON()
    })
})

router.get('/:variant_id/add', async function(req,res) {
    const userId = req.session.user.id;
    const posterId = req.params.variant_id
    await cartServices.addToCart(userId, posterId, 1)
    req.flash('success_messages', 'Product added to cart successfully')
    res.redirect('/cart/')
})

router.post('/:variant_id/update', async function(req,res){
    const userId = req.session.user.id;
    const posterId = req.params.variant_id
    if (req.body.newQuantity > 0){
        await cartServices.updateQuantity(userId, posterId, req.body.newQuantity);
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