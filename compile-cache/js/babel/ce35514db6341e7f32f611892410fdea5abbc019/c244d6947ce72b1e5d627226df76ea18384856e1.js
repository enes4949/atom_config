Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _kernelspecs = require("kernelspecs");

var kernelspecs = _interopRequireWildcard(_kernelspecs);

var _electron = require("electron");

var _zmqKernel = require("./zmq-kernel");

var _zmqKernel2 = _interopRequireDefault(_zmqKernel);

var _kernel = require("./kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var _kernelPicker = require("./kernel-picker");

var _kernelPicker2 = _interopRequireDefault(_kernelPicker);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _utils = require("./utils");

var ks = kernelspecs;

exports.ks = ks;

var KernelManager = (function () {
  function KernelManager() {
    _classCallCheck(this, KernelManager);

    this.kernelSpecs = null;
  }

  _createClass(KernelManager, [{
    key: "startKernelFor",
    value: function startKernelFor(grammar, editor, filePath, onStarted) {
      var _this = this;

      this.getKernelSpecForGrammar(grammar).then(function (kernelSpec) {
        if (!kernelSpec) {
          var message = "No kernel for grammar `" + grammar.name + "` found";
          var pythonDescription = grammar && /python/g.test(grammar.scopeName) ? "\n\nTo detect your current Python install you will need to run:<pre>python -m pip install ipykernel\npython -m ipykernel install --user</pre>" : "";
          var description = "Check that the language for this file is set in Atom, that you have a Jupyter kernel installed for it, and that you have configured the language mapping in Hydrogen preferences." + pythonDescription;
          atom.notifications.addError(message, {
            description: description,
            dismissable: pythonDescription !== ""
          });
          return;
        }

        _this.startKernel(kernelSpec, grammar, editor, filePath, onStarted);
      });
    }
  }, {
    key: "startKernel",
    value: function startKernel(kernelSpec, grammar, editor, filePath, onStarted) {
      var displayName = kernelSpec.display_name;

      // if kernel startup already in progress don't start additional kernel
      if (_store2["default"].startingKernels.get(displayName)) return;

      _store2["default"].startKernel(displayName);

      var currentPath = (0, _utils.getEditorDirectory)(editor);
      var projectPath = undefined;

      (0, _utils.log)("KernelManager: startKernel:", displayName);

      switch (atom.config.get("Hydrogen.startDir")) {
        case "firstProjectDir":
          projectPath = atom.project.getPaths()[0];
          break;
        case "projectDirOfFile":
          projectPath = atom.project.relativizePath(currentPath)[0];
          break;
      }

      var kernelStartDir = projectPath != null ? projectPath : currentPath;
      var options = {
        cwd: kernelStartDir,
        stdio: ["ignore", "pipe", "pipe"]
      };

      var transport = new _zmqKernel2["default"](kernelSpec, grammar, options, function () {
        var kernel = new _kernel2["default"](transport);
        _store2["default"].newKernel(kernel, filePath, editor, grammar);
        if (onStarted) onStarted(kernel);
      });
    }
  }, {
    key: "update",
    value: _asyncToGenerator(function* () {
      var kernelSpecs = yield ks.findAll();
      this.kernelSpecs = _lodash2["default"].sortBy(_lodash2["default"].map(_lodash2["default"].mapKeys(kernelSpecs, function (value, key) {
        return value.spec.name = key;
      }), "spec"), function (spec) {
        return spec.display_name;
      });
      return this.kernelSpecs;
    })
  }, {
    key: "getAllKernelSpecs",
    value: _asyncToGenerator(function* (grammar) {
      if (this.kernelSpecs) return this.kernelSpecs;
      return this.updateKernelSpecs(grammar);
    })
  }, {
    key: "getAllKernelSpecsForGrammar",
    value: _asyncToGenerator(function* (grammar) {
      if (!grammar) return [];

      var kernelSpecs = yield this.getAllKernelSpecs(grammar);
      return kernelSpecs.filter(function (spec) {
        return (0, _utils.kernelSpecProvidesGrammar)(spec, grammar);
      });
    })
  }, {
    key: "getKernelSpecForGrammar",
    value: _asyncToGenerator(function* (grammar) {
      var _this2 = this;

      var kernelSpecs = yield this.getAllKernelSpecsForGrammar(grammar);
      if (kernelSpecs.length <= 1) {
        return kernelSpecs[0];
      }

      if (this.kernelPicker) {
        this.kernelPicker.kernelSpecs = kernelSpecs;
      } else {
        this.kernelPicker = new _kernelPicker2["default"](kernelSpecs);
      }

      return new Promise(function (resolve) {
        if (!_this2.kernelPicker) return resolve(null);
        _this2.kernelPicker.onConfirmed = function (kernelSpec) {
          return resolve(kernelSpec);
        };
        _this2.kernelPicker.toggle();
      });
    })
  }, {
    key: "updateKernelSpecs",
    value: _asyncToGenerator(function* (grammar) {
      var kernelSpecs = yield this.update();

      if (kernelSpecs.length === 0) {
        var message = "No Kernels Installed";

        var options = {
          description: "No kernels are installed on your system so you will not be able to execute code in any language.",
          dismissable: true,
          buttons: [{
            text: "Install Instructions",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://nteract.gitbooks.io/hydrogen/docs/Installation.html");
            }
          }, {
            text: "Popular Kernels",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://nteract.io/kernels");
            }
          }, {
            text: "All Kernels",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://github.com/jupyter/jupyter/wiki/Jupyter-kernels");
            }
          }]
        };
        atom.notifications.addError(message, options);
      } else {
        var message = "Hydrogen Kernels updated:";
        var options = {
          detail: _lodash2["default"].map(kernelSpecs, "display_name").join("\n")
        };
        atom.notifications.addInfo(message, options);
      }
      return kernelSpecs;
    })
  }]);

  return KernelManager;
})();

