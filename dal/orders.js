const { OrderItem, Order, OrderStatus, Customer } = require("../models");

const createOrder = async (orderData) => {
    const order = new Order(orderData);
    await order.save();

    return order
}

const createOrderItem = async (orderItemData) => {
    const orderItem = new OrderItem(orderItemData)
    await orderItem.save();

    return orderItem
}

const getAllOrders = async () => {
    const orders = await Order.collection().fetch({
        require: false,
        withRelated: ['customer', 'orderStatus', 'orderItems']
    })
}

const getAllOrderStatuses = async () => {
    const orderStatuses = await OrderStatus.fetchAll().map((orderStatus) => {
      return [orderStatus.get('id'), orderStatus.get('order_status')];
    });
    orderStatuses.unshift([0, '---Select One---']);
  
    return orderStatuses;
  };

const getOrderById = async (orderId) => {
    return await Order.where({
        id: orderId
    }).fetch({
        require: false,
        withRelated: ['customer', 'orderStatus']
    })
}

const getOrderItemsByOrderId = async (orderId) => {
    return await OrderItem.where({
        order_id: orderId 
    }).fetchAll({
        require: false,
        withRelated: ['variant', 'variant.product', 'variant.product.brand', 'variant.size']
    })
}



// const getOrderItemsByCustomerId = async (customerId) => {
//     return await Order.where({
//         customer_id: customerId
//     }).fetch({
//         require: false,
//         withRelated: ['variant', 'order']
//     })
// }

const updateOrderStatus = async (orderId, newOrderStatusId) => {
    const order = await getOrderById(orderId)
    order.set('order_status_id', newOrderStatusId)
    await order.save()
    return order
}

const deleteOrder = async (orderId) => {
    const order = await getOrderById(orderId)
    await order.destroy();
}

module.exports = {
    createOrder,
    createOrderItem,
    getAllOrders,
    getAllOrderStatuses,
    getOrderById,
    getOrderItemsByOrderId,
    updateOrderStatus,
    deleteOrder
}