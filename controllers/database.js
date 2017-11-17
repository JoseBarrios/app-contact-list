const config = require(`${global.APP_ROOT}/config/mongo-config.json`)
const MongoDB = require('api-mongodb');
const ObjectID = MongoDB.ObjectID;
const mongo = new MongoDB(config.url);
const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

//CREATE INDEXED COLLECTIONS HERE
mongo.createCollectionWithTemporaryDocuments('codes.temp', 'dateSent', HOUR * 48 );
module.exports = mongo;

/*let verifyCode = function(code, email){*/
  //return new Promise((resolve, reject)=> {
    //let query = {};
    //query.identifier = Number(code)
    //let errorMsg = 'Incorrect code';
    //mongo.findOne('codes.temp', query).then(tempDocument => {
      //if(tempDocument.email === email){
        //resolve(tempDocument);
      //} else {
        //reject(errorMsg);
      //}
    //}).catch(err =>{
      ////Not found
      //reject(errorMsg);
    //})
  //});
//}
