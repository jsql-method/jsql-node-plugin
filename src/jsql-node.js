let rp = require('request-promise');

function JsqlConfig(apiKey, devKey, readTimeout, connectTimeout, providerUrl) {
    this.apiKey = apiKey;
    this.devKey = devKey;
    this.readTimeout = readTimeout || 10000;
    this.connectTimeout = connectTimeout || 15000;
    this.providerUrl = providerUrl || "https://provider.Jsql.it/api/Jsql";

}

function JsqlResponse(response, transactionId) {
    this.response = response;
    this.transactionId = transactionId;
}

let Jsql = {};

Jsql.TRANSACTION_ID = "txid";

Jsql.__call = function (transactionId, fullUrl, request, config) {

    return rp({
        method: 'POST',
        url: fullUrl,
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': config.apiKey,
            'Dev-Key': config.devKey
        },
        simple: false,
        resolveWithFullResponse: true
    }).then(function (response) {
        return new JsqlResponse(JSON.parse(response.body), response.headers[Jsql.TRANSACTION_ID] || null);
    }).catch(function(error){
        return new JsqlResponse(error, null);
    });

};

Jsql.__callSelect = function (transactionId, data, config) {
    return Jsql.__call(transactionId, config.providerUrl + "/select", data, config);
};

Jsql.__callDelete = function (transactionId, data, config) {
    return Jsql.__call(transactionId, config.providerUrl + "/delete", data, config);
};

Jsql.__callUpdate = function (transactionId, data, config) {
    return Jsql.__call(transactionId, config.providerUrl + "/update", data, config);
};

Jsql.__callInsert = function (transactionId, data, config) {
    return Jsql.__call(transactionId, config.providerUrl + "/insert", data, config);
};

Jsql.__callRollback = function (transactionId, config) {
    return Jsql.__call(transactionId, config.providerUrl + "/rollback", null, config);
};

Jsql.__callCommit = function (transactionId, config) {
    return Jsql.__call(transactionId, config.providerUrl + "/commit", null, config);
};

Jsql.select = function (req, res, config) {

    function handleResponse(jsqlResponse){

        if (jsqlResponse.transactionId != null) {
            res.setHeader(Jsql.TRANSACTION_ID, jsqlResponse.transactionId);
        }

        res.status(200).json(jsqlResponse.response);

    }

    Jsql.__callSelect(req.headers[Jsql.TRANSACTION_ID], req.body, config)
        .then(handleResponse).catch(handleResponse);

};

Jsql.delete = function (req, res, config) {

    function handleResponse(jsqlResponse){

        if (jsqlResponse.transactionId != null) {
            res.setHeader(Jsql.TRANSACTION_ID, jsqlResponse.transactionId);
        }

        res.status(200).json(jsqlResponse.response);

    }

    Jsql.__callDelete(req.headers[Jsql.TRANSACTION_ID], req.body, config)
        .then(handleResponse).catch(handleResponse);

};

Jsql.update = function (req, res, config) {

    function handleResponse(jsqlResponse){

        if (jsqlResponse.transactionId != null) {
            res.setHeader(Jsql.TRANSACTION_ID, jsqlResponse.transactionId);
        }

        res.status(200).json(jsqlResponse.response);

    }

    Jsql.__callUpdate(req.headers[Jsql.TRANSACTION_ID], req.body, config)
        .then(handleResponse).catch(handleResponse);

};

Jsql.insert = function (req, res, config) {

    function handleResponse(jsqlResponse){

        if (jsqlResponse.transactionId != null) {
            res.setHeader(Jsql.TRANSACTION_ID, jsqlResponse.transactionId);
        }

        res.status(200).json(jsqlResponse.response);

    }

    Jsql.__callInsert(req.headers[Jsql.TRANSACTION_ID], req.body, config)
        .then(handleResponse).catch(handleResponse);

};

Jsql.rollback = function (req, res, config) {

    function handleResponse(jsqlResponse){
        res.status(200).json(jsqlResponse.response);
    }

    Jsql.__callRollback(req.headers[Jsql.TRANSACTION_ID], config)
        .then(handleResponse).catch(handleResponse);


};

Jsql.commit = function (req, res, config) {

    function handleResponse(jsqlResponse){
        res.status(200).json(jsqlResponse.response);
    }

    Jsql.__callCommit(req.headers[Jsql.TRANSACTION_ID], config)
        .then(handleResponse).catch(handleResponse);

};

module.exports = {
    JsqlConfig: JsqlConfig,
    Jsql: Jsql
};