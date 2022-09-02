const cartServices = require('../../services/cart_services')
const express = require('express')
const { checkIfAuthenticated } = require('../../middlewares');
// const { Router } = require('express')

const router = express.Router()

router.get('/', async function(req,res) {
    const cartItems = await cartServices.getCart(req.customer.id)
    res.json(cartItems)
})

router.post('/:variant_id/add', async function(req,res) {
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
    const customerId = parseInt(req.body.customer_id);
    const variantId = parseInt(req.params.variant_id);
    const newQuantity = parseInt(req.body.quantity)
    if (newQuantity > 0){
        await cartServices.updateQuantity(customerId, variantId, newQuantity);
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

router.delete('/:variant_id/delete', async function (req, res) {
    const customerId = parseInt(req.customer.id)
    const variantId = parseInt(req.params.variant_id)

    const result = await cartServices.remove(customerId, variantId);
    if (result) {
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

module.exports = router