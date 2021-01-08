Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _store = require("./../store");

var _store2 = _interopRequireDefault(_store);

var _codeManager = require("./../code-manager");

/**
 * @version 1.0.0
 *
 *
 * The Plugin API allows you to make Hydrogen awesome.
 * You will be able to interact with this class in your Hydrogen Plugin using
 * Atom's [Service API](http://blog.atom.io/2015/03/25/new-services-API.html).
 *
 * Take a look at our [Example Plugin](https://github.com/lgeiger/hydrogen-example-plugin)
 * and the [Atom Flight Manual](http://flight-manual.atom.io/hacking-atom/) for
 * learning how to interact with Hydrogen in your own plugin.
 *
 * @class HydrogenProvider
 */

var HydrogenProvider = (function () {
  function HydrogenProvider(_hydrogen) {
    _classCallCheck(this, HydrogenProvider);

    this._hydrogen = _hydrogen;
  }

  /*
   * Calls your callback when the kernel has changed.
   * @param {Function} Callback
   */

  _createClass(HydrogenProvider, [{
    key: "onDidChangeKernel",
    value: function onDidChangeKernel(callback) {
      this._hydrogen.emitter.on("did-change-kernel", function (kernel) {
        if (kernel) {
          return callback(kernel.getPluginWrapper());
        }
        return callback(null);
      });
    }

    /*
     * Get the `HydrogenKernel` of the currently active text editor.
     * @return {Class} `HydrogenKernel`
     */
  }, {
    key: "getActiveKernel",
    value: function getActiveKernel() {
      if (!_store2["default"].kernel) {
        var grammar = _store2["default"].editor ? _store2["default"].editor.getGrammar().name : "";
        throw new Error("No running kernel for grammar `" + grammar + "` found");
      }

      return _store2["default"].kernel.getPluginWrapper();
    }

    /*
     * Get the `atom$Range` that will run if `hydrogen:run-cell` is called.
     * `null` is returned if no active text editor.
     * @return {Class} `atom$Range`
     */
  }, {
    key: "getCellRange",
    value: function getCellRange(editor) {
      if (!_store2["default"].editor) return null;
      return (0, _codeManager.getCurrentCell)(_store2["default"].editor);
    }

    /*
     *--------
     */
  }]);

  return HydrogenProvider;
})();

