// MCBAnners - Minecraft Banner Generator
// Converts images to pixel art, then to Minecraft banner patterns

class BannerGenerator {
    constructor() {
        this.quantizer = new ColorQuantizer();
        this.currentImage = null;
        this.pixelArtCanvas = null;
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

        // Click on upload area - trigger file input
        uploadArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            imageInput.click();
        });
        
        // File input change
        imageInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                this.loadImage(e.target.files[0]);
            }
        });

        generateBtn.addEventListener('click', () => this.generateBanner());
        
        document.getElementById('copyCommandBtn')?.addEventListener('click', () => this.copyCommand());
        document.getElementById('downloadBtn')?.addEventListener('click', () => this.downloadPattern());
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        const container = document.querySelector('.container') || document.body;

        // Prevent default drag behaviors on entire page
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        uploadArea.addEventListener('dragenter', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            // Only remove if leaving the upload area, not entering a child
            if (!uploadArea.contains(e.relatedTarget)) {
                uploadArea.classList.remove('dragover');
            }
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    this.loadImage(file);
                } else {
                    this.showToast('Please drop an image file', 'error');
                }
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
                this.createPixelArt(img);
                document.getElementById('previewSection').style.display = 'block';
                document.getElementById('controlsSection').style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    createPixelArt(img) {
        // Create pixel art at Minecraft banner resolution (20x40 pixels for banner shape)
        const bannerWidth = 20;
        const bannerHeight = 40;
        
        const canvas = document.createElement('canvas');
        canvas.width = bannerWidth;
        canvas.height = bannerHeight;
        const ctx = canvas.getContext('2d');
        
        // Draw image scaled down to pixel art size
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, bannerWidth, bannerHeight);
        
        this.pixelArtCanvas = canvas;
        
        // Display original
        const origCanvas = document.getElementById('originalCanvas');
        const origCtx = origCanvas.getContext('2d');
        origCanvas.width = 200;
        origCanvas.height = 400;
        origCtx.imageSmoothingEnabled = false;
        origCtx.drawImage(canvas, 0, 0, 200, 400);
        
        // Show pixel art preview
        this.showToast('Image converted to pixel art!', 'success');
    }

    generateBanner() {
        if (!this.pixelArtCanvas) {
            this.showToast('Please upload an image first', 'error');
            return;
        }

        const complexity = document.getElementById('complexitySelect').value;
        
        // Get pixel data
        const ctx = this.pixelArtCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, 20, 40);
        
        // Analyze pixel art and generate banner
        const bannerData = this.analyzePixelArt(imageData.data, 20, 40, complexity);
        
        this.generatedBanner = bannerData;
        
        // Render preview
        this.renderBannerPreview(bannerData);
        
        // Display results
        this.displayPatternResults(bannerData);
        this.generateCraftingGuide(bannerData);
        
        document.getElementById('resultSection').style.display = 'block';
        
        this.showToast('Banner generated!', 'success');
    }

    analyzePixelArt(data, width, height, complexity) {
        // Get dominant colors
        const colorCounts = new Map();
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a < 128) continue;
            
            const closest = this.quantizer.findClosestColor(r, g, b);
            const key = closest.name;
            colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
        }
        
        // Sort by frequency
        const sortedColors = Array.from(colorCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);
        
        const baseColor = sortedColors[0] || 'white';
        const secondaryColor = sortedColors[1] || baseColor;
        const tertiaryColor = sortedColors[2] || secondaryColor;
        
        // Analyze regions for patterns
        const patterns = this.detectPatternsFromPixels(data, width, height, complexity);
        
        // Assign colors to patterns
        const patternLayers = patterns.map((p, i) => {
            let color = secondaryColor;
            if (i === 0) color = secondaryColor;
            else if (i === 1) color = tertiaryColor;
            else color = sortedColors[i + 1] || secondaryColor;
            
            return { pattern: p, color: color };
        });
        
        return {
            baseColor,
            patterns: patternLayers.slice(0, complexity === 'simple' ? 2 : complexity === 'complex' ? 6 : 4)
        };
    }

    detectPatternsFromPixels(data, width, height, complexity) {
        const patterns = [];
        
        // Check for horizontal stripe (middle row different from top/bottom)
        const topColor = this.getRegionColor(data, width, height, 0, 0, width, height * 0.3);
        const midColor = this.getRegionColor(data, width, height, 0, height * 0.35, width, height * 0.3);
        const botColor = this.getRegionColor(data, width, height, 0, height * 0.7, width, height * 0.3);
        
        if (topColor && midColor && topColor !== midColor) {
            patterns.push('stripe_top');
        }
        if (midColor && botColor && midColor !== botColor) {
            patterns.push('stripe_bottom');
        }
        if (topColor && midColor && botColor && topColor === botColor && topColor !== midColor) {
            // Replace with single middle stripe
            patterns.length = 0;
            patterns.push('stripe_middle');
        }
        
        // Check for vertical stripe
        const leftColor = this.getRegionColor(data, width, height, 0, 0, width * 0.3, height);
        const centerColor = this.getRegionColor(data, width, height, width * 0.35, 0, width * 0.3, height);
        const rightColor = this.getRegionColor(data, width, height, width * 0.7, 0, width * 0.3, height);
        
        if (leftColor && centerColor && leftColor !== centerColor) {
            patterns.push('stripe_left');
        }
        if (centerColor && rightColor && centerColor !== rightColor) {
            patterns.push('stripe_right');
        }
        if (leftColor && centerColor && rightColor && leftColor === rightColor && leftColor !== centerColor) {
