var { Pool } = require('pg');
    sc = require('./status-codes');
// const shouldAbort = (err) => {
//     if (err) {
//         console.error('Error in transaction', err.stack);
//         client.query('ROLLBACK', (err) => {
//             if (err) {
//                 console.error('Error rolling back client', err.stack)
//             }
//             // release the client back to the pool
//             done();
//         })
//     }
//     return !!err
// };

function callQuery(query, callback) {
    var lcQuery = query.toLowerCase();
    if (lcQuery.includes('insert')) {
        query = query.slice(0, -1) + ' RETURNING id;';

        if (txid in connMap) {
            client = connMap[txid];

            client.query(query, [], (err, result) => {
                // if (shouldAbort(err)) return;
                if (err) {
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            console.log('Error rolling back client', err.stack)
                        }
                        // release the client back to the pool
                       client.release();
                    });

                    callback(parseError(err));
                }
                if (result && result.rowCount > 0) {
                    callback({lastId: result.rows[0].id});
                } else if (result && result.rowCount === 0) {
                    callback({
                        status: 'The item was not found with the given conditions'
                    });
                } else {
                    callback(sc.getMessageByCode(500));
                }

            })
        } else {

            const pool = new Pool({
                user: 'admin',
                host: 'softwarecartoon.com',
                database: 'test_jsql_db',
                password: 'admin123',
                port: 5432,
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 10000
            });

            pool.connect((err, client, done) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }

                client.query('BEGIN', (err) => {
                    // if (shouldAbort(err)) return;
                    if (err) {
                        client.query('ROLLBACK', (err) => {
                            if (err) {
                                console.log('Error rolling back client', err.stack)
                            }
                            // release the client back to the pool
                            client.release();
                        });

                        callback(parseError(err));
                    }

                    client.query(query, [], (err, result) => {
                        // if (shouldAbort(err)) return;
                        if (err) {
                            client.query('ROLLBACK', (err) => {
                                if (err) {
                                    console.log('Error rolling back client', err.stack)
                                }
                                // release the client back to the pool
                                client.release();
                            });

                            callback(parseError(err));
                        }

                        if (result && result.rowCount > 0) {
                            callback({lastId: result.rows[0].id});
                        } else if (result && result.rowCount === 0) {
                            callback({
                                status: 'The item was not found with the given conditions'
                            });
                        } else {
                            callback(sc.getMessageByCode(500));
                        }

                    })
                });

                connMap[txid] = client;
            })

        }

    } else if (lcQuery.includes('update')) {

        if (txid in connMap) {
            client = connMap[txid];

            client.query(query, [], (err, result) => {
                // if (shouldAbort(err)) return;
                if (err) {
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            console.log('Error rolling back client', err.stack)
                        }
                        // release the client back to the pool
                        client.release();
                    });

                    delete connMap[txid];
                    return callback(parseError(err));
                }
                if (result && result.rowCount > 0) {
                    callback({status: 'OK'});
                } else if (result && result.rowCount === 0) {
                    callback({
                        status: 'The item was not found with the given conditions'
                    });
                } else {
                    callback(sc.getMessageByCode(500));
                }

            })
        } else {
            const pool = new Pool({
                user: 'admin',
                host: 'softwarecartoon.com',
                database: 'test_jsql_db',
                password: 'admin123',
                port: 5432,
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 10000
            });

            pool.connect((err, client, done) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }

                client.query('BEGIN', (err) => {
                    // if (shouldAbort(err)) return;
                    if (err) {
                        client.query('ROLLBACK', (err) => {
                            if (err) {
                                console.log('Error rolling back client', err.stack)
                            }
                            // release the client back to the pool
                            client.release();
                        });

                        callback(parseError(err));
                    }

                    client.query(query, [], (err, result) => {
                        // if (shouldAbort(err)) return;
                        if (err) {
                            client.query('ROLLBACK', (err) => {
                                if (err) {
                                    console.log('Error rolling back client', err.stack)
                                }
                                // release the client back to the pool
                                client.release();
                            });

                            delete connMap[txid];
                            return callback(parseError(err));
                        }

                        if (result && result.rowCount > 0) {
                            callback({status: 'OK'});
                        } else if (result && result.rowCount === 0) {
                            callback({
                                status: 'The item was not found with the given conditions'
                            });
                        } else {
                            callback(sc.getMessageByCode(500));
                        }

                    })
                });

                connMap[txid] = client;
            })

        }

    } else if (lcQuery.includes('select')) {

        if (txid in connMap) {
            client = connMap[txid];

            client.query(query, [], (err, result) => {
                // if (shouldAbort(err)) return;
                if (err) {
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            console.log('Error rolling back client', err.stack)
                        }
                        // release the client back to the pool
                        client.release();
                    });

                    delete connMap[txid];
                    return callback(parseError(err));
                }
                if (result && result.rowCount > 0) {
                    callback({result});
                } else if (result && result.rowCount === 0) {
                    callback({
                        status: 'The item was not found with the given conditions'
                    });
                } else {
                    callback(sc.getMessageByCode(500));
                }

            })
        } else {
            const pool = new Pool({
                user: 'admin',
                host: 'softwarecartoon.com',
                database: 'test_jsql_db',
                password: 'admin123',
                port: 5432,
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 10000
            });

            pool.connect((err, client, done) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }

                client.query('BEGIN', (err) => {
                    // if (shouldAbort(err)) return;
                    if (err) {
                        client.query('ROLLBACK', (err) => {
                            if (err) {
                                console.log('Error rolling back client', err.stack)
                            }
                            // release the client back to the pool
                            client.release();
                        });

                        callback(parseError(err));
                    }

                    client.query(query, [], (err, result) => {
                        // if (shouldAbort(err)) return;
                        if (err) {
                            client.query('ROLLBACK', (err) => {
                                if (err) {
                                    console.log('Error rolling back client', err.stack)
                                }
                                // release the client back to the pool
                                client.release();
                            });

                            delete connMap[txid];
                            return callback(parseError(err));
                        }

                        if (result && result.rowCount > 0) {
                            callback({result});
                        } else if (result && result.rowCount === 0) {
                            callback({
                                status: 'The item was not found with the given conditions'
                            });
                        } else {
                            callback(sc.getMessageByCode(500));
                        }

                    })
                });

                connMap[txid] = client;
            })

        }

    } else if (lcQuery.includes('delete')) {
        query = query.slice(0, -1) + ' RETURNING id;';

        if (txid in connMap) {
            client = connMap[txid];

            client.query(query, [], (err, result) => {
                // if (shouldAbort(err)) return;
                if (err) {
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            console.log('Error rolling back client', err.stack)
                        }
                        // release the client back to the pool
                        client.release();
                    });

                    delete connMap[txid];
                    return callback(parseError(err));
                }
                if (result && result.rowCount > 0) {
                    callback({deletedId: result.rows[0].id});
                } else if (result && result.rowCount === 0) {
                    callback({
                        status: 'The item was not found with the given conditions'
                    });
                } else {
                    callback(sc.getMessageByCode(500));
                }

            })
        } else {
            const pool = new Pool({
                user: 'admin',
                host: 'softwarecartoon.com',
                database: 'test_jsql_db',
                password: 'admin123',
                port: 5432,
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 10000
            });

            pool.connect((err, client, done) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }

                client.query('BEGIN', (err) => {
                    // if (shouldAbort(err)) return;
                    if (err) {
                        client.query('ROLLBACK', (err) => {
                            if (err) {
                                console.log('Error rolling back client', err.stack)
                            }
                            // release the client back to the pool
                            client.release();
                        });

                        callback(parseError(err));
                    }

                    client.query(query, [], (err, result) => {
                        // if (shouldAbort(err)) return;
                        if (err) {
                            client.query('ROLLBACK', (err) => {
                                if (err) {
                                    console.log('Error rolling back client', err.stack)
                                }
                                // release the client back to the pool
                                client.release();
                            });

                            delete connMap[txid];
                            return callback(parseError(err));
                        }

                        if (result && result.rowCount > 0) {
                            callback({deletedId: result.rows[0].id});
                        } else if (result && result.rowCount === 0) {
                            callback({
                                status: 'The item was not found with the given conditions'
                            });
                        } else {
                            callback(sc.getMessageByCode(500));
                        }

                    })
                });

                connMap[txid] = client;
            })

        }

    } else {
        callback(sc.getMessageByCode(400));
    }
}

