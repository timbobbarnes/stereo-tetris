var image = {
    render: function (ctx, entity) {
        ctx.strokeStyle = '#ffffff'

        ctx.beginPath()

        ctx.moveTo(-entity._bounds2d.x2, -entity._bounds2d.y2)

        ctx.lineTo(-entity._bounds2d.x2,  entity._bounds2d.y2)
        ctx.lineTo( entity._bounds2d.x2,  entity._bounds2d.y2)
        ctx.lineTo( entity._bounds2d.x2, -entity._bounds2d.y2)
        ctx.lineTo(-entity._bounds2d.x2, -entity._bounds2d.y2)

        ctx.stroke()
    }
}
