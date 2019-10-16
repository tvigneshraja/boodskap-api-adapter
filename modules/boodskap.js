var Utils = require("./utils")
var request = require('request');


var Boodskap = function (conf, token) {
    this.API_URL = conf.apiUrl;
    this.DOMAIN_KEY = conf.domainKey;
    this.API_KEY = conf.apiKey;
    this.API_TOKEN = token ? token : this.DOMAIN_KEY+":"+this.API_KEY;
    this.utils = new Utils();

};
module.exports = Boodskap;

// Authentication
Boodskap.prototype.thirdPartyLogin = function (data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/auth/push/token',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};
Boodskap.prototype.login = function (email, password, cbk) {

    const self = this;

    request.get({
        uri: self.API_URL + '/domain/login/'+email+'/'+password,
        headers: {'content-type': 'application/json'},
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};
Boodskap.prototype.logout = function () {

    const self = this;

    request.get({
        uri: self.API_URL + '/domain/logout/' + self.API_TOKEN,
        headers: {'content-type': 'application/json'},
    }, function (err, res, body) {

        if(!err) {

        }else{

        }

    });
};

// Elastic Search
Boodskap.prototype.elasticInsert = function (rid, data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/record/insert/dynamic/' + self.API_TOKEN +'/'+rid,
        headers: {'content-type': 'text/plain'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};
Boodskap.prototype.elasticUpdate = function (rid, rkey, data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/record/insert/static/' + self.API_TOKEN +'/'+rid +'/'+rkey,
        headers: {'content-type': 'text/plain'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};
Boodskap.prototype.elasticDelete = function (rid, rkey, data, cbk) {

    const self = this;

    request.delete({
        uri: self.API_URL + '/record/delete/' + self.API_TOKEN +'/'+rid +'/'+rkey,
        headers: {'content-type': 'application/json'},
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};
Boodskap.prototype.elasticSearch = function (rid, query, cbk) {

    const self = this;

    var obj = {
        "type": "RECORD",
        "specId": rid,
        "query" : JSON.stringify(query)
    }

    request.post({
        uri: self.API_URL + '/elastic/search/query/' + self.API_TOKEN ,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(obj),

    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                var resultObj = self.utils.elasticQueryFormatter(JSON.parse(res.body))
                cbk(true, resultObj)
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};

// Template Script
Boodskap.prototype.executeTemplateScript = function (templateName,data, cbk) {

    const self = this;

    var templateObj = {
        "sessionId" : self.utils.generateUUID(),
        "template": templateName,
        "templateArgs": JSON.stringify(data),
        "scriptArgs": "{}"
    };

    request.post({
        uri: self.API_URL + '/call/execute/template/' + self.API_TOKEN,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(templateObj),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                var resultData = JSON.parse(res.body)
                cbk(true, self.utils.resultFormatter(resultData))
            } else {
                var resultData = JSON.parse(res.body)
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};

// Manage Users
Boodskap.prototype.upsertUser = function (data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/user/upsert/' + self.API_TOKEN,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};
Boodskap.prototype.retrieveUser = function (userid, cbk) {

    const self = this;

    request.get({
        uri: self.API_URL + '/user/get/' + self.API_TOKEN +'/'+userid,
        headers: {'content-type': 'application/json'},
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};
Boodskap.prototype.deleteUser = function (userid, cbk) {

    const self = this;

    request.delete({
        uri: self.API_URL + '/user/delete/' + self.API_TOKEN +'/'+ userid,
        headers: {'content-type': 'application/json'},
    }, function (err, res, body) {
        if(!err) {
            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};
Boodskap.prototype.listUser = function (query, cbk) {

    const self = this;

    var obj = {
        "type": "USER",
        "query" : JSON.stringify(query)
    }

    request.post({
        uri: self.API_URL + '/elastic/search/query/' + self.API_TOKEN ,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(obj),

    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                var resultObj = self.utils.elasticQueryFormatter(JSON.parse(res.body))
                cbk(true, resultObj)
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};

//Domain Property
Boodskap.prototype.getDomainProperty = function (id, cbk) {

    const self = this;

    request.get({
        uri: self.API_URL + "/domain/property/get/" + self.API_TOKEN + "/" + id,
    }, function (err, res, body) {
        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        }else{
            cbk(false,null)
        }

    });
};

