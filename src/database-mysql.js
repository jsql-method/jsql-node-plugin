var mysqlObj = require('mysql'),
    sc = require('./status-codes');


function callQuery(query, callback) {

  var lcQuery = query.toLowerCase();
  if (lcQuery.includes("insert")) {

      if (txid in connMap) {
          db = connMap[txid];
          //console.log('połaczony już z : ' + db.threadId);
          //console.log(db);

          db.query(query, function(err, result) {
              if (err) {
                  db.rollback(function() {
                      throw err;
                  });
              }

              if (result && result.affectedRows > 0) {
                  callback({lastId: result.insertId});
              } else if (data && result.affectedRows === 0) {
                  callback({
                      status: 'Something went wrong: ' + result.message
                  });
              } else {
                  callback(sc.getMessageByCode(500));
              }

          });
      } else {
          var db = mysqlObj.createPool({
              // connectionLimit : 5,
              host     : 'localhost',
              port     : '3306',
              user     : 'root',
              password : '',
              database : 'jsql_api'
          });

          db.getConnection(function(err, connection) {
              if (err) {
                  console.error('error connecting: ' + err.stack);
                  return;
              }

              connection.beginTransaction(function(err) {
                  if (err) { throw err; }
                  connection.query(query, function(err, result) {
                      if (err) {
                          connection.rollback(function() {
                              throw err;
                          });
                      }

                      if (result && result.affectedRows > 0) {
                          callback({lastId: result.insertId});
                      } else if (data && result.affectedRows === 0) {
                          callback({
                              status: 'Something went wrong: ' + result.message
                          });
                      } else {
                          callback(sc.getMessageByCode(500));
                      }

                  });
              });

              //console.log('connected as id ' + connection.threadId);
              connMap[txid] = connection;
          });
      }

      //console.log('TO SA KONEKCJE ZAPISANE W TABLICY ' , connMap);
  } else if (lcQuery.includes("update")) {

      if (txid in connMap) {
          db = connMap[txid];
          //console.log('połaczony już z : ' + db.threadId);
          //console.log(db);

          db.query(query, function(err, result) {
              if (err) {
                  db.rollback(function() {
                      throw err;
                  });
              }

              if (result && result.affectedRows > 0) {
                  callback({affectedRows: result.affectedRows,
                  changedRows: result.changedRows});
              } else if (data && result.affectedRows === 0) {
                  callback({
                      status: 'Something went wrong: ' + result.message
                  });
              } else {
                  callback(sc.getMessageByCode(500));
              }

          });
      } else {
          var db = mysqlObj.createPool({
              // connectionLimit : 5,
              host     : 'localhost',
              port     : '3306',
              user     : 'root',
              password : '',
              database : 'jsql_api'
          });

          db.getConnection(function(err, connection) {
              if (err) {
                  console.error('error connecting: ' + err.stack);
                  return;
              }

              connection.beginTransaction(function(err) {
                  if (err) { throw err; }
                  connection.query(query, function(err, result) {
                      if (err) {
                          connection.rollback(function() {
                              throw err;
                          });
                      }

                      if (result && result.affectedRows > 0) {
                          callback({affectedRows: result.affectedRows,
                              changedRows: result.changedRows});
                      } else if (data && result.affectedRows === 0) {
                          callback({
                              status: 'Something went wrong: ' + result.message
                          });
                      } else {
                          callback(sc.getMessageByCode(500));
                      }

                  });
              });

              //console.log('connected as id ' + connection.threadId);
              connMap[txid] = connection;
              //console.log('pojedyncza update', connMap[txid]);
          });
      }

      //console.log('TO SA KONEKCJE ZAPISANE W TABLICY ' , connMap);
  } else if (lcQuery.includes("select")) {

      if (txid in connMap) {
          db = connMap[txid];
          //console.log('połaczony już z : ' + db.threadId);
          //console.log(db);

          db.query(query, function(err, result) {
              if (err) {
                  db.rollback(function() {
                      throw err;
                  });
              }
//console.log(result);
              if (result) {
                  callback({result});
              } else if (data && result.affectedRows === 0) {
                  callback({
                      status: 'Something went wrong: ' + result.message
                  });
              } else {
                  callback(sc.getMessageByCode(500));
              }

          });
      } else {
          var db = mysqlObj.createPool({
              // connectionLimit : 5,
              host     : 'localhost',
              port     : '3306',
              user     : 'root',
              password : '',
              database : 'jsql_api'
          });

          db.getConnection(function(err, connection) {
              if (err) {
                  console.error('error connecting: ' + err.stack);
                  return;
              }

              connection.beginTransaction(function(err) {
                  if (err) { throw err; }
                  connection.query(query, function(err, result) {
                      if (err) {
                          connection.rollback(function() {
                              throw err;
                          });
                      }
//console.log(result);
                      if (result) {
                          callback({result});
                      } else if (data && result.affectedRows === 0) {
                          callback({
                              status: 'Something went wrong: ' + result.message
                          });
                      } else {
                          callback(sc.getMessageByCode(500));
                      }

                  });
              });

              //console.log('connected as id ' + connection.threadId);
              connMap[txid] = connection;
              //console.log('pojedyncza update', connMap[txid]);
          });
      }

  } else if (lcQuery.includes("delete")) {

      if (txid in connMap) {
          db = connMap[txid];
          //console.log('połaczony już z : ' + db.threadId);
          //console.log(db);

          db.query(query, function(err, result) {
              if (err) {
                  db.rollback(function() {
                      throw err;
                  });
              }

              if (result && result.affectedRows > 0) {
                  callback({affectedRows: result.affectedRows});
              } else if (data && result.affectedRows === 0) {
                  callback({
                      status: 'Something went wrong: ' + result.message
                  });
              } else {
                  callback(sc.getMessageByCode(500));
              }

          });
      } else {
          var db = mysqlObj.createPool({
              // connectionLimit : 5,
              host     : 'localhost',
              port     : '3306',
              user     : 'root',
              password : '',
              database : 'jsql_api'
          });

          db.getConnection(function(err, connection) {
              if (err) {
                  console.error('error connecting: ' + err.stack);
                  return;
              }

              connection.beginTransaction(function(err) {
                  if (err) { throw err; }
                  connection.query(query, function(err, result) {
                      if (err) {
                          connection.rollback(function() {
                              throw err;
                          });
                      }

                      if (result && result.affectedRows > 0) {
                          callback({affectedRows: result.affectedRows});
                      } else if (data && result.affectedRows === 0) {
                          callback({
                              status: 'Something went wrong: ' + result.message
                          });
                      } else {
                          callback(sc.getMessageByCode(500));
                      }

                  });
              });

              //console.log('connected as id ' + connection.threadId);
              connMap[txid] = connection;
              //console.log('pojedyncza update', connMap[txid]);
          });
      }

  }
}

function onCloseServer() {
  //TODO:
  //   mysqlObj.end(function(err) {
  //       // The connection is terminated now
  //       console.log(err);
  //   });
}

function callCommit(callback) {
    if (txid in connMap) {
        db = connMap[txid];
        //console.log('połaczony już z : ' + db.threadId);

        db.commit(function(err, result) {
            if (err) {
                db.rollback(function() {
                    throw err;
                });
            }
            //console.log('wynik commita: ',result);
            db.destroy();
            callback({
                status: 'Transaction Complete.'
            });
        });
        delete connMap[txid];
    } else {
        //console.log(' ');
        callback({
            status: 'moje - The transaction has already been released.'
        });
    }
}

module.exports.onCloseServer = onCloseServer;
module.exports.callQuery = callQuery;
module.exports.callCommit = callCommit;
