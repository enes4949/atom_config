Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exportNotebook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _fs = require("fs");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var dialog = require("electron").remote.dialog;

var _require = require("@nteract/commutable");

var stringifyNotebook = _require.stringifyNotebook;

function exportNotebook() {
  // TODO: Refactor to use promises, this is a bit "nested".
  var saveNotebook = function saveNotebook(filename) {
    if (!filename) {
      return;
    }
    var ext = path.extname(filename) === "" ? ".ipynb" : "";
    var fname = "" + filename + ext;
    (0, _fs.writeFile)(fname, stringifyNotebook(_store2["default"].notebook), function (err, data) {
      if (err) {
        atom.notifications.addError("Error saving file", {
          detail: err.message
        });
      } else {
        atom.notifications.addSuccess("Save successful", {
          detail: "Saved notebook as " + fname
        });
      }
    });
  };
  dialog.showSaveDialog(saveNotebook);
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvZXhwb3J0LW5vdGVib29rLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFVd0IsY0FBYzs7Ozs7O29CQVJoQixNQUFNOztJQUFoQixJQUFJOztrQkFDVSxJQUFJOztxQkFLWixTQUFTOzs7O0lBSG5CLE1BQU0sR0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFyQyxNQUFNOztlQUNnQixPQUFPLENBQUMscUJBQXFCLENBQUM7O0lBQXBELGlCQUFpQixZQUFqQixpQkFBaUI7O0FBSVYsU0FBUyxjQUFjLEdBQUc7O0FBRXZDLE1BQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFhLFFBQVEsRUFBRTtBQUN2QyxRQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBTztLQUNSO0FBQ0QsUUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUMxRCxRQUFNLEtBQUssUUFBTSxRQUFRLEdBQUcsR0FBRyxBQUFFLENBQUM7QUFDbEMsdUJBQVUsS0FBSyxFQUFFLGlCQUFpQixDQUFDLG1CQUFNLFFBQVEsQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUN2RSxVQUFJLEdBQUcsRUFBRTtBQUNQLFlBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFO0FBQy9DLGdCQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU87U0FDcEIsQ0FBQyxDQUFDO09BQ0osTUFBTTtBQUNMLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFO0FBQy9DLGdCQUFNLHlCQUF1QixLQUFLLEFBQUU7U0FDckMsQ0FBQyxDQUFDO09BQ0o7S0FDRixDQUFDLENBQUM7R0FDSixDQUFDO0FBQ0YsUUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztDQUNyQyIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2V4cG9ydC1ub3RlYm9vay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHdyaXRlRmlsZSB9IGZyb20gXCJmc1wiO1xuXG5jb25zdCB7IGRpYWxvZyB9ID0gcmVxdWlyZShcImVsZWN0cm9uXCIpLnJlbW90ZTtcbmNvbnN0IHsgc3RyaW5naWZ5Tm90ZWJvb2sgfSA9IHJlcXVpcmUoXCJAbnRlcmFjdC9jb21tdXRhYmxlXCIpO1xuXG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vc3RvcmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXhwb3J0Tm90ZWJvb2soKSB7XG4gIC8vIFRPRE86IFJlZmFjdG9yIHRvIHVzZSBwcm9taXNlcywgdGhpcyBpcyBhIGJpdCBcIm5lc3RlZFwiLlxuICBjb25zdCBzYXZlTm90ZWJvb2sgPSBmdW5jdGlvbiAoZmlsZW5hbWUpIHtcbiAgICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShmaWxlbmFtZSkgPT09IFwiXCIgPyBcIi5pcHluYlwiIDogXCJcIjtcbiAgICBjb25zdCBmbmFtZSA9IGAke2ZpbGVuYW1lfSR7ZXh0fWA7XG4gICAgd3JpdGVGaWxlKGZuYW1lLCBzdHJpbmdpZnlOb3RlYm9vayhzdG9yZS5ub3RlYm9vayksIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiRXJyb3Igc2F2aW5nIGZpbGVcIiwge1xuICAgICAgICAgIGRldGFpbDogZXJyLm1lc3NhZ2UsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJTYXZlIHN1Y2Nlc3NmdWxcIiwge1xuICAgICAgICAgIGRldGFpbDogYFNhdmVkIG5vdGVib29rIGFzICR7Zm5hbWV9YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGRpYWxvZy5zaG93U2F2ZURpYWxvZyhzYXZlTm90ZWJvb2spO1xufVxuIl19