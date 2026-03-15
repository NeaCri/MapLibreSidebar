(function (global) {
  'use strict';

  function resolveElement(target) {
    if (typeof target === 'string') {
      return document.querySelector(target);
    }
    return target || null;
  }

  function emit(target, name, detail) {
    target.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  function hasDisabledParent(link) {
    var li = link.closest('li');
    return !!(li && li.classList.contains('disabled'));
  }

  function normalizePosition(position, container) {
    if (position === 'right') {
      return 'right';
    }
    if (position === 'left') {
      return 'left';
    }
    if (container.classList.contains('sidebar-right')) {
      return 'right';
    }
    return 'left';
  }

  function getPaneIdFromLink(link) {
    var href = link.getAttribute('href') || '';
    if (!href || href.charAt(0) !== '#') {
      return null;
    }
    return href.slice(1);
  }

  function MaplibreSidebar(options) {
    var opts = options || {};
    this.container = resolveElement(opts.container || '#sidebar');

    if (!this.container) {
      throw new Error('MaplibreSidebar: sidebar container not found.');
    }

    this.position = normalizePosition(opts.position, this.container);
    this.map = opts.map || null;
    this.autopan = !!opts.autopan;
    this.collapsedWidth = opts.collapsedWidth || 40;

    this._activePane = null;
    this._tabLinks = Array.prototype.slice.call(
      this.container.querySelectorAll('.sidebar-tabs a[href^="#"]')
    );
    this._panes = Array.prototype.slice.call(
      this.container.querySelectorAll('.sidebar-pane')
    );
    this._closeButtons = Array.prototype.slice.call(
      this.container.querySelectorAll('.sidebar-close')
    );

    this.container.classList.add('sidebar-' + this.position);

    this._bindEvents();
  }

  MaplibreSidebar.prototype._bindEvents = function () {
    var self = this;

    this._tabLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        var paneId = getPaneIdFromLink(link);

        if (!paneId) {
          return;
        }

        event.preventDefault();

        if (hasDisabledParent(link)) {
          return;
        }

        if (self._activePane === paneId && !self.container.classList.contains('collapsed')) {
          self.close();
          return;
        }

        self.open(paneId);
      });
    });

    this._closeButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        self.close();
      });
    });
  };

  MaplibreSidebar.prototype._setActiveClasses = function (paneId) {
    this._panes.forEach(function (pane) {
      pane.classList.toggle('active', pane.id === paneId);
    });

    this._tabLinks.forEach(function (link) {
      var linkPaneId = getPaneIdFromLink(link);
      var li = link.closest('li');
      if (!li) {
        return;
      }
      li.classList.toggle('active', linkPaneId === paneId);
    });
  };

  MaplibreSidebar.prototype._autopan = function () {
    var padding;
    var openWidth;

    if (!this.autopan || !this.map || typeof this.map.easeTo !== 'function') {
      return;
    }

    openWidth = this.container.classList.contains('collapsed')
      ? this.collapsedWidth
      : this.container.offsetWidth;

    padding = { top: 0, right: 0, bottom: 0, left: 0 };
    if (this.position === 'left') {
      padding.left = openWidth;
    } else {
      padding.right = openWidth;
    }

    this.map.easeTo({ padding: padding, duration: 0 });
  };

  MaplibreSidebar.prototype.open = function (paneId) {
    var paneExists = this._panes.some(function (pane) {
      return pane.id === paneId;
    });
    var previousPane = this._activePane;

    if (!paneExists) {
      return false;
    }

    this._setActiveClasses(paneId);
    this.container.classList.remove('collapsed');
    this._activePane = paneId;
    this._autopan();

    emit(this.container, 'maplibreSidebar:open', {
      id: paneId,
      previousId: previousPane
    });

    emit(this.container, 'maplibreSidebar:change', {
      id: paneId,
      previousId: previousPane
    });

    return true;
  };

  MaplibreSidebar.prototype.close = function () {
    var previousPane = this._activePane;

    this._setActiveClasses(null);
    this.container.classList.add('collapsed');
    this._activePane = null;
    this._autopan();

    emit(this.container, 'maplibreSidebar:close', {
      previousId: previousPane
    });

    emit(this.container, 'maplibreSidebar:change', {
      id: null,
      previousId: previousPane
    });
  };

  MaplibreSidebar.prototype.toggle = function (paneId) {
    if (this._activePane === paneId && !this.container.classList.contains('collapsed')) {
      this.close();
      return;
    }
    this.open(paneId);
  };

  MaplibreSidebar.prototype.getActivePane = function () {
    return this._activePane;
  };

  global.MaplibreSidebar = MaplibreSidebar;
})(window);