function callCommit(callback) {
    if (txid in connMap) {
        client = connMap[txid];

        client.query('COMMIT', (err) => {
            // if (shouldAbort(err)) return;
            if (err) {
                client.query('ROLLBACK', (err) => {
                    if (err) {
                        console.log('Error rolling back client', err.stack)
                    }
                    // release the client back to the pool
                    client.release();
                    client.done();
                });

                callback(parseError(err));
            } else {
                client.release();
                callback({status: 'Transaction Complete.'});
                delete connMap[txid];
            }
        });
    } else {
        callback({
            status: 'The transaction has already been released.'
        });
    }
}

function callManyOrNone(query, callback) {
    db.manyOrNone(query)
        .then(function(data) {
            if (data && data.length === 0) {
                callback({
                    status: 'The item was not found with the given conditions'
                });
            } else {
                callback(data);
            }
        })
        .catch(function(error) {
            callback(parseError(error));
        });
}

function callResult(query, callback) {
    query = query.slice(0, -1) + ' RETURNING id;';
    db.result(query)
        .then(function(data) {
            if (data && data.rowCount > 0) {
                callback({lastId: data.rows[0].id});
            } else if (data && data.rowCount === 0) {
                callback({
                    status: 'The item was not found with the given conditions'
                });
            } else {
                callback(sc.getMessageByCode(500));
            }
        })
        .catch(function(error) {
            callback(parseError(error));
        });
}

