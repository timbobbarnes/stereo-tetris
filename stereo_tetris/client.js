var Client = IgeClass.extend({
    classId: 'Client',

    init: function () {
        var self = this
        self.gameTextures = {
            score: new IgeFontSheet('./assets/textures/fonts/adobe_arabic_26pt.png'),
        }

        ige.on('texturesLoaded', function () {
            ige.createFrontBuffer(true)

            ige.start(function (success) {
			    if (success)
                    self.calibrate()
	        })
        })
    },

    calibrate: function () {
        ige.addGraph('IgeBaseScene')
        this.scoreText = new IgeFontEntity()
                            .id('scoreText')
                            .depth(1)
                            .width(480)
                            .height(26 * 11)
                            .texture(this.gameTextures.score)
                            .textAlignX(1)
                            .textAlignY(1)
                            .colorOverlay('#ffffff')
                            .textLineSpacing(0)
                            .center(0)
                            .middle(0)
                            .mount(ige.$('baseScene'))
                            .text('READY???')
        this.contrast = [1, 1]
        this.waitEv = ige.input.on('keyUp', function (event, keyCode) {
            if (keyCode === ige.input.key.enter) {
                this.scoreText.destroy()
                delete this.scoreText
                ige.input.off('keyUp', this.waitEv)
                delete this.waitEv
                this.newTetrisGame()
            }
        }, this)
    },

    newTetrisGame: function () {
        this.score = new Score(this.gameTextures.score)

        ige.on('resetGame', function () {
            this.score.reset()
            if (this.tetris) {
                this.tetris.destroy()
                this.score.off('newLevel', this.newLevelEv)
            }
            this.tetris = new TetrisController(this.contrast)
                .id('tetrisGame')
                .mount(ige.$('baseScene'))

            this.tetris.on('linesCleared', this.score.addLines, this.score)

            this.newLevelEv = this.score.on('newLevel', function (level) {
                this.increaseSpeed()
            }, this.tetris)

            this.tetris.on('gameOver', function () {
                ige.emit('resetGame')
            }, ige)
        }, this)

        ige.input.on('keyUp', function (event, keyCode) {
            if (keyCode === ige.input.key.escape)
                ige.emit('resetGame')
        }, this)

        ige.emit('resetGame')
    }
})

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
