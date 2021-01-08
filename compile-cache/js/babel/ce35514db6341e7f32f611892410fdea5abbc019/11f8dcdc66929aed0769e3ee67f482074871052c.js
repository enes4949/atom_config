Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var _mobx = require("mobx");

var _lodash = require("lodash");

var _utils = require("./utils");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _storeWatches = require("./store/watches");

var _storeWatches2 = _interopRequireDefault(_storeWatches);

var _storeOutput = require("./store/output");

var _storeOutput2 = _interopRequireDefault(_storeOutput);

var _pluginApiHydrogenKernel = require("./plugin-api/hydrogen-kernel");

var _pluginApiHydrogenKernel2 = _interopRequireDefault(_pluginApiHydrogenKernel);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _kernelTransport = require("./kernel-transport");

var _kernelTransport2 = _interopRequireDefault(_kernelTransport);

function protectFromInvalidMessages(onResults) {
  var wrappedOnResults = function wrappedOnResults(message, channel) {
    if (!message) {
      (0, _utils.log)("Invalid message: null");
      return;
    }

    if (!message.content) {
      (0, _utils.log)("Invalid message: Missing content");
      return;
    }

    if (message.content.execution_state === "starting") {
      // Kernels send a starting status message with an empty parent_header
      (0, _utils.log)("Dropped starting status IO message");
      return;
    }

    if (!message.parent_header) {
      (0, _utils.log)("Invalid message: Missing parent_header");
      return;
    }

    if (!message.parent_header.msg_id) {
      (0, _utils.log)("Invalid message: Missing parent_header.msg_id");
      return;
    }

    if (!message.parent_header.msg_type) {
      (0, _utils.log)("Invalid message: Missing parent_header.msg_type");
      return;
    }

    if (!message.header) {
      (0, _utils.log)("Invalid message: Missing header");
      return;
    }

    if (!message.header.msg_id) {
      (0, _utils.log)("Invalid message: Missing header.msg_id");
      return;
    }

    if (!message.header.msg_type) {
      (0, _utils.log)("Invalid message: Missing header.msg_type");
      return;
    }

    onResults(message, channel);
  };
  return wrappedOnResults;
}

// Adapts middleware objects provided by plugins to an internal interface. In
// particular, this implements fallthrough logic for when a plugin defines some
// methods (e.g. execute) but doesn't implement others (e.g. interrupt). Note
// that HydrogenKernelMiddleware objects are mutable: they may lose/gain methods
// at any time, including in the middle of processing a request. This class also
// adds basic checks that messages passed via the `onResults` callbacks are not
// missing key mandatory fields specified in the Jupyter messaging spec.

var MiddlewareAdapter = (function () {
  function MiddlewareAdapter(middleware, next) {
    _classCallCheck(this, MiddlewareAdapter);

    this._middleware = middleware;
    this._next = next;
  }

  // The return value of this method gets passed to plugins! For now we just
  // return the MiddlewareAdapter object itself, which is why all private
  // functionality is prefixed with _, and why MiddlewareAdapter is marked as
  // implementing HydrogenKernelMiddlewareThunk. Once multiple plugin API
  // versions exist, we may want to generate a HydrogenKernelMiddlewareThunk
  // specialized for a particular plugin API version.

  _createClass(MiddlewareAdapter, [{
    key: "interrupt",
    value: function interrupt() {
      if (this._middleware.interrupt) {
        this._middleware.interrupt(this._nextAsPluginType);
      } else {
        this._next.interrupt();
      }
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      if (this._middleware.shutdown) {
        this._middleware.shutdown(this._nextAsPluginType);
      } else {
        this._next.shutdown();
      }
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      if (this._middleware.restart) {
        this._middleware.restart(this._nextAsPluginType, onRestarted);
      } else {
        this._next.restart(onRestarted);
      }
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      // We don't want to repeatedly wrap the onResults callback every time we
      // fall through, but we need to do it at least once before delegating to
      // the KernelTransport.
      var safeOnResults = this._middleware.execute || this._next instanceof _kernelTransport2["default"] ? protectFromInvalidMessages(onResults) : onResults;

      if (this._middleware.execute) {
        this._middleware.execute(this._nextAsPluginType, code, safeOnResults);
      } else {
        this._next.execute(code, safeOnResults);
      }
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      var safeOnResults = this._middleware.complete || this._next instanceof _kernelTransport2["default"] ? protectFromInvalidMessages(onResults) : onResults;

      if (this._middleware.complete) {
        this._middleware.complete(this._nextAsPluginType, code, safeOnResults);
      } else {
        this._next.complete(code, safeOnResults);
      }
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      var safeOnResults = this._middleware.inspect || this._next instanceof _kernelTransport2["default"] ? protectFromInvalidMessages(onResults) : onResults;
      if (this._middleware.inspect) {
        this._middleware.inspect(this._nextAsPluginType, code, cursorPos, safeOnResults);
      } else {
        this._next.inspect(code, cursorPos, safeOnResults);
      }
    }
  }, {
    key: "_nextAsPluginType",
    get: function get() {
      if (this._next instanceof _kernelTransport2["default"]) {
        throw new Error("MiddlewareAdapter: _nextAsPluginType must never be called when _next is KernelTransport");
      }
      return this._next;
    }
  }]);

  return MiddlewareAdapter;
})();

