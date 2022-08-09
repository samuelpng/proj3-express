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
  return db.createTable('cuttings', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notnull:true
    },
    cutting: {
      type: 'string',
      length: 10,
      notnull: true
    }
  })
};

exports.down = function(db) {
  return db.dropTable('cuttings');
};

exports._meta = {
  "version": 1
};
