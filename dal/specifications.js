const { Product, Brand, Collection, Material, Colour, Surface, Cutting, Position, Closure, Variant } = require('../models')


const createSpecification = async (specificationTable, data) => {
    const specification = new specificationTable(data);
    await specification.save();

    return specification;
}


module.exports = {
    createSpecification
}