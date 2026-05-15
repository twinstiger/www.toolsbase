// ==================== Image Tools Module ====================

// QR Code Generator (using qrcode.js library)
function generateQRCode() {
    const text = document.getElementById('qrcode-input').value;
    const output = document.getElementById('qrcode-output');
    
    if (!text) {
        alert('Please enter text or URL');
        return;
    }
    
    // Clear previous QR code
    output.innerHTML = '';
    
    try {
        // Create QR code using library
        new QRCode(output, {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Add download button after a short delay
        setTimeout(() => {
            const canvas = output.querySelector('canvas');
            if (canvas) {
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'btn btn-primary';
                downloadBtn.style.marginTop = '15px';
                downloadBtn.textContent = '⬇️ Download QR Code';
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = 'qrcode.png';
                    link.href = canvas.toDataURL();
                    link.click();
                };
                output.appendChild(downloadBtn);
            }
        }, 100);
    } catch (error) {
        console.error('QR Code generation error:', error);
        alert('Error generating QR Code. Please try again.');
    }
}

// EXIF Viewer (simplified - shows basic file info)
function viewEXIF() {
    const fileInput = document.getElementById('exif-file');
    const fileInfo = document.getElementById('exif-info');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        let info = `
            <div style="text-align: left; padding: 15px;">
                <p><strong>File Name:</strong> ${file.name}</p>
                <p><strong>File Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>File Type:</strong> ${file.type}</p>
                <p><strong>Last Modified:</strong> ${new Date(file.lastModified).toLocaleString()}</p>
            </div>
        `;
        
        // Read image to get dimensions
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                info += `
                    <div style="text-align: left; padding: 15px; border-top: 2px solid #a5d6a7;">
                        <p><strong>Width:</strong> ${img.width}px</p>
                        <p><strong>Height:</strong> ${img.height}px</p>
                        <p><strong>Aspect Ratio:</strong> ${(img.width / img.height).toFixed(2)}</p>
                    </div>
                `;
                fileInfo.innerHTML = info;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Image Compressor (basic implementation)
function compressImage() {
    const fileInput = document.getElementById('compress-file');
    const quality = parseInt(document.getElementById('compress-quality').value) || 80;
    const output = document.getElementById('compress-result');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // Compress
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
                const originalSize = (file.size / 1024).toFixed(2);
                const compressedSize = (compressedDataUrl.length * 0.75 / 1024).toFixed(2);
                const savings = ((1 - (compressedSize / originalSize)) * 100).toFixed(1);
                
                output.innerHTML = `
                    <div style="text-align: center;">
                        <img src="${compressedDataUrl}" style="max-width: 100%; border-radius: 10px; margin-bottom: 15px;">
                        <div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                            <p><strong>Original Size:</strong> ${originalSize} KB</p>
                            <p><strong>Compressed Size:</strong> ${compressedSize} KB</p>
                            <p><strong>Savings:</strong> ${savings}%</p>
                        </div>
                        <a href="${compressedDataUrl}" download="compressed-image.jpg" class="btn btn-primary">
                            ⬇️ Download Compressed Image
                        </a>
                    </div>
                `;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Image Rotate & Flip
let currentRotateImage = null;
let currentRotation = 0;

function rotateImage(degrees) {
    const fileInput = document.getElementById('rotate-file');
    
    if (!fileInput.files || !fileInput.files[0]) {
        alert('Please select an image first');
        return;
    }
    
    if (!currentRotateImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                currentRotateImage = img;
                performRotation(degrees);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        performRotation(degrees);
    }
}

function performRotation(degrees) {
    currentRotation += degrees;
    const canvas = document.getElementById('rotate-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = currentRotateImage.height;
    canvas.height = currentRotateImage.width;
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(currentRotation * Math.PI / 180);
    ctx.drawImage(currentRotateImage, -currentRotateImage.width / 2, -currentRotateImage.height / 2);
}

function flipImage(direction) {
    const fileInput = document.getElementById('rotate-file');
    
    if (!fileInput.files || !fileInput.files[0]) {
        alert('Please select an image first');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('rotate-canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            if (direction === 'horizontal') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            } else {
                ctx.translate(0, canvas.height);
                ctx.scale(1, -1);
            }
            
            ctx.drawImage(img, 0, 0);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function downloadRotatedImage() {
    const canvas = document.getElementById('rotate-canvas');
    const link = document.createElement('a');
    link.download = 'rotated-image.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Image Cropper
function cropImage() {
    const fileInput = document.getElementById('crop-file');
    const width = parseInt(document.getElementById('crop-width').value);
    const height = parseInt(document.getElementById('crop-height').value);
    
    if (!fileInput.files || !fileInput.files[0]) {
        alert('Please select an image first');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('crop-canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = width;
            canvas.height = height;
            
            // Crop from center
            const startX = (img.width - width) / 2;
            const startY = (img.height - height) / 2;
            
            ctx.drawImage(img, startX, startY, width, height, 0, 0, width, height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function downloadCroppedImage() {
    const canvas = document.getElementById('crop-canvas');
    const link = document.createElement('a');
    link.download = 'cropped-image.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Image Watermark
function addWatermark() {
    const fileInput = document.getElementById('watermark-file');
    const text = document.getElementById('watermark-text').value;
    const position = document.getElementById('watermark-position').value;
    
    if (!fileInput.files || !fileInput.files[0]) {
        alert('Please select an image first');
        return;
    }
    
    if (!text) {
        alert('Please enter watermark text');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('watermark-canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw original image
            ctx.drawImage(img, 0, 0);
            
            // Add watermark
            ctx.font = 'bold 30px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            
            const metrics = ctx.measureText(text);
            let x, y;
            
            switch(position) {
                case 'top-left':
                    x = 20;
                    y = 40;
                    break;
                case 'top-right':
                    x = canvas.width - metrics.width - 20;
                    y = 40;
                    break;
                case 'bottom-left':
                    x = 20;
                    y = canvas.height - 20;
                    break;
                case 'bottom-right':
                    x = canvas.width - metrics.width - 20;
                    y = canvas.height - 20;
                    break;
                case 'center':
                    x = (canvas.width - metrics.width) / 2;
                    y = canvas.height / 2;
                    break;
            }
            
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function downloadWatermarkedImage() {
    const canvas = document.getElementById('watermark-canvas');
    const link = document.createElement('a');
    link.download = 'watermarked-image.png';
    link.href = canvas.toDataURL();
    link.click();
}
