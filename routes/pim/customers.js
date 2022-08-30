const express = require("express");
const router = express.Router();


const {
    getCustomers
} = require('../../dal/customers')

router.get('/', async (req, res) => {
    const customers = await getCustomers()

    res.render('customers/index', {
        customers: customers.toJSON()
    })
})


module.exports = router;