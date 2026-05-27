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
        icon: '📱',
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
        label: 'X (Twitter)',
        icon: '𝕏',
        iconClass: 'icon-twitter',
        action: function() {
          window.open('https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl, '_blank', 'width=550,height=420');
        }
      },
      {
        id: 'facebook',
        label: 'Facebook',
        icon: '📘',
        iconClass: 'icon-facebook',
        action: function() {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl, '_blank', 'width=550,height=420');
        }
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        icon: '💼',
        iconClass: 'icon-linkedin',
        action: function() {
          window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodedUrl, '_blank', 'width=550,height=420');
        }
      },
      {
        id: 'reddit',
        label: 'Reddit',
        icon: '🦅',
        iconClass: 'icon-reddit',
        action: function() {
          window.open('https://reddit.com/submit?url=' + encodedUrl + '&title=' + encodedText, '_blank', 'width=850,height=650');
        }
      },
      {
        id: 'copy',
        label: 'Copy Link',
        icon: '📋',
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
        icon: '✉️',
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