// ToolsBase Shared Utilities
// Manages favorites, history, and share state via localStorage

(function() {
  var STORAGE = {
    FAVORITES: 'tb_favorites',
    HISTORY: 'tb_history',
    MAX_HISTORY: 20
  };

  // === FAVORITES ===
  window.TBUtils = window.TBUtils || {};

  window.TBUtils.getFavorites = function() {
    return JSON.parse(localStorage.getItem(STORAGE.FAVORITES) || '[]');
  };

  window.TBUtils.isFavorite = function(toolId) {
    var favs = this.getFavorites();
    return favs.indexOf(toolId) >= 0;
  };

  window.TBUtils.toggleFavorite = function(toolId) {
    var favs = this.getFavorites();
    var idx = favs.indexOf(toolId);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.unshift(toolId);
    }
    localStorage.setItem(STORAGE.FAVORITES, JSON.stringify(favs));
    return idx < 0;
  };

  // === HISTORY ===
  window.TBUtils.addToHistory = function(toolId, toolName) {
    var history = JSON.parse(localStorage.getItem(STORAGE.HISTORY) || '[]');
    history = history.filter(function(h) { return h.id !== toolId; });
    history.unshift({ id: toolId, name: toolName, time: Date.now() });
    history = history.slice(0, STORAGE.MAX_HISTORY);
    localStorage.setItem(STORAGE.HISTORY, JSON.stringify(history));
  };

  window.TBUtils.getHistory = function() {
    return JSON.parse(localStorage.getItem(STORAGE.HISTORY) || '[]');
  };

  // === SHARE ===
  window.TBUtils.shareTool = function(toolId) {
    var url = location.origin + location.pathname + '?shared=' + toolId;
    var pageTitle = document.title || 'ToolsBase';
    return {
      url: url,
      title: pageTitle,
      text: 'Check out this tool: ' + pageTitle
    };
  };

  window.TBUtils.copyToClipboard = function(text, callback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(callback);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (callback) callback();
    }
  };

  // === SHARE MODAL ===
  window.TBUtils.showShareModal = function(toolId, toolName) {
    var share = this.shareTool(toolId);
    var encodedUrl = encodeURIComponent(share.url);
    var encodedText = encodeURIComponent(share.text);

    var socials = [
      {
        id: 'native',
        label: 'Device',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>',
        iconClass: 'icon-native',
        action: function() {
          if (navigator.share) {
            navigator.share({
              title: share.title,
              text: share.text,
              url: share.url
            }).catch(function() {});
          } else {
            TBUtils.copyToClipboard(share.url, function() {
              TBUtils.showToast('Link copied!');
            });
          }
        }
      },
      {
        id: 'twitter',
        label: 'X',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        iconClass: 'icon-twitter',
        action: function() {
          window.open('https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl, '_blank', 'width=550,height=420');
        }
      },
      {
        id: 'facebook',
        label: 'Facebook',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
        iconClass: 'icon-facebook',
        action: function() {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl, '_blank', 'width=550,height=420');
        }
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        iconClass: 'icon-linkedin',
        action: function() {
          window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodedUrl, '_blank', 'width=550,height=420');
        }
      },
      {
        id: 'reddit',
        label: 'Reddit',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.813.265 2.43.681-.569.375-1.182.684-2.43.681-1.247-1.578-4.553-1.946-6.068-1.946-.49 1.347-1.156 2.424-2.088 3.153-1.497 1.15-.494 2.059.688 2.091.934.031 1.61.703 1.753 1.113.47.847.686 1.852.497 2.824-.189.972-.997 1.372-1.707 1.372-.497 0-1.434-.437-1.272-2.063.19-1.873-2.94-2.497-2.94-2.497S7.142 9.5 8.16 9.5c1.018 0 3.821.497 3.821 2.475 0 .972-.531 1.686-1.288 1.938.935.281 1.603.844 2.146 1.442.686.75 1.703 1.153 2.847 1.153.718 0 1.463-.265 1.997-.734.372-.329.68-.742.93-1.224.468.484 1.058.848 1.72 1.063.497.157 1.497-.125 1.622-.28.125-.156 1.622-2.063 1.622-2.063-.063-.468-.438-.872-.934-.967zm-9.031 6.937c-.781.781-2.057.78-2.841.016-.779-.768-.777-2.016.016-2.793.788-.781 2.06-.78 2.838-.016.777.772.777 2.015-.013 2.793zm6.031 6.031c-2.519 0-4.538-.719-5.663-1.719-.188-.169-.125-.463.094-.537.719-.25 2.013-.375 3.684-.375 2.331 0 2.928.875 3.353.875.406 0 .469-.531.188-.688-.625-.656-2.216-1.156-3.541-1.156-.656 0-1.625.188-2.944.813-.375.188-.844.031-.938-.563-.094-.594.344-.969.906-1.219 2.153-.906 3.928-.969 4.297-.625.563.531.563 1.531.563 2.066 0 2.081-.781 5.253-5.891 5.253zm5.925-10.875c-.469 0-.906-.125-1.337-.438-.188-.125-.125-.375.125-.469.406-.094 1.044-.281 1.688-.281 1.022 0 1.709.406 1.709.875 0 .25-.094.625-.531.781-.406.125-.531.406-.531.906 0 .719-.938 2.013-3.025 2.013-.781 0-1.553-.125-2.272-.406-.188-.063-.406.063-.469.281-.094.219.063.406.313.5.906.469 2.066.688 3.272.688 2.444 0 3.709-1.406 3.709-2.875 0-1.031-.531-2.031-1.653-2.563.313-.344.719-.656 1.122-.906.031-.031.063-.063.063-.125 0-.188-.188-.281-.344-.219-.5.188-1.125.375-1.744.375z"/></svg>',
        iconClass: 'icon-reddit',
        action: function() {
          window.open('https://reddit.com/submit?url=' + encodedUrl + '&title=' + encodedText, '_blank', 'width=850,height=650');
        }
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
        iconClass: 'icon-copy',
        action: function() {
          TBUtils.copyToClipboard(share.url, function() {
            var btn = document.querySelector('.share-copy-btn');
            if (btn) { btn.textContent = 'Copied!'; btn.classList.add('copied'); }
            setTimeout(function() {
              if (btn) { btn.textContent = 'Copy'; btn.classList.remove('copied'); }
            }, 2000);
          });
        }
      },
      {
        id: 'email',
        label: 'Email',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
        iconClass: 'icon-email',
        action: function() {
          window.location.href = 'mailto:?subject=' + encodeURIComponent(share.title) + '&body=' + encodedText;
        }
      }
    ];

    var optionsHtml = '';
    socials.forEach(function(s) {
      optionsHtml += '<button class="share-option ' + s.iconClass + '" data-action="' + s.id + '">' +
        '<span class="share-option-icon">' + s.icon + '</span>' +
        '<span class="share-option-label">' + s.label + '</span>' +
        '</button>';
    });

    var modalHtml = '<div class="share-modal-overlay" onclick="if(event.target===this)TBUtils.closeShareModal()">' +
      '<div class="share-modal">' +
      '<div class="share-modal-header">' +
      '<h3 class="share-modal-title">Share</h3>' +
      '<button class="share-modal-close" onclick="TBUtils.closeShareModal()">×</button>' +
      '</div>' +
      '<div class="share-modal-body">' +
      '<div class="share-options-grid">' + optionsHtml + '</div>' +
      '</div>' +
      '<div class="share-modal-footer">' +
      '<div class="share-url-row">' +
      '<input type="text" class="share-url-input" value="' + share.url + '" readonly onclick="this.select()">' +
      '<button class="share-copy-btn" onclick="copyAction();this.textContent=\'Copied!\';this.classList.add(\'copied\');setTimeout(function(){if(document.querySelector(\'.share-copy-btn\')){document.querySelector(\'.share-copy-btn\').textContent=\'Copy\';document.querySelector(\'.share-copy-btn\').classList.remove(\'copied\');}},2000)">Copy</button>' +
      '</div>' +
      '</div>' +
      '</div></div>';

    // Remove existing modal
    var existing = document.querySelector('.share-modal-overlay');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Bind click events
    socials.forEach(function(s) {
      var btn = document.querySelector('.share-option[data-action="' + s.id + '"]');
      if (btn) {
        btn.addEventListener('click', function() {
          TBUtils.closeShareModal();
          setTimeout(s.action, 100);
        });
      }
    });
  };

  window.TBUtils.closeShareModal = function() {
    var modal = document.querySelector('.share-modal-overlay');
    if (modal) modal.remove();
  };

  // === TOAST ===
  window.TBUtils.showToast = function(msg) {
    var t = document.getElementById('toast');
    if (t) {
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(function() { t.classList.remove('show'); }, 1800);
    }
  };

  // === RENDER FAVORITE BUTTON ===
  window.TBUtils.renderFavoriteBtn = function(toolId) {
    var isFav = this.isFavorite(toolId);
    return '<button class="fav-btn' + (isFav ? ' active' : '') + '" onclick="TBUtils.toggleFavorite(\'' + toolId + '\');this.classList.toggle(\'active\');return false;" aria-label="Favorite">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
      '</button>';
  };

  // === RENDER TOOL CARD WITH FAVORITE ===
  window.TBUtils.renderToolCard = function(tool) {
    var isFav = this.isFavorite(tool.id);
    return '<a href="' + tool.href + '" class="tool-card ' + tool.colorClass + '">' +
      '<div class="tool-card-icon">' + tool.icon + '</div>' +
      '<div class="tool-card-title">' + tool.name + '</div>' +
      '<div class="tool-card-desc">' + tool.desc + '</div>' +
      '<div class="tool-card-link">→</div>' +
      '<button class="fav-btn' + (isFav ? ' active' : '') + '" onclick="TBUtils.toggleFavorite(\'' + tool.id + '\');this.classList.toggle(\'active\');this.querySelector(\'svg\').setAttribute(\'fill\',this.classList.contains(\'active\'?\'currentColor\':\'none\');return false;" aria-label="Favorite">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
      '</button>' +
      '</a>';
  };

  // === INIT SHARE ON TOOL PAGES ===
  // Auto-call shareTool to register tool in history on page load
  document.addEventListener('DOMContentLoaded', function() {
    var toolId = new URLSearchParams(location.search).get('shared');
    if (toolId) {
      var toolName = document.querySelector('.tool-page-title');
      if (toolName) {
        TBUtils.addToHistory(toolId, toolName.textContent.trim());
      }
    }
  });
})();