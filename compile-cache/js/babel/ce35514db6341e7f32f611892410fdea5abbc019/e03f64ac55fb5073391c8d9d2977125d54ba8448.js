Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _atom = require('atom');

var _xtermAddonFit = require('xterm-addon-fit');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _themeMatcher = require('./theme-matcher');

var _themeMatcher2 = _interopRequireDefault(_themeMatcher);

var TERMINAL_PADDING = 5;

var TerminalView = (function () {
  function TerminalView(session) {
    _classCallCheck(this, TerminalView);

    this.disposables = new _atom.CompositeDisposable();
    this.session = session;

    // Load the Fit Addon
    this.fitAddon = new _xtermAddonFit.FitAddon();
    this.session.xterm.loadAddon(this.fitAddon);
    this.disposables.add(this.fitAddon);

    //
    // Observe the Session to know when it is destroyed so that we can
    // clean up our state (i.e. remove event observers).
    //
    this.session.onDidDestroy(this.destroy.bind(this));

    // TODO: Documentation says this should be set for Atom... Research!
    _etch2['default'].setScheduler(atom.views);
    _etch2['default'].initialize(this);

    this.observeResizeEvents();
  }

  _createClass(TerminalView, [{
    key: 'render',
    value: function render() {
      // TODO: Convert to <div class="terminal-view">
      return _etch2['default'].dom('terminal-view', { attributes: { tabindex: -1 }, on: { focus: this.didFocus } });
    }
  }, {
    key: 'update',
    value: function update() {
      return _etch2['default'].update(this);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.resizeObserver.disconnect();
      this.disposables.dispose();
      _etch2['default'].destroy(this);
    }

    //
    // Attach the Xterm instance from the session to this view's element, then
    // focus and resize it to fit its viewport.
    //
  }, {
    key: 'openTerminal',
    value: function openTerminal() {
      this.session.xterm.open(this.element);
      this.session.xterm.focus();

      this.observeAndApplyThemeStyles();
      this.observeAndApplyTypeSettings();
    }

    //
    // Observe for resize events so that we can instruct the Xterm instance
    // to recalculate rows and columns to fit into its viewport when it
    // changes.
    //
  }, {
    key: 'observeResizeEvents',
    value: function observeResizeEvents() {
      this.resizeObserver = new ResizeObserver(this.didResize.bind(this));
      this.resizeObserver.observe(this.element);
    }
  }, {
    key: 'resizeTerminalToFitContainer',
    value: function resizeTerminalToFitContainer() {
      if (!this.session && !this.session.pty && !this.session.xterm) {
        return;
      }

      // Set padding and resize the terminal to fit its container (as best as possible)
      this.session.xterm.element.style.padding = TERMINAL_PADDING + 'px';
      try {
        this.fitAddon.fit();
      } catch (error) {} // TODO: Yuck

      // Check the new size and add additional padding to the top of the
      // terminal so that it fills all available space.
      // TODO: Extract this into a new calculatePadding() or something...
      var elementStyles = getComputedStyle(this.element);
      var xtermElementStyles = getComputedStyle(this.session.xterm.element);
      var elementHeight = parseInt(elementStyles.height, 10);
      var xtermHeight = parseInt(xtermElementStyles.height, 10);
      var newHeight = elementHeight - xtermHeight + TERMINAL_PADDING;

      if (!isNaN(newHeight)) {
        this.fitAddon.fit();
        this.session.xterm.element.style.paddingBottom = newHeight + 'px';
      }

      // Update Pseudoterminal Process w/New Dimensions
      this.session.pty.resize(this.session.xterm.cols, this.session.xterm.rows);
    }

    //
    // Resizes the terminal instance to fit its parent container. Once the new
    // dimensions are established, the calculated columns and rows are passed to
    // the pseudoterminal (pty) to remain consistent.
    //
  }, {
    key: 'didResize',
    value: function didResize() {
      if (!this.session.xterm.element) {
        this.openTerminal();
      }

      this.resizeTerminalToFitContainer();
    }

    //
    // Transfer focus to the Xterm instance when the element is focused. When
    // switching between tabs, Atom will send a focus event to the element,
    // which makes it easy for us to delegate focus to the Xterm instance, whose
    // element we are managing in our view.
    //
  }, {
    key: 'didFocus',
    value: function didFocus() /* event */{
      this.session.xterm.focus();
    }

    //
    // Observe for changes to the matchTheme configuration directive and apply
    // the styles when the value changes. This will also apply them when called
    // for the first time.
    //
  }, {
    key: 'observeAndApplyThemeStyles',
    value: function observeAndApplyThemeStyles() {
      if (this.isObservingThemeSettings) return;
      this.disposables.add(atom.config.onDidChange('terminal-tab.matchTheme', this.applyThemeStyles.bind(this)));
      this.disposables.add(atom.themes.onDidChangeActiveThemes(this.applyThemeStyles.bind(this)));
      this.isObservingThemeSettings = true;
      this.applyThemeStyles();
    }

    //
    // Observe for changes to the Editor configuration for Atom and apply
    // the type settings when the values we are interested in change. This
    // will also apply them when called for the first time.
    //
  }, {
    key: 'observeAndApplyTypeSettings',
    value: function observeAndApplyTypeSettings() {
      if (this.isObservingTypeSettings) return;
      this.disposables.add(atom.config.onDidChange('terminal-tab.fontFamily', this.applyTypeSettings.bind(this)));
      this.disposables.add(atom.config.onDidChange('editor.fontFamily', this.applyTypeSettings.bind(this)));
      this.disposables.add(atom.config.onDidChange('editor.fontSize', this.applyTypeSettings.bind(this)));
      this.disposables.add(atom.config.onDidChange('editor.lineHeight', this.applyTypeSettings.bind(this)));
      this.isObservingTypeSettings = true;
      this.applyTypeSettings();
    }

    //
    // Attempts to match the Xterm instance with the current Atom theme colors.
    //
    // TODO: This should take advantage of update()
    // TODO: This doesn't undo the font settings when the theme is disabled...
    //
  }, {
    key: 'applyThemeStyles',
    value: function applyThemeStyles() {

      // Bail out if the user has not requested to match the theme styles
      if (!atom.config.get('terminal-tab.matchTheme')) {
        this.session.xterm.setOption('theme', {});
        return;
      }

      // Parse the Atom theme styles and configure the Xterm to match.
      var themeStyles = _themeMatcher2['default'].parseThemeStyles();
      this.session.xterm.setOption('theme', themeStyles);
    }

    //
    // Attempts to match the Atom type settings (font family, size and line height) with
    // Xterm.
    //
  }, {
    key: 'applyTypeSettings',
    value: function applyTypeSettings() {

      //
      // Set the font family in Xterm to match Atom.
      //
      var fontFamily = atom.config.get('terminal-tab.fontFamily') || atom.config.get('editor.fontFamily') || 'Menlo, Consolas, "DejaVu Sans Mono", monospace'; // Atom default (as of 1.25.0)
      this.session.xterm.setOption('fontFamily', fontFamily);

      //
      // Set the font size in Xterm to match Atom.
      //
      var fontSize = atom.config.get('editor.fontSize');
      this.session.xterm.setOption('fontSize', fontSize);

      //
      // Set the line height in Xterm to match Atom.
      //
      // TODO: This is disabled, because the line height as specified in
      //       Atom is not the same as what Xterm is using to render its
      //       lines (i.e. 1.5 in Atom is more like 2x in Xterm). Need to
      //       figure out the correct conversion or fix the bug, if there
      //       is one.
      //
      // const lineHeight = atom.config.get('editor.lineHeight');
      // this.session.xterm.setOption('lineHeight', lineHeight);

      //
      // Changing the font size and/or line height requires that we
      // recalcuate the size of the Xterm instance.
      //
      // TODO: Call the renamed method (i.e. resizeTerminalToFitContainer())
      //
      this.didResize();
    }
  }]);

  return TerminalView;
})();

