// ==================== Network Tools Module ====================

// What's My IP
async function getMyIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        
        document.getElementById('my-ip-address').textContent = data.ip;
        
        // Get geolocation info
        const geoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
        const geoData = await geoResponse.json();
        
        document.getElementById('ip-city').textContent = geoData.city || 'N/A';
        document.getElementById('ip-region').textContent = geoData.region || 'N/A';
        document.getElementById('ip-country').textContent = geoData.country_name || 'N/A';
        document.getElementById('ip-isp').textContent = geoData.org || 'N/A';
        document.getElementById('ip-timezone').textContent = geoData.timezone || 'N/A';
    } catch (error) {
        console.error('Error fetching IP:', error);
        document.getElementById('my-ip-address').textContent = 'Error fetching IP';
    }
}

// URL Parser
function parseURL() {
    const url = document.getElementById('url-parser-input').value.trim();
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    
    try {
        // Add protocol if missing
        let fullURL = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            fullURL = 'https://' + url;
        }
        
        const parsed = new URL(fullURL);
        
        document.getElementById('url-protocol').value = parsed.protocol;
        document.getElementById('url-host').value = parsed.hostname;
        document.getElementById('url-port').value = parsed.port || '(default)';
        document.getElementById('url-path').value = parsed.pathname;
        document.getElementById('url-query').value = parsed.search || '(none)';
        document.getElementById('url-hash').value = parsed.hash || '(none)';
        
        // Parse query parameters
        const paramsDiv = document.getElementById('url-params');
        paramsDiv.innerHTML = '';
        
        if (parsed.searchParams.toString()) {
            const h3 = document.createElement('h4');
            h3.textContent = 'Query Parameters:';
            h3.style.marginTop = '15px';
            paramsDiv.appendChild(h3);
            
            parsed.searchParams.forEach((value, key) => {
                const paramItem = document.createElement('div');
                paramItem.className = 'param-item';
                paramItem.innerHTML = `<strong>${key}:</strong> ${value}`;
                paramsDiv.appendChild(paramItem);
            });
        }
    } catch (error) {
        alert('Invalid URL: ' + error.message);
    }
}

// Subnet Calculator
function calculateSubnet() {
    const ip = document.getElementById('subnet-ip').value.trim();
    const cidr = parseInt(document.getElementById('subnet-cidr').value);
    
    if (!ip || !cidr) {
        alert('Please enter IP address and CIDR');
        return;
    }
    
    // Validate IP
    const ipParts = ip.split('.');
    if (ipParts.length !== 4 || !ipParts.every(part => {
        const num = parseInt(part);
        return !isNaN(num) && num >= 0 && num <= 255;
    })) {
        alert('Invalid IP address');
        return;
    }
    
    // Calculate subnet mask
    const mask = ~(Math.pow(2, (32 - cidr)) - 1);
    const maskParts = [
        (mask >>> 24) & 0xFF,
        (mask >>> 16) & 0xFF,
        (mask >>> 8) & 0xFF,
        mask & 0xFF
    ];
    const subnetMask = maskParts.join('.');
    
    // Calculate network address
    const ipNum = ipParts.reduce((acc, part) => (acc << 8) + parseInt(part), 0) >>> 0;
    const networkNum = (ipNum & mask) >>> 0;
    const networkParts = [
        (networkNum >>> 24) & 0xFF,
        (networkNum >>> 16) & 0xFF,
        (networkNum >>> 8) & 0xFF,
        networkNum & 0xFF
    ];
    const networkAddress = networkParts.join('.');
    
    // Calculate broadcast address
    const broadcastNum = (networkNum | ~mask) >>> 0;
    const broadcastParts = [
        (broadcastNum >>> 24) & 0xFF,
        (broadcastNum >>> 16) & 0xFF,
        (broadcastNum >>> 8) & 0xFF,
        broadcastNum & 0xFF
    ];
    const broadcastAddress = broadcastParts.join('.');
    
    // Calculate usable hosts
    const totalHosts = Math.pow(2, (32 - cidr));
    const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;
    
    // First and last usable IP
    const firstUsable = cidr >= 31 ? 'N/A' : networkParts.map((p, i) => i === 3 ? p + 1 : p).join('.');
    const lastUsable = cidr >= 31 ? 'N/A' : broadcastParts.map((p, i) => i === 3 ? p - 1 : p).join('.');
    
    // Display results
    document.getElementById('subnet-mask').textContent = subnetMask;
    document.getElementById('subnet-network').textContent = networkAddress;
    document.getElementById('subnet-broadcast').textContent = broadcastAddress;
    document.getElementById('subnet-total').textContent = totalHosts.toLocaleString();
    document.getElementById('subnet-usable').textContent = usableHosts.toLocaleString();
    document.getElementById('subnet-first').textContent = firstUsable;
    document.getElementById('subnet-last').textContent = lastUsable;
}

// IP to Integer
function ipToInteger() {
    const ip = document.getElementById('ip2int-input').value.trim();
    
    if (!ip) {
        alert('Please enter an IP address');
        return;
    }
    
    const parts = ip.split('.');
    if (parts.length !== 4) {
        alert('Invalid IP address');
        return;
    }
    
    try {
        const result = parts.reduce((acc, part) => {
            const num = parseInt(part);
            if (isNaN(num) || num < 0 || num > 255) throw new Error('Invalid octet');
            return (acc << 8) + num;
        }, 0) >>> 0;
        
        document.getElementById('ip2int-result').textContent = result.toLocaleString();
        document.getElementById('ip2int-hex').textContent = '0x' + result.toString(16).toUpperCase();
        document.getElementById('ip2int-binary').textContent = result.toString(2).padStart(32, '0');
    } catch (error) {
        alert('Invalid IP address: ' + error.message);
    }
}

// URL Shortener (using is.gd API - free, no auth required)
async function shortenURL() {
    const longURL = document.getElementById('shorten-input').value.trim();
    
    if (!longURL) {
        alert('Please enter a URL');
        return;
    }
    
    try {
        // Using is.gd API
        const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longURL)}`);
        const data = await response.json();
        
        if (data.shorturl) {
            document.getElementById('shorten-output').value = data.shorturl;
        } else {
            throw new Error(data.errorcode || 'Failed to shorten URL');
        }
    } catch (error) {
        // Fallback: create a simple hash-based short URL (local only)
        const hash = btoa(longURL).substring(0, 8);
        document.getElementById('shorten-output').value = `https://example.com/${hash}`;
        alert('Note: Using local simulation. For real URL shortening, you need a backend service.');
    }
}

async function expandURL() {
    const shortURL = document.getElementById('expand-input').value.trim();
    
    if (!shortURL) {
        alert('Please enter a shortened URL');
        return;
    }
    
    try {
        // Note: This requires a backend due to CORS
        // For demo, we'll just show a message
        document.getElementById('expand-output').value = 'URL expansion requires a backend service due to CORS restrictions';
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
