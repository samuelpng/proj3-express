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
    }
})

const User = bookshelf.model('User',{
    tableName: 'users',
    userType: function() {
        return this.belongsTo('User')
    }
})

const UserType = bookshelf.model('UserType', {
    tableName: 'user_types',
    users: function() {
        return this.hasMany('User')
    }
})

const Customer = bookshelf.model({
    tableName: 'customers',
    cartItems: function () {
        return this.hasMany('cartItem');
      },
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


module.exports = { Product, Colour, Closure, Cutting, Collection, Surface, Material, Brand, Position, Size, Variant, User, Customer, CartItem };