Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require("atom");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _mobx = require("mobx");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _panesInspector = require("./panes/inspector");

var _panesInspector2 = _interopRequireDefault(_panesInspector);

var _panesWatches = require("./panes/watches");

var _panesWatches2 = _interopRequireDefault(_panesWatches);

var _panesOutputArea = require("./panes/output-area");

var _panesOutputArea2 = _interopRequireDefault(_panesOutputArea);

var _panesKernelMonitor = require("./panes/kernel-monitor");

var _panesKernelMonitor2 = _interopRequireDefault(_panesKernelMonitor);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _zmqKernel = require("./zmq-kernel");

var _zmqKernel2 = _interopRequireDefault(_zmqKernel);

var _wsKernel = require("./ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _kernel = require("./kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var _kernelPicker = require("./kernel-picker");

var _kernelPicker2 = _interopRequireDefault(_kernelPicker);

var _wsKernelPicker = require("./ws-kernel-picker");

var _wsKernelPicker2 = _interopRequireDefault(_wsKernelPicker);

var _existingKernelPicker = require("./existing-kernel-picker");

var _existingKernelPicker2 = _interopRequireDefault(_existingKernelPicker);

var _pluginApiHydrogenProvider = require("./plugin-api/hydrogen-provider");

var _pluginApiHydrogenProvider2 = _interopRequireDefault(_pluginApiHydrogenProvider);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _kernelManager = require("./kernel-manager");

var _kernelManager2 = _interopRequireDefault(_kernelManager);

var _services = require("./services");

var _services2 = _interopRequireDefault(_services);

var _commands = require("./commands");

var commands = _interopRequireWildcard(_commands);

var _codeManager = require("./code-manager");

var codeManager = _interopRequireWildcard(_codeManager);

var _result = require("./result");

var result = _interopRequireWildcard(_result);

var _utils = require("./utils");

var _exportNotebook = require("./export-notebook");

var _exportNotebook2 = _interopRequireDefault(_exportNotebook);

var _importNotebook = require("./import-notebook");

var Hydrogen = {
  config: _config2["default"].schema,

  activate: function activate() {
    var _this = this;

    this.emitter = new _atom.Emitter();

    var skipLanguageMappingsChange = false;
    _store2["default"].subscriptions.add(atom.config.onDidChange("Hydrogen.languageMappings", function (_ref) {
      var newValue = _ref.newValue;
      var oldValue = _ref.oldValue;

      if (skipLanguageMappingsChange) {
        skipLanguageMappingsChange = false;
        return;
      }

      if (_store2["default"].runningKernels.length != 0) {
        skipLanguageMappingsChange = true;

        atom.config.set("Hydrogen.languageMappings", oldValue);

        atom.notifications.addError("Hydrogen", {
          description: "`languageMappings` cannot be updated while kernels are running",
          dismissable: false
        });
      }
    }));

    _store2["default"].subscriptions.add(atom.config.observe("Hydrogen.statusBarDisable", function (newValue) {
      _store2["default"].setConfigValue("Hydrogen.statusBarDisable", Boolean(newValue));
    }), atom.config.observe("Hydrogen.statusBarKernelInfo", function (newValue) {
      _store2["default"].setConfigValue("Hydrogen.statusBarKernelInfo", Boolean(newValue));
    }));

    _store2["default"].subscriptions.add(atom.commands.add("atom-text-editor:not([mini])", {
      "hydrogen:run": function hydrogenRun() {
        return _this.run();
      },
      "hydrogen:run-all": function hydrogenRunAll() {
        return _this.runAll();
      },
      "hydrogen:run-all-above": function hydrogenRunAllAbove() {
        return _this.runAllAbove();
      },
      "hydrogen:run-and-move-down": function hydrogenRunAndMoveDown() {
        return _this.run(true);
      },
      "hydrogen:run-cell": function hydrogenRunCell() {
        return _this.runCell();
      },
      "hydrogen:run-cell-and-move-down": function hydrogenRunCellAndMoveDown() {
        return _this.runCell(true);
      },
      "hydrogen:toggle-watches": function hydrogenToggleWatches() {
        return atom.workspace.toggle(_utils.WATCHES_URI);
      },
      "hydrogen:toggle-output-area": function hydrogenToggleOutputArea() {
        return commands.toggleOutputMode();
      },
      "hydrogen:toggle-kernel-monitor": _asyncToGenerator(function* () {
        var lastItem = atom.workspace.getActivePaneItem();
        var lastPane = atom.workspace.paneForItem(lastItem);
        yield atom.workspace.toggle(_utils.KERNEL_MONITOR_URI);
        if (lastPane) lastPane.activate();
      }),
      "hydrogen:start-local-kernel": function hydrogenStartLocalKernel() {
        return _this.startZMQKernel();
      },
      "hydrogen:connect-to-remote-kernel": function hydrogenConnectToRemoteKernel() {
        return _this.connectToWSKernel();
      },
      "hydrogen:connect-to-existing-kernel": function hydrogenConnectToExistingKernel() {
        return _this.connectToExistingKernel();
      },
      "hydrogen:add-watch": function hydrogenAddWatch() {
        if (_store2["default"].kernel) {
          _store2["default"].kernel.watchesStore.addWatchFromEditor(_store2["default"].editor);
          (0, _utils.openOrShowDock)(_utils.WATCHES_URI);
        }
      },
      "hydrogen:remove-watch": function hydrogenRemoveWatch() {
        if (_store2["default"].kernel) {
          _store2["default"].kernel.watchesStore.removeWatch();
          (0, _utils.openOrShowDock)(_utils.WATCHES_URI);
        }
      },
      "hydrogen:update-kernels": function hydrogenUpdateKernels() {
        return _kernelManager2["default"].updateKernelSpecs();
      },
      "hydrogen:toggle-inspector": function hydrogenToggleInspector() {
        return commands.toggleInspector(_store2["default"]);
      },
      "hydrogen:interrupt-kernel": function hydrogenInterruptKernel() {
        return _this.handleKernelCommand({ command: "interrupt-kernel" }, _store2["default"]);
      },
      "hydrogen:restart-kernel": function hydrogenRestartKernel() {
        return _this.handleKernelCommand({ command: "restart-kernel" }, _store2["default"]);
      },
      "hydrogen:shutdown-kernel": function hydrogenShutdownKernel() {
        return _this.handleKernelCommand({ command: "shutdown-kernel" }, _store2["default"]);
      },
      "hydrogen:clear-result": function hydrogenClearResult() {
        return result.clearResult(_store2["default"]);
      },
      "hydrogen:export-notebook": function hydrogenExportNotebook() {
        return (0, _exportNotebook2["default"])();
      },
      "hydrogen:fold-current-cell": function hydrogenFoldCurrentCell() {
        return _this.foldCurrentCell();
      },
      "hydrogen:fold-all-but-current-cell": function hydrogenFoldAllButCurrentCell() {
        return _this.foldAllButCurrentCell();
      },
      "hydrogen:clear-results": function hydrogenClearResults() {
        return result.clearResults(_store2["default"]);
      }
    }));

    _store2["default"].subscriptions.add(atom.commands.add("atom-workspace", {
      "hydrogen:import-notebook": _importNotebook.importNotebook
    }));

    if (atom.inDevMode()) {
      _store2["default"].subscriptions.add(atom.commands.add("atom-workspace", {
        "hydrogen:hot-reload-package": function hydrogenHotReloadPackage() {
          return (0, _utils.hotReloadPackage)();
        }
      }));
    }

    _store2["default"].subscriptions.add(atom.workspace.observeActiveTextEditor(function (editor) {
      _store2["default"].updateEditor(editor);
    }));

    _store2["default"].subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      var editorSubscriptions = new _atom.CompositeDisposable();
      editorSubscriptions.add(editor.onDidChangeGrammar(function () {
        _store2["default"].setGrammar(editor);
      }));

      if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
        editorSubscriptions.add(editor.onDidChangeCursorPosition(_lodash2["default"].debounce(function () {
          _store2["default"].setGrammar(editor);
        }, 75)));
      }

      editorSubscriptions.add(editor.onDidDestroy(function () {
        editorSubscriptions.dispose();
      }));

      editorSubscriptions.add(editor.onDidChangeTitle(function (newTitle) {
        return _store2["default"].forceEditorUpdate();
      }));

      _store2["default"].subscriptions.add(editorSubscriptions);
    }));

    this.hydrogenProvider = null;

    _store2["default"].subscriptions.add(atom.workspace.addOpener(function (uri) {
      switch (uri) {
        case _utils.INSPECTOR_URI:
          return new _panesInspector2["default"](_store2["default"]);
        case _utils.WATCHES_URI:
          return new _panesWatches2["default"](_store2["default"]);
        case _utils.OUTPUT_AREA_URI:
          return new _panesOutputArea2["default"](_store2["default"]);
        case _utils.KERNEL_MONITOR_URI:
          return new _panesKernelMonitor2["default"](_store2["default"]);
      }
    }));
    _store2["default"].subscriptions.add(atom.workspace.addOpener(_importNotebook.ipynbOpener));

    _store2["default"].subscriptions.add(
    // Destroy any Panes when the package is deactivated.
    new _atom.Disposable(function () {
      atom.workspace.getPaneItems().forEach(function (item) {
        if (item instanceof _panesInspector2["default"] || item instanceof _panesWatches2["default"] || item instanceof _panesOutputArea2["default"] || item instanceof _panesKernelMonitor2["default"]) {
          item.destroy();
        }
      });
    }));

    (0, _mobx.autorun)(function () {
      _this.emitter.emit("did-change-kernel", _store2["default"].kernel);
    });
  },

  deactivate: function deactivate() {
    _store2["default"].dispose();
  },

  /*-------------- Service Providers --------------*/
  provideHydrogen: function provideHydrogen() {
    if (!this.hydrogenProvider) {
      this.hydrogenProvider = new _pluginApiHydrogenProvider2["default"](this);
    }

    return this.hydrogenProvider;
  },

  provideAutocompleteResults: function provideAutocompleteResults() {
    return _services2["default"].provided.autocomplete.provideAutocompleteResults(_store2["default"]);
  },
  /*-----------------------------------------------*/

  /*-------------- Service Consumers --------------*/
  consumeAutocompleteWatchEditor: function consumeAutocompleteWatchEditor(watchEditor) {
    return _services2["default"].consumed.autocomplete.consume(_store2["default"], watchEditor);
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    return _services2["default"].consumed.statusBar.addStatusBar(_store2["default"], statusBar, this.handleKernelCommand.bind(this));
  },
  /*-----------------------------------------------*/

  connectToExistingKernel: function connectToExistingKernel() {
    if (!this.existingKernelPicker) {
      this.existingKernelPicker = new _existingKernelPicker2["default"]();
    }
    this.existingKernelPicker.toggle();
  },

  handleKernelCommand: function handleKernelCommand(_ref2, _ref3) {
    var command = _ref2.command;
    var payload = _ref2.payload;
    var kernel = _ref3.kernel;
    var markers = _ref3.markers;
    return (function () {
      (0, _utils.log)("handleKernelCommand:", arguments);

      if (!kernel) {
        var message = "No running kernel for grammar or editor found";
        atom.notifications.addError(message);
        return;
      }

      if (command === "interrupt-kernel") {
        kernel.interrupt();
      } else if (command === "restart-kernel") {
        kernel.restart();
      } else if (command === "shutdown-kernel") {
        if (markers) markers.clear();
        // Note that destroy alone does not shut down a WSKernel
        kernel.shutdown();
        kernel.destroy();
      } else if (command === "rename-kernel" && kernel.transport instanceof _wsKernel2["default"]) {
        kernel.transport.promptRename();
      } else if (command === "disconnect-kernel") {
        if (markers) markers.clear();
        kernel.destroy();
      }
    }).apply(this, arguments);
  },

  run: function run() {
    var moveDown = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var editor = _store2["default"].editor;
    if (!editor) return;
    // https://github.com/nteract/hydrogen/issues/1452
    atom.commands.dispatch(editor.element, "autocomplete-plus:cancel");
    var codeBlock = codeManager.findCodeBlock(editor);
    if (!codeBlock) {
      return;
    }

    var codeNullable = codeBlock.code;
    if (codeNullable === null) return;

    var row = codeBlock.row;

    var cellType = codeManager.getMetadataForRow(editor, new _atom.Point(row, 0));

    var code = cellType === "markdown" ? codeManager.removeCommentsMarkdownCell(editor, codeNullable) : codeNullable;

    if (moveDown === true) {
      codeManager.moveDown(editor, row);
    }

    this.checkForKernel(_store2["default"], function (kernel) {
      result.createResult(_store2["default"], { code: code, row: row, cellType: cellType });
    });
  },

  runAll: function runAll(breakpoints) {
    var _this2 = this;

    var editor = _store2["default"].editor;
    var kernel = _store2["default"].kernel;
    var grammar = _store2["default"].grammar;
    var filePath = _store2["default"].filePath;

    if (!editor || !grammar || !filePath) return;
    if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
      atom.notifications.addError('"Run All" is not supported for this file type!');
      return;
    }

    if (editor && kernel) {
      this._runAll(editor, kernel, breakpoints);
      return;
    }

    _kernelManager2["default"].startKernelFor(grammar, editor, filePath, function (kernel) {
      _this2._runAll(editor, kernel, breakpoints);
    });
  },

  _runAll: function _runAll(editor, kernel, breakpoints) {
    var _this3 = this;

    var cells = codeManager.getCells(editor, breakpoints);

    var _loop = function (cell) {
      var start = cell.start;
      var end = cell.end;

      var codeNullable = codeManager.getTextInRange(editor, start, end);
      if (codeNullable === null) return "continue";

      var row = codeManager.escapeBlankRows(editor, start.row, end.row == editor.getLastBufferRow() ? end.row : end.row - 1);
      var cellType = codeManager.getMetadataForRow(editor, start);

      var code = cellType === "markdown" ? codeManager.removeCommentsMarkdownCell(editor, codeNullable) : codeNullable;

      _this3.checkForKernel(_store2["default"], function (kernel) {
        result.createResult(_store2["default"], { code: code, row: row, cellType: cellType });
      });
    };

    for (var cell of cells) {
      var _ret = _loop(cell);

      if (_ret === "continue") continue;
    }
  },

  runAllAbove: function runAllAbove() {
    var _this4 = this;

    var editor = _store2["default"].editor;
    var kernel = _store2["default"].kernel;
    var grammar = _store2["default"].grammar;
    var filePath = _store2["default"].filePath;

    if (!editor || !grammar || !filePath) return;
    if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
      atom.notifications.addError('"Run All Above" is not supported for this file type!');
      return;
    }

    if (editor && kernel) {
      this._runAllAbove(editor, kernel);
      return;
    }

    _kernelManager2["default"].startKernelFor(grammar, editor, filePath, function (kernel) {
      _this4._runAllAbove(editor, kernel);
    });
  },

  _runAllAbove: function _runAllAbove(editor, kernel) {
    var _this5 = this;

    var cursor = editor.getCursorBufferPosition();
    cursor.column = editor.getBuffer().lineLengthForRow(cursor.row);
    var breakpoints = codeManager.getBreakpoints(editor);
    breakpoints.push(cursor);
    var cells = codeManager.getCells(editor, breakpoints);

    var _loop2 = function (cell) {
      var start = cell.start;
      var end = cell.end;

      var codeNullable = codeManager.getTextInRange(editor, start, end);

      var row = codeManager.escapeBlankRows(editor, start.row, end.row == editor.getLastBufferRow() ? end.row : end.row - 1);
      var cellType = codeManager.getMetadataForRow(editor, start);

      if (codeNullable !== null) {
        (function () {
          var code = cellType === "markdown" ? codeManager.removeCommentsMarkdownCell(editor, codeNullable) : codeNullable;

          _this5.checkForKernel(_store2["default"], function (kernel) {
            result.createResult(_store2["default"], { code: code, row: row, cellType: cellType });
          });
        })();
      }

      if (cell.containsPoint(cursor)) {
        return "break";
      }
    };

    for (var cell of cells) {
      var _ret2 = _loop2(cell);

      if (_ret2 === "break") break;
    }
  },

  runCell: function runCell() {
    var moveDown = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var editor = _store2["default"].editor;
    if (!editor) return;
    // https://github.com/nteract/hydrogen/issues/1452
    atom.commands.dispatch(editor.element, "autocomplete-plus:cancel");

    var _codeManager$getCurrentCell = codeManager.getCurrentCell(editor);

    var start = _codeManager$getCurrentCell.start;
    var end = _codeManager$getCurrentCell.end;

    var codeNullable = codeManager.getTextInRange(editor, start, end);
    if (codeNullable === null) return;

    var row = codeManager.escapeBlankRows(editor, start.row, end.row == editor.getLastBufferRow() ? end.row : end.row - 1);
    var cellType = codeManager.getMetadataForRow(editor, start);

    var code = cellType === "markdown" ? codeManager.removeCommentsMarkdownCell(editor, codeNullable) : codeNullable;

    if (moveDown === true) {
      codeManager.moveDown(editor, row);
    }

    this.checkForKernel(_store2["default"], function (kernel) {
      result.createResult(_store2["default"], { code: code, row: row, cellType: cellType });
    });
  },

  foldCurrentCell: function foldCurrentCell() {
    var editor = _store2["default"].editor;
    if (!editor) return;
    codeManager.foldCurrentCell(editor);
  },

  foldAllButCurrentCell: function foldAllButCurrentCell() {
    var editor = _store2["default"].editor;
    if (!editor) return;
    codeManager.foldAllButCurrentCell(editor);
  },

  startZMQKernel: function startZMQKernel() {
    var _this6 = this;

    _kernelManager2["default"].getAllKernelSpecsForGrammar(_store2["default"].grammar).then(function (kernelSpecs) {
      if (_this6.kernelPicker) {
        _this6.kernelPicker.kernelSpecs = kernelSpecs;
      } else {
        _this6.kernelPicker = new _kernelPicker2["default"](kernelSpecs);

        _this6.kernelPicker.onConfirmed = function (kernelSpec) {
          var editor = _store2["default"].editor;
          var grammar = _store2["default"].grammar;
          var filePath = _store2["default"].filePath;
          var markers = _store2["default"].markers;

          if (!editor || !grammar || !filePath || !markers) return;
          markers.clear();

          _kernelManager2["default"].startKernel(kernelSpec, grammar, editor, filePath);
        };
      }

      _this6.kernelPicker.toggle();
    });
  },

  connectToWSKernel: function connectToWSKernel() {
    if (!this.wsKernelPicker) {
      this.wsKernelPicker = new _wsKernelPicker2["default"](function (transport) {
        var kernel = new _kernel2["default"](transport);
        var editor = _store2["default"].editor;
        var grammar = _store2["default"].grammar;
        var filePath = _store2["default"].filePath;
        var markers = _store2["default"].markers;

        if (!editor || !grammar || !filePath || !markers) return;
        markers.clear();

        if (kernel.transport instanceof _zmqKernel2["default"]) kernel.destroy();

        _store2["default"].newKernel(kernel, filePath, editor, grammar);
      });
    }

    this.wsKernelPicker.toggle(function (kernelSpec) {
      return (0, _utils.kernelSpecProvidesGrammar)(kernelSpec, _store2["default"].grammar);
    });
  },

  // Accepts store as an arg
  checkForKernel: function checkForKernel(_ref4, callback) {
    var editor = _ref4.editor;
    var grammar = _ref4.grammar;
    var filePath = _ref4.filePath;
    var kernel = _ref4.kernel;
    return (function () {
      if (!filePath || !grammar) {
        return atom.notifications.addError("The language grammar must be set in order to start a kernel. The easiest way to do this is to save the file.");
      }

      if (kernel) {
        callback(kernel);
        return;
      }

      _kernelManager2["default"].startKernelFor(grammar, editor, filePath, function (newKernel) {
        return callback(newKernel);
      });
    })();
  }
};

