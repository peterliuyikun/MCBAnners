// Color Quantizer - Maps image colors to Minecraft banner colors

class ColorQuantizer {
    constructor() {
        this.mcColors = [
            { name: 'white', r: 249, g: 255, b: 254 },
            { name: 'orange', r: 249, g: 128, b: 29 },
            { name: 'magenta', r: 199, g: 78, b: 189 },
            { name: 'light_blue', r: 58, g: 179, b: 218 },
            { name: 'yellow', r: 254, g: 216, b: 61 },
            { name: 'lime', r: 128, g: 199, b: 31 },
            { name: 'pink', r: 243, g: 139, b: 170 },
            { name: 'gray', r: 71, g: 79, b: 82 },
            { name: 'light_gray', r: 157, g: 157, b: 151 },
            { name: 'cyan', r: 22, g: 156, b: 156 },
            { name: 'purple', r: 137, g: 50, b: 184 },
            { name: 'blue', r: 60, g: 68, b: 170 },
            { name: 'brown', r: 131, g: 84, b: 50 },
            { name: 'green', r: 94, g: 124, b: 22 },
            { name: 'red', r: 176, g: 46, b: 38 },
            { name: 'black', r: 29, g: 29, b: 33 }
        ];
    }

    // Calculate Euclidean distance between two colors
    colorDistance(r1, g1, b1, r2, g2, b2) {
        return Math.sqrt(
            Math.pow(r1 - r2, 2) +
            Math.pow(g1 - g2, 2) +
            Math.pow(b1 - b2, 2)
        );
    }

    // Find closest Minecraft color
    findClosestColor(r, g, b) {
        let closest = this.mcColors[0];
        let minDistance = this.colorDistance(r, g, b, closest.r, closest.g, closest.b);

        for (const color of this.mcColors) {
            const distance = this.colorDistance(r, g, b, color.r, color.g, color.b);
            if (distance < minDistance) {
                minDistance = distance;
                closest = color;
            }
        }

        return closest;
    }

    // Quantize image data to Minecraft colors
    quantize(imageData, width, height) {
        const quantized = new Uint8ClampedArray(imageData.length);
        const colorMap = new Map();

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            if (a < 128) {
                quantized[i] = 255;
                quantized[i + 1] = 255;
                quantized[i + 2] = 255;
                quantized[i + 3] = 0;
                continue;
            }

            const closest = this.findClosestColor(r, g, b);
            quantized[i] = closest.r;
            quantized[i + 1] = closest.g;
            quantized[i + 2] = closest.b;
            quantized[i + 3] = 255;

            const key = `${closest.name}`;
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
        }

