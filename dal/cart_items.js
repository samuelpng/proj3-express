const { CartItem } = require('../models')

const getCart = async (customerId) => {
    return await CartItem.collection()
    .where({
        customer_id: customerId
    }).orderBy('id', 'desc').fetch({
        require: false,
        withRelated: ['variant', 'variant.product', 'variant.size']
    })
}

const getCartItemByCustomerAndVariant = async (customerId, variantId) => {
    return await CartItem.where({
        customer_id: customerId,
        variant_id: variantId
    }).fetch({
        require: false
    })
}

const createCartItem = async (customerId, variantId, quantity) => {
    let cartItem = new CartItem({
        customer_id: customerId,
        variant_id: variantId,
        quantity: quantity
    })
    await cartItem.save();
    return cartItem;
}

const removeCartItem = async (customerId, variantId) => {

    let cartItem = await getCartItemByCustomerAndVariant(customerId, variantId);

    if (cartItem) {
        await cartItem.destroy();
        return true;
    } else {
        return false
    }
}

const updateQuantity = async (customerId, variantId, newQuantity) => {
    const cartItem = await getCartItemByCustomerAndVariant(customerId, variantId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    } else {
        return false;
    }

}

module.exports = { 
    getCart, 
    getCartItemByCustomerAndVariant, 
    createCartItem, 
    removeCartItem, 
    updateQuantity 
}
