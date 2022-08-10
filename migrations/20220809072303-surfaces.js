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
  return db.createTable('surfaces', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull:true
    },
    surface: {
      type: 'string',
      length: 45,
      notNull: true
    },
    surface_abbreviation: {
      type: 'string',
      length: 5
    }

  })
};

exports.down = function(db) {
  return db.dropTable('surfaces');
};

exports._meta = {
  "version": 1
};
