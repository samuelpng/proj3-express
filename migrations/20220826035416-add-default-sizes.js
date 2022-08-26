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
  db.insert('sizes', ['size'], ['UK 5']);
  db.insert('sizes', ['size'], ['UK 5.5']);
  db.insert('sizes', ['size'], ['UK 6']);
  db.insert('sizes', ['size'], ['UK 6.5']);
  db.insert('sizes', ['size'], ['UK 7']);
  db.insert('sizes', ['size'], ['UK 7.5']);
  db.insert('sizes', ['size'], ['UK 8']);
  db.insert('sizes', ['size'], ['UK 8.5']);
  db.insert('sizes', ['size'], ['UK 9']);
  db.insert('sizes', ['size'], ['UK 9.5']);
  db.insert('sizes', ['size'], ['UK 10']);
  db.insert('sizes', ['size'], ['UK 10.5']);
  db.insert('sizes', ['size'], ['UK 11']);
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
