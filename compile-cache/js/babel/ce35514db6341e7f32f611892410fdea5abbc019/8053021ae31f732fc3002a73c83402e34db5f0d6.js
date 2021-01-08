Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _atom = require('atom');

var _terminalSession = require('./terminal-session');

var _terminalSession2 = _interopRequireDefault(_terminalSession);

var _terminalView = require('./terminal-view');

var _terminalView2 = _interopRequireDefault(_terminalView);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var TERMINAL_TAB_URI = 'terminal-tab://';

exports['default'] = {

  config: _config2['default'],

  initialize: function initialize() {
    this.disposables = new _atom.CompositeDisposable();
    this.addViewProvider();
  },

  activate: function activate() {
    this.addOpener();
    this.addCommands();
  },

  deactivate: function deactivate() {
    this.disposables.dispose();
  },

  deserializeTerminalSession: function deserializeTerminalSession(data) {
    return new _terminalSession2['default'](data.config);
  },

  handleOpen: function handleOpen() {
    return atom.workspace.open(TERMINAL_TAB_URI);
  },

  handleClose: function handleClose() {
    var activePane = atom.workspace.getActivePane();
    activePane.destroyActiveItem();
  },

  handleCopy: function handleCopy() {
    var activeSession = atom.workspace.getActivePaneItem();
    activeSession.copySelection();
  },

  handlePaste: function handlePaste() {
    var activeSession = atom.workspace.getActivePaneItem();
    activeSession.pasteFromClipboard();
  },

  handleClear: function handleClear() {
    var activeSession = atom.workspace.getActivePaneItem();
    activeSession.clear();
  },

  addViewProvider: function addViewProvider() {
    this.disposables.add(atom.views.addViewProvider(_terminalSession2['default'], function (session) {
      return new _terminalView2['default'](session).element;
    }));
  },

  addOpener: function addOpener() {
    this.disposables.add(atom.workspace.addOpener(function (uri) {
      if (uri === TERMINAL_TAB_URI) {
        return new _terminalSession2['default']();
      }
    }));
  },

  addCommands: function addCommands() {
    this.disposables.add(atom.commands.add('atom-workspace', {
      'terminal:open': this.handleOpen.bind(this)
    }));
    this.disposables.add(atom.commands.add('terminal-view', {
      'terminal:copy': this.handleCopy.bind(this),
      'terminal:paste': this.handlePaste.bind(this),
      'terminal:clear': this.handleClear.bind(this),
      'terminal:close': this.handleClose.bind(this)
    }));
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC10YWIvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07OytCQUNkLG9CQUFvQjs7Ozs0QkFDdkIsaUJBQWlCOzs7O3NCQUN2QixVQUFVOzs7O0FBRTdCLElBQU0sZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUM7O3FCQUU1Qjs7QUFFYixRQUFNLHFCQUFBOztBQUVOLFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7QUFDN0MsUUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0dBQ3hCOztBQUVELFVBQVEsRUFBQSxvQkFBRztBQUNULFFBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDcEI7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUM1Qjs7QUFFRCw0QkFBMEIsRUFBQSxvQ0FBQyxJQUFJLEVBQUU7QUFDL0IsV0FBTyxpQ0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3pDOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztHQUM5Qzs7QUFFRCxhQUFXLEVBQUEsdUJBQUc7QUFDWixRQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ2xELGNBQVUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0dBQ2hDOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUN6RCxpQkFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDO0dBQy9COztBQUVELGFBQVcsRUFBQSx1QkFBRztBQUNaLFFBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUN6RCxpQkFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUM7R0FDcEM7O0FBRUQsYUFBVyxFQUFBLHVCQUFHO0FBQ1osUUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3pELGlCQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDdkI7O0FBRUQsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsK0JBQWtCLFVBQUMsT0FBTyxFQUFLO0FBQzVFLGFBQU8sOEJBQWlCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztLQUMxQyxDQUFDLENBQUMsQ0FBQztHQUNMOztBQUVELFdBQVMsRUFBQSxxQkFBRztBQUNWLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3JELFVBQUksR0FBRyxLQUFLLGdCQUFnQixFQUFFO0FBQzVCLGVBQU8sa0NBQXFCLENBQUM7T0FDOUI7S0FDRixDQUFDLENBQUMsQ0FBQztHQUNMOztBQUVELGFBQVcsRUFBQSx1QkFBRztBQUNaLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3ZELHFCQUFlLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQzVDLENBQUMsQ0FBQyxDQUFDO0FBQ0osUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFO0FBQ3RELHFCQUFlLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzNDLHNCQUFnQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUM3QyxzQkFBZ0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDN0Msc0JBQWdCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQzlDLENBQUMsQ0FBQyxDQUFDO0dBQ0w7O0NBRUYiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXRhYi9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IFRlcm1pbmFsU2Vzc2lvbiBmcm9tICcuL3Rlcm1pbmFsLXNlc3Npb24nO1xuaW1wb3J0IFRlcm1pbmFsVmlldyBmcm9tICcuL3Rlcm1pbmFsLXZpZXcnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbmNvbnN0IFRFUk1JTkFMX1RBQl9VUkkgPSAndGVybWluYWwtdGFiOi8vJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGNvbmZpZyxcblxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuYWRkVmlld1Byb3ZpZGVyKCk7XG4gIH0sXG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5hZGRPcGVuZXIoKTtcbiAgICB0aGlzLmFkZENvbW1hbmRzKCk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBkZXNlcmlhbGl6ZVRlcm1pbmFsU2Vzc2lvbihkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtaW5hbFNlc3Npb24oZGF0YS5jb25maWcpO1xuICB9LFxuXG4gIGhhbmRsZU9wZW4oKSB7XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oVEVSTUlOQUxfVEFCX1VSSSk7XG4gIH0sXG5cbiAgaGFuZGxlQ2xvc2UoKSB7XG4gICAgY29uc3QgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKTtcbiAgICBhY3RpdmVQYW5lLmRlc3Ryb3lBY3RpdmVJdGVtKCk7XG4gIH0sXG5cbiAgaGFuZGxlQ29weSgpIHtcbiAgICBjb25zdCBhY3RpdmVTZXNzaW9uID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICBhY3RpdmVTZXNzaW9uLmNvcHlTZWxlY3Rpb24oKTtcbiAgfSxcblxuICBoYW5kbGVQYXN0ZSgpIHtcbiAgICBjb25zdCBhY3RpdmVTZXNzaW9uID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICBhY3RpdmVTZXNzaW9uLnBhc3RlRnJvbUNsaXBib2FyZCgpO1xuICB9LFxuXG4gIGhhbmRsZUNsZWFyKCkge1xuICAgIGNvbnN0IGFjdGl2ZVNlc3Npb24gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuICAgIGFjdGl2ZVNlc3Npb24uY2xlYXIoKTtcbiAgfSxcblxuICBhZGRWaWV3UHJvdmlkZXIoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS52aWV3cy5hZGRWaWV3UHJvdmlkZXIoVGVybWluYWxTZXNzaW9uLCAoc2Vzc2lvbikgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtaW5hbFZpZXcoc2Vzc2lvbikuZWxlbWVudDtcbiAgICB9KSk7XG4gIH0sXG5cbiAgYWRkT3BlbmVyKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcigodXJpKSA9PiB7XG4gICAgICBpZiAodXJpID09PSBURVJNSU5BTF9UQUJfVVJJKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGVybWluYWxTZXNzaW9uKCk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9LFxuXG4gIGFkZENvbW1hbmRzKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICd0ZXJtaW5hbDpvcGVuJzogdGhpcy5oYW5kbGVPcGVuLmJpbmQodGhpcylcbiAgICB9KSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ3Rlcm1pbmFsLXZpZXcnLCB7XG4gICAgICAndGVybWluYWw6Y29weSc6IHRoaXMuaGFuZGxlQ29weS5iaW5kKHRoaXMpLFxuICAgICAgJ3Rlcm1pbmFsOnBhc3RlJzogdGhpcy5oYW5kbGVQYXN0ZS5iaW5kKHRoaXMpLFxuICAgICAgJ3Rlcm1pbmFsOmNsZWFyJzogdGhpcy5oYW5kbGVDbGVhci5iaW5kKHRoaXMpLFxuICAgICAgJ3Rlcm1pbmFsOmNsb3NlJzogdGhpcy5oYW5kbGVDbG9zZS5iaW5kKHRoaXMpXG4gICAgfSkpO1xuICB9XG5cbn07XG4iXX0=