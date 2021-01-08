Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("./../utils");

var _componentsInspector = require("./../components/inspector");

var _componentsInspector2 = _interopRequireDefault(_componentsInspector);

var InspectorPane = (function () {
  function InspectorPane(store) {
    _classCallCheck(this, InspectorPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Inspector";
    };

    this.getURI = function () {
      return _utils.INSPECTOR_URI;
    };

    this.getDefaultLocation = function () {
      return "bottom";
    };

    this.getAllowedLocations = function () {
      return ["bottom", "left", "right"];
    };

    this.element.classList.add("hydrogen", "inspector");

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsInspector2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(InspectorPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();
      this.element.remove();
    }
  }]);

  return InspectorPane;
})();

exports["default"] = InspectorPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGFuZXMvaW5zcGVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRW9DLE1BQU07O3FCQUV4QixPQUFPOzs7O3FCQUVtQixZQUFZOzttQ0FFbEMsMkJBQTJCOzs7O0lBRTVCLGFBQWE7QUFJckIsV0FKUSxhQUFhLENBSXBCLEtBQVksRUFBRTswQkFKUCxhQUFhOztTQUNoQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7U0FDdkMsUUFBUSxHQUFHLCtCQUF5Qjs7U0FhcEMsUUFBUSxHQUFHO2FBQU0sb0JBQW9CO0tBQUE7O1NBRXJDLE1BQU0sR0FBRzs7S0FBbUI7O1NBRTVCLGtCQUFrQixHQUFHO2FBQU0sUUFBUTtLQUFBOztTQUVuQyxtQkFBbUIsR0FBRzthQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7S0FBQTs7QUFoQnJELFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7O0FBRXBELDZCQUNFLHFFQUFXLEtBQUssRUFBRSxLQUFLLEFBQUMsR0FBRyxFQUMzQixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksRUFDSixJQUFJLENBQUMsUUFBUSxDQUNkLENBQUM7R0FDSDs7ZUFia0IsYUFBYTs7V0F1QnpCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3ZCOzs7U0ExQmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGFuZXMvaW5zcGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IHsgcmVhY3RGYWN0b3J5LCBJTlNQRUNUT1JfVVJJIH0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcbmltcG9ydCB0eXBlb2Ygc3RvcmUgZnJvbSBcIi4uL3N0b3JlXCI7XG5pbXBvcnQgSW5zcGVjdG9yIGZyb20gXCIuLy4uL2NvbXBvbmVudHMvaW5zcGVjdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluc3BlY3RvclBhbmUge1xuICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGlzcG9zZXIgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JlOiBzdG9yZSkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaHlkcm9nZW5cIiwgXCJpbnNwZWN0b3JcIik7XG5cbiAgICByZWFjdEZhY3RvcnkoXG4gICAgICA8SW5zcGVjdG9yIHN0b3JlPXtzdG9yZX0gLz4sXG4gICAgICB0aGlzLmVsZW1lbnQsXG4gICAgICBudWxsLFxuICAgICAgdGhpcy5kaXNwb3NlclxuICAgICk7XG4gIH1cblxuICBnZXRUaXRsZSA9ICgpID0+IFwiSHlkcm9nZW4gSW5zcGVjdG9yXCI7XG5cbiAgZ2V0VVJJID0gKCkgPT4gSU5TUEVDVE9SX1VSSTtcblxuICBnZXREZWZhdWx0TG9jYXRpb24gPSAoKSA9PiBcImJvdHRvbVwiO1xuXG4gIGdldEFsbG93ZWRMb2NhdGlvbnMgPSAoKSA9PiBbXCJib3R0b21cIiwgXCJsZWZ0XCIsIFwicmlnaHRcIl07XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRpc3Bvc2VyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gIH1cbn1cbiJdfQ==