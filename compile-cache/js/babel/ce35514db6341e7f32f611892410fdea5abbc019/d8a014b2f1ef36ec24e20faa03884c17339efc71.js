var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _atom = require('atom');

// $FlowIgnore: Cursor is a type

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _helpers = require('../helpers');

var _helpers2 = require('./helpers');

var Editor = (function () {
  function Editor(textEditor) {
    var _this = this;

    _classCallCheck(this, Editor);

    this.tooltip = null;
    this.emitter = new _atom.Emitter();
    this.markers = new Map();
    this.messages = new Map();
    this.textEditor = textEditor;
    this.subscriptions = new _atom.CompositeDisposable();
    this.ignoreTooltipInvocation = false;
    this.currentLineMarker = null;
    this.lastRange = null;
    this.lastEmpty = null;
    this.lastCursorPositions = new WeakMap();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.showTooltip', function (showTooltip) {
      _this.showTooltip = showTooltip;
      if (!_this.showTooltip && _this.tooltip) {
        _this.removeTooltip();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showProviderName', function (showProviderName) {
      _this.showProviderName = showProviderName;
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
      var notInitial = typeof _this.showDecorations !== 'undefined';
      _this.showDecorations = showDecorations;
      if (notInitial) {
        _this.updateGutter();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.gutterPosition', function (gutterPosition) {
      var notInitial = typeof _this.gutterPosition !== 'undefined';
      _this.gutterPosition = gutterPosition;
      if (notInitial) {
        _this.updateGutter();
      }
    }));
    this.subscriptions.add(textEditor.onDidDestroy(function () {
      _this.dispose();
    }));

    var tooltipSubscription = undefined;
    this.subscriptions.add(atom.config.observe('linter-ui-default.tooltipFollows', function (tooltipFollows) {
      _this.tooltipFollows = tooltipFollows;
      if (tooltipSubscription) {
        tooltipSubscription.dispose();
      }
      tooltipSubscription = new _atom.CompositeDisposable();
      if (tooltipFollows === 'Mouse' || tooltipFollows === 'Both') {
        tooltipSubscription.add(_this.listenForMouseMovement());
      }
      if (tooltipFollows === 'Keyboard' || tooltipFollows === 'Both') {
        tooltipSubscription.add(_this.listenForKeyboardMovement());
      }
      _this.removeTooltip();
    }));
    this.subscriptions.add(new _atom.Disposable(function () {
      tooltipSubscription.dispose();
    }));

    this.subscriptions.add(textEditor.onDidChangeCursorPosition(function (_ref) {
      var cursor = _ref.cursor;
      var newBufferPosition = _ref.newBufferPosition;

      var lastBufferPosition = _this.lastCursorPositions.get(cursor);
      if (!lastBufferPosition || !lastBufferPosition.isEqual(newBufferPosition)) {
        _this.lastCursorPositions.set(cursor, newBufferPosition);
        _this.ignoreTooltipInvocation = false;
      }
      if (_this.tooltipFollows === 'Mouse') {
        _this.removeTooltip();
      }
    }));
    this.subscriptions.add(textEditor.getBuffer().onDidChangeText(function () {
      var cursors = textEditor.getCursors();
      cursors.forEach(function (cursor) {
        _this.lastCursorPositions.set(cursor, cursor.getBufferPosition());
      });
      if (_this.tooltipFollows !== 'Mouse') {
        _this.ignoreTooltipInvocation = true;
        _this.removeTooltip();
      }
    }));
    this.updateGutter();
    this.listenForCurrentLine();
  }

  _createClass(Editor, [{
    key: 'listenForCurrentLine',
    value: function listenForCurrentLine() {
      var _this2 = this;

      this.subscriptions.add(this.textEditor.observeCursors(function (cursor) {
        var handlePositionChange = function handlePositionChange(_ref2) {
          var start = _ref2.start;
          var end = _ref2.end;

          var gutter = _this2.gutter;
          if (!gutter || _this2.subscriptions.disposed) return;
          // We need that Range.fromObject hack below because when we focus index 0 on multi-line selection
          // end.column is the column of the last line but making a range out of two and then accesing
          // the end seems to fix it (black magic?)
          var currentRange = _atom.Range.fromObject([start, end]);
          var linesRange = _atom.Range.fromObject([[start.row, 0], [end.row, Infinity]]);
          var currentEmpty = currentRange.isEmpty();

          // NOTE: Atom does not paint gutter if multi-line and last line has zero index
          if (start.row !== end.row && currentRange.end.column === 0) {
            linesRange.end.row--;
          }
          if (_this2.lastRange && _this2.lastRange.isEqual(linesRange) && currentEmpty === _this2.lastEmpty) return;
          if (_this2.currentLineMarker) {
            _this2.currentLineMarker.destroy();
            _this2.currentLineMarker = null;
          }
          _this2.lastRange = linesRange;
          _this2.lastEmpty = currentEmpty;

          _this2.currentLineMarker = _this2.textEditor.markScreenRange(linesRange, {
            invalidate: 'never'
          });
          var item = document.createElement('span');
          item.className = 'line-number cursor-line linter-cursor-line ' + (currentEmpty ? 'cursor-line-no-selection' : '');
          gutter.decorateMarker(_this2.currentLineMarker, {
            item: item,
            'class': 'linter-row'
          });
        };

        var cursorMarker = cursor.getMarker();
        var subscriptions = new _atom.CompositeDisposable();
        subscriptions.add(cursorMarker.onDidChange(function (_ref3) {
          var newHeadScreenPosition = _ref3.newHeadScreenPosition;
          var newTailScreenPosition = _ref3.newTailScreenPosition;

          handlePositionChange({
            start: newHeadScreenPosition,
            end: newTailScreenPosition
          });
        }));
        subscriptions.add(cursor.onDidDestroy(function () {
          _this2.subscriptions.remove(subscriptions);
          subscriptions.dispose();
        }));
        subscriptions.add(new _atom.Disposable(function () {
          if (this.currentLineMarker) {
            this.currentLineMarker.destroy();
            this.currentLineMarker = null;
          }
        }));
        _this2.subscriptions.add(subscriptions);
        handlePositionChange(cursorMarker.getScreenRange());
      }));
    }
  }, {
    key: 'listenForMouseMovement',
    value: function listenForMouseMovement() {
      var _this3 = this;

      var editorElement = atom.views.getView(this.textEditor);

      return (0, _disposableEvent2['default'])(editorElement, 'mousemove', (0, _lodash.debounce)(function (event) {
        if (!editorElement.component || _this3.subscriptions.disposed || !(0, _helpers2.hasParent)(event.target, 'div.scroll-view')) {
          return;
        }
        var tooltip = _this3.tooltip;
        if (tooltip && (0, _helpers2.mouseEventNearPosition)({
          event: event,
          editor: _this3.textEditor,
          editorElement: editorElement,
          tooltipElement: tooltip.element,
          screenPosition: tooltip.marker.getStartScreenPosition()
        })) {
          return;
        }

        _this3.cursorPosition = (0, _helpers2.getBufferPositionFromMouseEvent)(event, _this3.textEditor, editorElement);
        _this3.ignoreTooltipInvocation = false;
        if (_this3.textEditor.largeFileMode) {
          // NOTE: Ignore if file is too large
          _this3.cursorPosition = null;
        }
        if (_this3.cursorPosition) {
          _this3.updateTooltip(_this3.cursorPosition);
        } else {
          _this3.removeTooltip();
        }
      }, 300, true));
    }
  }, {
    key: 'listenForKeyboardMovement',
    value: function listenForKeyboardMovement() {
      var _this4 = this;

      return this.textEditor.onDidChangeCursorPosition((0, _lodash.debounce)(function (_ref4) {
        var newBufferPosition = _ref4.newBufferPosition;

        _this4.cursorPosition = newBufferPosition;
        _this4.updateTooltip(newBufferPosition);
      }, 16));
    }
  }, {
    key: 'updateGutter',
    value: function updateGutter() {
      var _this5 = this;

      this.removeGutter();
      if (!this.showDecorations) {
        this.gutter = null;
        return;
      }
      var priority = this.gutterPosition === 'Left' ? -100 : 100;
      this.gutter = this.textEditor.addGutter({
        name: 'linter-ui-default',
        priority: priority
      });
      this.markers.forEach(function (markers, key) {
        var message = _this5.messages.get(key);
        if (message) {
          for (var marker of markers) {
            _this5.decorateMarker(message, marker, 'gutter');
          }
        }
      });
    }
  }, {
    key: 'removeGutter',
    value: function removeGutter() {
      if (this.gutter) {
        try {
          this.gutter.destroy();
        } catch (_) {
          /* This throws when the text editor is disposed */
        }
      }
    }
  }, {
    key: 'updateTooltip',
    value: function updateTooltip(position) {
      var _this6 = this;

      if (!position || this.tooltip && this.tooltip.isValid(position, this.messages)) {
        return;
      }
      this.removeTooltip();
      if (!this.showTooltip) {
        return;
      }
      if (this.ignoreTooltipInvocation) {
        return;
      }

      var messages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, this.textEditor.getPath(), position);
      if (!messages.length) {
        return;
      }

      this.tooltip = new _tooltip2['default'](messages, position, this.textEditor);

      // save markers of the tooltip (for destorying them in this.apply)
      messages.forEach(function (message) {
        // $FlowIgnore: this.tooltip is not null
        _this6.saveMarker(message.key, _this6.tooltip.marker);
      });

      // $FlowIgnore: this.tooltip is not null
      this.tooltip.onDidDestroy(function () {
        _this6.tooltip = null;
      });
    }
  }, {
    key: 'removeTooltip',
    value: function removeTooltip() {
      if (this.tooltip) {
        this.tooltip.marker.destroy();
      }
    }
  }, {
    key: 'apply',
    value: function apply(added, removed) {
      var _this7 = this;

      var textBuffer = this.textEditor.getBuffer();

      for (var i = 0, _length = removed.length; i < _length; i++) {
        var message = removed[i];
        this.destroyMarker(message.key);
      }

      var _loop = function (i, _length2) {
        var message = added[i];
        var markerRange = (0, _helpers.$range)(message);
        if (!markerRange) {
          // Only for backward compatibility
          return 'continue';
        }
        var marker = textBuffer.markRange(markerRange, {
          invalidate: 'never'
        });
        _this7.decorateMarker(message, marker);
        marker.onDidChange(function (_ref5) {
          var oldHeadPosition = _ref5.oldHeadPosition;
          var newHeadPosition = _ref5.newHeadPosition;
          var isValid = _ref5.isValid;

          if (!isValid || newHeadPosition.row === 0 && oldHeadPosition.row !== 0) {
            return;
          }
          if (message.version === 2) {
            message.location.position = marker.previousEventState.range;
          }
        });
      };

      for (var i = 0, _length2 = added.length; i < _length2; i++) {
        var _ret = _loop(i, _length2);

        if (_ret === 'continue') continue;
      }

      this.updateTooltip(this.cursorPosition);
    }
  }, {
    key: 'decorateMarker',
    value: function decorateMarker(message, marker) {
      var paint = arguments.length <= 2 || arguments[2] === undefined ? 'both' : arguments[2];

      this.saveMarker(message.key, marker);
      this.messages.set(message.key, message);

      if (paint === 'both' || paint === 'editor') {
        this.textEditor.decorateMarker(marker, {
          type: 'text',
          'class': 'linter-highlight linter-' + message.severity
        });
      }

      var gutter = this.gutter;
      if (gutter && (paint === 'both' || paint === 'gutter')) {
        var element = document.createElement('span');
        element.className = 'linter-gutter linter-gutter-' + message.severity + ' icon icon-' + (message.icon || 'primitive-dot');
        gutter.decorateMarker(marker, {
          'class': 'linter-row',
          item: element
        });
      }
    }

    // add marker to the message => marker map
  }, {
    key: 'saveMarker',
    value: function saveMarker(key, marker) {
      var allMarkers = this.markers.get(key) || [];
      allMarkers.push(marker);
      this.markers.set(key, allMarkers);
    }

    // destroy markers of a key
  }, {
    key: 'destroyMarker',
    value: function destroyMarker(key) {
      var markers = this.markers.get(key);
      if (markers) {
        markers.forEach(function (marker) {
          if (marker) {
            marker.destroy();
          }
        });
      }
      this.markers['delete'](key);
      this.messages['delete'](key);
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
      this.removeGutter();
      this.removeTooltip();
    }
  }]);

  return Editor;
})();

