// ==================== Converter Module ====================

function convertLength() {
    const value = parseFloat(document.getElementById('length-input').value);
    const from = document.getElementById('length-from').value;
    const to = document.getElementById('length-to').value;
    
    const toMeters = {
        m: 1, km: 1000, cm: 0.01, mm: 0.001,
        mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254
    };
    
    const meters = value * toMeters[from];
    const result = meters / toMeters[to];
    document.getElementById('length-result').textContent = `${result.toFixed(5)} ${to}`;
}

function convertWeight() {
    const value = parseFloat(document.getElementById('weight-input').value);
    const from = document.getElementById('weight-from').value;
    const to = document.getElementById('weight-to').value;
    
    const toKg = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 };
    
    const kg = value * toKg[from];
    const result = kg / toKg[to];
    document.getElementById('weight-result').textContent = `${result.toFixed(5)} ${to}`;
}

function convertTemp() {
    const value = parseFloat(document.getElementById('temp-input').value);
    const from = document.getElementById('temp-from').value;
    const to = document.getElementById('temp-to').value;
    
    let celsius;
    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * 5/9;
    else celsius = value - 273.15;
    
    let result;
    if (to === 'c') result = celsius;
    else if (to === 'f') result = celsius * 9/5 + 32;
    else result = celsius + 273.15;
    
    document.getElementById('temp-result').textContent = `${result.toFixed(2)} °${to.toUpperCase()}`;
}

function convertVolume() {
    const value = parseFloat(document.getElementById('volume-input').value);
    const from = document.getElementById('volume-from').value;
    const to = document.getElementById('volume-to').value;
    
    const toLiters = {
        l: 1, ml: 0.001, gal: 3.78541, qt: 0.946353,
        pt: 0.473176, cup: 0.236588, floz: 0.0295735
    };
    
    const liters = value * toLiters[from];
    const result = liters / toLiters[to];
    document.getElementById('volume-result').textContent = `${result.toFixed(5)} ${to}`;
}

function convertArea() {
    const value = parseFloat(document.getElementById('area-input').value);
    const from = document.getElementById('area-from').value;
    const to = document.getElementById('area-to').value;
    
    const toSqm = {
        sqm: 1, sqkm: 1000000, sqft: 0.092903,
        sqmi: 2589988, acre: 4046.86, hectare: 10000
    };
    
    const sqm = value * toSqm[from];
    const result = sqm / toSqm[to];
    document.getElementById('area-result').textContent = `${result.toFixed(5)} ${to}`;
}

function convertSpeed() {
    const value = parseFloat(document.getElementById('speed-input').value);
    const from = document.getElementById('speed-from').value;
    const to = document.getElementById('speed-to').value;
    
    const toKph = { mph: 1.60934, kph: 1, mps: 3.6, fps: 1.097, knot: 1.852 };
    
    const kph = value * toKph[from];
    const result = kph / toKph[to];
    document.getElementById('speed-result').textContent = `${result.toFixed(5)} ${to}`;
}