var Kernel = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Kernel, [{
    key: "inspector",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return { bundle: {} };
    },
    enumerable: true
  }], null, _instanceInitializers);

  function Kernel(kernel) {
    _classCallCheck(this, Kernel);

    _defineDecoratedPropertyDescriptor(this, "inspector", _instanceInitializers);

    this.outputStore = new _storeOutput2["default"]();
    this.watchCallbacks = [];
    this.emitter = new _atom.Emitter();
    this.pluginWrapper = null;

    this.transport = kernel;

    this.watchesStore = new _storeWatches2["default"](this);

    // A MiddlewareAdapter that forwards all requests to `this.transport`.
    // Needed to terminate the middleware chain in a way such that the `next`
    // object passed to the last middleware is not the KernelTransport instance
    // itself (which would be violate isolation of internals from plugins).
    var delegateToTransport = new MiddlewareAdapter({}, this.transport);
    this.middleware = [delegateToTransport];
  }

  _createDecoratedClass(Kernel, [{
    key: "addMiddleware",
    value: function addMiddleware(middleware) {
      this.middleware.unshift(new MiddlewareAdapter(middleware, this.middleware[0]));
    }
  }, {
    key: "setExecutionState",
    value: function setExecutionState(state) {
      this.transport.setExecutionState(state);
    }
  }, {
    key: "setExecutionCount",
    value: function setExecutionCount(count) {
      this.transport.setExecutionCount(count);
    }
  }, {
    key: "setLastExecutionTime",
    value: function setLastExecutionTime(timeString) {
      this.transport.setLastExecutionTime(timeString);
    }
  }, {
    key: "setInspectorResult",
    decorators: [_mobx.action],
    value: _asyncToGenerator(function* (bundle, editor) {
      if ((0, _lodash.isEqual)(this.inspector.bundle, bundle)) {
        yield atom.workspace.toggle(_utils.INSPECTOR_URI);
      } else if (bundle.size !== 0) {
        this.inspector.bundle = bundle;
        yield atom.workspace.open(_utils.INSPECTOR_URI, { searchAllPanes: true });
      }
      (0, _utils.focus)(editor);
    })
  }, {
    key: "getPluginWrapper",
    value: function getPluginWrapper() {
      if (!this.pluginWrapper) {
        this.pluginWrapper = new _pluginApiHydrogenKernel2["default"](this);
      }

      return this.pluginWrapper;
    }
  }, {
    key: "addWatchCallback",
    value: function addWatchCallback(watchCallback) {
      this.watchCallbacks.push(watchCallback);
    }
  }, {
    key: "interrupt",
    value: function interrupt() {
      this.firstMiddlewareAdapter.interrupt();
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      this.firstMiddlewareAdapter.shutdown();
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      this.firstMiddlewareAdapter.restart(onRestarted);
      this.setExecutionCount(0);
      this.setLastExecutionTime("No execution");
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      var _this = this;

      var wrappedOnResults = this._wrapExecutionResultsCallback(onResults);
      this.firstMiddlewareAdapter.execute(code, function (message, channel) {
        wrappedOnResults(message, channel);

        var msg_type = message.header.msg_type;

        if (msg_type === "execute_input") {
          _this.setLastExecutionTime("Running ...");
        }

        if (msg_type === "execute_reply") {
          var count = message.content.execution_count;
          _this.setExecutionCount(count);
          var timeString = (0, _utils.executionTime)(message);
          _this.setLastExecutionTime(timeString);
        }

        var execution_state = message.content.execution_state;

        if (channel == "iopub" && msg_type === "status" && execution_state === "idle") {
          _this._callWatchCallbacks();
        }
      });
    }
  }, {
    key: "executeWatch",
    value: function executeWatch(code, onResults) {
      this.firstMiddlewareAdapter.execute(code, this._wrapExecutionResultsCallback(onResults));
    }
  }, {
    key: "_callWatchCallbacks",
    value: function _callWatchCallbacks() {
      this.watchCallbacks.forEach(function (watchCallback) {
        return watchCallback();
      });
    }

    /*
     * Takes a callback that accepts execution results in a hydrogen-internal
     * format and wraps it to accept Jupyter message/channel pairs instead.
     * Kernels and plugins all operate on types specified by the Jupyter messaging
     * protocol in order to maximize compatibility, but hydrogen internally uses
     * its own types.
     */
  }, {
    key: "_wrapExecutionResultsCallback",
    value: function _wrapExecutionResultsCallback(onResults) {
      var _this2 = this;

      return function (message, channel) {
        if (channel === "shell") {
          var _status = message.content.status;

          if (_status === "error" || _status === "ok") {
            onResults({
              data: _status,
              stream: "status"
            });
          } else {
            (0, _utils.log)("Kernel: ignoring unexpected value for message.content.status");
          }
        } else if (channel === "iopub") {
          if (message.header.msg_type === "execute_input") {
            onResults({
              data: message.content.execution_count,
              stream: "execution_count"
            });
          }

          // TODO(nikita): Consider converting to V5 elsewhere, so that plugins
          // never have to deal with messages in the V4 format
          var result = (0, _utils.msgSpecToNotebookFormat)((0, _utils.msgSpecV4toV5)(message));
          onResults(result);
        } else if (channel === "stdin") {
          if (message.header.msg_type !== "input_request") {
            return;
          }

          var _message$content = message.content;
          var _prompt = _message$content.prompt;
          var password = _message$content.password;

          // TODO(nikita): perhaps it would make sense to install middleware for
          // sending input replies
          var inputView = new _inputView2["default"]({ prompt: _prompt, password: password }, function (input) {
            return _this2.transport.inputReply(input);
          });

          inputView.attach();
        }
      };
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      this.firstMiddlewareAdapter.complete(code, function (message, channel) {
        if (channel !== "shell") {
          (0, _utils.log)("Invalid reply: wrong channel");
          return;
        }
        onResults(message.content);
      });
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      this.firstMiddlewareAdapter.inspect(code, cursorPos, function (message, channel) {
        if (channel !== "shell") {
          (0, _utils.log)("Invalid reply: wrong channel");
          return;
        }
        onResults({
          data: message.content.data,
          found: message.content.found
        });
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("Kernel: Destroying");
      // This is for cleanup to improve performance
      this.watchesStore.destroy();
      _store2["default"].deleteKernel(this);
      this.transport.destroy();
      if (this.pluginWrapper) {
        this.pluginWrapper.destroyed = true;
      }
      this.emitter.emit("did-destroy");
      this.emitter.dispose();
    }
  }, {
    key: "kernelSpec",
    get: function get() {
      return this.transport.kernelSpec;
    }
  }, {
    key: "grammar",
    get: function get() {
      return this.transport.grammar;
    }
  }, {
    key: "language",
    get: function get() {
      return this.transport.language;
    }
  }, {
    key: "displayName",
    get: function get() {
      return this.transport.displayName;
    }
  }, {
    key: "firstMiddlewareAdapter",
    get: function get() {
      return this.middleware[0];
    }
  }, {
    key: "executionState",
    decorators: [_mobx.computed],
    get: function get() {
      return this.transport.executionState;
    }
  }, {
    key: "executionCount",
    decorators: [_mobx.computed],
    get: function get() {
      return this.transport.executionCount;
    }
  }, {
    key: "lastExecutionTime",
    decorators: [_mobx.computed],
    get: function get() {
      return this.transport.lastExecutionTime;
    }
  }], null, _instanceInitializers);

  return Kernel;
})();

