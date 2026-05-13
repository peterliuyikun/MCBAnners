// MCBAnners - Minecraft Banner Generator
// Main application logic

class BannerGenerator {
    constructor() {
        this.quantizer = new ColorQuantizer();
        this.currentImage = null;
        this.generatedBanner = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        const generateBtn = document.getElementById('generateBtn');
        const copyCommandBtn = document.getElementById('copyCommandBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        uploadArea.addEventListener('click', () => imageInput.click());
        
        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.loadImage(e.target.files[0]);
            }
        });

        generateBtn.addEventListener('click', () => this.generateBanner());
        
        copyCommandBtn?.addEventListener('click', () => this.copyCommand());
        downloadBtn?.addEventListener('click', () => this.downloadPattern());
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');

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
            
            if (e.dataTransfer.files.length > 0) {
                this.loadImage(e.dataTransfer.files[0]);
            }
        });
    }

    loadImage(file) {
        if (!file.type.startsWith('image/')) {
            this.showToast('Please upload an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.displayOriginalImage(img);
                document.getElementById('previewSection').style.display = 'block';
                document.getElementById('controlsSection').style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    displayOriginalImage(img) {
        const canvas = document.getElementById('originalCanvas');
        const ctx = canvas.getContext('2d');
        
        // Resize to reasonable preview size
        const maxSize = 300;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    generateBanner() {
        if (!this.currentImage) {
            this.showToast('Please upload an image first', 'error');
            return;
        }

        const complexity = document.getElementById('complexitySelect').value;
        const colorMode = document.getElementById('colorModeSelect').value;

        // Process image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resize for analysis (smaller = faster)
        const analysisSize = 64;
        canvas.width = analysisSize;
        canvas.height = analysisSize;
        ctx.drawImage(this.currentImage, 0, 0, analysisSize, analysisSize);

        const imageData = ctx.getImageData(0, 0, analysisSize, analysisSize);
        
        // Detect patterns and colors
        const bannerData = this.quantizer.detectPatterns(imageData.data, analysisSize, analysisSize);
        
        // Adjust based on complexity
        if (complexity === 'simple') {
            bannerData.patterns = bannerData.patterns.slice(0, 2);
        } else if (complexity === 'complex') {
            // Add more patterns for complex mode
            while (bannerData.patterns.length < 6) {
                const decorativePatterns = ['circle', 'rhombus', 'border', 'gradient'];
                const randomPattern = decorativePatterns[Math.floor(Math.random() * decorativePatterns.length)];
                const colors = Object.keys(MINECRAFT_COLORS);
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                bannerData.patterns.push({ pattern: randomPattern, color: randomColor });
            }
        }

        this.generatedBanner = bannerData;
        
        // Render preview
        this.renderBannerPreview(bannerData);
        
        // Display results
        this.displayPatternResults(bannerData);
        this.generateCraftingGuide(bannerData);
        
        document.getElementById('resultSection').style.display = 'block';
        
        this.showToast('Banner generated successfully!', 'success');
    }

    renderBannerPreview(bannerData) {
        const canvas = document.getElementById('bannerCanvas');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const bannerWidth = 120;
        const bannerHeight = 200;
        const x = (canvas.width - bannerWidth) / 2;
        const y = (canvas.height - bannerHeight) / 2;
        
        // Draw banner background (pole)
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x + bannerWidth / 2 - 3, y - 40, 6, 40);
        
        // Draw base color
        const baseColorHex = MINECRAFT_COLORS[bannerData.baseColor]?.hex || '#F9FFFE';
        if (PATTERN_DRAWERS.base) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, bannerWidth, bannerHeight);
            ctx.clip();
            PATTERN_DRAWERS.base(ctx, baseColorHex, bannerWidth, bannerHeight);
            ctx.restore();
        }
        
        // Draw patterns
        bannerData.patterns.forEach(layer => {
            const colorHex = MINECRAFT_COLORS[layer.color]?.hex || '#F9FFFE';
            const drawer = PATTERN_DRAWERS[layer.pattern];
            
            if (drawer) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(x, y, bannerWidth, bannerHeight);
                ctx.clip();
                ctx.translate(x, y);
                drawer(ctx, colorHex, bannerWidth, bannerHeight);
                ctx.restore();
            }
        });
        
        // Draw banner outline
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, bannerWidth, bannerHeight);
    }

    displayPatternResults(bannerData) {
        const container = document.getElementById('patternDisplay');
        container.innerHTML = '';
        
        // Base layer
        const baseLayer = document.createElement('div');
        baseLayer.className = 'pattern-layer base';
        baseLayer.innerHTML = `
            <div class="layer-number">B</div>
            <div class="layer-info">
                <div class="layer-pattern">Base Banner</div>
                <div class="layer-color">${MINECRAFT_COLORS[bannerData.baseColor]?.name || bannerData.baseColor}</div>
            </div>
            <div class="color-swatch" style="background: ${MINECRAFT_COLORS[bannerData.baseColor]?.hex || '#fff'}"></div>
        `;
        container.appendChild(baseLayer);
        
        // Pattern layers
        bannerData.patterns.forEach((layer, index) => {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'pattern-layer';
            const patternInfo = BANNER_PATTERNS[layer.pattern] || { name: layer.pattern, icon: '?' };
            
            layerDiv.innerHTML = `
                <div class="layer-number">${index + 1}</div>
                <div class="layer-info">
                    <div class="layer-pattern">${patternInfo.name}</div>
                    <div class="layer-color">${MINECRAFT_COLORS[layer.color]?.name || layer.color}</div>
                </div>
                <div class="color-swatch" style="background: ${MINECRAFT_COLORS[layer.color]?.hex || '#fff'}"></div>
            `;
            container.appendChild(layerDiv);
        });
    }

    generateCraftingGuide(bannerData) {
        const container = document.getElementById('craftingGuide');
        container.innerHTML = '';
        
        // Step 1: Base banner
        const step1 = document.createElement('div');
        step1.className = 'crafting-step';
        step1.innerHTML = `
            <span class="step-number">1</span>
            <span class="step-title">Create Base Banner</span>
            <div class="step-desc">
                Place 6 ${MINECRAFT_COLORS[bannerData.baseColor]?.name} wool blocks in the top two rows of the crafting table,
                with a stick in the bottom middle slot.
            </div>
            <div class="ingredients">
                <div class="ingredient">
                    <div class="color-swatch ingredient-icon" style="background: ${MINECRAFT_COLORS[bannerData.baseColor]?.hex}"></div>
                    <span>6 Wool</span>
                </div>
                <div class="ingredient">
                    <div class="ingredient-icon" style="background: #8B4513"></div>
                    <span>1 Stick</span>
                </div>
            </div>
        `;
        container.appendChild(step1);
        
        // Steps 2+: Add patterns
        bannerData.patterns.forEach((layer, index) => {
            const step = document.createElement('div');
            step.className = 'crafting-step';
            const patternInfo = BANNER_PATTERNS[layer.pattern] || { name: layer.pattern, recipe: 'See wiki' };
            
            step.innerHTML = `
                <span class="step-number">${index + 2}</span>
                <span class="step-title">Add ${patternInfo.name}</span>
                <div class="step-desc">
                    Combine the banner with ${MINECRAFT_COLORS[layer.color]?.name} dye 
                    using the ${patternInfo.name.toLowerCase()} pattern recipe.
                </div>
                <div class="ingredients">
                    <div class="ingredient">
                        <span>🚩 Banner</span>
                    </div>
                    <div class="ingredient">
                        <div class="color-swatch ingredient-icon" style="background: ${MINECRAFT_COLORS[layer.color]?.hex}"></div>
                        <span>${MINECRAFT_COLORS[layer.color]?.name} Dye</span>
                    </div>
                </div>
            `;
            container.appendChild(step);
        });
    }

    copyCommand() {
        if (!this.generatedBanner) return;
        
        // Generate Minecraft give command
        const baseColor = MINECRAFT_COLORS[this.generatedBanner.baseColor]?.name.toLowerCase().replace(' ', '_') || 'white';
        const patterns = this.generatedBanner.patterns.map(p => {
            const color = MINECRAFT_COLORS[p.color]?.name.toLowerCase().replace(' ', '_') || 'white';
            return `{Pattern:"${p.pattern}",Color:"${color}"}`;
        }).join(',');
        
        const command = `/give @p ${baseColor}_banner{BlockEntityTag:{Patterns:[${patterns}]}} 1`;
        
        navigator.clipboard.writeText(command).then(() => {
            this.showToast('Command copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy command', 'error');
        });
    }

    downloadPattern() {
        if (!this.generatedBanner) return;
        
        const data = {
            baseColor: this.generatedBanner.baseColor,
            patterns: this.generatedBanner.patterns,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'minecraft-banner.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Pattern downloaded!', 'success');
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.background = type === 'error' ? '#B02E26' : type === 'success' ? '#5E7C16' : '#3d5c2d';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BannerGenerator();
});