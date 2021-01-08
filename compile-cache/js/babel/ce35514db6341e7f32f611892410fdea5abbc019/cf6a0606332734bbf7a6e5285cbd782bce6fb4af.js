Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _mobx = require("mobx");

var _display = require("./display");

var _display2 = _interopRequireDefault(_display);

var _status = require("./status");

var _status2 = _interopRequireDefault(_status);

var SCROLL_HEIGHT = 600;

var ResultViewComponent = (function (_React$Component) {
  var _instanceInitializers = {};

  _inherits(ResultViewComponent, _React$Component);

  function ResultViewComponent() {
    var _this = this;

    _classCallCheck(this, _ResultViewComponent);

    _get(Object.getPrototypeOf(_ResultViewComponent.prototype), "constructor", this).apply(this, arguments);

    this.containerTooltip = new _atom.CompositeDisposable();
    this.buttonTooltip = new _atom.CompositeDisposable();
    this.closeTooltip = new _atom.CompositeDisposable();

    _defineDecoratedPropertyDescriptor(this, "expanded", _instanceInitializers);

    this.getAllText = function () {
      if (!_this.el) return "";
      return _this.el.innerText ? _this.el.innerText : "";
    };

    this.handleClick = function (event) {
      if (event.ctrlKey || event.metaKey) {
        _this.openInEditor();
      } else {
        _this.copyToClipboard();
      }
    };

    this.checkForSelection = function (event) {
      var selection = document.getSelection();
      if (selection && selection.toString()) {
        return;
      } else {
        _this.handleClick(event);
      }
    };

    this.copyToClipboard = function () {
      atom.clipboard.write(_this.getAllText());
      atom.notifications.addSuccess("Copied to clipboard");
    };

    this.openInEditor = function () {
      atom.workspace.open().then(function (editor) {
        return editor.insertText(_this.getAllText());
      });
    };

    this.addCopyTooltip = function (element, comp) {
      if (!element || !comp.disposables || comp.disposables.size > 0) return;
      comp.add(atom.tooltips.add(element, {
        title: "Click to copy,\n          " + (process.platform === "darwin" ? "Cmd" : "Ctrl") + "+Click to open in editor"
      }));
    };

    this.addCloseButtonTooltip = function (element, comp) {
      if (!element || !comp.disposables || comp.disposables.size > 0) return;
      comp.add(atom.tooltips.add(element, {
        title: _this.props.store.executionCount ? "Close (Out[" + _this.props.store.executionCount + "])" : "Close result"
      }));
    };

    this.addCopyButtonTooltip = function (element) {
      _this.addCopyTooltip(element, _this.buttonTooltip);
    };

    this.onWheel = function (element) {
      return function (event) {
        var clientHeight = element.clientHeight;
        var scrollHeight = element.scrollHeight;
        var clientWidth = element.clientWidth;
        var scrollWidth = element.scrollWidth;
        var scrollTop = element.scrollTop;
        var scrollLeft = element.scrollLeft;
        var atTop = scrollTop !== 0 && event.deltaY < 0;
        var atLeft = scrollLeft !== 0 && event.deltaX < 0;
        var atBottom = scrollTop !== scrollHeight - clientHeight && event.deltaY > 0;
        var atRight = scrollLeft !== scrollWidth - clientWidth && event.deltaX > 0;

        if (clientHeight < scrollHeight && (atTop || atBottom)) {
          event.stopPropagation();
        } else if (clientWidth < scrollWidth && (atLeft || atRight)) {
          event.stopPropagation();
        }
      };
    };

    _defineDecoratedPropertyDescriptor(this, "toggleExpand", _instanceInitializers);
  }

  _createDecoratedClass(ResultViewComponent, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props$store = this.props.store;
      var outputs = _props$store.outputs;
      var status = _props$store.status;
      var isPlain = _props$store.isPlain;
      var position = _props$store.position;

      var inlineStyle = {
        marginLeft: position.lineLength + position.charWidth + "px",
        marginTop: "-" + position.lineHeight + "px",
        userSelect: "text"
      };

      if (outputs.length === 0 || this.props.showResult === false) {
        var _kernel = this.props.kernel;
        return _react2["default"].createElement(_status2["default"], {
          status: _kernel && _kernel.executionState !== "busy" && status === "running" ? "error" : status,
          style: inlineStyle
        });
      }

      return _react2["default"].createElement(
        "div",
        {
          className: (isPlain ? "inline-container" : "multiline-container") + " native-key-bindings",
          tabIndex: "-1",
          onClick: isPlain ? this.checkForSelection : undefined,
          style: isPlain ? inlineStyle : {
            maxWidth: position.editorWidth - 2 * position.charWidth + "px",
            margin: "0px",
            userSelect: "text"
          },
          "hydrogen-wrapoutput": atom.config.get("Hydrogen.wrapOutput").toString()
        },
        _react2["default"].createElement(
          "div",
          {
            className: "hydrogen_cell_display",
            ref: function (ref) {
              if (!ref) return;
              _this2.el = ref;

              isPlain ? _this2.addCopyTooltip(ref, _this2.containerTooltip) : _this2.containerTooltip.dispose();

              // As of this writing React's event handler doesn't properly handle
              // event.stopPropagation() for events outside the React context.
              if (!_this2.expanded && !isPlain && ref) {
                ref.addEventListener("wheel", _this2.onWheel(ref), {
                  passive: true
                });
              }
            },
            style: {
              maxHeight: this.expanded ? "100%" : SCROLL_HEIGHT + "px",
              overflowY: "auto"
            }
          },
          outputs.map(function (output, index) {
            return _react2["default"].createElement(_display2["default"], { output: output, key: index });
          })
        ),
        isPlain ? null : _react2["default"].createElement(
          "div",
          { className: "toolbar" },
          _react2["default"].createElement("div", {
            className: "icon icon-x",
            onClick: this.props.destroy,
            ref: function (ref) {
              return _this2.addCloseButtonTooltip(ref, _this2.closeTooltip);
            }
          }),
          _react2["default"].createElement("div", { style: { flex: 1, minHeight: "0.25em" } }),
          this.getAllText().length > 0 ? _react2["default"].createElement("div", {
            className: "icon icon-clippy",
            onClick: this.handleClick,
            ref: this.addCopyButtonTooltip
          }) : null,
          this.el && this.el.scrollHeight > SCROLL_HEIGHT ? _react2["default"].createElement("div", {
            className: "icon icon-" + (this.expanded ? "fold" : "unfold"),
            onClick: this.toggleExpand
          }) : null
        )
      );
    }
  }, {
    key: "scrollToBottom",
    value: function scrollToBottom() {
      if (!this.el || this.expanded === true || this.props.store.isPlain === true || atom.config.get("Hydrogen.autoScroll") === false) return;
      var scrollHeight = this.el.scrollHeight;
      var height = this.el.clientHeight;
      var maxScrollTop = scrollHeight - height;
      this.el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.scrollToBottom();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.scrollToBottom();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.containerTooltip.dispose();
      this.buttonTooltip.dispose();
      this.closeTooltip.dispose();
    }
  }, {
    key: "expanded",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return false;
    },
    enumerable: true
  }, {
    key: "toggleExpand",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function () {
        _this3.expanded = !_this3.expanded;
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  var _ResultViewComponent = ResultViewComponent;
  ResultViewComponent = (0, _mobxReact.observer)(ResultViewComponent) || ResultViewComponent;
  return ResultViewComponent;
})(_react2["default"].Component);

