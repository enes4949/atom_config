Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactTable = require("react-table");

var _reactTable2 = _interopRequireDefault(_reactTable);

var _mobxReact = require("mobx-react");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _kernel = require("../kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var _utils = require("../utils");

var showKernelSpec = function showKernelSpec(kernelSpec) {
  atom.notifications.addInfo("Hydrogen: Kernel Spec", {
    detail: JSON.stringify(kernelSpec, null, 2),
    dismissable: true
  });
};
var interrupt = function interrupt(kernel) {
  kernel.interrupt();
};
var shutdown = function shutdown(kernel) {
  kernel.shutdown();
  kernel.destroy();
};
var restart = function restart(kernel) {
  kernel.restart();
};

// @TODO If our store holds editor IDs instead of file paths, these messy matching stuff below would
//       easily be replaced by simpler code. See also components/kernel-monitor.js for this problem.
var openUnsavedEditor = function openUnsavedEditor(filePath) {
  var editor = atom.workspace.getTextEditors().find(function (editor) {
    var match = filePath.match(/\d+/);
    if (!match) {
      return false;
    }
    return String(editor.id) === match[0];
  });
  // This path won't happen after https://github.com/nteract/hydrogen/pull/1662 since every deleted
  // editors would be deleted from `store.kernelMapping`. Just kept here for safety.
  if (!editor) return;
  atom.workspace.open(editor, {
    searchAllPanes: true
  });
};
var openEditor = function openEditor(filePath) {
  atom.workspace.open(filePath, {
    searchAllPanes: true
  })["catch"](function (err) {
    atom.notifications.addError("Hydrogen", {
      description: err
    });
  });
};

var kernelInfoCell = function kernelInfoCell(props) {
  var _props$value = props.value;
  var displayName = _props$value.displayName;
  var kernelSpec = _props$value.kernelSpec;

  return _react2["default"].createElement(
    "a",
    {
      className: "icon",
      onClick: showKernelSpec.bind(_this, kernelSpec),
      title: "Show kernel spec",
      key: displayName + "kernelInfo"
    },
    displayName
  );
};

// Set default properties of React-Table
Object.assign(_reactTable.ReactTableDefaults, {
  className: "kernel-monitor",
  showPagination: false
});
Object.assign(_reactTable.ReactTableDefaults.column, {
  className: "table-cell",
  headerClassName: "table-header",
  style: { textAlign: "center" }
});

var KernelMonitor = (0, _mobxReact.observer)(function (_ref) {
  var store = _ref.store;
  return (function () {
    var _this2 = this;

    if (store.runningKernels.length === 0) {
      return _react2["default"].createElement(
        "ul",
        { className: "background-message centered" },
        _react2["default"].createElement(
          "li",
          null,
          "No running kernels"
        )
      );
    }

    var data = _lodash2["default"].map(store.runningKernels, function (kernel, key) {
      return {
        gateway: kernel.transport.gatewayName || "Local",
        kernelInfo: {
          displayName: kernel.displayName,
          kernelSpec: kernel.kernelSpec
        },
        status: kernel.executionState,
        executionCount: kernel.executionCount,
        lastExecutionTime: kernel.lastExecutionTime,
        kernelKey: { kernel: kernel, key: String(key) },
        files: store.getFilesForKernel(kernel)
      };
    });
    var columns = [{
      Header: "Gateway",
      accessor: "gateway",
      maxWidth: 125
    }, {
      Header: "Kernel",
      accessor: "kernelInfo",
      Cell: kernelInfoCell,
      maxWidth: 125
    }, {
      Header: "Status",
      accessor: "status",
      maxWidth: 100
    }, {
      Header: "Count",
      accessor: "executionCount",
      maxWidth: 50,
      style: { textAlign: "right" }
    }, {
      Header: "Last Exec Time",
      accessor: "lastExecutionTime",
      maxWidth: 100,
      style: { textAlign: "right" }
    }, {
      Header: "Managements",
      accessor: "kernelKey",
      Cell: function Cell(props) {
        var _props$value2 = props.value;
        var kernel = _props$value2.kernel;
        var key = _props$value2.key;

        return [_react2["default"].createElement("a", {
          className: "icon icon-zap",
          onClick: interrupt.bind(_this2, kernel),
          title: "Interrupt kernel",
          key: key + "interrupt"
        }), _react2["default"].createElement("a", {
          className: "icon icon-sync",
          onClick: restart.bind(_this2, kernel),
          title: "Restart kernel",
          key: key + "restart"
        }), _react2["default"].createElement("a", {
          className: "icon icon-trashcan",
          onClick: shutdown.bind(_this2, kernel),
          title: "Shutdown kernel",
          key: key + "shutdown"
        })];
      },
      width: 150
    }, {
      Header: "Files",
      accessor: "files",
      Cell: function Cell(props) {
        return props.value.map(function (filePath, index) {
          var separator = index === 0 ? "" : "  |  ";
          var body = (0, _utils.isUnsavedFilePath)(filePath) ? _react2["default"].createElement(
            "a",
            {
              onClick: openUnsavedEditor.bind(_this2, filePath),
              title: "Jump to file",
              key: filePath + "jump"
            },
            filePath
          ) : _react2["default"].createElement(
            "a",
            {
              onClick: openEditor.bind(_this2, filePath),
              title: "Jump to file",
              key: filePath + "jump"
            },
            (0, _tildify2["default"])(filePath)
          );
          return _react2["default"].createElement(
            "div",
            { style: { display: "-webkit-inline-box" }, key: filePath },
            separator,
            body
          );
        });
      },
      style: { textAlign: "center", whiteSpace: "pre-wrap" }
    }];

    return _react2["default"].createElement(_reactTable2["default"], { data: data, columns: columns });
  })();
});

KernelMonitor.displayName = "KernelMonitor";
exports["default"] = KernelMonitor;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9rZXJuZWwtbW9uaXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztxQkFFa0IsT0FBTzs7OzswQkFDRixhQUFhOzs7O3lCQUVYLFlBQVk7O3NCQUN2QixRQUFROzs7O3VCQUNGLFNBQVM7Ozs7c0JBR1YsV0FBVzs7OztxQkFDSSxVQUFVOztBQUU1QyxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQUksVUFBVSxFQUFTO0FBQ3pDLE1BQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFO0FBQ2xELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLGVBQVcsRUFBRSxJQUFJO0dBQ2xCLENBQUMsQ0FBQztDQUNKLENBQUM7QUFDRixJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxNQUFNLEVBQWE7QUFDcEMsUUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0NBQ3BCLENBQUM7QUFDRixJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxNQUFNLEVBQWE7QUFDbkMsUUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2xCLFFBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztDQUNsQixDQUFDO0FBQ0YsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksTUFBTSxFQUFhO0FBQ2xDLFFBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztDQUNsQixDQUFDOzs7O0FBSUYsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBSSxRQUFRLEVBQWE7QUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDOUQsUUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxL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SSxFQUFFLElBQUksQUFBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsR0FBRyxDQUFDO0dBQ3JEO0NBQUEsQ0FBQyxDQUFDOztBQUVILGFBQWEsQ0FBQyxXQUFXLEdBQUcsZUFBZSxDQUFDO3FCQUM3QixhQUFhIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9rZXJuZWwtbW9uaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBSZWFjdFRhYmxlIGZyb20gXCJyZWFjdC10YWJsZVwiO1xuaW1wb3J0IHsgUmVhY3RUYWJsZURlZmF1bHRzIH0gZnJvbSBcInJlYWN0LXRhYmxlXCI7XG5pbXBvcnQgeyBvYnNlcnZlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgdGlsZGlmeSBmcm9tIFwidGlsZGlmeVwiO1xuXG5pbXBvcnQgdHlwZW9mIHN0b3JlIGZyb20gXCIuLi9zdG9yZVwiO1xuaW1wb3J0IEtlcm5lbCBmcm9tIFwiLi4va2VybmVsXCI7XG5pbXBvcnQgeyBpc1Vuc2F2ZWRGaWxlUGF0aCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5jb25zdCBzaG93S2VybmVsU3BlYyA9IChrZXJuZWxTcGVjOiB7fSkgPT4ge1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhcIkh5ZHJvZ2VuOiBLZXJuZWwgU3BlY1wiLCB7XG4gICAgZGV0YWlsOiBKU09OLnN0cmluZ2lmeShrZXJuZWxTcGVjLCBudWxsLCAyKSxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgfSk7XG59O1xuY29uc3QgaW50ZXJydXB0ID0gKGtlcm5lbDogS2VybmVsKSA9PiB7XG4gIGtlcm5lbC5pbnRlcnJ1cHQoKTtcbn07XG5jb25zdCBzaHV0ZG93biA9IChrZXJuZWw6IEtlcm5lbCkgPT4ge1xuICBrZXJuZWwuc2h1dGRvd24oKTtcbiAga2VybmVsLmRlc3Ryb3koKTtcbn07XG5jb25zdCByZXN0YXJ0ID0gKGtlcm5lbDogS2VybmVsKSA9PiB7XG4gIGtlcm5lbC5yZXN0YXJ0KCk7XG59O1xuXG4vLyBAVE9ETyBJZiBvdXIgc3RvcmUgaG9sZHMgZWRpdG9yIElEcyBpbnN0ZWFkIG9mIGZpbGUgcGF0aHMsIHRoZXNlIG1lc3N5IG1hdGNoaW5nIHN0dWZmIGJlbG93IHdvdWxkXG4vLyAgICAgICBlYXNpbHkgYmUgcmVwbGFjZWQgYnkgc2ltcGxlciBjb2RlLiBTZWUgYWxzbyBjb21wb25lbnRzL2tlcm5lbC1tb25pdG9yLmpzIGZvciB0aGlzIHByb2JsZW0uXG5jb25zdCBvcGVuVW5zYXZlZEVkaXRvciA9IChmaWxlUGF0aDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZmluZCgoZWRpdG9yKSA9PiB7XG4gICAgY29uc3QgbWF0Y2ggPSBmaWxlUGF0aC5tYXRjaCgvXFxkKy8pO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyhlZGl0b3IuaWQpID09PSBtYXRjaFswXTtcbiAgfSk7XG4gIC8vIFRoaXMgcGF0aCB3b24ndCBoYXBwZW4gYWZ0ZXIgaHR0cHM6Ly9naXRodWIuY29tL250ZXJhY3QvaHlkcm9nZW4vcHVsbC8xNjYyIHNpbmNlIGV2ZXJ5IGRlbGV0ZWRcbiAgLy8gZWRpdG9ycyB3b3VsZCBiZSBkZWxldGVkIGZyb20gYHN0b3JlLmtlcm5lbE1hcHBpbmdgLiBKdXN0IGtlcHQgaGVyZSBmb3Igc2FmZXR5LlxuICBpZiAoIWVkaXRvcikgcmV0dXJuO1xuICBhdG9tLndvcmtzcGFjZS5vcGVuKGVkaXRvciwge1xuICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICB9KTtcbn07XG5jb25zdCBvcGVuRWRpdG9yID0gKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgYXRvbS53b3Jrc3BhY2VcbiAgICAub3BlbihmaWxlUGF0aCwge1xuICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUsXG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiSHlkcm9nZW5cIiwge1xuICAgICAgICBkZXNjcmlwdGlvbjogZXJyLFxuICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG50eXBlIEtlcm5lbEluZm8gPSB7XG4gIHZhbHVlOiB7XG4gICAgZGlzcGxheU5hbWU6IHN0cmluZyxcbiAgICBrZXJuZWxTcGVjOiBLZXJuZWxzcGVjLFxuICB9LFxufTtcbmNvbnN0IGtlcm5lbEluZm9DZWxsID0gKHByb3BzOiBLZXJuZWxJbmZvKSA9PiB7XG4gIGNvbnN0IHsgZGlzcGxheU5hbWUsIGtlcm5lbFNwZWMgfSA9IHByb3BzLnZhbHVlO1xuICByZXR1cm4gKFxuICAgIDxhXG4gICAgICBjbGFzc05hbWU9XCJpY29uXCJcbiAgICAgIG9uQ2xpY2s9e3Nob3dLZXJuZWxTcGVjLmJpbmQodGhpcywga2VybmVsU3BlYyl9XG4gICAgICB0aXRsZT1cIlNob3cga2VybmVsIHNwZWNcIlxuICAgICAga2V5PXtkaXNwbGF5TmFtZSArIFwia2VybmVsSW5mb1wifVxuICAgID5cbiAgICAgIHtkaXNwbGF5TmFtZX1cbiAgICA8L2E+XG4gICk7XG59O1xuXG4vLyBTZXQgZGVmYXVsdCBwcm9wZXJ0aWVzIG9mIFJlYWN0LVRhYmxlXG5PYmplY3QuYXNzaWduKFJlYWN0VGFibGVEZWZhdWx0cywge1xuICBjbGFzc05hbWU6IFwia2VybmVsLW1vbml0b3JcIixcbiAgc2hvd1BhZ2luYXRpb246IGZhbHNlLFxufSk7XG5PYmplY3QuYXNzaWduKFJlYWN0VGFibGVEZWZhdWx0cy5jb2x1bW4sIHtcbiAgY2xhc3NOYW1lOiBcInRhYmxlLWNlbGxcIixcbiAgaGVhZGVyQ2xhc3NOYW1lOiBcInRhYmxlLWhlYWRlclwiLFxuICBzdHlsZTogeyB0ZXh0QWxpZ246IFwiY2VudGVyXCIgfSxcbn0pO1xuXG5jb25zdCBLZXJuZWxNb25pdG9yID0gb2JzZXJ2ZXIoKHsgc3RvcmUgfTogeyBzdG9yZTogc3RvcmUgfSkgPT4ge1xuICBpZiAoc3RvcmUucnVubmluZ0tlcm5lbHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDx1bCBjbGFzc05hbWU9XCJiYWNrZ3JvdW5kLW1lc3NhZ2UgY2VudGVyZWRcIj5cbiAgICAgICAgPGxpPk5vIHJ1bm5pbmcga2VybmVsczwvbGk+XG4gICAgICA8L3VsPlxuICAgICk7XG4gIH1cblxuICBjb25zdCBkYXRhID0gXy5tYXAoc3RvcmUucnVubmluZ0tlcm5lbHMsIChrZXJuZWwsIGtleTogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdhdGV3YXk6IGtlcm5lbC50cmFuc3BvcnQuZ2F0ZXdheU5hbWUgfHwgXCJMb2NhbFwiLFxuICAgICAga2VybmVsSW5mbzoge1xuICAgICAgICBkaXNwbGF5TmFtZToga2VybmVsLmRpc3BsYXlOYW1lLFxuICAgICAgICBrZXJuZWxTcGVjOiBrZXJuZWwua2VybmVsU3BlYyxcbiAgICAgIH0sXG4gICAgICBzdGF0dXM6IGtlcm5lbC5leGVjdXRpb25TdGF0ZSxcbiAgICAgIGV4ZWN1dGlvbkNvdW50OiBrZXJuZWwuZXhlY3V0aW9uQ291bnQsXG4gICAgICBsYXN0RXhlY3V0aW9uVGltZToga2VybmVsLmxhc3RFeGVjdXRpb25UaW1lLFxuICAgICAga2VybmVsS2V5OiB7IGtlcm5lbDoga2VybmVsLCBrZXk6IFN0cmluZyhrZXkpIH0sXG4gICAgICBmaWxlczogc3RvcmUuZ2V0RmlsZXNGb3JLZXJuZWwoa2VybmVsKSxcbiAgICB9O1xuICB9KTtcbiAgY29uc3QgY29sdW1ucyA9IFtcbiAgICB7XG4gICAgICBIZWFkZXI6IFwiR2F0ZXdheVwiLFxuICAgICAgYWNjZXNzb3I6IFwiZ2F0ZXdheVwiLFxuICAgICAgbWF4V2lkdGg6IDEyNSxcbiAgICB9LFxuICAgIHtcbiAgICAgIEhlYWRlcjogXCJLZXJuZWxcIixcbiAgICAgIGFjY2Vzc29yOiBcImtlcm5lbEluZm9cIixcbiAgICAgIENlbGw6IGtlcm5lbEluZm9DZWxsLFxuICAgICAgbWF4V2lkdGg6IDEyNSxcbiAgICB9LFxuICAgIHtcbiAgICAgIEhlYWRlcjogXCJTdGF0dXNcIixcbiAgICAgIGFjY2Vzc29yOiBcInN0YXR1c1wiLFxuICAgICAgbWF4V2lkdGg6IDEwMCxcbiAgICB9LFxuICAgIHtcbiAgICAgIEhlYWRlcjogXCJDb3VudFwiLFxuICAgICAgYWNjZXNzb3I6IFwiZXhlY3V0aW9uQ291bnRcIixcbiAgICAgIG1heFdpZHRoOiA1MCxcbiAgICAgIHN0eWxlOiB7IHRleHRBbGlnbjogXCJyaWdodFwiIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBIZWFkZXI6IFwiTGFzdCBFeGVjIFRpbWVcIixcbiAgICAgIGFjY2Vzc29yOiBcImxhc3RFeGVjdXRpb25UaW1lXCIsXG4gICAgICBtYXhXaWR0aDogMTAwLFxuICAgICAgc3R5bGU6IHsgdGV4dEFsaWduOiBcInJpZ2h0XCIgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIEhlYWRlcjogXCJNYW5hZ2VtZW50c1wiLFxuICAgICAgYWNjZXNzb3I6IFwia2VybmVsS2V5XCIsXG4gICAgICBDZWxsOiAocHJvcHMpID0+IHtcbiAgICAgICAgY29uc3QgeyBrZXJuZWwsIGtleSB9ID0gcHJvcHMudmFsdWU7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgPGFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImljb24gaWNvbi16YXBcIlxuICAgICAgICAgICAgb25DbGljaz17aW50ZXJydXB0LmJpbmQodGhpcywga2VybmVsKX1cbiAgICAgICAgICAgIHRpdGxlPVwiSW50ZXJydXB0IGtlcm5lbFwiXG4gICAgICAgICAgICBrZXk9e2tleSArIFwiaW50ZXJydXB0XCJ9XG4gICAgICAgICAgLz4sXG4gICAgICAgICAgPGFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImljb24gaWNvbi1zeW5jXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3Jlc3RhcnQuYmluZCh0aGlzLCBrZXJuZWwpfVxuICAgICAgICAgICAgdGl0bGU9XCJSZXN0YXJ0IGtlcm5lbFwiXG4gICAgICAgICAgICBrZXk9e2tleSArIFwicmVzdGFydFwifVxuICAgICAgICAgIC8+LFxuICAgICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpY29uIGljb24tdHJhc2hjYW5cIlxuICAgICAgICAgICAgb25DbGljaz17c2h1dGRvd24uYmluZCh0aGlzLCBrZXJuZWwpfVxuICAgICAgICAgICAgdGl0bGU9XCJTaHV0ZG93biBrZXJuZWxcIlxuICAgICAgICAgICAga2V5PXtrZXkgKyBcInNodXRkb3duXCJ9XG4gICAgICAgICAgLz4sXG4gICAgICAgIF07XG4gICAgICB9LFxuICAgICAgd2lkdGg6IDE1MCxcbiAgICB9LFxuICAgIHtcbiAgICAgIEhlYWRlcjogXCJGaWxlc1wiLFxuICAgICAgYWNjZXNzb3I6IFwiZmlsZXNcIixcbiAgICAgIENlbGw6IChwcm9wcykgPT4ge1xuICAgICAgICByZXR1cm4gcHJvcHMudmFsdWUubWFwKChmaWxlUGF0aCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBzZXBhcmF0b3IgPSBpbmRleCA9PT0gMCA/IFwiXCIgOiBcIiAgfCAgXCI7XG4gICAgICAgICAgY29uc3QgYm9keSA9IGlzVW5zYXZlZEZpbGVQYXRoKGZpbGVQYXRoKSA/IChcbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29wZW5VbnNhdmVkRWRpdG9yLmJpbmQodGhpcywgZmlsZVBhdGgpfVxuICAgICAgICAgICAgICB0aXRsZT1cIkp1bXAgdG8gZmlsZVwiXG4gICAgICAgICAgICAgIGtleT17ZmlsZVBhdGggKyBcImp1bXBcIn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2ZpbGVQYXRofVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICBvbkNsaWNrPXtvcGVuRWRpdG9yLmJpbmQodGhpcywgZmlsZVBhdGgpfVxuICAgICAgICAgICAgICB0aXRsZT1cIkp1bXAgdG8gZmlsZVwiXG4gICAgICAgICAgICAgIGtleT17ZmlsZVBhdGggKyBcImp1bXBcIn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3RpbGRpZnkoZmlsZVBhdGgpfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCItd2Via2l0LWlubGluZS1ib3hcIiB9fSBrZXk9e2ZpbGVQYXRofT5cbiAgICAgICAgICAgICAge3NlcGFyYXRvcn1cbiAgICAgICAgICAgICAge2JvZHl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBzdHlsZTogeyB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIiB9LFxuICAgIH0sXG4gIF07XG5cbiAgcmV0dXJuIDxSZWFjdFRhYmxlIGRhdGE9e2RhdGF9IGNvbHVtbnM9e2NvbHVtbnN9IC8+O1xufSk7XG5cbktlcm5lbE1vbml0b3IuZGlzcGxheU5hbWUgPSBcIktlcm5lbE1vbml0b3JcIjtcbmV4cG9ydCBkZWZhdWx0IEtlcm5lbE1vbml0b3I7XG4iXX0=