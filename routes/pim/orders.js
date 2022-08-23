const express = require('express');
const router = express.Router();

const { bootstrapField, createOrderSearchForm, createOrderStatusForm, orderStatusForm } = require('../../forms');
// const {

// } = require('../../services/order_services');

const { 
    createOrder,
    createOrderItem,
    getAllOrders,
    getOrderById,
    getOrderItemsByOrderId,
    getAllOrderStatuses,
    updateOrderStatus,
    deleteOrder
 } = require('../../dal/orders')
const { Order, OrderItem } = require('../../models')

router.get('/', async (req, res) => {
    
    const orderSearchForm = createOrderSearchForm(
        await getAllOrderStatuses
    )

    let searchQuery = Order.collection()

    orderSearchForm.handle(req, {
        empty: async (form) => {
            const orders = await searchQuery.fetch({
                withRelated: ['customer', 'orderStatus', 'orderItems']
            })
            const searchResultsCount = products.toJSON().length
            res.render('orders/index', {
                orders: orders.toJSON(),
                searchResultsCount,
                form: form.toHTML(bootstrapField)
            })
        },
        error: async (form) => {
            const orders = await searchQuery.fetch({
                withRelated: ['customer', 'orderStatus', 'orderItems']
            })
            const searchResultsCount = orders.toJSON().length
            res.render('orders/index', {
                orders: orders.toJSON(),
                searchResultsCount,
                form: form.toHTML(bootstrapField)
            })
        },
        success: async (form) => {
            if (form.data.order_id && form.data.order_id != "0") {
                searchQuery.where('order_id', '=', `${form.data.order_id}`)
            }
            if (form.data.customer_name) {
                searchQuery.query('join', 'customers', 'customers.id', 'customer_id')
                .where('first_name', 'last_name', 'like', `%${form.data.customer_name}%`)
            }
            if (form.data.customer_email) {
                searchQuery.query('join', 'customers', 'customers.id', 'customer_id')
                .where('email', 'like', `%${form.data.customer_email}%`)
            }
            if (form.data.from_order_date) {
                searchQuery.where('order_date', '>=', form.data.from_order_date)
            }
            if (form.data.to_order_date) {
                searchQuery.where('order_date', '<=', form.data.to_order_date);
            }
            if (form.data.order_status_id && form.data.order_status_id != 0) {
                query.where('order_status_id', '=', form.data.order_status_id);
              }

            const orders = await searchQuery.fetch({
                withRelated: ['customer', 'orderStatus', 'orderItems']
            })

            const searchResultsCount = orders.toJSON().length

            res.render('orders/index', {
                orders: orders.toJSON(),
                searchResultsCount,
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:order_id/items', async (req, res) => {
    const order = await getOrderById(req.params.order_id)
    const orderItems = await getOrderItemsByOrderId(req.parama.order_id)

    const orderStatusForm = createOrderStatusForm(await getAllOrderStatuses)

    orderStatusForm.fields.order_status_id = order.get('status_id')

    res.render('orders/order-items', {
        order: order.toJSON(),
        orderItems: orderItems.toJSON(),
        statusForm: statusForm.toHTML(bootstrapField)
    })
})

//update order status
router.post('/:order_id/items'), async (req, res) => {
    const order = await updateOrderStatus(req.params.order_id, req.body.status_id)
    
    req.flash('success_messages', 'Order status updated')
    res.redirect(`/${req.params.order_id}/items`)
}

router.post('/:order_id/delete', async (req, res) => {
    //tocheck: if order complete, do not let them delete
    const order = await getOrderById(req.params.order_id)

    if (order.toJSON().order_status.order_status === "Completed / Delivered") {
        req.flash('error_messages', 'Completed orders cannot be deleted.')
        res.redirect('/orders')
    } else {
        await deleteOrder(req.params/order_id)
        req.flash('success_messages', 'Order has been deleted.')
        res.redirect('/orders')
    }
   
})

module.exports = router