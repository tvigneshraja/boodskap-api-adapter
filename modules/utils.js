var _ = require('underscore');

var Utils = function () {

};
module.exports = Utils;


Utils.prototype.s4 = function () {

    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}


Utils.prototype.generateUUID = function () {

    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
};

Utils.prototype.resultFormatter = function (data) {


    var resultObj = {
        total: 0,
        data: {},
        error: '',
    }

    var result = JSON.parse(data.jsonResult);


    return result;

}

Utils.prototype.elasticQueryFormatter = function (data) {

    var resultObj = {
        total: 0,
        data: {},
        aggregations: {}
    }

    if (data.httpCode === 200) {

        var arrayData = JSON.parse(data.result);

        var totalRecords = arrayData.hits.total;
        var records = arrayData.hits.hits;

        var aggregations = arrayData.aggregations ? arrayData.aggregations : {};


        for (var i = 0; i < records.length; i++) {
            records[i]['_source']['_id'] = records[i]['_id'];
        }

        resultObj = {
            "total": totalRecords,
            "data": {
                "recordsTotal": totalRecords,
                "recordsFiltered": totalRecords,
                "data": _.pluck(records, '_source')
            },
            aggregations: aggregations,
            data : _.pluck(records, '_source')
        }

        return resultObj;

    } else {

        return resultObj;
    }

};

Utils.prototype.getCallerIP =  function(request) {
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}
