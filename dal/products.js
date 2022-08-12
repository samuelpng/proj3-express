//inport in product model
const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure, Variant } = require('../models')

const getAllBrands = async () => {
    return await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('brand_name')];
    })
}

const getAllCollections = async () => {
    return await Collection.fetchAll().map((collection) => {
        return [collection.get('id'), collection.get('collection')];
    })
}

const getAllMaterials = async () => {
    return await Material.fetchAll().map((material) => {
        return [material.get('id'), material.get('material')];
    })
}

const getAllSurfaces = async () => {
    return await Surface.fetchAll().map((surface) => {
        return [surface.get('id'), surface.get('surface')];
    })
}

const getAllColours = async () => {
    return await Colour.fetchAll().map((colour) => {
        return [colour.get('id'), colour.get('colour')];
    })
}

const getAllClosures = async () => {
    return await Closure.fetchAll().map((closure) => {
        return [closure.get('id'), closure.get('closure')];
    })
}

const getAllCuttings = async () => {
    return await Cutting.fetchAll().map((cutting) => {
        return [cutting.get('id'), cutting.get('cutting')];
    })
}

const getAllPositions = async () => {
    return await Position.fetchAll().map((position) => {
        return [position.get('id'), position.get('position')];
    })
}

const getProductById = async (productId) => {
    return await Product.where({
        'id': parseInt(productId)
    }).fetch({
        require: true,
        withRelated: ['colour', 'closure', 'cutting', 'collection', 'surface', 'material', 'brand', 'positions']
    });
}

const getVariantsByProductId = async (productId) => {
    return await Variant.where({
        'product_id': parseInt(productId)
    }).fetchAll({
        require: false,
        withRelated: ['product', 'size']
    })
}

const getVariantById = async (variantId) => {
    return await Variant.where({
        'id': parseInt(variantId)
    }).fetch({
        require: true,
        withRelated: ['colour', 'closure', 'cutting', 'collection', 'surface', 'material', 'brand', 'positions']
    })
}

module.exports = {
    getAllBrands, 
    getAllCollections,
    getAllMaterials,
    getAllSurfaces,
    getAllColours,
    getAllClosures,
    getAllCuttings,
    getAllPositions,
    getProductById,
    getVariantsByProductId,
    getVariantById
}