exports["default"] = ResultViewComponent;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9yZXN1bHQtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUVvQyxNQUFNOztxQkFDeEIsT0FBTzs7Ozt5QkFDQSxZQUFZOztvQkFDRixNQUFNOzt1QkFDckIsV0FBVzs7OztzQkFDWixVQUFVOzs7O0FBSzdCLElBQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQzs7SUFVcEIsbUJBQW1COzs7WUFBbkIsbUJBQW1COztXQUFuQixtQkFBbUI7Ozs7Ozs7U0FFdkIsZ0JBQWdCLEdBQUcsK0JBQXlCO1NBQzVDLGFBQWEsR0FBRywrQkFBeUI7U0FDekMsWUFBWSxHQUFHLCtCQUF5Qjs7OztTQUl4QyxVQUFVLEdBQUcsWUFBTTtBQUNqQixVQUFJLENBQUMsTUFBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDeEIsYUFBTyxNQUFLLEVBQUUsQ0FBQyxTQUFTLEdBQUcsTUFBSyxFQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztLQUNuRDs7U0FFRCxXQUFXLEdBQUcsVUFBQyxLQUFLLEVBQWlCO0FBQ25DLFVBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ2xDLGNBQUssWUFBWSxFQUFFLENBQUM7T0FDckIsTUFBTTtBQUNMLGNBQUssZUFBZSxFQUFFLENBQUM7T0FDeEI7S0FDRjs7U0FFRCxpQkFBaUIsR0FBRyxVQUFDLEtBQUssRUFBaUI7QUFDekMsVUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzFDLFVBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtBQUNyQyxlQUFPO09BQ1IsTUFBTTtBQUNMLGNBQUssV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3pCO0tBQ0Y7O1NBRUQsZUFBZSxHQUFHLFlBQU07QUFDdEIs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Q0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7O1dBRWdCLDZCQUFHO0FBQ2xCLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7O1dBRW1CLGdDQUFHO0FBQ3JCLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDN0I7Ozs7O2FBMU5tQixLQUFLOzs7Ozs7Ozs7YUF5RlYsWUFBTTtBQUNuQixlQUFLLFFBQVEsR0FBRyxDQUFDLE9BQUssUUFBUSxDQUFDO09BQ2hDOzs7Ozs2QkFqR0csbUJBQW1CO0FBQW5CLHFCQUFtQiw0QkFBbkIsbUJBQW1CLEtBQW5CLG1CQUFtQjtTQUFuQixtQkFBbUI7R0FBUyxtQkFBTSxTQUFTOztxQkFtT2xDLG1CQUFtQiIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvcmVzdWx0LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCB7IGFjdGlvbiwgb2JzZXJ2YWJsZSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgRGlzcGxheSBmcm9tIFwiLi9kaXNwbGF5XCI7XG5pbXBvcnQgU3RhdHVzIGZyb20gXCIuL3N0YXR1c1wiO1xuXG5pbXBvcnQgdHlwZSBPdXRwdXRTdG9yZSBmcm9tIFwiLi8uLi8uLi9zdG9yZS9vdXRwdXRcIjtcbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi8uLi8uLi9rZXJuZWxcIjtcblxuY29uc3QgU0NST0xMX0hFSUdIVCA9IDYwMDtcblxudHlwZSBQcm9wcyA9IHtcbiAgc3RvcmU6IE91dHB1dFN0b3JlLFxuICBrZXJuZWw6ID9LZXJuZWwsXG4gIGRlc3Ryb3k6IEZ1bmN0aW9uLFxuICBzaG93UmVzdWx0OiBib29sZWFuLFxufTtcblxuQG9ic2VydmVyXG5jbGFzcyBSZXN1bHRWaWV3Q29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzPiB7XG4gIGVsOiA/SFRNTEVsZW1lbnQ7XG4gIGNvbnRhaW5lclRvb2x0aXAgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICBidXR0b25Ub29sdGlwID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgY2xvc2VUb29sdGlwID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgQG9ic2VydmFibGVcbiAgZXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBnZXRBbGxUZXh0ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5lbCkgcmV0dXJuIFwiXCI7XG4gICAgcmV0dXJuIHRoaXMuZWwuaW5uZXJUZXh0ID8gdGhpcy5lbC5pbm5lclRleHQgOiBcIlwiO1xuICB9O1xuXG4gIGhhbmRsZUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkge1xuICAgICAgdGhpcy5vcGVuSW5FZGl0b3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb3B5VG9DbGlwYm9hcmQoKTtcbiAgICB9XG4gIH07XG5cbiAgY2hlY2tGb3JTZWxlY3Rpb24gPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBkb2N1bWVudC5nZXRTZWxlY3Rpb24oKTtcbiAgICBpZiAoc2VsZWN0aW9uICYmIHNlbGVjdGlvbi50b1N0cmluZygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlQ2xpY2soZXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICBjb3B5VG9DbGlwYm9hcmQgPSAoKSA9PiB7XG4gICAgYXRvbS5jbGlwYm9hcmQud3JpdGUodGhpcy5nZXRBbGxUZXh0KCkpO1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiQ29waWVkIHRvIGNsaXBib2FyZFwiKTtcbiAgfTtcblxuICBvcGVuSW5FZGl0b3IgPSAoKSA9PiB7XG4gICAgYXRvbS53b3Jrc3BhY2VcbiAgICAgIC5vcGVuKClcbiAgICAgIC50aGVuKChlZGl0b3IpID0+IGVkaXRvci5pbnNlcnRUZXh0KHRoaXMuZ2V0QWxsVGV4dCgpKSk7XG4gIH07XG5cbiAgYWRkQ29weVRvb2x0aXAgPSAoZWxlbWVudDogP0hUTUxFbGVtZW50LCBjb21wOiBhdG9tJENvbXBvc2l0ZURpc3Bvc2FibGUpID0+IHtcbiAgICBpZiAoIWVsZW1lbnQgfHwgIWNvbXAuZGlzcG9zYWJsZXMgfHwgY29tcC5kaXNwb3NhYmxlcy5zaXplID4gMCkgcmV0dXJuO1xuICAgIGNvbXAuYWRkKFxuICAgICAgYXRvbS50b29sdGlwcy5hZGQoZWxlbWVudCwge1xuICAgICAgICB0aXRsZTogYENsaWNrIHRvIGNvcHksXG4gICAgICAgICAgJHtcbiAgICAgICAgICAgIHByb2Nlc3MucGxhdGZvcm0gPT09IFwiZGFyd2luXCIgPyBcIkNtZFwiIDogXCJDdHJsXCJcbiAgICAgICAgICB9K0NsaWNrIHRvIG9wZW4gaW4gZWRpdG9yYCxcbiAgICAgIH0pXG4gICAgKTtcbiAgfTtcblxuICBhZGRDbG9zZUJ1dHRvblRvb2x0aXAgPSAoXG4gICAgZWxlbWVudDogP0hUTUxFbGVtZW50LFxuICAgIGNvbXA6IGF0b20kQ29tcG9zaXRlRGlzcG9zYWJsZVxuICApID0+IHtcbiAgICBpZiAoIWVsZW1lbnQgfHwgIWNvbXAuZGlzcG9zYWJsZXMgfHwgY29tcC5kaXNwb3NhYmxlcy5zaXplID4gMCkgcmV0dXJuO1xuICAgIGNvbXAuYWRkKFxuICAgICAgYXRvbS50b29sdGlwcy5hZGQoZWxlbWVudCwge1xuICAgICAgICB0aXRsZTogdGhpcy5wcm9wcy5zdG9yZS5leGVjdXRpb25Db3VudFxuICAgICAgICAgID8gYENsb3NlIChPdXRbJHt0aGlzLnByb3BzLnN0b3JlLmV4ZWN1dGlvbkNvdW50fV0pYFxuICAgICAgICAgIDogXCJDbG9zZSByZXN1bHRcIixcbiAgICAgIH0pXG4gICAgKTtcbiAgfTtcblxuICBhZGRDb3B5QnV0dG9uVG9vbHRpcCA9IChlbGVtZW50OiA/SFRNTEVsZW1lbnQpID0+IHtcbiAgICB0aGlzLmFkZENvcHlUb29sdGlwKGVsZW1lbnQsIHRoaXMuYnV0dG9uVG9vbHRpcCk7XG4gIH07XG5cbiAgb25XaGVlbCA9IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4ge1xuICAgIHJldHVybiAoZXZlbnQ6IFdoZWVsRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudEhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gZWxlbWVudC5zY3JvbGxIZWlnaHQ7XG4gICAgICBjb25zdCBjbGllbnRXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICBjb25zdCBzY3JvbGxXaWR0aCA9IGVsZW1lbnQuc2Nyb2xsV2lkdGg7XG4gICAgICBjb25zdCBzY3JvbGxUb3AgPSBlbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgIGNvbnN0IHNjcm9sbExlZnQgPSBlbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgICBjb25zdCBhdFRvcCA9IHNjcm9sbFRvcCAhPT0gMCAmJiBldmVudC5kZWx0YVkgPCAwO1xuICAgICAgY29uc3QgYXRMZWZ0ID0gc2Nyb2xsTGVmdCAhPT0gMCAmJiBldmVudC5kZWx0YVggPCAwO1xuICAgICAgY29uc3QgYXRCb3R0b20gPVxuICAgICAgICBzY3JvbGxUb3AgIT09IHNjcm9sbEhlaWdodCAtIGNsaWVudEhlaWdodCAmJiBldmVudC5kZWx0YVkgPiAwO1xuICAgICAgY29uc3QgYXRSaWdodCA9XG4gICAgICAgIHNjcm9sbExlZnQgIT09IHNjcm9sbFdpZHRoIC0gY2xpZW50V2lkdGggJiYgZXZlbnQuZGVsdGFYID4gMDtcblxuICAgICAgaWYgKGNsaWVudEhlaWdodCA8IHNjcm9sbEhlaWdodCAmJiAoYXRUb3AgfHwgYXRCb3R0b20pKSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSBlbHNlIGlmIChjbGllbnRXaWR0aCA8IHNjcm9sbFdpZHRoICYmIChhdExlZnQgfHwgYXRSaWdodCkpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBAYWN0aW9uXG4gIHRvZ2dsZUV4cGFuZCA9ICgpID0+IHtcbiAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgb3V0cHV0cywgc3RhdHVzLCBpc1BsYWluLCBwb3NpdGlvbiB9ID0gdGhpcy5wcm9wcy5zdG9yZTtcblxuICAgIGNvbnN0IGlubGluZVN0eWxlID0ge1xuICAgICAgbWFyZ2luTGVmdDogYCR7cG9zaXRpb24ubGluZUxlbmd0aCArIHBvc2l0aW9uLmNoYXJXaWR0aH1weGAsXG4gICAgICBtYXJnaW5Ub3A6IGAtJHtwb3NpdGlvbi5saW5lSGVpZ2h0fXB4YCxcbiAgICAgIHVzZXJTZWxlY3Q6IFwidGV4dFwiLFxuICAgIH07XG5cbiAgICBpZiAob3V0cHV0cy5sZW5ndGggPT09IDAgfHwgdGhpcy5wcm9wcy5zaG93UmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgY29uc3Qga2VybmVsID0gdGhpcy5wcm9wcy5rZXJuZWw7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3RhdHVzXG4gICAgICAgICAgc3RhdHVzPXtcbiAgICAgICAgICAgIGtlcm5lbCAmJiBrZXJuZWwuZXhlY3V0aW9uU3RhdGUgIT09IFwiYnVzeVwiICYmIHN0YXR1cyA9PT0gXCJydW5uaW5nXCJcbiAgICAgICAgICAgICAgPyBcImVycm9yXCJcbiAgICAgICAgICAgICAgOiBzdGF0dXNcbiAgICAgICAgICB9XG4gICAgICAgICAgc3R5bGU9e2lubGluZVN0eWxlfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e1xuICAgICAgICAgIChpc1BsYWluID8gXCJpbmxpbmUtY29udGFpbmVyXCIgOiBcIm11bHRpbGluZS1jb250YWluZXJcIikgK1xuICAgICAgICAgIFwiIG5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgICB9XG4gICAgICAgIHRhYkluZGV4PXtcIi0xXCJ9XG4gICAgICAgIG9uQ2xpY2s9e2lzUGxhaW4gPyB0aGlzLmNoZWNrRm9yU2VsZWN0aW9uIDogdW5kZWZpbmVkfVxuICAgICAgICBzdHlsZT17XG4gICAgICAgICAgaXNQbGFpblxuICAgICAgICAgICAgPyBpbmxpbmVTdHlsZVxuICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IGAke3Bvc2l0aW9uLmVkaXRvcldpZHRoIC0gMiAqIHBvc2l0aW9uLmNoYXJXaWR0aH1weGAsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiBcIjBweFwiLFxuICAgICAgICAgICAgICAgIHVzZXJTZWxlY3Q6IFwidGV4dFwiLFxuICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaHlkcm9nZW4td3JhcG91dHB1dD17YXRvbS5jb25maWcuZ2V0KGBIeWRyb2dlbi53cmFwT3V0cHV0YCkudG9TdHJpbmcoKX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cImh5ZHJvZ2VuX2NlbGxfZGlzcGxheVwiXG4gICAgICAgICAgcmVmPXsocmVmKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXJlZikgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5lbCA9IHJlZjtcblxuICAgICAgICAgICAgaXNQbGFpblxuICAgICAgICAgICAgICA/IHRoaXMuYWRkQ29weVRvb2x0aXAocmVmLCB0aGlzLmNvbnRhaW5lclRvb2x0aXApXG4gICAgICAgICAgICAgIDogdGhpcy5jb250YWluZXJUb29sdGlwLmRpc3Bvc2UoKTtcblxuICAgICAgICAgICAgLy8gQXMgb2YgdGhpcyB3cml0aW5nIFJlYWN0J3MgZXZlbnQgaGFuZGxlciBkb2Vzbid0IHByb3Blcmx5IGhhbmRsZVxuICAgICAgICAgICAgLy8gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgZm9yIGV2ZW50cyBvdXRzaWRlIHRoZSBSZWFjdCBjb250ZXh0LlxuICAgICAgICAgICAgaWYgKCF0aGlzLmV4cGFuZGVkICYmICFpc1BsYWluICYmIHJlZikge1xuICAgICAgICAgICAgICByZWYuYWRkRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIHRoaXMub25XaGVlbChyZWYpLCB7XG4gICAgICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLmV4cGFuZGVkID8gXCIxMDAlXCIgOiBgJHtTQ1JPTExfSEVJR0hUfXB4YCxcbiAgICAgICAgICAgIG92ZXJmbG93WTogXCJhdXRvXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtvdXRwdXRzLm1hcCgob3V0cHV0LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPERpc3BsYXkgb3V0cHV0PXtvdXRwdXR9IGtleT17aW5kZXh9IC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7aXNQbGFpbiA/IG51bGwgOiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b29sYmFyXCI+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImljb24gaWNvbi14XCJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5kZXN0cm95fVxuICAgICAgICAgICAgICByZWY9eyhyZWYpID0+IHRoaXMuYWRkQ2xvc2VCdXR0b25Ub29sdGlwKHJlZiwgdGhpcy5jbG9zZVRvb2x0aXApfVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtaW5IZWlnaHQ6IFwiMC4yNWVtXCIgfX0gLz5cblxuICAgICAgICAgICAge3RoaXMuZ2V0QWxsVGV4dCgpLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpY29uIGljb24tY2xpcHB5XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICAgICAgICAgIHJlZj17dGhpcy5hZGRDb3B5QnV0dG9uVG9vbHRpcH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgICB7dGhpcy5lbCAmJiB0aGlzLmVsLnNjcm9sbEhlaWdodCA+IFNDUk9MTF9IRUlHSFQgPyAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BpY29uIGljb24tJHt0aGlzLmV4cGFuZGVkID8gXCJmb2xkXCIgOiBcInVuZm9sZFwifWB9XG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVFeHBhbmR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBzY3JvbGxUb0JvdHRvbSgpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5lbCB8fFxuICAgICAgdGhpcy5leHBhbmRlZCA9PT0gdHJ1ZSB8fFxuICAgICAgdGhpcy5wcm9wcy5zdG9yZS5pc1BsYWluID09PSB0cnVlIHx8XG4gICAgICBhdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLmF1dG9TY3JvbGxgKSA9PT0gZmFsc2VcbiAgICApXG4gICAgICByZXR1cm47XG4gICAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5lbC5zY3JvbGxIZWlnaHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5lbC5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3QgbWF4U2Nyb2xsVG9wID0gc2Nyb2xsSGVpZ2h0IC0gaGVpZ2h0O1xuICAgIHRoaXMuZWwuc2Nyb2xsVG9wID0gbWF4U2Nyb2xsVG9wID4gMCA/IG1heFNjcm9sbFRvcCA6IDA7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5jb250YWluZXJUb29sdGlwLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmJ1dHRvblRvb2x0aXAuZGlzcG9zZSgpO1xuICAgIHRoaXMuY2xvc2VUb29sdGlwLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXN1bHRWaWV3Q29tcG9uZW50O1xuIl19