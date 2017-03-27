var AnaglyphFunctions = IgeClass.extend({
    classId: 'AnaglyphFunctions',

    fractionToColorHex: function (x) {
        var hexString = Math.round(x * 255).toString(16)
        return (hexString.length === 2) ? hexString : '0' + hexString
    },

    scaleWithContrast: function (colorFraction, contrast) {
        return 0.5 + contrast * (colorFraction - 0.5)
    },

    fractionAndContrastToColorHex: function (frac, contrast) {
        return this.fractionToColorHex(this.scaleWithContrast(frac, contrast))
    },

    colorFromStereo: function (fractionStereoRight, contrast) {
        x = Math.max(0.0, Math.min(1.0, fractionStereoRight))
        var red = this.fractionAndContrastToColorHex(x, contrast[1])
        var green = this.fractionAndContrastToColorHex(1 - x, contrast[0])
        var blue = green
        return '#' + red + green + blue
    }
})

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AnaglyphFunctions }
