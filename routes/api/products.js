const express = require('express')
const router = express.Router();


const { Product } = require('../../models');


const {
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
    getAllProducts,
    getProductsOrderByDate,
    getSimilarProducts
} = require('../../dal/products');
const { query } = require('express');


router.get('/', async (req, res) => {

    try {
        const products = await getAllProducts();
        const brands = (await getAllBrands()).slice(1);
        const collections = (await getAllCollections()).slice(1);
        const materials = (await getAllMaterials()).slice(1);
        const surfaces = (await getAllSurfaces()).slice(1);
        const colours = (await getAllColours()).slice(1);
        const closures = (await getAllClosures()).slice(1);
        const cuttings = (await getAllCuttings()).slice(1);
        const positions = await getAllPositions()

        productData = {
            products, brands, collections, materials, surfaces,
            colours, closures, cuttings, positions
        }

        res.send(productData);
    } catch {
        res.send(error);
    }


})

router.get('/new', async (req, res) => {

    try {
        const products = await getProductsOrderByDate()
        res.send(products)

    } catch (error) {
        res.send(error)
    }
})

router.get('/similar/:brand_id', async (req, res) => {
    try {
        const products = await getSimilarProducts(req.params.brand_id)
        console.log(products)
        res.send(products)

    } catch (error) {
        res.send(error)
    }
})



router.post("/search", async (req, res) => {
    const searchQuery = Product.collection()

    console.log(req.body)

    const builder = (qb) => {
        if (req.body.name) {
            qb.leftOuterJoin('brands', 'products.brand_id', 'brands.id')
                .leftOuterJoin('collections', 'products.collection_id', 'collections.id')
                .leftOuterJoin('materials', 'products.material_id', 'materials.id')
                .leftOuterJoin('surfaces', 'products.surface_id', 'surfaces.id')
                .leftOuterJoin('colours', 'products.colour_id', 'colours.id')
                
            qb.where("products.name", "ilike", "%" + req.body.name + "%")
                .orWhere("brands.brand_name", "ilike", "%" + req.body.name + "%")
                .orWhere("collections.collection", "ilike", "%" + req.body.name + "%")
                .orWhere("materials.material", "ilike", "%" + req.body.name + "%")
                .orWhere("colours.colour", "ilike", "%" + req.body.name + "%")
        }
        if (req.body.brand_id) {
            qb.where('brand_id', 'in', req.body.brand_id)
        }
        if (req.body.collection_id) {
            qb.where('collection_id', 'in', req.body.collection_id)
        }
        if (req.body.material_id) {
            qb.where('material_id', 'in', req.body.material_id)
        }
        if (req.body.surface_id) {
            qb.where('surface_id', 'in', req.body.surface_id)
        }
        if (req.body.colour_id) {
            qb.where('colour_id', 'in', req.body.colour_id)
        }
        if (req.body.cutting_id) {
            qb.where('cutting_id', 'in', req.body.cutting_id)
        }
        if (req.body.closure_id) {
            qb.where('closure_id', 'in', req.body.closure_id)
        }
    }

    const products = await searchQuery.query(builder).fetch({
        withRelated: ["brand", "collection", "material", "surface", "colour", "cutting", "closure"],
    });
    res.send(products);
})


router.get('/:product_id', async (req, res) => {
    try {
        const variants = await getVariantsByProductId(req.params.product_id)
        const product = await getProductById(req.params.product_id)
        const productData = {product, variants}
        res.send(productData)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;