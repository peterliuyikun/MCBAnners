// Minecraft Banner Patterns Data with accurate textures

const MINECRAFT_COLORS = {
    white: { name: 'White', hex: '#F9FFFE', dye: 'white_dye', texture: 'white_wool' },
    orange: { name: 'Orange', hex: '#F9801D', dye: 'orange_dye', texture: 'orange_wool' },
    magenta: { name: 'Magenta', hex: '#C74EBD', dye: 'magenta_dye', texture: 'magenta_wool' },
    light_blue: { name: 'Light Blue', hex: '#3AB3DA', dye: 'light_blue_dye', texture: 'light_blue_wool' },
    yellow: { name: 'Yellow', hex: '#FED83D', dye: 'yellow_dye', texture: 'yellow_wool' },
    lime: { name: 'Lime', hex: '#80C71F', dye: 'lime_dye', texture: 'lime_wool' },
    pink: { name: 'Pink', hex: '#F38BAA', dye: 'pink_dye', texture: 'pink_wool' },
    gray: { name: 'Gray', hex: '#474F52', dye: 'gray_dye', texture: 'gray_wool' },
    light_gray: { name: 'Light Gray', hex: '#9D9D97', dye: 'light_gray_dye', texture: 'light_gray_wool' },
    cyan: { name: 'Cyan', hex: '#169C9C', dye: 'cyan_dye', texture: 'cyan_wool' },
    purple: { name: 'Purple', hex: '#8932B8', dye: 'purple_dye', texture: 'purple_wool' },
    blue: { name: 'Blue', hex: '#3C44AA', dye: 'blue_dye', texture: 'blue_wool' },
    brown: { name: 'Brown', hex: '#835432', dye: 'brown_dye', texture: 'brown_wool' },
    green: { name: 'Green', hex: '#5E7C16', dye: 'green_dye', texture: 'green_wool' },
    red: { name: 'Red', hex: '#B02E26', dye: 'red_dye', texture: 'red_wool' },
    black: { name: 'Black', hex: '#1D1D21', dye: 'black_dye', texture: 'black_wool' }
};

const BANNER_PATTERNS = {
    base: { name: 'Base', icon: '⬛', recipe: null, mc_id: 'base' },
    stripe_bottom: { name: 'Stripe Bottom', icon: '▔', recipe: '3 dyes bottom row', mc_id: 'bs' },
    stripe_top: { name: 'Stripe Top', icon: '▁', recipe: '3 dyes top row', mc_id: 'ts' },
    stripe_left: { name: 'Stripe Left', icon: '▕', recipe: '3 dyes left column', mc_id: 'ls' },
    stripe_right: { name: 'Stripe Right', icon: '▏', recipe: '3 dyes right column', mc_id: 'rs' },
    stripe_center: { name: 'Stripe Center', icon: '┃', recipe: '3 dyes middle column', mc_id: 'cs' },
    stripe_middle: { name: 'Stripe Middle', icon: '━', recipe: '3 dyes middle row', mc_id: 'ms' },
    stripe_downright: { name: 'Stripe Downright', icon: '╲', recipe: '3 dyes diagonal', mc_id: 'drs' },
    stripe_downleft: { name: 'Stripe Downleft', icon: '╱', recipe: '3 dyes diagonal', mc_id: 'dls' },
    stripe_small: { name: 'Small Stripes', icon: '▚', recipe: '2 dyes in corners', mc_id: 'ss' },
    cross: { name: 'Cross', icon: '✚', recipe: '5 dyes in cross', mc_id: 'cr' },
    triangle_bottom: { name: 'Triangle Bottom', icon: '▲', recipe: '3 dyes bottom', mc_id: 'bt' },
    triangle_top: { name: 'Triangle Top', icon: '▼', recipe: '3 dyes top', mc_id: 'tt' },
    triangles_bottom: { name: 'Triangles Bottom', icon: '⧍', recipe: '2 dyes bottom corners', mc_id: 'bts' },
    triangles_top: { name: 'Triangles Top', icon: '⧌', recipe: '2 dyes top corners', mc_id: 'tts' },
    diagonal_left: { name: 'Diagonal Left', icon: '◢', recipe: '3 dyes diagonal', mc_id: 'ld' },
    diagonal_right: { name: 'Diagonal Right', icon: '◣', recipe: '3 dyes diagonal', mc_id: 'rd' },
    diagonal_up_left: { name: 'Diagonal Up Left', icon: '◥', recipe: '3 dyes diagonal', mc_id: 'lud' },
    diagonal_up_right: { name: 'Diagonal Up Right', icon: '◤', recipe: '3 dyes diagonal', mc_id: 'rud' },
    circle: { name: 'Circle', icon: '●', recipe: '1 dye center', mc_id: 'mc' },
    rhombus: { name: 'Rhombus', icon: '◆', recipe: '4 dyes corners', mc_id: 'mr' },
    border: { name: 'Border', icon: '▣', recipe: '8 dyes around edge', mc_id: 'bo' },
    curly_border: { name: 'Curly Border', icon: '۞', recipe: 'vine + dye', mc_id: 'cbo' },
    brick: { name: 'Brick', icon: '▦', recipe: 'brick block + dye', mc_id: 'bri' },
    gradient: { name: 'Gradient', icon: '▓', recipe: '4 dyes top heavy', mc_id: 'gra' },
    gradient_up: { name: 'Gradient Up', icon: '▒', recipe: '4 dyes bottom heavy', mc_id: 'gru' },
    creeper: { name: 'Creeper Charge', icon: '☠', recipe: 'creeper head + dye', mc_id: 'cre' },
    skull: { name: 'Skull Charge', icon: '💀', recipe: 'wither skull + dye', mc_id: 'sku' },
    flower: { name: 'Flower Charge', icon: '❀', recipe: 'oxeye daisy + dye', mc_id: 'flo' },
    Mojang: { name: 'Thing', icon: '⬟', recipe: 'enchanted apple + dye', mc_id: 'moj' },
    piglin: { name: 'Snout', icon: '🐽', recipe: 'piglin pattern + dye', mc_id: 'pig' },
    globe: { name: 'Globe', icon: '○', recipe: 'globe pattern + dye', mc_id: 'glb' },
    snout: { name: 'Piglin Snout', icon: 'ᴗ', recipe: 'piglin pattern + dye', mc_id: 'snu' },
    flow: { name: 'Flow', icon: '≋', recipe: 'flow pattern + dye', mc_id: 'flw' },
    guster: { name: 'Guster', icon: '✦', recipe: 'guster pattern + dye', mc_id: 'gst' }
};

