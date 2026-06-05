(function() {
  var worker = null;
  var currentTimeout = null;

  function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderOutput(logs, outputEl) {
    if (!logs || logs.length === 0) {
      outputEl.innerHTML = '<span class="output-empty">// (no output)</span>';
      return;
    }
    outputEl.innerHTML = logs.map(function(l) {
      if (l.t === 'error') return '<span class="output-line output-line--error">&#10060; ' + escHtml(l.v) + '</span>';
      if (l.t === 'warn')  return '<span class="output-line output-line--warn">&#9888; '  + escHtml(l.v) + '</span>';
      return '<span class="output-line">' + escHtml(l.v) + '</span>';
    }).join('\n');
  }

  function initWorker() {
    // Worker code: intercept console + errors, eval user code, send back logs
    var workerSrc =
      'var _logs=[];' +
      'var _f=function(a){try{return typeof a==="object"?JSON.stringify(a,null,2):String(a);}catch(e){return String(a);}};' +
      'var console={' +
        'log:function(){_logs.push({t:"log",v:Array.from(arguments).map(_f).join(" ")});},' +
        'error:function(){_logs.push({t:"error",v:Array.from(arguments).map(_f).join(" ")});},' +
        'warn:function(){_logs.push({t:"warn",v:Array.from(arguments).map(_f).join(" ")});},' +
        'info:function(){_logs.push({t:"log",v:Array.from(arguments).map(_f).join(" ")});},' +
        'table:function(){_logs.push({t:"log",v:Array.from(arguments).map(_f).join(" ")});}' +
      '};' +
      'self.onerror=function(m){_logs.push({t:"error",v:m});};' +
      'self.onmessage=function(e){' +
        '_logs=[];' +
        'try{eval(e.data);}catch(err){_logs.push({t:"error",v:err.toString()});}' +
        'self.postMessage(_logs);' +
      '};';

    var blob = new Blob([workerSrc], { type: 'application/javascript' });
    var url = URL.createObjectURL(blob);
    worker = new Worker(url);
    URL.revokeObjectURL(url); // Worker holds its own reference

    worker.onmessage = function(e) {
      clearTimeout(currentTimeout);
      var btn = document.getElementById('runBtn');
      var statusEl = document.getElementById('runStatus');
      var outputEl = document.getElementById('codeOutput');
      if (btn) btn.disabled = false;
      if (statusEl) statusEl.textContent = '';
      renderOutput(e.data, outputEl);
    };

    worker.onerror = function(e) {
      clearTimeout(currentTimeout);
      var btn = document.getElementById('runBtn');
      var statusEl = document.getElementById('runStatus');
      var outputEl = document.getElementById('codeOutput');
      if (btn) btn.disabled = false;
      if (statusEl) statusEl.textContent = '';
      outputEl.innerHTML = '<span class="output-error">// Error: ' + escHtml(e.message) + '</span>';
    };
  }

  window.runJS = function() {
    var code = document.getElementById('codeEditor').value;
    var outputEl = document.getElementById('codeOutput');
    var statusEl = document.getElementById('runStatus');
    var btn = document.getElementById('runBtn');

    if (!code.trim()) {
      outputEl.innerHTML = '<span class="output-empty">// No code to run</span>';
      return;
    }

    btn.disabled = true;
    statusEl.textContent = 'Running...';

    if (!worker) initWorker();

    clearTimeout(currentTimeout);
    currentTimeout = setTimeout(function() {
      outputEl.innerHTML = '<span class="output-error">// Execution timed out (5s limit)</span>';
      var btn2 = document.getElementById('runBtn');
      var statusEl2 = document.getElementById('runStatus');
      if (btn2) btn2.disabled = false;
      if (statusEl2) statusEl2.textContent = '';
      // Terminate and restart worker after timeout
      if (worker) { worker.terminate(); worker = null; }
    }, 5000);

    worker.postMessage(code);
  };

  window.clearCode = function() {
    var ed = document.getElementById('codeEditor');
    var out = document.getElementById('codeOutput');
    var stat = document.getElementById('runStatus');
    if (ed) ed.value = '';
    if (out) out.innerHTML = '<span class="output-empty">// Output will appear here</span>';
    if (stat) stat.textContent = '';
  };

  window.copyOutput = function() {
    var out = document.getElementById('codeOutput');
    if (!out) return;
    var text = out.innerText || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(function() {
      var el = document.getElementById('runStatus');
      el.textContent = 'Copied!';
      setTimeout(function() { el.textContent = ''; }, 1500);
    });
  };

  // Ctrl/Cmd + Enter to run
  var ed = document.getElementById('codeEditor');
  if (ed) {
    ed.placeholder = '// Write your JavaScript here\n\nconsole.log("Hello, world!");\n\nconst add = (a, b) => a + b;\nconsole.log(add(2, 3));\n// Hello, world!\n// 5';
    ed.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        window.runJS();
      }
    });
  }
})();
