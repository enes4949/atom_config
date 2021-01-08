Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _atom = require('atom');

var _nodePtyPrebuiltMultiarch = require('node-pty-prebuilt-multiarch');

var _xterm = require('xterm');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

//
// Terminal Session
//
// Maintains all of the essential state for a Terminal Tab.
//

var TerminalSession = (function () {
  function TerminalSession() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, TerminalSession);

    this.config = config;
    this.disposables = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.pty = this.openPseudoterminal();
    this.xterm = new _xterm.Terminal();

    this.handleEvents();
  }

  _createClass(TerminalSession, [{
    key: 'handleEvents',
    value: function handleEvents() {
      var _this = this;

      // Process Terminal Input Events
      this.xterm.onData(function (data) {
        return _this.pty.write(data);
      });

      // Process Terminal Output Events
      this.pty.onData(function (data) {
        if (_this.xterm.element) {
          return _this.xterm.write(data);
        }
      });

      // Process Terminal Exit Events
      this.pty.onExit(this.destroy.bind(this));
    }
  }, {
    key: 'openPseudoterminal',
    value: function openPseudoterminal() {
      var shellArguments = this.shellArguments.split(/\s+/g).filter(function (arg) {
        return arg;
      });

      return (0, _nodePtyPrebuiltMultiarch.spawn)(this.shellPath, shellArguments, {
        name: 'xterm-color',
        env: this.sanitizedEnvironment,
        cwd: this.workingDirectory
      });
    }

    //
    // Clears the contents of the terminal buffer. This is a simple proxy to the
    // `clear()` function on the Xterm instance.
    //
  }, {
    key: 'clear',
    value: function clear() {
      this.xterm.clear();
    }

    //
    // Copies the current selection to the Atom clipboard.
    //
  }, {
    key: 'copySelection',
    value: function copySelection() {
      var selectedText = this.xterm.getSelection();
      atom.clipboard.write(selectedText);
    }

    //
    // Pastes the contents of the Atom clipboard to the terminal (via the
    // pseudoterminal).
    //
  }, {
    key: 'pasteFromClipboard',
    value: function pasteFromClipboard() {
      var text = atom.clipboard.read();
      this.pty.write(text);
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: 'TerminalSession',
        config: {
          sanitizeEnvironment: this.sanitizedEnvironmentKeys,
          shellArgs: this.shellArguments,
          shellPath: this.shellPath,
          workingDirectory: this.workingDirectory
        }
      };
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      // Kill the Pseudoterminal (pty) Process
      if (this.pty) this.pty.kill();

      // Destroy the Terminal Instance
      if (this.xterm) this.xterm.dispose();

      // Notify any observers that this session is being destroyed.
      this.emitter.emit('did-destroy', this);

      // Clean up any disposables we're responsible for.
      this.emitter.dispose();
      this.disposables.dispose();
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }

    //
    // Select a working directory for a new terminal.
    // Uses the project folder of the currently active file, if any,
    // otherwise falls back to the first project's folder, if any,
    // or the user's home directory.
    //
  }, {
    key: '_getWorkingDirectory',
    value: function _getWorkingDirectory() {
      if (this._workingDirectory) return this._workingDirectory;

      var activeItem = atom.workspace.getActivePaneItem();
      if (activeItem && activeItem.buffer && activeItem.buffer.file && activeItem.buffer.file.path) {
        return atom.project.relativizePath(activeItem.buffer.file.path)[0];
      }

      var projectPaths = atom.project.getPaths();
      var cwd = undefined;
      if (projectPaths.length > 0) {
        cwd = projectPaths[0];
      } else {
        cwd = process.env.HOME;
      }
      return _path2['default'].resolve(cwd);
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return atom.config.get('terminal-tab.defaultLocation');
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'terminal';
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Terminal';
    }
  }, {
    key: 'sanitizedEnvironment',
    get: function get() {
      var sanitizedEnvironment = Object.assign({}, process.env);
      var variablesToDelete = this.sanitizedEnvironmentKeys;

      if (variablesToDelete) {
        variablesToDelete.forEach(function (variable) {
          delete sanitizedEnvironment[variable];
        });
      }

      return sanitizedEnvironment;
    }
  }, {
    key: 'shellPath',
    get: function get() {
      if (this._shellPath) return this._shellPath;
      return this._shellPath = this.config.shellPath || atom.config.get('terminal-tab.shellSettings.shellPath') || process.env.SHELL || process.env.COMSPEC;
    }
  }, {
    key: 'shellArguments',
    get: function get() {
      if (this._shellArguments) return this._shellArguments;
      return this._shellArguments = this.config.shellArgs || atom.config.get('terminal-tab.shellSettings.shellArgs') || '';
    }
  }, {
    key: 'sanitizedEnvironmentKeys',
    get: function get() {
      if (this._sanitizedEnvironmentKeys) return this._sanitizedEnvironmentKeys;
      return this._sanitizedEnvironmentKeys = this.config.sanitizeEnvironment || atom.config.get('terminal-tab.shellSettings.sanitizeEnvironment');
    }
  }, {
    key: 'workingDirectory',
    get: function get() {
      if (this._workingDirectory) return this._workingDirectory;
      return this._workingDirectory = this.config.workingDirectory || this._getWorkingDirectory();
    }
  }]);

  return TerminalSession;
})();

