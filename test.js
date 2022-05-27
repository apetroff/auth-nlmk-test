var http = require('http'),
    host = "auth.nlmk.com",
    port = "80",
    pathPrefix = "/int-user-svc/rest",
    loginPath = "/info",
    username = "Serebryakov_id",
    password = "uV@sD#x*CmTo",
    userId = 76264,
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");


function prepareRequestOptions(path, method) {
    var options = {
        host: host,
        port: port,
        path: pathPrefix + path,
        headers: {
            "Authorization": auth
        }
    };
    if (method) {
        options.method = method;
    }
    return options;
}

function httpGet(path, callback) {
    var req = http.request(prepareRequestOptions(path, 'GET'), function (res) {
        var buf = '';
        if (res.statusCode != 200) {
            throw "Request to '" + pathPrefix + path + "' failed with status: " + res.statusCode;
        }
        res.on('data', function (chunk) {
            buf += chunk;
        });
        res.on('end', function () {
            callback(buf);
        });
    });

    req.on('error', function (e) {
        throw e.message;
    });
    req.end();
}


/**
 * Channel service description
 */
describe("Internal User Service Authorization", function () {
    httpGet(loginPath, function (data) {
        data = JSON.parse(data);

        var user = data.user;

        expect(user).to.be.a('number');
        expect(user).to.equal(userId);


        done();
    });
}