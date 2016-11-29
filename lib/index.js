'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Info = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Info = exports.Info = function Info(args) {
    _classCallCheck(this, Info);

    // Index: int
    // Variables: [ [name String], [value String] ]
    Object.assign(this, args);
};

var Launch = function () {
    function Launch() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            Code = _ref.Code,
            dispatchAction = _ref.dispatchAction,
            Title = _ref.Title;

        _classCallCheck(this, Launch);

        this.Code = Code;
        this.dispatchAction = dispatchAction;

        this.screen = _blessed2.default.screen({
            smartCSR: true,
            dockBorders: true
        });

        this.screen.title = Title;

        this.prepare();

        this.registerActions();
    }

    _createClass(Launch, [{
        key: 'prepare',
        value: function prepare() {
            this.leftBox = _blessed2.default.list({
                parent: this.screen,
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',

                clickable: true,
                scrollable: true,

                items: this.Code.split("\n"),

                border: {
                    type: 'line',
                    left: false,
                    top: false,
                    right: true,
                    bottom: false
                },

                style: {
                    selected: {
                        bg: 'yellow',
                        fg: 'black'
                    }
                }
            });

            this.posTable = _blessed2.default.listtable({
                parent: this.screen,
                top: 0,
                left: '50%-1',
                width: '50%+1',
                height: 5,

                pad: 1,
                noCellBorders: true,

                border: {
                    type: 'line',
                    left: true,
                    top: false,
                    right: false,
                    bottom: true
                },

                style: {
                    header: {
                        bold: true
                    }
                }
            });

            this.varTable = _blessed2.default.table({
                parent: this.screen,
                top: this.posTable.position.height - 1,
                left: '50%-1',
                width: '50%+1',
                height: 20,

                border: {
                    type: 'line',
                    left: true,
                    top: true,
                    right: false,
                    bottom: true
                },

                style: {
                    header: {
                        bold: true
                    }
                }
            });

            this.runActions = _blessed2.default.form({
                parent: this.screen,
                bottom: 0,
                left: '50%-1',
                width: '50%+1',
                height: 5,

                clickable: true,
                keys: true,

                content: 'Execution',

                border: {
                    type: 'line',
                    left: true,
                    top: true,
                    right: false,
                    bottom: false
                },

                style: {
                    bold: true
                }
            });

            this.doStep = _blessed2.default.button({
                parent: this.runActions,
                mouse: true,
                keys: true,
                shrink: true,

                padding: {
                    left: 1,
                    right: 1
                },

                left: 1,
                bottom: 0,

                name: 'step',
                content: 'Step',

                style: {
                    bg: 'red',
                    fg: 'white',
                    bold: true,

                    focus: {
                        bg: 'green'
                    },
                    hover: {
                        bg: 'green'
                    }
                }
            });

            this.doStop = _blessed2.default.button({
                parent: this.runActions,
                mouse: true,
                keys: true,
                shrink: true,

                padding: {
                    left: 1,
                    right: 1
                },

                left: 10,
                bottom: 0,

                name: 'stop',
                content: 'Stop',

                style: {
                    bg: 'red',
                    fg: 'white',
                    bold: true,

                    focus: {
                        bg: 'green'
                    },
                    hover: {
                        bg: 'green'
                    }
                }
            });

            this.runActions.focusNext();

            this.didChange();
        }
    }, {
        key: 'didChange',
        value: function didChange() {
            this.update();
            this.screen.render();
        }
    }, {
        key: 'getLine',
        value: function getLine() {
            return this.Code.slice(0, this.data.Index).split("\n").length;
        }
    }, {
        key: 'getPositionData',
        value: function getPositionData() {
            return [['Line', 'Column', 'Index'], [String(this.getLine()), String(this.data.Index - this.Code.split("\n").slice(0, this.getLine() - 1).join("\n").length), String(this.data.Index)]];
        }
    }, {
        key: 'update',
        value: function update() {
            this.data = this.dispatchAction();

            // Update selected line
            this.posTable.setData(this.getPositionData());
            this.varTable.setData([['Name', 'Value']].concat(this.data.Variables));
            this.leftBox.select(this.getLine() - 1);
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.screen.destroy();
        }
    }, {
        key: 'registerActions',
        value: function registerActions() {
            var _this = this;

            this.doStop.press = function () {
                return _this.stop();
            };
            this.screen.key(['C-c', 'q'], function () {
                return _this.stop();
            });
        }
    }]);

    return Launch;
}();

exports.default = Launch;