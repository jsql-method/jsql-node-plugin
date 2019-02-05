var NodeCache = require("node-cache");
var request = require("request"),
  messageHelper = require("./message-helper"),
  memberKeyCache = new NodeCache(),
  sc = require("./status-codes");

function getMemberOptions(apiKey, memberKey, callback) {
  if (checkMemberKeyAndOptionsCache(memberKey)) {
    return callback({
      memberKey: memberKey,
      options: memberKeyCache.get(memberKey)
    });
  } else {
    try {
      getOptionsFromCloud(memberKey, apiKey, callback);
    } catch (err) {
      messageHelper.errorMessage("Options api broken", err);
    }
  }
}

getOptionsFromCloud = async function(memberKey, apiKey, callback) {
  try {
    var options = {
      url: "http://softwarecartoon.com:9391/api/request/options/all",
      headers: {
        "Content-Type": "application/json",
        memberKey: memberKey,
        apiKey: apiKey
      }
    };
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var parseData = JSON.parse(body).data;
        memberKeyCache.set("" + memberKey, parseData);
        callback({ memberKey: memberKey, options: parseData });
      } else {
        callback(sc.getMessageByCode(602));
      }
    });
  } catch (err) {
    messageHelper.errorMessage("Something went wrong", err);
  }
};

function checkMemberKeyAndOptionsCache(memberKey) {
  if (memberKeyCache.get(memberKey)) {
    messageHelper.successMessage(
      "Loading member key and options from cache success",
      memberKey
    );
    return true;
  } else {
    return null;
  }
}

module.exports.getMemberOptions = getMemberOptions;
