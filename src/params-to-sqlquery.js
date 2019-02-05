function paramsToSQLQuery(query, params) {
  if (query.includes('?')) {
    return exchangeParameterByQuestionMark(query, params);
  } else {
    return exchangeParameterByDot(query, params);
  }
}

function queryHasAllParams(query, params) {
  if (query.includes('?')) {
    return queryHasAllParamsByQuestionMark(query, params);
  } else {
    return queryHasAllParamsByDot(query, params);
  }
}

function exchangeParameterByQuestionMark(query, params) {
  for (var item in params) {
    if (typeof params[item] === 'string' || params[item] instanceof String) {
      query = query.replace('?', "'" + params[item] + "'");
    } else {
      query = query.replace('?', params[item]);
    }
  }
  return query;
}

function exchangeParameterByDot(query, params) {
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      if (typeof params[key] === 'string' || params[key] instanceof String) {
        query = query.replace(':' + key + '', "'" + params[key] + "'");
      } else {
        query = query.replace(':' + key + '', params[key]);
      }
    }
  }
  if (query.slice(-1) !== ';') {
    query += ';';
  }
  return query;
}

function queryHasAllParamsByQuestionMark(query, params) {
  const querySplit = query.split('?').length - 1;
  const countOfQueryArgs = querySplit < 0 ? 0 : querySplit;
  const countOfParamsArgs = params ? params.length : 0;

  if (countOfQueryArgs <= countOfParamsArgs) {
    return true;
  } else {
    return [
      'Query has ' +
        countOfQueryArgs +
        ' params but provided ' +
        countOfParamsArgs
    ];
  }
}

function queryHasAllParamsByDot(query, params) {
  var queryParams = query.split(':');
  var result = [];
  var paramsLength = params ? Object.keys(params).length : 0;

  if (queryParams) {
    queryParams = queryParams.splice(1, queryParams.length);
  }

  queryParams.forEach(function(queryParam) {
    var currentParam = findAndReplace(queryParam.split(':')[0]).trim();

    if (!params || !params[currentParam]) {
      result.push(currentParam);
    }
  });

  if (result.length === 0 && queryParams.length <= paramsLength) {
    return true;
  } else {
    return result;
  }
}

function findAndReplace(string) {
  var index = string.indexOf(' '),
    i,
    j,
    target;
  if (index > 0) {
    string = string.substr(0, index);
  }

  i = 0;
  j = 0;
  length = string.length;
  target = [')', "'", ':', ',', ';', '='];

  for (i; i < length; i++) {
    for (j; j < target.length; j++) {
      string = string.replace(target[j], '');
    }
  }

  return string;
}

module.exports.paramsToSQLQuery = paramsToSQLQuery;
module.exports.queryHasAllParams = queryHasAllParams;
