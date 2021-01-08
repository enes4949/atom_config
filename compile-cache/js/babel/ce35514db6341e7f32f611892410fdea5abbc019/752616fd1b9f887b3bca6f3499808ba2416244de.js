Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _lodashDebounce = require('lodash/debounce');

var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

var _helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    _classCallCheck(this, MessageRegistry);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.messagesMap = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.debouncedUpdate = (0, _lodashDebounce2['default'])(this.update, 100, { leading: true });

    this.subscriptions.add(this.emitter);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var messages = _ref.messages;
      var linter = _ref.linter;
      var buffer = _ref.buffer;
      return (function () {
        // check if the linter has been already set
        var found = null;
        for (var entry of this.messagesMap) {
          if (entry.buffer === buffer && entry.linter === linter) {
            found = entry;
            break;
          }
        }

        if (found) {
          // found linter
          found.messages = messages;
          found.changed = true;
        } else {
          // new linter
          this.messagesMap.add({ messages: messages, linter: linter, buffer: buffer, oldMessages: [], changed: true, deleted: false });
        }
        this.debouncedUpdate();
      }).apply(this, arguments);
    }
  }, {
    key: 'update',
    value: function update() {
      // the final object sent to UI that contains the messages tagged for adding/removeal. messages is all the kept + added messages
      var result = { added: [], removed: [], messages: [] };

      // looping over each linter
      for (var entry of this.messagesMap) {
        // if linter is deleted
        // tag the linter's cache for removal and delete it from the map
        if (entry.deleted) {
          (0, _helpers.mergeArray)(result.removed, entry.oldMessages);
          this.messagesMap['delete'](entry);
          continue;
        }

        // if the linter is not changed
        // just use its cache (no added/removed and everything is kept) and skip the rest
        if (!entry.changed) {
          // TODO When this code acutally runs?!
          (0, _helpers.mergeArray)(result.messages, entry.oldMessages);
          continue;
        }

        // flag messages as oldKept, oldRemoved, newAdded
        var flaggedMessages = (0, _helpers.flagMessages)(entry.messages, entry.oldMessages);

        // update the result and cache
        if (flaggedMessages !== null) {
          var oldKept = flaggedMessages.oldKept;
          var oldRemoved = flaggedMessages.oldRemoved;
          var newAdded = flaggedMessages.newAdded;

          (0, _helpers.mergeArray)(result.added, newAdded);
          (0, _helpers.mergeArray)(result.removed, oldRemoved);
          var allThisEntry = newAdded.concat(oldKept);
          (0, _helpers.mergeArray)(result.messages, allThisEntry);
          entry.oldMessages = allThisEntry; // update chache
        }
      }

      // if any messages is removed or added, then update the UI
      if (result.added.length || result.removed.length) {
        this.messages = result.messages;
        this.emitter.emit('did-update-messages', result);
      }
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteByBuffer',
    value: function deleteByBuffer(buffer) {
      for (var entry of this.messagesMap) {
        if (entry.buffer === buffer) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'deleteByLinter',
    value: function deleteByLinter(linter) {
      for (var entry of this.messagesMap) {
        if (entry.linter === linter) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return MessageRegistry;
})();

exports['default'] = MessageRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFNkMsTUFBTTs7OEJBQzlCLGlCQUFpQjs7Ozt1QkFFRyxXQUFXOztJQVk5QyxlQUFlO0FBT1IsV0FQUCxlQUFlLEdBT0w7MEJBUFYsZUFBZTs7QUFRakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxlQUFlLEdBQUcsaUNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTs7QUFFcEUsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQWZHLGVBQWU7O1dBZ0JoQixhQUFDLElBQThGO1VBQTVGLFFBQVEsR0FBVixJQUE4RixDQUE1RixRQUFRO1VBQUUsTUFBTSxHQUFsQixJQUE4RixDQUFsRixNQUFNO1VBQUUsTUFBTSxHQUExQixJQUE4RixDQUExRSxNQUFNOzBCQUFzRTs7QUFFbEcsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLGFBQUssSUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQyxjQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQ3RELGlCQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2Isa0JBQUs7V0FDTjtTQUNGOztBQUVELFlBQUksS0FBSyxFQUFFOztBQUVULGVBQUssQ0FBQyxRQUFR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QyxlQUFlLEVBQUUsQ0FBQTtLQUN2Qjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FuR0csZUFBZTs7O3FCQXNHTixlQUFlIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2gvZGVib3VuY2UnXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUsIFRleHRCdWZmZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgZmxhZ01lc3NhZ2VzLCBtZXJnZUFycmF5IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlc1BhdGNoLCBNZXNzYWdlLCBMaW50ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG50eXBlIExpbnRlciRNZXNzYWdlJE1hcCA9IHtcbiAgYnVmZmVyOiA/VGV4dEJ1ZmZlcixcbiAgbGludGVyOiBMaW50ZXIsXG4gIGNoYW5nZWQ6IGJvb2xlYW4sXG4gIGRlbGV0ZWQ6IGJvb2xlYW4sXG4gIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlPixcbiAgb2xkTWVzc2FnZXM6IEFycmF5PE1lc3NhZ2U+LFxufVxuXG5jbGFzcyBNZXNzYWdlUmVnaXN0cnkge1xuICBlbWl0dGVyOiBFbWl0dGVyXG4gIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlPlxuICBtZXNzYWdlc01hcDogU2V0PExpbnRlciRNZXNzYWdlJE1hcD5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBkZWJvdW5jZWRVcGRhdGU6ICgpID0+IHZvaWRcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5tZXNzYWdlc01hcCA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSA9IGRlYm91bmNlKHRoaXMudXBkYXRlLCAxMDAsIHsgbGVhZGluZzogdHJ1ZSB9KVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgc2V0KHsgbWVzc2FnZXMsIGxpbnRlciwgYnVmZmVyIH06IHsgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2U+LCBsaW50ZXI6IExpbnRlciwgYnVmZmVyOiBUZXh0QnVmZmVyIH0pIHtcbiAgICAvLyBjaGVjayBpZiB0aGUgbGludGVyIGhhcyBiZWVuIGFscmVhZHkgc2V0XG4gICAgbGV0IGZvdW5kID0gbnVsbFxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5tZXNzYWdlc01hcCkge1xuICAgICAgaWYgKGVudHJ5LmJ1ZmZlciA9PT0gYnVmZmVyICYmIGVudHJ5LmxpbnRlciA9PT0gbGludGVyKSB7XG4gICAgICAgIGZvdW5kID0gZW50cnlcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIC8vIGZvdW5kIGxpbnRlclxuICAgICAgZm91bmQubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgICAgZm91bmQuY2hhbmdlZCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbmV3IGxpbnRlclxuICAgICAgdGhpcy5tZXNzYWdlc01hcC5hZGQoeyBtZXNzYWdlcywgbGludGVyLCBidWZmZXIsIG9sZE1lc3NhZ2VzOiBbXSwgY2hhbmdlZDogdHJ1ZSwgZGVsZXRlZDogZmFsc2UgfSlcbiAgICB9XG4gICAgdGhpcy5kZWJvdW5jZWRVcGRhdGUoKVxuICB9XG4gIHVwZGF0ZSgpIHtcbiAgICAvLyB0aGUgZmluYWwgb2JqZWN0IHNlbnQgdG8gVUkgdGhhdCBjb250YWlucyB0aGUgbWVzc2FnZXMgdGFnZ2VkIGZvciBhZGRpbmcvcmVtb3ZlYWwuIG1lc3NhZ2VzIGlzIGFsbCB0aGUga2VwdCArIGFkZGVkIG1lc3NhZ2VzXG4gICAgY29uc3QgcmVzdWx0ID0geyBhZGRlZDogW10sIHJlbW92ZWQ6IFtdLCBtZXNzYWdlczogW10gfVxuXG4gICAgLy8gbG9vcGluZyBvdmVyIGVhY2ggbGludGVyXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLm1lc3NhZ2VzTWFwKSB7XG4gICAgICAvLyBpZiBsaW50ZXIgaXMgZGVsZXRlZFxuICAgICAgLy8gdGFnIHRoZSBsaW50ZXIncyBjYWNoZSBmb3IgcmVtb3ZhbCBhbmQgZGVsZXRlIGl0IGZyb20gdGhlIG1hcFxuICAgICAgaWYgKGVudHJ5LmRlbGV0ZWQpIHtcbiAgICAgICAgbWVyZ2VBcnJheShyZXN1bHQucmVtb3ZlZCwgZW50cnkub2xkTWVzc2FnZXMpXG4gICAgICAgIHRoaXMubWVzc2FnZXNNYXAuZGVsZXRlKGVudHJ5KVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgbGludGVyIGlzIG5vdCBjaGFuZ2VkXG4gICAgICAvLyBqdXN0IHVzZSBpdHMgY2FjaGUgKG5vIGFkZGVkL3JlbW92ZWQgYW5kIGV2ZXJ5dGhpbmcgaXMga2VwdCkgYW5kIHNraXAgdGhlIHJlc3RcbiAgICAgIGlmICghZW50cnkuY2hhbmdlZCkge1xuICAgICAgICAvLyBUT0RPIFdoZW4gdGhpcyBjb2RlIGFjdXRhbGx5IHJ1bnM/IVxuICAgICAgICBtZXJnZUFycmF5KHJlc3VsdC5tZXNzYWdlcywgZW50cnkub2xkTWVzc2FnZXMpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIGZsYWcgbWVzc2FnZXMgYXMgb2xkS2VwdCwgb2xkUmVtb3ZlZCwgbmV3QWRkZWRcbiAgICAgIGNvbnN0IGZsYWdnZWRNZXNzYWdlcyA9IGZsYWdNZXNzYWdlcyhlbnRyeS5tZXNzYWdlcywgZW50cnkub2xkTWVzc2FnZXMpXG5cbiAgICAgIC8vIHVwZGF0ZSB0aGUgcmVzdWx0IGFuZCBjYWNoZVxuICAgICAgaWYgKGZsYWdnZWRNZXNzYWdlcyAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB7IG9sZEtlcHQsIG9sZFJlbW92ZWQsIG5ld0FkZGVkIH0gPSBmbGFnZ2VkTWVzc2FnZXNcbiAgICAgICAgbWVyZ2VBcnJheShyZXN1bHQuYWRkZWQsIG5ld0FkZGVkKVxuICAgICAgICBtZXJnZUFycmF5KHJlc3VsdC5yZW1vdmVkLCBvbGRSZW1vdmVkKVxuICAgICAgICBjb25zdCBhbGxUaGlzRW50cnkgPSBuZXdBZGRlZC5jb25jYXQob2xkS2VwdClcbiAgICAgICAgbWVyZ2VBcnJheShyZXN1bHQubWVzc2FnZXMsIGFsbFRoaXNFbnRyeSlcbiAgICAgICAgZW50cnkub2xkTWVzc2FnZXMgPSBhbGxUaGlzRW50cnkgLy8gdXBkYXRlIGNoYWNoZVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIGFueSBtZXNzYWdlcyBpcyByZW1vdmVkIG9yIGFkZGVkLCB0aGVuIHVwZGF0ZSB0aGUgVUlcbiAgICBpZiAocmVzdWx0LmFkZGVkLmxlbmd0aCB8fCByZXN1bHQucmVtb3ZlZC5sZW5ndGgpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSByZXN1bHQubWVzc2FnZXNcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgcmVzdWx0KVxuICAgIH1cbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrOiAoZGlmZmVyZW5jZTogTWVzc2FnZXNQYXRjaCkgPT4gdm9pZCk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBkZWxldGVCeUJ1ZmZlcihidWZmZXI6IFRleHRCdWZmZXIpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5idWZmZXIgPT09IGJ1ZmZlcikge1xuICAgICAgICBlbnRyeS5kZWxldGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSgpXG4gIH1cbiAgZGVsZXRlQnlMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5saW50ZXIgPT09IGxpbnRlcikge1xuICAgICAgICBlbnRyeS5kZWxldGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSgpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVzc2FnZVJlZ2lzdHJ5XG4iXX0=