Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _atom = require("atom");

var _mobx = require("mobx");

var _utils = require("./../utils");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require("./../config");

var _config2 = _interopRequireDefault(_config);

var _codeManager = require("./../code-manager");

var codeManager = _interopRequireWildcard(_codeManager);

var _markers = require("./markers");

var _markers2 = _interopRequireDefault(_markers);

var _kernelManager = require("./../kernel-manager");

var _kernelManager2 = _interopRequireDefault(_kernelManager);

var _kernel = require("./../kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var commutable = require("@nteract/commutable");

var Store = (function () {
  var _instanceInitializers = {};

  function Store() {
    _classCallCheck(this, Store);

    this.subscriptions = new _atom.CompositeDisposable();

    _defineDecoratedPropertyDescriptor(this, "markersMapping", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "runningKernels", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "kernelMapping", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "startingKernels", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "editor", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "grammar", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "configMapping", _instanceInitializers);

    this.globalMode = Boolean(atom.config.get("Hydrogen.globalMode"));
  }

  _createDecoratedClass(Store, [{
    key: "newMarkerStore",
    decorators: [_mobx.action],
    value: function newMarkerStore(editorId) {
      var markerStore = new _markers2["default"]();
      this.markersMapping.set(editorId, markerStore);
      return markerStore;
    }
  }, {
    key: "startKernel",
    decorators: [_mobx.action],
    value: function startKernel(kernelDisplayName) {
      this.startingKernels.set(kernelDisplayName, true);
    }
  }, {
    key: "addFileDisposer",
    value: function addFileDisposer(editor, filePath) {
      var _this = this;

      var fileDisposer = new _atom.CompositeDisposable();

      if ((0, _utils.isUnsavedFilePath)(filePath)) {
        fileDisposer.add(editor.onDidSave(function (event) {
          fileDisposer.dispose();
          _this.addFileDisposer(editor, event.path); // Add another `fileDisposer` once it's saved
        }));
        fileDisposer.add(editor.onDidDestroy(function () {
          _this.kernelMapping["delete"](filePath);
          fileDisposer.dispose();
        }));
      } else {
        var file = new _atom.File(filePath);
        fileDisposer.add(file.onDidDelete(function () {
          _this.kernelMapping["delete"](filePath);
          fileDisposer.dispose();
        }));
      }

      this.subscriptions.add(fileDisposer);
    }
  }, {
    key: "newKernel",
    decorators: [_mobx.action],
    value: function newKernel(kernel, filePath, editor, grammar) {
      if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
        if (!this.kernelMapping.has(filePath)) {
          this.kernelMapping.set(filePath, new Map());
        }
        var multiLanguageMap = this.kernelMapping.get(filePath);
        if (multiLanguageMap) multiLanguageMap.set(grammar.name, kernel);
      } else {
        this.kernelMapping.set(filePath, kernel);
      }
      this.addFileDisposer(editor, filePath);
      var index = this.runningKernels.findIndex(function (k) {
        return k === kernel;
      });
      if (index === -1) {
        this.runningKernels.push(kernel);
      }
      // delete startingKernel since store.kernel now in place to prevent duplicate kernel
      this.startingKernels["delete"](kernel.kernelSpec.display_name);
    }
  }, {
    key: "deleteKernel",
    decorators: [_mobx.action],
    value: function deleteKernel(kernel) {
      var _this2 = this;

      var grammar = kernel.grammar.name;
      var files = this.getFilesForKernel(kernel);

      files.forEach(function (file) {
        var kernelOrMap = _this2.kernelMapping.get(file);
        if (!kernelOrMap) return;
        if (kernelOrMap instanceof _kernel2["default"]) {
          _this2.kernelMapping["delete"](file);
        } else {
          kernelOrMap["delete"](grammar);
        }
      });

      this.runningKernels = this.runningKernels.filter(function (k) {
        return k !== kernel;
      });
    }
  }, {
    key: "getFilesForKernel",
    value: function getFilesForKernel(kernel) {
      var _this3 = this;

      var grammar = kernel.grammar.name;
      return this.filePaths.filter(function (file) {
        var kernelOrMap = _this3.kernelMapping.get(file);
        if (!kernelOrMap) return false;
        return kernelOrMap instanceof _kernel2["default"] ? kernelOrMap === kernel : kernelOrMap.get(grammar) === kernel;
      });
    }
  }, {
    key: "dispose",
    decorators: [_mobx.action],
    value: function dispose() {
      this.subscriptions.dispose();
      this.markersMapping.forEach(function (markerStore) {
        return markerStore.clear();
      });
      this.markersMapping.clear();
      this.runningKernels.forEach(function (kernel) {
        return kernel.destroy();
      });
      this.runningKernels = [];
      this.kernelMapping.clear();
    }
  }, {
    key: "updateEditor",
    decorators: [_mobx.action],
    value: function updateEditor(editor) {
      this.editor = editor;
      this.setGrammar(editor);

      if (this.globalMode && this.kernel && editor) {
        var fileName = editor.getPath();
        if (!fileName) return;
        this.kernelMapping.set(fileName, this.kernel);
      }
    }

    // Returns the embedded grammar for multilanguage, normal grammar otherwise
  }, {
    key: "getEmbeddedGrammar",
    value: function getEmbeddedGrammar(editor) {
      var grammar = editor.getGrammar();
      if (!(0, _utils.isMultilanguageGrammar)(grammar)) {
        return grammar;
      }

      var embeddedScope = (0, _utils.getEmbeddedScope)(editor, editor.getCursorBufferPosition());

      if (!embeddedScope) return grammar;
      var scope = embeddedScope.replace(".embedded", "");
      return atom.grammars.grammarForScopeName(scope);
    }
  }, {
    key: "setGrammar",
    decorators: [_mobx.action],
    value: function setGrammar(editor) {
      if (!editor) {
        this.grammar = null;
        return;
      }

      this.grammar = this.getEmbeddedGrammar(editor);
    }
  }, {
    key: "setConfigValue",
    decorators: [_mobx.action],
    value: function setConfigValue(keyPath, newValue) {
      if (!newValue) {
        newValue = atom.config.get(keyPath);
      }
      this.configMapping.set(keyPath, newValue);
    }

    /**
     * Force mobx to recalculate filePath (which depends on editor observable)
     */
  }, {
    key: "forceEditorUpdate",
    value: function forceEditorUpdate() {
      var currentEditor = this.editor;
      if (!currentEditor) return;

      var oldKey = this.filePath;
      // Return back if the kernel for this editor is already disposed.
      if (!oldKey || !this.kernelMapping.has(oldKey)) return;

      this.updateEditor(null);
      this.updateEditor(currentEditor);
      var newKey = this.filePath;
      if (!newKey) return;

      // Change key of kernelMapping from editor ID to file path
      this.kernelMapping.set(newKey, this.kernelMapping.get(oldKey));
      this.kernelMapping["delete"](oldKey);
    }
  }, {
    key: "markersMapping",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "runningKernels",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: "kernelMapping",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "startingKernels",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "editor",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return atom.workspace.getActiveTextEditor();
    },
    enumerable: true
  }, {
    key: "grammar",
    decorators: [_mobx.observable],
    initializer: null,
    enumerable: true
  }, {
    key: "configMapping",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "kernel",
    decorators: [_mobx.computed],
    get: function get() {
      var _this4 = this;

      if (!this.grammar || !this.editor) return null;

      if (this.globalMode) {
        var _ret = (function () {
          var currentScopeName = _this4.grammar.scopeName;
          return {
            v: _this4.runningKernels.find(function (k) {
              return k.grammar.scopeName === currentScopeName;
            })
          };
        })();

        if (typeof _ret === "object") return _ret.v;
      }
      var file = this.filePath;
      if (!file) return null;
      var kernelOrMap = this.kernelMapping.get(file);
      if (!kernelOrMap) return null;
      if (kernelOrMap instanceof _kernel2["default"]) return kernelOrMap;
      return this.grammar && this.grammar.name ? kernelOrMap.get(this.grammar.name) : null;
    }
  }, {
    key: "filePath",
    decorators: [_mobx.computed],
    get: function get() {
      var editor = this.editor;
      if (!editor) return null;
      var savedFilePath = editor.getPath();
      return savedFilePath ? savedFilePath : "Unsaved Editor " + editor.id;
    }
  }, {
    key: "filePaths",
    decorators: [_mobx.computed],
    get: function get() {
      return (0, _mobx.keys)(this.kernelMapping);
    }
  }, {
    key: "notebook",
    decorators: [_mobx.computed],
    get: function get() {
      var editor = this.editor;
      if (!editor) return null;
      var notebook = commutable.emptyNotebook;
      if (this.kernel) {
        notebook = notebook.setIn(["metadata", "kernelspec"], this.kernel.transport.kernelSpec);
      }
      var cellRanges = codeManager.getCells(editor);
      _lodash2["default"].forEach(cellRanges, function (cell) {
        var start = cell.start;
        var end = cell.end;

        var source = codeManager.getTextInRange(editor, start, end);
        source = source ? source : "";
        // When the cell marker following a given cell range is on its own line,
        // the newline immediately preceding that cell marker is included in
        // `source`. We remove that here. See #1512 for more details.
        if (source.slice(-1) === "\n") source = source.slice(0, -1);
        var cellType = codeManager.getMetadataForRow(editor, start);
        var newCell = undefined;
        if (cellType === "codecell") {
          newCell = commutable.emptyCodeCell.set("source", source);
        } else if (cellType === "markdown") {
          source = codeManager.removeCommentsMarkdownCell(editor, source);
          newCell = commutable.emptyMarkdownCell.set("source", source);
        }
        notebook = commutable.appendCellToNotebook(notebook, newCell);
      });
      return commutable.toJS(notebook);
    }
  }, {
    key: "markers",
    decorators: [_mobx.computed],
    get: function get() {
      var editor = this.editor;
      if (!editor) return null;
      var markerStore = this.markersMapping.get(editor.id);
      return markerStore ? markerStore : this.newMarkerStore(editor.id);
    }
  }], null, _instanceInitializers);

  return Store;
})();

