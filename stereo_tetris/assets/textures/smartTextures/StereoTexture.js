var image = {
    _fractionToColorHex: function (x) {
        var hexString = Math.round(x * 255).toString(16)
        return (hexString.length === 2) ? hexString : '0' + hexString
    },

    _colorFromStereo: function (entity) {
        x = Math.max(0.0, Math.min(1.0, entity._fractionStereoRight))
        var red = this._fractionToColorHex(x)
        var green = this._fractionToColorHex(1 - x)
        var blue = this._fractionToColorHex(1 - x)
        return '#' + red + green + blue
    },

    render: function (ctx, entity) {
        ctx.fillStyle = this._colorFromStereo(entity)
        ctx.fillRect(-entity._bounds2d.x2, -entity._bounds2d.y2,
                      entity._bounds2d.x ,  entity._bounds2d.y)
	}
}
