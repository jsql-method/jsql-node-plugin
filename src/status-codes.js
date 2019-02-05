var codes = [
  {
    code: 400,
    value: "Bad request",
    message: "Invalid query syntax",
    hint: "Check the correctness of the query or fill in all required fields"
  },
  {
    code: 401,
    value: "Unauthorized",
    message: "Operation not allowed for not logged on user",
    hint: "Please log in"
  },
  {
    code: 403,
    value: "Insufficient permissions",
    message: "Operation not allowed for not logged on user",
    hint: "Please log in"
  },
  {
    code: 601,
    value: "User with that token does not exist",
    message: "A user with such an activation token does not exist",
    hint: "Try to log in, if this does not help, contact the help desk"
  },
  {
    code: 602,
    value: "You can not change the type of query",
    message:
      "The error occurs when the user wants to change the query type eg from SELECT to INSERT etc.",
    hint: "You should leave the query type as it was initial"
  },
  {
    code: 603,
    value: "Your application key does not match.",
    message:
      "An operation that uses an application key that does not match the key value that this operation uses",
    hint:
      "Check if we are modifying something from another application, change the application key, if it does not help, contact the help desk"
  },
  {
    code: 611,
    value: "No such application or member.",
    message: "The system did not find the requested application or team member",
    hint:
      "Check the correctness of the database type setting, if this does not help, contact the help desk"
  },
  {
    code: 619,
    value: "Can't call database",
    message: "The system did not find support for the database",
    hint:
      "Check the correctness of the entered data, check Token, MEMBER_KEY and API_KEY if this does not help, contact the help desk"
  },
  {
    code: 620,
    value: "No found token",
    message: "The system did not find token or token is invalid",
    hint:
      "Check the token of the entered data, if this does not help, contact the help desk"
  },
  {
    code: 621,
    value: "Unknown type of query",
    message:
      "The error occurs when the user types unknown type of sql queries [select, update, delete, insert].",
    hint: "You should leave the query type as it was initial"
  },
  {
    code: 622,
    value: "Wrong HTTP method",
    message:
      "The error occurs when the user types wrong type of sql queries to http method.",
    hint:
      "You should use one of the [POST/select, POST/update, POST/delete, POST/update]"
  },
  {
    code: 500,
    value: "Internal Server Error.",
    message:
      "Internal server error - the server encountered unexpected difficulties that prevented the request from completing",
    hint: "Contact the help desk"
  }
];

function getMessageByCode(code) {
  for (var i = 0; i < codes.length; i++) {
    if (codes[i]["code"] === code) {
      return codes[i];
    }
  }
  return codes[codes.length - 1];
}

module.exports.getMessageByCode = getMessageByCode;
