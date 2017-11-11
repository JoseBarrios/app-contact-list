const path = require('path');

if(process.env.NODE_ENV !== 'production'){
  global.APP_ROOT = path.resolve(__dirname);
}else{
  global.APP_ROOT = path.dirname(require.main.filename);
}

const appController = require('./controllers/app');
const app = appController.initApplication()
