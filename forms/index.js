// require in caolan-forms
const forms = require('forms');
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
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
            errorAfterField: true,
            validators: [validators.integer(), validators.min(1)]
        }),
        'brand_id': fields.string({
            label: 'Brand',
            required: true,
            errorAfterField: true,
            choices: brands,
            widget: widgets.select()
        }),
        'collection_id': fields.string({
            label: 'Collection',
            required: true,
            errorAfterField: true,
            choices: collections,
            widget: widgets.select()
        }),
        'material_id': fields.string({
            label: 'Material',
            required: true,
            errorAfterField: true,
            choices: materials,
            widget: widgets.select()
        }),
        'surface_id': fields.string({
            label: 'Surface',
            required: true,
            errorAfterField: true,
            choices: surfaces,
            widget: widgets.select()
        }),
        'colour_id': fields.string({
            label: 'Colour',
            required: true,
            errorAfterField: true,
            choices: colours,
            widget: widgets.select()
        }),
        'closure_id': fields.string({
            label: 'Closure',
            required: true,
            errorAfterField: true,
            choices: closures,
            widget: widgets.select()
        }),
        'cutting_id': fields.string({
            label: 'Cutting',
            required: true,
            errorAfterField: true,
            choices: cuttings,
            widget: widgets.select()
        }),
        'positions': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: positions
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true
        }),
        'image_url': fields.string({
            widget: widgets.hidden()
        }),
        'thumbnail_url': fields.string({
            widget: widgets.hidden()
        })
    })
}

const createRegistrationForm = (userTypes) => {
    return forms.create({
        'username': fields.string({
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
            choices: userTypes
        })
    })
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
    })
}

const createVariantForm = (sizes) => {
    return forms.create({
        'size_id':fields.string({
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
    })
}

const createVariationStockForm = () => {
    return forms.create({
        'stock': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        })
    })
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

module.exports = { createProductForm, createRegistrationForm, createLoginForm, createVariantForm, createVariationStockForm, createSearchForm, bootstrapField };