exports["default"] = Hydrogen;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQVFPLE1BQU07O3NCQUVDLFFBQVE7Ozs7b0JBQ0UsTUFBTTs7cUJBQ1osT0FBTzs7Ozs4QkFFQyxtQkFBbUI7Ozs7NEJBQ3JCLGlCQUFpQjs7OzsrQkFDbEIscUJBQXFCOzs7O2tDQUNkLHdCQUF3Qjs7OztzQkFDbkMsVUFBVTs7Ozt5QkFDUCxjQUFjOzs7O3dCQUNmLGFBQWE7Ozs7c0JBQ2YsVUFBVTs7Ozs0QkFDSixpQkFBaUI7Ozs7OEJBQ2Ysb0JBQW9COzs7O29DQUNkLDBCQUEwQjs7Ozt5Q0FDOUIsZ0NBQWdDOzs7O3FCQUUzQyxTQUFTOzs7OzZCQUNELGtCQUFrQjs7Ozt3QkFDdkIsWUFBWTs7Ozt3QkFDUCxZQUFZOztJQUExQixRQUFROzsyQkFDUyxnQkFBZ0I7O0lBQWpDLFdBQVc7O3NCQUNDLFVBQVU7O0lBQXRCLE1BQU07O3FCQWVYLFNBQVM7OzhCQUVXLG1CQUFtQjs7Ozs4QkFDRixtQkFBbUI7O0FBRS9ELElBQU0sUUFBUSxHQUFHO0FBQ2YsUUFBTSxFQUFFLG9CQUFPLE1BQU07O0FBRXJCLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDOztBQUU3QixRQUFJLDBCQUEwQixHQUFHLEtBQUssQ0FBQztBQUN2Qyx1QkFBTSxhQUFhLENBQUMsR0FBRyxDQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDckIsMkJBQTJCLEVBQzNCLFVBQUMsSUFBc0IsRUFBSztVQUF6QixRQUFRLEdBQVYsSUFBc0IsQ0FBcEIsUUFBUTtVQUFFLFFBQVEsR0FBcEIsSUFBc0IsQ0FBVixRQUFROztBQUNuQixVQUFJLDBCQUEwQixFQUFFO0FBQzlCLGtDQUEwQixHQUFHLEtBQUssQ0FBQztBQUNuQyxlQUFPO09BQ1I7O0FBRUQsVUFBSSxtQkFBTSxjQUFj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UUFBUSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQge1xuICBFbWl0dGVyLFxuICBDb21wb3NpdGVEaXNwb3NhYmxlLFxuICBEaXNwb3NhYmxlLFxuICBQb2ludCxcbiAgVGV4dEVkaXRvcixcbn0gZnJvbSBcImF0b21cIjtcblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgYXV0b3J1biB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBJbnNwZWN0b3JQYW5lIGZyb20gXCIuL3BhbmVzL2luc3BlY3RvclwiO1xuaW1wb3J0IFdhdGNoZXNQYW5lIGZyb20gXCIuL3BhbmVzL3dhdGNoZXNcIjtcbmltcG9ydCBPdXRwdXRQYW5lIGZyb20gXCIuL3BhbmVzL291dHB1dC1hcmVhXCI7XG5pbXBvcnQgS2VybmVsTW9uaXRvclBhbmUgZnJvbSBcIi4vcGFuZXMva2VybmVsLW1vbml0b3JcIjtcbmltcG9ydCBDb25maWcgZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgWk1RS2VybmVsIGZyb20gXCIuL3ptcS1rZXJuZWxcIjtcbmltcG9ydCBXU0tlcm5lbCBmcm9tIFwiLi93cy1rZXJuZWxcIjtcbmltcG9ydCBLZXJuZWwgZnJvbSBcIi4va2VybmVsXCI7XG5pbXBvcnQgS2VybmVsUGlja2VyIGZyb20gXCIuL2tlcm5lbC1waWNrZXJcIjtcbmltcG9ydCBXU0tlcm5lbFBpY2tlciBmcm9tIFwiLi93cy1rZXJuZWwtcGlja2VyXCI7XG5pbXBvcnQgRXhpc3RpbmdLZXJuZWxQaWNrZXIgZnJvbSBcIi4vZXhpc3Rpbmcta2VybmVsLXBpY2tlclwiO1xuaW1wb3J0IEh5ZHJvZ2VuUHJvdmlkZXIgZnJvbSBcIi4vcGx1Z2luLWFwaS9oeWRyb2dlbi1wcm92aWRlclwiO1xuXG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vc3RvcmVcIjtcbmltcG9ydCBrZXJuZWxNYW5hZ2VyIGZyb20gXCIuL2tlcm5lbC1tYW5hZ2VyXCI7XG5pbXBvcnQgc2VydmljZXMgZnJvbSBcIi4vc2VydmljZXNcIjtcbmltcG9ydCAqIGFzIGNvbW1hbmRzIGZyb20gXCIuL2NvbW1hbmRzXCI7XG5pbXBvcnQgKiBhcyBjb2RlTWFuYWdlciBmcm9tIFwiLi9jb2RlLW1hbmFnZXJcIjtcbmltcG9ydCAqIGFzIHJlc3VsdCBmcm9tIFwiLi9yZXN1bHRcIjtcblxuaW1wb3J0IHR5cGUgTWFya2VyU3RvcmUgZnJvbSBcIi4vc3RvcmUvbWFya2Vyc1wiO1xuXG5pbXBvcnQge1xuICBsb2csXG4gIHJlYWN0RmFjdG9yeSxcbiAgaXNNdWx0aWxhbmd1YWdlR3JhbW1hcixcbiAgSU5TUEVDVE9SX1VSSSxcbiAgV0FUQ0hFU19VUkksXG4gIE9VVFBVVF9BUkVBX1VSSSxcbiAgS0VSTkVMX01PTklUT1JfVVJJLFxuICBob3RSZWxvYWRQYWNrYWdlLFxuICBvcGVuT3JTaG93RG9jayxcbiAga2VybmVsU3BlY1Byb3ZpZGVzR3JhbW1hcixcbn0gZnJvbSBcIi4vdXRpbHNcIjtcblxuaW1wb3J0IGV4cG9ydE5vdGVib29rIGZyb20gXCIuL2V4cG9ydC1ub3RlYm9va1wiO1xuaW1wb3J0IHsgaW1wb3J0Tm90ZWJvb2ssIGlweW5iT3BlbmVyIH0gZnJvbSBcIi4vaW1wb3J0LW5vdGVib29rXCI7XG5cbmNvbnN0IEh5ZHJvZ2VuID0ge1xuICBjb25maWc6IENvbmZpZy5zY2hlbWEsXG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIGxldCBza2lwTGFuZ3VhZ2VNYXBwaW5nc0NoYW5nZSA9IGZhbHNlO1xuICAgIHN0b3JlLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoXG4gICAgICAgIFwiSHlkcm9nZW4ubGFuZ3VhZ2VNYXBwaW5nc1wiLFxuICAgICAgICAoeyBuZXdWYWx1ZSwgb2xkVmFsdWUgfSkgPT4ge1xuICAgICAgICAgIGlmIChza2lwTGFuZ3VhZ2VNYXBwaW5nc0NoYW5nZSkge1xuICAgICAgICAgICAgc2tpcExhbmd1YWdlTWFwcGluZ3NDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RvcmUucnVubmluZ0tlcm5lbHMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIHNraXBMYW5ndWFnZU1hcHBpbmdzQ2hhbmdlID0gdHJ1ZTtcblxuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KFwiSHlkcm9nZW4ubGFuZ3VhZ2VNYXBwaW5nc1wiLCBvbGRWYWx1ZSk7XG5cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkh5ZHJvZ2VuXCIsIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgXCJgbGFuZ3VhZ2VNYXBwaW5nc2AgY2Fubm90IGJlIHVwZGF0ZWQgd2hpbGUga2VybmVscyBhcmUgcnVubmluZ1wiLFxuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICApO1xuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKFwiSHlkcm9nZW4uc3RhdHVzQmFyRGlzYWJsZVwiLCAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgc3RvcmUuc2V0Q29uZmlnVmFsdWUoXCJIeWRyb2dlbi5zdGF0dXNCYXJEaXNhYmxlXCIsIEJvb2xlYW4obmV3VmFsdWUpKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZShcIkh5ZHJvZ2VuLnN0YXR1c0Jhcktlcm5lbEluZm9cIiwgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgIHN0b3JlLnNldENvbmZpZ1ZhbHVlKFwiSHlkcm9nZW4uc3RhdHVzQmFyS2VybmVsSW5mb1wiLCBCb29sZWFuKG5ld1ZhbHVlKSk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKVwiLCB7XG4gICAgICAgIFwiaHlkcm9nZW46cnVuXCI6ICgpID0+IHRoaXMucnVuKCksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWFsbFwiOiAoKSA9PiB0aGlzLnJ1bkFsbCgpLFxuICAgICAgICBcImh5ZHJvZ2VuOnJ1bi1hbGwtYWJvdmVcIjogKCkgPT4gdGhpcy5ydW5BbGxBYm92ZSgpLFxuICAgICAgICBcImh5ZHJvZ2VuOnJ1bi1hbmQtbW92ZS1kb3duXCI6ICgpID0+IHRoaXMucnVuKHRydWUpLFxuICAgICAgICBcImh5ZHJvZ2VuOnJ1bi1jZWxsXCI6ICgpID0+IHRoaXMucnVuQ2VsbCgpLFxuICAgICAgICBcImh5ZHJvZ2VuOnJ1bi1jZWxsLWFuZC1tb3ZlLWRvd25cIjogKCkgPT4gdGhpcy5ydW5DZWxsKHRydWUpLFxuICAgICAgICBcImh5ZHJvZ2VuOnRvZ2dsZS13YXRjaGVzXCI6ICgpID0+IGF0b20ud29ya3NwYWNlLnRvZ2dsZShXQVRDSEVTX1VSSSksXG4gICAgICAgIFwiaHlkcm9nZW46dG9nZ2xlLW91dHB1dC1hcmVhXCI6ICgpID0+IGNvbW1hbmRzLnRvZ2dsZU91dHB1dE1vZGUoKSxcbiAgICAgICAgXCJoeWRyb2dlbjp0b2dnbGUta2VybmVsLW1vbml0b3JcIjogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGxhc3RJdGVtID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICAgICAgICBjb25zdCBsYXN0UGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGxhc3RJdGVtKTtcbiAgICAgICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS50b2dnbGUoS0VSTkVMX01PTklUT1JfVVJJKTtcbiAgICAgICAgICBpZiAobGFzdFBhbmUpIGxhc3RQYW5lLmFjdGl2YXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiaHlkcm9nZW46c3RhcnQtbG9jYWwta2VybmVsXCI6ICgpID0+IHRoaXMuc3RhcnRaTVFLZXJuZWwoKSxcbiAgICAgICAgXCJoeWRyb2dlbjpjb25uZWN0LXRvLXJlbW90ZS1rZXJuZWxcIjogKCkgPT4gdGhpcy5jb25uZWN0VG9XU0tlcm5lbCgpLFxuICAgICAgICBcImh5ZHJvZ2VuOmNvbm5lY3QtdG8tZXhpc3Rpbmcta2VybmVsXCI6ICgpID0+XG4gICAgICAgICAgdGhpcy5jb25uZWN0VG9FeGlzdGluZ0tlcm5lbCgpLFxuICAgICAgICBcImh5ZHJvZ2VuOmFkZC13YXRjaFwiOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHN0b3JlLmtlcm5lbCkge1xuICAgICAgICAgICAgc3RvcmUua2VybmVsLndhdGNoZXNTdG9yZS5hZGRXYXRjaEZyb21FZGl0b3Ioc3RvcmUuZWRpdG9yKTtcbiAgICAgICAgICAgIG9wZW5PclNob3dEb2NrKFdBVENIRVNfVVJJKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaHlkcm9nZW46cmVtb3ZlLXdhdGNoXCI6ICgpID0+IHtcbiAgICAgICAgICBpZiAoc3RvcmUua2VybmVsKSB7XG4gICAgICAgICAgICBzdG9yZS5rZXJuZWwud2F0Y2hlc1N0b3JlLnJlbW92ZVdhdGNoKCk7XG4gICAgICAgICAgICBvcGVuT3JTaG93RG9jayhXQVRDSEVTX1VSSSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImh5ZHJvZ2VuOnVwZGF0ZS1rZXJuZWxzXCI6ICgpID0+IGtlcm5lbE1hbmFnZXIudXBkYXRlS2VybmVsU3BlY3MoKSxcbiAgICAgICAgXCJoeWRyb2dlbjp0b2dnbGUtaW5zcGVjdG9yXCI6ICgpID0+IGNvbW1hbmRzLnRvZ2dsZUluc3BlY3RvcihzdG9yZSksXG4gICAgICAgIFwiaHlkcm9nZW46aW50ZXJydXB0LWtlcm5lbFwiOiAoKSA9PlxuICAgICAgICAgIHRoaXMuaGFuZGxlS2VybmVsQ29tbWFuZCh7IGNvbW1hbmQ6IFwiaW50ZXJydXB0LWtlcm5lbFwiIH0sIHN0b3JlKSxcbiAgICAgICAgXCJoeWRyb2dlbjpyZXN0YXJ0LWtlcm5lbFwiOiAoKSA9PlxuICAgICAgICAgIHRoaXMuaGFuZGxlS2VybmVsQ29tbWFuZCh7IGNvbW1hbmQ6IFwicmVzdGFydC1rZXJuZWxcIiB9LCBzdG9yZSksXG4gICAgICAgIFwiaHlkcm9nZW46c2h1dGRvd24ta2VybmVsXCI6ICgpID0+XG4gICAgICAgICAgdGhpcy5oYW5kbGVLZXJuZWxDb21tYW5kKHsgY29tbWFuZDogXCJzaHV0ZG93bi1rZXJuZWxcIiB9LCBzdG9yZSksXG4gICAgICAgIFwiaHlkcm9nZW46Y2xlYXItcmVzdWx0XCI6ICgpID0+IHJlc3VsdC5jbGVhclJlc3VsdChzdG9yZSksXG4gICAgICAgIFwiaHlkcm9nZW46ZXhwb3J0LW5vdGVib29rXCI6ICgpID0+IGV4cG9ydE5vdGVib29rKCksXG4gICAgICAgIFwiaHlkcm9nZW46Zm9sZC1jdXJyZW50LWNlbGxcIjogKCkgPT4gdGhpcy5mb2xkQ3VycmVudENlbGwoKSxcbiAgICAgICAgXCJoeWRyb2dlbjpmb2xkLWFsbC1idXQtY3VycmVudC1jZWxsXCI6ICgpID0+XG4gICAgICAgICAgdGhpcy5mb2xkQWxsQnV0Q3VycmVudENlbGwoKSxcbiAgICAgICAgXCJoeWRyb2dlbjpjbGVhci1yZXN1bHRzXCI6ICgpID0+IHJlc3VsdC5jbGVhclJlc3VsdHMoc3RvcmUpLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChcImF0b20td29ya3NwYWNlXCIsIHtcbiAgICAgICAgXCJoeWRyb2dlbjppbXBvcnQtbm90ZWJvb2tcIjogaW1wb3J0Tm90ZWJvb2ssXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwge1xuICAgICAgICAgIFwiaHlkcm9nZW46aG90LXJlbG9hZC1wYWNrYWdlXCI6ICgpID0+IGhvdFJlbG9hZFBhY2thZ2UoKSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlVGV4dEVkaXRvcigoZWRpdG9yKSA9PiB7XG4gICAgICAgIHN0b3JlLnVwZGF0ZUVkaXRvcihlZGl0b3IpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBlZGl0b3JTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICAgICAgZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlR3JhbW1hcigoKSA9PiB7XG4gICAgICAgICAgICBzdG9yZS5zZXRHcmFtbWFyKGVkaXRvcik7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoaXNNdWx0aWxhbmd1YWdlR3JhbW1hcihlZGl0b3IuZ2V0R3JhbW1hcigpKSkge1xuICAgICAgICAgIGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oXG4gICAgICAgICAgICAgIF8uZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0b3JlLnNldEdyYW1tYXIoZWRpdG9yKTtcbiAgICAgICAgICAgICAgfSwgNzUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICAgICAgZWRpdG9yU3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VUaXRsZSgobmV3VGl0bGUpID0+IHN0b3JlLmZvcmNlRWRpdG9yVXBkYXRlKCkpXG4gICAgICAgICk7XG5cbiAgICAgICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yU3Vic2NyaXB0aW9ucyk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLmh5ZHJvZ2VuUHJvdmlkZXIgPSBudWxsO1xuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIoKHVyaSkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHVyaSkge1xuICAgICAgICAgIGNhc2UgSU5TUEVDVE9SX1VSSTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgSW5zcGVjdG9yUGFuZShzdG9yZSk7XG4gICAgICAgICAgY2FzZSBXQVRDSEVTX1VSSTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgV2F0Y2hlc1BhbmUoc3RvcmUpO1xuICAgICAgICAgIGNhc2UgT1VUUFVUX0FSRUFfVVJJOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBPdXRwdXRQYW5lKHN0b3JlKTtcbiAgICAgICAgICBjYXNlIEtFUk5FTF9NT05JVE9SX1VSSTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgS2VybmVsTW9uaXRvclBhbmUoc3RvcmUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKGlweW5iT3BlbmVyKSk7XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIC8vIERlc3Ryb3kgYW55IFBhbmVzIHdoZW4gdGhlIHBhY2thZ2UgaXMgZGVhY3RpdmF0ZWQuXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBpdGVtIGluc3RhbmNlb2YgSW5zcGVjdG9yUGFuZSB8fFxuICAgICAgICAgICAgaXRlbSBpbnN0YW5jZW9mIFdhdGNoZXNQYW5lIHx8XG4gICAgICAgICAgICBpdGVtIGluc3RhbmNlb2YgT3V0cHV0UGFuZSB8fFxuICAgICAgICAgICAgaXRlbSBpbnN0YW5jZW9mIEtlcm5lbE1vbml0b3JQYW5lXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBpdGVtLmRlc3Ryb3koKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgYXV0b3J1bigoKSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdChcImRpZC1jaGFuZ2Uta2VybmVsXCIsIHN0b3JlLmtlcm5lbCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBzdG9yZS5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgLyotLS0tLS0tLS0tLS0tLSBTZXJ2aWNlIFByb3ZpZGVycyAtLS0tLS0tLS0tLS0tLSovXG4gIHByb3ZpZGVIeWRyb2dlbigpIHtcbiAgICBpZiAoIXRoaXMuaHlkcm9nZW5Qcm92aWRlcikge1xuICAgICAgdGhpcy5oeWRyb2dlblByb3ZpZGVyID0gbmV3IEh5ZHJvZ2VuUHJvdmlkZXIodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaHlkcm9nZW5Qcm92aWRlcjtcbiAgfSxcblxuICBwcm92aWRlQXV0b2NvbXBsZXRlUmVzdWx0cygpIHtcbiAgICByZXR1cm4gc2VydmljZXMucHJvdmlkZWQuYXV0b2NvbXBsZXRlLnByb3ZpZGVBdXRvY29tcGxldGVSZXN1bHRzKHN0b3JlKTtcbiAgfSxcbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyotLS0tLS0tLS0tLS0tLSBTZXJ2aWNlIENvbnN1bWVycyAtLS0tLS0tLS0tLS0tLSovXG4gIGNvbnN1bWVBdXRvY29tcGxldGVXYXRjaEVkaXRvcih3YXRjaEVkaXRvcjogRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gc2VydmljZXMuY29uc3VtZWQuYXV0b2NvbXBsZXRlLmNvbnN1bWUoc3RvcmUsIHdhdGNoRWRpdG9yKTtcbiAgfSxcblxuICBjb25zdW1lU3RhdHVzQmFyKHN0YXR1c0JhcjogYXRvbSRTdGF0dXNCYXIpIHtcbiAgICByZXR1cm4gc2VydmljZXMuY29uc3VtZWQuc3RhdHVzQmFyLmFkZFN0YXR1c0JhcihcbiAgICAgIHN0b3JlLFxuICAgICAgc3RhdHVzQmFyLFxuICAgICAgdGhpcy5oYW5kbGVLZXJuZWxDb21tYW5kLmJpbmQodGhpcylcbiAgICApO1xuICB9LFxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICBjb25uZWN0VG9FeGlzdGluZ0tlcm5lbCgpIHtcbiAgICBpZiAoIXRoaXMuZXhpc3RpbmdLZXJuZWxQaWNrZXIpIHtcbiAgICAgIHRoaXMuZXhpc3RpbmdLZXJuZWxQaWNrZXIgPSBuZXcgRXhpc3RpbmdLZXJuZWxQaWNrZXIoKTtcbiAgICB9XG4gICAgdGhpcy5leGlzdGluZ0tlcm5lbFBpY2tlci50b2dnbGUoKTtcbiAgfSxcblxuICBoYW5kbGVLZXJuZWxDb21tYW5kKFxuICAgIHsgY29tbWFuZCwgcGF5bG9hZCB9OiB7IGNvbW1hbmQ6IHN0cmluZywgcGF5bG9hZDogP0tlcm5lbHNwZWMgfSxcbiAgICB7IGtlcm5lbCwgbWFya2VycyB9OiB7IGtlcm5lbDogP0tlcm5lbCwgbWFya2VyczogP01hcmtlclN0b3JlIH1cbiAgKSB7XG4gICAgbG9nKFwiaGFuZGxlS2VybmVsQ29tbWFuZDpcIiwgYXJndW1lbnRzKTtcblxuICAgIGlmICgha2VybmVsKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gXCJObyBydW5uaW5nIGtlcm5lbCBmb3IgZ3JhbW1hciBvciBlZGl0b3IgZm91bmRcIjtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gXCJpbnRlcnJ1cHQta2VybmVsXCIpIHtcbiAgICAgIGtlcm5lbC5pbnRlcnJ1cHQoKTtcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09IFwicmVzdGFydC1rZXJuZWxcIikge1xuICAgICAga2VybmVsLnJlc3RhcnQoKTtcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09IFwic2h1dGRvd24ta2VybmVsXCIpIHtcbiAgICAgIGlmIChtYXJrZXJzKSBtYXJrZXJzLmNsZWFyKCk7XG4gICAgICAvLyBOb3RlIHRoYXQgZGVzdHJveSBhbG9uZSBkb2VzIG5vdCBzaHV0IGRvd24gYSBXU0tlcm5lbFxuICAgICAga2VybmVsLnNodXRkb3duKCk7XG4gICAgICBrZXJuZWwuZGVzdHJveSgpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjb21tYW5kID09PSBcInJlbmFtZS1rZXJuZWxcIiAmJlxuICAgICAga2VybmVsLnRyYW5zcG9ydCBpbnN0YW5jZW9mIFdTS2VybmVsXG4gICAgKSB7XG4gICAgICBrZXJuZWwudHJhbnNwb3J0LnByb21wdFJlbmFtZSgpO1xuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gXCJkaXNjb25uZWN0LWtlcm5lbFwiKSB7XG4gICAgICBpZiAobWFya2VycykgbWFya2Vycy5jbGVhcigpO1xuICAgICAga2VybmVsLmRlc3Ryb3koKTtcbiAgICB9XG4gIH0sXG5cbiAgcnVuKG1vdmVEb3duOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBzdG9yZS5lZGl0b3I7XG4gICAgaWYgKCFlZGl0b3IpIHJldHVybjtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbnRlcmFjdC9oeWRyb2dlbi9pc3N1ZXMvMTQ1MlxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yLmVsZW1lbnQsIFwiYXV0b2NvbXBsZXRlLXBsdXM6Y2FuY2VsXCIpO1xuICAgIGNvbnN0IGNvZGVCbG9jayA9IGNvZGVNYW5hZ2VyLmZpbmRDb2RlQmxvY2soZWRpdG9yKTtcbiAgICBpZiAoIWNvZGVCbG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvZGVOdWxsYWJsZSA9IGNvZGVCbG9jay5jb2RlO1xuICAgIGlmIChjb2RlTnVsbGFibGUgPT09IG51bGwpIHJldHVybjtcblxuICAgIGNvbnN0IHsgcm93IH0gPSBjb2RlQmxvY2s7XG4gICAgY29uc3QgY2VsbFR5cGUgPSBjb2RlTWFuYWdlci5nZXRNZXRhZGF0YUZvclJvdyhlZGl0b3IsIG5ldyBQb2ludChyb3csIDApKTtcblxuICAgIGNvbnN0IGNvZGUgPVxuICAgICAgY2VsbFR5cGUgPT09IFwibWFya2Rvd25cIlxuICAgICAgICA/IGNvZGVNYW5hZ2VyLnJlbW92ZUNvbW1lbnRzTWFya2Rvd25DZWxsKGVkaXRvciwgY29kZU51bGxhYmxlKVxuICAgICAgICA6IGNvZGVOdWxsYWJsZTtcblxuICAgIGlmIChtb3ZlRG93biA9PT0gdHJ1ZSkge1xuICAgICAgY29kZU1hbmFnZXIubW92ZURvd24oZWRpdG9yLCByb3cpO1xuICAgIH1cblxuICAgIHRoaXMuY2hlY2tGb3JLZXJuZWwoc3RvcmUsIChrZXJuZWwpID0+IHtcbiAgICAgIHJlc3VsdC5jcmVhdGVSZXN1bHQoc3RvcmUsIHsgY29kZSwgcm93LCBjZWxsVHlwZSB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBydW5BbGwoYnJlYWtwb2ludHM6ID9BcnJheTxhdG9tJFBvaW50Pikge1xuICAgIGNvbnN0IHsgZWRpdG9yLCBrZXJuZWwsIGdyYW1tYXIsIGZpbGVQYXRoIH0gPSBzdG9yZTtcbiAgICBpZiAoIWVkaXRvciB8fCAhZ3JhbW1hciB8fCAhZmlsZVBhdGgpIHJldHVybjtcbiAgICBpZiAoaXNNdWx0aWxhbmd1YWdlR3JhbW1hcihlZGl0b3IuZ2V0R3JhbW1hcigpKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICAnXCJSdW4gQWxsXCIgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhpcyBmaWxlIHR5cGUhJ1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZWRpdG9yICYmIGtlcm5lbCkge1xuICAgICAgdGhpcy5fcnVuQWxsKGVkaXRvciwga2VybmVsLCBicmVha3BvaW50cyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAga2VybmVsTWFuYWdlci5zdGFydEtlcm5lbEZvcihcbiAgICAgIGdyYW1tYXIsXG4gICAgICBlZGl0b3IsXG4gICAgICBmaWxlUGF0aCxcbiAgICAgIChrZXJuZWw6IEtlcm5lbCkgPT4ge1xuICAgICAgICB0aGlzLl9ydW5BbGwoZWRpdG9yLCBrZXJuZWwsIGJyZWFrcG9pbnRzKTtcbiAgICAgIH1cbiAgICApO1xuICB9LFxuXG4gIF9ydW5BbGwoXG4gICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAga2VybmVsOiBLZXJuZWwsXG4gICAgYnJlYWtwb2ludHM/OiBBcnJheTxhdG9tJFBvaW50PlxuICApIHtcbiAgICBsZXQgY2VsbHMgPSBjb2RlTWFuYWdlci5nZXRDZWxscyhlZGl0b3IsIGJyZWFrcG9pbnRzKTtcbiAgICBmb3IgKGNvbnN0IGNlbGwgb2YgY2VsbHMpIHtcbiAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gY2VsbDtcbiAgICAgIGNvbnN0IGNvZGVOdWxsYWJsZSA9IGNvZGVNYW5hZ2VyLmdldFRleHRJblJhbmdlKGVkaXRvciwgc3RhcnQsIGVuZCk7XG4gICAgICBpZiAoY29kZU51bGxhYmxlID09PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgcm93ID0gY29kZU1hbmFnZXIuZXNjYXBlQmxhbmtSb3dzKFxuICAgICAgICBlZGl0b3IsXG4gICAgICAgIHN0YXJ0LnJvdyxcbiAgICAgICAgZW5kLnJvdyA9PSBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpID8gZW5kLnJvdyA6IGVuZC5yb3cgLSAxXG4gICAgICApO1xuICAgICAgY29uc3QgY2VsbFR5cGUgPSBjb2RlTWFuYWdlci5nZXRNZXRhZGF0YUZvclJvdyhlZGl0b3IsIHN0YXJ0KTtcblxuICAgICAgY29uc3QgY29kZSA9XG4gICAgICAgIGNlbGxUeXBlID09PSBcIm1hcmtkb3duXCJcbiAgICAgICAgICA/IGNvZGVNYW5hZ2VyLnJlbW92ZUNvbW1lbnRzTWFya2Rvd25DZWxsKGVkaXRvciwgY29kZU51bGxhYmxlKVxuICAgICAgICAgIDogY29kZU51bGxhYmxlO1xuXG4gICAgICB0aGlzLmNoZWNrRm9yS2VybmVsKHN0b3JlLCAoa2VybmVsKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jcmVhdGVSZXN1bHQoc3RvcmUsIHsgY29kZSwgcm93LCBjZWxsVHlwZSB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBydW5BbGxBYm92ZSgpIHtcbiAgICBjb25zdCB7IGVkaXRvciwga2VybmVsLCBncmFtbWFyLCBmaWxlUGF0aCB9ID0gc3RvcmU7XG4gICAgaWYgKCFlZGl0b3IgfHwgIWdyYW1tYXIgfHwgIWZpbGVQYXRoKSByZXR1cm47XG4gICAgaWYgKGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIoZWRpdG9yLmdldEdyYW1tYXIoKSkpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgJ1wiUnVuIEFsbCBBYm92ZVwiIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZmlsZSB0eXBlISdcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVkaXRvciAmJiBrZXJuZWwpIHtcbiAgICAgIHRoaXMuX3J1bkFsbEFib3ZlKGVkaXRvciwga2VybmVsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBrZXJuZWxNYW5hZ2VyLnN0YXJ0S2VybmVsRm9yKFxuICAgICAgZ3JhbW1hcixcbiAgICAgIGVkaXRvcixcbiAgICAgIGZpbGVQYXRoLFxuICAgICAgKGtlcm5lbDogS2VybmVsKSA9PiB7XG4gICAgICAgIHRoaXMuX3J1bkFsbEFib3ZlKGVkaXRvciwga2VybmVsKTtcbiAgICAgIH1cbiAgICApO1xuICB9LFxuXG4gIF9ydW5BbGxBYm92ZShlZGl0b3I6IGF0b20kVGV4dEVkaXRvciwga2VybmVsOiBLZXJuZWwpIHtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKTtcbiAgICBjdXJzb3IuY29sdW1uID0gZWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVMZW5ndGhGb3JSb3coY3Vyc29yLnJvdyk7XG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSBjb2RlTWFuYWdlci5nZXRCcmVha3BvaW50cyhlZGl0b3IpO1xuICAgIGJyZWFrcG9pbnRzLnB1c2goY3Vyc29yKTtcbiAgICBjb25zdCBjZWxscyA9IGNvZGVNYW5hZ2VyLmdldENlbGxzKGVkaXRvciwgYnJlYWtwb2ludHMpO1xuICAgIGZvciAoY29uc3QgY2VsbCBvZiBjZWxscykge1xuICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBjZWxsO1xuICAgICAgY29uc3QgY29kZU51bGxhYmxlID0gY29kZU1hbmFnZXIuZ2V0VGV4dEluUmFuZ2UoZWRpdG9yLCBzdGFydCwgZW5kKTtcblxuICAgICAgY29uc3Qgcm93ID0gY29kZU1hbmFnZXIuZXNjYXBlQmxhbmtSb3dzKFxuICAgICAgICBlZGl0b3IsXG4gICAgICAgIHN0YXJ0LnJvdyxcbiAgICAgICAgZW5kLnJvdyA9PSBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpID8gZW5kLnJvdyA6IGVuZC5yb3cgLSAxXG4gICAgICApO1xuICAgICAgY29uc3QgY2VsbFR5cGUgPSBjb2RlTWFuYWdlci5nZXRNZXRhZGF0YUZvclJvdyhlZGl0b3IsIHN0YXJ0KTtcblxuICAgICAgaWYgKGNvZGVOdWxsYWJsZSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBjb2RlID1cbiAgICAgICAgICBjZWxsVHlwZSA9PT0gXCJtYXJrZG93blwiXG4gICAgICAgICAgICA/IGNvZGVNYW5hZ2VyLnJlbW92ZUNvbW1lbnRzTWFya2Rvd25DZWxsKGVkaXRvciwgY29kZU51bGxhYmxlKVxuICAgICAgICAgICAgOiBjb2RlTnVsbGFibGU7XG5cbiAgICAgICAgdGhpcy5jaGVja0Zvcktlcm5lbChzdG9yZSwgKGtlcm5lbCkgPT4ge1xuICAgICAgICAgIHJlc3VsdC5jcmVhdGVSZXN1bHQoc3RvcmUsIHsgY29kZSwgcm93LCBjZWxsVHlwZSB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjZWxsLmNvbnRhaW5zUG9pbnQoY3Vyc29yKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcnVuQ2VsbChtb3ZlRG93bjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZWRpdG9yID0gc3RvcmUuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm47XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL250ZXJhY3QvaHlkcm9nZW4vaXNzdWVzLzE0NTJcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvci5lbGVtZW50LCBcImF1dG9jb21wbGV0ZS1wbHVzOmNhbmNlbFwiKTtcblxuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gY29kZU1hbmFnZXIuZ2V0Q3VycmVudENlbGwoZWRpdG9yKTtcbiAgICBjb25zdCBjb2RlTnVsbGFibGUgPSBjb2RlTWFuYWdlci5nZXRUZXh0SW5SYW5nZShlZGl0b3IsIHN0YXJ0LCBlbmQpO1xuICAgIGlmIChjb2RlTnVsbGFibGUgPT09IG51bGwpIHJldHVybjtcblxuICAgIGNvbnN0IHJvdyA9IGNvZGVNYW5hZ2VyLmVzY2FwZUJsYW5rUm93cyhcbiAgICAgIGVkaXRvcixcbiAgICAgIHN0YXJ0LnJvdyxcbiAgICAgIGVuZC5yb3cgPT0gZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKSA/IGVuZC5yb3cgOiBlbmQucm93IC0gMVxuICAgICk7XG4gICAgY29uc3QgY2VsbFR5cGUgPSBjb2RlTWFuYWdlci5nZXRNZXRhZGF0YUZvclJvdyhlZGl0b3IsIHN0YXJ0KTtcblxuICAgIGNvbnN0IGNvZGUgPVxuICAgICAgY2VsbFR5cGUgPT09IFwibWFya2Rvd25cIlxuICAgICAgICA/IGNvZGVNYW5hZ2VyLnJlbW92ZUNvbW1lbnRzTWFya2Rvd25DZWxsKGVkaXRvciwgY29kZU51bGxhYmxlKVxuICAgICAgICA6IGNvZGVOdWxsYWJsZTtcblxuICAgIGlmIChtb3ZlRG93biA9PT0gdHJ1ZSkge1xuICAgICAgY29kZU1hbmFnZXIubW92ZURvd24oZWRpdG9yLCByb3cpO1xuICAgIH1cblxuICAgIHRoaXMuY2hlY2tGb3JLZXJuZWwoc3RvcmUsIChrZXJuZWwpID0+IHtcbiAgICAgIHJlc3VsdC5jcmVhdGVSZXN1bHQoc3RvcmUsIHsgY29kZSwgcm93LCBjZWxsVHlwZSB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBmb2xkQ3VycmVudENlbGwoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gc3RvcmUuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm47XG4gICAgY29kZU1hbmFnZXIuZm9sZEN1cnJlbnRDZWxsKGVkaXRvcik7XG4gIH0sXG5cbiAgZm9sZEFsbEJ1dEN1cnJlbnRDZWxsKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IHN0b3JlLmVkaXRvcjtcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuO1xuICAgIGNvZGVNYW5hZ2VyLmZvbGRBbGxCdXRDdXJyZW50Q2VsbChlZGl0b3IpO1xuICB9LFxuXG4gIHN0YXJ0Wk1RS2VybmVsKCkge1xuICAgIGtlcm5lbE1hbmFnZXJcbiAgICAgIC5nZXRBbGxLZXJuZWxTcGVjc0ZvckdyYW1tYXIoc3RvcmUuZ3JhbW1hcilcbiAgICAgIC50aGVuKChrZXJuZWxTcGVjcykgPT4ge1xuICAgICAgICBpZiAodGhpcy5rZXJuZWxQaWNrZXIpIHtcbiAgICAgICAgICB0aGlzLmtlcm5lbFBpY2tlci5rZXJuZWxTcGVjcyA9IGtlcm5lbFNwZWNzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMua2VybmVsUGlja2VyID0gbmV3IEtlcm5lbFBpY2tlcihrZXJuZWxTcGVjcyk7XG5cbiAgICAgICAgICB0aGlzLmtlcm5lbFBpY2tlci5vbkNvbmZpcm1lZCA9IChrZXJuZWxTcGVjOiBLZXJuZWxzcGVjKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGVkaXRvciwgZ3JhbW1hciwgZmlsZVBhdGgsIG1hcmtlcnMgfSA9IHN0b3JlO1xuICAgICAgICAgICAgaWYgKCFlZGl0b3IgfHwgIWdyYW1tYXIgfHwgIWZpbGVQYXRoIHx8ICFtYXJrZXJzKSByZXR1cm47XG4gICAgICAgICAgICBtYXJrZXJzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIGtlcm5lbE1hbmFnZXIuc3RhcnRLZXJuZWwoa2VybmVsU3BlYywgZ3JhbW1hciwgZWRpdG9yLCBmaWxlUGF0aCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMua2VybmVsUGlja2VyLnRvZ2dsZSgpO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgY29ubmVjdFRvV1NLZXJuZWwoKSB7XG4gICAgaWYgKCF0aGlzLndzS2VybmVsUGlja2VyKSB7XG4gICAgICB0aGlzLndzS2VybmVsUGlja2VyID0gbmV3IFdTS2VybmVsUGlja2VyKCh0cmFuc3BvcnQ6IFdTS2VybmVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGtlcm5lbCA9IG5ldyBLZXJuZWwodHJhbnNwb3J0KTtcbiAgICAgICAgY29uc3QgeyBlZGl0b3IsIGdyYW1tYXIsIGZpbGVQYXRoLCBtYXJrZXJzIH0gPSBzdG9yZTtcbiAgICAgICAgaWYgKCFlZGl0b3IgfHwgIWdyYW1tYXIgfHwgIWZpbGVQYXRoIHx8ICFtYXJrZXJzKSByZXR1cm47XG4gICAgICAgIG1hcmtlcnMuY2xlYXIoKTtcblxuICAgICAgICBpZiAoa2VybmVsLnRyYW5zcG9ydCBpbnN0YW5jZW9mIFpNUUtlcm5lbCkga2VybmVsLmRlc3Ryb3koKTtcblxuICAgICAgICBzdG9yZS5uZXdLZXJuZWwoa2VybmVsLCBmaWxlUGF0aCwgZWRpdG9yLCBncmFtbWFyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMud3NLZXJuZWxQaWNrZXIudG9nZ2xlKChrZXJuZWxTcGVjOiBLZXJuZWxzcGVjKSA9PlxuICAgICAga2VybmVsU3BlY1Byb3ZpZGVzR3JhbW1hcihrZXJuZWxTcGVjLCBzdG9yZS5ncmFtbWFyKVxuICAgICk7XG4gIH0sXG5cbiAgLy8gQWNjZXB0cyBzdG9yZSBhcyBhbiBhcmdcbiAgY2hlY2tGb3JLZXJuZWwoXG4gICAge1xuICAgICAgZWRpdG9yLFxuICAgICAgZ3JhbW1hcixcbiAgICAgIGZpbGVQYXRoLFxuICAgICAga2VybmVsLFxuICAgIH06IHtcbiAgICAgIGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yLFxuICAgICAgZ3JhbW1hcjogYXRvbSRHcmFtbWFyLFxuICAgICAgZmlsZVBhdGg6IHN0cmluZyxcbiAgICAgIGtlcm5lbD86IEtlcm5lbCxcbiAgICB9LFxuICAgIGNhbGxiYWNrOiAoa2VybmVsOiBLZXJuZWwpID0+IHZvaWRcbiAgKSB7XG4gICAgaWYgKCFmaWxlUGF0aCB8fCAhZ3JhbW1hcikge1xuICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgXCJUaGUgbGFuZ3VhZ2UgZ3JhbW1hciBtdXN0IGJlIHNldCBpbiBvcmRlciB0byBzdGFydCBhIGtlcm5lbC4gVGhlIGVhc2llc3Qgd2F5IHRvIGRvIHRoaXMgaXMgdG8gc2F2ZSB0aGUgZmlsZS5cIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoa2VybmVsKSB7XG4gICAgICBjYWxsYmFjayhrZXJuZWwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGtlcm5lbE1hbmFnZXIuc3RhcnRLZXJuZWxGb3IoXG4gICAgICBncmFtbWFyLFxuICAgICAgZWRpdG9yLFxuICAgICAgZmlsZVBhdGgsXG4gICAgICAobmV3S2VybmVsOiBLZXJuZWwpID0+IGNhbGxiYWNrKG5ld0tlcm5lbClcbiAgICApO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgSHlkcm9nZW47XG4iXX0=