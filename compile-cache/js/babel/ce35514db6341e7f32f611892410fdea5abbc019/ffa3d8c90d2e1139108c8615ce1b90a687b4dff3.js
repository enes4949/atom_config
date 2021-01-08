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

var _componentsWatchSidebar = require("./../components/watch-sidebar");

var _componentsWatchSidebar2 = _interopRequireDefault(_componentsWatchSidebar);

var WatchesPane = (function () {
  function WatchesPane(store) {
    _classCallCheck(this, WatchesPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Watch";
    };

    this.getURI = function () {
      return _utils.WATCHES_URI;
    };

    this.getDefaultLocation = function () {
      return "right";
    };

    this.getAllowedLocations = function () {
      return ["left", "right"];
    };

    this.element.classList.add("hydrogen");

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsWatchSidebar2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(WatchesPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();
      this.element.remove();
    }
  }]);

  return WatchesPane;
})();

exports["default"] = WatchesPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGFuZXMvd2F0Y2hlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVvQyxNQUFNOztxQkFFeEIsT0FBTzs7OztxQkFFaUIsWUFBWTs7c0NBRWxDLCtCQUErQjs7OztJQUU5QixXQUFXO0FBSW5CLFdBSlEsV0FBVyxDQUlsQixLQUFZLEVBQUU7MEJBSlAsV0FBVzs7U0FDOUIsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1NBQ3ZDLFFBQVEsR0FBRywrQkFBeUI7O1NBUXBDLFFBQVEsR0FBRzthQUFNLGdCQUFnQjtLQUFBOztTQUVqQyxNQUFNLEdBQUc7O0tBQWlCOztTQUUxQixrQkFBa0IsR0FBRzthQUFNLE9BQU87S0FBQTs7U0FFbEMsbUJBQW1CLEdBQUc7YUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7S0FBQTs7QUFYM0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUV2Qyw2QkFBYSx3RUFBUyxLQUFLLEVBQUUsS0FBSyxBQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDNUU7O2VBUmtCLFdBQVc7O1dBa0J2QixtQkFBRztBQUNSLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN2Qjs7O1NBckJrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BhbmVzL3dhdGNoZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyByZWFjdEZhY3RvcnksIFdBVENIRVNfVVJJIH0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcbmltcG9ydCB0eXBlb2Ygc3RvcmUgZnJvbSBcIi4uL3N0b3JlXCI7XG5pbXBvcnQgV2F0Y2hlcyBmcm9tIFwiLi8uLi9jb21wb25lbnRzL3dhdGNoLXNpZGViYXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0Y2hlc1BhbmUge1xuICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGlzcG9zZXIgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JlOiBzdG9yZSkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaHlkcm9nZW5cIik7XG5cbiAgICByZWFjdEZhY3RvcnkoPFdhdGNoZXMgc3RvcmU9e3N0b3JlfSAvPiwgdGhpcy5lbGVtZW50LCBudWxsLCB0aGlzLmRpc3Bvc2VyKTtcbiAgfVxuXG4gIGdldFRpdGxlID0gKCkgPT4gXCJIeWRyb2dlbiBXYXRjaFwiO1xuXG4gIGdldFVSSSA9ICgpID0+IFdBVENIRVNfVVJJO1xuXG4gIGdldERlZmF1bHRMb2NhdGlvbiA9ICgpID0+IFwicmlnaHRcIjtcblxuICBnZXRBbGxvd2VkTG9jYXRpb25zID0gKCkgPT4gW1wibGVmdFwiLCBcInJpZ2h0XCJdO1xuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kaXNwb3Nlci5kaXNwb3NlKCk7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuICB9XG59XG4iXX0=