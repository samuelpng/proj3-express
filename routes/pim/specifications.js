const express = require("express");
const router = express.Router();

//import in models
const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure, Size, Variant } = require('../../models')
// import in the Forms
const { bootstrapField, createSpecificationForm, createBrandForm, createCollectionForm, createSurfaceForm } = require('../../forms');
// import in the DAL
const {
    createSpecification,
    getSpecifications,
    getSpecificationById,
    getAllBrands
} = require('../../dal/specifications')

router.get('/:specification_name', async (req,res) => {
    const specification = req.params.specification_name;
    // const specifications = await getSpecifications(specificationName);
    if (specification === "brand") {
        const brands = await getSpecifications(Brand)
        res.render('specifications/index', {
            specificationName: "Brand",
            specification,
            specifications: brands.toJSON()
        })
    } else if (specification === "collection") {
        const collections = await getSpecifications(Collection)
        res.render('specifications/index', {
            specificationName: "Collection",
            specification,
            specifications: collections.toJSON()
        })
    } else if (specification === "material") {
        const materials = await getSpecifications(Material)
        res.render('specifications/index', {
            specificationName: "Material",
            specification,
            specifications: materials.toJSON()
        })
    } else if (specification === "colour") {
        const colours = await getSpecifications(Colour)
        res.render('specifications/index', {
            specificationName: "Colour",
            specification,
            specifications: colours.toJSON()
        })
    } else if (specification === "surface") {
        const surfaces = await getSpecifications(Surface)
        res.render('specifications/index', {
            specificationName: "Surface Type",
            specification,
            specifications: surfaces.toJSON()
        })
    } else if (specification === "cutting") {
        const cuttings = await getSpecifications(Cutting)
        res.render('specifications/index', {
            specificationName: "Cutting",
            specification,
            specifications: cuttings.toJSON()
        })
    } else if (specification === "position") {
        const positions = await getSpecifications(Position)
        res.render('specifications/index', {
            specificationName: "Position",
            specification,
            specifications: positions.toJSON()
        })
    } else if (specification === "closure") {
        const closures = await getSpecifications(Closure)
        res.render('specifications/index', {
            specificationName: "Closure",
            specification,
            specifications: closures.toJSON()
        })
    } else if (specification === "size") {
        const sizes = await getSpecifications(Size)
        res.render('specifications/index', {
            specificationName: "Size",
            specification,
            specifications: sizes.toJSON()
        })
    }
})

router.get('/:specification_name/create', async (req, res) => {
    const specification = req.params.specification_name;
    const specificationForm = createSpecificationForm();
    const brandForm = createBrandForm();
    const surfaceForm = createSurfaceForm();
    const collectionForm = createCollectionForm(await getAllBrands());

    if (specification === "brand") {
        res.render('specifications/create', {
            form: brandForm.toHTML(bootstrapField),
            specification,
            cloudinaryName: process.env.CLOUDINARY_NAME,
            cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
            cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
        })
    } else if (specification === "surface") {
        res.render('specifications/create', {
            form: surfaceForm.toHTML(bootstrapField),
            specification: "surface type"
        })
    } else if (specification === "collection") {
        res.render('specifications/create', {
            form: collectionForm.toHTML(bootstrapField),
            specification
        })
    } else {
        res.render('specifications/create', {
            form: specificationForm.toHTML(bootstrapField),
            specification
        })
    }
})


