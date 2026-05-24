// dark-mode-toggle.js - include on ALL pages (index + child pages)
(function(){
  var key = 'tb_dark';
  function getToggle() { return document.getElementById('dark-toggle'); }
  function applyState() {
    var on = localStorage.getItem(key) === '1';
    console.log('[dark-mode] applyState called, isDark:', on);
    document.body.classList.toggle('dark-mode', on);
    var btn = getToggle();
    if (btn) {
      btn.textContent = on ? '☀️ Light' : '🌙 Dark';
      console.log('[dark-mode] button text updated to:', btn.textContent);
    } else {
      console.log('[dark-mode] button not found!');
    }
  }
  function toggle() {
    var on = localStorage.getItem(key) !== '1';
    console.log('[dark-mode] toggle called, turning:', on);
    localStorage.setItem(key, on ? '1' : '0');
    applyState();
  }
  // Expose globally
  window.toggleDark = toggle;
  // Apply on load
  console.log('[dark-mode] script loaded, calling applyState');
  applyState();
})();
