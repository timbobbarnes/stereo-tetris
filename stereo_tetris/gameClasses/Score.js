var Score = IgeEventingClass.extend({
    classId: 'Score',

    init: function (fontSheet) {
        this.lineToScoreMap = [ 0, 40, 100, 300, 1200 ]
        this.linesPerLevel = 10

        this.font = fontSheet
        this.scoreText = new IgeFontEntity()
                            .id('scoreText')
                            .depth(1)
                            .width(480)
                            .height(26 * 11)
                            .texture(this.font)
                            .textAlignX(1)
                            .textAlignY(1)
                            .colorOverlay('#ffffff')
                            .textLineSpacing(0)
                            .center(300)
                            .middle(0)
                            .mount(ige.$('baseScene'))
        this.reset() // Assumes this.scoreText exists
    },

    reset: function () {
        this.score = 0
        this.lines = 0
        this.level = 0
        return this.updateText()
    },

    addLines: function (nLines) {
        if (!nLines) return this
    
        this.score += this.lineToScoreMap[nLines] * (this.level + 1)

        if ((this.lines % this.linesPerLevel) + nLines >= this.linesPerLevel) {
            this.level++
            this.emit('newLevel', this.level)
        }
        this.lines += nLines
        return this.updateText()
    },

    updateText: function () {
        this.scoreText.text('Score\n' + this.score +
                          '\nLines\n' + this.lines +
                          '\nLevel\n' + this.level)
        return this
    }
})

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Score }
