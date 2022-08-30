const { Customer, User } = require('../models')

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

const getCustomers = async () => {
    return await Customer.collection().fetch()
}


module.exports = {
    createCustomer,
	getCustomerByEmail,
	getCustomers
}