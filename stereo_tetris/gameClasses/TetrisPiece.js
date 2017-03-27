var TetrisPiece = IgeObject.extend({
    classId: 'TetrisPiece',

    init: function (tileMap, pieceType) {
        IgeObject.prototype.init.call(this)

        var allPieceLocations = [
            {
                loc: [ [0,0], [1,0], [0,1], [1,1] ], // O
                orig: [0.5, 0.5]
            }, {
                loc: [ [-1,0], [0,0], [0,1], [1,1] ], // Z
                orig: [0, 1]
            }, {
                loc: [ [-1,0], [0,0], [1,0], [2,0] ], // I
                orig: [0.5, 0.5]
            }, {
                loc: [ [-1,1], [0,1], [0,0], [1,0] ], // S
                orig: [0, 1]
            }, {
                loc: [ [-1,1], [0,1], [1,1], [0,0] ], // T
                orig: [0, 1]
            }, {
                loc: [ [-1,1], [0,1], [1,1], [1,0] ], // J
                orig: [0, 1]
            }, {
                loc: [ [-1,1], [0,1], [1,1], [-1,0] ], // L
                orig: [0, 1]
            }] 
        this.pieceLocations = allPieceLocations[pieceType].loc
        var orig = allPieceLocations[pieceType].orig
        this.pieces = []
        for (var i = 0; i < this.pieceLocations.length; ++i) {
            var startPos = [4 + this.pieceLocations[i][0],
                                this.pieceLocations[i][1]]
            this.pieces.push(new TetrisSquare(tileMap, startPos))

            this.pieceLocations[i][0] -= orig[0]
            this.pieceLocations[i][1] -= orig[1]
        }

        this.mount(tileMap)
    },

    setStereo: function (x) {
        for (var i = 0; i < this.pieces.length; ++i) {
            this.pieces[i].setStereo(x)
        }
        return this
    },

    setContrast: function (x) {
        for (var i = 0; i < this.pieces.length; ++i) {
            this.pieces[i].setContrast(x)
        }
        return this
    },

    step: function () {
//      console.log('Moving tetris piece')
        if (this.canMoveDown())
            this.moveDown()
        else
            this.stickToBase()
    },

    rotate: function () {
//      console.log('ROTATE')
        var movements = []
        var noCollision = true
        for (var i = 0; i < this.pieceLocations.length; ++i) {
            var pos = this.pieces[i].myCurPos
            var dPos = [ -this.pieceLocations[i][1] - this.pieceLocations[i][0],
                          this.pieceLocations[i][0] - this.pieceLocations[i][1]]
            movements.push(dPos)
            var testPos = [ pos[0] + dPos[0], pos[1] + dPos[1] ]
            if (this.collidesWithBase(testPos) || this.outOfBounds(testPos)) {
                noCollision = false
                break
            }
        }

        if (noCollision) {
            for (var i = 0; i < this.pieces.length; ++i) {
                this.pieces[i].move(movements[i])
                this.pieceLocations[i][0] += movements[i][0]
                this.pieceLocations[i][1] += movements[i][1]
            }
        }
    },

    collidesWithBase: function (testPos) {
        return this.parent().isTileOccupied(testPos[0], testPos[1])
    },

    outOfBounds: function (testPos) {
        return testPos[1] >= this.parent().gridSize().y
            || testPos[0] < 0
            || testPos[0] >= this.parent().gridSize().x
            || testPos[1] < 0
    },

    canMove: function (dPos) {
//      console.log(this.parent().occupiedTiles())
        var noCollision = true
        for (var i = 0; i < this.pieces.length; ++i) {
            var pos = this.pieces[i].myCurPos
            var testPos = [ pos[0] + dPos[0], pos[1] + dPos[1] ]
            if (this.collidesWithBase(testPos) || this.outOfBounds(testPos)) {
                noCollision = false
                break
            }
        }
        return noCollision
    },
    canMoveDown: function () { return this.canMove([0, 1]) },

    move: function (dPos) {
        for (var i = 0; i < this.pieces.length; ++i)
            this.pieces[i].move(dPos)
    },
    moveDown: function () { this.move([0, 1]) },

    tryMovingLeft: function () {
        if (this.canMove([-1, 0]))
            this.move([-1, 0])
    },
    tryMovingRight: function () {
        if (this.canMove([1, 0]))
            this.move([1, 0])
    },
    tryMovingDown: function () {
        if (this.canMove([0, 1]))
            this.move([0, 1])
    },

    stickToBase: function () {
        for (var i = 0; i < this.pieces.length; ++i)
            this.parent().addToBase(this.pieces[i].occupyTile())
        this.pieces = []
        this.emit('stuck')
    }
})

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TetrisPiece }