module.exports = Editor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFFeUIsUUFBUTs7K0JBQ0wsa0JBQWtCOzs7O29CQUNrQixNQUFNOzs7O3VCQUlsRCxZQUFZOzs7O3VCQUNxQixZQUFZOzt3QkFDa0IsV0FBVzs7SUFHeEYsTUFBTTtBQW9CQyxXQXBCUCxNQUFNLENBb0JFLFVBQXNCLEVBQUU7OzswQkFwQmhDLE1BQU07O0FBcUJSLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQTtBQUNwQyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0FBQzdCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBOztBQUV4QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLCtCQUErQixFQUFFLFVBQUEsV0FBVyxFQUFJO0FBQ2xFLFlBQUssV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixVQUFJ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ci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGRpc3Bvc2FibGVFdmVudCBmcm9tICdkaXNwb3NhYmxlLWV2ZW50J1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSwgRW1pdHRlciwgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuLy8gJEZsb3dJZ25vcmU6IEN1cnNvciBpcyBhIHR5cGVcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciwgQnVmZmVyTWFya2VyLCBUZXh0RWRpdG9yR3V0dGVyLCBQb2ludCwgQ3Vyc29yIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vdG9vbHRpcCdcbmltcG9ydCB7ICRyYW5nZSwgZmlsdGVyTWVzc2FnZXNCeVJhbmdlT3JQb2ludCB9IGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgeyBoYXNQYXJlbnQsIG1vdXNlRXZlbnROZWFyUG9zaXRpb24sIGdldEJ1ZmZlclBvc2l0aW9uRnJvbU1vdXNlRXZlbnQgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuY2xhc3MgRWRpdG9yIHtcbiAgZ3V0dGVyOiA/VGV4dEVkaXRvckd1dHRlclxuICB0b29sdGlwOiA/VG9vbHRpcFxuICBlbWl0dGVyOiBFbWl0dGVyXG4gIG1hcmtlcnM6IE1hcDxzdHJpbmcsIEFycmF5PEJ1ZmZlck1hcmtlcj4+XG4gIG1lc3NhZ2VzOiBNYXA8c3RyaW5nLCBMaW50ZXJNZXNzYWdlPlxuICB0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yXG4gIHNob3dUb29sdGlwOiBib29sZWFuXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgY3Vyc29yUG9zaXRpb246ID9Qb2ludFxuICBndXR0ZXJQb3NpdGlvbjogYm9vbGVhblxuICB0b29sdGlwRm9sbG93czogc3RyaW5nXG4gIHNob3dEZWNvcmF0aW9uczogYm9vbGVhblxuICBzaG93UHJvdmlkZXJOYW1lOiBib29sZWFuXG4gIGlnbm9yZVRvb2x0aXBJbnZvY2F0aW9uOiBib29sZWFuXG4gIGN1cnJlbnRMaW5lTWFya2VyOiA/QnVmZmVyTWFya2VyXG4gIGxhc3RSYW5nZTogP1JhbmdlXG4gIGxhc3RFbXB0eTogP1JhbmdlXG4gIGxhc3RDdXJzb3JQb3NpdGlvbnM6IFdlYWtNYXA8Q3Vyc29yLCBQb2ludD5cblxuICBjb25zdHJ1Y3Rvcih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgdGhpcy50b29sdGlwID0gbnVsbFxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1hcmtlcnMgPSBuZXcgTWFwKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1hcCgpXG4gICAgdGhpcy50ZXh0RWRpdG9yID0gdGV4dEVkaXRvclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmlnbm9yZVRvb2x0aXBJbnZvY2F0aW9uID0gZmFsc2VcbiAgICB0aGlzLmN1cnJlbnRMaW5lTWFya2VyID0gbnVsbFxuICAgIHRoaXMubGFzdFJhbmdlID0gbnVsbFxuICAgIHRoaXMubGFzdEVtcHR5ID0gbnVsbFxuICAgIHRoaXMubGFzdEN1cnNvclBvc2l0aW9ucyA9IG5ldyBXZWFrTWFwKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93VG9vbHRpcCcsIHNob3dUb29sdGlwID0+IHtcbiAgICAgICAgdGhpcy5zaG93VG9vbHRpcCA9IHNob3dUb29sdGlwXG4gICAgICAgIGlmICghdGhpcy5zaG93VG9vbHRpcCAmJiB0aGlzLnRvb2x0aXApIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQcm92aWRlck5hbWUnLCBzaG93UHJvdmlkZXJOYW1lID0+IHtcbiAgICAgICAgdGhpcy5zaG93UHJvdmlkZXJOYW1lID0gc2hvd1Byb3ZpZGVyTmFtZVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93RGVjb3JhdGlvbnMnLCBzaG93RGVjb3JhdGlvbnMgPT4ge1xuICAgICAgICBjb25zdCBub3RJbml0aWFsID0gdHlwZW9mIHRoaXMuc2hvd0RlY29yYXRpb25zICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICB0aGlzLnNob3dEZWNvcmF0aW9ucyA9IHNob3dEZWNvcmF0aW9uc1xuICAgICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICAgIHRoaXMudXBkYXRlR3V0dGVyKClcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5ndXR0ZXJQb3NpdGlvbicsIGd1dHRlclBvc2l0aW9uID0+IHtcbiAgICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLmd1dHRlclBvc2l0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICB0aGlzLmd1dHRlclBvc2l0aW9uID0gZ3V0dGVyUG9zaXRpb25cbiAgICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGV4dEVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgICAgfSksXG4gICAgKVxuXG4gICAgbGV0IHRvb2x0aXBTdWJzY3JpcHRpb25cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQudG9vbHRpcEZvbGxvd3MnLCB0b29sdGlwRm9sbG93cyA9PiB7XG4gICAgICAgIHRoaXMudG9vbHRpcEZvbGxvd3MgPSB0b29sdGlwRm9sbG93c1xuICAgICAgICBpZiAodG9vbHRpcFN1YnNjcmlwdGlvbikge1xuICAgICAgICAgIHRvb2x0aXBTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgIH1cbiAgICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgICAgaWYgKHRvb2x0aXBGb2xsb3dzID09PSAnTW91c2UnIHx8IHRvb2x0aXBGb2xsb3dzID09PSAnQm90aCcpIHtcbiAgICAgICAgICB0b29sdGlwU3Vic2NyaXB0aW9uLmFkZCh0aGlzLmxpc3RlbkZvck1vdXNlTW92ZW1lbnQoKSlcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9vbHRpcEZvbGxvd3MgPT09ICdLZXlib2FyZCcgfHwgdG9vbHRpcEZvbGxvd3MgPT09ICdCb3RoJykge1xuICAgICAgICAgIHRvb2x0aXBTdWJzY3JpcHRpb24uYWRkKHRoaXMubGlzdGVuRm9yS2V5Ym9hcmRNb3ZlbWVudCgpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0b29sdGlwU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgfSksXG4gICAgKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRleHRFZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoeyBjdXJzb3IsIG5ld0J1ZmZlclBvc2l0aW9uIH0pID0+IHtcbiAgICAgICAgY29uc3QgbGFzdEJ1ZmZlclBvc2l0aW9uID0gdGhpcy5sYXN0Q3Vyc29yUG9zaXRpb25zLmdldChjdXJzb3IpXG4gICAgICAgIGlmICghbGFzdEJ1ZmZlclBvc2l0aW9uIHx8ICFsYXN0QnVmZmVyUG9zaXRpb24uaXNFcXVhbChuZXdCdWZmZXJQb3NpdGlvbikpIHtcbiAgICAgICAgICB0aGlzLmxhc3RDdXJzb3JQb3NpdGlvbnMuc2V0KGN1cnNvciwgbmV3QnVmZmVyUG9zaXRpb24pXG4gICAgICAgICAgdGhpcy5pZ25vcmVUb29sdGlwSW52b2NhdGlvbiA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudG9vbHRpcEZvbGxvd3MgPT09ICdNb3VzZScpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2VUZXh0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY3Vyc29ycyA9IHRleHRFZGl0b3IuZ2V0Q3Vyc29ycygpXG4gICAgICAgIGN1cnNvcnMuZm9yRWFjaChjdXJzb3IgPT4ge1xuICAgICAgICAgIHRoaXMubGFzdEN1cnNvclBvc2l0aW9ucy5zZXQoY3Vyc29yLCBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHRoaXMudG9vbHRpcEZvbGxvd3MgIT09ICdNb3VzZScpIHtcbiAgICAgICAgICB0aGlzLmlnbm9yZVRvb2x0aXBJbnZvY2F0aW9uID0gdHJ1ZVxuICAgICAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgdGhpcy5saXN0ZW5Gb3JDdXJyZW50TGluZSgpXG4gIH1cbiAgbGlzdGVuRm9yQ3VycmVudExpbmUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMudGV4dEVkaXRvci5vYnNlcnZlQ3Vyc29ycyhjdXJzb3IgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVQb3NpdGlvbkNoYW5nZSA9ICh7IHN0YXJ0LCBlbmQgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGd1dHRlciA9IHRoaXMuZ3V0dGVyXG4gICAgICAgICAgaWYgKCFndXR0ZXIgfHwgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2VkKSByZXR1cm5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRoYXQgUmFuZ2UuZnJvbU9iamVjdCBoYWNrIGJlbG93IGJlY2F1c2Ugd2hlbiB3ZSBmb2N1cyBpbmRleCAwIG9uIG11bHRpLWxpbmUgc2VsZWN0aW9uXG4gICAgICAgICAgLy8gZW5kLmNvbHVtbiBpcyB0aGUgY29sdW1uIG9mIHRoZSBsYXN0IGxpbmUgYnV0IG1ha2luZyBhIHJhbmdlIG91dCBvZiB0d28gYW5kIHRoZW4gYWNjZXNpbmdcbiAgICAgICAgICAvLyB0aGUgZW5kIHNlZW1zIHRvIGZpeCBpdCAoYmxhY2sgbWFnaWM/KVxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW3N0YXJ0LCBlbmRdKVxuICAgICAgICAgIGNvbnN0IGxpbmVzUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbc3RhcnQucm93LCAwXSwgW2VuZC5yb3csIEluZmluaXR5XV0pXG4gICAgICAgICAgY29uc3QgY3VycmVudEVtcHR5ID0gY3VycmVudFJhbmdlLmlzRW1wdHkoKVxuXG4gICAgICAgICAgLy8gTk9URTogQXRvbSBkb2VzIG5vdCBwYWludCBndXR0ZXIgaWYgbXVsdGktbGluZSBhbmQgbGFzdCBsaW5lIGhhcyB6ZXJvIGluZGV4XG4gICAgICAgICAgaWYgKHN0YXJ0LnJvdyAhPT0gZW5kLnJvdyAmJiBjdXJyZW50UmFuZ2UuZW5kLmNvbHVtbiA9PT0gMCkge1xuICAgICAgICAgICAgbGluZXNSYW5nZS5lbmQucm93LS1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMubGFzdFJhbmdlICYmIHRoaXMubGFzdFJhbmdlLmlzRXF1YWwobGluZXNSYW5nZSkgJiYgY3VycmVudEVtcHR5ID09PSB0aGlzLmxhc3RFbXB0eSkgcmV0dXJuXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudExpbmVNYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExpbmVNYXJrZXIuZGVzdHJveSgpXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lTWFya2VyID0gbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmxhc3RSYW5nZSA9IGxpbmVzUmFuZ2VcbiAgICAgICAgICB0aGlzLmxhc3RFbXB0eSA9IGN1cnJlbnRFbXB0eVxuXG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZU1hcmtlciA9IHRoaXMudGV4dEVkaXRvci5tYXJrU2NyZWVuUmFuZ2UobGluZXNSYW5nZSwge1xuICAgICAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IGBsaW5lLW51bWJlciBjdXJzb3ItbGluZSBsaW50ZXItY3Vyc29yLWxpbmUgJHtjdXJyZW50RW1wdHkgPyAnY3Vyc29yLWxpbmUtbm8tc2VsZWN0aW9uJyA6ICcnfWBcbiAgICAgICAgICBndXR0ZXIuZGVjb3JhdGVNYXJrZXIodGhpcy5jdXJyZW50TGluZU1hcmtlciwge1xuICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgIGNsYXNzOiAnbGludGVyLXJvdycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN1cnNvck1hcmtlciA9IGN1cnNvci5nZXRNYXJrZXIoKVxuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICBjdXJzb3JNYXJrZXIub25EaWRDaGFuZ2UoKHsgbmV3SGVhZFNjcmVlblBvc2l0aW9uLCBuZXdUYWlsU2NyZWVuUG9zaXRpb24gfSkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlUG9zaXRpb25DaGFuZ2Uoe1xuICAgICAgICAgICAgICBzdGFydDogbmV3SGVhZFNjcmVlblBvc2l0aW9uLFxuICAgICAgICAgICAgICBlbmQ6IG5ld1RhaWxTY3JlZW5Qb3NpdGlvbixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgICAgY3Vyc29yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICAgIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudExpbmVNYXJrZXIpIHtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TGluZU1hcmtlci5kZXN0cm95KClcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TGluZU1hcmtlciA9IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIGhhbmRsZVBvc2l0aW9uQ2hhbmdlKGN1cnNvck1hcmtlci5nZXRTY3JlZW5SYW5nZSgpKVxuICAgICAgfSksXG4gICAgKVxuICB9XG4gIGxpc3RlbkZvck1vdXNlTW92ZW1lbnQoKSB7XG4gICAgY29uc3QgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLnRleHRFZGl0b3IpXG5cbiAgICByZXR1cm4gZGlzcG9zYWJsZUV2ZW50KFxuICAgICAgZWRpdG9yRWxlbWVudCxcbiAgICAgICdtb3VzZW1vdmUnLFxuICAgICAgZGVib3VuY2UoXG4gICAgICAgIGV2ZW50ID0+IHtcbiAgICAgICAgICBpZiAoIWVkaXRvckVsZW1lbnQuY29tcG9uZW50IHx8IHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlZCB8fCAhaGFzUGFyZW50KGV2ZW50LnRhcmdldCwgJ2Rpdi5zY3JvbGwtdmlldycpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdG9vbHRpcCA9IHRoaXMudG9vbHRpcFxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRvb2x0aXAgJiZcbiAgICAgICAgICAgIG1vdXNlRXZlbnROZWFyUG9zaXRpb24oe1xuICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgZWRpdG9yOiB0aGlzLnRleHRFZGl0b3IsXG4gICAgICAgICAgICAgIGVkaXRvckVsZW1lbnQsXG4gICAgICAgICAgICAgIHRvb2x0aXBFbGVtZW50OiB0b29sdGlwLmVsZW1lbnQsXG4gICAgICAgICAgICAgIHNjcmVlblBvc2l0aW9uOiB0b29sdGlwLm1hcmtlci5nZXRTdGFydFNjcmVlblBvc2l0aW9uKCksXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IGdldEJ1ZmZlclBvc2l0aW9uRnJvbU1vdXNlRXZlbnQoZXZlbnQsIHRoaXMudGV4dEVkaXRvciwgZWRpdG9yRWxlbWVudClcbiAgICAgICAgICB0aGlzLmlnbm9yZVRvb2x0aXBJbnZvY2F0aW9uID0gZmFsc2VcbiAgICAgICAgICBpZiAodGhpcy50ZXh0RWRpdG9yLmxhcmdlRmlsZU1vZGUpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IElnbm9yZSBpZiBmaWxlIGlzIHRvbyBsYXJnZVxuICAgICAgICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuY3Vyc29yUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVG9vbHRpcCh0aGlzLmN1cnNvclBvc2l0aW9uKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgMzAwLFxuICAgICAgICB0cnVlLFxuICAgICAgKSxcbiAgICApXG4gIH1cbiAgbGlzdGVuRm9yS2V5Ym9hcmRNb3ZlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oXG4gICAgICBkZWJvdW5jZSgoeyBuZXdCdWZmZXJQb3NpdGlvbiB9KSA9PiB7XG4gICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSBuZXdCdWZmZXJQb3NpdGlvblxuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAobmV3QnVmZmVyUG9zaXRpb24pXG4gICAgICB9LCAxNiksXG4gICAgKVxuICB9XG4gIHVwZGF0ZUd1dHRlcigpIHtcbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgaWYgKCF0aGlzLnNob3dEZWNvcmF0aW9ucykge1xuICAgICAgdGhpcy5ndXR0ZXIgPSBudWxsXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcHJpb3JpdHkgPSB0aGlzLmd1dHRlclBvc2l0aW9uID09PSAnTGVmdCcgPyAtMTAwIDogMTAwXG4gICAgdGhpcy5ndXR0ZXIgPSB0aGlzLnRleHRFZGl0b3IuYWRkR3V0dGVyKHtcbiAgICAgIG5hbWU6ICdsaW50ZXItdWktZGVmYXVsdCcsXG4gICAgICBwcmlvcml0eSxcbiAgICB9KVxuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKChtYXJrZXJzOiBBcnJheTxCdWZmZXJNYXJrZXI+LCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMubWVzc2FnZXMuZ2V0KGtleSlcbiAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIG1hcmtlcnMpIHtcbiAgICAgICAgICB0aGlzLmRlY29yYXRlTWFya2VyKG1lc3NhZ2UsIG1hcmtlciwgJ2d1dHRlcicpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIHJlbW92ZUd1dHRlcigpIHtcbiAgICBpZiAodGhpcy5ndXR0ZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ3V0dGVyLmRlc3Ryb3koKVxuICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAvKiBUaGlzIHRocm93cyB3aGVuIHRoZSB0ZXh0IGVkaXRvciBpcyBkaXNwb3NlZCAqL1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB1cGRhdGVUb29sdGlwKHBvc2l0aW9uOiA/UG9pbnQpIHtcbiAgICBpZiAoIXBvc2l0aW9uIHx8ICh0aGlzLnRvb2x0aXAgJiYgdGhpcy50b29sdGlwLmlzVmFsaWQocG9zaXRpb24sIHRoaXMubWVzc2FnZXMpKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgaWYgKCF0aGlzLnNob3dUb29sdGlwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuaWdub3JlVG9vbHRpcEludm9jYXRpb24pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXNCeVJhbmdlT3JQb2ludCh0aGlzLm1lc3NhZ2VzLCB0aGlzLnRleHRFZGl0b3IuZ2V0UGF0aCgpLCBwb3NpdGlvbilcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwID0gbmV3IFRvb2x0aXAobWVzc2FnZXMsIHBvc2l0aW9uLCB0aGlzLnRleHRFZGl0b3IpXG5cbiAgICAvLyBzYXZlIG1hcmtlcnMgb2YgdGhlIHRvb2x0aXAgKGZvciBkZXN0b3J5aW5nIHRoZW0gaW4gdGhpcy5hcHBseSlcbiAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgLy8gJEZsb3dJZ25vcmU6IHRoaXMudG9vbHRpcCBpcyBub3QgbnVsbFxuICAgICAgdGhpcy5zYXZlTWFya2VyKG1lc3NhZ2Uua2V5LCB0aGlzLnRvb2x0aXAubWFya2VyKVxuICAgIH0pXG5cbiAgICAvLyAkRmxvd0lnbm9yZTogdGhpcy50b29sdGlwIGlzIG5vdCBudWxsXG4gICAgdGhpcy50b29sdGlwLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBudWxsXG4gICAgfSlcbiAgfVxuICByZW1vdmVUb29sdGlwKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5tYXJrZXIuZGVzdHJveSgpXG4gICAgfVxuICB9XG4gIGFwcGx5KGFkZGVkOiBBcnJheTxMaW50ZXJNZXNzYWdlPiwgcmVtb3ZlZDogQXJyYXk8TGludGVyTWVzc2FnZT4pIHtcbiAgICBjb25zdCB0ZXh0QnVmZmVyID0gdGhpcy50ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcmVtb3ZlZC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHJlbW92ZWRbaV1cbiAgICAgIHRoaXMuZGVzdHJveU1hcmtlcihtZXNzYWdlLmtleSlcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gYWRkZWQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhZGRlZFtpXVxuICAgICAgY29uc3QgbWFya2VyUmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICAgIGlmICghbWFya2VyUmFuZ2UpIHtcbiAgICAgICAgLy8gT25seSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgbWFya2VyID0gdGV4dEJ1ZmZlci5tYXJrUmFuZ2UobWFya2VyUmFuZ2UsIHtcbiAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgIH0pXG4gICAgICB0aGlzLmRlY29yYXRlTWFya2VyKG1lc3NhZ2UsIG1hcmtlcilcbiAgICAgIG1hcmtlci5vbkRpZENoYW5nZSgoeyBvbGRIZWFkUG9zaXRpb24sIG5ld0hlYWRQb3NpdGlvbiwgaXNWYWxpZCB9KSA9PiB7XG4gICAgICAgIGlmICghaXNWYWxpZCB8fCAobmV3SGVhZFBvc2l0aW9uLnJvdyA9PT0gMCAmJiBvbGRIZWFkUG9zaXRpb24ucm93ICE9PSAwKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIpIHtcbiAgICAgICAgICBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uID0gbWFya2VyLnByZXZpb3VzRXZlbnRTdGF0ZS5yYW5nZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVG9vbHRpcCh0aGlzLmN1cnNvclBvc2l0aW9uKVxuICB9XG4gIGRlY29yYXRlTWFya2VyKG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UsIG1hcmtlcjogQnVmZmVyTWFya2VyLCBwYWludDogJ2d1dHRlcicgfCAnZWRpdG9yJyB8ICdib3RoJyA9ICdib3RoJykge1xuICAgIHRoaXMuc2F2ZU1hcmtlcihtZXNzYWdlLmtleSwgbWFya2VyKVxuICAgIHRoaXMubWVzc2FnZXMuc2V0KG1lc3NhZ2Uua2V5LCBtZXNzYWdlKVxuXG4gICAgaWYgKHBhaW50ID09PSAnYm90aCcgfHwgcGFpbnQgPT09ICdlZGl0b3InKSB7XG4gICAgICB0aGlzLnRleHRFZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgY2xhc3M6IGBsaW50ZXItaGlnaGxpZ2h0IGxpbnRlci0ke21lc3NhZ2Uuc2V2ZXJpdHl9YCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgZ3V0dGVyID0gdGhpcy5ndXR0ZXJcbiAgICBpZiAoZ3V0dGVyICYmIChwYWludCA9PT0gJ2JvdGgnIHx8IHBhaW50ID09PSAnZ3V0dGVyJykpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gYGxpbnRlci1ndXR0ZXIgbGludGVyLWd1dHRlci0ke21lc3NhZ2Uuc2V2ZXJpdHl9IGljb24gaWNvbi0ke21lc3NhZ2UuaWNvbiB8fCAncHJpbWl0aXZlLWRvdCd9YFxuICAgICAgZ3V0dGVyLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICBjbGFzczogJ2xpbnRlci1yb3cnLFxuICAgICAgICBpdGVtOiBlbGVtZW50LFxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvLyBhZGQgbWFya2VyIHRvIHRoZSBtZXNzYWdlID0+IG1hcmtlciBtYXBcbiAgc2F2ZU1hcmtlcihrZXk6IHN0cmluZywgbWFya2VyOiBCdWZmZXJNYXJrZXIpIHtcbiAgICBjb25zdCBhbGxNYXJrZXJzID0gdGhpcy5tYXJrZXJzLmdldChrZXkpIHx8IFtdXG4gICAgYWxsTWFya2Vycy5wdXNoKG1hcmtlcilcbiAgICB0aGlzLm1hcmtlcnMuc2V0KGtleSwgYWxsTWFya2VycylcbiAgfVxuXG4gIC8vIGRlc3Ryb3kgbWFya2VycyBvZiBhIGtleVxuICBkZXN0cm95TWFya2VyKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgbWFya2VycyA9IHRoaXMubWFya2Vycy5nZXQoa2V5KVxuICAgIGlmIChtYXJrZXJzKSB7XG4gICAgICBtYXJrZXJzLmZvckVhY2gobWFya2VyID0+IHtcbiAgICAgICAgaWYgKG1hcmtlcikge1xuICAgICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5tYXJrZXJzLmRlbGV0ZShrZXkpXG4gICAgdGhpcy5tZXNzYWdlcy5kZWxldGUoa2V5KVxuICB9XG5cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRvclxuIl19