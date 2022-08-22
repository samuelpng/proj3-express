const { Customer, User } = require('../models')
// const crypto = require('crypto');

// const getHashedPassword = (password) => {
//     const sha256 = crypto.createHash('sha256');
//     const hash = sha256.update(password).digest('base64');
//     return hash;
// }

const createCustomer = async (customerData) => {
	const customer = new Customer(customerData);
	await customer.save();

	return customer;
};  

const getCustomerByEmail = async (email) => {
	return await User.where({
		email
	}.fetch({
		require: false
	}))
}


module.exports = {
    createCustomer,
	getCustomerByEmail
}