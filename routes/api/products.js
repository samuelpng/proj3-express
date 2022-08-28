const express = require('express')
const router = express.Router();


const { Product } = require('../../models');
const { createProductForm } = require('../../forms');

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
    getAllSizes,
    getVariantById,
    getAllProducts
} = require('../../dal/products');
const { query } = require('express');


router.get('/', async (req, res) => {
    // res.send( await getAllProducts() )

    // const searchQuery = Product.collection()

    // if (Object.keys(req.body).length === 0) {
    //     res.send( await getAllProducts() )
    // } else {
    //     if (req.body.name) {
    //         searchQuery.where(`${name} like % ${req.body.name} %`)
    //     }
    // }
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch {
        res.sendStatus(500);
    }


})

router.get("/search", async (req, res) => {
    const searchQuery = Product.collection()

    console.log(req.body.name)
    console.log(req.query.name)

    if (req.body.name) {
        if (process.env.DB_DRIVER == 'mysql') {
            query.where('name', 'like', '%' + req.body.name + '%')
        } else {
            searchQuery.where("name", "ilike", "%" + req.body.name + "%");
        }
    }
    if (req.body.brand_id) {
        searchQuery.where('brand_id', '=', req.body.brand_id)
    }
    if (req.body.collection_id) {
        searchQuery.where('collection_id', '=', req.body.collection_id)
    }
    if (req.body.material_id) {
        searchQuery.where('material_id', '=', req.body.material_id)
    }
    if (req.body.surface_id) {
        searchQuery.where('surface_id', '=', req.body.surface_id)
    }
    if (req.body.colour_id) {
        searchQuery.where('colour_id', '=', req.body.colour_id)
    }
    if (req.body.cutting_id) {
        searchQuery.where('cutting_id', '=', req.body.cutting_id)
    }
    if (req.body.closure_id) {
        searchQuery.where('closure_id', '=', req.body.closure_id)
    }
    if (req.body.position_id) {
        searchQuery.where('position_id', '=', req.body.position_id)
    }

    const products = await searchQuery.fetch({
        withRelated: ["brand", "collection", "material", "surface", "colour", "cutting", "closure", "positions"],
    });
    res.send(products);
})


router.post("/search", async (req, res) => {
    const searchQuery = Product.collection()

    console.log(req.body)
    console.log(req.query)


    if (req.body.name) {
            searchQuery.query('join', 'brands', 'brands.id', 'products.brand_id')
            .where("products.name", "ilike", "%" + req.body.name + "%")
            .orWhere("brands.brand_name", "ilike", "%" + req.body.name + "%")
        }
    

    // if (req.body.searchBrand) {
    //     searchQuery.query('join', 'brands', 'brands.id', 'products.brand_id')
    //     .where("brands.brand_name", "ilike", "%" + req.body.name + "%");
    // }

    if (req.body.brand_id) {
        searchQuery.where('brand_id', '=', req.body.brand_id)
    }
    if (req.body.collection_id) {
        searchQuery.where('collection_id', '=', req.body.collection_id)
    }
    if (req.body.material_id) {
        searchQuery.where('material_id', '=', req.body.material_id)
    }
    if (req.body.surface_id) {
        searchQuery.where('surface_id', '=', req.body.surface_id)
    }
    if (req.body.colour_id) {
        searchQuery.where('colour_id', '=', req.body.colour_id)
    }
    if (req.body.cutting_id) {
        searchQuery.where('cutting_id', '=', req.body.cutting_id)
    }
    if (req.body.closure_id) {
        searchQuery.where('closure_id', '=', req.body.closure_id)
    }
    if (req.body.position_id) {
        searchQuery.where('position_id', '=', req.body.position_id)
    }

    const products = await searchQuery.fetch({
        withRelated: ["brand", "collection", "material", "surface", "colour", "cutting", "closure", "positions"],
    });
    res.send(products);
})

router.get('/:product_id', async (req, res) => {
    try {
        const variants = await getVariantsByProductId(req.params.product_id)
        res.send(variants)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;