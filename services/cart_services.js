const cartDataLayer = require('../dal/cart_items')

const addToCart = async (customerId, productId, quantity) => {
    //check if variant id is already in shopping cart
    const cartItem = await cartDataLayer.getCartItemByCustomerAndVariant(customerId, productId)
    if (!cartItem){
    //if not then create new
    await cartDataLayer.createCartItem(customerId, productId, quantity)
   
    }else {
    //if yes, increase qty of variant
       await cartDataLayer.updateQuantity(customerId, productId, cartItem.get('quantity') + 1)
    }
    return true;   
}

const getCart = async (customerId) => {
    return cartDataLayer.getCart(customerId);
}

const updateQuantity = async (customerId, productId, newQuantity) => {
    //todo: ceck if the qty matches the biz rules
    return cartDataLayer.updateQuantity(customerId, productId, newQuantity);
}


const remove = (customerId, productId) => {
    return cartDataLayer.removeCartItem(customerId, productId)
}

module.exports = {
    addToCart, 
    getCart, 
    updateQuantity, 
    remove
}