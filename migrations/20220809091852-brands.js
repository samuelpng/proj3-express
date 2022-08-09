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
  return db.createTable('brands', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notnull:true
    },
    brand_name: {
      type: 'string',
      length: 45,
      notnull: true
    },
    brand_logo: {
      type: 'string',
      length: 2048
    },
    brand_thumbnail: {
      type: 'string',
      length: 2048
    }
  })
};

exports.down = function(db) {
  return db.dropTable('brands');
};

exports._meta = {
  "version": 1
};
