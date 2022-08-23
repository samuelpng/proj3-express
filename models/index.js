const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName: 'products',

    colour: function () {
        return this.belongsTo('Colour');
    },
    closure: function () {
        return this.belongsTo('Closure');
    },
    cutting: function () {
        return this.belongsTo('Cutting');
    },
    collection: function () {
        return this.belongsTo('Collection');
    },
    surface: function () {
        return this.belongsTo('Surface');
    },
    material: function () {
        return this.belongsTo('Material');
    },
    brand: function () {
        return this.belongsTo('Brand');
    },
    positions: function () {
        return this.belongsToMany('Position');
    },
    variants: function () {
        return this.hasMany('Variant');
    }
})

const Colour = bookshelf.model('Colour', {
    tableName: 'colours',
    products: function () {
        return this.hasMany('Product');
    }
});

const Closure = bookshelf.model('Closure', {
    tableName: 'closures',
    products: function () {
        return this.hasMany('Product');
    }
});

const Cutting = bookshelf.model('Cutting', {
    tableName: 'cuttings',
    products: function () {
        return this.hasMany('Product');
    }
});

const Collection = bookshelf.model('Collection', {
    tableName: 'collections',
    products: function () {
        return this.hasMany('Product');
    }
});

const Surface = bookshelf.model('Surface', {
    tableName: 'surfaces',
    products: function () {
        return this.hasMany('Product');
    }
});

const Material = bookshelf.model('Material', {
    tableName: 'materials',
    products: function () {
        return this.hasMany('Product');
    }
});

const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    products: function () {
        return this.hasMany('Product');
    }
});

const Position = bookshelf.model('Position', {
    tableName: 'positions',
    products: function () {
        return this.belongsToMany('Product')
    }
})

const Size = bookshelf.model('Size', {
    tableName: 'sizes',
    variants: function () {
        return this.hasMany('Variant')
    }
})

const Variant = bookshelf.model('Variant', {
    tableName: 'variants',
    product: function () {
        return this.belongsTo('Product')
    },
    size: function () {
        return this.belongsTo('Size')
    },
    cartItems: function() {
        return this.hasMany('CartItem')
    },
    orderItems: function() {
        return this.hasMany('OrderItem')
    }
})

const User = bookshelf.model('User',{
    tableName: 'users',
    userType: function() {
        return this.belongsTo('UserType')
    }
})

const UserType = bookshelf.model('UserType', {
    tableName: 'user_types',
    users: function() {
        return this.hasMany('User')
    }
})

const Customer = bookshelf.model('Customer', {
    tableName: 'customers',
    cartItems: function () {
        return this.hasMany('cartItem');
      },
    orders: function() {
        return this.hasMany('Order')
    }
})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    variant: function () {
        return this.belongsTo('Variant')
    },
    customer: function () {
        return this.belongsTo('Customer');
      },
})

const BlacklistedToken = bookshelf.model('BlacklistedToken',{
    tableName: 'blacklisted_tokens'
})

const OrderStatus = bookshelf.model('OrderStatus', {
    tableName: 'order_statuses',
    orders: function () {
        return this.hasMany('Order');
      }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    customer: function () {
        return this.belongsTo('Customer');
      },
    orderStatus: function () {
        return this.belongsTo('OrderStatus');
    },
    orderItems: function () {
        return this.hasMany('OrderItem')
    }
})

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    order: function() {
        return this.belongsTo('Order')
    },
    variant: function () {
        return this.belongsTo('Variant')
    }
})

module.exports = { 
    Product, Colour, Closure, Cutting, 
    Collection, Surface, Material, Brand, 
    Position, Size, Variant, User, 
    UserType, Customer, CartItem, BlacklistedToken,
    OrderStatus, Order, OrderItem 
};