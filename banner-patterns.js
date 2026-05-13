// Minecraft Banner Patterns Data
const MINECRAFT_COLORS = {
    white: { name: 'White', hex: '#F9FFFE', dye: 'white_dye' },
    orange: { name: 'Orange', hex: '#F9801D', dye: 'orange_dye' },
    magenta: { name: 'Magenta', hex: '#C74EBD', dye: 'magenta_dye' },
    light_blue: { name: 'Light Blue', hex: '#3AB3DA', dye: 'light_blue_dye' },
    yellow: { name: 'Yellow', hex: '#FED83D', dye: 'yellow_dye' },
    lime: { name: 'Lime', hex: '#80C71F', dye: 'lime_dye' },
    pink: { name: 'Pink', hex: '#F38BAA', dye: 'pink_dye' },
    gray: { name: 'Gray', hex: '#474F52', dye: 'gray_dye' },
    light_gray: { name: 'Light Gray', hex: '#9D9D97', dye: 'light_gray_dye' },
    cyan: { name: 'Cyan', hex: '#169C9C', dye: 'cyan_dye' },
    purple: { name: 'Purple', hex: '#8932B8', dye: 'purple_dye' },
    blue: { name: 'Blue', hex: '#3C44AA', dye: 'blue_dye' },
    brown: { name: 'Brown', hex: '#835432', dye: 'brown_dye' },
    green: { name: 'Green', hex: '#5E7C16', dye: 'green_dye' },
    red: { name: 'Red', hex: '#B02E26', dye: 'red_dye' },
    black: { name: 'Black', hex: '#1D1D21', dye: 'black_dye' }
};

const BANNER_PATTERNS = {
    base: { name: 'Base', icon: '⬛', recipe: null },
    stripe_bottom: { name: 'Stripe Bottom', icon: '▔', recipe: '3 dyes bottom row' },
    stripe_top: { name: 'Stripe Top', icon: '▁', recipe: '3 dyes top row' },
    stripe_left: { name: 'Stripe Left', icon: '▕', recipe: '3 dyes left column' },
    stripe_right: { name: 'Stripe Right', icon: '▏', recipe: '3 dyes right column' },
    stripe_center: { name: 'Stripe Center', icon: '┃', recipe: '3 dyes middle column' },
    stripe_middle: { name: 'Stripe Middle', icon: '━', recipe: '3 dyes middle row' },
    stripe_downright: { name: 'Stripe Downright', icon: '╲', recipe: '3 dyes diagonal' },
    stripe_downleft: { name: 'Stripe Downleft', icon: '╱', recipe: '3 dyes diagonal' },
    stripe_small: { name: 'Small Stripes', icon: '▚', recipe: '2 dyes in corners' },
    cross: { name: 'Cross', icon: '✚', recipe: '5 dyes in cross' },
    triangle_bottom: { name: 'Triangle Bottom', icon: '▲', recipe: '3 dyes bottom' },
    triangle_top: { name: 'Triangle Top', icon: '▼', recipe: '3 dyes top' },
    triangles_bottom: { name: 'Triangles Bottom', icon: '⧍', recipe: '2 dyes bottom corners' },
    triangles_top: { name: 'Triangles Top', icon: '⧌', recipe: '2 dyes top corners' },
    diagonal_left: { name: 'Diagonal Left', icon: '◢', recipe: '3 dyes diagonal' },
    diagonal_right: { name: 'Diagonal Right', icon: '◣', recipe: '3 dyes diagonal' },
    diagonal_up_left: { name: 'Diagonal Up Left', icon: '◥', recipe: '3 dyes diagonal' },
    diagonal_up_right: { name: 'Diagonal Up Right', icon: '◤', recipe: '3 dyes diagonal' },
    circle: { name: 'Circle', icon: '●', recipe: '1 dye center' },
    rhombus: { name: 'Rhombus', icon: '◆', recipe: '4 dyes corners' },
    border: { name: 'Border', icon: '▣', recipe: '8 dyes around edge' },
    curly_border: { name: 'Curly Border', icon: '۞', recipe: 'vine + dye' },
    brick: { name: 'Brick', icon: '▦', recipe: 'brick block + dye' },
    gradient: { name: 'Gradient', icon: '▓', recipe: '4 dyes top heavy' },
    gradient_up: { name: 'Gradient Up', icon: '▒', recipe: '4 dyes bottom heavy' },
    creeper: { name: 'Creeper Charge', icon: '☠', recipe: 'creeper head + dye' },
    skull: { name: 'Skull Charge', icon: '💀', recipe: 'wither skull + dye' },
    flower: { name: 'Flower Charge', icon: '❀', recipe: 'oxeye daisy + dye' },
    Mojang: { name: 'Thing', icon: '⬟', recipe: 'enchanted apple + dye' },
    piglin: { name: 'Snout', icon: '🐽', recipe: 'piglin pattern + dye' },
    globe: { name: 'Globe', icon: '○', recipe: 'globe pattern + dye' },
    snout: { name: 'Piglin Snout', icon: 'ᴗ', recipe: 'piglin pattern + dye' },
    flow: { name: 'Flow', icon: '≋', recipe: 'flow pattern + dye' },
    guster: { name: 'Guster', icon: '✦', recipe: 'guster pattern + dye' }
};

