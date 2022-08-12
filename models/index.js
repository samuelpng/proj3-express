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
        this.hasMany('Variant')
    }
})

const Variant = bookshelf.model('Variant', {
    tableName: 'variants',
    product: function () {
        this.belongsTo('Product')
    },
    size: function () {
        this.belongsTo('Size')
    }
})

const User = bookshelf.model('User',{
    tableName: 'users'
})

module.exports = { Product, Colour, Closure, Cutting, Collection, Surface, Material, Brand, Position, Size, Variant, User };