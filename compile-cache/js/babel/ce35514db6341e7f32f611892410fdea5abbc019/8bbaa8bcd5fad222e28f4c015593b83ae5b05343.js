Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _uuid = require("uuid");

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _xmlhttprequest = require("xmlhttprequest");

var _xmlhttprequest2 = _interopRequireDefault(_xmlhttprequest);

var _url = require("url");

var _jupyterlabServices = require("@jupyterlab/services");

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _wsKernel = require("./ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var CustomListView = (function () {
  function CustomListView() {
    var _this = this;

    _classCallCheck(this, CustomListView);

    this.onConfirmed = null;
    this.onCancelled = null;

    this.previouslyFocusedElement = document.activeElement;
    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(item) {
        return item.name;
      },
      elementForItem: function elementForItem(item) {
        var element = document.createElement("li");
        element.textContent = item.name;
        return element;
      },
      didConfirmSelection: function didConfirmSelection(item) {
        if (_this.onConfirmed) _this.onConfirmed(item);
      },
      didCancelSelection: function didCancelSelection() {
        _this.cancel();
        if (_this.onCancelled) _this.onCancelled();
      }
    });
  }

  _createClass(CustomListView, [{
    key: "show",
    value: function show() {
      if (!this.panel) {
        this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
      }
      this.panel.show();
      this.selectListView.focus();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.cancel();
      return this.selectListView.destroy();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      this.panel = null;
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }]);

  return CustomListView;
})();