function parseError(error) {
    if (error && error.code === '42703') {
        return {error: 'Column not exist'};
    } else if (error && error.code === '42P01') {
        return {error: 'Table not exist'};
    } else if (error && error.code === '23505') {
        return {error: 'Duplicate key value violates unique constraint'};
    } else {
        return {error: error};
    }
}

function onCloseServer() {
    if (db && db.$pool) {
        db.$pool.end;
    }
}

module.exports.callQuery = callQuery;
module.exports.onCloseServer = onCloseServer;
module.exports.callCommit = callCommit;

//poprzednia wersja
// var pgp = require('pg-promise')({
//         /*options*/
//     }),
//     sc = require('./status-codes');
// var db = pgp('postgres://admin:admin123@softwarecartoon.com:5432/test_jsql_db');
//
// function callQuery(query, callback) {
//     var lcQuery = query.toLowerCase();
//     if (lcQuery.includes('insert')) {
//         callResult(query, callback);
//     } else if (lcQuery.includes('update')) {
//         callResult(query, callback);
//     } else if (lcQuery.includes('select')) {
//         callManyOrNone(query, callback);
//     } else if (lcQuery.includes('delete')) {
//         callResult(query, callback);
//     } else {
//         callback(sc.getMessageByCode(400));
//     }
// }
//
// function callManyOrNone(query, callback) {
//     db.manyOrNone(query)
//         .then(function(data) {
//             if (data && data.length === 0) {
//                 callback({
//                     status: 'The item was not found with the given conditions'
//                 });
//             } else {
//                 callback(data);
//             }
//         })
//         .catch(function(error) {
//             callback(parseError(error));
//         });
// }
//
// function callResult(query, callback) {
//     query = query.slice(0, -1) + ' RETURNING id;';
//     db.result(query)
//         .then(function(data) {
//             if (data && data.rowCount > 0) {
//                 callback({lastId: data.rows[0].id});
//             } else if (data && data.rowCount === 0) {
//                 callback({
//                     status: 'The item was not found with the given conditions'
//                 });
//             } else {
//                 callback(sc.getMessageByCode(500));
//             }
//         })
//         .catch(function(error) {
//             callback(parseError(error));
//         });
// }
//
// function parseError(error) {
//     if (error && error.code === '42703') {
//         return {error: 'Column not exist'};
//     } else if (error && error.code === '42P01') {
//         return {error: 'Table not exist'};
//     } else if (error && error.code === '23505') {
//         return {error: 'Duplicate key value violates unique constraint'};
//     } else {
//         return {error: error};
//     }
// }
//
// function onCloseServer() {
//     if (db && db.$pool) {
//         db.$pool.end;
//     }
// }
//
// module.exports.callQuery = callQuery;
// module.exports.onCloseServer = onCloseServer;

