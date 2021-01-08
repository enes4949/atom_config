Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _display = require("./display");

var _display2 = _interopRequireDefault(_display);

function RangeSlider(_ref) {
  var outputStore = _ref.outputStore;
  var storeIndex = outputStore.index;
  var setStoreIndex = outputStore.setIndex;
  var incrementIndex = outputStore.incrementIndex;
  var decrementIndex = outputStore.decrementIndex;
  var outputs = outputStore.outputs;

  var sliderRef = (0, _react.useRef)();

  (0, _react.useEffect)(function () {
    var disposer = new _atom.CompositeDisposable();

    disposer.add(
    // $FlowFixMe
    atom.commands.add(sliderRef.current, "core:move-left", function () {
      return decrementIndex();
    }),
    // $FlowFixMe
    atom.commands.add(sliderRef.current, "core:move-right", function () {
      return incrementIndex();
    }));

    return function () {
      return disposer.dispose();
    };
  }, []);

  function onIndexChange(e) {
    var newIndex = Number(e.target.value);
    setStoreIndex(newIndex);
  }

  return _react2["default"].createElement(
    "div",
    { className: "slider", ref: sliderRef },
    _react2["default"].createElement(
      "div",
      { className: "current-output" },
      _react2["default"].createElement("span", {
        className: "btn btn-xs icon icon-chevron-left",
        onClick: function (e) {
          return decrementIndex();
        }
      }),
      _react2["default"].createElement(
        "span",
        null,
        storeIndex + 1,
        "/",
        outputs.length
      ),
      _react2["default"].createElement("span", {
        className: "btn btn-xs icon icon-chevron-right",
        onClick: function (e) {
          return incrementIndex();
        }
      })
    ),
    _react2["default"].createElement("input", {
      className: "input-range",
      max: outputs.length - 1,
      min: "0",
      id: "range-input",
      onChange: onIndexChange,
      type: "range",
      value: storeIndex
    })
  );
}

var History = (0, _mobxReact.observer)(function (_ref2) {
  var store = _ref2.store;
  return (function () {
    var output = store.outputs[store.index];
    return output ? _react2["default"].createElement(
      "div",
      { className: "history" },
      _react2["default"].createElement(RangeSlider, { outputStore: store }),
      _react2["default"].createElement(
        "div",
        {
          className: "multiline-container native-key-bindings",
          tabIndex: "-1",
          style: {
            fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
          },
          "hydrogen-wrapoutput": atom.config.get("Hydrogen.wrapOutput").toString()
        },
        _react2["default"].createElement(_display2["default"], { output: output })
      )
    ) : null;
  })();
});

