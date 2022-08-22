const { OrderItem, Order, OrderStatus, Customer } = require("../models");

const getOrderById = async (orderId) => {
    return await Order.where({
        id: orderId 
    }).fetch({
        require: false,
        withRelated: ['order_status', 'customer']
    })
}