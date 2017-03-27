var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/Score.js',
		'./gameClasses/TetrisController.js',
		'./gameClasses/TetrisPiece.js',
		'./gameClasses/TetrisSquare.js',
        './gameClasses/AnaglyphFunctions.js',
		
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