exports['default'] = TerminalSession;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC10YWIvbGliL3Rlcm1pbmFsLXNlc3Npb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUU2QyxNQUFNOzt3Q0FDakIsNkJBQTZCOztxQkFDN0IsT0FBTzs7b0JBQ3hCLE1BQU07Ozs7Ozs7Ozs7SUFPRixlQUFlO0FBRXZCLFdBRlEsZUFBZSxHQUVUO1FBQWIsTUFBTSx5REFBRyxFQUFFOzswQkFGSixlQUFlOztBQUdoQyxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFDO0FBQzdDLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLEdBQUcscUJBQVcsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0dBQ3JCOztlQVZrQixlQUFlOztXQVl0Qix3QkFBRzs7OztBQUdiLFVBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTtlQUFJLE1BQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7T0FBQSxDQUFDLENBQUM7OztBQUdoRCxVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN4QixZQUFJLE1BQUssS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUN0QixpQkFBTyxNQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0I7T0FDRixDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FFMUM7OztXQUVpQiw4QkFBRztBQUNuQixVQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxHQUFHO2VBQUksR0FBRztPQUFBLENBQUMsQ0FBQzs7QUFFNUUsYUFBTyxxQ0FBUyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRTtBQUM5QyxZQUFJLEVBQUUsYUFBYTtBQUNuQixXQUFHLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtBQUM5QixXQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtPQUMzQixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7V0FNSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDcEI7Ozs7Ozs7V0FLWSx5QkFBRztBQUNkLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDL0MsVUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDcEM7Ozs7Ozs7O1dBTWlCLDhCQUFHO0FBQ25CLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEI7OztXQUVRLHFCQUFHO0FBQ1YsYUFBTztBQUNMLG9CQUFZLEVBQUUsaUJBQWlCO0FBQy9CLGNBQU0sRUFBRTtBQUNOLDZCQUFtQixFQUFFLElBQUksQ0FBQyx3QkFBd0I7QUFDbEQsbUJBQVMsRUFBRSxJQUFJLENBQUMsY0FBYztBQUM5QixtQkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQ3pCLDBCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7U0FDeEM7T0FDRixDQUFDO0tBQ0g7OztXQUVNLG1CQUFHOzs7QUFHUixVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7O0FBRzlCLFVBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDOzs7QUFHckMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDOzs7QUFHdkMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QixVQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBRTVCOzs7V0FFVyxzQkFBQyxRQUFRLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDakQ7Ozs7Ozs7Ozs7V0FRbUIsZ0NBQUc7QUFDckIsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7O0FBRTFELFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUN0RCxVQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUM1RixlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3BFOztBQUVELFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDN0MsVUFBSSxHQUFHLFlBQUEsQ0FBQztBQUNSLFVBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDM0IsV0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN2QixNQUFNO0FBQ0wsV0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO09BQ3hCO0FBQ0QsYUFBTyxrQkFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDMUI7OztXQTBDaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0tBQ3hEOzs7V0FFVSx1QkFBRztBQUNaLGFBQU8sVUFBVSxDQUFDO0tBQ25COzs7V0FFTyxvQkFBRztBQUNULGFBQU8sVUFBVSxDQUFDO0tBQ25COzs7U0FsRHVCLGVBQUc7QUFDekIsVUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsVUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUM7O0FBRXhELFVBQUksaUJBQWlCLEVBQUU7QUFDckIseUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQ3RDLGlCQUFPLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztPQUNKOztBQUVELGFBQU8sb0JBQW9CLENBQUM7S0FDN0I7OztTQUVZLGVBQUc7QUFDZCxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQzVDLGFBQU8sSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsSUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0tBQzFCOzs7U0FFaUIsZUFBRztBQUNuQixVQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0FBQ3RELGFBQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFDOUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsSUFDdkQsRUFBRSxDQUFDO0tBQ1Q7OztTQUUyQixlQUFHO0FBQzdCLFVBQUksSUFBSSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDO0FBQzFFLGFBQU8sSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLElBQ2xFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7S0FDeEU7OztTQUVtQixlQUFHO0FBQ3JCLFVBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0FBQzFELGFBQU8sSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLElBQ3ZELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0tBQ2xDOzs7U0EvSmtCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC10YWIvbGliL3Rlcm1pbmFsLXNlc3Npb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJztcbmltcG9ydCB7IHNwYXduIGFzIHNwYXduUHR5IH0gZnJvbSAnbm9kZS1wdHktcHJlYnVpbHQtbXVsdGlhcmNoJztcbmltcG9ydCB7IFRlcm1pbmFsIGFzIFh0ZXJtIH0gZnJvbSAneHRlcm0nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbi8vXG4vLyBUZXJtaW5hbCBTZXNzaW9uXG4vL1xuLy8gTWFpbnRhaW5zIGFsbCBvZiB0aGUgZXNzZW50aWFsIHN0YXRlIGZvciBhIFRlcm1pbmFsIFRhYi5cbi8vXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJtaW5hbFNlc3Npb24ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLnB0eSA9IHRoaXMub3BlblBzZXVkb3Rlcm1pbmFsKCk7XG4gICAgdGhpcy54dGVybSA9IG5ldyBYdGVybSgpO1xuXG4gICAgdGhpcy5oYW5kbGVFdmVudHMoKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50cygpIHtcblxuICAgIC8vIFByb2Nlc3MgVGVybWluYWwgSW5wdXQgRXZlbnRzXG4gICAgdGhpcy54dGVybS5vbkRhdGEoZGF0YSA9PiB0aGlzLnB0eS53cml0ZShkYXRhKSk7XG5cbiAgICAvLyBQcm9jZXNzIFRlcm1pbmFsIE91dHB1dCBFdmVudHNcbiAgICB0aGlzLnB0eS5vbkRhdGEoKGRhdGEpID0+IHtcbiAgICAgIGlmICh0aGlzLnh0ZXJtLmVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueHRlcm0ud3JpdGUoZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBQcm9jZXNzIFRlcm1pbmFsIEV4aXQgRXZlbnRzXG4gICAgdGhpcy5wdHkub25FeGl0KHRoaXMuZGVzdHJveS5iaW5kKHRoaXMpKTtcblxuICB9XG5cbiAgb3BlblBzZXVkb3Rlcm1pbmFsKCkge1xuICAgIGNvbnN0IHNoZWxsQXJndW1lbnRzID0gdGhpcy5zaGVsbEFyZ3VtZW50cy5zcGxpdCgvXFxzKy9nKS5maWx0ZXIoYXJnID0+IGFyZyk7XG5cbiAgICByZXR1cm4gc3Bhd25QdHkodGhpcy5zaGVsbFBhdGgsIHNoZWxsQXJndW1lbnRzLCB7XG4gICAgICBuYW1lOiAneHRlcm0tY29sb3InLFxuICAgICAgZW52OiB0aGlzLnNhbml0aXplZEVudmlyb25tZW50LFxuICAgICAgY3dkOiB0aGlzLndvcmtpbmdEaXJlY3RvcnlcbiAgICB9KTtcbiAgfVxuXG4gIC8vXG4gIC8vIENsZWFycyB0aGUgY29udGVudHMgb2YgdGhlIHRlcm1pbmFsIGJ1ZmZlci4gVGhpcyBpcyBhIHNpbXBsZSBwcm94eSB0byB0aGVcbiAgLy8gYGNsZWFyKClgIGZ1bmN0aW9uIG9uIHRoZSBYdGVybSBpbnN0YW5jZS5cbiAgLy9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy54dGVybS5jbGVhcigpO1xuICB9XG5cbiAgLy9cbiAgLy8gQ29waWVzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byB0aGUgQXRvbSBjbGlwYm9hcmQuXG4gIC8vXG4gIGNvcHlTZWxlY3Rpb24oKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gdGhpcy54dGVybS5nZXRTZWxlY3Rpb24oKTtcbiAgICBhdG9tLmNsaXBib2FyZC53cml0ZShzZWxlY3RlZFRleHQpO1xuICB9XG5cbiAgLy9cbiAgLy8gUGFzdGVzIHRoZSBjb250ZW50cyBvZiB0aGUgQXRvbSBjbGlwYm9hcmQgdG8gdGhlIHRlcm1pbmFsICh2aWEgdGhlXG4gIC8vIHBzZXVkb3Rlcm1pbmFsKS5cbiAgLy9cbiAgcGFzdGVGcm9tQ2xpcGJvYXJkKCkge1xuICAgIGNvbnN0IHRleHQgPSBhdG9tLmNsaXBib2FyZC5yZWFkKCk7XG4gICAgdGhpcy5wdHkud3JpdGUodGV4dCk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ1Rlcm1pbmFsU2Vzc2lvbicsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgc2FuaXRpemVFbnZpcm9ubWVudDogdGhpcy5zYW5pdGl6ZWRFbnZpcm9ubWVudEtleXMsXG4gICAgICAgIHNoZWxsQXJnczogdGhpcy5zaGVsbEFyZ3VtZW50cyxcbiAgICAgICAgc2hlbGxQYXRoOiB0aGlzLnNoZWxsUGF0aCxcbiAgICAgICAgd29ya2luZ0RpcmVjdG9yeTogdGhpcy53b3JraW5nRGlyZWN0b3J5XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICAvLyBLaWxsIHRoZSBQc2V1ZG90ZXJtaW5hbCAocHR5KSBQcm9jZXNzXG4gICAgaWYgKHRoaXMucHR5KSB0aGlzLnB0eS5raWxsKCk7XG5cbiAgICAvLyBEZXN0cm95IHRoZSBUZXJtaW5hbCBJbnN0YW5jZVxuICAgIGlmICh0aGlzLnh0ZXJtKSB0aGlzLnh0ZXJtLmRpc3Bvc2UoKTtcblxuICAgIC8vIE5vdGlmeSBhbnkgb2JzZXJ2ZXJzIHRoYXQgdGhpcyBzZXNzaW9uIGlzIGJlaW5nIGRlc3Ryb3llZC5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knLCB0aGlzKTtcblxuICAgIC8vIENsZWFuIHVwIGFueSBkaXNwb3NhYmxlcyB3ZSdyZSByZXNwb25zaWJsZSBmb3IuXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcblxuICB9XG5cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjayk7XG4gIH1cblxuICAvL1xuICAvLyBTZWxlY3QgYSB3b3JraW5nIGRpcmVjdG9yeSBmb3IgYSBuZXcgdGVybWluYWwuXG4gIC8vIFVzZXMgdGhlIHByb2plY3QgZm9sZGVyIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIGZpbGUsIGlmIGFueSxcbiAgLy8gb3RoZXJ3aXNlIGZhbGxzIGJhY2sgdG8gdGhlIGZpcnN0IHByb2plY3QncyBmb2xkZXIsIGlmIGFueSxcbiAgLy8gb3IgdGhlIHVzZXIncyBob21lIGRpcmVjdG9yeS5cbiAgLy9cbiAgX2dldFdvcmtpbmdEaXJlY3RvcnkoKSB7XG4gICAgaWYgKHRoaXMuX3dvcmtpbmdEaXJlY3RvcnkpIHJldHVybiB0aGlzLl93b3JraW5nRGlyZWN0b3J5O1xuXG4gICAgY29uc3QgYWN0aXZlSXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG4gICAgaWYgKGFjdGl2ZUl0ZW0gJiYgYWN0aXZlSXRlbS5idWZmZXIgJiYgYWN0aXZlSXRlbS5idWZmZXIuZmlsZSAmJiBhY3RpdmVJdGVtLmJ1ZmZlci5maWxlLnBhdGgpIHtcbiAgICAgIHJldHVybiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoYWN0aXZlSXRlbS5idWZmZXIuZmlsZS5wYXRoKVswXTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICBsZXQgY3dkO1xuICAgIGlmIChwcm9qZWN0UGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgY3dkID0gcHJvamVjdFBhdGhzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjd2QgPSBwcm9jZXNzLmVudi5IT01FO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aC5yZXNvbHZlKGN3ZCk7XG4gIH1cblxuICBnZXQgc2FuaXRpemVkRW52aXJvbm1lbnQoKSB7XG4gICAgY29uc3Qgc2FuaXRpemVkRW52aXJvbm1lbnQgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9jZXNzLmVudik7XG4gICAgY29uc3QgdmFyaWFibGVzVG9EZWxldGUgPSB0aGlzLnNhbml0aXplZEVudmlyb25tZW50S2V5cztcblxuICAgIGlmICh2YXJpYWJsZXNUb0RlbGV0ZSkge1xuICAgICAgdmFyaWFibGVzVG9EZWxldGUuZm9yRWFjaCgodmFyaWFibGUpID0+IHtcbiAgICAgICAgZGVsZXRlIHNhbml0aXplZEVudmlyb25tZW50W3ZhcmlhYmxlXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzYW5pdGl6ZWRFbnZpcm9ubWVudDtcbiAgfVxuXG4gIGdldCBzaGVsbFBhdGgoKSB7XG4gICAgaWYgKHRoaXMuX3NoZWxsUGF0aCkgcmV0dXJuIHRoaXMuX3NoZWxsUGF0aDtcbiAgICByZXR1cm4gdGhpcy5fc2hlbGxQYXRoID0gdGhpcy5jb25maWcuc2hlbGxQYXRoXG4gICAgICB8fCBhdG9tLmNvbmZpZy5nZXQoJ3Rlcm1pbmFsLXRhYi5zaGVsbFNldHRpbmdzLnNoZWxsUGF0aCcpXG4gICAgICB8fCBwcm9jZXNzLmVudi5TSEVMTFxuICAgICAgfHwgcHJvY2Vzcy5lbnYuQ09NU1BFQztcbiAgfVxuXG4gIGdldCBzaGVsbEFyZ3VtZW50cygpIHtcbiAgICBpZiAodGhpcy5fc2hlbGxBcmd1bWVudHMpIHJldHVybiB0aGlzLl9zaGVsbEFyZ3VtZW50cztcbiAgICByZXR1cm4gdGhpcy5fc2hlbGxBcmd1bWVudHMgPSB0aGlzLmNvbmZpZy5zaGVsbEFyZ3NcbiAgICAgIHx8IGF0b20uY29uZmlnLmdldCgndGVybWluYWwtdGFiLnNoZWxsU2V0dGluZ3Muc2hlbGxBcmdzJylcbiAgICAgIHx8ICcnO1xuICB9XG5cbiAgZ2V0IHNhbml0aXplZEVudmlyb25tZW50S2V5cygpIHtcbiAgICBpZiAodGhpcy5fc2FuaXRpemVkRW52aXJvbm1lbnRLZXlzKSByZXR1cm4gdGhpcy5fc2FuaXRpemVkRW52aXJvbm1lbnRLZXlzO1xuICAgIHJldHVybiB0aGlzLl9zYW5pdGl6ZWRFbnZpcm9ubWVudEtleXMgPSB0aGlzLmNvbmZpZy5zYW5pdGl6ZUVudmlyb25tZW50XG4gICAgICB8fCBhdG9tLmNvbmZpZy5nZXQoJ3Rlcm1pbmFsLXRhYi5zaGVsbFNldHRpbmdzLnNhbml0aXplRW52aXJvbm1lbnQnKTtcbiAgfVxuXG4gIGdldCB3b3JraW5nRGlyZWN0b3J5KCkge1xuICAgIGlmICh0aGlzLl93b3JraW5nRGlyZWN0b3J5KSByZXR1cm4gdGhpcy5fd29ya2luZ0RpcmVjdG9yeTtcbiAgICByZXR1cm4gdGhpcy5fd29ya2luZ0RpcmVjdG9yeSA9IHRoaXMuY29uZmlnLndvcmtpbmdEaXJlY3RvcnlcbiAgICAgIHx8IHRoaXMuX2dldFdvcmtpbmdEaXJlY3RvcnkoKTtcbiAgfVxuXG4gIGdldERlZmF1bHRMb2NhdGlvbigpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCd0ZXJtaW5hbC10YWIuZGVmYXVsdExvY2F0aW9uJyk7XG4gIH1cblxuICBnZXRJY29uTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Rlcm1pbmFsJztcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnVGVybWluYWwnO1xuICB9XG5cbn1cbiJdfQ==