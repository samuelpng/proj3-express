const { Brand, Collection } = require('../models')

const getSpecifications = async (specificationTable) => {  
    if (specificationTable == Collection) {
        return await specificationTable.collection().fetch({
            withRelated: ['Brand']
        })
    } else {
        return await specificationTable.collection().fetch()
    }
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

const getAllBrands = async () => {
    const brands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('brand_name')];
    })
    brands.unshift([0, '---- Select One ----'])
    return brands
}


module.exports = {
    getSpecifications,
    createSpecification,
    getSpecificationById,
    getAllBrands
}