const express = require('express');
const router = express.Router();

const {
    getOrdersByCustomerId
} = require('../../dal/orders')
const { Order, OrderItem } = require('../../models')

router.get('/', async (req, res) => {
   
    try {
        const orders = await getOrdersByCustomerId(req.customer.id)
        res.json(orders)
    } catch(error) {
        res.send(error)
    }
})

module.exports = router
