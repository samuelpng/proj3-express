//inport in product model
const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure, Size, Variant } = require('../models')

const getAllProducts = async () => {
    return await Product.fetchAll({
        withRelated: ['colour', 'closure', 'cutting', 'collection', 'surface', 'material', 'brand']
    })
}

const getAllBrands = async () => {
    const brands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('brand_name')];
    })
    brands.unshift([0, '---- Select One ----'])
    return brands
}

const getAllCollections = async () => {
    const collections = await Collection.fetchAll().map((collection) => {
        return [collection.get('id'), collection.get('collection')];
    })
    collections.unshift([0, '---- Select One ----'])
    return collections
}

const getAllMaterials = async () => {
    const materials = await Material.fetchAll().map((material) => {
        return [material.get('id'), material.get('material')];
    })
    materials.unshift([0, '---- Select One ----'])
    return materials
}

const getAllSurfaces = async () => {
    const surfaces = await Surface.fetchAll().map((surface) => {
        return [surface.get('id'), surface.get('surface')];
    })
    surfaces.unshift([0, '---- Select One ----'])
    return surfaces
}

const getAllColours = async () => {
    const colours = await Colour.fetchAll().map((colour) => {
        return [colour.get('id'), colour.get('colour')];
    })
    colours.unshift([0, '---- Select One ----'])
    return colours
}

const getAllClosures = async () => {
    const closures = await Closure.fetchAll().map((closure) => {
        return [closure.get('id'), closure.get('closure')];
    })
    closures.unshift([0, '---- Select One ----'])
    return closures
}

const getAllCuttings = async () => {
    const cuttings = await Cutting.fetchAll().map((cutting) => {
        return [cutting.get('id'), cutting.get('cutting')];
    })
    cuttings.unshift([0, '---- Select One ----'])
    return cuttings
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
    }).orderBy('size_id').fetchAll({
        require: false,
        withRelated: ['product', 'size']
    })
}

const getAllSizes = async () => {
    const sizes = await Size.fetchAll().map((size) => {
        return [size.get('id'), size.get('size')];
    })
    sizes.unshift([0, '---- Select One ----'])
    return sizes
}

const getVariantById = async (variantId) => {
    return await Variant.where({
        'id': parseInt(variantId)
    }).fetch({
        require: false,
        withRelated: ['product','size']
    })
}

const getProductsOrderByDate = async () => {
    console.log('im here')
    return await Product.query(function(qb){
        qb.orderBy('date_created','DESC').limit(8); 
    }).fetchAll({
        withRelated: ['colour', 'closure', 'cutting', 'collection', 'surface', 'material', 'brand']
    })
}

const getSimilarProducts = async(brandId) => {
    return await Product.where({
        'brand_id': parseInt(brandId)
    }).query(function(qb){
        qb.limit(4); 
    }).fetchAll({
        require: false,
        withRelated: ['colour', 'closure', 'cutting', 'collection', 'surface', 'material', 'brand']
    })
}



module.exports = {
    getAllProducts,
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
    getAllSizes,
    getVariantById,
    getProductsOrderByDate,
    getSimilarProducts
}