exports.KernelManager = KernelManager;
exports["default"] = new KernelManager();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIva2VybmVsLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRWMsUUFBUTs7OzsyQkFDTyxhQUFhOztJQUE5QixXQUFXOzt3QkFDRCxVQUFVOzt5QkFFVixjQUFjOzs7O3NCQUNqQixVQUFVOzs7OzRCQUVKLGlCQUFpQjs7OztxQkFDeEIsU0FBUzs7OztxQkFDd0MsU0FBUzs7QUFJckUsSUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDOzs7O0lBRWpCLGFBQWE7V0FBYixhQUFhOzBCQUFiLGFBQWE7O1NBQ3hCLFdBQVcsR0FBdUIsSUFBSTs7O2VBRDNCLGFBQWE7O1dBSVYsd0JBQ1osT0FBcUIsRUFDckIsTUFBdUIsRUFDdkIsUUFBZ0IsRUFDaEIsU0FBbUMsRUFDbkM7OztBQUNBLFVBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxVQUFVLEVBQUs7QUFDekQsWUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNmLGNBQU0sT0FBTywrQkFBOEIsT0FBTyxDQUFDLElBQUksWUFBVSxDQUFDO0FBQ2xFLGNBQU0saUJBQWlCLEdBQ3JCLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FDeEMsK0lBQStJLEdBQy9JLEVBQUUsQ0FBQztBQUNULGNBQU0sV0FBVyx5TEFBdUwsaUJBQWlCLEFBQUUsQ0FBQztBQUM1TixjQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7QUFDbkMsdUJBQVcsRUFBWCxXQUFXO0FBQ1gsdUJBQVcsRUFBRSxpQkFBaUIsS0FBSyxFQUFFO1dBQ3RDLENBQUMsQ0FBQztBQUNILGlCQUFPO1NBQ1I7O0FBRUQsY0FBSyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFD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QUUsYUFBYTtBQUNuQixzQkFBVSxFQUFFO3FCQUNWLGdCQUFNLFlBQVksQ0FDaEIseURBQXlELENBQzFEO2FBQUE7V0FDSixDQUNGO1NBQ0YsQ0FBQztBQUNGLFlBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUMvQyxNQUFNO0FBQ0wsWUFBTSxPQUFPLEdBQUcsMkJBQTJCLENBQUM7QUFDNUMsWUFBTSxPQUFPLEdBQUc7QUFDZCxnQkFBTSxFQUFFLG9CQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN0RCxDQUFDO0FBQ0YsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQzlDO0FBQ0QsYUFBTyxXQUFXLENBQUM7S0FDcEI7OztTQS9KVSxhQUFhOzs7O3FCQWtLWCxJQUFJLGFBQWEsRUFBRSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0ICogYXMga2VybmVsc3BlY3MgZnJvbSBcImtlcm5lbHNwZWNzXCI7XG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gXCJlbGVjdHJvblwiO1xuXG5pbXBvcnQgWk1RS2VybmVsIGZyb20gXCIuL3ptcS1rZXJuZWxcIjtcbmltcG9ydCBLZXJuZWwgZnJvbSBcIi4va2VybmVsXCI7XG5cbmltcG9ydCBLZXJuZWxQaWNrZXIgZnJvbSBcIi4va2VybmVsLXBpY2tlclwiO1xuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5pbXBvcnQgeyBnZXRFZGl0b3JEaXJlY3RvcnksIGtlcm5lbFNwZWNQcm92aWRlc0dyYW1tYXIsIGxvZyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmltcG9ydCB0eXBlIHsgQ29ubmVjdGlvbiB9IGZyb20gXCIuL3ptcS1rZXJuZWxcIjtcblxuZXhwb3J0IGNvbnN0IGtzID0ga2VybmVsc3BlY3M7XG5cbmV4cG9ydCBjbGFzcyBLZXJuZWxNYW5hZ2VyIHtcbiAga2VybmVsU3BlY3M6ID9BcnJheTxLZXJuZWxzcGVjPiA9IG51bGw7XG4gIGtlcm5lbFBpY2tlcjogP0tlcm5lbFBpY2tlcjtcblxuICBzdGFydEtlcm5lbEZvcihcbiAgICBncmFtbWFyOiBhdG9tJEdyYW1tYXIsXG4gICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAgZmlsZVBhdGg6IHN0cmluZyxcbiAgICBvblN0YXJ0ZWQ6IChrZXJuZWw6IEtlcm5lbCkgPT4gdm9pZFxuICApIHtcbiAgICB0aGlzLmdldEtlcm5lbFNwZWNGb3JHcmFtbWFyKGdyYW1tYXIpLnRoZW4oKGtlcm5lbFNwZWMpID0+IHtcbiAgICAgIGlmICgha2VybmVsU3BlYykge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gYE5vIGtlcm5lbCBmb3IgZ3JhbW1hciBcXGAke2dyYW1tYXIubmFtZX1cXGAgZm91bmRgO1xuICAgICAgICBjb25zdCBweXRob25EZXNjcmlwdGlvbiA9XG4gICAgICAgICAgZ3JhbW1hciAmJiAvcHl0aG9uL2cudGVzdChncmFtbWFyLnNjb3BlTmFtZSlcbiAgICAgICAgICAgID8gXCJcXG5cXG5UbyBkZXRlY3QgeW91ciBjdXJyZW50IFB5dGhvbiBpbnN0YWxsIHlvdSB3aWxsIG5lZWQgdG8gcnVuOjxwcmU+cHl0aG9uIC1tIHBpcCBpbnN0YWxsIGlweWtlcm5lbFxcbnB5dGhvbiAtbSBpcHlrZXJuZWwgaW5zdGFsbCAtLXVzZXI8L3ByZT5cIlxuICAgICAgICAgICAgOiBcIlwiO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGBDaGVjayB0aGF0IHRoZSBsYW5ndWFnZSBmb3IgdGhpcyBmaWxlIGlzIHNldCBpbiBBdG9tLCB0aGF0IHlvdSBoYXZlIGEgSnVweXRlciBrZXJuZWwgaW5zdGFsbGVkIGZvciBpdCwgYW5kIHRoYXQgeW91IGhhdmUgY29uZmlndXJlZCB0aGUgbGFuZ3VhZ2UgbWFwcGluZyBpbiBIeWRyb2dlbiBwcmVmZXJlbmNlcy4ke3B5dGhvbkRlc2NyaXB0aW9ufWA7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlLCB7XG4gICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHB5dGhvbkRlc2NyaXB0aW9uICE9PSBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXJ0S2VybmVsKGtlcm5lbFNwZWMsIGdyYW1tYXIsIGVkaXRvciwgZmlsZVBhdGgsIG9uU3RhcnRlZCk7XG4gICAgfSk7XG4gIH1cblxuICBzdGFydEtlcm5lbChcbiAgICBrZXJuZWxTcGVjOiBLZXJuZWxzcGVjLFxuICAgIGdyYW1tYXI6IGF0b20kR3JhbW1hcixcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBmaWxlUGF0aDogc3RyaW5nLFxuICAgIG9uU3RhcnRlZDogPyhrZXJuZWw6IEtlcm5lbCkgPT4gdm9pZFxuICApIHtcbiAgICBjb25zdCBkaXNwbGF5TmFtZSA9IGtlcm5lbFNwZWMuZGlzcGxheV9uYW1lO1xuXG4gICAgLy8gaWYga2VybmVsIHN0YXJ0dXAgYWxyZWFkeSBpbiBwcm9ncmVzcyBkb24ndCBzdGFydCBhZGRpdGlvbmFsIGtlcm5lbFxuICAgIGlmIChzdG9yZS5zdGFydGluZ0tlcm5lbHMuZ2V0KGRpc3BsYXlOYW1lKSkgcmV0dXJuO1xuXG4gICAgc3RvcmUuc3RhcnRLZXJuZWwoZGlzcGxheU5hbWUpO1xuXG4gICAgbGV0IGN1cnJlbnRQYXRoID0gZ2V0RWRpdG9yRGlyZWN0b3J5KGVkaXRvcik7XG4gICAgbGV0IHByb2plY3RQYXRoO1xuXG4gICAgbG9nKFwiS2VybmVsTWFuYWdlcjogc3RhcnRLZXJuZWw6XCIsIGRpc3BsYXlOYW1lKTtcblxuICAgIHN3aXRjaCAoYXRvbS5jb25maWcuZ2V0KFwiSHlkcm9nZW4uc3RhcnREaXJcIikpIHtcbiAgICAgIGNhc2UgXCJmaXJzdFByb2plY3REaXJcIjpcbiAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicHJvamVjdERpck9mRmlsZVwiOlxuICAgICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChjdXJyZW50UGF0aClbMF07XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnN0IGtlcm5lbFN0YXJ0RGlyID0gcHJvamVjdFBhdGggIT0gbnVsbCA/IHByb2plY3RQYXRoIDogY3VycmVudFBhdGg7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGN3ZDoga2VybmVsU3RhcnREaXIsXG4gICAgICBzdGRpbzogW1wiaWdub3JlXCIsIFwicGlwZVwiLCBcInBpcGVcIl0sXG4gICAgfTtcblxuICAgIGNvbnN0IHRyYW5zcG9ydCA9IG5ldyBaTVFLZXJuZWwoa2VybmVsU3BlYywgZ3JhbW1hciwgb3B0aW9ucywgKCkgPT4ge1xuICAgICAgY29uc3Qga2VybmVsID0gbmV3IEtlcm5lbCh0cmFuc3BvcnQpO1xuICAgICAgc3RvcmUubmV3S2VybmVsKGtlcm5lbCwgZmlsZVBhdGgsIGVkaXRvciwgZ3JhbW1hcik7XG4gICAgICBpZiAob25TdGFydGVkKSBvblN0YXJ0ZWQoa2VybmVsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZSgpOiBQcm9taXNlPEtlcm5lbHNwZWNbXT4ge1xuICAgIGNvbnN0IGtlcm5lbFNwZWNzID0gYXdhaXQga3MuZmluZEFsbCgpO1xuICAgIHRoaXMua2VybmVsU3BlY3MgPSBfLnNvcnRCeShcbiAgICAgIF8ubWFwKFxuICAgICAgICBfLm1hcEtleXMoa2VybmVsU3BlY3MsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgcmV0dXJuICh2YWx1ZS5zcGVjLm5hbWUgPSBrZXkpO1xuICAgICAgICB9KSxcbiAgICAgICAgXCJzcGVjXCJcbiAgICAgICksXG4gICAgICAoc3BlYykgPT4gc3BlYy5kaXNwbGF5X25hbWVcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmtlcm5lbFNwZWNzO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWxsS2VybmVsU3BlY3MoZ3JhbW1hcjogP2F0b20kR3JhbW1hcikge1xuICAgIGlmICh0aGlzLmtlcm5lbFNwZWNzKSByZXR1cm4gdGhpcy5rZXJuZWxTcGVjcztcbiAgICByZXR1cm4gdGhpcy51cGRhdGVLZXJuZWxTcGVjcyhncmFtbWFyKTtcbiAgfVxuXG4gIGFzeW5jIGdldEFsbEtlcm5lbFNwZWNzRm9yR3JhbW1hcihcbiAgICBncmFtbWFyOiA/YXRvbSRHcmFtbWFyXG4gICk6IFByb21pc2U8S2VybmVsc3BlY1tdPiB7XG4gICAgaWYgKCFncmFtbWFyKSByZXR1cm4gW107XG5cbiAgICBjb25zdCBrZXJuZWxTcGVjcyA9IGF3YWl0IHRoaXMuZ2V0QWxsS2VybmVsU3BlY3MoZ3JhbW1hcik7XG4gICAgcmV0dXJuIGtlcm5lbFNwZWNzLmZpbHRlcigoc3BlYykgPT5cbiAgICAgIGtlcm5lbFNwZWNQcm92aWRlc0dyYW1tYXIoc3BlYywgZ3JhbW1hcilcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgZ2V0S2VybmVsU3BlY0ZvckdyYW1tYXIoZ3JhbW1hcjogYXRvbSRHcmFtbWFyKSB7XG4gICAgY29uc3Qga2VybmVsU3BlY3MgPSBhd2FpdCB0aGlzLmdldEFsbEtlcm5lbFNwZWNzRm9yR3JhbW1hcihncmFtbWFyKTtcbiAgICBpZiAoa2VybmVsU3BlY3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHJldHVybiBrZXJuZWxTcGVjc1swXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5rZXJuZWxQaWNrZXIpIHtcbiAgICAgIHRoaXMua2VybmVsUGlja2VyLmtlcm5lbFNwZWNzID0ga2VybmVsU3BlY3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMua2VybmVsUGlja2VyID0gbmV3IEtlcm5lbFBpY2tlcihrZXJuZWxTcGVjcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMua2VybmVsUGlja2VyKSByZXR1cm4gcmVzb2x2ZShudWxsKTtcbiAgICAgIHRoaXMua2VybmVsUGlja2VyLm9uQ29uZmlybWVkID0gKGtlcm5lbFNwZWMpID0+IHJlc29sdmUoa2VybmVsU3BlYyk7XG4gICAgICB0aGlzLmtlcm5lbFBpY2tlci50b2dnbGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUtlcm5lbFNwZWNzKGdyYW1tYXI6ID9hdG9tJEdyYW1tYXIpIHtcbiAgICBjb25zdCBrZXJuZWxTcGVjcyA9IGF3YWl0IHRoaXMudXBkYXRlKCk7XG5cbiAgICBpZiAoa2VybmVsU3BlY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gXCJObyBLZXJuZWxzIEluc3RhbGxlZFwiO1xuXG4gICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIk5vIGtlcm5lbHMgYXJlIGluc3RhbGxlZCBvbiB5b3VyIHN5c3RlbSBzbyB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBleGVjdXRlIGNvZGUgaW4gYW55IGxhbmd1YWdlLlwiLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiSW5zdGFsbCBJbnN0cnVjdGlvbnNcIixcbiAgICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbChcbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vbnRlcmFjdC5naXRib29rcy5pby9oeWRyb2dlbi9kb2NzL0luc3RhbGxhdGlvbi5odG1sXCJcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiUG9wdWxhciBLZXJuZWxzXCIsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiBzaGVsbC5vcGVuRXh0ZXJuYWwoXCJodHRwczovL250ZXJhY3QuaW8va2VybmVsc1wiKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiQWxsIEtlcm5lbHNcIixcbiAgICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbChcbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vZ2l0aHViLmNvbS9qdXB5dGVyL2p1cHl0ZXIvd2lraS9KdXB5dGVyLWtlcm5lbHNcIlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKG1lc3NhZ2UsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gXCJIeWRyb2dlbiBLZXJuZWxzIHVwZGF0ZWQ6XCI7XG4gICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBkZXRhaWw6IF8ubWFwKGtlcm5lbFNwZWNzLCBcImRpc3BsYXlfbmFtZVwiKS5qb2luKFwiXFxuXCIpLFxuICAgICAgfTtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKG1lc3NhZ2UsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4ga2VybmVsU3BlY3M7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEtlcm5lbE1hbmFnZXIoKTtcbiJdfQ==