var WSKernelPicker = (function () {
  function WSKernelPicker(onChosen) {
    _classCallCheck(this, WSKernelPicker);

    this._onChosen = onChosen;
    this.listView = new CustomListView();
  }

  _createClass(WSKernelPicker, [{
    key: "toggle",
    value: _asyncToGenerator(function* (_kernelSpecFilter) {
      this.listView.previouslyFocusedElement = document.activeElement;
      this._kernelSpecFilter = _kernelSpecFilter;
      var gateways = _config2["default"].getJson("gateways") || [];
      if (_lodash2["default"].isEmpty(gateways)) {
        atom.notifications.addError("No remote kernel gateways available", {
          description: "Use the Hydrogen package settings to specify the list of remote servers. Hydrogen can use remote kernels on either a Jupyter Kernel Gateway or Jupyter notebook server."
        });
        return;
      }

      this._path = (_store2["default"].filePath || "unsaved") + "-" + (0, _uuid.v4)();

      this.listView.onConfirmed = this.onGateway.bind(this);

      yield this.listView.selectListView.update({
        items: gateways,
        infoMessage: "Select a gateway",
        emptyMessage: "No gateways available",
        loadingMessage: null
      });

      this.listView.show();
    })
  }, {
    key: "promptForText",
    value: _asyncToGenerator(function* (prompt) {
      var previouslyFocusedElement = this.listView.previouslyFocusedElement;
      this.listView.cancel();

      var inputPromise = new Promise(function (resolve, reject) {
        var inputView = new _inputView2["default"]({ prompt: prompt }, resolve);
        atom.commands.add(inputView.element, {
          "core:cancel": function coreCancel() {
            inputView.close();
            reject();
          }
        });
        inputView.attach();
      });

      var response = undefined;
      try {
        response = yield inputPromise;
        if (response === "") {
          return null;
        }
      } catch (e) {
        return null;
      }

      // Assume that no response to the prompt will cancel the entire flow, so
      // only restore listView if a response was received
      this.listView.show();
      this.listView.previouslyFocusedElement = previouslyFocusedElement;
      return response;
    })
  }, {
    key: "promptForCookie",
    value: _asyncToGenerator(function* (options) {
      var cookie = yield this.promptForText("Cookie:");
      if (cookie === null) {
        return false;
      }

      if (options.requestHeaders === undefined) {
        options.requestHeaders = {};
      }
      options.requestHeaders.Cookie = cookie;
      options.xhrFactory = function () {
        var request = new _xmlhttprequest2["default"].XMLHttpRequest();
        // Disable protections against setting the Cookie header
        request.setDisableHeaderCheck(true);
        return request;
      };
      options.wsFactory = function (url, protocol) {
        // Authentication requires requests to appear to be same-origin
        var parsedUrl = new _url.URL(url);
        if (parsedUrl.protocol == "wss:") {
          parsedUrl.protocol = "https:";
        } else {
          parsedUrl.protocol = "http:";
        }
        var headers = { Cookie: cookie };
        var origin = parsedUrl.origin;
        var host = parsedUrl.host;
        return new _ws2["default"](url, protocol, { headers: headers, origin: origin, host: host });
      };
      return true;
    })
  }, {
    key: "promptForToken",
    value: _asyncToGenerator(function* (options) {
      var token = yield this.promptForText("Token:");
      if (token === null) {
        return false;
      }

      options.token = token;
      return true;
    })
  }, {
    key: "promptForCredentials",
    value: _asyncToGenerator(function* (options) {
      var _this2 = this;

      yield this.listView.selectListView.update({
        items: [{
          name: "Authenticate with a token",
          action: "token"
        }, {
          name: "Authenticate with a cookie",
          action: "cookie"
        }, {
          name: "Cancel",
          action: "cancel"
        }],
        infoMessage: "Connection to gateway failed. Your settings may be incorrect, the server may be unavailable, or you may lack sufficient privileges to complete the connection.",
        loadingMessage: null,
        emptyMessage: null
      });

      var action = yield new Promise(function (resolve, reject) {
        _this2.listView.onConfirmed = function (item) {
          return resolve(item.action);
        };
        _this2.listView.onCancelled = function () {
          return resolve("cancel");
        };
      });
      if (action === "token") {
        return yield this.promptForToken(options);
      }

      if (action === "cookie") {
        return yield this.promptForCookie(options);
      }

      // action === "cancel"
      this.listView.cancel();
      return false;
    })
  }, {
    key: "onGateway",
    value: _asyncToGenerator(function* (gatewayInfo) {
      var _this3 = this;

      this.listView.onConfirmed = null;
      yield this.listView.selectListView.update({
        items: [],
        infoMessage: null,
        loadingMessage: "Loading sessions...",
        emptyMessage: "No sessions available"
      });

      var gatewayOptions = Object.assign({
        xhrFactory: function xhrFactory() {
          return new _xmlhttprequest2["default"].XMLHttpRequest();
        },
        wsFactory: function wsFactory(url, protocol) {
          return new _ws2["default"](url, protocol);
        }
      }, gatewayInfo.options);

      var serverSettings = _jupyterlabServices.ServerConnection.makeSettings(gatewayOptions);
      var specModels = undefined;

      try {
        specModels = yield _jupyterlabServices.Kernel.getSpecs(serverSettings);
      } catch (error) {
        // The error types you get back at this stage are fairly opaque. In
        // particular, having invalid credentials typically triggers ECONNREFUSED
        // rather than 403 Forbidden. This does some basic checks and then assumes
        // that all remaining error types could be caused by invalid credentials.
        if (!error.xhr || !error.xhr.responseText) {
          throw error;
        } else if (error.xhr.responseText.includes("ETIMEDOUT")) {
          atom.notifications.addError("Connection to gateway failed");
          this.listView.cancel();
          return;
        } else {
          var promptSucceeded = yield this.promptForCredentials(gatewayOptions);
          if (!promptSucceeded) {
            return;
          }
          serverSettings = _jupyterlabServices.ServerConnection.makeSettings(gatewayOptions);
          yield this.listView.selectListView.update({
            items: [],
            infoMessage: null,
            loadingMessage: "Loading sessions...",
            emptyMessage: "No sessions available"
          });
        }
      }

      try {
        yield* (function* () {
          if (!specModels) {
            specModels = yield _jupyterlabServices.Kernel.getSpecs(serverSettings);
          }

          var kernelSpecs = _lodash2["default"].filter(specModels.kernelspecs, function (spec) {
            return _this3._kernelSpecFilter(spec);
          });

          var kernelNames = _lodash2["default"].map(kernelSpecs, function (specModel) {
            return specModel.name;
          });

          try {
            var sessionModels = yield _jupyterlabServices.Session.listRunning(serverSettings);
            sessionModels = sessionModels.filter(function (model) {
              var name = model.kernel ? model.kernel.name : null;
              return name ? kernelNames.includes(name) : true;
            });
            var items = sessionModels.map(function (model) {
              var name = undefined;
              if (model.path) {
                name = (0, _tildify2["default"])(model.path);
              } else if (model.notebook && model.notebook.path) {
                name = (0, _tildify2["default"])(model.notebook.path);
              } else {
                name = "Session " + model.id;
              }
              return { name: name, model: model, options: serverSettings };
            });
            items.unshift({
              name: "[new session]",
              model: null,
              options: serverSettings,
              kernelSpecs: kernelSpecs
            });
            _this3.listView.onConfirmed = _this3.onSession.bind(_this3, gatewayInfo.name);
            yield _this3.listView.selectListView.update({
              items: items,
              loadingMessage: null
            });
          } catch (error) {
            if (!error.xhr || error.xhr.status !== 403) throw error;
            // Gateways offer the option of never listing sessions, for security
            // reasons.
            // Assume this is the case and proceed to creating a new session.
            _this3.onSession(gatewayInfo.name, {
              name: "[new session]",
              model: null,
              options: serverSettings,
              kernelSpecs: kernelSpecs
            });
          }
        })();
      } catch (e) {
        atom.notifications.addError("Connection to gateway failed");
        this.listView.cancel();
      }
    })
  }, {
    key: "onSession",
    value: _asyncToGenerator(function* (gatewayName, sessionInfo) {
      var _this4 = this;

      if (!sessionInfo.model) {
        if (!sessionInfo.name) {
          yield this.listView.selectListView.update({
            items: [],
            errorMessage: "This gateway does not support listing sessions",
            loadingMessage: null,
            infoMessage: null
          });
        }
        var items = _lodash2["default"].map(sessionInfo.kernelSpecs, function (spec) {
          var options = {
            serverSettings: sessionInfo.options,
            kernelName: spec.name,
            path: _this4._path
          };
          return {
            name: spec.display_name,
            options: options
          };
        });

        this.listView.onConfirmed = this.startSession.bind(this, gatewayName);
        yield this.listView.selectListView.update({
          items: items,
          emptyMessage: "No kernel specs available",
          infoMessage: "Select a session",
          loadingMessage: null
        });
      } else {
        this.onSessionChosen(gatewayName, (yield _jupyterlabServices.Session.connectTo(sessionInfo.model.id, sessionInfo.options)));
      }
    })
  }, {
    key: "startSession",
    value: function startSession(gatewayName, sessionInfo) {
      _jupyterlabServices.Session.startNew(sessionInfo.options).then(this.onSessionChosen.bind(this, gatewayName));
    }
  }, {
    key: "onSessionChosen",
    value: _asyncToGenerator(function* (gatewayName, session) {
      this.listView.cancel();
      var kernelSpec = yield session.kernel.getSpec();
      if (!_store2["default"].grammar) return;

      var kernel = new _wsKernel2["default"](gatewayName, kernelSpec, _store2["default"].grammar, session);
      this._onChosen(kernel);
    })
  }]);

  return WSKernelPicker;
})();

