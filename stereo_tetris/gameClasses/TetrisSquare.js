var TetrisSquare = IgeEntity.extend({
    classId: 'TetrisSquare',

    init: function (tileMap, startPos, texture) {
        IgeEntity.prototype.init.call(this)

        this._fractionStereoRight = 0.5
        this.mount(tileMap)
            .widthByTile(1)
            .heightByTile(1)
            .translateToTile(startPos[0], startPos[1], 0)
            .tileWidth(1)
            .tileHeight(1)
            .depth(1)
            .texture(texture)
        this.myCurPos = startPos
    },

    move: function (dPos) {
        this.myCurPos[0] += dPos[0]
        this.myCurPos[1] += dPos[1]
        this.translateToTile(this.myCurPos[0], this.myCurPos[1], 0)
        return this
    },

    setStereo: function (x) {
        this._fractionStereoRight = Math.max(0, Math.min(1, x))
        return this
    }
})

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TetrisSquare }
