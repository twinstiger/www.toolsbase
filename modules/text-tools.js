// ==================== Text Tools Module ====================

function convertCase(type) {
    const input = document.getElementById('case-input');
    let text = input.value;
    
    switch(type) {
        case 'upper':
            text = text.toUpperCase();
            break;
        case 'lower':
            text = text.toLowerCase();
            break;
        case 'title':
            text = text.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            break;
        case 'sentence':
            text = text.toLowerCase().replace(/(\.\s*|^)([a-z])/g, (match, p1, p2) => {
                return p1 + p2.toUpperCase();
            });
            break;
        case 'camel':
            text = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            break;
        case 'snake':
            text = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                .map(x => x.toLowerCase())
                .join('_');
            break;
    }
    
    input.value = text;
}

function countWords() {
    const text = document.getElementById('wordcount-input').value;
    
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    document.getElementById('wc-chars').textContent = chars;
    document.getElementById('wc-words').textContent = words;
    document.getElementById('wc-sentences').textContent = sentences;
    document.getElementById('wc-paragraphs').textContent = paragraphs;
}

function updateColorPicker() {
    const color = document.getElementById('color-picker').value;
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    
    document.getElementById('color-hex').value = color;
    document.getElementById('color-rgb').value = `rgb(${r}, ${g}, ${b})`;
}

function generateRandomNumbers() {
    const min = parseInt(document.getElementById('rand-min').value);
    const max = parseInt(document.getElementById('rand-max').value);
    const count = parseInt(document.getElementById('rand-count').value);
    
    const numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    
    document.getElementById('random-numbers-output').value = numbers.join('\n');
}
