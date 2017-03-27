var TetrisSquare = IgeEntity.extend({
    classId: 'TetrisSquare',

    init: function (tileMap, startPos) {
        IgeEntity.prototype.init.call(this)

        // TODO: switch to 'data'
        this._fractionStereoRight = 0.5
        this._contrast = [1, 1]
        this.mount(tileMap)
            .widthByTile(1)
            .heightByTile(1)
            .translateToTile(startPos[0], startPos[1], 0)
            .tileWidth(1)
            .tileHeight(1)
            .depth(1)
            .texture(new IgeTexture({
                render: function (ctx, entity) {
                    ctx.fillStyle = (new AnaglyphFunctions())
                        .colorFromStereo(entity._fractionStereoRight,
                                         entity._contrast)
                    ctx.fillRect(-entity._bounds2d.x2, -entity._bounds2d.y2,
                                  entity._bounds2d.x ,  entity._bounds2d.y)
                }
            }))
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
    },

    setContrast: function (x) {
        this._contrast = x
        return this
    }
})

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TetrisSquare }
