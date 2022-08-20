const { Customer } = require('../models')
const crypto = require('crypto');
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const createCustomer = async (customerData) => {
	// Hash customer's password
	customerData.password = getHashedPassword(customerData.password);

	// Create new User instance with user data
	const customer = new Customer(customerData);
	await customer.save();

	return customer;
};  

module.exports = {
    createCustomer
}