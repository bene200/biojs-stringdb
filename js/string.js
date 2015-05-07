var request = require('request');
var Promise = require('promise');

var StringDB = function(db, access, format, request){
    this.db = db || "string-db.org";
    this.access = access || "api";
    this.format = format || "psi-mi-tab";
    this.request = request || "interactions";
};

StringDB.prototype.getNetwork = function(gene){
    var url = 'http://' + this.db + '/' + 
            this.access + '/' +
            this.format + '/' +
            this.request + '?' + 
            'identifier=' + gene;

    return new Promise(function(resolve){
        request(url, function(err, res, body){
            resolve(body);
        });
    });
};

StringDB.prototype.networkToJSON = function(tsv){
    var lines = tsv.split("\n");
    var parts;
    var edges = [];
    var contains = [];
    var nodes = [];
    for(var i=0; i<lines.length; i++){
        line = lines[i].split("\t");
        edges.push({ source: line[2], target: line[3] });
        if(contains.indexOf(line[2]) === -1){
            nodes.push({ id: line[2], name: line[2] });
            contains.push(line[2]);
        }
        if(contains.indexOf(line[3]) === -1){
            nodes.push({ id: line[3], name: line[3] });
            contains.push(line[3]);
        }
    }
    return { nodes: nodes, edges: edges };
};


var str = new StringDB();
str.getNetwork("ADE43091.1").
then(function(re){
    console.log(str.networkToJSON(re));    
});
