'use strict';
/**Deprecated We use request lib*/
var Q = require('q');
var http = require('http');
var urlNode = require('url');
var tough = require('tough-cookie');

var cookiejar = new tough.CookieJar();

function MsRequest() {
  this.options={method: 'GET', headers : {
    'Content-Type': 'application/json;charset=UTF-8'
  }};

  this.request = function(_url, _data, _header, _method) {
    var _self = this;
    var options = urlNode.parse(_url);
    options.method = _method;
    options.headers = _header || {
      'Content-Type': 'application/json;charset=UTF-8'
    };

    cookiejar.getCookies(_url,function(err, cookies){
      //console.log('set cookies', cookies);
      options.headers.Cookie = cookies.join('; ');
    });

    //console.log(options);

    var q = Q.defer();
    var responseObj = {};

    var req = http.request(options, function (res) {
      responseObj.status = res.statusCode;
      responseObj.headers = res.headers;
      responseObj.data='';

      var Cookie = tough.Cookie;
      if (res.headers['set-cookie']) {
        if (res.headers['set-cookie'] instanceof Array) {
          _self.cookies = res.headers['set-cookie'].map(function (c) {
            var cookie=Cookie.parse(c);
            cookiejar.setCookie(c, _url,{},function(){});
            return cookie;
          });
        }
        else {
          _self.cookies = [Cookie.parse(res.headers['set-cookie'])];
        }
      }

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        responseObj.data+=chunk;
      });

      res.on('end', function () {
        //console.log('end', responseObj);
        responseObj.dataJson = JSON.parse(responseObj.data);
        q.resolve(responseObj);
      });

    });
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      q.reject(e);
    });
    if (_data) {
      req.write(JSON.stringify(_data));
    }
    req.end();
    return q.promise;

  };
  this.get = function(_url, _header) {
    return this.request(_url, undefined, _header, 'GET');
  };
  this.post = function(_url, _data, _header) {
    return this.request(_url, _data, _header, 'POST');
  };
}


module.exports = MsRequest;