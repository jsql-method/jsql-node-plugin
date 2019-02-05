var postgres = require("./database-postgresql"),
  mysql = require("./database-mysql"),
  sc = require("./status-codes");

function proxyCall(databaseType, query, callback) {
  var lcQuery = query.toLowerCase();
  databaseType = databaseType.toLowerCase();

  if (
    lcQuery.includes("insert") ||
    lcQuery.includes("select") ||
    lcQuery.includes("delete") ||
    lcQuery.includes("update")
  ) {
    if (databaseType.toLowerCase() === "postgres") {
      return postgres.callQuery(query, callback);
    } else if (databaseType === "mysql" || databaseType === "my_sql") {
      return mysql.callQuery(query, callback);
    } else {
      callback(sc.getMessageByCode(611));
    }
  } else {
    callback(sc.getMessageByCode(621));
  }
}

function proxyCommit(databaseType, callback) {
    databaseType = databaseType.toLowerCase();

    if (databaseType === "postgres") {
        return postgres.callCommit(callback);
    } else if (databaseType === "mysql" || databaseType === "my_sql") {
        return mysql.callCommit(callback);
    } else {
        callback(sc.getMessageByCode(611));
    }
}

function closeConnections() {
  postgres.onCloseServer();
  mysql.onCloseServer();
}

module.exports.proxyCall = proxyCall;
module.exports.closeConnections = closeConnections;
module.exports.proxyCommit = proxyCommit;
