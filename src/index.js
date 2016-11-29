import blessed from 'blessed';

export class Info {
    constructor(args) {
        // Index: int
        // Variables: [ [name String], [value String] ]
        Object.assign(this, args);
    }
}

export default class Launch {
    constructor({
        Code,
        dispatchAction,
        Title
    } = {}) {
        this.Code = Code;
        this.dispatchAction = dispatchAction;

        this.screen = blessed.screen({
            smartCSR: true,
            dockBorders: true
        });

        this.screen.title = Title;

        this.prepare();

        this.registerActions();
    }

    prepare() {
        this.leftBox = blessed.list({
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

        this.posTable = blessed.listtable({
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

        this.varTable = blessed.table({
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

        this.runActions = blessed.form({
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

        this.doStep = blessed.button({
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

        this.doStop = blessed.button({
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

    didChange() {
        this.update();
        this.screen.render();
    }

    getLine() {
        return this.Code.slice(0, this.data.Index).split("\n").length;
    }

    getPositionData() {
        return [
            [ 'Line', 'Column', 'Index' ],
            [
                String( this.getLine() ),
                String( this.data.Index - this.Code.split("\n").slice(0, this.getLine() - 1).join("\n").length ),
                String( this.data.Index )
            ]
        ];
    }

    update() {
        this.data = this.dispatchAction();

        // Update selected line
        this.posTable.setData( this.getPositionData() );
        this.varTable.setData( [ [ 'Name' , 'Value' ] ].concat(this.data.Variables) );
        this.leftBox.select(this.getLine() - 1);
    }

    stop() {
        this.screen.destroy();
    }

    registerActions() {
        this.doStop.press = () => this.stop();
        this.screen.key(['C-c', 'q'], () => this.stop());
    }
}
