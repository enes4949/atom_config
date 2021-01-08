var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _dock = require('./dock');

var _dock2 = _interopRequireDefault(_dock);

var Panel = (function () {
  function Panel() {
    var _this = this;

    _classCallCheck(this, Panel);

    this.panel = null;
    this.element = document.createElement('div');
    this.delegate = new _delegate2['default']();
    this.messages = [];
    this.deactivating = false;
    this.subscriptions = new _atom.CompositeDisposable();
    this.showPanelStateMessages = false;

    this.subscriptions.add(this.delegate);
    this.subscriptions.add(atom.config.observe('linter-ui-default.hidePanelWhenEmpty', function (hidePanelWhenEmpty) {
      _this.hidePanelWhenEmpty = hidePanelWhenEmpty;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPane(function (_ref) {
      var destroyedPane = _ref.pane;

      var isPaneItemDestroyed = destroyedPane.getItems().includes(_this.panel);
      if (isPaneItemDestroyed && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(function (_ref2) {
      var paneItem = _ref2.item;

      if (paneItem instanceof _dock2['default'] && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      _this.showPanelConfig = showPanel;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function () {
      _this.showPanelStateMessages = !!_this.delegate.filteredMessages.length;
      _this.refresh();
    }));
    this.activationTimer = window.requestIdleCallback(function () {
      var firstTime = true;
      var dock = atom.workspace.getBottomDock();
      _this.subscriptions.add(dock.onDidChangeActivePaneItem(function (paneItem) {
        if (!_this.panel || _this.getPanelLocation() !== 'bottom') {
          return;
        }
        if (firstTime) {
          firstTime = false;
          return;
        }
        var isFocusIn = paneItem === _this.panel;
        var externallyToggled = isFocusIn !== _this.showPanelConfig;
        if (externallyToggled) {
          atom.config.set('linter-ui-default.showPanel', !_this.showPanelConfig);
        }
      }));
      _this.subscriptions.add(dock.onDidChangeVisible(function (visible) {
        if (!_this.panel || _this.getPanelLocation() !== 'bottom') {
          return;
        }
        if (!visible) {
          // ^ When it's time to tell config to hide
          if (_this.showPanelConfig && _this.hidePanelWhenEmpty && !_this.showPanelStateMessages) {
            // Ignore because we just don't have any messages to show, everything else is fine
            return;
          }
        }
        if (dock.getActivePaneItem() !== _this.panel) {
          // Ignore since the visibility of this panel is not changing
          return;
        }
        var externallyToggled = visible !== _this.showPanelConfig;
        if (externallyToggled) {
          atom.config.set('linter-ui-default.showPanel', !_this.showPanelConfig);
        }
      }));

      _this.activate();
    });
  }

  _createClass(Panel, [{
    key: 'getPanelLocation',
    value: function getPanelLocation() {
      if (!this.panel) {
        return null;
      }
      var paneContainer = atom.workspace.paneContainerForItem(this.panel);
      return paneContainer && paneContainer.location || null;
    }
  }, {
    key: 'activate',
    value: _asyncToGenerator(function* () {
      if (this.panel) {
        return;
      }
      this.panel = new _dock2['default'](this.delegate);
      yield atom.workspace.open(this.panel, {
        activatePane: false,
        activateItem: false,
        searchAllPanes: true
      });
      this.update();
      this.refresh();
    })
  }, {
    key: 'update',
    value: function update() {
      var newMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (newMessages) {
        this.messages = newMessages;
      }
      this.delegate.update(this.messages);
      this.showPanelStateMessages = !!this.delegate.filteredMessages.length;
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: _asyncToGenerator(function* () {
      var panel = this.panel;
      if (panel === null) {
        if (this.showPanelConfig) {
          yield this.activate();
        }
        return;
      }
      var paneContainer = atom.workspace.paneContainerForItem(panel);
      if (!paneContainer || paneContainer.location !== 'bottom') {
        return;
      }
      var isActivePanel = paneContainer.getActivePaneItem() === panel;
      var visibilityAllowed1 = this.showPanelConfig;
      var visibilityAllowed2 = this.hidePanelWhenEmpty ? this.showPanelStateMessages : true;
      if (visibilityAllowed1 && visibilityAllowed2) {
        if (!isActivePanel) {
          paneContainer.paneForItem(panel).activateItem(panel);
        }
        paneContainer.show();
        panel.doPanelResize();
      } else if (isActivePanel) {
        paneContainer.hide();
      }
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.deactivating = true;
      if (this.panel) {
        this.panel.dispose();
      }
      this.subscriptions.dispose();
      window.cancelIdleCallback(this.activationTimer);
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3dCQUNyQixZQUFZOzs7O29CQUNYLFFBQVE7Ozs7SUFHeEIsS0FBSztBQVdFLFdBWFAsS0FBSyxHQVdLOzs7MEJBWFYsS0FBSzs7QUFZUCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQTs7QUFFbkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsRUFBRSxVQUFBLGtCQUFrQixFQUFJO0FBQ2hGLFlBQUssa0JBQWtCLEdBQUcsa0JBQWtCLENBQUE7QUFDNUMsWUFBSyxPQUFPLEVBQUUsQ0FBQTtLQUNmLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsVUFBQyxJQUF1QixFQUFLO1VBQXBCLGFBQWEsR0FBckIsSUFBdUIsQ0FBckIsSUFBSTs7QUFDckMsVUFBTSxtQkFBbUIsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsUUFB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QUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsWUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtLQUNoRDs7O1NBaktHLEtBQUs7OztBQW9LWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBQYW5lbERvY2sgZnJvbSAnLi9kb2NrJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFBhbmVsIHtcbiAgcGFuZWw6IFBhbmVsRG9jayB8IG51bGxcbiAgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgZGVsZWdhdGU6IERlbGVnYXRlXG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPlxuICBkZWFjdGl2YXRpbmc6IGJvb2xlYW5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBzaG93UGFuZWxDb25maWc6IGJvb2xlYW5cbiAgaGlkZVBhbmVsV2hlbkVtcHR5OiBib29sZWFuXG4gIHNob3dQYW5lbFN0YXRlTWVzc2FnZXM6IGJvb2xlYW5cbiAgYWN0aXZhdGlvblRpbWVyOiBudW1iZXJcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZGVhY3RpdmF0aW5nID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzID0gZmFsc2VcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5kZWxlZ2F0ZSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuaGlkZVBhbmVsV2hlbkVtcHR5JywgaGlkZVBhbmVsV2hlbkVtcHR5ID0+IHtcbiAgICAgICAgdGhpcy5oaWRlUGFuZWxXaGVuRW1wdHkgPSBoaWRlUGFuZWxXaGVuRW1wdHlcbiAgICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZSgoeyBwYW5lOiBkZXN0cm95ZWRQYW5lIH0pID0+IHtcbiAgICAgICAgY29uc3QgaXNQYW5lSXRlbURlc3Ryb3llZCA9IGRlc3Ryb3llZFBhbmUuZ2V0SXRlbXMoKS5pbmNsdWRlcyh0aGlzLnBhbmVsKVxuICAgICAgICBpZiAoaXNQYW5lSXRlbURlc3Ryb3llZCAmJiAhdGhpcy5kZWFjdGl2YXRpbmcpIHtcbiAgICAgICAgICB0aGlzLnBhbmVsID0gbnVsbFxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0oKHsgaXRlbTogcGFuZUl0ZW0gfSkgPT4ge1xuICAgICAgICBpZiAocGFuZUl0ZW0gaW5zdGFuY2VvZiBQYW5lbERvY2sgJiYgIXRoaXMuZGVhY3RpdmF0aW5nKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIGZhbHNlKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIHNob3dQYW5lbCA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1BhbmVsQ29uZmlnID0gc2hvd1BhbmVsXG4gICAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLm9ic2VydmVBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA9ICEhdGhpcy5kZWxlZ2F0ZS5maWx0ZXJlZE1lc3NhZ2VzLmxlbmd0aFxuICAgICAgICB0aGlzLnJlZnJlc2goKVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuYWN0aXZhdGlvblRpbWVyID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgbGV0IGZpcnN0VGltZSA9IHRydWVcbiAgICAgIGNvbnN0IGRvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21Eb2NrKClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGRvY2sub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShwYW5lSXRlbSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnBhbmVsIHx8IHRoaXMuZ2V0UGFuZWxMb2NhdGlvbigpICE9PSAnYm90dG9tJykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNGb2N1c0luID0gcGFuZUl0ZW0gPT09IHRoaXMucGFuZWxcbiAgICAgICAgICBjb25zdCBleHRlcm5hbGx5VG9nZ2xlZCA9IGlzRm9jdXNJbiAhPT0gdGhpcy5zaG93UGFuZWxDb25maWdcbiAgICAgICAgICBpZiAoZXh0ZXJuYWxseVRvZ2dsZWQpIHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgIXRoaXMuc2hvd1BhbmVsQ29uZmlnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICApXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBkb2NrLm9uRGlkQ2hhbmdlVmlzaWJsZSh2aXNpYmxlID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMucGFuZWwgfHwgdGhpcy5nZXRQYW5lbExvY2F0aW9uKCkgIT09ICdib3R0b20nKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCF2aXNpYmxlKSB7XG4gICAgICAgICAgICAvLyBeIFdoZW4gaXQncyB0aW1lIHRvIHRlbGwgY29uZmlnIHRvIGhpZGVcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3dQYW5lbENvbmZpZyAmJiB0aGlzLmhpZGVQYW5lbFdoZW5FbXB0eSAmJiAhdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgIC8vIElnbm9yZSBiZWNhdXNlIHdlIGp1c3QgZG9uJ3QgaGF2ZSBhbnkgbWVzc2FnZXMgdG8gc2hvdywgZXZlcnl0aGluZyBlbHNlIGlzIGZpbmVcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkb2NrLmdldEFjdGl2ZVBhbmVJdGVtKCkgIT09IHRoaXMucGFuZWwpIHtcbiAgICAgICAgICAgIC8vIElnbm9yZSBzaW5jZSB0aGUgdmlzaWJpbGl0eSBvZiB0aGlzIHBhbmVsIGlzIG5vdCBjaGFuZ2luZ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGV4dGVybmFsbHlUb2dnbGVkID0gdmlzaWJsZSAhPT0gdGhpcy5zaG93UGFuZWxDb25maWdcbiAgICAgICAgICBpZiAoZXh0ZXJuYWxseVRvZ2dsZWQpIHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgIXRoaXMuc2hvd1BhbmVsQ29uZmlnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIHRoaXMuYWN0aXZhdGUoKVxuICAgIH0pXG4gIH1cbiAgZ2V0UGFuZWxMb2NhdGlvbigpIHtcbiAgICBpZiAoIXRoaXMucGFuZWwpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIGNvbnN0IHBhbmVDb250YWluZXIgPSBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9ySXRlbSh0aGlzLnBhbmVsKVxuICAgIHJldHVybiAocGFuZUNvbnRhaW5lciAmJiBwYW5lQ29udGFpbmVyLmxvY2F0aW9uKSB8fCBudWxsXG4gIH1cbiAgYXN5bmMgYWN0aXZhdGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnBhbmVsID0gbmV3IFBhbmVsRG9jayh0aGlzLmRlbGVnYXRlKVxuICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5wYW5lbCwge1xuICAgICAgYWN0aXZhdGVQYW5lOiBmYWxzZSxcbiAgICAgIGFjdGl2YXRlSXRlbTogZmFsc2UsXG4gICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZSxcbiAgICB9KVxuICAgIHRoaXMudXBkYXRlKClcbiAgICB0aGlzLnJlZnJlc2goKVxuICB9XG4gIHVwZGF0ZShuZXdNZXNzYWdlczogP0FycmF5PExpbnRlck1lc3NhZ2U+ID0gbnVsbCk6IHZvaWQge1xuICAgIGlmIChuZXdNZXNzYWdlcykge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IG5ld01lc3NhZ2VzXG4gICAgfVxuICAgIHRoaXMuZGVsZWdhdGUudXBkYXRlKHRoaXMubWVzc2FnZXMpXG4gICAgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzID0gISF0aGlzLmRlbGVnYXRlLmZpbHRlcmVkTWVzc2FnZXMubGVuZ3RoXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgfVxuICBhc3luYyByZWZyZXNoKCkge1xuICAgIGNvbnN0IHBhbmVsID0gdGhpcy5wYW5lbFxuICAgIGlmIChwYW5lbCA9PT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuc2hvd1BhbmVsQ29uZmlnKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWN0aXZhdGUoKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHBhbmVDb250YWluZXIgPSBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9ySXRlbShwYW5lbClcbiAgICBpZiAoIXBhbmVDb250YWluZXIgfHwgcGFuZUNvbnRhaW5lci5sb2NhdGlvbiAhPT0gJ2JvdHRvbScpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBpc0FjdGl2ZVBhbmVsID0gcGFuZUNvbnRhaW5lci5nZXRBY3RpdmVQYW5lSXRlbSgpID09PSBwYW5lbFxuICAgIGNvbnN0IHZpc2liaWxpdHlBbGxvd2VkMSA9IHRoaXMuc2hvd1BhbmVsQ29uZmlnXG4gICAgY29uc3QgdmlzaWJpbGl0eUFsbG93ZWQyID0gdGhpcy5oaWRlUGFuZWxXaGVuRW1wdHkgPyB0aGlzLnNob3dQYW5lbFN0YXRlTWVzc2FnZXMgOiB0cnVlXG4gICAgaWYgKHZpc2liaWxpdHlBbGxvd2VkMSAmJiB2aXNpYmlsaXR5QWxsb3dlZDIpIHtcbiAgICAgIGlmICghaXNBY3RpdmVQYW5lbCkge1xuICAgICAgICBwYW5lQ29udGFpbmVyLnBhbmVGb3JJdGVtKHBhbmVsKS5hY3RpdmF0ZUl0ZW0ocGFuZWwpXG4gICAgICB9XG4gICAgICBwYW5lQ29udGFpbmVyLnNob3coKVxuICAgICAgcGFuZWwuZG9QYW5lbFJlc2l6ZSgpXG4gICAgfSBlbHNlIGlmIChpc0FjdGl2ZVBhbmVsKSB7XG4gICAgICBwYW5lQ29udGFpbmVyLmhpZGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZGVhY3RpdmF0aW5nID0gdHJ1ZVxuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayh0aGlzLmFjdGl2YXRpb25UaW1lcilcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsXG4iXX0=