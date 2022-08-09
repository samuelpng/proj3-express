// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: 'admin',
      password:'adminuser',
      database:'football_boots'
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;