const { User, UserType } = require('../models')

const getUsers = async () => {
    return await User.collection().fetch({
        withRelated: ['userType']
    })
}

const getAllUserTypes = async () => {
    const userTypes = await UserType.fetchAll().map((userType) => {
        return [userType.get('id'), userType.get('user_type')];
    })
    userTypes.unshift([0, '---- Select One ----'])
    return userTypes
}

const getUserById = async (userId) => {
    return await User.where({
        'id': parseInt(userId)
    }).fetch({
        require: true,
        withRelated: ['userType']
    });
}

module.exports = {
    getUsers,
    getAllUserTypes,
    getUserById
}