        return { data: quantized, colorMap };
    }

    // Get dominant colors from image
    getDominantColors(imageData, width, height, count = 5) {
        const colorCounts = new Map();

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            if (a < 128) continue;

            const closest = this.findClosestColor(r, g, b);
            const key = closest.name;
            colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
        }

        return Array.from(colorCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(([name]) => name);
    }

    // Analyze image regions for pattern detection
    analyzeRegions(imageData, width, height, regionsX = 4, regionsY = 4) {
        const regions = [];
        const regionWidth = width / regionsX;
        const regionHeight = height / regionsY;

        for (let ry = 0; ry < regionsY; ry++) {
            for (let rx = 0; rx < regionsX; rx++) {
                const regionColors = new Map();
                
                for (let y = Math.floor(ry * regionHeight); y < Math.floor((ry + 1) * regionHeight); y++) {
                    for (let x = Math.floor(rx * regionWidth); x < Math.floor((rx + 1) * regionWidth); x++) {
                        const i = (y * width + x) * 4;
                        const r = imageData[i];
                        const g = imageData[i + 1];
                        const b = imageData[i + 2];
                        const a = imageData[i + 3];

                        if (a < 128) continue;

                        const closest = this.findClosestColor(r, g, b);
                        regionColors.set(closest.name, (regionColors.get(closest.name) || 0) + 1);
                    }
                }

                const dominantColor = Array.from(regionColors.entries())
                    .sort((a, b) => b[1] - a[1])[0];

                regions.push({
                    x: rx,
                    y: ry,
                    color: dominantColor ? dominantColor[0] : 'white',
                    coverage: dominantColor ? dominantColor[1] / (regionWidth * regionHeight) : 0
                });
            }
        }

        return regions;
    }

    // Detect patterns in image
    detectPatterns(imageData, width, height) {
        const patterns = [];
        const regions = this.analyzeRegions(imageData, width, height, 4, 4);
        const dominantColors = this.getDominantColors(imageData, width, height, 3);
        
        const baseColor = dominantColors[0] || 'white';
        const secondaryColor = dominantColors[1] || baseColor;
        const accentColor = dominantColors[2] || secondaryColor;

        // Detect horizontal stripes
        const hasHorizontalStripe = this.checkHorizontalStripe(regions, 4);
        if (hasHorizontalStripe) {
            patterns.push({ pattern: 'stripe_middle', color: secondaryColor });
        }

        // Detect vertical stripes
        const hasVerticalStripe = this.checkVerticalStripe(regions, 4);
        if (hasVerticalStripe) {
            patterns.push({ pattern: 'stripe_center', color: secondaryColor });
        }

        // Detect border
        const hasBorder = this.checkBorder(regions, 4);
        if (hasBorder) {
            patterns.push({ pattern: 'border', color: accentColor });
        }

        // Detect cross
        const hasCross = hasHorizontalStripe && hasVerticalStripe;
        if (hasCross) {
            patterns.pop();
            patterns.pop();
            patterns.push({ pattern: 'cross', color: secondaryColor });
        }

        // Detect diagonal
        const hasDiagonal = this.checkDiagonal(regions, 4);
        if (hasDiagonal) {
            patterns.push({ pattern: 'stripe_downright', color: secondaryColor });
        }

        // Detect gradient
        const hasGradient = this.checkGradient(regions, 4);
        if (hasGradient) {
            patterns.push({ pattern: 'gradient', color: secondaryColor });
        }

        // Detect triangle top
        const hasTriangleTop = this.checkTriangleTop(regions, 4);
        if (hasTriangleTop) {
            patterns.push({ pattern: 'triangle_top', color: secondaryColor });
        }

        // Detect triangle bottom
        const hasTriangleBottom = this.checkTriangleBottom(regions, 4);
        if (hasTriangleBottom) {
            patterns.push({ pattern: 'triangle_bottom', color: secondaryColor });
        }

        // Add some decorative patterns if we have room
        if (patterns.length < 2) {
            if (Math.random() > 0.5) {
                patterns.push({ pattern: 'circle', color: accentColor });
            } else {
                patterns.push({ pattern: 'rhombus', color: accentColor });
            }
        }

        return {
            baseColor,
            patterns: patterns.slice(0, 6) // Max 6 layers
        };
    }

    checkHorizontalStripe(regions, gridSize) {
        const middleRow = regions.filter(r => r.y === 1 || r.y === 2);
        const uniqueColors = new Set(middleRow.map(r => r.color));
        return uniqueColors.size === 1 && middleRow[0].coverage > 0.5;
    }

    checkVerticalStripe(regions, gridSize) {
        const middleCol = regions.filter(r => r.x === 1 || r.x === 2);
        const uniqueColors = new Set(middleCol.map(r => r.color));
        return uniqueColors.size === 1 && middleCol[0].coverage > 0.5;
    }

    checkBorder(regions, gridSize) {
        const edgeRegions = regions.filter(r => 
            r.x === 0 || r.x === gridSize - 1 || 
            r.y === 0 || r.y === gridSize - 1
        );
        const uniqueColors = new Set(edgeRegions.map(r => r.color));
        return uniqueColors.size === 1;
    }

    checkDiagonal(regions, gridSize) {
        const diag1 = regions.filter(r => r.x === r.y);
        const diag2 = regions.filter(r => r.x + r.y === gridSize - 1);
        const uniqueColors1 = new Set(diag1.map(r => r.color));
        const uniqueColors2 = new Set(diag2.map(r => r.color));
        return uniqueColors1.size === 1 || uniqueColors2.size === 1;
    }

    checkGradient(regions, gridSize) {
        const topRow = regions.filter(r => r.y === 0).map(r => r.color);
        const bottomRow = regions.filter(r => r.y === gridSize - 1).map(r => r.color);
        return topRow[0] !== bottomRow[0];
    }

    checkTriangleTop(regions, gridSize) {
        const topRegions = regions.filter(r => r.y === 0);
        const middleRegions = regions.filter(r => r.y === 1);
        return topRegions.length > 0 && middleRegions.length > topRegions.length;
    }

    checkTriangleBottom(regions, gridSize) {
        const bottomRegions = regions.filter(r => r.y === gridSize - 1);
        const middleRegions = regions.filter(r => r.y === gridSize - 2);
        return bottomRegions.length > 0 && middleRegions.length > bottomRegions.length;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorQuantizer;
}