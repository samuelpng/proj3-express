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
  return db.addColumn('collections', 'brand_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'collection_brand_fk',
      table: 'brands',
      rules: {
        onDelete: 'restrict',
        onUpdate: 'restrict'
      },
      mapping: 'id'
    }
  })
};

exports.down = function(db) {
  return db.removeForeignKey('collections', 'collection_brand_fk')
};

exports._meta = {
  "version": 1
};

