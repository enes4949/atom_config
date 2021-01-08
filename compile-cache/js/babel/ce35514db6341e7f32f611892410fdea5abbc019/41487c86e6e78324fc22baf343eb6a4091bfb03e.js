Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var _helpers = require('./helpers');

var IndieDelegate = (function () {
  function IndieDelegate(indie, version) {
    _classCallCheck(this, IndieDelegate);

    this.indie = indie;
    this.scope = 'project';
    this.version = version;
    this.emitter = new _atom.Emitter();
    this.messages = new Map();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(IndieDelegate, [{
    key: 'getMessages',
    value: function getMessages() {
      var out = [];
      this.messages.forEach(function (m) {
        (0, _helpers.mergeArray)(out, m);
      });
      return out;
    }
  }, {
    key: 'clearMessages',
    value: function clearMessages() {
      if (!this.subscriptions.disposed) {
        this.emitter.emit('did-update', []);
        this.messages.clear();
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(filePath) {
      var messages = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      // v2 Support from here on
      if (typeof filePath !== 'string' || !Array.isArray(messages)) {
        throw new Error('Invalid Parameters to setMessages()');
      }
      if (this.subscriptions.disposed || !Validate.messages(this.name, messages)) {
        return;
      }
      messages.forEach(function (message) {
        if (message.location.file !== filePath) {
          console.debug('[Linter-UI-Default] Expected File', filePath, 'Message', message);
          throw new Error('message.location.file does not match the given filePath');
        }
      });

      (0, _helpers.normalizeMessages)(this.name, messages);
      this.messages.set(filePath, messages);
      this.emitter.emit('did-update', this.getMessages());
    }
  }, {
    key: 'setAllMessages',
    value: function setAllMessages(messages) {
      if (this.subscriptions.disposed) {
        return;
      }

      if (!Array.isArray(messages) || atom.inDevMode()) {
        if (!Validate.messages(this.name, messages)) return;
      }
      (0, _helpers.normalizeMessages)(this.name, messages);

      this.messages.clear();
      for (var i = 0, _length = messages.length; i < _length; ++i) {
        var message = messages[i];
        var filePath = message.location.file;
        var fileMessages = this.messages.get(filePath);
        if (!fileMessages) {
          this.messages.set(filePath, fileMessages = []);
        }
        fileMessages.push(message);
      }
      this.emitter.emit('did-update', this.getMessages());
    }
  }, {
    key: 'onDidUpdate',
    value: function onDidUpdate(callback) {
      return this.emitter.on('did-update', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.messages.clear();
    }
  }, {
    key: 'name',
    get: function get() {
      return this.indie.name;
    }
  }]);

  return IndieDelegate;
})();

exports['default'] = IndieDelegate;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLWRlbGVnYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07O3dCQUd6QixZQUFZOztJQUExQixRQUFROzt1QkFDMEIsV0FBVzs7SUFHcEMsYUFBYTtBQVFyQixXQVJRLGFBQWEsQ0FRcEIsS0FBWSxFQUFFLE9BQVUsRUFBRTswQkFSbkIsYUFBYTs7QUFTOUIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7QUFDbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUE7QUFDdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7QUFDdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN6QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBakJrQixhQUFhOztXQXFCckIsdUJBQW1CO0FBQzVCLFVBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQTtBQUNkLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxFQUFJO0FBQ3pCLGlDQUFXLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtPQUNuQixDQUFDLENBQUE7QUFDRixhQUFPLEdBQUcsQ0FBQTtLQUNYOzs7V0FDWSx5QkFBUztBQUNwQixVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUU7QUFDaEMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ25DLFlBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7T0FDdEI7S0FDRjs7O1dBQ1UscUJB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QUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN0Qjs7O1NBbkVPLGVBQVc7QUFDakIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQTtLQUN2Qjs7O1NBcEJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRpZS1kZWxlZ2F0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0ICogYXMgVmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCB7IG5vcm1hbGl6ZU1lc3NhZ2VzLCBtZXJnZUFycmF5IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBJbmRpZSwgTWVzc2FnZSB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGllRGVsZWdhdGUge1xuICBpbmRpZTogSW5kaWVcbiAgc2NvcGU6ICdwcm9qZWN0J1xuICBlbWl0dGVyOiBFbWl0dGVyXG4gIHZlcnNpb246IDJcbiAgbWVzc2FnZXM6IE1hcDw/c3RyaW5nLCBBcnJheTxNZXNzYWdlPj5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN0cnVjdG9yKGluZGllOiBJbmRpZSwgdmVyc2lvbjogMikge1xuICAgIHRoaXMuaW5kaWUgPSBpbmRpZVxuICAgIHRoaXMuc2NvcGUgPSAncHJvamVjdCdcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWFwKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmluZGllLm5hbWVcbiAgfVxuICBnZXRNZXNzYWdlcygpOiBBcnJheTxNZXNzYWdlPiB7XG4gICAgY29uc3Qgb3V0ID0gW11cbiAgICB0aGlzLm1lc3NhZ2VzLmZvckVhY2gobSA9PiB7XG4gICAgICBtZXJnZUFycmF5KG91dCwgbSlcbiAgICB9KVxuICAgIHJldHVybiBvdXRcbiAgfVxuICBjbGVhck1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2VkKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScsIFtdKVxuICAgICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gICAgfVxuICB9XG4gIHNldE1lc3NhZ2VzKGZpbGVQYXRoOiBzdHJpbmcgfCBBcnJheTxPYmplY3Q+LCBtZXNzYWdlczogP0FycmF5PE9iamVjdD4gPSBudWxsKTogdm9pZCB7XG4gICAgLy8gdjIgU3VwcG9ydCBmcm9tIGhlcmUgb25cbiAgICBpZiAodHlwZW9mIGZpbGVQYXRoICE9PSAnc3RyaW5nJyB8fCAhQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBQYXJhbWV0ZXJzIHRvIHNldE1lc3NhZ2VzKCknKVxuICAgIH1cbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2VkIHx8ICFWYWxpZGF0ZS5tZXNzYWdlcyh0aGlzLm5hbWUsIG1lc3NhZ2VzKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIG1lc3NhZ2VzLmZvckVhY2goZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgaWYgKG1lc3NhZ2UubG9jYXRpb24uZmlsZSAhPT0gZmlsZVBhdGgpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnW0xpbnRlci1VSS1EZWZhdWx0XSBFeHBlY3RlZCBGaWxlJywgZmlsZVBhdGgsICdNZXNzYWdlJywgbWVzc2FnZSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtZXNzYWdlLmxvY2F0aW9uLmZpbGUgZG9lcyBub3QgbWF0Y2ggdGhlIGdpdmVuIGZpbGVQYXRoJylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgbm9ybWFsaXplTWVzc2FnZXModGhpcy5uYW1lLCBtZXNzYWdlcylcbiAgICB0aGlzLm1lc3NhZ2VzLnNldChmaWxlUGF0aCwgbWVzc2FnZXMpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnLCB0aGlzLmdldE1lc3NhZ2VzKCkpXG4gIH1cbiAgc2V0QWxsTWVzc2FnZXMobWVzc2FnZXM6IEFycmF5PE9iamVjdD4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2VkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpIHx8IGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICAgIGlmICghVmFsaWRhdGUubWVzc2FnZXModGhpcy5uYW1lLCBtZXNzYWdlcykpIHJldHVyblxuICAgIH1cbiAgICBub3JtYWxpemVNZXNzYWdlcyh0aGlzLm5hbWUsIG1lc3NhZ2VzKVxuXG4gICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gICAgZm9yIChsZXQgaSA9IDAsIHsgbGVuZ3RoIH0gPSBtZXNzYWdlczsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBtZXNzYWdlOiBNZXNzYWdlID0gbWVzc2FnZXNbaV1cbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gbWVzc2FnZS5sb2NhdGlvbi5maWxlXG4gICAgICBsZXQgZmlsZU1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlcy5nZXQoZmlsZVBhdGgpXG4gICAgICBpZiAoIWZpbGVNZXNzYWdlcykge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnNldChmaWxlUGF0aCwgKGZpbGVNZXNzYWdlcyA9IFtdKSlcbiAgICAgIH1cbiAgICAgIGZpbGVNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJywgdGhpcy5nZXRNZXNzYWdlcygpKVxuICB9XG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKVxuICB9XG59XG4iXX0=