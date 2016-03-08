'use strict';
var Datastore = require('nedb');
var path= require('path');
var config=require('config');

var db={};
db.const={};
db.Datastore= Datastore;

var path=config.get('dbname') + '/';
db.const.USERS=path + 'USERS';
db.const.SUBMISSIONS=path + 'SUBMISSIONS';


module.exports=db;