var request = require("request"),
  messageHelper = require("./message-helper"),
  sc = require("./status-codes");

hashToQuery = async function(apiKey, memberKey, hashedQueries, callback) {
  try {
    var body;
    if (hashedQueries instanceof Array) {
      body = JSON.stringify(hashedQueries);
    } else {
      body = JSON.stringify([hashedQueries]);
    }

    var options = {
      url: "http://softwarecartoon.com:9391/api/request/queries",
      headers: {
        "Content-Type": "application/json",
        apiKey: apiKey,
        memberKey: memberKey
      },
      body: body
    };
    request.post(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var parseData = JSON.parse(body);
        messageHelper.successMessage("Queris loaded success", parseData);
        callback(parseData);
      } else {
        callback(sc.getMessageByCode(602));
      }
    });
  } catch (err) {
    messageHelper.errorMessage("Something went wrong", err);
  }
};

module.exports.hashToQuery = hashToQuery;
