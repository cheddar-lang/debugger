var D = require('../index.js');
var Debugger = D.default;
var Info = D.Info;

var fs = require('fs');

var debug = new Debugger({
    Code: fs.readFileSync(__dirname + '/test.cheddar', 'utf8'),
    Title: "Cheddar Debugger",

    dispatchAction: function() {
        return new Info({
            Index: 147,
                
            Variables: [
                ["stacks", "[[], []]"],
                ["index", "0"]
            ]
        });
    }
})

debug