// Pattern drawing functions for canvas preview
const PATTERN_DRAWERS = {
    base: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
    },
    stripe_bottom: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, h * 0.75, w, h * 0.25);
    },
    stripe_top: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h * 0.25);
    },
    stripe_left: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w * 0.25, h);
    },
    stripe_right: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(w * 0.75, 0, w * 0.25, h);
    },
    stripe_center: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(w * 0.375, 0, w * 0.25, h);
    },
    stripe_middle: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, h * 0.375, w, h * 0.25);
    },
    stripe_downright: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.25, 0);
        ctx.lineTo(w, h * 0.75);
        ctx.lineTo(w, h);
        ctx.lineTo(w * 0.75, h);
        ctx.lineTo(0, h * 0.25);
        ctx.closePath();
        ctx.fill();
    },
    stripe_downleft: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w * 0.75, 0);
        ctx.lineTo(0, h * 0.75);
        ctx.lineTo(0, h);
        ctx.lineTo(w * 0.25, h);
        ctx.lineTo(w, h * 0.25);
        ctx.closePath();
        ctx.fill();
    },
    stripe_small: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(w * 0.125, 0, w * 0.125, h);
        ctx.fillRect(w * 0.75, 0, w * 0.125, h);
    },
    cross: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(w * 0.375, 0, w * 0.25, h);
        ctx.fillRect(0, h * 0.375, w, h * 0.25);
    },
    triangle_bottom: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(w * 0.5, h * 0.5);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
    },
    triangle_top: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.5, h * 0.5);
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();
    },
    triangles_bottom: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(w * 0.25, h * 0.75);
        ctx.lineTo(w * 0.5, h);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h);
        ctx.lineTo(w * 0.75, h * 0.75);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
    },
    triangles_top: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.25, h * 0.25);
        ctx.lineTo(w * 0.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w * 0.5, 0);
        ctx.lineTo(w * 0.75, h * 0.25);
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();
    },
    diagonal_left: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w, h * 0.5);
        ctx.lineTo(w * 0.5, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
    },
    diagonal_right: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.5, 0);
        ctx.lineTo(w, h * 0.5);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
    },
    diagonal_up_left: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(w, h);
        ctx.lineTo(w, h * 0.5);
        ctx.lineTo(w * 0.5, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
    },
    diagonal_up_right: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, h * 0.5);
        ctx.lineTo(w * 0.5, 0);
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();
    },
    circle: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, w * 0.2, 0, Math.PI * 2);
        ctx.fill();
    },
    rhombus: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.2);
        ctx.lineTo(w * 0.8, h * 0.5);
        ctx.lineTo(w * 0.5, h * 0.8);
        ctx.lineTo(w * 0.2, h * 0.5);
        ctx.closePath();
        ctx.fill();
    },
    border: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h * 0.125);
        ctx.fillRect(0, h * 0.875, w, h * 0.125);
        ctx.fillRect(0, 0, w * 0.125, h);
        ctx.fillRect(w * 0.875, 0, w * 0.125, h);
    },
    curly_border: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h * 0.125);
        ctx.fillRect(0, h * 0.875, w, h * 0.125);
        ctx.fillRect(0, 0, w * 0.125, h);
        ctx.fillRect(w * 0.875, 0, w * 0.125, h);
        ctx.fillRect(w * 0.125, h * 0.125, w * 0.125, h * 0.125);
        ctx.fillRect(w * 0.75, h * 0.125, w * 0.125, h * 0.125);
        ctx.fillRect(w * 0.125, h * 0.75, w * 0.125, h * 0.125);
        ctx.fillRect(w * 0.75, h * 0.75, w * 0.125, h * 0.125);
    },
    brick: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if ((x + y) % 2 === 0) {
                    ctx.fillRect(x * w * 0.25, y * h * 0.25, w * 0.2, h * 0.2);
                }
            }
        }
    },
    gradient: (ctx, color, w, h) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    },
    gradient_up: (ctx, color, w, h) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, color);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    },
    creeper: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(w * 0.35, h * 0.25, w * 0.1, h * 0.15);
        ctx.fillRect(w * 0.55, h * 0.25, w * 0.1, h * 0.15);
        ctx.fillRect(w * 0.4, h * 0.45, w * 0.2, h * 0.1);
        ctx.fillRect(w * 0.35, h * 0.6, w * 0.3, h * 0.2);
    },
    skull: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(w * 0.3, h * 0.25, w * 0.4, h * 0.35);
        ctx.fillRect(w * 0.35, h * 0.6, w * 0.1, h * 0.15);
        ctx.fillRect(w * 0.55, h * 0.6, w * 0.1, h * 0.15);
    },
    flower: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.4, w * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.35, h * 0.5, w * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.65, h * 0.5, w * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.4, h * 0.35, w * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.6, h * 0.35, w * 0.08, 0, Math.PI * 2);
        ctx.fill();
    },
    Mojang: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.2);
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 - 18) * Math.PI / 180;
            const x = w * 0.5 + Math.cos(angle) * w * 0.3;
            const y = h * 0.5 + Math.sin(angle) * h * 0.3;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    },
    piglin: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(w * 0.3, h * 0.35, w * 0.4, h * 0.15);
        ctx.fillRect(w * 0.25, h * 0.5, w * 0.15, h * 0.2);
        ctx.fillRect(w * 0.6, h * 0.5, w * 0.15, h * 0.2);
    },
    globe: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, w * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(w * 0.3, h * 0.45, w * 0.4, h * 0.05);
        ctx.fillRect(w * 0.45, h * 0.3, w * 0.05, h * 0.4);
    },
    snout: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(w * 0.35, h * 0.4, w * 0.3, h * 0.1);
        ctx.fillRect(w * 0.3, h * 0.5, w * 0.1, h * 0.15);
        ctx.fillRect(w * 0.6, h * 0.5, w * 0.1, h * 0.15);
    },
    flow: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(w * 0.1 + i * w * 0.2, h * 0.3 + (i % 2) * h * 0.2, w * 0.15, h * 0.1);
        }
    },
    guster: (ctx, color, w, h) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.25);
        ctx.lineTo(w * 0.6, h * 0.45);
        ctx.lineTo(w * 0.55, h * 0.45);
        ctx.lineTo(w * 0.65, h * 0.75);
        ctx.lineTo(w * 0.5, h * 0.6);
        ctx.lineTo(w * 0.35, h * 0.75);
        ctx.lineTo(w * 0.45, h * 0.45);
        ctx.lineTo(w * 0.4, h * 0.45);
        ctx.closePath();
        ctx.fill();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MINECRAFT_COLORS, BANNER_PATTERNS, PATTERN_DRAWERS };
}