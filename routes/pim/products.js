const express = require("express");
const router = express.Router();

//import in models
const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure, Variant } = require('../../models')
// import in the Forms
const { bootstrapField, createProductForm, createVariationStockForm } = require('../../forms');
// import in the DAL
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
    getVariantById
} = require('../../dal/products')

router.get('/', async (req,res)=>{
    let products = await Product.collection().fetch({
        withRelated: ['colour', 'closure', 'cutting', 'collection', 'surface', 'material', 'brand', 'positions']
    })
    res.render('products/index',{
        'products': products.toJSON()
    })
})

router.get('/create', async function (req, res) {

    const productForm = createProductForm(
        await getAllBrands(), 
        await getAllCollections(),
        await getAllMaterials(),
        await getAllSurfaces(),
        await getAllColours(),
        await getAllClosures(),
        await getAllCuttings(),
        await getAllPositions()
    );

    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', async function (req,res) {
    
    const productForm = createProductForm(
        await getAllBrands(), 
        await getAllCollections(),
        await getAllMaterials(),
        await getAllSurfaces(),
        await getAllColours(),
        await getAllClosures(),
        await getAllCuttings(),
        await getAllPositions()
    );

    productForm.handle(req, {
        'success': async function (form) {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('brand_id', form.data.brand_id);
            product.set('collection_id', form.data.collection_id);
            product.set('material_id', form.data.material_id);
            product.set('surface_id', form.data.surface_id);
            product.set('colour_id', form.data.colour_id);
            product.set('closure_id', form.data.closure_id);
            product.set('cutting_id', form.data.cutting_id);
            product.set('description', form.data.description);
            product.set('image_url', form.data.image_url);
            product.set('thumbnail_url', form.data.thumbnail_url)
            product.set("date_created", new Date());
            await product.save();
            if (form.data.positions) {
                await product.positions().attach(form.data.positions.split(','))
            }
            req.flash("success_messages", `New Product ${product.get('name')} has been created`)
            res.redirect('/products')
        },
        'error': async function (form) {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/update', async function (req,res) {

    const product = await getProductById(req.params.product_id)

    const productForm = createProductForm(
        await getAllBrands(), 
        await getAllCollections(),
        await getAllMaterials(),
        await getAllSurfaces(),
        await getAllColours(),
        await getAllClosures(),
        await getAllCuttings(),
        await getAllPositions()
    );

    //fill in firn with previous values of product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.brand_id.value = product.get('brand_id')
    productForm.fields.collection_id.value = product.get('collection_id');
    productForm.fields.material_id.value = product.get('material_id');
    productForm.fields.surface_id.value = product.get('surface_id');
    productForm.fields.colour_id.value = product.get('colour_id');
    productForm.fields.closure_id.value = product.get('closure_id');
    productForm.fields.cutting_id.value = product.get('cutting_id');
    productForm.fields.description.value = product.get('description');
    productForm.fields.image_url.value = product.get('image_url')
    productForm.fields.thumbnail_url.value = product.get('thumbnail_url')

    let selectedPositions = await product.related('positions').pluck('id');
    productForm.fields.positions.value = selectedPositions;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/update', async function (req,res) {

    const product = await getProductById(req.params.product_id)

    const productForm = createProductForm(
        await getAllBrands(), 
        await getAllCollections(),
        await getAllMaterials(),
        await getAllSurfaces(),
        await getAllColours(),
        await getAllClosures(),
        await getAllCuttings(),
        await getAllPositions()
    );

    productForm.handle( req, {
        'success': async function (form) {
            let { positions, ...productData} = form.data;
            product.set(productData)
            await product.save();

            let positionIds = positions.split(',').map(id => parseInt(id));
            let existingPositionIds = await product.related('positions').pluck('id');
            let toRemove = existingPositionIds.filter(id => positionIds.includes(id) === false);
            await product.positions().detach(toRemove);
            await product.positions().attach(positionIds);
            res.redirect('/products')
        }
    })
})

//Delete Product Routes
router.get('/:product_id/delete', async(req,res)=>{

    const product = await await getProductById(req.params.product_id)

    res.render('products/delete', {
        'product': product.toJSON()
    })
});

router.post('/:product_id/delete', async(req,res)=>{

    const product = await getProductById(req.params.product_id)

    await product.destroy();
    res.redirect('/products')
})

//Product Variant Routes
router.get('/:product_id/variants', async (req,res) => {
    const product = await getProductById(req.params.product_id)
    const variants = await getVariantsByProductId(req.params.product_id)
    res.render('products/variants', {
        product: product.toJSON(),
        variants: variants.toJSON()
    })
})

router.get('/:product_id/variants/:variant_id/update', async (req,res) => {
    const variant = await getVariantById(req.params.variant_id)

    const variationForm = createVariationStockForm()
    variationForm.fields.stock.value = variation.get('stock')

    res.render('products/variants-update', {
        'form': variationForm.toHTML(bootstrapField),
        'variant': variant.toJSON()
    })
})

module.exports = router;