router.post('/:specification_name/create', async (req, res) => {
    const specificationForm = createSpecificationForm();
    const brandForm = createBrandForm();
    const surfaceForm = createSurfaceForm()
    const collectionForm = createCollectionForm(await getAllBrands());
    const specification = req.params.specification_name;

    if (specification === 'material') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Material, {
                    material: form.data.name
                });
                req.flash("success_messages", "Material added successfully");
                res.redirect('back')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'collection') {
        collectionForm.handle(req, {
            success: async (form) => {
                await createSpecification(Collection, {
                    collection: form.data.name,
                    brand_id: form.data.brand_id
                });
                req.flash("success_messages", "Collection added successfully");
                res.redirect('back')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'colour') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Colour, {
                    colour: form.data.name
                });
                req.flash("success_messages", "Colour added successfully");
                res.redirect('back')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'cutting') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Cutting, {
                    cutting: form.data.name
                });
                req.flash("success_messages", "Cutting added successfully");
                res.redirect('back')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'position') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Position, {
                    position: form.data.name
                });
                req.flash("success_messages", "Position added successfully");
                res.redirect('back')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'closure') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Closure, {
                    closure: form.data.name
                });
                req.flash("success_messages", "Closure added successfully");
                res.redirect('back')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'brand') {
        brandForm.handle(req, {
            success: async (form) => {
                await createSpecification(Brand, {
                    brand_name: form.data.brand_name,
                    brand_logo: form.data.image_url,
                    brand_thumbnail: form.data.thumbnail_url
                });
                req.flash("success_messages", "Brand added successfully");
                res.redirect('back')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'surface') {
        surfaceForm.handle(req, {
            success: async (form) => {
                await createSpecification(Surface, {
                    surface: form.data.name,
                    surface_abbreviation: form.data.surface_abbreviation
                });
                req.flash("success_messages", "Surface Type added successfully");
                res.redirect('back')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    }
})

router.get('/:specification_name/:specification_id/update', async (req, res) => {
    const specification = req.params.specification_name;
    const specificationId = req.params.specification_id

    const specificationForm = createSpecificationForm();
    const brandForm = createBrandForm();
    const surfaceForm = createSurfaceForm();
    const collectionForm = createCollectionForm(await getAllBrands())

    if (specification === "brand") {
        const brand = await getSpecificationById(Brand, specificationId)
        brandForm.fields.brand_name.value = brand.get("brand_name")
        brandForm.fields.image_url.value = brand.get('brand_logo')
        brandForm.fields.thumbnail_url.value = brand.get('thumbnail_url')

        res.render('specifications/update', {
            form: brandForm.toHTML(bootstrapField),
            specification: brand.toJSON(),
            cloudinaryName: process.env.CLOUDINARY_NAME,
            cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
            cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
        })
    } else if (specification === "collection") {
        const collection = await getSpecificationById(Collection, specificationId)
        collectionForm.fields.name.value = collection.get("collection")
        collectionForm.fields.brand_id.value = collection.get("brand_id")
        res.render('specifications/update', {
            form: collectionForm.toHTML(bootstrapField),
            specification: collection.toJSON()
        })
    } else if (specification === "material") {
        const specification = await getSpecificationById(Material, specificationId)
        specificationForm.fields.name.value = specification.get("material")
        res.render('specifications/update', {
            form: specificationForm.toHTML(bootstrapField),
            specification
        })
    } else if (specification === "colour") {
        const colour = await getSpecificationById(Colour, specificationId)
        specificationForm.fields.name.value = colour.get("colour")
        res.render('specifications/update', {
            form: specificationForm.toHTML(bootstrapField),
            specification: colour.toJSON()
        })
    } else if (specification === "surface") {
        const surface = await getSpecificationById(Surface, specificationId)
        surfaceForm.fields.name.value = surface.get("surface")
        surfaceForm.fields.surface_abbreviation.value = surface.get("surface_abbreviation")
        res.render('specifications/update', {
            form: surfaceForm.toHTML(bootstrapField),
            specification: surface.toJSON()
        })
    } else if (specification === "cutting") {
        const cutting = await getSpecificationById(Cutting, specificationId)
        specificationForm.fields.name.value = cutting.get("cutting")
        res.render('specifications/update', {
            form: specificationForm.toHTML(bootstrapField),
            specification: cutting.toJSON()
        })
    } else if (specification === "position") {
        const position = await getSpecificationById(Position, specificationId)
        specificationForm.fields.name.value = position.get("position")
        res.render('specifications/update', {
            form: specificationForm.toHTML(bootstrapField),
            specification: position.toJSON()
        })
    } else if (specification === "closure") {
        const closure = await getSpecificationById(Closure, specificationId)
        specificationForm.fields.name.value = closure.get("closure")
        res.render('specifications/update', {
            form: specificationForm.toHTML(bootstrapField),
            specification: closure.toJSON()
        })
    }
})

router.post('/:specification_name/:specification_id/update', async (req, res) => {

    const specification = req.params.specification_name;
    const specificationId = req.params.specification_id

    const specificationForm = createSpecificationForm();
    const brandForm = createBrandForm();
    const surfaceForm = createSurfaceForm();
    const collectionForm = createCollectionForm(await getAllBrands())

    if (specification === "brand") {
        const brand = await getSpecificationById(Brand, specificationId)
        brandForm.handle(req, {
            success: async (form) => {
                brand.set({
                    brand_name: form.data.brand_name,
                    brand_logo: form.data.image_url,
                    brand_thumbnail: form.data.thumbnail_url
                })
                await brand.save();
                req.flash('success_messages', `${brand.get('brand_name')}" updated successfully.`)
                res.redirect('/specifications/brand')
            },
            error: async (form) => {
                res.render('specifications/update', {
                    specification: brand.toJSON(),
                    form: form.toHTML(bootstrapField)
                })
            }
        })

    } else if (specification === "collection") {
        const collection = await getSpecificationById(Collection, specificationId)
        collectionForm.handle(req, {
            success: async (form) => {
                collection.set({
                    collection: form.data.name,
                    brand_id: form.data.brand_id
                })
                await collection.save();
                req.flash('success_messages', `${collection.get('collection')}" updated successfully.`)
                res.redirect('/specifications/collection')
            },
            error: async (form) => {
                res.render('specifications/update', {
                    specification: collection.toJSON(),
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === "material") {
        const material = await getSpecificationById(Material, specificationId)
        specificationForm.handle(req, {
            success: async (form) => {
                material.set({material: form.data.name})
                await material.save();
                req.flash('success_messages', `${material.get('material')}" updated successfully.`)
                res.redirect('/specifications/material')
            },
            error: async (form) => {
                res.render('specifications/update', {
                    specification: material.toJSON(),
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === "colour") {
        const colour = await getSpecificationById(Colour, specificationId)
        specificationForm.handle(req, {
            success: async (form) => {
                colour.set({colour: form.data.name})
                await colour.save();
                req.flash('success_messages', `${colour.get('colour')}" updated successfully.`)
                res.redirect('/specifications/colour')
            },
            error: async (form) => {
                res.render('specifications/update', {
                    specification: colour.toJSON(),
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === "surface") {
        const surface = await getSpecificationById(Surface, specificationId)
        surfaceForm.handle(req, {
            success: async (form) => {
                surface.set({
                    surface: form.data.name,
                    surface_abbreviation: form.data.surface_abbreviation
                })
                await surface.save();
                req.flash('success_messages', `${surface.get('surface')}" updated successfully.`)
                res.redirect('/specifications/surface')
            },
            error: async (form) => {
                res.render('specifications/update', {
                    specification: surface.toJSON(),
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === "cutting") {
        const cutting = await getSpecificationById(Cutting, specificationId)
        specificationForm.handle(req, {
            success: async (form) => {
                cutting.set({cutting: form.data.name})
                await cutting.save();
                req.flash('success_messages', `${cutting.get('cutting')}" updated successfully.`)
                res.redirect('/specifications/cutting')
            },
            error: async (form) => {
                res.render('specifications/update', {
                    specification: cutting.toJSON(),
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === "position") {
        const position = await getSpecificationById(Position, specificationId)
        specificationForm.handle(req, {
            success: async (form) => {
                position.set({position: form.data.name})
                await position.save();
                req.flash('success_messages', `${position.get('position')}" updated successfully.`)
                res.redirect('/specifications/position')
            },
            error: async (form) => {
                res.render('specifications/update', {
                    specification: position.toJSON(),
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === "closure") {
        const closure = await getSpecificationById(Closure, specificationId)
        specificationForm.handle(req, {
            success: async (form) => {
                closure.set({closure: form.data.name})
                await closure.save();
                req.flash('success_messages', `${closure.get('closure')}" updated successfully.`)
                res.redirect('/specifications/closure')
            },
            error: async (form) => {
                res.render('specifications/update', {
                    specification: closure.toJSON(),
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    }
})



module.exports = router;
