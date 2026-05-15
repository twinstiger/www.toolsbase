// ==================== JSON Tools Module ====================

function formatData() {
    const input = document.getElementById('jsonInput');
    const output = document.getElementById('jsonOutput');
    const formatSelect = document.getElementById('jsonFormat');
    const statusEl = document.getElementById('outputStatus');
    
    if (!input || !output || !formatSelect) return;
    
    const inputValue = input.value;
    
    if (!inputValue.trim()) {
        if (statusEl) {
            statusEl.textContent = 'Please enter some data first';
            statusEl.className = 'status-badge error';
        }
        return;
    }
    
    try {
        let formatted;
        const format = formatSelect.value;
        
        if (format === 'json') {
            const obj = JSON.parse(inputValue);
            formatted = JSON.stringify(obj, null, 4);
            output.innerHTML = syntaxHighlightJSON(formatted);
        } else if (format === 'yaml') {
            // Simple YAML conversion
            const obj = JSON.parse(inputValue);
            formatted = convertToYAML(obj);
            output.textContent = formatted;
        } else {
            // XML conversion
            const obj = JSON.parse(inputValue);
            formatted = convertToXML(obj);
            output.innerHTML = syntaxHighlightXML(formatted);
        }
        
        if (statusEl) {
            statusEl.textContent = 'Formatted successfully!';
            statusEl.className = 'status-badge success';
        }
        
        // Update stats
        const inputStats = document.getElementById('input-stats');
        if (inputStats) {
            const inputBytes = new Blob([inputValue]).size;
            inputStats.textContent = `${inputBytes} bytes`;
        }
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
        if (statusEl) {
            statusEl.textContent = 'Invalid format: ' + error.message;
            statusEl.className = 'status-badge error';
        }
    }
}

function compressData() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const statusEl = document.getElementById('output-status');
    
    if (!input || !output) return;
    
    const inputValue = input.value;
    
    if (!inputValue.trim()) {
        if (statusEl) {
            statusEl.textContent = 'Please enter some data first';
            statusEl.className = 'status-badge error';
        }
        return;
    }
    
    try {
        const obj = JSON.parse(inputValue);
        const compressed = JSON.stringify(obj);
        output.textContent = compressed;
        
        if (statusEl) {
            statusEl.textContent = 'Compressed successfully!';
            statusEl.className = 'status-badge success';
        }
        
        // Update stats
        const inputStats = document.getElementById('input-stats');
        if (inputStats) {
            const inputBytes = new Blob([inputValue]).size;
            inputStats.textContent = `${inputBytes} bytes`;
        }
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
        if (statusEl) {
            statusEl.textContent = 'Invalid JSON: ' + error.message;
            statusEl.className = 'status-badge error';
        }
    }
}

function validateData() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const statusEl = document.getElementById('output-status');
    const formatSelect = document.getElementById('json-format');
    
    if (!input || !output || !formatSelect) return;
    
    const inputValue = input.value;
    
    if (!inputValue.trim()) {
        if (statusEl) {
            statusEl.textContent = '';
            statusEl.className = 'status-badge';
        }
        return;
    }
    
    try {
        const format = formatSelect.value;
        
        if (format === 'json') {
            JSON.parse(inputValue);
        }
        
        if (statusEl) {
            statusEl.textContent = 'Valid ✓';
            statusEl.className = 'status-badge success';
        }
        output.textContent = `✓ Valid ${format.toUpperCase()}\n\nThe input is correctly formatted.`;
    } catch (error) {
        if (statusEl) {
            statusEl.textContent = 'Invalid ✗';
            statusEl.className = 'status-badge error';
        }
        output.textContent = `✗ Invalid ${format.toUpperCase()}\n\nError: ${error.message}`;
    }
}

function clearAll() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const statusEl = document.getElementById('output-status');
    const inputStats = document.getElementById('input-stats');
    
    if (input) input.value = '';
    if (output) output.innerHTML = '';
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'status-badge';
    }
    if (inputStats) inputStats.textContent = '0 bytes';
}

function convertToYAML(obj, indent = 0) {
    let yaml = '';
    const spacing = '  '.repeat(indent);
    
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                yaml += spacing + '-\n' + convertToYAML(item, indent + 1);
            } else {
                yaml += spacing + '- ' + item + '\n';
            }
        });
    } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                yaml += spacing + key + ':\n' + convertToYAML(value, indent + 1);
            } else {
                yaml += spacing + key + ': ' + value + '\n';
            }
        });
    }
    
    return yaml;
}

function convertToXML(obj, rootName = 'root') {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += objectToXML(obj, rootName);
    return xml;
}

function objectToXML(obj, tagName) {
    if (typeof obj !== 'object' || obj === null) {
        return `<${tagName}>${obj}</${tagName}>`;
    }
    
    let xml = `<${tagName}>`;
    
    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            xml += objectToXML(item, 'item');
        });
    } else {
        Object.entries(obj).forEach(([key, value]) => {
            xml += objectToXML(value, key);
        });
    }
    
    xml += `</${tagName}>`;
    return xml;
}

function syntaxHighlightJSON(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function syntaxHighlightXML(xml) {
    xml = xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return xml;
}

// Auto-format on input
document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('json-input');
    if (jsonInput) {
        let timeout;
        jsonInput.addEventListener('input', () => {
            const autoFormat = document.getElementById('auto-format');
            if (autoFormat && autoFormat.checked) {
                clearTimeout(timeout);
                timeout = setTimeout(formatData, 500);
            }
            
            // Update stats
            const inputStats = document.getElementById('input-stats');
            if (inputStats) {
                const inputBytes = new Blob([jsonInput.value]).size;
                inputStats.textContent = `${inputBytes} bytes`;
            }
        });
    }
});