exports["default"] = Kernel;
module.exports = exports["default"];

// Invariant: the `._next` of each entry in this array must point to the next
// element of the array. The `._next` of the last element must point to
// `this.transport`.
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIva2VybmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRXdCLE1BQU07O29CQUNlLE1BQU07O3NCQUMzQixRQUFROztxQkFRekIsU0FBUzs7cUJBQ0UsU0FBUzs7Ozs0QkFFRixpQkFBaUI7Ozs7MkJBQ2xCLGdCQUFnQjs7Ozt1Q0FDYiw4QkFBOEI7Ozs7eUJBS25DLGNBQWM7Ozs7K0JBQ1Isb0JBQW9COzs7O0FBSWhELFNBQVMsMEJBQTBCLENBQ2pDLFNBQTBCLEVBQ1Q7QUFDakIsTUFBTSxnQkFBaUMsR0FBRyxTQUFwQyxnQkFBaUMsQ0FBSSxPQUFPLEVBQUUsT0FBTyxFQUFLO0FBQzlELFFBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixzQkFBSSx1QkFBdUIsQ0FBQyxDQUFDO0FBQzdCLGFBQU87S0FDUjs7QUFFRCxRQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUNwQixzQkFBSSxrQ0FBa0MsQ0FBQyxDQUFDO0FBQ3hDLGFBQU87S0FDUjs7QUFFRCxRQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxLQUFLLFVBQVUsRUFBRTs7QUFFbEQsc0JBQUksb0NBQW9DLENBQUMsQ0FBQztBQUMxQyxhQUFPO0tBQ1I7O0FBRUQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7QUFDMUIsc0JBQUksd0NBQXdDLENBQUMsQ0FBQztBQUM5QyxhQUFPO0tBQ1I7O0FBRUQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO0FBQ2pDLHNCQUFJLCtDQUErQyxDQUFDLENBQUM7QUFDckQsYUFBTztLQUNSOztBQUVELFFBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtBQUNuQyxzQkFBSSxpREFBaUQsQ0FBQyxDQUFDO0FBQ3ZELGFBQU87S0FDUjs7QUFFRCxRQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0s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Ozs7O1NBT2lCLGVBQVc7QUFDM0IsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztLQUN0Qzs7OztTQU9vQixlQUFXO0FBQzlCLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztLQUN6Qzs7O1NBN0VrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IEVtaXR0ZXIgfSBmcm9tIFwiYXRvbVwiO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYWN0aW9uLCBjb21wdXRlZCB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyBpc0VxdWFsIH0gZnJvbSBcImxvZGFzaFwiO1xuXG5pbXBvcnQge1xuICBsb2csXG4gIGZvY3VzLFxuICBtc2dTcGVjVG9Ob3RlYm9va0Zvcm1hdCxcbiAgbXNnU3BlY1Y0dG9WNSxcbiAgSU5TUEVDVE9SX1VSSSxcbn0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBzdG9yZSBmcm9tIFwiLi9zdG9yZVwiO1xuXG5pbXBvcnQgV2F0Y2hlc1N0b3JlIGZyb20gXCIuL3N0b3JlL3dhdGNoZXNcIjtcbmltcG9ydCBPdXRwdXRTdG9yZSBmcm9tIFwiLi9zdG9yZS9vdXRwdXRcIjtcbmltcG9ydCBIeWRyb2dlbktlcm5lbCBmcm9tIFwiLi9wbHVnaW4tYXBpL2h5ZHJvZ2VuLWtlcm5lbFwiO1xuaW1wb3J0IHR5cGUge1xuICBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmVUaHVuayxcbiAgSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlLFxufSBmcm9tIFwiLi9wbHVnaW4tYXBpL2h5ZHJvZ2VuLXR5cGVzXCI7XG5pbXBvcnQgSW5wdXRWaWV3IGZyb20gXCIuL2lucHV0LXZpZXdcIjtcbmltcG9ydCBLZXJuZWxUcmFuc3BvcnQgZnJvbSBcIi4va2VybmVsLXRyYW5zcG9ydFwiO1xuaW1wb3J0IHR5cGUgeyBSZXN1bHRzQ2FsbGJhY2sgfSBmcm9tIFwiLi9rZXJuZWwtdHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBleGVjdXRpb25UaW1lIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZnVuY3Rpb24gcHJvdGVjdEZyb21JbnZhbGlkTWVzc2FnZXMoXG4gIG9uUmVzdWx0czogUmVzdWx0c0NhbGxiYWNrXG4pOiBSZXN1bHRzQ2FsbGJhY2sge1xuICBjb25zdCB3cmFwcGVkT25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2sgPSAobWVzc2FnZSwgY2hhbm5lbCkgPT4ge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBudWxsXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5jb250ZW50KSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgY29udGVudFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5jb250ZW50LmV4ZWN1dGlvbl9zdGF0ZSA9PT0gXCJzdGFydGluZ1wiKSB7XG4gICAgICAvLyBLZXJuZWxzIHNlbmQgYSBzdGFydGluZyBzdGF0dXMgbWVzc2FnZSB3aXRoIGFuIGVtcHR5IHBhcmVudF9oZWFkZXJcbiAgICAgIGxvZyhcIkRyb3BwZWQgc3RhcnRpbmcgc3RhdHVzIElPIG1lc3NhZ2VcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLnBhcmVudF9oZWFkZXIpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBwYXJlbnRfaGVhZGVyXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5wYXJlbnRfaGVhZGVyLm1zZ19pZCkge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIHBhcmVudF9oZWFkZXIubXNnX2lkXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5wYXJlbnRfaGVhZGVyLm1zZ190eXBlKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgcGFyZW50X2hlYWRlci5tc2dfdHlwZVwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UuaGVhZGVyKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgaGVhZGVyXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5oZWFkZXIubXNnX2lkKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgaGVhZGVyLm1zZ19pZFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UuaGVhZGVyLm1zZ190eXBlKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgaGVhZGVyLm1zZ190eXBlXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9uUmVzdWx0cyhtZXNzYWdlLCBjaGFubmVsKTtcbiAgfTtcbiAgcmV0dXJuIHdyYXBwZWRPblJlc3VsdHM7XG59XG5cbi8vIEFkYXB0cyBtaWRkbGV3YXJlIG9iamVjdHMgcHJvdmlkZWQgYnkgcGx1Z2lucyB0byBhbiBpbnRlcm5hbCBpbnRlcmZhY2UuIEluXG4vLyBwYXJ0aWN1bGFyLCB0aGlzIGltcGxlbWVudHMgZmFsbHRocm91Z2ggbG9naWMgZm9yIHdoZW4gYSBwbHVnaW4gZGVmaW5lcyBzb21lXG4vLyBtZXRob2RzIChlLmcuIGV4ZWN1dGUpIGJ1dCBkb2Vzbid0IGltcGxlbWVudCBvdGhlcnMgKGUuZy4gaW50ZXJydXB0KS4gTm90ZVxuLy8gdGhhdCBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmUgb2JqZWN0cyBhcmUgbXV0YWJsZTogdGhleSBtYXkgbG9zZS9nYWluIG1ldGhvZHNcbi8vIGF0IGFueSB0aW1lLCBpbmNsdWRpbmcgaW4gdGhlIG1pZGRsZSBvZiBwcm9jZXNzaW5nIGEgcmVxdWVzdC4gVGhpcyBjbGFzcyBhbHNvXG4vLyBhZGRzIGJhc2ljIGNoZWNrcyB0aGF0IG1lc3NhZ2VzIHBhc3NlZCB2aWEgdGhlIGBvblJlc3VsdHNgIGNhbGxiYWNrcyBhcmUgbm90XG4vLyBtaXNzaW5nIGtleSBtYW5kYXRvcnkgZmllbGRzIHNwZWNpZmllZCBpbiB0aGUgSnVweXRlciBtZXNzYWdpbmcgc3BlYy5cbmNsYXNzIE1pZGRsZXdhcmVBZGFwdGVyIGltcGxlbWVudHMgSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlVGh1bmsge1xuICBfbWlkZGxld2FyZTogSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlO1xuICBfbmV4dDogTWlkZGxld2FyZUFkYXB0ZXIgfCBLZXJuZWxUcmFuc3BvcnQ7XG4gIGNvbnN0cnVjdG9yKFxuICAgIG1pZGRsZXdhcmU6IEh5ZHJvZ2VuS2VybmVsTWlkZGxld2FyZSxcbiAgICBuZXh0OiBNaWRkbGV3YXJlQWRhcHRlciB8IEtlcm5lbFRyYW5zcG9ydFxuICApIHtcbiAgICB0aGlzLl9taWRkbGV3YXJlID0gbWlkZGxld2FyZTtcbiAgICB0aGlzLl9uZXh0ID0gbmV4dDtcbiAgfVxuXG4gIC8vIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhpcyBtZXRob2QgZ2V0cyBwYXNzZWQgdG8gcGx1Z2lucyEgRm9yIG5vdyB3ZSBqdXN0XG4gIC8vIHJldHVybiB0aGUgTWlkZGxld2FyZUFkYXB0ZXIgb2JqZWN0IGl0c2VsZiwgd2hpY2ggaXMgd2h5IGFsbCBwcml2YXRlXG4gIC8vIGZ1bmN0aW9uYWxpdHkgaXMgcHJlZml4ZWQgd2l0aCBfLCBhbmQgd2h5IE1pZGRsZXdhcmVBZGFwdGVyIGlzIG1hcmtlZCBhc1xuICAvLyBpbXBsZW1lbnRpbmcgSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlVGh1bmsuIE9uY2UgbXVsdGlwbGUgcGx1Z2luIEFQSVxuICAvLyB2ZXJzaW9ucyBleGlzdCwgd2UgbWF5IHdhbnQgdG8gZ2VuZXJhdGUgYSBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmVUaHVua1xuICAvLyBzcGVjaWFsaXplZCBmb3IgYSBwYXJ0aWN1bGFyIHBsdWdpbiBBUEkgdmVyc2lvbi5cbiAgZ2V0IF9uZXh0QXNQbHVnaW5UeXBlKCk6IEh5ZHJvZ2VuS2VybmVsTWlkZGxld2FyZVRodW5rIHtcbiAgICBpZiAodGhpcy5fbmV4dCBpbnN0YW5jZW9mIEtlcm5lbFRyYW5zcG9ydCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIk1pZGRsZXdhcmVBZGFwdGVyOiBfbmV4dEFzUGx1Z2luVHlwZSBtdXN0IG5ldmVyIGJlIGNhbGxlZCB3aGVuIF9uZXh0IGlzIEtlcm5lbFRyYW5zcG9ydFwiXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbmV4dDtcbiAgfVxuXG4gIGludGVycnVwdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbWlkZGxld2FyZS5pbnRlcnJ1cHQpIHtcbiAgICAgIHRoaXMuX21pZGRsZXdhcmUuaW50ZXJydXB0KHRoaXMuX25leHRBc1BsdWdpblR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uZXh0LmludGVycnVwdCgpO1xuICAgIH1cbiAgfVxuXG4gIHNodXRkb3duKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9taWRkbGV3YXJlLnNodXRkb3duKSB7XG4gICAgICB0aGlzLl9taWRkbGV3YXJlLnNodXRkb3duKHRoaXMuX25leHRBc1BsdWdpblR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uZXh0LnNodXRkb3duKCk7XG4gICAgfVxuICB9XG5cbiAgcmVzdGFydChvblJlc3RhcnRlZDogP0Z1bmN0aW9uKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21pZGRsZXdhcmUucmVzdGFydCkge1xuICAgICAgdGhpcy5fbWlkZGxld2FyZS5yZXN0YXJ0KHRoaXMuX25leHRBc1BsdWdpblR5cGUsIG9uUmVzdGFydGVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbmV4dC5yZXN0YXJ0KG9uUmVzdGFydGVkKTtcbiAgICB9XG4gIH1cblxuICBleGVjdXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spOiB2b2lkIHtcbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHJlcGVhdGVkbHkgd3JhcCB0aGUgb25SZXN1bHRzIGNhbGxiYWNrIGV2ZXJ5IHRpbWUgd2VcbiAgICAvLyBmYWxsIHRocm91Z2gsIGJ1dCB3ZSBuZWVkIHRvIGRvIGl0IGF0IGxlYXN0IG9uY2UgYmVmb3JlIGRlbGVnYXRpbmcgdG9cbiAgICAvLyB0aGUgS2VybmVsVHJhbnNwb3J0LlxuICAgIGxldCBzYWZlT25SZXN1bHRzID1cbiAgICAgIHRoaXMuX21pZGRsZXdhcmUuZXhlY3V0ZSB8fCB0aGlzLl9uZXh0IGluc3RhbmNlb2YgS2VybmVsVHJhbnNwb3J0XG4gICAgICAgID8gcHJvdGVjdEZyb21JbnZhbGlkTWVzc2FnZXMob25SZXN1bHRzKVxuICAgICAgICA6IG9uUmVzdWx0cztcblxuICAgIGlmICh0aGlzLl9taWRkbGV3YXJlLmV4ZWN1dGUpIHtcbiAgICAgIHRoaXMuX21pZGRsZXdhcmUuZXhlY3V0ZSh0aGlzLl9uZXh0QXNQbHVnaW5UeXBlLCBjb2RlLCBzYWZlT25SZXN1bHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbmV4dC5leGVjdXRlKGNvZGUsIHNhZmVPblJlc3VsdHMpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spOiB2b2lkIHtcbiAgICBsZXQgc2FmZU9uUmVzdWx0cyA9XG4gICAgICB0aGlzLl9taWRkbGV3YXJlLmNvbXBsZXRlIHx8IHRoaXMuX25leHQgaW5zdGFuY2VvZiBLZXJuZWxUcmFuc3BvcnRcbiAgICAgICAgPyBwcm90ZWN0RnJvbUludmFsaWRNZXNzYWdlcyhvblJlc3VsdHMpXG4gICAgICAgIDogb25SZXN1bHRzO1xuXG4gICAgaWYgKHRoaXMuX21pZGRsZXdhcmUuY29tcGxldGUpIHtcbiAgICAgIHRoaXMuX21pZGRsZXdhcmUuY29tcGxldGUodGhpcy5fbmV4dEFzUGx1Z2luVHlwZSwgY29kZSwgc2FmZU9uUmVzdWx0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25leHQuY29tcGxldGUoY29kZSwgc2FmZU9uUmVzdWx0cyk7XG4gICAgfVxuICB9XG5cbiAgaW5zcGVjdChjb2RlOiBzdHJpbmcsIGN1cnNvclBvczogbnVtYmVyLCBvblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjayk6IHZvaWQge1xuICAgIGxldCBzYWZlT25SZXN1bHRzID1cbiAgICAgIHRoaXMuX21pZGRsZXdhcmUuaW5zcGVjdCB8fCB0aGlzLl9uZXh0IGluc3RhbmNlb2YgS2VybmVsVHJhbnNwb3J0XG4gICAgICAgID8gcHJvdGVjdEZyb21JbnZhbGlkTWVzc2FnZXMob25SZXN1bHRzKVxuICAgICAgICA6IG9uUmVzdWx0cztcbiAgICBpZiAodGhpcy5fbWlkZGxld2FyZS5pbnNwZWN0KSB7XG4gICAgICB0aGlzLl9taWRkbGV3YXJlLmluc3BlY3QoXG4gICAgICAgIHRoaXMuX25leHRBc1BsdWdpblR5cGUsXG4gICAgICAgIGNvZGUsXG4gICAgICAgIGN1cnNvclBvcyxcbiAgICAgICAgc2FmZU9uUmVzdWx0c1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbmV4dC5pbnNwZWN0KGNvZGUsIGN1cnNvclBvcywgc2FmZU9uUmVzdWx0cyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtlcm5lbCB7XG4gIEBvYnNlcnZhYmxlXG4gIGluc3BlY3RvciA9IHsgYnVuZGxlOiB7fSB9O1xuICBvdXRwdXRTdG9yZSA9IG5ldyBPdXRwdXRTdG9yZSgpO1xuXG4gIHdhdGNoZXNTdG9yZTogV2F0Y2hlc1N0b3JlO1xuICB3YXRjaENhbGxiYWNrczogQXJyYXk8RnVuY3Rpb24+ID0gW107XG5cbiAgZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gIHBsdWdpbldyYXBwZXI6IEh5ZHJvZ2VuS2VybmVsIHwgbnVsbCA9IG51bGw7XG4gIHRyYW5zcG9ydDogS2VybmVsVHJhbnNwb3J0O1xuXG4gIC8vIEludmFyaWFudDogdGhlIGAuX25leHRgIG9mIGVhY2ggZW50cnkgaW4gdGhpcyBhcnJheSBtdXN0IHBvaW50IHRvIHRoZSBuZXh0XG4gIC8vIGVsZW1lbnQgb2YgdGhlIGFycmF5LiBUaGUgYC5fbmV4dGAgb2YgdGhlIGxhc3QgZWxlbWVudCBtdXN0IHBvaW50IHRvXG4gIC8vIGB0aGlzLnRyYW5zcG9ydGAuXG4gIG1pZGRsZXdhcmU6IEFycmF5PE1pZGRsZXdhcmVBZGFwdGVyPjtcblxuICBjb25zdHJ1Y3RvcihrZXJuZWw6IEtlcm5lbFRyYW5zcG9ydCkge1xuICAgIHRoaXMudHJhbnNwb3J0ID0ga2VybmVsO1xuXG4gICAgdGhpcy53YXRjaGVzU3RvcmUgPSBuZXcgV2F0Y2hlc1N0b3JlKHRoaXMpO1xuXG4gICAgLy8gQSBNaWRkbGV3YXJlQWRhcHRlciB0aGF0IGZvcndhcmRzIGFsbCByZXF1ZXN0cyB0byBgdGhpcy50cmFuc3BvcnRgLlxuICAgIC8vIE5lZWRlZCB0byB0ZXJtaW5hdGUgdGhlIG1pZGRsZXdhcmUgY2hhaW4gaW4gYSB3YXkgc3VjaCB0aGF0IHRoZSBgbmV4dGBcbiAgICAvLyBvYmplY3QgcGFzc2VkIHRvIHRoZSBsYXN0IG1pZGRsZXdhcmUgaXMgbm90IHRoZSBLZXJuZWxUcmFuc3BvcnQgaW5zdGFuY2VcbiAgICAvLyBpdHNlbGYgKHdoaWNoIHdvdWxkIGJlIHZpb2xhdGUgaXNvbGF0aW9uIG9mIGludGVybmFscyBmcm9tIHBsdWdpbnMpLlxuICAgIGNvbnN0IGRlbGVnYXRlVG9UcmFuc3BvcnQgPSBuZXcgTWlkZGxld2FyZUFkYXB0ZXIoe30sIHRoaXMudHJhbnNwb3J0KTtcbiAgICB0aGlzLm1pZGRsZXdhcmUgPSBbZGVsZWdhdGVUb1RyYW5zcG9ydF07XG4gIH1cblxuICBnZXQga2VybmVsU3BlYygpOiBLZXJuZWxzcGVjIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQua2VybmVsU3BlYztcbiAgfVxuXG4gIGdldCBncmFtbWFyKCk6IGF0b20kR3JhbW1hciB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LmdyYW1tYXI7XG4gIH1cblxuICBnZXQgbGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQubGFuZ3VhZ2U7XG4gIH1cblxuICBnZXQgZGlzcGxheU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuZGlzcGxheU5hbWU7XG4gIH1cblxuICBnZXQgZmlyc3RNaWRkbGV3YXJlQWRhcHRlcigpOiBNaWRkbGV3YXJlQWRhcHRlciB7XG4gICAgcmV0dXJuIHRoaXMubWlkZGxld2FyZVswXTtcbiAgfVxuXG4gIGFkZE1pZGRsZXdhcmUobWlkZGxld2FyZTogSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlKSB7XG4gICAgdGhpcy5taWRkbGV3YXJlLnVuc2hpZnQoXG4gICAgICBuZXcgTWlkZGxld2FyZUFkYXB0ZXIobWlkZGxld2FyZSwgdGhpcy5taWRkbGV3YXJlWzBdKVxuICAgICk7XG4gIH1cblxuICBAY29tcHV0ZWRcbiAgZ2V0IGV4ZWN1dGlvblN0YXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LmV4ZWN1dGlvblN0YXRlO1xuICB9XG5cbiAgc2V0RXhlY3V0aW9uU3RhdGUoc3RhdGU6IHN0cmluZykge1xuICAgIHRoaXMudHJhbnNwb3J0LnNldEV4ZWN1dGlvblN0YXRlKHN0YXRlKTtcbiAgfVxuXG4gIEBjb21wdXRlZFxuICBnZXQgZXhlY3V0aW9uQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuZXhlY3V0aW9uQ291bnQ7XG4gIH1cblxuICBzZXRFeGVjdXRpb25Db3VudChjb3VudDogbnVtYmVyKSB7XG4gICAgdGhpcy50cmFuc3BvcnQuc2V0RXhlY3V0aW9uQ291bnQoY291bnQpO1xuICB9XG5cbiAgQGNvbXB1dGVkXG4gIGdldCBsYXN0RXhlY3V0aW9uVGltZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5sYXN0RXhlY3V0aW9uVGltZTtcbiAgfVxuXG4gIHNldExhc3RFeGVjdXRpb25UaW1lKHRpbWVTdHJpbmc6IHN0cmluZykge1xuICAgIHRoaXMudHJhbnNwb3J0LnNldExhc3RFeGVjdXRpb25UaW1lKHRpbWVTdHJpbmcpO1xuICB9XG5cbiAgQGFjdGlvblxuICBhc3luYyBzZXRJbnNwZWN0b3JSZXN1bHQoYnVuZGxlOiBPYmplY3QsIGVkaXRvcjogP2F0b20kVGV4dEVkaXRvcikge1xuICAgIGlmIChpc0VxdWFsKHRoaXMuaW5zcGVjdG9yLmJ1bmRsZSwgYnVuZGxlKSkge1xuICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2UudG9nZ2xlKElOU1BFQ1RPUl9VUkkpO1xuICAgIH0gZWxzZSBpZiAoYnVuZGxlLnNpemUgIT09IDApIHtcbiAgICAgIHRoaXMuaW5zcGVjdG9yLmJ1bmRsZSA9IGJ1bmRsZTtcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oSU5TUEVDVE9SX1VSSSwgeyBzZWFyY2hBbGxQYW5lczogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZm9jdXMoZWRpdG9yKTtcbiAgfVxuXG4gIGdldFBsdWdpbldyYXBwZXIoKSB7XG4gICAgaWYgKCF0aGlzLnBsdWdpbldyYXBwZXIpIHtcbiAgICAgIHRoaXMucGx1Z2luV3JhcHBlciA9IG5ldyBIeWRyb2dlbktlcm5lbCh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wbHVnaW5XcmFwcGVyO1xuICB9XG5cbiAgYWRkV2F0Y2hDYWxsYmFjayh3YXRjaENhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHRoaXMud2F0Y2hDYWxsYmFja3MucHVzaCh3YXRjaENhbGxiYWNrKTtcbiAgfVxuXG4gIGludGVycnVwdCgpIHtcbiAgICB0aGlzLmZpcnN0TWlkZGxld2FyZUFkYXB0ZXIuaW50ZXJydXB0KCk7XG4gIH1cblxuICBzaHV0ZG93bigpIHtcbiAgICB0aGlzLmZpcnN0TWlkZGxld2FyZUFkYXB0ZXIuc2h1dGRvd24oKTtcbiAgfVxuXG4gIHJlc3RhcnQob25SZXN0YXJ0ZWQ6ID9GdW5jdGlvbikge1xuICAgIHRoaXMuZmlyc3RNaWRkbGV3YXJlQWRhcHRlci5yZXN0YXJ0KG9uUmVzdGFydGVkKTtcbiAgICB0aGlzLnNldEV4ZWN1dGlvbkNvdW50KDApO1xuICAgIHRoaXMuc2V0TGFzdEV4ZWN1dGlvblRpbWUoXCJObyBleGVjdXRpb25cIik7XG4gIH1cblxuICBleGVjdXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBGdW5jdGlvbikge1xuICAgIGNvbnN0IHdyYXBwZWRPblJlc3VsdHMgPSB0aGlzLl93cmFwRXhlY3V0aW9uUmVzdWx0c0NhbGxiYWNrKG9uUmVzdWx0cyk7XG4gICAgdGhpcy5maXJzdE1pZGRsZXdhcmVBZGFwdGVyLmV4ZWN1dGUoXG4gICAgICBjb2RlLFxuICAgICAgKG1lc3NhZ2U6IE1lc3NhZ2UsIGNoYW5uZWw6IHN0cmluZykgPT4ge1xuICAgICAgICB3cmFwcGVkT25SZXN1bHRzKG1lc3NhZ2UsIGNoYW5uZWwpO1xuXG4gICAgICAgIGNvbnN0IHsgbXNnX3R5cGUgfSA9IG1lc3NhZ2UuaGVhZGVyO1xuICAgICAgICBpZiAobXNnX3R5cGUgPT09IFwiZXhlY3V0ZV9pbnB1dFwiKSB7XG4gICAgICAgICAgdGhpcy5zZXRMYXN0RXhlY3V0aW9uVGltZShcIlJ1bm5pbmcgLi4uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1zZ190eXBlID09PSBcImV4ZWN1dGVfcmVwbHlcIikge1xuICAgICAgICAgIGNvbnN0IGNvdW50ID0gbWVzc2FnZS5jb250ZW50LmV4ZWN1dGlvbl9jb3VudDtcbiAgICAgICAgICB0aGlzLnNldEV4ZWN1dGlvbkNvdW50KGNvdW50KTtcbiAgICAgICAgICBjb25zdCB0aW1lU3RyaW5nID0gZXhlY3V0aW9uVGltZShtZXNzYWdlKTtcbiAgICAgICAgICB0aGlzLnNldExhc3RFeGVjdXRpb25UaW1lKHRpbWVTdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBleGVjdXRpb25fc3RhdGUgfSA9IG1lc3NhZ2UuY29udGVudDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNoYW5uZWwgPT0gXCJpb3B1YlwiICYmXG4gICAgICAgICAgbXNnX3R5cGUgPT09IFwic3RhdHVzXCIgJiZcbiAgICAgICAgICBleGVjdXRpb25fc3RhdGUgPT09IFwiaWRsZVwiXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuX2NhbGxXYXRjaENhbGxiYWNrcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGVXYXRjaChjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogRnVuY3Rpb24pIHtcbiAgICB0aGlzLmZpcnN0TWlkZGxld2FyZUFkYXB0ZXIuZXhlY3V0ZShcbiAgICAgIGNvZGUsXG4gICAgICB0aGlzLl93cmFwRXhlY3V0aW9uUmVzdWx0c0NhbGxiYWNrKG9uUmVzdWx0cylcbiAgICApO1xuICB9XG5cbiAgX2NhbGxXYXRjaENhbGxiYWNrcygpIHtcbiAgICB0aGlzLndhdGNoQ2FsbGJhY2tzLmZvckVhY2goKHdhdGNoQ2FsbGJhY2spID0+IHdhdGNoQ2FsbGJhY2soKSk7XG4gIH1cblxuICAvKlxuICAgKiBUYWtlcyBhIGNhbGxiYWNrIHRoYXQgYWNjZXB0cyBleGVjdXRpb24gcmVzdWx0cyBpbiBhIGh5ZHJvZ2VuLWludGVybmFsXG4gICAqIGZvcm1hdCBhbmQgd3JhcHMgaXQgdG8gYWNjZXB0IEp1cHl0ZXIgbWVzc2FnZS9jaGFubmVsIHBhaXJzIGluc3RlYWQuXG4gICAqIEtlcm5lbHMgYW5kIHBsdWdpbnMgYWxsIG9wZXJhdGUgb24gdHlwZXMgc3BlY2lmaWVkIGJ5IHRoZSBKdXB5dGVyIG1lc3NhZ2luZ1xuICAgKiBwcm90b2NvbCBpbiBvcmRlciB0byBtYXhpbWl6ZSBjb21wYXRpYmlsaXR5LCBidXQgaHlkcm9nZW4gaW50ZXJuYWxseSB1c2VzXG4gICAqIGl0cyBvd24gdHlwZXMuXG4gICAqL1xuICBfd3JhcEV4ZWN1dGlvblJlc3VsdHNDYWxsYmFjayhvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIChtZXNzYWdlOiBNZXNzYWdlLCBjaGFubmVsOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChjaGFubmVsID09PSBcInNoZWxsXCIpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMgfSA9IG1lc3NhZ2UuY29udGVudDtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJlcnJvclwiIHx8IHN0YXR1cyA9PT0gXCJva1wiKSB7XG4gICAgICAgICAgb25SZXN1bHRzKHtcbiAgICAgICAgICAgIGRhdGE6IHN0YXR1cyxcbiAgICAgICAgICAgIHN0cmVhbTogXCJzdGF0dXNcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2coXCJLZXJuZWw6IGlnbm9yaW5nIHVuZXhwZWN0ZWQgdmFsdWUgZm9yIG1lc3NhZ2UuY29udGVudC5zdGF0dXNcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gXCJpb3B1YlwiKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLmhlYWRlci5tc2dfdHlwZSA9PT0gXCJleGVjdXRlX2lucHV0XCIpIHtcbiAgICAgICAgICBvblJlc3VsdHMoe1xuICAgICAgICAgICAgZGF0YTogbWVzc2FnZS5jb250ZW50LmV4ZWN1dGlvbl9jb3VudCxcbiAgICAgICAgICAgIHN0cmVhbTogXCJleGVjdXRpb25fY291bnRcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE8obmlraXRhKTogQ29uc2lkZXIgY29udmVydGluZyB0byBWNSBlbHNld2hlcmUsIHNvIHRoYXQgcGx1Z2luc1xuICAgICAgICAvLyBuZXZlciBoYXZlIHRvIGRlYWwgd2l0aCBtZXNzYWdlcyBpbiB0aGUgVjQgZm9ybWF0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1zZ1NwZWNUb05vdGVib29rRm9ybWF0KG1zZ1NwZWNWNHRvVjUobWVzc2FnZSkpO1xuICAgICAgICBvblJlc3VsdHMocmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gXCJzdGRpblwiKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLmhlYWRlci5tc2dfdHlwZSAhPT0gXCJpbnB1dF9yZXF1ZXN0XCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IHByb21wdCwgcGFzc3dvcmQgfSA9IG1lc3NhZ2UuY29udGVudDtcblxuICAgICAgICAvLyBUT0RPKG5pa2l0YSk6IHBlcmhhcHMgaXQgd291bGQgbWFrZSBzZW5zZSB0byBpbnN0YWxsIG1pZGRsZXdhcmUgZm9yXG4gICAgICAgIC8vIHNlbmRpbmcgaW5wdXQgcmVwbGllc1xuICAgICAgICBjb25zdCBpbnB1dFZpZXcgPSBuZXcgSW5wdXRWaWV3KHsgcHJvbXB0LCBwYXNzd29yZCB9LCAoaW5wdXQ6IHN0cmluZykgPT5cbiAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5pbnB1dFJlcGx5KGlucHV0KVxuICAgICAgICApO1xuXG4gICAgICAgIGlucHV0Vmlldy5hdHRhY2goKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgY29tcGxldGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5maXJzdE1pZGRsZXdhcmVBZGFwdGVyLmNvbXBsZXRlKFxuICAgICAgY29kZSxcbiAgICAgIChtZXNzYWdlOiBNZXNzYWdlLCBjaGFubmVsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGNoYW5uZWwgIT09IFwic2hlbGxcIikge1xuICAgICAgICAgIGxvZyhcIkludmFsaWQgcmVwbHk6IHdyb25nIGNoYW5uZWxcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG9uUmVzdWx0cyhtZXNzYWdlLmNvbnRlbnQpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBpbnNwZWN0KGNvZGU6IHN0cmluZywgY3Vyc29yUG9zOiBudW1iZXIsIG9uUmVzdWx0czogRnVuY3Rpb24pIHtcbiAgICB0aGlzLmZpcnN0TWlkZGxld2FyZUFkYXB0ZXIuaW5zcGVjdChcbiAgICAgIGNvZGUsXG4gICAgICBjdXJzb3JQb3MsXG4gICAgICAobWVzc2FnZTogTWVzc2FnZSwgY2hhbm5lbDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmIChjaGFubmVsICE9PSBcInNoZWxsXCIpIHtcbiAgICAgICAgICBsb2coXCJJbnZhbGlkIHJlcGx5OiB3cm9uZyBjaGFubmVsXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvblJlc3VsdHMoe1xuICAgICAgICAgIGRhdGE6IG1lc3NhZ2UuY29udGVudC5kYXRhLFxuICAgICAgICAgIGZvdW5kOiBtZXNzYWdlLmNvbnRlbnQuZm91bmQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGxvZyhcIktlcm5lbDogRGVzdHJveWluZ1wiKTtcbiAgICAvLyBUaGlzIGlzIGZvciBjbGVhbnVwIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcbiAgICB0aGlzLndhdGNoZXNTdG9yZS5kZXN0cm95KCk7XG4gICAgc3RvcmUuZGVsZXRlS2VybmVsKHRoaXMpO1xuICAgIHRoaXMudHJhbnNwb3J0LmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5wbHVnaW5XcmFwcGVyKSB7XG4gICAgICB0aGlzLnBsdWdpbldyYXBwZXIuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtZGVzdHJveVwiKTtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG59XG4iXX0=