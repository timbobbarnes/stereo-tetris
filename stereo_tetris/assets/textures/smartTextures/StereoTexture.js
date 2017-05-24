var image = {
    contrast: [1.0, 1.0],

    _fractionToColorHex: function (x) {
        var hexString = Math.round(x * 255).toString(16)
        return (hexString.length === 2) ? hexString : '0' + hexString
    },

    _scaleByContrast: function (x, contrast) {
        return 0.5 + contrast * (x - 0.5)
    },

    _colorFromStereo: function (entity) {
        x = Math.max(0.0, Math.min(1.0, entity._fractionStereoRight))
        var red = this._fractionToColorHex(
                      this._scaleByContrast(x, this.contrast[0]))
        var green = this._fractionToColorHex(
                        this._scaleByContrast(1 - x, this.contrast[1]))
        var blue = green
        return '#' + red + green + blue
    },

    render: function (ctx, entity) {
        ctx.fillStyle = this._colorFromStereo(entity)
        ctx.fillRect(-entity._bounds2d.x2, -entity._bounds2d.y2,
                      entity._bounds2d.x ,  entity._bounds2d.y)
	}
}
