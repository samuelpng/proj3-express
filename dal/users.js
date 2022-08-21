const { User, UserType } = require('../models')

const getUsers = async () => {
    return await User.collection().fetch({
        withRelated: ['userType']
    })
}

const createUser = async (userData) => {
	const user = new User(userData);
	await user.save();

	return user;
};  

const getAllUserTypes = async () => {
    const userTypes = await UserType.fetchAll().map((userType) => {
        return [userType.get('id'), userType.get('user_type')];
    })
    userTypes.unshift([0, '---- Select One ----'])
    return userTypes
}

const getUserByEmail = async (email) => {
    return await User.where({
        email
    }).fetch({
        require: false,
        withRelated: ['userType']
    });
}

const getUserById = async (userId) => {
    return await User.where({
        id: parseInt(userId)
    }).fetch({
        require: true,
        withRelated: ['userType']
    });
}

module.exports = {
    getUsers,
    createUser,
    getAllUserTypes,
    getUserByEmail,
    getUserById
}