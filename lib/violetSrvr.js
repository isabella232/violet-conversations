var path = require('path');
var express = require('express');
var http = require('http');

var violet = require('./violet.js').server();

module.exports = (prefix)=>{
  var expressApp = express();
  var alexaRouter = express.Router();
  expressApp.set('view engine', 'ejs');
  expressApp.set('views', path.join(__dirname, '..', 'tester-views'));
  expressApp.use(express.static(path.join(__dirname, '..', 'tester-views')));
  if (prefix)
    expressApp.use(prefix, alexaRouter);

  var srvrInstance = null;

  var violetSrvr = {
    createAndListen: (port)=>{
      srvrInstance = http.createServer(expressApp);
      srvrInstance.listen(process.env.PORT || 8080);
      return srvrInstance;
    },

    getAlexaRouter: ()=>{
      return alexaRouter;
    },

    displayScriptInitialized: (srvrInstance, script)=>{
      var host = srvrInstance.address().address;
      var port = srvrInstance.address().port;
      if (host=='::') host='localhost'
      console.log(`>>> Script running at: http://${host}:${port}${prefix}/${script.app.name}`);
    },

    loadScript: (path, name)=>{
      var script = violet.loadScript(path, name, alexaRouter);
      violetSrvr.displayScriptInitialized(srvrInstance, script);
      return script;
    }

  };

  return violetSrvr;

};