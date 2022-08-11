const express = require("express");
const router = express.Router();

//import in models
const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure } = require('../../models')
// import in the Forms
const { bootstrapField, createProductForm } = require('../../forms');

router.get('/', async (req,res)=>{
    let products = await Product.collection().fetch({
        withRelated: ['colour', 'closure', 'cutting', 'collection', 'surface', 'material', 'brand', 'positions']
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

    const materials = await Material.fetchAll().map((material)=>{
        return [material.get('id'), material.get('material')];
    })

    const surfaces = await Surface.fetchAll().map((surface)=>{
        return [surface.get('id'), surface.get('surface')];
    })

    const colours = await Colour.fetchAll().map((colour)=>{
        return [colour.get('id'), colour.get('colour')];
    })

    const closures = await Closure.fetchAll().map((closure)=>{
        return [closure.get('id'), closure.get('closure')];
    })

    const cuttings = await Cutting.fetchAll().map((cutting)=>{
        return [cutting.get('id'), cutting.get('cutting')];
    })

    const positions = await Position.fetchAll().map((position)=>{
        return [position.get('id'), position.get('position')];
    })

    const productForm = createProductForm(brands, collections, materials, surfaces, colours, closures, cuttings, positions);

    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async function (req,res) {
    const brands = await Brand.fetchAll().map((brand)=>{
        return [brand.get('id'), brand.get('brand_name')];
    })

    const collections = await Collection.fetchAll().map((collection)=>{
        return [collection.get('id'), collection.get('collection')];
    })

    const materials = await Material.fetchAll().map((material)=>{
        return [material.get('id'), material.get('material')];
    })

    const surfaces = await Surface.fetchAll().map((surface)=>{
        return [surface.get('id'), surface.get('surface')];
    })

    const colours = await Colour.fetchAll().map((colour)=>{
        return [colour.get('id'), colour.get('colour')];
    })

    const closures = await Closure.fetchAll().map((closure)=>{
        return [closure.get('id'), closure.get('closure')];
    })

    const cuttings = await Cutting.fetchAll().map((cutting)=>{
        return [cutting.get('id'), cutting.get('cutting')];
    })

    const positions = await Position.fetchAll().map((position)=>{
        return [position.get('id'), position.get('position')];
    })



    const productForm = createProductForm(brands, collections, materials, surfaces, colours, closures, cuttings, positions);

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
    const brands = await Brand.fetchAll().map((brand)=>{
        return [brand.get('id'), brand.get('brand_name')];
    })

    const collections = await Collection.fetchAll().map((collection)=>{
        return [collection.get('id'), collection.get('collection')];
    })

    const materials = await Material.fetchAll().map((material)=>{
        return [material.get('id'), material.get('material')];
    })

    const surfaces = await Surface.fetchAll().map((surface)=>{
        return [surface.get('id'), surface.get('surface')];
    })

    const colours = await Colour.fetchAll().map((colour)=>{
        return [colour.get('id'), colour.get('colour')];
    })

    const closures = await Closure.fetchAll().map((closure)=>{
        return [closure.get('id'), closure.get('closure')];
    })

    const cuttings = await Cutting.fetchAll().map((cutting)=>{
        return [cutting.get('id'), cutting.get('cutting')];
    })

    const positions = await Position.fetchAll().map((position)=>{
        return [position.get('id'), position.get('position')];
    })

    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated:['positions']
    });

    const productForm = createProductForm(brands, collections, materials, surfaces, colours, closures, cuttings, positions);

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
    productForm.fields.description.value = product.get('description')

    let selectedPositions = await product.related('positions').pluck('id');
    productForm.fields.positions.value = selectedPositions;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', async function (req,res) {
    const brands = await Brand.fetchAll().map((brand)=>{
        return [brand.get('id'), brand.get('brand_name')];
    })

    const collections = await Collection.fetchAll().map((collection)=>{
        return [collection.get('id'), collection.get('collection')];
    })

    const materials = await material.fetchAll().map((material)=>{
        return [material.get('id'), material.get('material')];
    })

    const surfaces = await Surface.fetchAll().map((surface)=>{
        return [surface.get('id'), surface.get('surface')];
    })

    const colours = await Colour.fetchAll().map((colour)=>{
        return [colour.get('id'), colour.get('colour')];
    })

    const closures = await Closure.fetchAll().map((closure)=>{
        return [closure.get('id'), closure.get('closure')];
    })

    const cuttings = await Cutting.fetchAll().map((cutting)=>{
        return [cutting.get('id'), cutting.get('cutting')];
    })

    const positions = await Position.fetchAll().map((position)=>{
        return [position.get('id'), position.get('position')];
    })

    const productForm = createProductForm(brands, collections, materials, surfaces, colours, closures, cuttings, positions);

    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated:['positions']
    });

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

router.get('/:product_id/delete', async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    res.render('products/delete', {
        'product': product.toJSON()
    })

});

router.post('/:product_id/delete', async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
})




module.exports = router;