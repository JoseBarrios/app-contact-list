const config = require(`${global.APP_ROOT}/config/mongo-secret.json`)
const MongoDB = require('api-mongodb');
const ObjectID = MongoDB.ObjectID;
const mongo = new MongoDB(config.url);
const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

//CREATE INDEXED COLLECTIONS HERE
mongo.createCollectionWithTemporaryDocuments('codes.temp', 'dateSent', HOUR * 48 );
mongo.ObjectID = MongoDB.ObjectID;
module.exports = mongo;
