/**
 * Generates og-image.png (1200x630) for TuMundial26.
 * Usage:
 *   npm install canvas          (run once)
 *   node scripts/generate-og-image.js
 * Output: public/og-image.png
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#0a0a0f';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Subtle gradient overlay
const grad = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 80, WIDTH / 2, HEIGHT / 2, 600);
grad.addColorStop(0, 'rgba(0,255,135,0.08)');
grad.addColorStop(1, 'rgba(0,0,0,0)');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Soccer ball emoji (centered, large)
ctx.font = '160px serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('⚽', WIDTH / 2, HEIGHT / 2 - 80);

// Main title
ctx.font = 'bold 96px sans-serif';
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('TuMundial26', WIDTH / 2, HEIGHT / 2 + 110);

// Subtitle
ctx.font = '38px sans-serif';
ctx.fillStyle = '#00ff87';
ctx.fillText('Rastreador en vivo · Mundial FIFA 2026', WIDTH / 2, HEIGHT / 2 + 190);

// Save
const outPath = path.join(__dirname, '..', 'public', 'og-image.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outPath, buffer);
console.log(`OG image saved to ${outPath}`);
