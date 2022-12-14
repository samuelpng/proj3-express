const express = require("express");
const router = express.Router();

//import in models
const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure, Variant } = require('../../models')
// import in the Forms
const { bootstrapField, createProductForm, createVariantForm, createVariationStockForm, createSearchForm } = require('../../forms');
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
    getAllSizes,
    getVariantById
} = require('../../dal/products')


//Product home page with search function
router.get('/', async (req, res) => {

    let searchForm = createSearchForm(
        await getAllBrands(),
        await getAllCollections()
    )

    let searchQuery = Product.collection()

    searchForm.handle(req, {
        empty: async (form) => {
            let products = await searchQuery.fetch({
                withRelated: ['brand', 'collection']
            })
            const searchResultsCount = products.toJSON().length
            res.render('products/index', {
                'products': products.toJSON(),
                searchResultsCount,
                'form': form.toHTML(bootstrapField)
            })
        },
        error: async (form) => {
            let products = await searchQuery.fetch({
                withRelated: ['brand', 'collection']
            })
            const searchResultsCount = products.toJSON().length
            res.render('products/index', {
                'products': products.toJSON(),
                searchResultsCount,
                'form': form.toHTML(bootstrapField)
            })
        },
        success: async (form) => {
            if (form.data.name) {
                searchQuery.where('name', 'like', '%' + form.data.name + '%')
            }
            if (form.data.brand_id && form.data.brand_id != "0") {
                searchQuery.where('brand_id', '=', form.data.brand_id)
            }
            if (form.data.collection_id && form.data.collection_id != "0") {
                searchQuery.where('collection_id', '=', form.data.collection_id)
            }
            if (form.data.min_cost) {
                searchQuery.where('cost', '>=', form.data.min_cost)
            }
            if (form.data.max_cost) {
                searchQuery.where('cost', '<=', form.data.max_cost);
            }

            let products = await searchQuery.fetch({
                withRelated: ['brand', 'collection']
            })

            const searchResultsCount = products.toJSON().length

            res.render('products/index', {
                products: products.toJSON(),
                searchResultsCount,
                form: form.toHTML(bootstrapField)
            })
        }

    })

})

//Create Product Routes
router.get('/create', async (req, res) => {

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

    res.render('products/create', {
        form: productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', async (req, res) => {

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
        success: async function (form) {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', parseInt(form.data.cost) * 100);
            product.set('brand_id', form.data.brand_id);
            product.set('collection_id', form.data.collection_id);
            product.set('material_id', form.data.material_id);
            product.set('surface_id', form.data.surface_id);
            product.set('colour_id', form.data.colour_id);
            product.set('closure_id', form.data.closure_id);
            product.set('cutting_id', form.data.cutting_id);
            product.set('description', form.data.description);
            product.set('image_url', form.data.image_url);
            product.set('thumbnail_url', form.data.thumbnail_url);
            product.set('image_url2', form.data.image_url2);
            product.set('thumbnail_url2', form.data.thumbnail_url2);
            product.set('image_url3', form.data.image_url3);
            product.set('thumbnail_url3', form.data.thumbnail_url3)
            product.set("date_created", new Date());
            await product.save();
            if (form.data.positions) {
                await product.positions().attach(form.data.positions.split(','))
            }

            req.flash("success_messages", `New Product ${product.get('name')} has been created`)
            res.redirect('/products')
        },
        error: async (form) => {
            res.render('products/create', {
                form: form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

//Update Product Routes
router.get('/:product_id/update', async function (req, res) {

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

    //fill in form with previous values of product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost')/100;
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
    productForm.fields.image_url2.value = product.get('image_url2')
    productForm.fields.thumbnail_url2.value = product.get('thumbnail_url2')
    productForm.fields.image_url3.value = product.get('image_url3')
    productForm.fields.thumbnail_url3.value = product.get('thumbnail_url3')

    let selectedPositions = await product.related('positions').pluck('id');
    productForm.fields.positions.value = selectedPositions;

    res.render('products/update', {
        form: productForm.toHTML(bootstrapField),
        product: product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/update', async function (req, res) {

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

    productForm.handle(req, {
        success: async (form) => {
            let { positions, cost, ...productData } = form.data;
            cost = cost * 100
            product.set({cost, ...productData})
            await product.save();

            let positionIds = positions.split(',').map(id => parseInt(id));
            let existingPositionIds = await product.related('positions').pluck('id');
            let toRemove = existingPositionIds.filter(id => positionIds.includes(id) === false);
            await product.positions().detach(toRemove);
            await product.positions().attach(positionIds);
            res.redirect(`/products/${req.params.product_id}/variants`)
        },
        error: (form) => {
            res.render('products/update', {
                form: form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})


router.post('/:product_id/delete', async (req, res) => {

    const product = await getProductById(req.params.product_id)

    await product.destroy();
    res.redirect('/products')
})

//Product Variant Routes
router.get('/:product_id/variants', async (req, res) => {
    const product = await getProductById(req.params.product_id)
    const variants = await getVariantsByProductId(req.params.product_id)

    res.render('products/variants', {
        product: product.toJSON(),
        variants: variants.toJSON()
    })
})

router.get('/:product_id/variants/create', async (req, res) => {
    const product = await getProductById(req.params.product_id)
    const variationForm = createVariantForm(await getAllSizes())

    res.render('products/variant-create', {
        form: variationForm.toHTML(bootstrapField),
        product: product.toJSON()
    })
})
router.post('/:product_id/variants/create', async (req, res) => {
    const product = await getProductById(req.params.product_id)
    const variationForm = createVariantForm(await getAllSizes())

    variationForm.handle(req, {
        success: async (form) => {
            const variant = new Variant({
                product_id: req.params.product_id,
                size_id: form.data.size_id,
                stock: form.data.stock,
                date_created: new Date()
            })
            await variant.save()
            req.flash('success_messages', `New size has been added`)
            res.redirect(`/products/${req.params.product_id}/variants`)
        },
        error: async (form) => {
            res.render('products/variants-create', {
                form: form.toHTML(bootstrapField),
                product: product.toJSON()
            })
        }
    })
})

router.get('/:product_id/variants/:variant_id/update', async (req, res) => {
    const variant = await getVariantById(req.params.variant_id)

    const variationForm = createVariationStockForm()
    variationForm.fields.stock.value = variant.get('stock')

    res.render('products/variant-update', {
        form: variationForm.toHTML(bootstrapField),
        variant: variant.toJSON()
    })
})

router.post('/:product_id/variants/:variant_id/update', async (req, res) => {
    const variant = await getVariantById(req.params.variant_id)
    const variationForm = createVariationStockForm()

    variationForm.handle(req, {
        success: async (form) => {
            variant.set(form.data)
            variant.save()

            req.flash('success_messages', 'Stock has been successfully updated to ' + variant.get('stock'))
            res.redirect(`/products/${req.params.product_id}/variants`)
        },
        error: async (form) => {
            res.render('products/variant-update', {
                form: form.toHTML(bootstrapField),
                variant: variant.toJSON()
            })
        }
    })
})

router.post('/:product_id/variants/:variant_id/delete', async (req, res) => {
    const variant = await getVariantById(req.params.variant_id)
    await variant.destroy()
    req.flash('success_messages', `Size has been deleted`)
    res.redirect(`/products/${req.params.product_id}/variants`)
})

module.exports = router;

