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
    res.send( await getAllProducts() )
})



module.exports = router;