exports["default"] = HydrogenProvider;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGx1Z2luLWFwaS9oeWRyb2dlbi1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUVrQixZQUFZOzs7OzJCQUdDLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlN0IsZ0JBQWdCO0FBR3hCLFdBSFEsZ0JBQWdCLENBR3ZCLFNBQWMsRUFBRTswQkFIVCxnQkFBZ0I7O0FBSWpDLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0dBQzVCOzs7Ozs7O2VBTGtCLGdCQUFnQjs7V0FXbEIsMkJBQUMsUUFBa0IsRUFBRTtBQUNwQyxVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxNQUFNLEVBQWM7QUFDbEUsWUFBSSxNQUFNLEVBQUU7QUFDVixpQkFBTyxRQUFRLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztTQUM1QztBQUNELGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3ZCLENBQUMsQ0FBQztLQUNKOzs7Ozs7OztXQU1jLDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxtQkFBTSxNQUFNLEVBQUU7QUFDakIsWUFBTSxPQUFPLEdBQUcsbUJBQU0sTUFBTSxHQUFHLG1CQUFNLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25FLGNBQU0sSUFBSSxLQUFLLHFDQUFvQyxPQUFPLGFBQVcsQ0FBQztPQUN2RTs7QUFFRCxhQUFPLG1CQUFNLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0tBQ3hDOzs7Ozs7Ozs7V0FPVyxzQkFBQyxNQUF3QixFQUFFO0FBQ3JDLFVBQUksQ0FBQyxtQkFBTSxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDL0IsYUFBTyxpQ0FBZSxtQkFBTSxNQUFNLENBQUMsQ0FBQztLQUNyQzs7Ozs7OztTQXpDa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BsdWdpbi1hcGkvaHlkcm9nZW4tcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vLi4vc3RvcmVcIjtcbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi8uLi9rZXJuZWxcIjtcbmltcG9ydCB0eXBlIFpNUUtlcm5lbCBmcm9tIFwiLi8uLi96bXEta2VybmVsLmpzXCI7XG5pbXBvcnQgeyBnZXRDdXJyZW50Q2VsbCB9IGZyb20gXCIuLy4uL2NvZGUtbWFuYWdlclwiO1xuLyoqXG4gKiBAdmVyc2lvbiAxLjAuMFxuICpcbiAqXG4gKiBUaGUgUGx1Z2luIEFQSSBhbGxvd3MgeW91IHRvIG1ha2UgSHlkcm9nZW4gYXdlc29tZS5cbiAqIFlvdSB3aWxsIGJlIGFibGUgdG8gaW50ZXJhY3Qgd2l0aCB0aGlzIGNsYXNzIGluIHlvdXIgSHlkcm9nZW4gUGx1Z2luIHVzaW5nXG4gKiBBdG9tJ3MgW1NlcnZpY2UgQVBJXShodHRwOi8vYmxvZy5hdG9tLmlvLzIwMTUvMDMvMjUvbmV3LXNlcnZpY2VzLUFQSS5odG1sKS5cbiAqXG4gKiBUYWtlIGEgbG9vayBhdCBvdXIgW0V4YW1wbGUgUGx1Z2luXShodHRwczovL2dpdGh1Yi5jb20vbGdlaWdlci9oeWRyb2dlbi1leGFtcGxlLXBsdWdpbilcbiAqIGFuZCB0aGUgW0F0b20gRmxpZ2h0IE1hbnVhbF0oaHR0cDovL2ZsaWdodC1tYW51YWwuYXRvbS5pby9oYWNraW5nLWF0b20vKSBmb3JcbiAqIGxlYXJuaW5nIGhvdyB0byBpbnRlcmFjdCB3aXRoIEh5ZHJvZ2VuIGluIHlvdXIgb3duIHBsdWdpbi5cbiAqXG4gKiBAY2xhc3MgSHlkcm9nZW5Qcm92aWRlclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIeWRyb2dlblByb3ZpZGVyIHtcbiAgX2h5ZHJvZ2VuOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoX2h5ZHJvZ2VuOiBhbnkpIHtcbiAgICB0aGlzLl9oeWRyb2dlbiA9IF9oeWRyb2dlbjtcbiAgfVxuXG4gIC8qXG4gICAqIENhbGxzIHlvdXIgY2FsbGJhY2sgd2hlbiB0aGUga2VybmVsIGhhcyBjaGFuZ2VkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDYWxsYmFja1xuICAgKi9cbiAgb25EaWRDaGFuZ2VLZXJuZWwoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5faHlkcm9nZW4uZW1pdHRlci5vbihcImRpZC1jaGFuZ2Uta2VybmVsXCIsIChrZXJuZWw6ID9LZXJuZWwpID0+IHtcbiAgICAgIGlmIChrZXJuZWwpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGtlcm5lbC5nZXRQbHVnaW5XcmFwcGVyKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICAgIH0pO1xuICB9XG5cbiAgLypcbiAgICogR2V0IHRoZSBgSHlkcm9nZW5LZXJuZWxgIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIHRleHQgZWRpdG9yLlxuICAgKiBAcmV0dXJuIHtDbGFzc30gYEh5ZHJvZ2VuS2VybmVsYFxuICAgKi9cbiAgZ2V0QWN0aXZlS2VybmVsKCkge1xuICAgIGlmICghc3RvcmUua2VybmVsKSB7XG4gICAgICBjb25zdCBncmFtbWFyID0gc3RvcmUuZWRpdG9yID8gc3RvcmUuZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lIDogXCJcIjtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gcnVubmluZyBrZXJuZWwgZm9yIGdyYW1tYXIgXFxgJHtncmFtbWFyfVxcYCBmb3VuZGApO1xuICAgIH1cblxuICAgIHJldHVybiBzdG9yZS5rZXJuZWwuZ2V0UGx1Z2luV3JhcHBlcigpO1xuICB9XG5cbiAgLypcbiAgICogR2V0IHRoZSBgYXRvbSRSYW5nZWAgdGhhdCB3aWxsIHJ1biBpZiBgaHlkcm9nZW46cnVuLWNlbGxgIGlzIGNhbGxlZC5cbiAgICogYG51bGxgIGlzIHJldHVybmVkIGlmIG5vIGFjdGl2ZSB0ZXh0IGVkaXRvci5cbiAgICogQHJldHVybiB7Q2xhc3N9IGBhdG9tJFJhbmdlYFxuICAgKi9cbiAgZ2V0Q2VsbFJhbmdlKGVkaXRvcjogP2F0b20kVGV4dEVkaXRvcikge1xuICAgIGlmICghc3RvcmUuZWRpdG9yKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gZ2V0Q3VycmVudENlbGwoc3RvcmUuZWRpdG9yKTtcbiAgfVxuXG4gIC8qXG4gICAqLS0tLS0tLS1cbiAgICovXG59XG4iXX0=