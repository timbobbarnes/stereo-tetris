var image = {
	render: function (ctx, entity) {
		ctx.fillStyle = '#0000ff';
		ctx.fillRect(-entity._bounds2d.x2, -entity._bounds2d.y2, entity._bounds2d.x, entity._bounds2d.y);
	}
};
