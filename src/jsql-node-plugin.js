/*
 * jsql-core
 *
 * Copyright (c) 2018 JSQL
 * Licensed under the ISC license.
 */

'use strict';

var express = require('express'),
  apiKey,
  memberKey,
  server,
  app = express(),
  cors = require('cors'),
  mk = require('./member-options'),
  htq = require('./hash-to-query'),
  pts = require('./params-to-sqlquery'),
  dbProxy = require('./database-proxy'),
  bodyParser = require('body-parser'),
  validEnv = require('./validate-env'),
  sc = require('./status-codes'),
  messageHelper = require('./message-helper');
global.connMap = ['cosss'];
global.txid = '';

// Configure http
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(function(err, req, res, next) {
  res.status(500).send(sc.getMessageByCode(500));
});

//API Endpoints
app.post('/select', function(req, res) {
    global.txid = req.headers.txid;

  messageHelper.successMessage('Trigger POST API /select', {});
  handleRequest(req, res, 'select');
});

app.post('/update', function(req, res) {
    global.txid = req.headers.txid;

  messageHelper.successMessage('Trigger POST API /update', {});
  handleRequest(req, res, 'update');
});

app.post('/insert', function(req, res) {
    global.txid = req.headers.txid;

  messageHelper.successMessage('Trigger POST API /insert', {});
  handleRequest(req, res, 'insert');
});

app.post('/delete', function(req, res) {
    global.txid = req.headers.txid;

  messageHelper.successMessage('Trigger POST API /delete', {});
  handleRequest(req, res, 'delete');
});

app.get('/commit', function(req, res) {
    global.txid = req.headers.txid;
    //console.log(req.headers.txid);

    messageHelper.successMessage('Trigger GET API /commit', {});
    dbProxy.proxyCommit('postgres', dbProxyCallback)

    function dbProxyCallback(result) {
        if (result && !result.error) {
            res.status(200).send(result);
        } else {
            res
                .status(400)
                .send(Object.assign(sc.getMessageByCode(400), result));
        }
    }
});

//chekc env
function checkEnv(res) {
  var check = validEnv.checkValidENVFile();
  if (check.success) {
    apiKey = check.apiKey;
    memberKey = check.memberKey;
  } else {
    res.status(611).send(sc.getMessageByCode(611));
  }
}

//Handle request
function handleRequest(req, res, type) {
  //Check env keys and return 500 if not defined
  checkEnv(res);

  if (!chekcRequestParams(req, res)) {
    return;
  }

  try {
    res.setHeader('Content-Type', 'application/json');

    init(req.body.token, req.body.params, function(dbType, sqlQueries, error) {

      if (!sqlQueries && !error) {
        res.status(400).send({
          code: 400,
          value: 'Bad request',
          message: 'Invalid query syntax',
          hint: 'Check the token of the entered data, if this does not help, contact the help desk'
        });
        return;
      }

      if (error) {
        res.status(error.code).send(error);
        return;
      }

      if (!checkRequestType(sqlQueries, type)) {
        res.status(400).send({
          code: 400,
          value: 'Bad request',
          message:
            'Only `' + type.toUpperCase() + '` queries allowed in this method!',
          hint: 'Check the token of the entered data, if this does not help, contact the help desk'
        });
        return;
      }

      /*"Wrong database dialect"*/
      if (typeof dbType === 'string' && dbType !== '' && dbType !== null) {
        messageHelper.successMessage(sqlQueries);

        dbProxy.proxyCall(dbType, sqlQueries, dbProxyCallback);

        function dbProxyCallback(result) {
          if (result && !result.error) {
            res.status(200).send(result);
          } else {
            res
              .status(400)
              .send(Object.assign(sc.getMessageByCode(400), result));
          }
        }
      } else {
        res.status(619).send(sc.getMessageByCode(619));
      }
    });
  } catch (err) {
    res.status(500).send(sc.getMessageByCode(500));
  }
}

//Init
function init(hashedQuery, params, callback) {
  var dbType;

  mk.getMemberOptions(apiKey, memberKey, getMemberOptionsCallback);

  function getMemberOptionsCallback(result) {
    if (result && !result.error) {
      if (result && result.options && result.options.databaseDialect) {
        dbType = result.options.databaseDialect;

        htq.hashToQuery(apiKey, memberKey, hashedQuery, hashToQueryCallback);
      } else {
        callback(sc.getMessageByCode(619));
      }
    } else {
      callback(sc.getMessageByCode(400));
    }

    function hashToQueryCallback(result) {
      if (result && !result.code && !result.hint) {
        var query = '';
        result.forEach(function(item) {
          query += ' ' + item.query;
        });
        query = query.trim();
        var checkAllParams = pts.queryHasAllParams(query, params);
        if (checkAllParams === true) {

          callback(dbType, pts.paramsToSQLQuery(query, params));
        } else {
          var message = sc.getMessageByCode(400);
          message.hint =
            'You have to include these params in request: ' +
            checkAllParams.toString();
          callback(null, null, message);
        }
      } else {
        callback(null, null, sc.getMessageByCode(400));
      }
    }
  }
}

function checkRequestType(sqlQuery, type) {

  if (!sqlQuery || sqlQuery.toLowerCase().includes(type)) {
    return true;
  } else {
    return false;
  }
}

function chekcRequestParams(req, res) {
  if (!req || !req.body || !req.body.token) {
    res.status(620).send(sc.getMessageByCode(620));
    return false;
  } else if (
    req &&
    req.body &&
    req.body.token instanceof Array &&
    req.body.token.length < 1
  ) {
    res.status(620).send(sc.getMessageByCode(620));
    return false;
  } else if (
    req &&
    req.body &&
    req.body.token instanceof String &&
    req.body.token.length < 10
  ) {
    res.status(620).send(sc.getMessageByCode(620));
    return false;
  } else {
    return true;
  }
}

server = app.listen(4000, function() {
  messageHelper.successMessage('Server is running.. on Port 4000', {});
});

process.on('exit', function() {
  server.close();
});

process.on('uncaughtException', function() {
  server.close();
});

process.on('SIGTERM', function() {
  server.close();
});
