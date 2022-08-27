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
} = require('../../dal/products')


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

    if (req.body.name) {
        searchQuery.where("name", "like", "%" + req.body.name + "%");
    }

    const products = await query.fetch({
        withRelated: ["brand", "collection", "material", "surface", "colour", "cutting", "closure", "positions"],
    });
    res.send(products);
})

router.get('/:product_id', async(req,res) => {
    try {
        const variants = await getVariantsByProductId(req.params.product_id)
        res.send(variants)
    } catch(error) {
        res.send(error)
    }
})

module.exports = router;