exports["default"] = WSKernelPicker;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvd3Mta2VybmVsLXBpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OEJBRTJCLGtCQUFrQjs7OztzQkFDL0IsUUFBUTs7Ozt1QkFDRixTQUFTOzs7O29CQUNWLE1BQU07O2tCQUNWLElBQUk7Ozs7OEJBQ0gsZ0JBQWdCOzs7O21CQUNaLEtBQUs7O2tDQUN5QixzQkFBc0I7O3NCQUVyRCxVQUFVOzs7O3dCQUNSLGFBQWE7Ozs7eUJBQ1osY0FBYzs7OztxQkFDbEIsU0FBUzs7OztJQUVyQixjQUFjO0FBT1AsV0FQUCxjQUFjLEdBT0o7OzswQkFQVixjQUFjOztTQUNsQixXQUFXLEdBQWMsSUFBSTtTQUM3QixXQUFXLEdBQWMsSUFBSTs7QUFNM0IsUUFBSSxDQUFDLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7QUFDdkQsUUFBSSxDQUFDLGNBQWMsR0FBRyxnQ0FBbUI7QUFDdkMsb0JBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztBQUMvQixXQUFLLEVBQUUsRUFBRTtBQUNULHNCQUFnQixFQUFFLDBCQUFDLElBQUk7ZUFBSyxJQUFJLENBQUMsSUFBSTtPQUFBO0FBQ3JDLG9CQUFjLEVBQUUsd0JBQUMsSUFBSSxFQUFLO0FBQ3hCLFlBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsZUFBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2hDLGVBQU8sT0FBTyxDQUFDO09BQ2hCO0FBQ0QseUJBQW1CLEVBQUUsNkJBQUMsSUFBSSxFQUFLO0FBQzdCLFlBQUksTUFBSyxXQUFXLEVBQUUsTUFBSyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDOUM7QUFDRCx3QkFBa0IsRUFBRSw4QkFBTTtBQUN4QixjQUFLLE1BQU0sRUFBRSxDQUFDO0FBQ2QsWUFBSSxNQUFLLFdBQVcsRUFB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QUNIO0tBQ0Y7OztXQUVXLHNCQUFDLFdBQW1CLEVBQUUsV0FBZ0IsRUFBRTtBQUNsRCxrQ0FBUSxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDeEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUM3QyxDQUFDO0tBQ0g7Ozs2QkFFb0IsV0FBQyxXQUFtQixFQUFFLE9BQVksRUFBRTtBQUN2RCxVQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZCLFVBQU0sVUFBVSxHQUFHLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsRCxVQUFJLENBQUMsbUJBQU0sT0FBTyxFQUFFLE9BQU87O0FBRTNCLFVBQU0sTUFBTSxHQUFHLDBCQUNiLFdBQVcsRUFDWCxVQUFVLEVBQ1YsbUJBQU0sT0FBTyxFQUNiLE9BQU8sQ0FDUixDQUFDO0FBQ0YsVUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN4Qjs7O1NBdFRrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dzLWtlcm5lbC1waWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSBcImF0b20tc2VsZWN0LWxpc3RcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB0aWxkaWZ5IGZyb20gXCJ0aWxkaWZ5XCI7XG5pbXBvcnQgeyB2NCB9IGZyb20gXCJ1dWlkXCI7XG5pbXBvcnQgd3MgZnJvbSBcIndzXCI7XG5pbXBvcnQgeGhyIGZyb20gXCJ4bWxodHRwcmVxdWVzdFwiO1xuaW1wb3J0IHsgVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgS2VybmVsLCBTZXNzaW9uLCBTZXJ2ZXJDb25uZWN0aW9uIH0gZnJvbSBcIkBqdXB5dGVybGFiL3NlcnZpY2VzXCI7XG5cbmltcG9ydCBDb25maWcgZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgV1NLZXJuZWwgZnJvbSBcIi4vd3Mta2VybmVsXCI7XG5pbXBvcnQgSW5wdXRWaWV3IGZyb20gXCIuL2lucHV0LXZpZXdcIjtcbmltcG9ydCBzdG9yZSBmcm9tIFwiLi9zdG9yZVwiO1xuXG5jbGFzcyBDdXN0b21MaXN0VmlldyB7XG4gIG9uQ29uZmlybWVkOiA/RnVuY3Rpb24gPSBudWxsO1xuICBvbkNhbmNlbGxlZDogP0Z1bmN0aW9uID0gbnVsbDtcbiAgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50OiA/SFRNTEVsZW1lbnQ7XG4gIHNlbGVjdExpc3RWaWV3OiBTZWxlY3RMaXN0VmlldztcbiAgcGFuZWw6ID9hdG9tJFBhbmVsO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGl0ZW1zQ2xhc3NMaXN0OiBbXCJtYXJrLWFjdGl2ZVwiXSxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChpdGVtKSA9PiBpdGVtLm5hbWUsXG4gICAgICBlbGVtZW50Rm9ySXRlbTogKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9LFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMub25Db25maXJtZWQpIHRoaXMub25Db25maXJtZWQoaXRlbSk7XG4gICAgICB9LFxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgIGlmICh0aGlzLm9uQ2FuY2VsbGVkKSB0aGlzLm9uQ2FuY2VsbGVkKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICBpZiAoIXRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogdGhpcy5zZWxlY3RMaXN0VmlldyB9KTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5mb2N1cygpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNhbmNlbCgpO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgaWYgKHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXU0tlcm5lbFBpY2tlciB7XG4gIF9vbkNob3NlbjogKGtlcm5lbDogS2VybmVsKSA9PiB2b2lkO1xuICBfa2VybmVsU3BlY0ZpbHRlcjogKGtlcm5lbFNwZWM6IEtlcm5lbHNwZWMpID0+IGJvb2xlYW47XG4gIF9wYXRoOiBzdHJpbmc7XG4gIGxpc3RWaWV3OiBDdXN0b21MaXN0VmlldztcblxuICBjb25zdHJ1Y3RvcihvbkNob3NlbjogKGtlcm5lbDogS2VybmVsKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fb25DaG9zZW4gPSBvbkNob3NlbjtcbiAgICB0aGlzLmxpc3RWaWV3ID0gbmV3IEN1c3RvbUxpc3RWaWV3KCk7XG4gIH1cblxuICBhc3luYyB0b2dnbGUoX2tlcm5lbFNwZWNGaWx0ZXI6IChrZXJuZWxTcGVjOiBLZXJuZWxzcGVjKSA9PiBib29sZWFuKSB7XG4gICAgdGhpcy5saXN0Vmlldy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIHRoaXMuX2tlcm5lbFNwZWNGaWx0ZXIgPSBfa2VybmVsU3BlY0ZpbHRlcjtcbiAgICBjb25zdCBnYXRld2F5cyA9IENvbmZpZy5nZXRKc29uKFwiZ2F0ZXdheXNcIikgfHwgW107XG4gICAgaWYgKF8uaXNFbXB0eShnYXRld2F5cykpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIk5vIHJlbW90ZSBrZXJuZWwgZ2F0ZXdheXMgYXZhaWxhYmxlXCIsIHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJVc2UgdGhlIEh5ZHJvZ2VuIHBhY2thZ2Ugc2V0dGluZ3MgdG8gc3BlY2lmeSB0aGUgbGlzdCBvZiByZW1vdGUgc2VydmVycy4gSHlkcm9nZW4gY2FuIHVzZSByZW1vdGUga2VybmVscyBvbiBlaXRoZXIgYSBKdXB5dGVyIEtlcm5lbCBHYXRld2F5IG9yIEp1cHl0ZXIgbm90ZWJvb2sgc2VydmVyLlwiLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcGF0aCA9IGAke3N0b3JlLmZpbGVQYXRoIHx8IFwidW5zYXZlZFwifS0ke3Y0KCl9YDtcblxuICAgIHRoaXMubGlzdFZpZXcub25Db25maXJtZWQgPSB0aGlzLm9uR2F0ZXdheS5iaW5kKHRoaXMpO1xuXG4gICAgYXdhaXQgdGhpcy5saXN0Vmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgaXRlbXM6IGdhdGV3YXlzLFxuICAgICAgaW5mb01lc3NhZ2U6IFwiU2VsZWN0IGEgZ2F0ZXdheVwiLFxuICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIGdhdGV3YXlzIGF2YWlsYWJsZVwiLFxuICAgICAgbG9hZGluZ01lc3NhZ2U6IG51bGwsXG4gICAgfSk7XG5cbiAgICB0aGlzLmxpc3RWaWV3LnNob3coKTtcbiAgfVxuXG4gIGFzeW5jIHByb21wdEZvclRleHQocHJvbXB0OiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSB0aGlzLmxpc3RWaWV3LnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudDtcbiAgICB0aGlzLmxpc3RWaWV3LmNhbmNlbCgpO1xuXG4gICAgY29uc3QgaW5wdXRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXRWaWV3ID0gbmV3IElucHV0Vmlldyh7IHByb21wdCB9LCByZXNvbHZlKTtcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKGlucHV0Vmlldy5lbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjYW5jZWxcIjogKCkgPT4ge1xuICAgICAgICAgIGlucHV0Vmlldy5jbG9zZSgpO1xuICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBpbnB1dFZpZXcuYXR0YWNoKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgaW5wdXRQcm9taXNlO1xuICAgICAgaWYgKHJlc3BvbnNlID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEFzc3VtZSB0aGF0IG5vIHJlc3BvbnNlIHRvIHRoZSBwcm9tcHQgd2lsbCBjYW5jZWwgdGhlIGVudGlyZSBmbG93LCBzb1xuICAgIC8vIG9ubHkgcmVzdG9yZSBsaXN0VmlldyBpZiBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZFxuICAgIHRoaXMubGlzdFZpZXcuc2hvdygpO1xuICAgIHRoaXMubGlzdFZpZXcucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gcHJldmlvdXNseUZvY3VzZWRFbGVtZW50O1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIGFzeW5jIHByb21wdEZvckNvb2tpZShvcHRpb25zOiBhbnkpIHtcbiAgICBjb25zdCBjb29raWUgPSBhd2FpdCB0aGlzLnByb21wdEZvclRleHQoXCJDb29raWU6XCIpO1xuICAgIGlmIChjb29raWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yZXF1ZXN0SGVhZGVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zLnJlcXVlc3RIZWFkZXJzID0ge307XG4gICAgfVxuICAgIG9wdGlvbnMucmVxdWVzdEhlYWRlcnMuQ29va2llID0gY29va2llO1xuICAgIG9wdGlvbnMueGhyRmFjdG9yeSA9ICgpID0+IHtcbiAgICAgIGxldCByZXF1ZXN0ID0gbmV3IHhoci5YTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgLy8gRGlzYWJsZSBwcm90ZWN0aW9ucyBhZ2FpbnN0IHNldHRpbmcgdGhlIENvb2tpZSBoZWFkZXJcbiAgICAgIHJlcXVlc3Quc2V0RGlzYWJsZUhlYWRlckNoZWNrKHRydWUpO1xuICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfTtcbiAgICBvcHRpb25zLndzRmFjdG9yeSA9ICh1cmwsIHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBBdXRoZW50aWNhdGlvbiByZXF1aXJlcyByZXF1ZXN0cyB0byBhcHBlYXIgdG8gYmUgc2FtZS1vcmlnaW5cbiAgICAgIGxldCBwYXJzZWRVcmwgPSBuZXcgVVJMKHVybCk7XG4gICAgICBpZiAocGFyc2VkVXJsLnByb3RvY29sID09IFwid3NzOlwiKSB7XG4gICAgICAgIHBhcnNlZFVybC5wcm90b2NvbCA9IFwiaHR0cHM6XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRVcmwucHJvdG9jb2wgPSBcImh0dHA6XCI7XG4gICAgICB9XG4gICAgICBjb25zdCBoZWFkZXJzID0geyBDb29raWU6IGNvb2tpZSB9O1xuICAgICAgY29uc3Qgb3JpZ2luID0gcGFyc2VkVXJsLm9yaWdpbjtcbiAgICAgIGNvbnN0IGhvc3QgPSBwYXJzZWRVcmwuaG9zdDtcbiAgICAgIHJldHVybiBuZXcgd3ModXJsLCBwcm90b2NvbCwgeyBoZWFkZXJzLCBvcmlnaW4sIGhvc3QgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHByb21wdEZvclRva2VuKG9wdGlvbnM6IGFueSkge1xuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5wcm9tcHRGb3JUZXh0KFwiVG9rZW46XCIpO1xuICAgIGlmICh0b2tlbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9wdGlvbnMudG9rZW4gPSB0b2tlbjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHByb21wdEZvckNyZWRlbnRpYWxzKG9wdGlvbnM6IGFueSkge1xuICAgIGF3YWl0IHRoaXMubGlzdFZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIkF1dGhlbnRpY2F0ZSB3aXRoIGEgdG9rZW5cIixcbiAgICAgICAgICBhY3Rpb246IFwidG9rZW5cIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiQXV0aGVudGljYXRlIHdpdGggYSBjb29raWVcIixcbiAgICAgICAgICBhY3Rpb246IFwiY29va2llXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIkNhbmNlbFwiLFxuICAgICAgICAgIGFjdGlvbjogXCJjYW5jZWxcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBpbmZvTWVzc2FnZTpcbiAgICAgICAgXCJDb25uZWN0aW9uIHRvIGdhdGV3YXkgZmFpbGVkLiBZb3VyIHNldHRpbmdzIG1heSBiZSBpbmNvcnJlY3QsIHRoZSBzZXJ2ZXIgbWF5IGJlIHVuYXZhaWxhYmxlLCBvciB5b3UgbWF5IGxhY2sgc3VmZmljaWVudCBwcml2aWxlZ2VzIHRvIGNvbXBsZXRlIHRoZSBjb25uZWN0aW9uLlwiLFxuICAgICAgbG9hZGluZ01lc3NhZ2U6IG51bGwsXG4gICAgICBlbXB0eU1lc3NhZ2U6IG51bGwsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhY3Rpb24gPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxpc3RWaWV3Lm9uQ29uZmlybWVkID0gKGl0ZW0pID0+IHJlc29sdmUoaXRlbS5hY3Rpb24pO1xuICAgICAgdGhpcy5saXN0Vmlldy5vbkNhbmNlbGxlZCA9ICgpID0+IHJlc29sdmUoXCJjYW5jZWxcIik7XG4gICAgfSk7XG4gICAgaWYgKGFjdGlvbiA9PT0gXCJ0b2tlblwiKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5wcm9tcHRGb3JUb2tlbihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoYWN0aW9uID09PSBcImNvb2tpZVwiKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5wcm9tcHRGb3JDb29raWUob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gYWN0aW9uID09PSBcImNhbmNlbFwiXG4gICAgdGhpcy5saXN0Vmlldy5jYW5jZWwoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhc3luYyBvbkdhdGV3YXkoZ2F0ZXdheUluZm86IGFueSkge1xuICAgIHRoaXMubGlzdFZpZXcub25Db25maXJtZWQgPSBudWxsO1xuICAgIGF3YWl0IHRoaXMubGlzdFZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGluZm9NZXNzYWdlOiBudWxsLFxuICAgICAgbG9hZGluZ01lc3NhZ2U6IFwiTG9hZGluZyBzZXNzaW9ucy4uLlwiLFxuICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIHNlc3Npb25zIGF2YWlsYWJsZVwiLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2F0ZXdheU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge1xuICAgICAgICB4aHJGYWN0b3J5OiAoKSA9PiBuZXcgeGhyLlhNTEh0dHBSZXF1ZXN0KCksXG4gICAgICAgIHdzRmFjdG9yeTogKHVybCwgcHJvdG9jb2wpID0+IG5ldyB3cyh1cmwsIHByb3RvY29sKSxcbiAgICAgIH0sXG4gICAgICBnYXRld2F5SW5mby5vcHRpb25zXG4gICAgKTtcblxuICAgIGxldCBzZXJ2ZXJTZXR0aW5ncyA9IFNlcnZlckNvbm5lY3Rpb24ubWFrZVNldHRpbmdzKGdhdGV3YXlPcHRpb25zKTtcbiAgICBsZXQgc3BlY01vZGVscztcblxuICAgIHRyeSB7XG4gICAgICBzcGVjTW9kZWxzID0gYXdhaXQgS2VybmVsLmdldFNwZWNzKHNlcnZlclNldHRpbmdzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gVGhlIGVycm9yIHR5cGVzIHlvdSBnZXQgYmFjayBhdCB0aGlzIHN0YWdlIGFyZSBmYWlybHkgb3BhcXVlLiBJblxuICAgICAgLy8gcGFydGljdWxhciwgaGF2aW5nIGludmFsaWQgY3JlZGVudGlhbHMgdHlwaWNhbGx5IHRyaWdnZXJzIEVDT05OUkVGVVNFRFxuICAgICAgLy8gcmF0aGVyIHRoYW4gNDAzIEZvcmJpZGRlbi4gVGhpcyBkb2VzIHNvbWUgYmFzaWMgY2hlY2tzIGFuZCB0aGVuIGFzc3VtZXNcbiAgICAgIC8vIHRoYXQgYWxsIHJlbWFpbmluZyBlcnJvciB0eXBlcyBjb3VsZCBiZSBjYXVzZWQgYnkgaW52YWxpZCBjcmVkZW50aWFscy5cbiAgICAgIGlmICghZXJyb3IueGhyIHx8ICFlcnJvci54aHIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfSBlbHNlIGlmIChlcnJvci54aHIucmVzcG9uc2VUZXh0LmluY2x1ZGVzKFwiRVRJTUVET1VUXCIpKSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkNvbm5lY3Rpb24gdG8gZ2F0ZXdheSBmYWlsZWRcIik7XG4gICAgICAgIHRoaXMubGlzdFZpZXcuY2FuY2VsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHByb21wdFN1Y2NlZWRlZCA9IGF3YWl0IHRoaXMucHJvbXB0Rm9yQ3JlZGVudGlhbHMoZ2F0ZXdheU9wdGlvbnMpO1xuICAgICAgICBpZiAoIXByb21wdFN1Y2NlZWRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXJ2ZXJTZXR0aW5ncyA9IFNlcnZlckNvbm5lY3Rpb24ubWFrZVNldHRpbmdzKGdhdGV3YXlPcHRpb25zKTtcbiAgICAgICAgYXdhaXQgdGhpcy5saXN0Vmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICBpbmZvTWVzc2FnZTogbnVsbCxcbiAgICAgICAgICBsb2FkaW5nTWVzc2FnZTogXCJMb2FkaW5nIHNlc3Npb25zLi4uXCIsXG4gICAgICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIHNlc3Npb25zIGF2YWlsYWJsZVwiLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCFzcGVjTW9kZWxzKSB7XG4gICAgICAgIHNwZWNNb2RlbHMgPSBhd2FpdCBLZXJuZWwuZ2V0U3BlY3Moc2VydmVyU2V0dGluZ3MpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBrZXJuZWxTcGVjcyA9IF8uZmlsdGVyKHNwZWNNb2RlbHMua2VybmVsc3BlY3MsIChzcGVjKSA9PlxuICAgICAgICB0aGlzLl9rZXJuZWxTcGVjRmlsdGVyKHNwZWMpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBrZXJuZWxOYW1lcyA9IF8ubWFwKGtlcm5lbFNwZWNzLCAoc3BlY01vZGVsKSA9PiBzcGVjTW9kZWwubmFtZSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBzZXNzaW9uTW9kZWxzID0gYXdhaXQgU2Vzc2lvbi5saXN0UnVubmluZyhzZXJ2ZXJTZXR0aW5ncyk7XG4gICAgICAgIHNlc3Npb25Nb2RlbHMgPSBzZXNzaW9uTW9kZWxzLmZpbHRlcigobW9kZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwua2VybmVsID8gbW9kZWwua2VybmVsLm5hbWUgOiBudWxsO1xuICAgICAgICAgIHJldHVybiBuYW1lID8ga2VybmVsTmFtZXMuaW5jbHVkZXMobmFtZSkgOiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBzZXNzaW9uTW9kZWxzLm1hcCgobW9kZWwpID0+IHtcbiAgICAgICAgICBsZXQgbmFtZTtcbiAgICAgICAgICBpZiAobW9kZWwucGF0aCkge1xuICAgICAgICAgICAgbmFtZSA9IHRpbGRpZnkobW9kZWwucGF0aCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtb2RlbC5ub3RlYm9vayAmJiBtb2RlbC5ub3RlYm9vay5wYXRoKSB7XG4gICAgICAgICAgICBuYW1lID0gdGlsZGlmeShtb2RlbC5ub3RlYm9vay5wYXRoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmFtZSA9IGBTZXNzaW9uICR7bW9kZWwuaWR9YDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgbmFtZSwgbW9kZWwsIG9wdGlvbnM6IHNlcnZlclNldHRpbmdzIH07XG4gICAgICAgIH0pO1xuICAgICAgICBpdGVtcy51bnNoaWZ0KHtcbiAgICAgICAgICBuYW1lOiBcIltuZXcgc2Vzc2lvbl1cIixcbiAgICAgICAgICBtb2RlbDogbnVsbCxcbiAgICAgICAgICBvcHRpb25zOiBzZXJ2ZXJTZXR0aW5ncyxcbiAgICAgICAgICBrZXJuZWxTcGVjcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubGlzdFZpZXcub25Db25maXJtZWQgPSB0aGlzLm9uU2Vzc2lvbi5iaW5kKHRoaXMsIGdhdGV3YXlJbmZvLm5hbWUpO1xuICAgICAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgICAgaXRlbXM6IGl0ZW1zLFxuICAgICAgICAgIGxvYWRpbmdNZXNzYWdlOiBudWxsLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICghZXJyb3IueGhyIHx8IGVycm9yLnhoci5zdGF0dXMgIT09IDQwMykgdGhyb3cgZXJyb3I7XG4gICAgICAgIC8vIEdhdGV3YXlzIG9mZmVyIHRoZSBvcHRpb24gb2YgbmV2ZXIgbGlzdGluZyBzZXNzaW9ucywgZm9yIHNlY3VyaXR5XG4gICAgICAgIC8vIHJlYXNvbnMuXG4gICAgICAgIC8vIEFzc3VtZSB0aGlzIGlzIHRoZSBjYXNlIGFuZCBwcm9jZWVkIHRvIGNyZWF0aW5nIGEgbmV3IHNlc3Npb24uXG4gICAgICAgIHRoaXMub25TZXNzaW9uKGdhdGV3YXlJbmZvLm5hbWUsIHtcbiAgICAgICAgICBuYW1lOiBcIltuZXcgc2Vzc2lvbl1cIixcbiAgICAgICAgICBtb2RlbDogbnVsbCxcbiAgICAgICAgICBvcHRpb25zOiBzZXJ2ZXJTZXR0aW5ncyxcbiAgICAgICAgICBrZXJuZWxTcGVjcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiQ29ubmVjdGlvbiB0byBnYXRld2F5IGZhaWxlZFwiKTtcbiAgICAgIHRoaXMubGlzdFZpZXcuY2FuY2VsKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgb25TZXNzaW9uKGdhdGV3YXlOYW1lOiBzdHJpbmcsIHNlc3Npb25JbmZvOiBhbnkpIHtcbiAgICBpZiAoIXNlc3Npb25JbmZvLm1vZGVsKSB7XG4gICAgICBpZiAoIXNlc3Npb25JbmZvLm5hbWUpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5saXN0Vmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiVGhpcyBnYXRld2F5IGRvZXMgbm90IHN1cHBvcnQgbGlzdGluZyBzZXNzaW9uc1wiLFxuICAgICAgICAgIGxvYWRpbmdNZXNzYWdlOiBudWxsLFxuICAgICAgICAgIGluZm9NZXNzYWdlOiBudWxsLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGl0ZW1zID0gXy5tYXAoc2Vzc2lvbkluZm8ua2VybmVsU3BlY3MsIChzcGVjKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgc2VydmVyU2V0dGluZ3M6IHNlc3Npb25JbmZvLm9wdGlvbnMsXG4gICAgICAgICAga2VybmVsTmFtZTogc3BlYy5uYW1lLFxuICAgICAgICAgIHBhdGg6IHRoaXMuX3BhdGgsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogc3BlYy5kaXNwbGF5X25hbWUsXG4gICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmxpc3RWaWV3Lm9uQ29uZmlybWVkID0gdGhpcy5zdGFydFNlc3Npb24uYmluZCh0aGlzLCBnYXRld2F5TmFtZSk7XG4gICAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgIGl0ZW1zOiBpdGVtcyxcbiAgICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIGtlcm5lbCBzcGVjcyBhdmFpbGFibGVcIixcbiAgICAgICAgaW5mb01lc3NhZ2U6IFwiU2VsZWN0IGEgc2Vzc2lvblwiLFxuICAgICAgICBsb2FkaW5nTWVzc2FnZTogbnVsbCxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uU2Vzc2lvbkNob3NlbihcbiAgICAgICAgZ2F0ZXdheU5hbWUsXG4gICAgICAgIGF3YWl0IFNlc3Npb24uY29ubmVjdFRvKHNlc3Npb25JbmZvLm1vZGVsLmlkLCBzZXNzaW9uSW5mby5vcHRpb25zKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBzdGFydFNlc3Npb24oZ2F0ZXdheU5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IGFueSkge1xuICAgIFNlc3Npb24uc3RhcnROZXcoc2Vzc2lvbkluZm8ub3B0aW9ucykudGhlbihcbiAgICAgIHRoaXMub25TZXNzaW9uQ2hvc2VuLmJpbmQodGhpcywgZ2F0ZXdheU5hbWUpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIG9uU2Vzc2lvbkNob3NlbihnYXRld2F5TmFtZTogc3RyaW5nLCBzZXNzaW9uOiBhbnkpIHtcbiAgICB0aGlzLmxpc3RWaWV3LmNhbmNlbCgpO1xuICAgIGNvbnN0IGtlcm5lbFNwZWMgPSBhd2FpdCBzZXNzaW9uLmtlcm5lbC5nZXRTcGVjKCk7XG4gICAgaWYgKCFzdG9yZS5ncmFtbWFyKSByZXR1cm47XG5cbiAgICBjb25zdCBrZXJuZWwgPSBuZXcgV1NLZXJuZWwoXG4gICAgICBnYXRld2F5TmFtZSxcbiAgICAgIGtlcm5lbFNwZWMsXG4gICAgICBzdG9yZS5ncmFtbWFyLFxuICAgICAgc2Vzc2lvblxuICAgICk7XG4gICAgdGhpcy5fb25DaG9zZW4oa2VybmVsKTtcbiAgfVxufVxuIl19