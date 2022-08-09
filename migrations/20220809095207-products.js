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
  return db.createTable('products', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notnull: true
    },
    name: {
      type: 'string',
      length: 100,
      notnull: true
    },
    cost: {
      type: 'smallint',
      notnull: true
    },
    description: {
      type: 'text'
    },
    image_url: {
      type: 'string',
      length: 2048,
      notnull: true
    },
    thumbnail_url: {
      type: 'string',
      length: 2048
    },
    colour_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'product_colour_fk',
        table: 'colours',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    closure_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'product_closure_fk',
        table: 'closures',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    cutting_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'product_cutting_fk',
        table: 'cuttings',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    collection_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'product_collection_fk',
        table: 'collections',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    surface_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'product_surface_fk',
        table: 'surfaces',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    upper_material_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'product_upper_material_fk',
        table: 'upper_materials',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    brand_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'product_brand_fk',
        table: 'brands',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    }
  })
};

exports.down = function (db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
