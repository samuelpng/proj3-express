const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure, Variant } = require('../models')

const getSpecifications = async (specificationTable) => {
    return await specificationTable.collection().fetch()
}

const createSpecification = async (specificationTable, data) => {
    const specification = new specificationTable(data);
    await specification.save();

    return specification;
}

const getSpecificationById = async (specificationTable, specificationId) => {
    return await specificationTable.where({
        id: parseInt(specificationId)
    }).fetch({
        require: true,
    });
}


module.exports = {
    getSpecifications,
    createSpecification,
    getSpecificationById
}