exports["default"] = History;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9oaXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7cUJBQ0QsT0FBTzs7Ozt5QkFDdkIsWUFBWTs7dUJBQ2pCLFdBQVc7Ozs7QUFJL0IsU0FBUyxXQUFXLENBQUMsSUFBZSxFQUFFO01BQWYsV0FBVyxHQUFiLElBQWUsQ0FBYixXQUFXO01BRXZCLFVBQVUsR0FLZixXQUFXLENBTGIsS0FBSztNQUNLLGFBQWEsR0FJckIsV0FBVyxDQUpiLFFBQVE7TUFDUixjQUFjLEdBR1osV0FBVyxDQUhiLGNBQWM7TUFDZCxjQUFjLEdBRVosV0FBVyxDQUZiLGNBQWM7TUFDZCxPQUFPLEdBQ0wsV0FBVyxDQURiLE9BQU87O0FBR1QsTUFBTSxTQUFvQyxHQUFHLG9CQUFRLENBQUM7O0FBRXRELHdCQUFVLFlBQU07QUFDZCxRQUFNLFFBQVEsR0FBRywrQkFBeUIsQ0FBQzs7QUFFM0MsWUFBUSxDQUFDLEdBQUc7O0FBRVYsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRTthQUNyRCxjQUFjLEVBQUU7S0FBQSxDQUNqQjs7QUFFRCxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFO2FBQ3RELGNBQWMsRUFBRTtLQUFBLENBQ2pCLENBQ0YsQ0FBQzs7QUFFRixXQUFPO2FBQU0sUUFBUSxDQUFDLE9BQU8sRUFBRTtLQUFBLENBQUM7R0FDakMsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFUCxXQUFTLGFBQWEsQ0FBQyxDQUFDLEVBQUU7QUFDeEIsUUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsaUJBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUN6Qjs7QUFFRCxTQUNFOztNQUFLLFNBQVMsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFFLFNBQVMsQUFBQztJQUNyQzs7UUFBSyxTQUFTLEVBQUMsZ0JBQWdCO01BQzdCO0FBQ0UsaUJBQVMsRUFBQyxtQ0FBbUM7QUFDN0MsZUFBTyxFQUFFLFVBQUMsQ0FBQztpQkFBSyxjQUFjLEVBQUU7U0FBQSxBQUFDO1FBQ2pDO01BQ0Y7OztRQUNHLFVBQVUsR0FBRyxDQUFDOztRQUFHLE9BQU8sQ0FBQyxNQUFNO09BQzNCO01BQ1A7QUFDRSxpQkFBUyxFQUFDLG9DQUFvQztBQUM5QyxlQUFPLEVBQUUsVUFBQyxDQUFDO2lCQUFLLGNBQWMsRUFBRTtTQUFBLEFBQUM7UUFDakM7S0FDRTtJQUNOO0FBQ0UsZUFBUyxFQUFDLGFBQWE7QUFDdkIsU0FBRyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxBQUFDO0FBQ3hCLFNBQUcsRUFBQyxHQUFHO0FBQ1AsUUFBRSxFQUFDLGFBQWE7QUFDaEIsY0FBUSxFQUFFLGFBQWEsQUFBQztBQUN4QixVQUFJLEVBQUMsT0FBTztBQUNaLFdBQUssRUFBRSxVQUFVLEFBQUM7TUFDbEI7R0FDRSxDQUNOO0NBQ0g7O0FBRUQsSUFBTSxPQUFPLEdBQUcseUJBQVMsVUFBQyxLQUFTO01BQVAsS0FBSyxHQUFQLEtBQVMsQ0FBUCxLQUFLO3NCQUErQjtBQUM5RCxRQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxXQUFPLE1BQU0sR0FDWDs7UUFBSyxTQUFTLEVBQUMsU0FBUztNQUN0QixpQ0FBQyxXQUFXLElBQUMsV0FBVyxFQUFFLEtBQUssQUFBQyxHQUFHO01BQ25DOzs7QUFDRSxtQkFBUyxFQUFDLHlDQUF5QztBQUNuRCxrQkFBUSxFQUFDLElBQUk7QUFDYixlQUFLLEVBQUU7QUFDTCxvQkFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRywrQkFBK0IsSUFBSSxTQUFTO1dBQ3RFLEFBQUM7QUFDRixpQ0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxBQUFDOztRQUV2RSx5REFBUyxNQUFNLEVBQUUsTUFBTSxBQUFDLEdBQUc7T0FDdkI7S0FDRixHQUNKLElBQUksQ0FBQztHQUNWO0NBQUEsQ0FBQyxDQUFDOztxQkFFWSxPQUFPIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9oaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCBEaXNwbGF5IGZyb20gXCIuL2Rpc3BsYXlcIjtcblxuaW1wb3J0IHR5cGUgT3V0cHV0U3RvcmUgZnJvbSBcIi4uLy4uL3N0b3JlL291dHB1dFwiO1xuXG5mdW5jdGlvbiBSYW5nZVNsaWRlcih7IG91dHB1dFN0b3JlIH0pIHtcbiAgY29uc3Qge1xuICAgIGluZGV4OiBzdG9yZUluZGV4LFxuICAgIHNldEluZGV4OiBzZXRTdG9yZUluZGV4LFxuICAgIGluY3JlbWVudEluZGV4LFxuICAgIGRlY3JlbWVudEluZGV4LFxuICAgIG91dHB1dHMsXG4gIH0gPSBvdXRwdXRTdG9yZTtcblxuICBjb25zdCBzbGlkZXJSZWY6IHsgY3VycmVudDogP0hUTUxFbGVtZW50IH0gPSB1c2VSZWYoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGRpc3Bvc2VyID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIGRpc3Bvc2VyLmFkZChcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKHNsaWRlclJlZi5jdXJyZW50LCBcImNvcmU6bW92ZS1sZWZ0XCIsICgpID0+XG4gICAgICAgIGRlY3JlbWVudEluZGV4KClcbiAgICAgICksXG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChzbGlkZXJSZWYuY3VycmVudCwgXCJjb3JlOm1vdmUtcmlnaHRcIiwgKCkgPT5cbiAgICAgICAgaW5jcmVtZW50SW5kZXgoKVxuICAgICAgKVxuICAgICk7XG5cbiAgICByZXR1cm4gKCkgPT4gZGlzcG9zZXIuZGlzcG9zZSgpO1xuICB9LCBbXSk7XG5cbiAgZnVuY3Rpb24gb25JbmRleENoYW5nZShlKSB7XG4gICAgY29uc3QgbmV3SW5kZXggPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xuICAgIHNldFN0b3JlSW5kZXgobmV3SW5kZXgpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNsaWRlclwiIHJlZj17c2xpZGVyUmVmfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3VycmVudC1vdXRwdXRcIj5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGljb24gaWNvbi1jaGV2cm9uLWxlZnRcIlxuICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBkZWNyZW1lbnRJbmRleCgpfVxuICAgICAgICAvPlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7c3RvcmVJbmRleCArIDF9L3tvdXRwdXRzLmxlbmd0aH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4teHMgaWNvbiBpY29uLWNoZXZyb24tcmlnaHRcIlxuICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBpbmNyZW1lbnRJbmRleCgpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8aW5wdXRcbiAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXQtcmFuZ2VcIlxuICAgICAgICBtYXg9e291dHB1dHMubGVuZ3RoIC0gMX1cbiAgICAgICAgbWluPVwiMFwiXG4gICAgICAgIGlkPVwicmFuZ2UtaW5wdXRcIlxuICAgICAgICBvbkNoYW5nZT17b25JbmRleENoYW5nZX1cbiAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgdmFsdWU9e3N0b3JlSW5kZXh9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5jb25zdCBIaXN0b3J5ID0gb2JzZXJ2ZXIoKHsgc3RvcmUgfTogeyBzdG9yZTogT3V0cHV0U3RvcmUgfSkgPT4ge1xuICBjb25zdCBvdXRwdXQgPSBzdG9yZS5vdXRwdXRzW3N0b3JlLmluZGV4XTtcbiAgcmV0dXJuIG91dHB1dCA/IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhpc3RvcnlcIj5cbiAgICAgIDxSYW5nZVNsaWRlciBvdXRwdXRTdG9yZT17c3RvcmV9IC8+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cIm11bHRpbGluZS1jb250YWluZXIgbmF0aXZlLWtleS1iaW5kaW5nc1wiXG4gICAgICAgIHRhYkluZGV4PVwiLTFcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGZvbnRTaXplOiBhdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLm91dHB1dEFyZWFGb250U2l6ZWApIHx8IFwiaW5oZXJpdFwiLFxuICAgICAgICB9fVxuICAgICAgICBoeWRyb2dlbi13cmFwb3V0cHV0PXthdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLndyYXBPdXRwdXRgKS50b1N0cmluZygpfVxuICAgICAgPlxuICAgICAgICA8RGlzcGxheSBvdXRwdXQ9e291dHB1dH0gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApIDogbnVsbDtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5O1xuIl19