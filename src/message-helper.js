function errorMessage(msg, stacktrace) {
  var errorMessage = {
    status: "err",
    msg: msg,
    stacktrace: stacktrace
  };
  console.error(errorMessage);
}

function successMessage(msg, element) {
  var successMessage = {
    status: "success",
    msg: msg,
    element: element
  };
}

module.exports.errorMessage = errorMessage;
module.exports.successMessage = successMessage;