exports.Store = Store;

var store = new Store();
exports["default"] = store;

// For debugging
window.hydrogen_store = store;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBRTBDLE1BQU07O29CQVF6QyxNQUFNOztxQkFLTixZQUFZOztzQkFDTCxRQUFROzs7O3NCQUVILGFBQWE7Ozs7MkJBQ0gsbUJBQW1COztJQUFwQyxXQUFXOzt1QkFDQyxXQUFXOzs7OzZCQUNULHFCQUFxQjs7OztzQkFDNUIsYUFBYTs7OztBQUVoQyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7SUFFckMsS0FBSzs7O1dBQUwsS0FBSzswQkFBTCxLQUFLOztTQUNoQixhQUFhLEdBQUcsK0JBQXlCOzs7Ozs7Ozs7Ozs7Ozs7O1NBZXpDLFVBQVUsR0FBWSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7O3dCQWhCMUQsS0FBSzs7O1dBNkZGLHdCQUFDLFFBQWdCLEVBQUU7QUFDL0IsVUFBTSxXQUFXLEdBQUcsMEJBQWlCLENBQUM7QUFDdEMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQy9DLGFBQU8sV0FBVyxDQUFDO0tBQ3BCOzs7O1dBR1UscUJBQUMsaUJBQXlCLEVBQUU7QUFDckMsVUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbkQ7OztXQUVjLHlCQUFDLE1BQXVCLEVBQUUsUUFBZ0IsRUFBRTs7O0FBQ3pELFVBQU0sWUFBWSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxVQUFJLDhCQUFrQixRQUFRLENBQUMsRUFBRTtBQUMvQixvQkFBWSxDQUFDLEdBQUcsQ0FDZCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzFCLHNCQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkIsZ0JBQUssZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUMsQ0FBQyxDQUNILENBQUM7QUFDRixvQkFBWSxDQUFDLEdBQUcsQ0FDZCxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDeEIsZ0JBQUssYUFBYSxVQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEMsc0JBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN4QixDQUFDLENBQ0gsQ0FBQztPQUNILE1BQU07QUFDTCxZQUFNLElBQWUsR0FBRyxlQUFTLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLG9CQUFZLENBQUMsR0FBRyxDQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUNyQixnQkFBSyxhQUFhLFVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQyxzQkFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3hCLENBQUMsQ0FDSCxDQUFDO09BQ0g7O0FBRUQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDdEM7Ozs7V0FHUSxtQkFDUCxNQUFjLEVBQ2QsUUFBZ0IsRUFDaEIsTUFBdUIsRUFDdkIsT0FBcUIsRUFDckI7QUFDQSxVQUFJLG1DQUF1QixNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRTtBQUMvQyxZQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDckMsY0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztTQUM3QztBQUNELFlBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUQsWUFBSSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztPQUNsRSxNQUFNO0FBQ0wsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzFDO0FBQ0QsVUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdkMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFDO2VBQUssQ0FBQyxLQUFLLE1BQU07T0FBQSxDQUFDLENBQUM7QUFDakUsVUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDbEM7O0FBRUQsVUFBSSxDQUFDLGVBQWUsVUFBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDN0Q7Ozs7V0FHVyxzQkFBQyxNQUFjLEVBQUU7OztBQUMzQixVQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNwQyxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTdDLFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdEIsWUFBTSxXQUFXLEdBQUcsT0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFlBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTztBQUN6QixZQUFJLFdBQVcsK0JBQWtCLEVBQUU7QUFDakMsaUJBQUssYUFBYSxVQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakMsTUFBTTtBQUNMLHFCQUFXLFVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM3QjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQztlQUFLLENBQUMsS0FBSyxNQUFNO09BQUEsQ0FBQyxDQUFDO0tBQ3ZFOzs7V0FFZ0IsMkJBQUMsTUFBYyxFQUFpQjs7O0FBQy9DLFVBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3BDLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDckMsWUFBTSxXQUFXLEdBQUcsT0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFlBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDL0IsZUFBTyxXQUFXLCtCQUFrQixHQUNoQyxXQUFXLEtBQUssTUFBTSxHQUN0QixXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLE1BQU0sQ0FBQztPQUN6QyxDQUFDLENBQUM7S0FDSjs7OztXQUdNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixVQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFdBQVc7ZUFBSyxXQUFXLENBQUMsS0FBSyxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ2xFLFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDNUIsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO2VBQUssTUFBTSxDQUFDLE9BQU8sRUFBRTtPQUFBLENBQUMsQ0FBQztBQUMxRCxVQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUN6QixVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzVCOzs7O1dBR1csc0JBQUMsTUFBd0IsRUFBRTtBQUNyQyxVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV4QixVQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLEVBQUU7QUFDNUMsWUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLFlBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTztBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQy9DO0tBQ0Y7Ozs7O1dBR2lCLDRCQUFDLE1BQXVCLEVBQWlCO0FBQ3pELFVBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNwQyxVQUFJLENBQUMsbUNBQXVCLE9BQU8sQ0FBQyxFQUFFO0FBQ3BDLGVBQU8sT0FBTyxDQUFDO09BQ2hCOztBQUVELFVBQU0sYUFBYSxHQUFHLDZCQUNwQixNQUFNLEVBQ04sTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQ2pDLENBQUM7O0FBRUYsVUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLE9BQU8sQ0FBQztBQUNuQyxVQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNyRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDakQ7Ozs7V0FHUyxvQkFBQyxNQUF3QixFQUFFO0FBQ25DLFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEQ7Ozs7V0FHYSx3QkFBQyxPQUFlLEVBQUUsUUFBZ0IsRUFBRTtBQUNoRCxVQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsZ0JBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNyQztBQUNELFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMzQzs7Ozs7OztXQUtnQiw2QkFBRztBQUNsQixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTzs7QUFFM0IsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFN0IsVUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU87O0FBRXZELFVBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNqQyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTzs7O0FBR3BCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFVBQUksQ0FBQyxhQUFhLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNuQzs7Ozs7YUFwUTBDLElBQUksR0FBRyxFQUFFOzs7Ozs7O2FBRXBCLEVBQUU7Ozs7Ozs7YUFFSCxJQUFJLEdBQUcsRUFBRTs7Ozs7OzthQUVBLElBQUksR0FBRyxFQUFFOzs7Ozs7O2FBRXhDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUU7Ozs7Ozs7Ozs7OzthQUlSLElBQUksR0FBRyxFQUFFOzs7Ozs7U0FJcEMsZUFBWTs7O0FBQ3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQzs7QUFFL0MsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFOztBQUNuQixjQUFNLGdCQUFnQixHQUFHLE9BQUssT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNoRDtlQUFPLE9BQUssY0FBYyxDQUFDLElBQUksQ0FDN0IsVUFBQyxDQUFDO3FCQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLGdCQUFnQjthQUFBLENBQ2hEO1lBQUM7Ozs7T0FDSDtBQUNELFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDM0IsVUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLElBQUksQ0FBQztBQUN2QixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQzlCLFVBQUksV0FBVywrQkFBa0IsRUFBRSxPQUFPLFdBQVcsQ0FBQztBQUN0RCxhQUFPLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQ3BDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FDbEMsSUFBSSxDQUFDO0tBQ1Y7Ozs7U0FHVyxlQUFZO0FBQ3RCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsVUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQztBQUN6QixVQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkMsYUFBTyxhQUFhLEdBQUcsYUFBYSx1QkFBcUIsTUFBTSxDQUFDLEVBQUUsQUFBRSxDQUFDO0tBQ3RFOzs7O1NBR1ksZUFBa0I7QUFDN0IsYUFBTyxnQkFBSyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDakM7Ozs7U0FHVyxlQUFHO0FBQ2IsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixVQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ3pCLFVBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7QUFDeEMsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsZ0JBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUN2QixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsRUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUNqQyxDQUFDO09BQ0g7QUFDRCxVQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELDBCQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBQyxJQUFJLEVBQUs7WUFDdEIsS0FBSyxHQUFVLElBQUksQ0FBbkIsS0FBSztZQUFFLEdBQUcsR0FBSyxJQUFJLENBQVosR0FBRzs7QUFDbEIsWUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVELGNBQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7OztBQUk5QixZQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUQsWUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5RCxZQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osWUFBSSxRQUFRLEtBQUssVUFBVSxFQUFFO0FBQzNCLGlCQUFPLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzFELE1BQU0sSUFBSSxRQUFRLEtBQUssVUFBVSxFQUFFO0FBQ2xDLGdCQUFNLEdBQUcsV0FBVyxDQUFDLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoRSxpQkFBTyxHQUFHLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzlEO0FBQ0QsZ0JBQVEsR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQy9ELENBQUMsQ0FBQztBQUNILGFBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNsQzs7OztTQUdVLGVBQWlCO0FBQzFCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsVUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQztBQUN6QixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkQsYUFBTyxXQUFXLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ25FOzs7U0ExRlUsS0FBSzs7Ozs7QUEwUWxCLElBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQ1gsS0FBSzs7O0FBR3BCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBGaWxlIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCB7XG4gIG9ic2VydmFibGUsXG4gIGNvbXB1dGVkLFxuICBhY3Rpb24sXG4gIGlzT2JzZXJ2YWJsZU1hcCxcbiAga2V5cyxcbiAgdmFsdWVzLFxufSBmcm9tIFwibW9ieFwiO1xuaW1wb3J0IHtcbiAgaXNNdWx0aWxhbmd1YWdlR3JhbW1hcixcbiAgZ2V0RW1iZWRkZWRTY29wZSxcbiAgaXNVbnNhdmVkRmlsZVBhdGgsXG59IGZyb20gXCIuLy4uL3V0aWxzXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5cbmltcG9ydCBDb25maWcgZnJvbSBcIi4vLi4vY29uZmlnXCI7XG5pbXBvcnQgKiBhcyBjb2RlTWFuYWdlciBmcm9tIFwiLi8uLi9jb2RlLW1hbmFnZXJcIjtcbmltcG9ydCBNYXJrZXJTdG9yZSBmcm9tIFwiLi9tYXJrZXJzXCI7XG5pbXBvcnQga2VybmVsTWFuYWdlciBmcm9tIFwiLi8uLi9rZXJuZWwtbWFuYWdlclwiO1xuaW1wb3J0IEtlcm5lbCBmcm9tIFwiLi8uLi9rZXJuZWxcIjtcblxuY29uc3QgY29tbXV0YWJsZSA9IHJlcXVpcmUoXCJAbnRlcmFjdC9jb21tdXRhYmxlXCIpO1xuXG5leHBvcnQgY2xhc3MgU3RvcmUge1xuICBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgQG9ic2VydmFibGVcbiAgbWFya2Vyc01hcHBpbmc6IE1hcDxudW1iZXIsIE1hcmtlclN0b3JlPiA9IG5ldyBNYXAoKTtcbiAgQG9ic2VydmFibGVcbiAgcnVubmluZ0tlcm5lbHM6IEFycmF5PEtlcm5lbD4gPSBbXTtcbiAgQG9ic2VydmFibGVcbiAga2VybmVsTWFwcGluZzogS2VybmVsTWFwcGluZyA9IG5ldyBNYXAoKTtcbiAgQG9ic2VydmFibGVcbiAgc3RhcnRpbmdLZXJuZWxzOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXAoKTtcbiAgQG9ic2VydmFibGVcbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICBAb2JzZXJ2YWJsZVxuICBncmFtbWFyOiA/YXRvbSRHcmFtbWFyO1xuICBAb2JzZXJ2YWJsZVxuICBjb25maWdNYXBwaW5nOiBNYXA8c3RyaW5nLCA/bWl4ZWQ+ID0gbmV3IE1hcCgpO1xuICBnbG9iYWxNb2RlOiBib29sZWFuID0gQm9vbGVhbihhdG9tLmNvbmZpZy5nZXQoXCJIeWRyb2dlbi5nbG9iYWxNb2RlXCIpKTtcblxuICBAY29tcHV0ZWRcbiAgZ2V0IGtlcm5lbCgpOiA/S2VybmVsIHtcbiAgICBpZiAoIXRoaXMuZ3JhbW1hciB8fCAhdGhpcy5lZGl0b3IpIHJldHVybiBudWxsO1xuXG4gICAgaWYgKHRoaXMuZ2xvYmFsTW9kZSkge1xuICAgICAgY29uc3QgY3VycmVudFNjb3BlTmFtZSA9IHRoaXMuZ3JhbW1hci5zY29wZU5hbWU7XG4gICAgICByZXR1cm4gdGhpcy5ydW5uaW5nS2VybmVscy5maW5kKFxuICAgICAgICAoaykgPT4gay5ncmFtbWFyLnNjb3BlTmFtZSA9PT0gY3VycmVudFNjb3BlTmFtZVxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZVBhdGg7XG4gICAgaWYgKCFmaWxlKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBrZXJuZWxPck1hcCA9IHRoaXMua2VybmVsTWFwcGluZy5nZXQoZmlsZSk7XG4gICAgaWYgKCFrZXJuZWxPck1hcCkgcmV0dXJuIG51bGw7XG4gICAgaWYgKGtlcm5lbE9yTWFwIGluc3RhbmNlb2YgS2VybmVsKSByZXR1cm4ga2VybmVsT3JNYXA7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbW1hciAmJiB0aGlzLmdyYW1tYXIubmFtZVxuICAgICAgPyBrZXJuZWxPck1hcC5nZXQodGhpcy5ncmFtbWFyLm5hbWUpXG4gICAgICA6IG51bGw7XG4gIH1cblxuICBAY29tcHV0ZWRcbiAgZ2V0IGZpbGVQYXRoKCk6ID9zdHJpbmcge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBzYXZlZEZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICByZXR1cm4gc2F2ZWRGaWxlUGF0aCA/IHNhdmVkRmlsZVBhdGggOiBgVW5zYXZlZCBFZGl0b3IgJHtlZGl0b3IuaWR9YDtcbiAgfVxuXG4gIEBjb21wdXRlZFxuICBnZXQgZmlsZVBhdGhzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiBrZXlzKHRoaXMua2VybmVsTWFwcGluZyk7XG4gIH1cblxuICBAY29tcHV0ZWRcbiAgZ2V0IG5vdGVib29rKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm4gbnVsbDtcbiAgICBsZXQgbm90ZWJvb2sgPSBjb21tdXRhYmxlLmVtcHR5Tm90ZWJvb2s7XG4gICAgaWYgKHRoaXMua2VybmVsKSB7XG4gICAgICBub3RlYm9vayA9IG5vdGVib29rLnNldEluKFxuICAgICAgICBbXCJtZXRhZGF0YVwiLCBcImtlcm5lbHNwZWNcIl0sXG4gICAgICAgIHRoaXMua2VybmVsLnRyYW5zcG9ydC5rZXJuZWxTcGVjXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBjZWxsUmFuZ2VzID0gY29kZU1hbmFnZXIuZ2V0Q2VsbHMoZWRpdG9yKTtcbiAgICBfLmZvckVhY2goY2VsbFJhbmdlcywgKGNlbGwpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gY2VsbDtcbiAgICAgIGxldCBzb3VyY2UgPSBjb2RlTWFuYWdlci5nZXRUZXh0SW5SYW5nZShlZGl0b3IsIHN0YXJ0LCBlbmQpO1xuICAgICAgc291cmNlID0gc291cmNlID8gc291cmNlIDogXCJcIjtcbiAgICAgIC8vIFdoZW4gdGhlIGNlbGwgbWFya2VyIGZvbGxvd2luZyBhIGdpdmVuIGNlbGwgcmFuZ2UgaXMgb24gaXRzIG93biBsaW5lLFxuICAgICAgLy8gdGhlIG5ld2xpbmUgaW1tZWRpYXRlbHkgcHJlY2VkaW5nIHRoYXQgY2VsbCBtYXJrZXIgaXMgaW5jbHVkZWQgaW5cbiAgICAgIC8vIGBzb3VyY2VgLiBXZSByZW1vdmUgdGhhdCBoZXJlLiBTZWUgIzE1MTIgZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIGlmIChzb3VyY2Uuc2xpY2UoLTEpID09PSBcIlxcblwiKSBzb3VyY2UgPSBzb3VyY2Uuc2xpY2UoMCwgLTEpO1xuICAgICAgY29uc3QgY2VsbFR5cGUgPSBjb2RlTWFuYWdlci5nZXRNZXRhZGF0YUZvclJvdyhlZGl0b3IsIHN0YXJ0KTtcbiAgICAgIGxldCBuZXdDZWxsO1xuICAgICAgaWYgKGNlbGxUeXBlID09PSBcImNvZGVjZWxsXCIpIHtcbiAgICAgICAgbmV3Q2VsbCA9IGNvbW11dGFibGUuZW1wdHlDb2RlQ2VsbC5zZXQoXCJzb3VyY2VcIiwgc291cmNlKTtcbiAgICAgIH0gZWxzZSBpZiAoY2VsbFR5cGUgPT09IFwibWFya2Rvd25cIikge1xuICAgICAgICBzb3VyY2UgPSBjb2RlTWFuYWdlci5yZW1vdmVDb21tZW50c01hcmtkb3duQ2VsbChlZGl0b3IsIHNvdXJjZSk7XG4gICAgICAgIG5ld0NlbGwgPSBjb21tdXRhYmxlLmVtcHR5TWFya2Rvd25DZWxsLnNldChcInNvdXJjZVwiLCBzb3VyY2UpO1xuICAgICAgfVxuICAgICAgbm90ZWJvb2sgPSBjb21tdXRhYmxlLmFwcGVuZENlbGxUb05vdGVib29rKG5vdGVib29rLCBuZXdDZWxsKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29tbXV0YWJsZS50b0pTKG5vdGVib29rKTtcbiAgfVxuXG4gIEBjb21wdXRlZFxuICBnZXQgbWFya2VycygpOiA/TWFya2VyU3RvcmUge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBtYXJrZXJTdG9yZSA9IHRoaXMubWFya2Vyc01hcHBpbmcuZ2V0KGVkaXRvci5pZCk7XG4gICAgcmV0dXJuIG1hcmtlclN0b3JlID8gbWFya2VyU3RvcmUgOiB0aGlzLm5ld01hcmtlclN0b3JlKGVkaXRvci5pZCk7XG4gIH1cblxuICBAYWN0aW9uXG4gIG5ld01hcmtlclN0b3JlKGVkaXRvcklkOiBudW1iZXIpIHtcbiAgICBjb25zdCBtYXJrZXJTdG9yZSA9IG5ldyBNYXJrZXJTdG9yZSgpO1xuICAgIHRoaXMubWFya2Vyc01hcHBpbmcuc2V0KGVkaXRvcklkLCBtYXJrZXJTdG9yZSk7XG4gICAgcmV0dXJuIG1hcmtlclN0b3JlO1xuICB9XG5cbiAgQGFjdGlvblxuICBzdGFydEtlcm5lbChrZXJuZWxEaXNwbGF5TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdGFydGluZ0tlcm5lbHMuc2V0KGtlcm5lbERpc3BsYXlOYW1lLCB0cnVlKTtcbiAgfVxuXG4gIGFkZEZpbGVEaXNwb3NlcihlZGl0b3I6IGF0b20kVGV4dEVkaXRvciwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGZpbGVEaXNwb3NlciA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICBpZiAoaXNVbnNhdmVkRmlsZVBhdGgoZmlsZVBhdGgpKSB7XG4gICAgICBmaWxlRGlzcG9zZXIuYWRkKFxuICAgICAgICBlZGl0b3Iub25EaWRTYXZlKChldmVudCkgPT4ge1xuICAgICAgICAgIGZpbGVEaXNwb3Nlci5kaXNwb3NlKCk7XG4gICAgICAgICAgdGhpcy5hZGRGaWxlRGlzcG9zZXIoZWRpdG9yLCBldmVudC5wYXRoKTsgLy8gQWRkIGFub3RoZXIgYGZpbGVEaXNwb3NlcmAgb25jZSBpdCdzIHNhdmVkXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgZmlsZURpc3Bvc2VyLmFkZChcbiAgICAgICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5rZXJuZWxNYXBwaW5nLmRlbGV0ZShmaWxlUGF0aCk7XG4gICAgICAgICAgZmlsZURpc3Bvc2VyLmRpc3Bvc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGZpbGU6IGF0b20kRmlsZSA9IG5ldyBGaWxlKGZpbGVQYXRoKTtcbiAgICAgIGZpbGVEaXNwb3Nlci5hZGQoXG4gICAgICAgIGZpbGUub25EaWREZWxldGUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMua2VybmVsTWFwcGluZy5kZWxldGUoZmlsZVBhdGgpO1xuICAgICAgICAgIGZpbGVEaXNwb3Nlci5kaXNwb3NlKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZmlsZURpc3Bvc2VyKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgbmV3S2VybmVsKFxuICAgIGtlcm5lbDogS2VybmVsLFxuICAgIGZpbGVQYXRoOiBzdHJpbmcsXG4gICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAgZ3JhbW1hcjogYXRvbSRHcmFtbWFyXG4gICkge1xuICAgIGlmIChpc011bHRpbGFuZ3VhZ2VHcmFtbWFyKGVkaXRvci5nZXRHcmFtbWFyKCkpKSB7XG4gICAgICBpZiAoIXRoaXMua2VybmVsTWFwcGluZy5oYXMoZmlsZVBhdGgpKSB7XG4gICAgICAgIHRoaXMua2VybmVsTWFwcGluZy5zZXQoZmlsZVBhdGgsIG5ldyBNYXAoKSk7XG4gICAgICB9XG4gICAgICBjb25zdCBtdWx0aUxhbmd1YWdlTWFwID0gdGhpcy5rZXJuZWxNYXBwaW5nLmdldChmaWxlUGF0aCk7XG4gICAgICBpZiAobXVsdGlMYW5ndWFnZU1hcCkgbXVsdGlMYW5ndWFnZU1hcC5zZXQoZ3JhbW1hci5uYW1lLCBrZXJuZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmtlcm5lbE1hcHBpbmcuc2V0KGZpbGVQYXRoLCBrZXJuZWwpO1xuICAgIH1cbiAgICB0aGlzLmFkZEZpbGVEaXNwb3NlcihlZGl0b3IsIGZpbGVQYXRoKTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucnVubmluZ0tlcm5lbHMuZmluZEluZGV4KChrKSA9PiBrID09PSBrZXJuZWwpO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRoaXMucnVubmluZ0tlcm5lbHMucHVzaChrZXJuZWwpO1xuICAgIH1cbiAgICAvLyBkZWxldGUgc3RhcnRpbmdLZXJuZWwgc2luY2Ugc3RvcmUua2VybmVsIG5vdyBpbiBwbGFjZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBrZXJuZWxcbiAgICB0aGlzLnN0YXJ0aW5nS2VybmVscy5kZWxldGUoa2VybmVsLmtlcm5lbFNwZWMuZGlzcGxheV9uYW1lKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgZGVsZXRlS2VybmVsKGtlcm5lbDogS2VybmVsKSB7XG4gICAgY29uc3QgZ3JhbW1hciA9IGtlcm5lbC5ncmFtbWFyLm5hbWU7XG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldEZpbGVzRm9yS2VybmVsKGtlcm5lbCk7XG5cbiAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCBrZXJuZWxPck1hcCA9IHRoaXMua2VybmVsTWFwcGluZy5nZXQoZmlsZSk7XG4gICAgICBpZiAoIWtlcm5lbE9yTWFwKSByZXR1cm47XG4gICAgICBpZiAoa2VybmVsT3JNYXAgaW5zdGFuY2VvZiBLZXJuZWwpIHtcbiAgICAgICAgdGhpcy5rZXJuZWxNYXBwaW5nLmRlbGV0ZShmaWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGtlcm5lbE9yTWFwLmRlbGV0ZShncmFtbWFyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucnVubmluZ0tlcm5lbHMgPSB0aGlzLnJ1bm5pbmdLZXJuZWxzLmZpbHRlcigoaykgPT4gayAhPT0ga2VybmVsKTtcbiAgfVxuXG4gIGdldEZpbGVzRm9yS2VybmVsKGtlcm5lbDogS2VybmVsKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgZ3JhbW1hciA9IGtlcm5lbC5ncmFtbWFyLm5hbWU7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGhzLmZpbHRlcigoZmlsZSkgPT4ge1xuICAgICAgY29uc3Qga2VybmVsT3JNYXAgPSB0aGlzLmtlcm5lbE1hcHBpbmcuZ2V0KGZpbGUpO1xuICAgICAgaWYgKCFrZXJuZWxPck1hcCkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIGtlcm5lbE9yTWFwIGluc3RhbmNlb2YgS2VybmVsXG4gICAgICAgID8ga2VybmVsT3JNYXAgPT09IGtlcm5lbFxuICAgICAgICA6IGtlcm5lbE9yTWFwLmdldChncmFtbWFyKSA9PT0ga2VybmVsO1xuICAgIH0pO1xuICB9XG5cbiAgQGFjdGlvblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5tYXJrZXJzTWFwcGluZy5mb3JFYWNoKChtYXJrZXJTdG9yZSkgPT4gbWFya2VyU3RvcmUuY2xlYXIoKSk7XG4gICAgdGhpcy5tYXJrZXJzTWFwcGluZy5jbGVhcigpO1xuICAgIHRoaXMucnVubmluZ0tlcm5lbHMuZm9yRWFjaCgoa2VybmVsKSA9PiBrZXJuZWwuZGVzdHJveSgpKTtcbiAgICB0aGlzLnJ1bm5pbmdLZXJuZWxzID0gW107XG4gICAgdGhpcy5rZXJuZWxNYXBwaW5nLmNsZWFyKCk7XG4gIH1cblxuICBAYWN0aW9uXG4gIHVwZGF0ZUVkaXRvcihlZGl0b3I6ID9hdG9tJFRleHRFZGl0b3IpIHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICB0aGlzLnNldEdyYW1tYXIoZWRpdG9yKTtcblxuICAgIGlmICh0aGlzLmdsb2JhbE1vZGUgJiYgdGhpcy5rZXJuZWwgJiYgZWRpdG9yKSB7XG4gICAgICBjb25zdCBmaWxlTmFtZSA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBpZiAoIWZpbGVOYW1lKSByZXR1cm47XG4gICAgICB0aGlzLmtlcm5lbE1hcHBpbmcuc2V0KGZpbGVOYW1lLCB0aGlzLmtlcm5lbCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZW1iZWRkZWQgZ3JhbW1hciBmb3IgbXVsdGlsYW5ndWFnZSwgbm9ybWFsIGdyYW1tYXIgb3RoZXJ3aXNlXG4gIGdldEVtYmVkZGVkR3JhbW1hcihlZGl0b3I6IGF0b20kVGV4dEVkaXRvcik6ID9hdG9tJEdyYW1tYXIge1xuICAgIGNvbnN0IGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpO1xuICAgIGlmICghaXNNdWx0aWxhbmd1YWdlR3JhbW1hcihncmFtbWFyKSkge1xuICAgICAgcmV0dXJuIGdyYW1tYXI7XG4gICAgfVxuXG4gICAgY29uc3QgZW1iZWRkZWRTY29wZSA9IGdldEVtYmVkZGVkU2NvcGUoXG4gICAgICBlZGl0b3IsXG4gICAgICBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgICk7XG5cbiAgICBpZiAoIWVtYmVkZGVkU2NvcGUpIHJldHVybiBncmFtbWFyO1xuICAgIGNvbnN0IHNjb3BlID0gZW1iZWRkZWRTY29wZS5yZXBsYWNlKFwiLmVtYmVkZGVkXCIsIFwiXCIpO1xuICAgIHJldHVybiBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoc2NvcGUpO1xuICB9XG5cbiAgQGFjdGlvblxuICBzZXRHcmFtbWFyKGVkaXRvcjogP2F0b20kVGV4dEVkaXRvcikge1xuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICB0aGlzLmdyYW1tYXIgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZ3JhbW1hciA9IHRoaXMuZ2V0RW1iZWRkZWRHcmFtbWFyKGVkaXRvcik7XG4gIH1cblxuICBAYWN0aW9uXG4gIHNldENvbmZpZ1ZhbHVlKGtleVBhdGg6IHN0cmluZywgbmV3VmFsdWU6ID9taXhlZCkge1xuICAgIGlmICghbmV3VmFsdWUpIHtcbiAgICAgIG5ld1ZhbHVlID0gYXRvbS5jb25maWcuZ2V0KGtleVBhdGgpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ01hcHBpbmcuc2V0KGtleVBhdGgsIG5ld1ZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JjZSBtb2J4IHRvIHJlY2FsY3VsYXRlIGZpbGVQYXRoICh3aGljaCBkZXBlbmRzIG9uIGVkaXRvciBvYnNlcnZhYmxlKVxuICAgKi9cbiAgZm9yY2VFZGl0b3JVcGRhdGUoKSB7XG4gICAgY29uc3QgY3VycmVudEVkaXRvciA9IHRoaXMuZWRpdG9yO1xuICAgIGlmICghY3VycmVudEVkaXRvcikgcmV0dXJuO1xuXG4gICAgY29uc3Qgb2xkS2V5ID0gdGhpcy5maWxlUGF0aDtcbiAgICAvLyBSZXR1cm4gYmFjayBpZiB0aGUga2VybmVsIGZvciB0aGlzIGVkaXRvciBpcyBhbHJlYWR5IGRpc3Bvc2VkLlxuICAgIGlmICghb2xkS2V5IHx8ICF0aGlzLmtlcm5lbE1hcHBpbmcuaGFzKG9sZEtleSkpIHJldHVybjtcblxuICAgIHRoaXMudXBkYXRlRWRpdG9yKG51bGwpO1xuICAgIHRoaXMudXBkYXRlRWRpdG9yKGN1cnJlbnRFZGl0b3IpO1xuICAgIGNvbnN0IG5ld0tleSA9IHRoaXMuZmlsZVBhdGg7XG4gICAgaWYgKCFuZXdLZXkpIHJldHVybjtcblxuICAgIC8vIENoYW5nZSBrZXkgb2Yga2VybmVsTWFwcGluZyBmcm9tIGVkaXRvciBJRCB0byBmaWxlIHBhdGhcbiAgICB0aGlzLmtlcm5lbE1hcHBpbmcuc2V0KG5ld0tleSwgdGhpcy5rZXJuZWxNYXBwaW5nLmdldChvbGRLZXkpKTtcbiAgICB0aGlzLmtlcm5lbE1hcHBpbmcuZGVsZXRlKG9sZEtleSk7XG4gIH1cbn1cblxuY29uc3Qgc3RvcmUgPSBuZXcgU3RvcmUoKTtcbmV4cG9ydCBkZWZhdWx0IHN0b3JlO1xuXG4vLyBGb3IgZGVidWdnaW5nXG53aW5kb3cuaHlkcm9nZW5fc3RvcmUgPSBzdG9yZTtcbiJdfQ==