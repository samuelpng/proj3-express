const express = require("express");
const router = express.Router();

//import in models
const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure, Variant } = require('../../models')
// import in the Forms
const { bootstrapField, createSpecificationForm, createBrandForm, createSurfaceForm } = require('../../forms');
// import in the DAL

const {
    createSpecification
} = require('../../dal/specifications')

router.get('/:specification_name/create', async (req, res) => {
    const specification = req.params.specification_name;
    const specificationForm = createSpecificationForm();
    const brandForm = createBrandForm();
    const surfaceForm = createSurfaceForm();

    if (specification === "brand") {
        res.render('specifications/create', {
            form: brandForm.toHTML(bootstrapField)
        })
    } else if (specification === "surface") {
        res.render('specifications/create', {
            form: surfaceForm.toHTML(bootstrapField)
        })
    } else {
        res.render('specifications/create', {
            form: specificationForm.toHTML(bootstrapField)
        })
    }



})


router.post('/:specification_name/create', async (req, res) => {
    const specificationForm = createSpecificationForm();
    const specification = req.params.specification_name;

    if (specification === 'material') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Material, {
                    material: form.data.name
                });
                req.flash("success_messages", "Material added successfully");
                res.redirect('/specifications')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'collection') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Collection, {
                    collection: form.data.name
                });
                req.flash("success_messages", "Collection added successfully");
                res.redirect('/specifications')
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
                res.redirect('/specifications')
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
                res.redirect('/specifications')
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
                res.redirect('/specifications')
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
                res.redirect('/specifications')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'brand') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Brand, {
                    brand_name: form.data.brand_name,
                    brand_logo: form.data.logo_url,
                    brand_thumbnail: form.data.thumbnail
                });
                req.flash("success_messages", "Brand added successfully");
                res.redirect('/specifications')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } else if (specification === 'surface') {
        specificationForm.handle(req, {
            success: async (form) => {
                await createSpecification(Surface, {
                    surface: form.data.name,
                    surface_abbreviation: form.data.surface_abbreviation
                });
                req.flash("success_messages", "Surface Type added successfully");
                res.redirect('/specifications')
            },
            error: (form) => {
                res.render('specifications/create', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    }
})




module.exports = router;
