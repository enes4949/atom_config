(function() {
  var $, CompositeDisposable, StatusBar, StatusIcon, TerminalPlusView, View, path, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

  TerminalPlusView = require('./view');

  StatusIcon = require('./status-icon');

  path = require('path');

  module.exports = StatusBar = (function(superClass) {
    extend(StatusBar, superClass);

    function StatusBar() {
      this.moveTerminalView = bind(this.moveTerminalView, this);
      this.onDropTabBar = bind(this.onDropTabBar, this);
      this.onDrop = bind(this.onDrop, this);
      this.onDragOver = bind(this.onDragOver, this);
      this.onDragEnd = bind(this.onDragEnd, this);
      this.onDragLeave = bind(this.onDragLeave, this);
      this.onDragStart = bind(this.onDragStart, this);
      this.closeAll = bind(this.closeAll, this);
      return StatusBar.__super__.constructor.apply(this, arguments);
    }

    StatusBar.prototype.terminalViews = [];

    StatusBar.prototype.activeTerminal = null;

    StatusBar.prototype.returnFocus = null;

    StatusBar.content = function() {
      return this.div({
        "class": 'terminal-plus status-bar',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.i({
            "class": "icon icon-plus",
            click: 'newTerminalView',
            outlet: 'plusBtn'
          });
          _this.ul({
            "class": "list-inline status-container",
            tabindex: '-1',
            outlet: 'statusContainer',
            is: 'space-pen-ul'
          });
          return _this.i({
            "class": "icon icon-x",
            click: 'closeAll',
            outlet: 'closeBtn'
          });
        };
      })(this));
    };

    StatusBar.prototype.initialize = function() {
      var handleBlur, handleFocus;
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'terminal-plus:new': (function(_this) {
          return function() {
            return _this.newTerminalView();
          };
        })(this),
        'terminal-plus:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'terminal-plus:next': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activeNextTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'terminal-plus:prev': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activePrevTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'terminal-plus:close': (function(_this) {
          return function() {
            return _this.destroyActiveTerm();
          };
        })(this),
        'terminal-plus:close-all': (function(_this) {
          return function() {
            return _this.closeAll();
          };
        })(this),
        'terminal-plus:rename': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.rename();
            });
          };
        })(this),
        'terminal-plus:insert-selected-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection();
            });
          };
        })(this),
        'terminal-plus:insert-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.inputDialog();
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('.xterm', {
        'terminal-plus:paste': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.paste();
            });
          };
        })(this),
        'terminal-plus:copy': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.copy();
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          var mapping, nextTerminal, prevTerminal;
          if (item == null) {
            return;
          }
          if (item.constructor.name === "TerminalPlusView") {
            return setTimeout(item.focus, 100);
          } else if (item.constructor.name === "TextEditor") {
            mapping = atom.config.get('terminal-plus.core.mapTerminalsTo');
            if (mapping === 'None') {
              return;
            }
            switch (mapping) {
              case 'File':
                nextTerminal = _this.getTerminalById(item.getPath(), function(view) {
                  return view.getId().filePath;
                });
                break;
              case 'Folder':
                nextTerminal = _this.getTerminalById(path.dirname(item.getPath()), function(view) {
                  return view.getId().folderPath;
                });
            }
            prevTerminal = _this.getActiveTerminalView();
            if (prevTerminal !== nextTerminal) {
              if (nextTerminal == null) {
                if (item.getTitle() !== 'untitled') {
                  if (atom.config.get('terminal-plus.core.mapTerminalsToAutoOpen')) {
                    return nextTerminal = _this.createTerminalView();
                  }
                }
              } else {
                _this.setActiveTerminalView(nextTerminal);
                if (prevTerminal != null ? prevTerminal.panel.isVisible() : void 0) {
                  return nextTerminal.toggle();
                }
              }
            }
          }
        };
      })(this)));
      this.registerContextMenu();
      this.subscriptions.add(atom.tooltips.add(this.plusBtn, {
        title: 'New Terminal'
      }));
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close All'
      }));
      this.statusContainer.on('dblclick', (function(_this) {
        return function(event) {
          if (event.target === event.delegateTarget) {
            return _this.newTerminalView();
          }
        };
      })(this));
      this.statusContainer.on('dragstart', '.status-icon', this.onDragStart);
      this.statusContainer.on('dragend', '.status-icon', this.onDragEnd);
      this.statusContainer.on('dragleave', this.onDragLeave);
      this.statusContainer.on('dragover', this.onDragOver);
      this.statusContainer.on('drop', this.onDrop);
      handleBlur = (function(_this) {
        return function() {
          var terminal;
          if (terminal = TerminalPlusView.getFocusedTerminal()) {
            _this.returnFocus = _this.terminalViewForTerminal(terminal);
            return terminal.blur();
          }
        };
      })(this);
      handleFocus = (function(_this) {
        return function() {
          if (_this.returnFocus) {
            return setTimeout(function() {
              _this.returnFocus.focus();
              return _this.returnFocus = null;
            }, 100);
          }
        };
      })(this);
      window.addEventListener('blur', handleBlur);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('blur', handleBlur);
        }
      });
      window.addEventListener('focus', handleFocus);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('focus', handleFocus);
        }
      });
      return this.attach();
    };

    StatusBar.prototype.registerContextMenu = function() {
      return this.subscriptions.add(atom.commands.add('.terminal-plus.status-bar', {
        'terminal-plus:status-red': this.setStatusColor,
        'terminal-plus:status-orange': this.setStatusColor,
        'terminal-plus:status-yellow': this.setStatusColor,
        'terminal-plus:status-green': this.setStatusColor,
        'terminal-plus:status-blue': this.setStatusColor,
        'terminal-plus:status-purple': this.setStatusColor,
        'terminal-plus:status-pink': this.setStatusColor,
        'terminal-plus:status-cyan': this.setStatusColor,
        'terminal-plus:status-magenta': this.setStatusColor,
        'terminal-plus:status-default': this.clearStatusColor,
        'terminal-plus:context-close': function(event) {
          return $(event.target).closest('.status-icon')[0].terminalView.destroy();
        },
        'terminal-plus:context-hide': function(event) {
          var statusIcon;
          statusIcon = $(event.target).closest('.status-icon')[0];
          if (statusIcon.isActive()) {
            return statusIcon.terminalView.hide();
          }
        },
        'terminal-plus:context-rename': function(event) {
          return $(event.target).closest('.status-icon')[0].rename();
        }
      }));
    };

    StatusBar.prototype.registerPaneSubscription = function() {
      return this.subscriptions.add(this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneElement, tabBar;
          paneElement = $(atom.views.getView(pane));
          tabBar = paneElement.find('ul');
          tabBar.on('drop', function(event) {
            return _this.onDropTabBar(event, pane);
          });
          tabBar.on('dragstart', function(event) {
            var ref1;
            if (((ref1 = event.target.item) != null ? ref1.constructor.name : void 0) !== 'TerminalPlusView') {
              return;
            }
            return event.originalEvent.dataTransfer.setData('terminal-plus-tab', 'true');
          });
          return pane.onDidDestroy(function() {
            return tabBar.off('drop', this.onDropTabBar);
          });
        };
      })(this)));
    };

    StatusBar.prototype.createTerminalView = function() {
      var args, directory, editorFolder, editorPath, home, id, j, len, projectFolder, pwd, ref1, ref2, shell, shellArguments, statusIcon, terminalPlusView;
      if (this.paneSubscription == null) {
        this.registerPaneSubscription();
      }
      projectFolder = atom.project.getPaths()[0];
      editorPath = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      if (editorPath != null) {
        editorFolder = path.dirname(editorPath);
        ref2 = atom.project.getPaths();
        for (j = 0, len = ref2.length; j < len; j++) {
          directory = ref2[j];
          if (editorPath.indexOf(directory) >= 0) {
            projectFolder = directory;
          }
        }
      }
      if ((projectFolder != null ? projectFolder.indexOf('atom://') : void 0) >= 0) {
        projectFolder = void 0;
      }
      home = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
      switch (atom.config.get('terminal-plus.core.workingDirectory')) {
        case 'Project':
          pwd = projectFolder || editorFolder || home;
          break;
        case 'Active File':
          pwd = editorFolder || projectFolder || home;
          break;
        default:
          pwd = home;
      }
      id = editorPath || projectFolder || home;
      id = {
        filePath: id,
        folderPath: path.dirname(id)
      };
      shell = atom.config.get('terminal-plus.core.shell');
      shellArguments = atom.config.get('terminal-plus.core.shellArguments');
      args = shellArguments.split(/\s+/g).filter(function(arg) {
        return arg;
      });
      statusIcon = new StatusIcon();
      terminalPlusView = new TerminalPlusView(id, pwd, statusIcon, this, shell, args);
      statusIcon.initialize(terminalPlusView);
      terminalPlusView.attach();
      this.terminalViews.push(terminalPlusView);
      this.statusContainer.append(statusIcon);
      return terminalPlusView;
    };

    StatusBar.prototype.activeNextTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index + 1);
    };

    StatusBar.prototype.activePrevTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index - 1);
    };

    StatusBar.prototype.indexOf = function(view) {
      return this.terminalViews.indexOf(view);
    };

    StatusBar.prototype.activeTerminalView = function(index) {
      if (this.terminalViews.length < 2) {
        return false;
      }
      if (index >= this.terminalViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.terminalViews.length - 1;
      }
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.getActiveTerminalView = function() {
      return this.activeTerminal;
    };

    StatusBar.prototype.getTerminalById = function(target, selector) {
      var index, j, ref1, terminal;
      if (selector == null) {
        selector = function(terminal) {
          return terminal.id;
        };
      }
      for (index = j = 0, ref1 = this.terminalViews.length; 0 <= ref1 ? j <= ref1 : j >= ref1; index = 0 <= ref1 ? ++j : --j) {
        terminal = this.terminalViews[index];
        if (terminal != null) {
          if (selector(terminal) === target) {
            return terminal;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.terminalViewForTerminal = function(terminal) {
      var index, j, ref1, terminalView;
      for (index = j = 0, ref1 = this.terminalViews.length; 0 <= ref1 ? j <= ref1 : j >= ref1; index = 0 <= ref1 ? ++j : --j) {
        terminalView = this.terminalViews[index];
        if (terminalView != null) {
          if (terminalView.getTerminal() === terminal) {
            return terminalView;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.runInActiveView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if (view != null) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.runInOpenView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if ((view != null) && view.panel.isVisible()) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.setActiveTerminalView = function(view) {
      return this.activeTerminal = view;
    };

    StatusBar.prototype.removeTerminalView = function(view) {
      var index;
      index = this.indexOf(view);
      if (index < 0) {
        return;
      }
      this.terminalViews.splice(index, 1);
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.activateAdjacentTerminal = function(index) {
      if (index == null) {
        index = 0;
      }
      if (!(this.terminalViews.length > 0)) {
        return false;
      }
      index = Math.max(0, index - 1);
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.newTerminalView = function() {
      var ref1;
      if ((ref1 = this.activeTerminal) != null ? ref1.animating : void 0) {
        return;
      }
      this.activeTerminal = this.createTerminalView();
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.attach = function() {
      return atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
    };

    StatusBar.prototype.destroyActiveTerm = function() {
      var index;
      if (this.activeTerminal == null) {
        return;
      }
      index = this.indexOf(this.activeTerminal);
      this.activeTerminal.destroy();
      this.activeTerminal = null;
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.closeAll = function() {
      var index, j, ref1, view;
      for (index = j = ref1 = this.terminalViews.length; ref1 <= 0 ? j <= 0 : j >= 0; index = ref1 <= 0 ? ++j : --j) {
        view = this.terminalViews[index];
        if (view != null) {
          view.destroy();
        }
      }
      return this.activeTerminal = null;
    };

    StatusBar.prototype.destroy = function() {
      var j, len, ref1, view;
      this.subscriptions.dispose();
      ref1 = this.terminalViews;
      for (j = 0, len = ref1.length; j < len; j++) {
        view = ref1[j];
        view.ptyProcess.terminate();
        view.terminal.destroy();
      }
      return this.detach();
    };

    StatusBar.prototype.toggle = function() {
      if (this.terminalViews.length === 0) {
        this.activeTerminal = this.createTerminalView();
      } else if (this.activeTerminal === null) {
        this.activeTerminal = this.terminalViews[0];
      }
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.setStatusColor = function(event) {
      var color;
      color = event.type.match(/\w+$/)[0];
      color = atom.config.get("terminal-plus.iconColors." + color).toRGBAString();
      return $(event.target).closest('.status-icon').css('color', color);
    };

    StatusBar.prototype.clearStatusColor = function(event) {
      return $(event.target).closest('.status-icon').css('color', '');
    };

    StatusBar.prototype.onDragStart = function(event) {
      var element;
      event.originalEvent.dataTransfer.setData('terminal-plus-panel', 'true');
      element = $(event.target).closest('.status-icon');
      element.addClass('is-dragging');
      return event.originalEvent.dataTransfer.setData('from-index', element.index());
    };

    StatusBar.prototype.onDragLeave = function(event) {
      return this.removePlaceholder();
    };

    StatusBar.prototype.onDragEnd = function(event) {
      return this.clearDropTarget();
    };

    StatusBar.prototype.onDragOver = function(event) {
      var element, newDropTargetIndex, statusIcons;
      event.preventDefault();
      event.stopPropagation();
      if (event.originalEvent.dataTransfer.getData('terminal-plus') !== 'true') {
        return;
      }
      newDropTargetIndex = this.getDropTargetIndex(event);
      if (newDropTargetIndex == null) {
        return;
      }
      this.removeDropTargetClasses();
      statusIcons = this.statusContainer.children('.status-icon');
      if (newDropTargetIndex < statusIcons.length) {
        element = statusIcons.eq(newDropTargetIndex).addClass('is-drop-target');
        return this.getPlaceholder().insertBefore(element);
      } else {
        element = statusIcons.eq(newDropTargetIndex - 1).addClass('drop-target-is-after');
        return this.getPlaceholder().insertAfter(element);
      }
    };

    StatusBar.prototype.onDrop = function(event) {
      var dataTransfer, fromIndex, pane, paneIndex, panelEvent, tabEvent, toIndex, view;
      dataTransfer = event.originalEvent.dataTransfer;
      panelEvent = dataTransfer.getData('terminal-plus-panel') === 'true';
      tabEvent = dataTransfer.getData('terminal-plus-tab') === 'true';
      if (!(panelEvent || tabEvent)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      toIndex = this.getDropTargetIndex(event);
      this.clearDropTarget();
      if (tabEvent) {
        fromIndex = parseInt(dataTransfer.getData('sortable-index'));
        paneIndex = parseInt(dataTransfer.getData('from-pane-index'));
        pane = atom.workspace.getPanes()[paneIndex];
        view = pane.itemAtIndex(fromIndex);
        pane.removeItem(view, false);
        view.show();
        view.toggleTabView();
        this.terminalViews.push(view);
        if (view.statusIcon.isActive()) {
          view.open();
        }
        this.statusContainer.append(view.statusIcon);
        fromIndex = this.terminalViews.length - 1;
      } else {
        fromIndex = parseInt(dataTransfer.getData('from-index'));
      }
      return this.updateOrder(fromIndex, toIndex);
    };

    StatusBar.prototype.onDropTabBar = function(event, pane) {
      var dataTransfer, fromIndex, tabBar, view;
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('terminal-plus-panel') !== 'true') {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.clearDropTarget();
      fromIndex = parseInt(dataTransfer.getData('from-index'));
      view = this.terminalViews[fromIndex];
      view.css("height", "");
      view.terminal.element.style.height = "";
      tabBar = $(event.target).closest('.tab-bar');
      view.toggleTabView();
      this.removeTerminalView(view);
      this.statusContainer.children().eq(fromIndex).detach();
      view.statusIcon.removeTooltip();
      pane.addItem(view, pane.getItems().length);
      pane.activateItem(view);
      return view.focus();
    };

    StatusBar.prototype.clearDropTarget = function() {
      var element;
      element = this.find('.is-dragging');
      element.removeClass('is-dragging');
      this.removeDropTargetClasses();
      return this.removePlaceholder();
    };

    StatusBar.prototype.removeDropTargetClasses = function() {
      this.statusContainer.find('.is-drop-target').removeClass('is-drop-target');
      return this.statusContainer.find('.drop-target-is-after').removeClass('drop-target-is-after');
    };

    StatusBar.prototype.getDropTargetIndex = function(event) {
      var element, elementCenter, statusIcons, target;
      target = $(event.target);
      if (this.isPlaceholder(target)) {
        return;
      }
      statusIcons = this.statusContainer.children('.status-icon');
      element = target.closest('.status-icon');
      if (element.length === 0) {
        element = statusIcons.last();
      }
      if (!element.length) {
        return 0;
      }
      elementCenter = element.offset().left + element.width() / 2;
      if (event.originalEvent.pageX < elementCenter) {
        return statusIcons.index(element);
      } else if (element.next('.status-icon').length > 0) {
        return statusIcons.index(element.next('.status-icon'));
      } else {
        return statusIcons.index(element) + 1;
      }
    };

    StatusBar.prototype.getPlaceholder = function() {
      return this.placeholderEl != null ? this.placeholderEl : this.placeholderEl = $('<li class="placeholder"></li>');
    };

    StatusBar.prototype.removePlaceholder = function() {
      var ref1;
      if ((ref1 = this.placeholderEl) != null) {
        ref1.remove();
      }
      return this.placeholderEl = null;
    };

    StatusBar.prototype.isPlaceholder = function(element) {
      return element.is('.placeholder');
    };

    StatusBar.prototype.iconAtIndex = function(index) {
      return this.getStatusIcons().eq(index);
    };

    StatusBar.prototype.getStatusIcons = function() {
      return this.statusContainer.children('.status-icon');
    };

    StatusBar.prototype.moveIconToIndex = function(icon, toIndex) {
      var container, followingIcon;
      followingIcon = this.getStatusIcons()[toIndex];
      container = this.statusContainer[0];
      if (followingIcon != null) {
        return container.insertBefore(icon, followingIcon);
      } else {
        return container.appendChild(icon);
      }
    };

    StatusBar.prototype.moveTerminalView = function(fromIndex, toIndex) {
      var activeTerminal, view;
      activeTerminal = this.getActiveTerminalView();
      view = this.terminalViews.splice(fromIndex, 1)[0];
      this.terminalViews.splice(toIndex, 0, view);
      return this.setActiveTerminalView(activeTerminal);
    };

    StatusBar.prototype.updateOrder = function(fromIndex, toIndex) {
      var icon;
      if (fromIndex === toIndex) {
        return;
      }
      if (fromIndex < toIndex) {
        toIndex--;
      }
      icon = this.getStatusIcons().eq(fromIndex).detach();
      this.moveIconToIndex(icon.get(0), toIndex);
      this.moveTerminalView(fromIndex, toIndex);
      icon.addClass('inserted');
      return icon.one('webkitAnimationEnd', function() {
        return icon.removeClass('inserted');
      });
    };

    return StatusBar;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXBsdXMvbGliL3N0YXR1cy1iYXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxnRkFBQTtJQUFBOzs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUVKLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxRQUFSOztFQUNuQixVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBRWIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7Ozs7Ozs7Ozt3QkFDSixhQUFBLEdBQWU7O3dCQUNmLGNBQUEsR0FBZ0I7O3dCQUNoQixXQUFBLEdBQWE7O0lBRWIsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sMEJBQVA7UUFBbUMsUUFBQSxFQUFVLENBQUMsQ0FBOUM7T0FBTCxFQUFzRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDcEQsS0FBQyxDQUFBLENBQUQsQ0FBRztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVA7WUFBeUIsS0FBQSxFQUFPLGlCQUFoQztZQUFtRCxNQUFBLEVBQVEsU0FBM0Q7V0FBSDtVQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDhCQUFQO1lBQXVDLFFBQUEsRUFBVSxJQUFqRDtZQUF1RCxNQUFBLEVBQVEsaUJBQS9EO1lBQWtGLEVBQUEsRUFBSSxjQUF0RjtXQUFKO2lCQUNBLEtBQUMsQ0FBQSxDQUFELENBQUc7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQVA7WUFBc0IsS0FBQSxFQUFPLFVBQTdCO1lBQXlD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LEVBQWtDLElBQWxDO2FBQ0EsSUFBQyxDQUFBLHFCQUFELENBQXVCLGNBQXZCO0lBSmdCOzt3QkFNbEIsV0FBQSxHQUFhLFNBQUMsU0FBRCxFQUFZLE9BQVo7QUFDWCxVQUFBO01BQUEsSUFBVSxTQUFBLEtBQWEsT0FBdkI7QUFBQSxlQUFBOztNQUNBLElBQWEsU0FBQSxHQUFZLE9BQXpCO1FBQUEsT0FBQSxHQUFBOztNQUVBLElBQUEsR0FBTyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWlCLENBQUMsRUFBbEIsQ0FBcUIsU0FBckIsQ0FBK0IsQ0FBQyxNQUFoQyxDQUFBO01BQ1AsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULENBQWpCLEVBQThCLE9BQTlCO01BQ0EsSUFBQyxDQUFBLGdCQUFELENBQWtCLFNBQWxCLEVBQTZCLE9BQTdCO01BQ0EsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkO2FBQ0EsSUFBSSxDQUFDLEdBQUwsQ0FBUyxvQkFBVCxFQUErQixTQUFBO2VBQUcsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsVUFBakI7TUFBSCxDQUEvQjtJQVJXOzs7O0tBOWFTO0FBVHhCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5UZXJtaW5hbFBsdXNWaWV3ID0gcmVxdWlyZSAnLi92aWV3J1xuU3RhdHVzSWNvbiA9IHJlcXVpcmUgJy4vc3RhdHVzLWljb24nXG5cbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTdGF0dXNCYXIgZXh0ZW5kcyBWaWV3XG4gIHRlcm1pbmFsVmlld3M6IFtdXG4gIGFjdGl2ZVRlcm1pbmFsOiBudWxsXG4gIHJldHVybkZvY3VzOiBudWxsXG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ3Rlcm1pbmFsLXBsdXMgc3RhdHVzLWJhcicsIHRhYmluZGV4OiAtMSwgPT5cbiAgICAgIEBpIGNsYXNzOiBcImljb24gaWNvbi1wbHVzXCIsIGNsaWNrOiAnbmV3VGVybWluYWxWaWV3Jywgb3V0bGV0OiAncGx1c0J0bidcbiAgICAgIEB1bCBjbGFzczogXCJsaXN0LWlubGluZSBzdGF0dXMtY29udGFpbmVyXCIsIHRhYmluZGV4OiAnLTEnLCBvdXRsZXQ6ICdzdGF0dXNDb250YWluZXInLCBpczogJ3NwYWNlLXBlbi11bCdcbiAgICAgIEBpIGNsYXNzOiBcImljb24gaWNvbi14XCIsIGNsaWNrOiAnY2xvc2VBbGwnLCBvdXRsZXQ6ICdjbG9zZUJ0bidcblxuICBpbml0aWFsaXplOiAoKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAndGVybWluYWwtcGx1czpuZXcnOiA9PiBAbmV3VGVybWluYWxWaWV3KClcbiAgICAgICd0ZXJtaW5hbC1wbHVzOnRvZ2dsZSc6ID0+IEB0b2dnbGUoKVxuICAgICAgJ3Rlcm1pbmFsLXBsdXM6bmV4dCc6ID0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgQGFjdGl2ZVRlcm1pbmFsXG4gICAgICAgIHJldHVybiBpZiBAYWN0aXZlVGVybWluYWwuaXNBbmltYXRpbmcoKVxuICAgICAgICBAYWN0aXZlVGVybWluYWwub3BlbigpIGlmIEBhY3RpdmVOZXh0VGVybWluYWxWaWV3KClcbiAgICAgICd0ZXJtaW5hbC1wbHVzOnByZXYnOiA9PlxuICAgICAgICByZXR1cm4gdW5sZXNzIEBhY3RpdmVUZXJtaW5hbFxuICAgICAgICByZXR1cm4gaWYgQGFjdGl2ZVRlcm1pbmFsLmlzQW5pbWF0aW5nKClcbiAgICAgICAgQGFjdGl2ZVRlcm1pbmFsLm9wZW4oKSBpZiBAYWN0aXZlUHJldlRlcm1pbmFsVmlldygpXG4gICAgICAndGVybWluYWwtcGx1czpjbG9zZSc6ID0+IEBkZXN0cm95QWN0aXZlVGVybSgpXG4gICAgICAndGVybWluYWwtcGx1czpjbG9zZS1hbGwnOiA9PiBAY2xvc2VBbGwoKVxuICAgICAgJ3Rlcm1pbmFsLXBsdXM6cmVuYW1lJzogPT4gQHJ1bkluQWN0aXZlVmlldyAoaSkgLT4gaS5yZW5hbWUoKVxuICAgICAgJ3Rlcm1pbmFsLXBsdXM6aW5zZXJ0LXNlbGVjdGVkLXRleHQnOiA9PiBAcnVuSW5BY3RpdmVWaWV3IChpKSAtPiBpLmluc2VydFNlbGVjdGlvbigpXG4gICAgICAndGVybWluYWwtcGx1czppbnNlcnQtdGV4dCc6ID0+IEBydW5JbkFjdGl2ZVZpZXcgKGkpIC0+IGkuaW5wdXREaWFsb2coKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICcueHRlcm0nLFxuICAgICAgJ3Rlcm1pbmFsLXBsdXM6cGFzdGUnOiA9PiBAcnVuSW5BY3RpdmVWaWV3IChpKSAtPiBpLnBhc3RlKClcbiAgICAgICd0ZXJtaW5hbC1wbHVzOmNvcHknOiA9PiBAcnVuSW5BY3RpdmVWaWV3IChpKSAtPiBpLmNvcHkoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gKGl0ZW0pID0+XG4gICAgICByZXR1cm4gdW5sZXNzIGl0ZW0/XG5cbiAgICAgIGlmIGl0ZW0uY29uc3RydWN0b3IubmFtZSBpcyBcIlRlcm1pbmFsUGx1c1ZpZXdcIlxuICAgICAgICBzZXRUaW1lb3V0IGl0ZW0uZm9jdXMsIDEwMFxuICAgICAgZWxzZSBpZiBpdGVtLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJUZXh0RWRpdG9yXCJcbiAgICAgICAgbWFwcGluZyA9IGF0b20uY29uZmlnLmdldCgndGVybWluYWwtcGx1cy5jb3JlLm1hcFRlcm1pbmFsc1RvJylcbiAgICAgICAgcmV0dXJuIGlmIG1hcHBpbmcgaXMgJ05vbmUnXG5cbiAgICAgICAgc3dpdGNoIG1hcHBpbmdcbiAgICAgICAgICB3aGVuICdGaWxlJ1xuICAgICAgICAgICAgbmV4dFRlcm1pbmFsID0gQGdldFRlcm1pbmFsQnlJZCBpdGVtLmdldFBhdGgoKSwgKHZpZXcpIC0+IHZpZXcuZ2V0SWQoKS5maWxlUGF0aFxuICAgICAgICAgIHdoZW4gJ0ZvbGRlcidcbiAgICAgICAgICAgIG5leHRUZXJtaW5hbCA9IEBnZXRUZXJtaW5hbEJ5SWQgcGF0aC5kaXJuYW1lKGl0ZW0uZ2V0UGF0aCgpKSwgKHZpZXcpIC0+IHZpZXcuZ2V0SWQoKS5mb2xkZXJQYXRoXG5cbiAgICAgICAgcHJldlRlcm1pbmFsID0gQGdldEFjdGl2ZVRlcm1pbmFsVmlldygpXG4gICAgICAgIGlmIHByZXZUZXJtaW5hbCAhPSBuZXh0VGVybWluYWxcbiAgICAgICAgICBpZiBub3QgbmV4dFRlcm1pbmFsP1xuICAgICAgICAgICAgaWYgaXRlbS5nZXRUaXRsZSgpIGlzbnQgJ3VudGl0bGVkJ1xuICAgICAgICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3Rlcm1pbmFsLXBsdXMuY29yZS5tYXBUZXJtaW5hbHNUb0F1dG9PcGVuJylcbiAgICAgICAgICAgICAgICBuZXh0VGVybWluYWwgPSBAY3JlYXRlVGVybWluYWxWaWV3KClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2V0QWN0aXZlVGVybWluYWxWaWV3KG5leHRUZXJtaW5hbClcbiAgICAgICAgICAgIG5leHRUZXJtaW5hbC50b2dnbGUoKSBpZiBwcmV2VGVybWluYWw/LnBhbmVsLmlzVmlzaWJsZSgpXG5cbiAgICBAcmVnaXN0ZXJDb250ZXh0TWVudSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHBsdXNCdG4sIHRpdGxlOiAnTmV3IFRlcm1pbmFsJ1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAY2xvc2VCdG4sIHRpdGxlOiAnQ2xvc2UgQWxsJ1xuXG4gICAgQHN0YXR1c0NvbnRhaW5lci5vbiAnZGJsY2xpY2snLCAoZXZlbnQpID0+XG4gICAgICBAbmV3VGVybWluYWxWaWV3KCkgdW5sZXNzIGV2ZW50LnRhcmdldCAhPSBldmVudC5kZWxlZ2F0ZVRhcmdldFxuXG4gICAgQHN0YXR1c0NvbnRhaW5lci5vbiAnZHJhZ3N0YXJ0JywgJy5zdGF0dXMtaWNvbicsIEBvbkRyYWdTdGFydFxuICAgIEBzdGF0dXNDb250YWluZXIub24gJ2RyYWdlbmQnLCAnLnN0YXR1cy1pY29uJywgQG9uRHJhZ0VuZFxuICAgIEBzdGF0dXNDb250YWluZXIub24gJ2RyYWdsZWF2ZScsIEBvbkRyYWdMZWF2ZVxuICAgIEBzdGF0dXNDb250YWluZXIub24gJ2RyYWdvdmVyJywgQG9uRHJhZ092ZXJcbiAgICBAc3RhdHVzQ29udGFpbmVyLm9uICdkcm9wJywgQG9uRHJvcFxuXG4gICAgaGFuZGxlQmx1ciA9ID0+XG4gICAgICBpZiB0ZXJtaW5hbCA9IFRlcm1pbmFsUGx1c1ZpZXcuZ2V0Rm9jdXNlZFRlcm1pbmFsKClcbiAgICAgICAgQHJldHVybkZvY3VzID0gQHRlcm1pbmFsVmlld0ZvclRlcm1pbmFsKHRlcm1pbmFsKVxuICAgICAgICB0ZXJtaW5hbC5ibHVyKClcblxuICAgIGhhbmRsZUZvY3VzID0gPT5cbiAgICAgIGlmIEByZXR1cm5Gb2N1c1xuICAgICAgICBzZXRUaW1lb3V0ID0+XG4gICAgICAgICAgQHJldHVybkZvY3VzLmZvY3VzKClcbiAgICAgICAgICBAcmV0dXJuRm9jdXMgPSBudWxsXG4gICAgICAgICwgMTAwXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnYmx1cicsIGhhbmRsZUJsdXJcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zZTogLT5cbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyICdibHVyJywgaGFuZGxlQmx1clxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2ZvY3VzJywgaGFuZGxlRm9jdXNcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zZTogLT5cbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyICdmb2N1cycsIGhhbmRsZUZvY3VzXG5cbiAgICBAYXR0YWNoKClcblxuICByZWdpc3RlckNvbnRleHRNZW51OiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnLnRlcm1pbmFsLXBsdXMuc3RhdHVzLWJhcicsXG4gICAgICAndGVybWluYWwtcGx1czpzdGF0dXMtcmVkJzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAndGVybWluYWwtcGx1czpzdGF0dXMtb3JhbmdlJzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAndGVybWluYWwtcGx1czpzdGF0dXMteWVsbG93JzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAndGVybWluYWwtcGx1czpzdGF0dXMtZ3JlZW4nOiBAc2V0U3RhdHVzQ29sb3JcbiAgICAgICd0ZXJtaW5hbC1wbHVzOnN0YXR1cy1ibHVlJzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAndGVybWluYWwtcGx1czpzdGF0dXMtcHVycGxlJzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAndGVybWluYWwtcGx1czpzdGF0dXMtcGluayc6IEBzZXRTdGF0dXNDb2xvclxuICAgICAgJ3Rlcm1pbmFsLXBsdXM6c3RhdHVzLWN5YW4nOiBAc2V0U3RhdHVzQ29sb3JcbiAgICAgICd0ZXJtaW5hbC1wbHVzOnN0YXR1cy1tYWdlbnRhJzogQHNldFN0YXR1c0NvbG9yXG4gICAgICAndGVybWluYWwtcGx1czpzdGF0dXMtZGVmYXVsdCc6IEBjbGVhclN0YXR1c0NvbG9yXG4gICAgICAndGVybWluYWwtcGx1czpjb250ZXh0LWNsb3NlJzogKGV2ZW50KSAtPlxuICAgICAgICAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLnN0YXR1cy1pY29uJylbMF0udGVybWluYWxWaWV3LmRlc3Ryb3koKVxuICAgICAgJ3Rlcm1pbmFsLXBsdXM6Y29udGV4dC1oaWRlJzogKGV2ZW50KSAtPlxuICAgICAgICBzdGF0dXNJY29uID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5zdGF0dXMtaWNvbicpWzBdXG4gICAgICAgIHN0YXR1c0ljb24udGVybWluYWxWaWV3LmhpZGUoKSBpZiBzdGF0dXNJY29uLmlzQWN0aXZlKClcbiAgICAgICd0ZXJtaW5hbC1wbHVzOmNvbnRleHQtcmVuYW1lJzogKGV2ZW50KSAtPlxuICAgICAgICAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLnN0YXR1cy1pY29uJylbMF0ucmVuYW1lKClcblxuICByZWdpc3RlclBhbmVTdWJzY3JpcHRpb246IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBwYW5lU3Vic2NyaXB0aW9uID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVBhbmVzIChwYW5lKSA9PlxuICAgICAgcGFuZUVsZW1lbnQgPSAkKGF0b20udmlld3MuZ2V0VmlldyhwYW5lKSlcbiAgICAgIHRhYkJhciA9IHBhbmVFbGVtZW50LmZpbmQoJ3VsJylcblxuICAgICAgdGFiQmFyLm9uICdkcm9wJywgKGV2ZW50KSA9PiBAb25Ecm9wVGFiQmFyKGV2ZW50LCBwYW5lKVxuICAgICAgdGFiQmFyLm9uICdkcmFnc3RhcnQnLCAoZXZlbnQpIC0+XG4gICAgICAgIHJldHVybiB1bmxlc3MgZXZlbnQudGFyZ2V0Lml0ZW0/LmNvbnN0cnVjdG9yLm5hbWUgaXMgJ1Rlcm1pbmFsUGx1c1ZpZXcnXG4gICAgICAgIGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ3Rlcm1pbmFsLXBsdXMtdGFiJywgJ3RydWUnXG4gICAgICBwYW5lLm9uRGlkRGVzdHJveSAtPiB0YWJCYXIub2ZmICdkcm9wJywgQG9uRHJvcFRhYkJhclxuXG4gIGNyZWF0ZVRlcm1pbmFsVmlldzogLT5cbiAgICBAcmVnaXN0ZXJQYW5lU3Vic2NyaXB0aW9uKCkgdW5sZXNzIEBwYW5lU3Vic2NyaXB0aW9uP1xuXG4gICAgcHJvamVjdEZvbGRlciA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgZWRpdG9yUGF0aCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpXG5cbiAgICBpZiBlZGl0b3JQYXRoP1xuICAgICAgZWRpdG9yRm9sZGVyID0gcGF0aC5kaXJuYW1lKGVkaXRvclBhdGgpXG4gICAgICBmb3IgZGlyZWN0b3J5IGluIGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgICAgIGlmIGVkaXRvclBhdGguaW5kZXhPZihkaXJlY3RvcnkpID49IDBcbiAgICAgICAgICBwcm9qZWN0Rm9sZGVyID0gZGlyZWN0b3J5XG5cbiAgICBwcm9qZWN0Rm9sZGVyID0gdW5kZWZpbmVkIGlmIHByb2plY3RGb2xkZXI/LmluZGV4T2YoJ2F0b206Ly8nKSA+PSAwXG5cbiAgICBob21lID0gaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIHRoZW4gcHJvY2Vzcy5lbnYuSE9NRVBBVEggZWxzZSBwcm9jZXNzLmVudi5IT01FXG5cbiAgICBzd2l0Y2ggYXRvbS5jb25maWcuZ2V0KCd0ZXJtaW5hbC1wbHVzLmNvcmUud29ya2luZ0RpcmVjdG9yeScpXG4gICAgICB3aGVuICdQcm9qZWN0JyB0aGVuIHB3ZCA9IHByb2plY3RGb2xkZXIgb3IgZWRpdG9yRm9sZGVyIG9yIGhvbWVcbiAgICAgIHdoZW4gJ0FjdGl2ZSBGaWxlJyB0aGVuIHB3ZCA9IGVkaXRvckZvbGRlciBvciBwcm9qZWN0Rm9sZGVyIG9yIGhvbWVcbiAgICAgIGVsc2UgcHdkID0gaG9tZVxuXG4gICAgaWQgPSBlZGl0b3JQYXRoIG9yIHByb2plY3RGb2xkZXIgb3IgaG9tZVxuICAgIGlkID0gZmlsZVBhdGg6IGlkLCBmb2xkZXJQYXRoOiBwYXRoLmRpcm5hbWUoaWQpXG5cbiAgICBzaGVsbCA9IGF0b20uY29uZmlnLmdldCAndGVybWluYWwtcGx1cy5jb3JlLnNoZWxsJ1xuICAgIHNoZWxsQXJndW1lbnRzID0gYXRvbS5jb25maWcuZ2V0ICd0ZXJtaW5hbC1wbHVzLmNvcmUuc2hlbGxBcmd1bWVudHMnXG4gICAgYXJncyA9IHNoZWxsQXJndW1lbnRzLnNwbGl0KC9cXHMrL2cpLmZpbHRlciAoYXJnKSAtPiBhcmdcblxuICAgIHN0YXR1c0ljb24gPSBuZXcgU3RhdHVzSWNvbigpXG4gICAgdGVybWluYWxQbHVzVmlldyA9IG5ldyBUZXJtaW5hbFBsdXNWaWV3KGlkLCBwd2QsIHN0YXR1c0ljb24sIHRoaXMsIHNoZWxsLCBhcmdzKVxuICAgIHN0YXR1c0ljb24uaW5pdGlhbGl6ZSh0ZXJtaW5hbFBsdXNWaWV3KVxuXG4gICAgdGVybWluYWxQbHVzVmlldy5hdHRhY2goKVxuXG4gICAgQHRlcm1pbmFsVmlld3MucHVzaCB0ZXJtaW5hbFBsdXNWaWV3XG4gICAgQHN0YXR1c0NvbnRhaW5lci5hcHBlbmQgc3RhdHVzSWNvblxuICAgIHJldHVybiB0ZXJtaW5hbFBsdXNWaWV3XG5cbiAgYWN0aXZlTmV4dFRlcm1pbmFsVmlldzogLT5cbiAgICBpbmRleCA9IEBpbmRleE9mKEBhY3RpdmVUZXJtaW5hbClcbiAgICByZXR1cm4gZmFsc2UgaWYgaW5kZXggPCAwXG4gICAgQGFjdGl2ZVRlcm1pbmFsVmlldyBpbmRleCArIDFcblxuICBhY3RpdmVQcmV2VGVybWluYWxWaWV3OiAtPlxuICAgIGluZGV4ID0gQGluZGV4T2YoQGFjdGl2ZVRlcm1pbmFsKVxuICAgIHJldHVybiBmYWxzZSBpZiBpbmRleCA8IDBcbiAgICBAYWN0aXZlVGVybWluYWxWaWV3IGluZGV4IC0gMVxuXG4gIGluZGV4T2Y6ICh2aWV3KSAtPlxuICAgIEB0ZXJtaW5hbFZpZXdzLmluZGV4T2YodmlldylcblxuICBhY3RpdmVUZXJtaW5hbFZpZXc6IChpbmRleCkgLT5cbiAgICByZXR1cm4gZmFsc2UgaWYgQHRlcm1pbmFsVmlld3MubGVuZ3RoIDwgMlxuXG4gICAgaWYgaW5kZXggPj0gQHRlcm1pbmFsVmlld3MubGVuZ3RoXG4gICAgICBpbmRleCA9IDBcbiAgICBpZiBpbmRleCA8IDBcbiAgICAgIGluZGV4ID0gQHRlcm1pbmFsVmlld3MubGVuZ3RoIC0gMVxuXG4gICAgQGFjdGl2ZVRlcm1pbmFsID0gQHRlcm1pbmFsVmlld3NbaW5kZXhdXG4gICAgcmV0dXJuIHRydWVcblxuICBnZXRBY3RpdmVUZXJtaW5hbFZpZXc6IC0+XG4gICAgcmV0dXJuIEBhY3RpdmVUZXJtaW5hbFxuXG4gIGdldFRlcm1pbmFsQnlJZDogKHRhcmdldCwgc2VsZWN0b3IpIC0+XG4gICAgc2VsZWN0b3IgPz0gKHRlcm1pbmFsKSAtPiB0ZXJtaW5hbC5pZFxuXG4gICAgZm9yIGluZGV4IGluIFswIC4uIEB0ZXJtaW5hbFZpZXdzLmxlbmd0aF1cbiAgICAgIHRlcm1pbmFsID0gQHRlcm1pbmFsVmlld3NbaW5kZXhdXG4gICAgICBpZiB0ZXJtaW5hbD9cbiAgICAgICAgcmV0dXJuIHRlcm1pbmFsIGlmIHNlbGVjdG9yKHRlcm1pbmFsKSA9PSB0YXJnZXRcblxuICAgIHJldHVybiBudWxsXG5cbiAgdGVybWluYWxWaWV3Rm9yVGVybWluYWw6ICh0ZXJtaW5hbCkgLT5cbiAgICBmb3IgaW5kZXggaW4gWzAgLi4gQHRlcm1pbmFsVmlld3MubGVuZ3RoXVxuICAgICAgdGVybWluYWxWaWV3ID0gQHRlcm1pbmFsVmlld3NbaW5kZXhdXG4gICAgICBpZiB0ZXJtaW5hbFZpZXc/XG4gICAgICAgIHJldHVybiB0ZXJtaW5hbFZpZXcgaWYgdGVybWluYWxWaWV3LmdldFRlcm1pbmFsKCkgPT0gdGVybWluYWxcblxuICAgIHJldHVybiBudWxsXG5cbiAgcnVuSW5BY3RpdmVWaWV3OiAoY2FsbGJhY2spIC0+XG4gICAgdmlldyA9IEBnZXRBY3RpdmVUZXJtaW5hbFZpZXcoKVxuICAgIGlmIHZpZXc/XG4gICAgICByZXR1cm4gY2FsbGJhY2sodmlldylcbiAgICByZXR1cm4gbnVsbFxuXG4gIHJ1bkluT3BlblZpZXc6IChjYWxsYmFjaykgLT5cbiAgICB2aWV3ID0gQGdldEFjdGl2ZVRlcm1pbmFsVmlldygpXG4gICAgaWYgdmlldz8gYW5kIHZpZXcucGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIHJldHVybiBjYWxsYmFjayh2aWV3KVxuICAgIHJldHVybiBudWxsXG5cbiAgc2V0QWN0aXZlVGVybWluYWxWaWV3OiAodmlldykgLT5cbiAgICBAYWN0aXZlVGVybWluYWwgPSB2aWV3XG5cbiAgcmVtb3ZlVGVybWluYWxWaWV3OiAodmlldykgLT5cbiAgICBpbmRleCA9IEBpbmRleE9mIHZpZXdcbiAgICByZXR1cm4gaWYgaW5kZXggPCAwXG4gICAgQHRlcm1pbmFsVmlld3Muc3BsaWNlIGluZGV4LCAxXG5cbiAgICBAYWN0aXZhdGVBZGphY2VudFRlcm1pbmFsIGluZGV4XG5cbiAgYWN0aXZhdGVBZGphY2VudFRlcm1pbmFsOiAoaW5kZXg9MCkgLT5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIEB0ZXJtaW5hbFZpZXdzLmxlbmd0aCA+IDBcblxuICAgIGluZGV4ID0gTWF0aC5tYXgoMCwgaW5kZXggLSAxKVxuICAgIEBhY3RpdmVUZXJtaW5hbCA9IEB0ZXJtaW5hbFZpZXdzW2luZGV4XVxuXG4gICAgcmV0dXJuIHRydWVcblxuICBuZXdUZXJtaW5hbFZpZXc6IC0+XG4gICAgcmV0dXJuIGlmIEBhY3RpdmVUZXJtaW5hbD8uYW5pbWF0aW5nXG5cbiAgICBAYWN0aXZlVGVybWluYWwgPSBAY3JlYXRlVGVybWluYWxWaWV3KClcbiAgICBAYWN0aXZlVGVybWluYWwudG9nZ2xlKClcblxuICBhdHRhY2g6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoaXRlbTogdGhpcywgcHJpb3JpdHk6IDEwMClcblxuICBkZXN0cm95QWN0aXZlVGVybTogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBhY3RpdmVUZXJtaW5hbD9cblxuICAgIGluZGV4ID0gQGluZGV4T2YoQGFjdGl2ZVRlcm1pbmFsKVxuICAgIEBhY3RpdmVUZXJtaW5hbC5kZXN0cm95KClcbiAgICBAYWN0aXZlVGVybWluYWwgPSBudWxsXG5cbiAgICBAYWN0aXZhdGVBZGphY2VudFRlcm1pbmFsIGluZGV4XG5cbiAgY2xvc2VBbGw6ID0+XG4gICAgZm9yIGluZGV4IGluIFtAdGVybWluYWxWaWV3cy5sZW5ndGggLi4gMF1cbiAgICAgIHZpZXcgPSBAdGVybWluYWxWaWV3c1tpbmRleF1cbiAgICAgIGlmIHZpZXc/XG4gICAgICAgIHZpZXcuZGVzdHJveSgpXG4gICAgQGFjdGl2ZVRlcm1pbmFsID0gbnVsbFxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgZm9yIHZpZXcgaW4gQHRlcm1pbmFsVmlld3NcbiAgICAgIHZpZXcucHR5UHJvY2Vzcy50ZXJtaW5hdGUoKVxuICAgICAgdmlldy50ZXJtaW5hbC5kZXN0cm95KClcbiAgICBAZGV0YWNoKClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQHRlcm1pbmFsVmlld3MubGVuZ3RoID09IDBcbiAgICAgIEBhY3RpdmVUZXJtaW5hbCA9IEBjcmVhdGVUZXJtaW5hbFZpZXcoKVxuICAgIGVsc2UgaWYgQGFjdGl2ZVRlcm1pbmFsID09IG51bGxcbiAgICAgIEBhY3RpdmVUZXJtaW5hbCA9IEB0ZXJtaW5hbFZpZXdzWzBdXG4gICAgQGFjdGl2ZVRlcm1pbmFsLnRvZ2dsZSgpXG5cbiAgc2V0U3RhdHVzQ29sb3I6IChldmVudCkgLT5cbiAgICBjb2xvciA9IGV2ZW50LnR5cGUubWF0Y2goL1xcdyskLylbMF1cbiAgICBjb2xvciA9IGF0b20uY29uZmlnLmdldChcInRlcm1pbmFsLXBsdXMuaWNvbkNvbG9ycy4je2NvbG9yfVwiKS50b1JHQkFTdHJpbmcoKVxuICAgICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuc3RhdHVzLWljb24nKS5jc3MgJ2NvbG9yJywgY29sb3JcblxuICBjbGVhclN0YXR1c0NvbG9yOiAoZXZlbnQpIC0+XG4gICAgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5zdGF0dXMtaWNvbicpLmNzcyAnY29sb3InLCAnJ1xuXG4gIG9uRHJhZ1N0YXJ0OiAoZXZlbnQpID0+XG4gICAgZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAndGVybWluYWwtcGx1cy1wYW5lbCcsICd0cnVlJ1xuXG4gICAgZWxlbWVudCA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuc3RhdHVzLWljb24nKVxuICAgIGVsZW1lbnQuYWRkQ2xhc3MgJ2lzLWRyYWdnaW5nJ1xuICAgIGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2Zyb20taW5kZXgnLCBlbGVtZW50LmluZGV4KClcblxuICBvbkRyYWdMZWF2ZTogKGV2ZW50KSA9PlxuICAgIEByZW1vdmVQbGFjZWhvbGRlcigpXG5cbiAgb25EcmFnRW5kOiAoZXZlbnQpID0+XG4gICAgQGNsZWFyRHJvcFRhcmdldCgpXG5cbiAgb25EcmFnT3ZlcjogKGV2ZW50KSA9PlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHVubGVzcyBldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXJtaW5hbC1wbHVzJykgaXMgJ3RydWUnXG4gICAgICByZXR1cm5cblxuICAgIG5ld0Ryb3BUYXJnZXRJbmRleCA9IEBnZXREcm9wVGFyZ2V0SW5kZXgoZXZlbnQpXG4gICAgcmV0dXJuIHVubGVzcyBuZXdEcm9wVGFyZ2V0SW5kZXg/XG4gICAgQHJlbW92ZURyb3BUYXJnZXRDbGFzc2VzKClcbiAgICBzdGF0dXNJY29ucyA9IEBzdGF0dXNDb250YWluZXIuY2hpbGRyZW4gJy5zdGF0dXMtaWNvbidcblxuICAgIGlmIG5ld0Ryb3BUYXJnZXRJbmRleCA8IHN0YXR1c0ljb25zLmxlbmd0aFxuICAgICAgZWxlbWVudCA9IHN0YXR1c0ljb25zLmVxKG5ld0Ryb3BUYXJnZXRJbmRleCkuYWRkQ2xhc3MgJ2lzLWRyb3AtdGFyZ2V0J1xuICAgICAgQGdldFBsYWNlaG9sZGVyKCkuaW5zZXJ0QmVmb3JlKGVsZW1lbnQpXG4gICAgZWxzZVxuICAgICAgZWxlbWVudCA9IHN0YXR1c0ljb25zLmVxKG5ld0Ryb3BUYXJnZXRJbmRleCAtIDEpLmFkZENsYXNzICdkcm9wLXRhcmdldC1pcy1hZnRlcidcbiAgICAgIEBnZXRQbGFjZWhvbGRlcigpLmluc2VydEFmdGVyKGVsZW1lbnQpXG5cbiAgb25Ecm9wOiAoZXZlbnQpID0+XG4gICAge2RhdGFUcmFuc2Zlcn0gPSBldmVudC5vcmlnaW5hbEV2ZW50XG4gICAgcGFuZWxFdmVudCA9IGRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXJtaW5hbC1wbHVzLXBhbmVsJykgaXMgJ3RydWUnXG4gICAgdGFiRXZlbnQgPSBkYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGVybWluYWwtcGx1cy10YWInKSBpcyAndHJ1ZSdcbiAgICByZXR1cm4gdW5sZXNzIHBhbmVsRXZlbnQgb3IgdGFiRXZlbnRcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgdG9JbmRleCA9IEBnZXREcm9wVGFyZ2V0SW5kZXgoZXZlbnQpXG4gICAgQGNsZWFyRHJvcFRhcmdldCgpXG5cbiAgICBpZiB0YWJFdmVudFxuICAgICAgZnJvbUluZGV4ID0gcGFyc2VJbnQoZGF0YVRyYW5zZmVyLmdldERhdGEoJ3NvcnRhYmxlLWluZGV4JykpXG4gICAgICBwYW5lSW5kZXggPSBwYXJzZUludChkYXRhVHJhbnNmZXIuZ2V0RGF0YSgnZnJvbS1wYW5lLWluZGV4JykpXG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVtwYW5lSW5kZXhdXG4gICAgICB2aWV3ID0gcGFuZS5pdGVtQXRJbmRleChmcm9tSW5kZXgpXG4gICAgICBwYW5lLnJlbW92ZUl0ZW0odmlldywgZmFsc2UpXG4gICAgICB2aWV3LnNob3coKVxuXG4gICAgICB2aWV3LnRvZ2dsZVRhYlZpZXcoKVxuICAgICAgQHRlcm1pbmFsVmlld3MucHVzaCB2aWV3XG4gICAgICB2aWV3Lm9wZW4oKSBpZiB2aWV3LnN0YXR1c0ljb24uaXNBY3RpdmUoKVxuICAgICAgQHN0YXR1c0NvbnRhaW5lci5hcHBlbmQgdmlldy5zdGF0dXNJY29uXG4gICAgICBmcm9tSW5kZXggPSBAdGVybWluYWxWaWV3cy5sZW5ndGggLSAxXG4gICAgZWxzZVxuICAgICAgZnJvbUluZGV4ID0gcGFyc2VJbnQoZGF0YVRyYW5zZmVyLmdldERhdGEoJ2Zyb20taW5kZXgnKSlcbiAgICBAdXBkYXRlT3JkZXIoZnJvbUluZGV4LCB0b0luZGV4KVxuXG4gIG9uRHJvcFRhYkJhcjogKGV2ZW50LCBwYW5lKSA9PlxuICAgIHtkYXRhVHJhbnNmZXJ9ID0gZXZlbnQub3JpZ2luYWxFdmVudFxuICAgIHJldHVybiB1bmxlc3MgZGF0YVRyYW5zZmVyLmdldERhdGEoJ3Rlcm1pbmFsLXBsdXMtcGFuZWwnKSBpcyAndHJ1ZSdcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gICAgZnJvbUluZGV4ID0gcGFyc2VJbnQoZGF0YVRyYW5zZmVyLmdldERhdGEoJ2Zyb20taW5kZXgnKSlcbiAgICB2aWV3ID0gQHRlcm1pbmFsVmlld3NbZnJvbUluZGV4XVxuICAgIHZpZXcuY3NzIFwiaGVpZ2h0XCIsIFwiXCJcbiAgICB2aWV3LnRlcm1pbmFsLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCJcIlxuICAgIHRhYkJhciA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcudGFiLWJhcicpXG5cbiAgICB2aWV3LnRvZ2dsZVRhYlZpZXcoKVxuICAgIEByZW1vdmVUZXJtaW5hbFZpZXcgdmlld1xuICAgIEBzdGF0dXNDb250YWluZXIuY2hpbGRyZW4oKS5lcShmcm9tSW5kZXgpLmRldGFjaCgpXG4gICAgdmlldy5zdGF0dXNJY29uLnJlbW92ZVRvb2x0aXAoKVxuXG4gICAgcGFuZS5hZGRJdGVtIHZpZXcsIHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGhcbiAgICBwYW5lLmFjdGl2YXRlSXRlbSB2aWV3XG5cbiAgICB2aWV3LmZvY3VzKClcblxuICBjbGVhckRyb3BUYXJnZXQ6IC0+XG4gICAgZWxlbWVudCA9IEBmaW5kKCcuaXMtZHJhZ2dpbmcnKVxuICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MgJ2lzLWRyYWdnaW5nJ1xuICAgIEByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlcygpXG4gICAgQHJlbW92ZVBsYWNlaG9sZGVyKClcblxuICByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlczogLT5cbiAgICBAc3RhdHVzQ29udGFpbmVyLmZpbmQoJy5pcy1kcm9wLXRhcmdldCcpLnJlbW92ZUNsYXNzICdpcy1kcm9wLXRhcmdldCdcbiAgICBAc3RhdHVzQ29udGFpbmVyLmZpbmQoJy5kcm9wLXRhcmdldC1pcy1hZnRlcicpLnJlbW92ZUNsYXNzICdkcm9wLXRhcmdldC1pcy1hZnRlcidcblxuICBnZXREcm9wVGFyZ2V0SW5kZXg6IChldmVudCkgLT5cbiAgICB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldClcbiAgICByZXR1cm4gaWYgQGlzUGxhY2Vob2xkZXIodGFyZ2V0KVxuXG4gICAgc3RhdHVzSWNvbnMgPSBAc3RhdHVzQ29udGFpbmVyLmNoaWxkcmVuKCcuc3RhdHVzLWljb24nKVxuICAgIGVsZW1lbnQgPSB0YXJnZXQuY2xvc2VzdCgnLnN0YXR1cy1pY29uJylcbiAgICBlbGVtZW50ID0gc3RhdHVzSWNvbnMubGFzdCgpIGlmIGVsZW1lbnQubGVuZ3RoIGlzIDBcblxuICAgIHJldHVybiAwIHVubGVzcyBlbGVtZW50Lmxlbmd0aFxuXG4gICAgZWxlbWVudENlbnRlciA9IGVsZW1lbnQub2Zmc2V0KCkubGVmdCArIGVsZW1lbnQud2lkdGgoKSAvIDJcblxuICAgIGlmIGV2ZW50Lm9yaWdpbmFsRXZlbnQucGFnZVggPCBlbGVtZW50Q2VudGVyXG4gICAgICBzdGF0dXNJY29ucy5pbmRleChlbGVtZW50KVxuICAgIGVsc2UgaWYgZWxlbWVudC5uZXh0KCcuc3RhdHVzLWljb24nKS5sZW5ndGggPiAwXG4gICAgICBzdGF0dXNJY29ucy5pbmRleChlbGVtZW50Lm5leHQoJy5zdGF0dXMtaWNvbicpKVxuICAgIGVsc2VcbiAgICAgIHN0YXR1c0ljb25zLmluZGV4KGVsZW1lbnQpICsgMVxuXG4gIGdldFBsYWNlaG9sZGVyOiAtPlxuICAgIEBwbGFjZWhvbGRlckVsID89ICQoJzxsaSBjbGFzcz1cInBsYWNlaG9sZGVyXCI+PC9saT4nKVxuXG4gIHJlbW92ZVBsYWNlaG9sZGVyOiAtPlxuICAgIEBwbGFjZWhvbGRlckVsPy5yZW1vdmUoKVxuICAgIEBwbGFjZWhvbGRlckVsID0gbnVsbFxuXG4gIGlzUGxhY2Vob2xkZXI6IChlbGVtZW50KSAtPlxuICAgIGVsZW1lbnQuaXMoJy5wbGFjZWhvbGRlcicpXG5cbiAgaWNvbkF0SW5kZXg6IChpbmRleCkgLT5cbiAgICBAZ2V0U3RhdHVzSWNvbnMoKS5lcShpbmRleClcblxuICBnZXRTdGF0dXNJY29uczogLT5cbiAgICBAc3RhdHVzQ29udGFpbmVyLmNoaWxkcmVuKCcuc3RhdHVzLWljb24nKVxuXG4gIG1vdmVJY29uVG9JbmRleDogKGljb24sIHRvSW5kZXgpIC0+XG4gICAgZm9sbG93aW5nSWNvbiA9IEBnZXRTdGF0dXNJY29ucygpW3RvSW5kZXhdXG4gICAgY29udGFpbmVyID0gQHN0YXR1c0NvbnRhaW5lclswXVxuICAgIGlmIGZvbGxvd2luZ0ljb24/XG4gICAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKGljb24sIGZvbGxvd2luZ0ljb24pXG4gICAgZWxzZVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGljb24pXG5cbiAgbW92ZVRlcm1pbmFsVmlldzogKGZyb21JbmRleCwgdG9JbmRleCkgPT5cbiAgICBhY3RpdmVUZXJtaW5hbCA9IEBnZXRBY3RpdmVUZXJtaW5hbFZpZXcoKVxuICAgIHZpZXcgPSBAdGVybWluYWxWaWV3cy5zcGxpY2UoZnJvbUluZGV4LCAxKVswXVxuICAgIEB0ZXJtaW5hbFZpZXdzLnNwbGljZSB0b0luZGV4LCAwLCB2aWV3XG4gICAgQHNldEFjdGl2ZVRlcm1pbmFsVmlldyBhY3RpdmVUZXJtaW5hbFxuXG4gIHVwZGF0ZU9yZGVyOiAoZnJvbUluZGV4LCB0b0luZGV4KSAtPlxuICAgIHJldHVybiBpZiBmcm9tSW5kZXggaXMgdG9JbmRleFxuICAgIHRvSW5kZXgtLSBpZiBmcm9tSW5kZXggPCB0b0luZGV4XG5cbiAgICBpY29uID0gQGdldFN0YXR1c0ljb25zKCkuZXEoZnJvbUluZGV4KS5kZXRhY2goKVxuICAgIEBtb3ZlSWNvblRvSW5kZXggaWNvbi5nZXQoMCksIHRvSW5kZXhcbiAgICBAbW92ZVRlcm1pbmFsVmlldyBmcm9tSW5kZXgsIHRvSW5kZXhcbiAgICBpY29uLmFkZENsYXNzICdpbnNlcnRlZCdcbiAgICBpY29uLm9uZSAnd2Via2l0QW5pbWF0aW9uRW5kJywgLT4gaWNvbi5yZW1vdmVDbGFzcygnaW5zZXJ0ZWQnKVxuIl19
