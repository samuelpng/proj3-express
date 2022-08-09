'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return null;
};

exports.down = function (db) {
  return db.createTable('positions_products', {
    id:
    {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notnull: true
    },
    product_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'products_positions_product_fk',
        table: 'products',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    position_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'products_positions_position_fk',
        table: 'positions',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    }
  });
};

exports._meta = {
  "version": 1
};
