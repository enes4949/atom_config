var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _helpers = require('../helpers');

var TooltipElement = (function () {
  function TooltipElement(messages, position, textEditor) {
    var _this = this;

    _classCallCheck(this, TooltipElement);

    this.emitter = new _atom.Emitter();
    this.element = document.createElement('div');
    this.messages = messages;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.marker = textEditor.markBufferRange([position, position]);
    this.marker.onDidDestroy(function () {
      return _this.emitter.emit('did-destroy');
    });

    var delegate = new _delegate2['default']();
    this.element.id = 'linter-tooltip';
    textEditor.decorateMarker(this.marker, {
      type: 'overlay',
      item: this.element
    });
    this.subscriptions.add(delegate);

    var children = [];
    messages.forEach(function (message) {
      if (message.version === 2) {
        children.push(_react2['default'].createElement(_message2['default'], { key: message.key, delegate: delegate, message: message }));
      }
    });
    _reactDom2['default'].render(_react2['default'].createElement(
      'linter-messages',
      null,
      children
    ), this.element);
  }

  _createClass(TooltipElement, [{
    key: 'isValid',
    value: function isValid(position, messages) {
      if (this.messages.length !== 1 || !messages.has(this.messages[0].key)) {
        return false;
      }
      var range = (0, _helpers.$range)(this.messages[0]);
      return Boolean(range && range.containsPoint(position));
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
    }
  }]);

  return TooltipElement;
})();

module.exports = TooltipElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBRWtCLE9BQU87Ozs7d0JBQ0osV0FBVzs7OztvQkFDYSxNQUFNOzt3QkFHOUIsWUFBWTs7Ozt1QkFDTixXQUFXOzs7O3VCQUNmLFlBQVk7O0lBRzdCLGNBQWM7QUFPUCxXQVBQLGNBQWMsQ0FPTixRQUE4QixFQUFFLFFBQWUsRUFBRSxVQUFzQixFQUFFOzs7MEJBUGpGLGNBQWM7O0FBUWhCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBQzlELFFBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQU0sTUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztLQUFBLENBQUMsQ0FBQTs7QUFFaEUsUUFBTSxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUMvQixRQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQTtBQUNsQyxjQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDckMsVUFBSSxFQUFFLFNBQVM7QUFDZixVQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87S0FDbkIsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRWhDLFFBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNuQixZQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQzFCLFVBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLEVBQUU7QUFDekIsZ0JBQVEsQ0FBQyxJQUFJLENBQUMseURBQWdCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxBQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsR0FBRyxDQUFDLENBQUE7T0FDMUY7S0FDRixDQUFDLENBQUE7QUFDRiwwQkFBUyxNQUFNLENBQUM7OztNQUFrQixRQUFRO0tBQW1CLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQzdFOztlQWhDRyxjQUFjOztXQWlDWCxpQkFBQyxRQUFlLEVBQUUsUUFBb0MsRUFBVztBQUN0RSxVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNyRSxlQUFPLEtBQUssQ0FBQTtPQUNiO0FBQ0QsVUFBTSxLQUFLLEdBQUcscUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RDLGFBQU8sT0FBTyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7S0FDdkQ7OztXQUNXLHNCQUFDLFFBQW1CLEVBQWM7QUFDNUMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3pDOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQTlDRyxjQUFjOzs7QUFpRHBCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFBIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSwgUG9pbnQsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBNZXNzYWdlRWxlbWVudCBmcm9tICcuL21lc3NhZ2UnXG5pbXBvcnQgeyAkcmFuZ2UgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFRvb2x0aXBFbGVtZW50IHtcbiAgbWFya2VyOiBPYmplY3RcbiAgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgZW1pdHRlcjogRW1pdHRlclxuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPiwgcG9zaXRpb246IFBvaW50LCB0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5tYXJrZXIgPSB0ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbcG9zaXRpb24sIHBvc2l0aW9uXSlcbiAgICB0aGlzLm1hcmtlci5vbkRpZERlc3Ryb3koKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JykpXG5cbiAgICBjb25zdCBkZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSgpXG4gICAgdGhpcy5lbGVtZW50LmlkID0gJ2xpbnRlci10b29sdGlwJ1xuICAgIHRleHRFZGl0b3IuZGVjb3JhdGVNYXJrZXIodGhpcy5tYXJrZXIsIHtcbiAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgIGl0ZW06IHRoaXMuZWxlbWVudCxcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZGVsZWdhdGUpXG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG4gICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaCg8TWVzc2FnZUVsZW1lbnQga2V5PXttZXNzYWdlLmtleX0gZGVsZWdhdGU9e2RlbGVnYXRlfSBtZXNzYWdlPXttZXNzYWdlfSAvPilcbiAgICAgIH1cbiAgICB9KVxuICAgIFJlYWN0RE9NLnJlbmRlcig8bGludGVyLW1lc3NhZ2VzPntjaGlsZHJlbn08L2xpbnRlci1tZXNzYWdlcz4sIHRoaXMuZWxlbWVudClcbiAgfVxuICBpc1ZhbGlkKHBvc2l0aW9uOiBQb2ludCwgbWVzc2FnZXM6IE1hcDxzdHJpbmcsIExpbnRlck1lc3NhZ2U+KTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubWVzc2FnZXMubGVuZ3RoICE9PSAxIHx8ICFtZXNzYWdlcy5oYXModGhpcy5tZXNzYWdlc1swXS5rZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgcmFuZ2UgPSAkcmFuZ2UodGhpcy5tZXNzYWdlc1swXSlcbiAgICByZXR1cm4gQm9vbGVhbihyYW5nZSAmJiByYW5nZS5jb250YWluc1BvaW50KHBvc2l0aW9uKSlcbiAgfVxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2s6ICgpID0+IGFueSk6IERpc3Bvc2FibGUge1xuICAgIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcEVsZW1lbnRcbiJdfQ==