exports['default'] = TerminalView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC10YWIvbGliL3Rlcm1pbmFsLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7NkJBQ2pCLGlCQUFpQjs7b0JBQ3pCLE1BQU07Ozs7NEJBQ0UsaUJBQWlCOzs7O0FBRTFDLElBQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDOztJQUVOLFlBQVk7QUFFcEIsV0FGUSxZQUFZLENBRW5CLE9BQU8sRUFBRTswQkFGRixZQUFZOztBQUc3QixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFDO0FBQzdDLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7QUFHdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyw2QkFBYyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7QUFNcEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O0FBR25ELHNCQUFLLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV0QixRQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztHQUM1Qjs7ZUF0QmtCLFlBQVk7O1dBd0J6QixrQkFBRzs7QUFFUCxhQUNFLHlDQUFlLFVBQVUsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBQyxBQUFDLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUMsQUFBQyxHQUFHLENBQ3pFO0tBQ0g7OztXQUVL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bWluYWwtdGFiL2xpYi90ZXJtaW5hbC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgRml0QWRkb24gfSBmcm9tICd4dGVybS1hZGRvbi1maXQnO1xuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCc7XG5pbXBvcnQgVGhlbWVNYXRjaGVyIGZyb20gJy4vdGhlbWUtbWF0Y2hlcic7XG5cbmNvbnN0IFRFUk1JTkFMX1BBRERJTkcgPSA1O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJtaW5hbFZpZXcge1xuXG4gIGNvbnN0cnVjdG9yKHNlc3Npb24pIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnNlc3Npb24gPSBzZXNzaW9uO1xuXG4gICAgLy8gTG9hZCB0aGUgRml0IEFkZG9uXG4gICAgdGhpcy5maXRBZGRvbiA9IG5ldyBGaXRBZGRvbigpO1xuICAgIHRoaXMuc2Vzc2lvbi54dGVybS5sb2FkQWRkb24odGhpcy5maXRBZGRvbik7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5maXRBZGRvbik7XG5cbiAgICAvL1xuICAgIC8vIE9ic2VydmUgdGhlIFNlc3Npb24gdG8ga25vdyB3aGVuIGl0IGlzIGRlc3Ryb3llZCBzbyB0aGF0IHdlIGNhblxuICAgIC8vIGNsZWFuIHVwIG91ciBzdGF0ZSAoaS5lLiByZW1vdmUgZXZlbnQgb2JzZXJ2ZXJzKS5cbiAgICAvL1xuICAgIHRoaXMuc2Vzc2lvbi5vbkRpZERlc3Ryb3kodGhpcy5kZXN0cm95LmJpbmQodGhpcykpO1xuXG4gICAgLy8gVE9ETzogRG9jdW1lbnRhdGlvbiBzYXlzIHRoaXMgc2hvdWxkIGJlIHNldCBmb3IgQXRvbS4uLiBSZXNlYXJjaCFcbiAgICBldGNoLnNldFNjaGVkdWxlcihhdG9tLnZpZXdzKTtcbiAgICBldGNoLmluaXRpYWxpemUodGhpcyk7XG5cbiAgICB0aGlzLm9ic2VydmVSZXNpemVFdmVudHMoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBUT0RPOiBDb252ZXJ0IHRvIDxkaXYgY2xhc3M9XCJ0ZXJtaW5hbC12aWV3XCI+XG4gICAgcmV0dXJuIChcbiAgICAgIDx0ZXJtaW5hbC12aWV3IGF0dHJpYnV0ZXM9e3t0YWJpbmRleDogLTF9fSBvbj17e2ZvY3VzOiB0aGlzLmRpZEZvY3VzfX0gLz5cbiAgICApO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZXNpemVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gICAgZXRjaC5kZXN0cm95KHRoaXMpO1xuICB9XG5cbiAgLy9cbiAgLy8gQXR0YWNoIHRoZSBYdGVybSBpbnN0YW5jZSBmcm9tIHRoZSBzZXNzaW9uIHRvIHRoaXMgdmlldydzIGVsZW1lbnQsIHRoZW5cbiAgLy8gZm9jdXMgYW5kIHJlc2l6ZSBpdCB0byBmaXQgaXRzIHZpZXdwb3J0LlxuICAvL1xuICBvcGVuVGVybWluYWwoKSB7XG4gICAgdGhpcy5zZXNzaW9uLnh0ZXJtLm9wZW4odGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnNlc3Npb24ueHRlcm0uZm9jdXMoKTtcblxuICAgIHRoaXMub2JzZXJ2ZUFuZEFwcGx5VGhlbWVTdHlsZXMoKTtcbiAgICB0aGlzLm9ic2VydmVBbmRBcHBseVR5cGVTZXR0aW5ncygpO1xuICB9XG5cbiAgLy9cbiAgLy8gT2JzZXJ2ZSBmb3IgcmVzaXplIGV2ZW50cyBzbyB0aGF0IHdlIGNhbiBpbnN0cnVjdCB0aGUgWHRlcm0gaW5zdGFuY2VcbiAgLy8gdG8gcmVjYWxjdWxhdGUgcm93cyBhbmQgY29sdW1ucyB0byBmaXQgaW50byBpdHMgdmlld3BvcnQgd2hlbiBpdFxuICAvLyBjaGFuZ2VzLlxuICAvL1xuICBvYnNlcnZlUmVzaXplRXZlbnRzKCkge1xuICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIodGhpcy5kaWRSZXNpemUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCk7XG4gIH1cblxuICByZXNpemVUZXJtaW5hbFRvRml0Q29udGFpbmVyKCkge1xuICAgIGlmICghdGhpcy5zZXNzaW9uICYmICF0aGlzLnNlc3Npb24ucHR5ICYmICF0aGlzLnNlc3Npb24ueHRlcm0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTZXQgcGFkZGluZyBhbmQgcmVzaXplIHRoZSB0ZXJtaW5hbCB0byBmaXQgaXRzIGNvbnRhaW5lciAoYXMgYmVzdCBhcyBwb3NzaWJsZSlcbiAgICB0aGlzLnNlc3Npb24ueHRlcm0uZWxlbWVudC5zdHlsZS5wYWRkaW5nID0gYCR7VEVSTUlOQUxfUEFERElOR31weGA7XG4gICAgdHJ5IHsgdGhpcy5maXRBZGRvbi5maXQoKX0gY2F0Y2goZXJyb3IpIHsgfSAvLyBUT0RPOiBZdWNrXG5cbiAgICAvLyBDaGVjayB0aGUgbmV3IHNpemUgYW5kIGFkZCBhZGRpdGlvbmFsIHBhZGRpbmcgdG8gdGhlIHRvcCBvZiB0aGVcbiAgICAvLyB0ZXJtaW5hbCBzbyB0aGF0IGl0IGZpbGxzIGFsbCBhdmFpbGFibGUgc3BhY2UuXG4gICAgLy8gVE9ETzogRXh0cmFjdCB0aGlzIGludG8gYSBuZXcgY2FsY3VsYXRlUGFkZGluZygpIG9yIHNvbWV0aGluZy4uLlxuICAgIGNvbnN0IGVsZW1lbnRTdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCk7XG4gICAgY29uc3QgeHRlcm1FbGVtZW50U3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnNlc3Npb24ueHRlcm0uZWxlbWVudCk7XG4gICAgY29uc3QgZWxlbWVudEhlaWdodCA9IHBhcnNlSW50KGVsZW1lbnRTdHlsZXMuaGVpZ2h0LCAxMCk7XG4gICAgY29uc3QgeHRlcm1IZWlnaHQgPSBwYXJzZUludCh4dGVybUVsZW1lbnRTdHlsZXMuaGVpZ2h0LCAxMCk7XG4gICAgY29uc3QgbmV3SGVpZ2h0ID0gZWxlbWVudEhlaWdodCAtIHh0ZXJtSGVpZ2h0ICsgVEVSTUlOQUxfUEFERElORztcblxuICAgIGlmICghaXNOYU4obmV3SGVpZ2h0KSkge1xuICAgICAgdGhpcy5maXRBZGRvbi5maXQoKTtcbiAgICAgIHRoaXMuc2Vzc2lvbi54dGVybS5lbGVtZW50LnN0eWxlLnBhZGRpbmdCb3R0b20gPSBgJHtuZXdIZWlnaHR9cHhgO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBQc2V1ZG90ZXJtaW5hbCBQcm9jZXNzIHcvTmV3IERpbWVuc2lvbnNcbiAgICB0aGlzLnNlc3Npb24ucHR5LnJlc2l6ZSh0aGlzLnNlc3Npb24ueHRlcm0uY29scywgdGhpcy5zZXNzaW9uLnh0ZXJtLnJvd3MpO1xuICB9XG5cbiAgLy9cbiAgLy8gUmVzaXplcyB0aGUgdGVybWluYWwgaW5zdGFuY2UgdG8gZml0IGl0cyBwYXJlbnQgY29udGFpbmVyLiBPbmNlIHRoZSBuZXdcbiAgLy8gZGltZW5zaW9ucyBhcmUgZXN0YWJsaXNoZWQsIHRoZSBjYWxjdWxhdGVkIGNvbHVtbnMgYW5kIHJvd3MgYXJlIHBhc3NlZCB0b1xuICAvLyB0aGUgcHNldWRvdGVybWluYWwgKHB0eSkgdG8gcmVtYWluIGNvbnNpc3RlbnQuXG4gIC8vXG4gIGRpZFJlc2l6ZSgpIHtcbiAgICBpZiAoIXRoaXMuc2Vzc2lvbi54dGVybS5lbGVtZW50KSB7XG4gICAgICB0aGlzLm9wZW5UZXJtaW5hbCgpO1xuICAgIH1cblxuICAgIHRoaXMucmVzaXplVGVybWluYWxUb0ZpdENvbnRhaW5lcigpO1xuICB9XG5cbiAgLy9cbiAgLy8gVHJhbnNmZXIgZm9jdXMgdG8gdGhlIFh0ZXJtIGluc3RhbmNlIHdoZW4gdGhlIGVsZW1lbnQgaXMgZm9jdXNlZC4gV2hlblxuICAvLyBzd2l0Y2hpbmcgYmV0d2VlbiB0YWJzLCBBdG9tIHdpbGwgc2VuZCBhIGZvY3VzIGV2ZW50IHRvIHRoZSBlbGVtZW50LFxuICAvLyB3aGljaCBtYWtlcyBpdCBlYXN5IGZvciB1cyB0byBkZWxlZ2F0ZSBmb2N1cyB0byB0aGUgWHRlcm0gaW5zdGFuY2UsIHdob3NlXG4gIC8vIGVsZW1lbnQgd2UgYXJlIG1hbmFnaW5nIGluIG91ciB2aWV3LlxuICAvL1xuICBkaWRGb2N1cygvKiBldmVudCAqLykge1xuICAgIHRoaXMuc2Vzc2lvbi54dGVybS5mb2N1cygpO1xuICB9XG5cbiAgLy9cbiAgLy8gT2JzZXJ2ZSBmb3IgY2hhbmdlcyB0byB0aGUgbWF0Y2hUaGVtZSBjb25maWd1cmF0aW9uIGRpcmVjdGl2ZSBhbmQgYXBwbHlcbiAgLy8gdGhlIHN0eWxlcyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLiBUaGlzIHdpbGwgYWxzbyBhcHBseSB0aGVtIHdoZW4gY2FsbGVkXG4gIC8vIGZvciB0aGUgZmlyc3QgdGltZS5cbiAgLy9cbiAgb2JzZXJ2ZUFuZEFwcGx5VGhlbWVTdHlsZXMoKSB7XG4gICAgaWYgKHRoaXMuaXNPYnNlcnZpbmdUaGVtZVNldHRpbmdzKSByZXR1cm47XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3Rlcm1pbmFsLXRhYi5tYXRjaFRoZW1lJywgdGhpcy5hcHBseVRoZW1lU3R5bGVzLmJpbmQodGhpcykpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLnRoZW1lcy5vbkRpZENoYW5nZUFjdGl2ZVRoZW1lcyh0aGlzLmFwcGx5VGhlbWVTdHlsZXMuYmluZCh0aGlzKSkpO1xuICAgIHRoaXMuaXNPYnNlcnZpbmdUaGVtZVNldHRpbmdzID0gdHJ1ZTtcbiAgICB0aGlzLmFwcGx5VGhlbWVTdHlsZXMoKTtcbiAgfVxuXG4gIC8vXG4gIC8vIE9ic2VydmUgZm9yIGNoYW5nZXMgdG8gdGhlIEVkaXRvciBjb25maWd1cmF0aW9uIGZvciBBdG9tIGFuZCBhcHBseVxuICAvLyB0aGUgdHlwZSBzZXR0aW5ncyB3aGVuIHRoZSB2YWx1ZXMgd2UgYXJlIGludGVyZXN0ZWQgaW4gY2hhbmdlLiBUaGlzXG4gIC8vIHdpbGwgYWxzbyBhcHBseSB0aGVtIHdoZW4gY2FsbGVkIGZvciB0aGUgZmlyc3QgdGltZS5cbiAgLy9cbiAgb2JzZXJ2ZUFuZEFwcGx5VHlwZVNldHRpbmdzKCkge1xuICAgIGlmICh0aGlzLmlzT2JzZXJ2aW5nVHlwZVNldHRpbmdzKSByZXR1cm47XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3Rlcm1pbmFsLXRhYi5mb250RmFtaWx5JywgdGhpcy5hcHBseVR5cGVTZXR0aW5ncy5iaW5kKHRoaXMpKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2VkaXRvci5mb250RmFtaWx5JywgdGhpcy5hcHBseVR5cGVTZXR0aW5ncy5iaW5kKHRoaXMpKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2VkaXRvci5mb250U2l6ZScsIHRoaXMuYXBwbHlUeXBlU2V0dGluZ3MuYmluZCh0aGlzKSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdlZGl0b3IubGluZUhlaWdodCcsIHRoaXMuYXBwbHlUeXBlU2V0dGluZ3MuYmluZCh0aGlzKSkpO1xuICAgIHRoaXMuaXNPYnNlcnZpbmdUeXBlU2V0dGluZ3MgPSB0cnVlO1xuICAgIHRoaXMuYXBwbHlUeXBlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIC8vXG4gIC8vIEF0dGVtcHRzIHRvIG1hdGNoIHRoZSBYdGVybSBpbnN0YW5jZSB3aXRoIHRoZSBjdXJyZW50IEF0b20gdGhlbWUgY29sb3JzLlxuICAvL1xuICAvLyBUT0RPOiBUaGlzIHNob3VsZCB0YWtlIGFkdmFudGFnZSBvZiB1cGRhdGUoKVxuICAvLyBUT0RPOiBUaGlzIGRvZXNuJ3QgdW5kbyB0aGUgZm9udCBzZXR0aW5ncyB3aGVuIHRoZSB0aGVtZSBpcyBkaXNhYmxlZC4uLlxuICAvL1xuICBhcHBseVRoZW1lU3R5bGVzKCkge1xuXG4gICAgLy8gQmFpbCBvdXQgaWYgdGhlIHVzZXIgaGFzIG5vdCByZXF1ZXN0ZWQgdG8gbWF0Y2ggdGhlIHRoZW1lIHN0eWxlc1xuICAgIGlmICghYXRvbS5jb25maWcuZ2V0KCd0ZXJtaW5hbC10YWIubWF0Y2hUaGVtZScpKSB7XG4gICAgICB0aGlzLnNlc3Npb24ueHRlcm0uc2V0T3B0aW9uKCd0aGVtZScsIHt9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBQYXJzZSB0aGUgQXRvbSB0aGVtZSBzdHlsZXMgYW5kIGNvbmZpZ3VyZSB0aGUgWHRlcm0gdG8gbWF0Y2guXG4gICAgY29uc3QgdGhlbWVTdHlsZXMgPSBUaGVtZU1hdGNoZXIucGFyc2VUaGVtZVN0eWxlcygpO1xuICAgIHRoaXMuc2Vzc2lvbi54dGVybS5zZXRPcHRpb24oJ3RoZW1lJywgdGhlbWVTdHlsZXMpO1xuXG4gIH1cblxuICAvL1xuICAvLyBBdHRlbXB0cyB0byBtYXRjaCB0aGUgQXRvbSB0eXBlIHNldHRpbmdzIChmb250IGZhbWlseSwgc2l6ZSBhbmQgbGluZSBoZWlnaHQpIHdpdGhcbiAgLy8gWHRlcm0uXG4gIC8vXG4gIGFwcGx5VHlwZVNldHRpbmdzKCkge1xuXG4gICAgLy9cbiAgICAvLyBTZXQgdGhlIGZvbnQgZmFtaWx5IGluIFh0ZXJtIHRvIG1hdGNoIEF0b20uXG4gICAgLy9cbiAgICBjb25zdCBmb250RmFtaWx5ID0gYXRvbS5jb25maWcuZ2V0KCd0ZXJtaW5hbC10YWIuZm9udEZhbWlseScpXG4gICAgICB8fCBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5mb250RmFtaWx5JylcbiAgICAgIHx8ICdNZW5sbywgQ29uc29sYXMsIFwiRGVqYVZ1IFNhbnMgTW9ub1wiLCBtb25vc3BhY2UnOyAvLyBBdG9tIGRlZmF1bHQgKGFzIG9mIDEuMjUuMClcbiAgICB0aGlzLnNlc3Npb24ueHRlcm0uc2V0T3B0aW9uKCdmb250RmFtaWx5JywgZm9udEZhbWlseSk7XG5cbiAgICAvL1xuICAgIC8vIFNldCB0aGUgZm9udCBzaXplIGluIFh0ZXJtIHRvIG1hdGNoIEF0b20uXG4gICAgLy9cbiAgICBjb25zdCBmb250U2l6ZSA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLmZvbnRTaXplJyk7XG4gICAgdGhpcy5zZXNzaW9uLnh0ZXJtLnNldE9wdGlvbignZm9udFNpemUnLCBmb250U2l6ZSk7XG5cbiAgICAvL1xuICAgIC8vIFNldCB0aGUgbGluZSBoZWlnaHQgaW4gWHRlcm0gdG8gbWF0Y2ggQXRvbS5cbiAgICAvL1xuICAgIC8vIFRPRE86IFRoaXMgaXMgZGlzYWJsZWQsIGJlY2F1c2UgdGhlIGxpbmUgaGVpZ2h0IGFzIHNwZWNpZmllZCBpblxuICAgIC8vICAgICAgIEF0b20gaXMgbm90IHRoZSBzYW1lIGFzIHdoYXQgWHRlcm0gaXMgdXNpbmcgdG8gcmVuZGVyIGl0c1xuICAgIC8vICAgICAgIGxpbmVzIChpLmUuIDEuNSBpbiBBdG9tIGlzIG1vcmUgbGlrZSAyeCBpbiBYdGVybSkuIE5lZWQgdG9cbiAgICAvLyAgICAgICBmaWd1cmUgb3V0IHRoZSBjb3JyZWN0IGNvbnZlcnNpb24gb3IgZml4IHRoZSBidWcsIGlmIHRoZXJlXG4gICAgLy8gICAgICAgaXMgb25lLlxuICAgIC8vXG4gICAgLy8gY29uc3QgbGluZUhlaWdodCA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLmxpbmVIZWlnaHQnKTtcbiAgICAvLyB0aGlzLnNlc3Npb24ueHRlcm0uc2V0T3B0aW9uKCdsaW5lSGVpZ2h0JywgbGluZUhlaWdodCk7XG5cbiAgICAvL1xuICAgIC8vIENoYW5naW5nIHRoZSBmb250IHNpemUgYW5kL29yIGxpbmUgaGVpZ2h0IHJlcXVpcmVzIHRoYXQgd2VcbiAgICAvLyByZWNhbGN1YXRlIHRoZSBzaXplIG9mIHRoZSBYdGVybSBpbnN0YW5jZS5cbiAgICAvL1xuICAgIC8vIFRPRE86IENhbGwgdGhlIHJlbmFtZWQgbWV0aG9kIChpLmUuIHJlc2l6ZVRlcm1pbmFsVG9GaXRDb250YWluZXIoKSlcbiAgICAvL1xuICAgIHRoaXMuZGlkUmVzaXplKCk7XG5cbiAgfVxuXG59XG4iXX0=