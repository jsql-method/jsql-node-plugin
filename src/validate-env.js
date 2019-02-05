require("dotenv").config();
var sc = require("./status-codes");

function checkValidENVFile() {
  /**Check all required keys are defined in .env */
  if (process.env.API_KEY && process.env.MEMBER_KEY) {
    return {
      success: true,
      apiKey: process.env.API_KEY,
      memberKey: process.env.MEMBER_KEY
    };
  } else if (!process.env.API_KEY) {
    return sc.getMessageByCode(603);
  } else if (!process.env.MEMBER_KEY) {
    return sc.getMessageByCode(611);
  } else {
    return sc.getMessageByCode(500);
  }
}

module.exports.checkValidENVFile = checkValidENVFile;
