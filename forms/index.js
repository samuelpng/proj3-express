// require in caolan-forms
const forms = require('forms');
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control mb-3');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

//create product form
const createProductForm = (brands, collections, materials, surfaces, colours, closures, cuttings, positions) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'cost': fields.string({
            required: true,
            errorAfterField: true
            // validators: [validators.integer(), validators.min(1)]
        }),
        'brand_id': fields.string({
            label: 'Brand',
            required: true,
            errorAfterField: true,
            choices: brands,
            widget: widgets.select(),
            validators: [validators.integer(), validators.min(1)]
        }),
        'collection_id': fields.string({
            label: 'Collection',
            required: true,
            errorAfterField: true,
            choices: collections,
            widget: widgets.select(),
            validators: [validators.integer(), validators.min(1)]
        }),
        'material_id': fields.string({
            label: 'Material',
            required: true,
            errorAfterField: true,
            choices: materials,
            widget: widgets.select(),
            validators: [validators.integer(), validators.min(1)]
        }),
        'surface_id': fields.string({
            label: 'Surface',
            required: true,
            errorAfterField: true,
            choices: surfaces,
            widget: widgets.select(),
            validators: [validators.integer(), validators.min(1)]
        }),
        'colour_id': fields.string({
            label: 'Colour',
            required: true,
            errorAfterField: true,
            choices: colours,
            widget: widgets.select(),
            validators: [validators.integer(), validators.min(1)]
        }),
        'closure_id': fields.string({
            label: 'Closure',
            required: true,
            errorAfterField: true,
            choices: closures,
            widget: widgets.select(),
            validators: [validators.integer(), validators.min(1)]
        }),
        'cutting_id': fields.string({
            label: 'Cutting',
            required: true,
            errorAfterField: true,
            choices: cuttings,
            widget: widgets.select(),
            validators: [validators.integer(), validators.min(1)]
        }),
        'positions': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: positions
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.textarea()
        }),
        'image_url': fields.string({
            widget: widgets.hidden(),
            required: true
        }),
        'thumbnail_url': fields.string({
            widget: widgets.hidden()
        }),
        'image_url2': fields.string({
            widget: widgets.hidden()
        }),
        'thumbnail_url2': fields.string({
            widget: widgets.hidden()
        }),
        'image_url3': fields.string({
            widget: widgets.hidden()
        }),
        'thumbnail_url3': fields.string({
            widget: widgets.hidden()
        })
    },
        { validatePastFirstError: true }
    )
}

//=== Form for all specifications except brand and surface
const createSpecificationForm = (specificationName) => {
    return forms.create({
        'name': fields.string({
            label: specificationName,
            required: true,
            errorAfterField: true
        })
    })
}

const createBrandForm = () => {
    return forms.create({
        'brand_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'image_url': fields.string({
            widget: widgets.hidden()
        }),
        'thumbnail_url': fields.string({
            widget: widgets.hidden()
        })
    },
        { validatePastFirstError: true }
    )
}

const createSurfaceForm = () => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'surface_abbreviation': fields.string({
            required: true,
            errorAfterField: true
        })
    },
        { validatePastFirstError: true }
    )
}

const createCollectionForm = (brands) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'brand_id': fields.string({
            label: 'Brand',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: brands,
            validators: [validators.integer(), validators.min(1)]
        })
    },
        { validatePastFirstError: true }
    )
}


const createRegistrationForm = (userTypes) => {
    return forms.create({
        'first_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'last_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField('password')]
        }),
        'user_type_id': fields.string({
            label: 'User Type',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: userTypes,
            validators: [validators.integer(), validators.min(1)]
        })
    },
        { validatePastFirstError: true }
    )
}

const updateUserForm = (userTypes) => {
    return forms.create({
        'first_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'last_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'user_type_id': fields.string({
            label: 'User Type',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: userTypes,
            validators: [validators.integer(), validators.min(1)]
        })
    },
        { validatePastFirstError: true }
    )
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true
        }),
    },
        { validatePastFirstError: true }
    )
}

const changePasswordForm = () => {
    return forms.create({
        password: fields.password({
            required: true,
            errorAfterField: true
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField("password")],
        }),
    },
        { validatePastFirstError: true }
    )
}

const createVariantForm = (sizes) => {
    return forms.create({
        'size_id': fields.string({
            label: 'Size',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: sizes
        }),
        'stock': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        })
    },
        { validatePastFirstError: true }
    )
}

const createVariationStockForm = () => {
    return forms.create({
        'stock': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        })
    },
        { validatePastFirstError: true }
    )
}

const createSearchForm = (brands, collections) => {
    return forms.create({
        'name': fields.string({
            required: false,
            errorAfterField: true
        }),
        'min_cost': fields.string({
            required: false,
            errorAfterField: true,
            'validators': [validators.integer(), validators.min(0)]
        }),
        'max_cost': fields.string({
            required: false,
            errorAfterField: true,
            'validators': [validators.integer(), validators.min(0)]
        }),
        'brand_id': fields.string({
            label: 'Brand',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: brands
        }),
        'collection_id': fields.string({
            label: 'Collection',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: collections
        })
    })
}

const createOrderSearchForm = (orderStatuses) => {
    return forms.create({
        'order_id': fields.string({
            required: false,
            errorAfterField: true
        }),
        'email': fields.string({
            required: false,
            errorAfterField: true
        }),
        'start_order_date': fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.date()
        }),
        'end_order_date': fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.date()
        }),
        'order_status_id': fields.string({
            label: 'Order Status',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: orderStatuses
        })
    })
}

const createOrderStatusForm = (orderStatuses) => {
    return forms.create({
        'order_status_id': fields.string({
            label: 'Order Status',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            cssClasses: {label: ["hideLabel"]},
            choices: orderStatuses
        })
    })
}

module.exports = {
    createProductForm,
    createSpecificationForm,
    createBrandForm,
    createSurfaceForm,
    createCollectionForm,
    createRegistrationForm,
    updateUserForm,
    changePasswordForm,
    createLoginForm,
    createVariantForm,
    createVariationStockForm,
    createSearchForm,
    createOrderSearchForm,
    createOrderStatusForm,
    bootstrapField
};