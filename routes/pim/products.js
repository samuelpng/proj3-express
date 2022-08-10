const express = require("express");
const router = express.Router();

//import in models
const { Product, Brand, Collection, UpperMaterial, Colour, Surface, Cutting, Position, Closure } = require('../../models')
// import in the Forms
const { bootstrapField, createProductForm } = require('../../forms');

router.get('/', async (req,res)=>{
    let products = await Product.collection().fetch({
        withRelated: ['colour', 'closure', 'cutting', 'collection', 'surface', 'upperMaterial', 'brand', 'positions']
    })
    res.render('products/index',{
        'products': products.toJSON()
    })
})

router.get('/create', async function (req, res) {
    

    const brands = await Brand.fetchAll().map((brand)=>{
        return [brand.get('id'), brand.get('brand_name')];
    })

    const collections = await Collection.fetchAll().map((collection)=>{
        return [collection.get('id'), collection.get('collection')];
    })

    const upperMaterials = await UpperMaterial.fetchAll().map((upperMaterial)=>{
        return [upperMaterial.get('id'), upperMaterial.get('upper_material')];
    })

    const surfaces = await Surface.fetchAll().map((surface)=>{
        return [surface.get('id'), surface.get('surface')];
    })

    const colours = await Colour.fetchAll().map((colour)=>{
        return [colour.get('id'), colour.get('colour')];
    })

    const closures = await Closure.fetchAll().map((colour)=>{
        return [colour.get('id'), colour.get('colour')];
    })

    const cuttings = await Cutting.fetchAll().map((cutting)=>{
        return [cutting.get('id'), cutting.get('cutting')];
    })

    const positions = await Position.fetchAll().map((position)=>{
        return [position.get('id'), position.get('position')];
    })

    const productForm = createProductForm(brands, collections, upperMaterials, surfaces, colours, closures, cuttings, positions);

    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async function (req,res) {
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description)
            product.save();
            res.redirect('/products')
        }
    })
})


module.exports = router;