// MCBAnners - Minecraft Banner Generator

class BannerGenerator {
    constructor() {
        this.quantizer = new ColorQuantizer();
        this.currentImage = null;
        this.pixelArtCanvas = null;
        this.generatedBanner = null;
    }

    init() {
        console.log('Initializing...');
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        
        if (!uploadArea || !imageInput) {
            console.error('Required elements not found');
            return;
        }
        
        // Click to upload
        uploadArea.addEventListener('click', () => {
            console.log('Click triggered');
            imageInput.click();
        });
        
        // File selected
        imageInput.addEventListener('change', (e) => {
            console.log('File selected:', e.target.files);
            if (e.target.files?.length > 0) {
                this.loadImage(e.target.files[0]);
            }
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            console.log('File dropped:', e.dataTransfer.files);
            if (e.dataTransfer.files?.length > 0) {
                this.loadImage(e.dataTransfer.files[0]);
            }
        });
        
        // Generate button
        document.getElementById('generateBtn')?.addEventListener('click', () => {
            this.generateBanner();
        });
        
        console.log('Initialized successfully');
    }

    loadImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.createPixelArt(img);
                document.getElementById('previewSection').style.display = 'block';
                document.getElementById('controlsSection').style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    createPixelArt(img) {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, 20, 40);
        this.pixelArtCanvas = canvas;
        
