var TetrisController = IgeTileMap2d.extend({
    classId: 'TetrisController',

    init: function (contrast) {
        IgeTileMap2d.prototype.init.call(this)
        var px = 30
        this.contrast = contrast
        this.depth(0)
            .tileWidth(px)
            .tileHeight(px)
            .gridSize(10, 20)
            .drawGrid(false)
            .drawMouse(false)
            .translateTo(-this.gridSize().x / 2 * px,
                         -this.gridSize().y / 2 * px, 0)
            .setBackgroundColor()
        this.base = []
        this.makeNewPiece()

/*      ige.input.mapAction('moveLeft', ige.input.key.left)
        ige.input.mapAction('moveRight', ige.input.key.right)
        ige.input.mapAction('moveDown', ige.input.key.down)
*/      this.keys = ige.input.on('keyUp', function (event, keyCode) {
            if (keyCode === ige.input.key.up)
                this.piece.rotate()
            else if (keyCode === ige.input.key.left)
                this.piece.tryMovingLeft()
            else if (keyCode === ige.input.key.right)
                this.piece.tryMovingRight()
            else if (keyCode === ige.input.key.down)
                this.piece.tryMovingDown()
        }, this)

        this.nesTPF = 1000 / 60.0988
        this.nesFrameDelay = 48

        this.myTimePerFrame = this.nesTPF * this.nesFrameDelay
        this.myClock = 0
    },

    update: function (ctx, tickDelta) {
        this.myClock += tickDelta
        if (this.myClock >= this.myTimePerFrame) {
            this.myClock %= this.myTimePerFrame
            this.piece.step()
        }
        IgeTileMap2d.prototype.update.call(this, ctx, tickDelta)
    },

    destroy: function () {
        ige.input.off('keyUp', this.keys)
        IgeTileMap2d.prototype.destroy.call(this)
    },

    setBackgroundColor: function () {
        var fn = new AnaglyphFunctions()
        var red  = fn.fractionAndContrastToColorHex(0, this.contrast[1])
        var cyan = fn.fractionAndContrastToColorHex(0, this.contrast[0])
        var rgbString = '#' + red + cyan + cyan

        return this.texture(new IgeTexture({
            render: function (ctx, entity) {
                ctx.fillStyle = rgbString
                ctx.fillRect(0, 0, entity._bounds2d.x, entity._bounds2d.y)

                ctx.strokeStyle = '#ffffff'

                ctx.beginPath()

                ctx.moveTo(0,0)

                ctx.lineTo(                 0, entity._bounds2d.y)
                ctx.lineTo(entity._bounds2d.x, entity._bounds2d.y)
                ctx.lineTo(entity._bounds2d.x,                  0)
                ctx.lineTo(                 0,                  0)

                ctx.stroke()
            }
        }))
    },

    increaseSpeed: function () {
        if (this.nesFrameDelay > 10)
            this.nesFrameDelay -= 5
        else if (this.nesFrameDelay === 8)
            this.nesFrameDelay -= 2
        else if (this.nesFrameDelay > 1)
            this.nesFrameDelay -= 1
        this.myTimePerFrame = this.nesTPF * this.nesFrameDelay
        return this
    },

    addToBase: function (tetrisSquare) {
        this.base.push(tetrisSquare)
        return this
    },

    makeNewPiece: function () {
        function getRandomInt (max) {
            return Math.floor(Math.random() * max)
        }

        this.piece = new TetrisPiece(this, getRandomInt(7)).id('testBox')
        this.piece.setStereo(1)
                  .setContrast(this.contrast)
        this.piece.on('stuck', function () {
            this.clearAnyFormedLines()
                .recolorBase()
                .replacePiece()
        }, this, true)
        return this
    },

    isRowCompletelyOccupied: function (row) {
        var fullLine = true
        for (var j = 0; j < this.gridSize().x; ++j) {
            if ( ! this.isTileOccupied(j, row) ) {
                fullLine = false
                break
            }
        }
        return fullLine
    },

    clearAnyFormedLines: function () {
        var linesToClear = []
        // It's important to clear lines in ascending order!
        for (var i = 0; i < this.gridSize().y; ++i) {
            if (this.isRowCompletelyOccupied(i)) linesToClear.push(i)
        }

        for (var i = 0; i < linesToClear.length; ++i)
            this.clearLine(linesToClear[i])

        this.emit('linesCleared', linesToClear.length)

        return this
    },

    clearLine: function (row) {
        var newBase = []
        while (this.base.length > 0) {
            var curSquare = this.base.pop()
            if (curSquare.myCurPos[1] === row)
                curSquare.unOccupyTile().unMount().destroy()
            else {
                if (curSquare.myCurPos[1] < row)
                    curSquare.unOccupyTile().move([0, 1])
                newBase.push(curSquare)
            }
        }
        this.base = newBase
        for (var i = 0; i < this.base.length; ++i)
            this.base[i].occupyTile()
        return this
    },

    recolorBase: function () {
        for (var i = 0; i < this.base.length; ++i) {
            var pos = this.base[i].myCurPos
            var yPos = pos[1]
            var stereoVal = 0
            if (yPos >= 2) {
                var nAbove = 0
                for (var y = yPos - 1; y > 0; --y) {
                    if (this.isTileOccupied(pos[0], y, 1, 1)) ++nAbove
                    if (nAbove == 2) {
                        stereoVal = 0.5
                        break
                    }
                }
            }
            this.base[i].setStereo(stereoVal)
        }
        return this
    },

    replacePiece: function () {
        this.piece.destroy()
        this.makeNewPiece()
        if ( ! this.piece.canMove([0,0]) )
            this.emit('gameOver')
        return this
    }
})

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TetrisController }
