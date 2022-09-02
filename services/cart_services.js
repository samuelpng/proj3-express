const cartDataLayer = require('../dal/cart_items')
const productDataLayer = require('../dal/products');

const getStock = async function (variantId) {
    const variant = await productDataLayer.getVariantById(variantId);
    return parseInt(variant.get('stock'));
};

const addToCart = async (customerId, variantId, quantity) => {
    //check if variant id is already in shopping cart
    const cartItem = await cartDataLayer.getCartItemByCustomerAndVariant(customerId, variantId)

    const stock = await getStock(variantId);


    if (!cartItem) {
        //check that quantity does no exceed stock
        if (quantity > stock) {
            return false;
        }
        //if not then create new
        await cartDataLayer.createCartItem(customerId, variantId, quantity)

    } else {
        const cartQuantity = parseInt(cartItem.get('quantity'));
        if (cartQuantity + quantity > stock || cartQuantity + quantity > 10) {
            return false;
          }
        //if yes, increase qty of variant
        await cartDataLayer.updateQuantity(customerId, variantId, cartItem.get('quantity') + 1)
    }
    return true;
}

const getCart = async (customerId) => {
    return cartDataLayer.getCart(customerId);
}

const updateQuantity = async (customerId, variantId, newQuantity) => {
    //todo: check if the qty matches the biz rules
    return cartDataLayer.updateQuantity(customerId, variantId, newQuantity);
}


const remove = async (customerId, variantId) => {
    return cartDataLayer.removeCartItem(customerId, variantId)
}

const emptyCart = async (customer) => {
    const cartItems = await getCart(customer)
    for (let item of cartItems) {
        const variantId = item.get('variant_id')
        await remove(customer, variantId)
    }
}

module.exports = {
    getStock,
    addToCart,
    getCart,
    updateQuantity,
    remove, 
    emptyCart
}