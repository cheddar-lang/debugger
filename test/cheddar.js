var cheddar = require('cheddar-lang');
var D = require('../index.js');
var Debugger = D.default;
var Info = D.Info;

var fs = require('fs');

// Initate cheddar execution context
var code = fs.readFileSync(__dirname + '/test.cheddar', 'utf8');
var context;

var exec = cheddar(code, {
    hook: function(self) {
        context = self; // Set execution context
    },
    PRINT: function(text) {
    }
});

var debug = new Debugger({
    Code: code,
    Title: "Cheddar Debugger",

    dispatchAction: function() {
        if (!context.Code[context._csi]) return false;

        var exclude = [ "function", "boolean", "dictionary", "array", "number", "regex", "symbol", "string", "io", "buffer", "encoding", "rational", "math", "cheddar" ];
        var localVariables = [];

        context.Scope.Scope.forEach(function(value, key) {
            var val = value.Value;
            if (exclude.indexOf(key.toLowerCase()) === -1) {
                localVariables.push([
                    key,
                    val.Cast && val.Cast.has('String') ? val.Cast.get('String')(val).value : '< ' + ( val.Name || val.constructor.Name ) + ' >'
                ])
            }
        });

        var data = new Info({
            Index: context.Code[context._csi].Index,
                
            Variables: localVariables
        });

        context.step();
        context.exec();

        return data;
    }
});