function createWoolTexture(ctx, width, height, baseColor) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    const scale = Math.max(1, Math.floor(width / 16));
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const patternX = Math.floor(x / scale) % 4;
            const patternY = Math.floor(y / scale) % 4;
            const noise = (Math.random() - 0.5) * 15;
            const patternNoise = ((patternX + patternY) % 2) * 8 - 4;
            
            data[idx] = Math.max(0, Math.min(255, r + noise + patternNoise));
            data[idx + 1] = Math.max(0, Math.min(255, g + noise + patternNoise));
            data[idx + 2] = Math.max(0, Math.min(255, b + noise + patternNoise));
            data[idx + 3] = 255;
        }
    }
    return imageData;
}

function drawTexturedRect(ctx, color, x, y, w, h) {
    const imageData = createWoolTexture(ctx, w, h, color);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    tempCanvas.getContext('2d').putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, x, y);
}

function drawClippedPattern(ctx, w, h, color, drawFn) {
    ctx.save();
    drawFn(ctx, w, h);
    ctx.clip();
    const imageData = createWoolTexture(ctx, w, h, color);
    ctx.putImageData(imageData, 0, 0);
    ctx.restore();
}

const PATTERN_DRAWERS = {
    base: (ctx, color, w, h) => {
        const imageData = createWoolTexture(ctx, w, h, color);
        ctx.putImageData(imageData, 0, 0);
    },
    
    stripe_bottom: (ctx, color, w, h) => drawTexturedRect(ctx, color, 0, h * 0.75, w, h * 0.25),
    stripe_top: (ctx, color, w, h) => drawTexturedRect(ctx, color, 0, 0, w, h * 0.25),
    stripe_left: (ctx, color, w, h) => drawTexturedRect(ctx, color, 0, 0, w * 0.25, h),
    stripe_right: (ctx, color, w, h) => drawTexturedRect(ctx, color, w * 0.75, 0, w * 0.25, h),
    stripe_center: (ctx, color, w, h) => drawTexturedRect(ctx, color, w * 0.375, 0, w * 0.25, h),
    stripe_middle: (ctx, color, w, h) => drawTexturedRect(ctx, color, 0, h * 0.375, w, h * 0.25),
    
    stripe_downright: (ctx, color, w, h) => drawClippedPattern(ctx, w, h, color, (c, w2, h2) => {
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(w2 * 0.25, 0);
        c.lineTo(w2, h2 * 0.75);
        c.lineTo(w2, h2);
        c.lineTo(w2 * 0.75, h2);
        c.lineTo(0, h2 * 0.25);
        c.closePath();
    }),
    
    stripe_downleft: (ctx, color, w, h) => drawClippedPattern(ctx, w, h, color, (c, w2, h2) => {
        c.beginPath();
        c.moveTo(w2, 0);
        c.lineTo(w2 * 0.75, 0);
        c.lineTo(0, h2 * 0.75);
        c.lineTo(0, h2);
        c.lineTo(w2 * 0.25, h2);
        c.lineTo(w2, h2 * 0.25);
        c.closePath();
    }),
    
    stripe_small: (ctx, color, w, h) => {
        drawTextured