        // Show preview
        const origCanvas = document.getElementById('originalCanvas');
        const origCtx = origCanvas.getContext('2d');
        origCanvas.width = 200;
        origCanvas.height = 400;
        origCtx.imageSmoothingEnabled = false;
        origCtx.drawImage(canvas, 0, 0, 200, 400);
    }

    generateBanner() {
        if (!this.pixelArtCanvas) return;
        
        const ctx = this.pixelArtCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, 20, 40);
        
        // Get dominant colors
        const colors = this.getDominantColors(imageData.data, 3);
        const baseColor = colors[0] || 'white';
        
        // Simple pattern detection
        const patterns = this.detectPatterns(imageData.data, 20, 40, colors);
        
        this.generatedBanner = { baseColor, patterns };
        
        this.renderBanner({ baseColor, patterns });
        this.showResults({ baseColor, patterns });
        
        document.getElementById('resultSection').style.display = 'block';
    }

    getDominantColors(data, count) {
        const colorCounts = new Map();
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
            if (a < 128) continue;
            const closest = this.quantizer.findClosestColor(r, g, b);
            colorCounts.set(closest.name, (colorCounts.get(closest.name) || 0) + 1);
        }
        
        return Array.from(colorCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(([name]) => name);
    }

    detectPatterns(data, width, height, colors) {
        const patterns = [];
        const secondary = colors[1] || colors[0];
        const tertiary = colors[2] || secondary;
        
        // Check regions
        const top = this.getRegionColor(data, width, height, 0, 0, width, height * 0.3);
        const mid = this.getRegionColor(data, width, height, 0, height * 0.35, width, height * 0.3);
        const bot = this.getRegionColor(data, width, height, 0, height * 0.7, width, height * 0.3);
        
        if (top !== mid) patterns.push({ pattern: 'stripe_top', color: secondary });
        if (mid !== bot && top !== bot) patterns.push({ pattern: 'stripe_bottom', color: tertiary });
        if (top === bot && top !== mid) {
            patterns.length = 0;
            patterns.push({ pattern: 'stripe_middle', color: secondary });
        }
        
        // Add more patterns if simple
        if (patterns.length < 2) {
            patterns.push({ pattern: 'border', color: tertiary });
        }
        
        return patterns.slice(0, 6);
    }

    getRegionColor(data, width, height, x, y, w, h) {
        const counts = new Map();
        for (let py = Math.floor(y); py < Math.floor(y + h); py++) {
            for (let px = Math.floor(x); px < Math.floor(x + w); px++) {
                if (px >= width || py >= height) continue;
                const i = (py * width + px) * 4;
                const closest = this.quantizer.findClosestColor(data[i], data[i+1], data[i+2]);
                counts.set(closest.name, (counts.get(closest.name) || 0) + 1);
            }
        }
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    }

    renderBanner(banner) {
        const canvas = document.getElementById('bannerCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const bw = 120, bh = 200;
        const x = (canvas.width - bw) / 2;
        const y = (canvas.height - bh) / 2;
        
        // Pole
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x + bw/2 - 3, y - 40, 6, 40);
        
        // Base
        const baseHex = MINECRAFT_COLORS[banner.baseColor]?.hex || '#fff';
        ctx.fillStyle = baseHex;
        ctx.fillRect(x, y, bw, bh);
        
        // Patterns
        banner.patterns.forEach(p => {
            const hex = MINECRAFT_COLORS[p.color]?.hex || '#fff';
            ctx.fillStyle = hex;
            this.drawPattern(ctx, p.pattern, x, y, bw, bh);
        });
        
        // Outline
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, bw, bh);
    }

    drawPattern(ctx, pattern, x, y, w, h) {
        switch(pattern) {
            case 'stripe_top':
                ctx.fillRect(x, y, w, h * 0.25);
                break;
            case 'stripe_bottom':
                ctx.fillRect(x, y + h * 0.75, w, h * 0.25);
                break;
            case 'stripe_middle':
                ctx.fillRect(x, y + h * 0.375, w, h * 0.25);
                break;
            case 'stripe_center':
                ctx.fillRect(x + w * 0.375, y, w * 0.25, h);
                break;
            case 'border':
                ctx.fillRect(x, y, w, h * 0.125);
                ctx.fillRect(x,                ctx.fillRect(x, y + h * 0.875, w, h * 0.125);
                ctx.fillRect(x, y, w * 0.125, h);
                ctx.fillRect(x + w * 0.875, y, w * 0.125, h);
                break;
            case 'cross':
                ctx.fillRect(x + w * 0.375, y, w * 0.25, h);
                ctx.fillRect(x, y + h * 0.375, w, h * 0.25);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(x + w/2, y + h/2, w * 0.2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    }

    showResults(banner) {
        const container = document.getElementById('patternDisplay');
        container.innerHTML = `
            <div class="pattern-layer base">
                <div class="layer-number">B</div>
                <div class="layer-info">
                    <div class="layer-pattern">Base Banner</div>
                    <div class="layer-color">${MINECRAFT_COLORS[banner.baseColor]?.name || banner.baseColor}</div>
                </div>
                <div class="color-swatch" style="background: ${MINECRAFT_COLORS[banner.baseColor]?.hex || '#fff'}"></div>
            </div>
            ${banner.patterns.map((p, i) => `
                <div class="pattern-layer">
                    <div class="layer-number">${i + 1}</div>
                    <div class="layer-info">
                        <div class="layer-pattern">${BANNER_PATTERNS[p.pattern]?.name || p.pattern}</div>
                        <div class="layer-color">${MINECRAFT_COLORS[p.color]?.name || p.color}</div>
                    </div>
                    <div class="color-swatch" style="background: ${MINECRAFT_COLORS[p.color]?.hex || '#fff'}"></div>
                </div>
            `).join('')}
        `;
        
        // Crafting guide
        const guide = document.getElementById('craftingGuide');
        guide.innerHTML = `
            <div class="crafting-step">
                <span class="step-number">1</span>
                <span class="step-title">Create Base Banner</span>
                <div class="step-desc">6 ${MINECRAFT_COLORS[banner.baseColor]?.name} wool + 1 stick</div>
            </div>
            ${banner.patterns.map((p, i) => `
                <div class="crafting-step">
                    <span class="step-number">${i + 2}</span>
                    <span class="step-title">Add ${BANNER_PATTERNS[p.pattern]?.name || p.pattern}</span>
                    <div class="step-desc">Use ${MINECRAFT_COLORS[p.color]?.name} dye</div>
                </div>
            `).join('')}
        `;
    }
}

// Start
document.addEventListener('DOMContentLoaded', () => {
    const app = new BannerGenerator();
    app.init();
});
