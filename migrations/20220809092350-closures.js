'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('closures', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull:true
    },
    closure: {
      type: 'string',
      length: 15,
      notNull: true
    }
  })
};

exports.down = function(db) {
  return db.dropTable('closure')
};

exports._meta = {
  "version": 1
};
