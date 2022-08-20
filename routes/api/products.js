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


router.get('/', async(req,res)=>{
    // res.send( await getAllProducts() )

    const searchQuery = Product.collection()

    if (Object.keys(req.body).length === 0) {
        res.send( await getAllProducts() )
    } else {
        if (req.body.name) {
            searchQuery.where(`${name} like % ${req.body.name} %`)
        }
    }

})


module.exports = router;