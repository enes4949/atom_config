Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

exports.createResult = createResult;
exports.importResult = importResult;
exports.clearResult = clearResult;
exports.clearResults = clearResults;
exports.convertMarkdownToOutput = convertMarkdownToOutput;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _componentsResultView = require("./components/result-view");

var _componentsResultView2 = _interopRequireDefault(_componentsResultView);

var _panesOutputArea = require("./panes/output-area");

var _panesOutputArea2 = _interopRequireDefault(_panesOutputArea);

var _panesWatches = require("./panes/watches");

var _panesWatches2 = _interopRequireDefault(_panesWatches);

var _utils = require("./utils");

/**
 * Creates and renders a ResultView.
 *
 * @param {Object} store - Global Hydrogen Store
 * @param {atom$TextEditor} store.editor - TextEditor associated with the result.
 * @param {Kernel} store.kernel - Kernel to run code and associate with the result.
 * @param {MarkerStore} store.markers - MarkerStore that belongs to `store.editor`.
 * @param {Object} codeBlock - A Hydrogen Cell.
 * @param {String} codeBlock.code - Source string of the cell.
 * @param {Number} codeBlock.row - Row to display the result on.
 * @param {HydrogenCellType} codeBlock.cellType - Cell type of the cell.
 */

function createResult(_ref, _ref2) {
  var editor = _ref.editor;
  var kernel = _ref.kernel;
  var markers = _ref.markers;
  var code = _ref2.code;
  var row = _ref2.row;
  var cellType = _ref2.cellType;
  return (function () {
    if (!editor || !kernel || !markers) return;

    if (atom.workspace.getActivePaneItem() instanceof _panesWatches2["default"]) {
      kernel.watchesStore.run();
      return;
    }
    var globalOutputStore = atom.config.get("Hydrogen.outputAreaDefault") || atom.workspace.getPaneItems().find(function (item) {
      return item instanceof _panesOutputArea2["default"];
    }) ? kernel.outputStore : null;

    if (globalOutputStore) (0, _utils.openOrShowDock)(_utils.OUTPUT_AREA_URI);

    var _ref3 = new _componentsResultView2["default"](markers, kernel, editor, row, !globalOutputStore || cellType == "markdown");

    var outputStore = _ref3.outputStore;

    if (code.search(/[\S]/) != -1) {
      switch (cellType) {
        case "markdown":
          if (globalOutputStore) globalOutputStore.appendOutput(convertMarkdownToOutput(code));else outputStore.appendOutput(convertMarkdownToOutput(code));
          outputStore.appendOutput({ data: "ok", stream: "status" });
          break;
        case "codecell":
          kernel.execute(code, function (result) {
            outputStore.appendOutput(result);
            if (globalOutputStore) globalOutputStore.appendOutput(result);
          });
          break;
      }
    } else {
      outputStore.appendOutput({ data: "ok", stream: "status" });
    }
  })();
}

/**
 * Creates inline results from Kernel Responses without a tie to a kernel.
 *
 * @param {Store} store - Hydrogen store
 * @param {atom$TextEditor} store.editor - The editor to display the results in.
 * @param {MarkerStore} store.markers - Should almost always be the editor's `MarkerStore`
 * @param {Object} bundle - The bundle to display.
 * @param {Array<Object>} bundle.outputs - The Kernel Responses to display.
 * @param {Number} bundle.row - The editor row to display the results on.
 */

function importResult(_ref4, _ref5) {
  var editor = _ref4.editor;
  var markers = _ref4.markers;
  var outputs = _ref5.outputs;
  var row = _ref5.row;
  return (function () {
    if (!editor || !markers) return;

    var _ref6 = new _componentsResultView2["default"](markers, null, editor, row, true // Always show inline
    );

    var outputStore = _ref6.outputStore;

    for (var output of outputs) {
      outputStore.appendOutput(output);
    }
  })();
}

/**
 * Clears a ResultView or selection of ResultViews.
 * To select a result to clear, put your cursor on the row on the ResultView.
 * To select multiple ResultViews, select text starting on the row of
 * the first ResultView to remove all the way to text on the row of the
 * last ResultView to remove. *This must be one selection and
 * the last selection made*
 *
 * @param {Object} store - Global Hydrogen Store
 * @param {atom$TextEditor} store.editor - TextEditor associated with the ResultView.
 * @param {MarkerStore} store.markers - MarkerStore that belongs to `store.editor` and the ResultView.
 */

function clearResult(_ref7) {
  var editor = _ref7.editor;
  var markers = _ref7.markers;
  return (function () {
    if (!editor || !markers) return;

    var _editor$getLastSelection$getBufferRowRange = editor.getLastSelection().getBufferRowRange();

    var _editor$getLastSelection$getBufferRowRange2 = _slicedToArray(_editor$getLastSelection$getBufferRowRange, 2);

    var startRow = _editor$getLastSelection$getBufferRowRange2[0];
    var endRow = _editor$getLastSelection$getBufferRowRange2[1];

    for (var row = startRow; row <= endRow; row++) {
      markers.clearOnRow(row);
    }
  })();
}

/**
 * Clears all ResultViews of a MarkerStore.
 * It also clears the currect kernel results.
 *
 * @param {Object} store - Global Hydrogen Store
 * @param {Kernel} store.kernel - Kernel to clear outputs.
 * @param {MarkerStore} store.markers - MarkerStore to clear.
 */

function clearResults(_ref8) {
  var kernel = _ref8.kernel;
  var markers = _ref8.markers;
  return (function () {
    if (markers) markers.clear();
    if (!kernel) return;
    kernel.outputStore.clear();
  })();
}

/**
 * Converts a string of raw markdown to a display_data Kernel Response.
 * This allows for hydrogen to display markdown text as if is was any normal
 * result that came back from the kernel.
 *
 * @param {String} markdownString - A string of raw markdown code.
 * @return {Object} A fake display_data Kernel Response.
 */

function convertMarkdownToOutput(markdownString) {
  return {
    output_type: "display_data",
    data: {
      "text/markdown": markdownString
    },
    metadata: {}
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcmVzdWx0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29DQUN1QiwwQkFBMEI7Ozs7K0JBQzFCLHFCQUFxQjs7Ozs0QkFDcEIsaUJBQWlCOzs7O3FCQUNPLFNBQVM7Ozs7Ozs7Ozs7Ozs7OztBQWdCbEQsU0FBUyxZQUFZLENBQzFCLElBUUUsRUFDRixLQUk0RDtNQVoxRCxNQUFNLEdBRFIsSUFRRSxDQVBBLE1BQU07TUFDTixNQUFNLEdBRlIsSUFRRSxDQU5BLE1BQU07TUFDTixPQUFPLEdBSFQsSUFRRSxDQUxBLE9BQU87TUFPUCxJQUFJLEdBRE4sS0FJNEQsQ0FIMUQsSUFBSTtNQUNKLEdBQUcsR0FGTCxLQUk0RCxDQUYxRCxHQUFHO01BQ0gsUUFBUSxHQUhWLEtBSTRELENBRDFELFFBQVE7c0JBRVY7QUFDQSxRQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU87O0FBRTNDLFFBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxxQ0FBdUIsRUFBRTtBQUM3RCxZQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLGFBQU87S0FDUjtBQUNELFFBQU0saUJBQWlCLEdBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLElBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSTthQUFLLElBQUksd0NBQXNCO0tBQUEsQ0FBQyxHQUNwRSxNQUFNLENBQUMsV0FBVyxHQUNsQixJQUFJLENBQUM7O0FBRVgsUUFBSSxpQkFBaUIsRUFBRSxrREFBK0IsQ0FBQzs7Z0JBRS9CLHNDQUN0QixPQUFPLEVBQ1AsTUFBTSxFQUNOLE1BQU0sRUFDTixHQUFHLEVBQ0gsQ0FBQyxpQkFBaUIsSUFBSSxRQUFRLElB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RUFBRTtHQUNiLENBQUM7Q0FDSCIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3Jlc3VsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgUmVzdWx0VmlldyBmcm9tIFwiLi9jb21wb25lbnRzL3Jlc3VsdC12aWV3XCI7XG5pbXBvcnQgT3V0cHV0UGFuZSBmcm9tIFwiLi9wYW5lcy9vdXRwdXQtYXJlYVwiO1xuaW1wb3J0IFdhdGNoZXNQYW5lIGZyb20gXCIuL3BhbmVzL3dhdGNoZXNcIjtcbmltcG9ydCB7IE9VVFBVVF9BUkVBX1VSSSwgb3Blbk9yU2hvd0RvY2sgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSBNYXJrZXJTdG9yZSBmcm9tIFwiLi9zdG9yZS9tYXJrZXJzXCI7XG5cbi8qKlxuICogQ3JlYXRlcyBhbmQgcmVuZGVycyBhIFJlc3VsdFZpZXcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN0b3JlIC0gR2xvYmFsIEh5ZHJvZ2VuIFN0b3JlXG4gKiBAcGFyYW0ge2F0b20kVGV4dEVkaXRvcn0gc3RvcmUuZWRpdG9yIC0gVGV4dEVkaXRvciBhc3NvY2lhdGVkIHdpdGggdGhlIHJlc3VsdC5cbiAqIEBwYXJhbSB7S2VybmVsfSBzdG9yZS5rZXJuZWwgLSBLZXJuZWwgdG8gcnVuIGNvZGUgYW5kIGFzc29jaWF0ZSB3aXRoIHRoZSByZXN1bHQuXG4gKiBAcGFyYW0ge01hcmtlclN0b3JlfSBzdG9yZS5tYXJrZXJzIC0gTWFya2VyU3RvcmUgdGhhdCBiZWxvbmdzIHRvIGBzdG9yZS5lZGl0b3JgLlxuICogQHBhcmFtIHtPYmplY3R9IGNvZGVCbG9jayAtIEEgSHlkcm9nZW4gQ2VsbC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2RlQmxvY2suY29kZSAtIFNvdXJjZSBzdHJpbmcgb2YgdGhlIGNlbGwuXG4gKiBAcGFyYW0ge051bWJlcn0gY29kZUJsb2NrLnJvdyAtIFJvdyB0byBkaXNwbGF5IHRoZSByZXN1bHQgb24uXG4gKiBAcGFyYW0ge0h5ZHJvZ2VuQ2VsbFR5cGV9IGNvZGVCbG9jay5jZWxsVHlwZSAtIENlbGwgdHlwZSBvZiB0aGUgY2VsbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlc3VsdChcbiAge1xuICAgIGVkaXRvcixcbiAgICBrZXJuZWwsXG4gICAgbWFya2VycyxcbiAgfTogJFJlYWRPbmx5PHtcbiAgICBlZGl0b3I6ID9hdG9tJFRleHRFZGl0b3IsXG4gICAga2VybmVsOiA/S2VybmVsLFxuICAgIG1hcmtlcnM6ID9NYXJrZXJTdG9yZSxcbiAgfT4sXG4gIHtcbiAgICBjb2RlLFxuICAgIHJvdyxcbiAgICBjZWxsVHlwZSxcbiAgfTogeyBjb2RlOiBzdHJpbmcsIHJvdzogbnVtYmVyLCBjZWxsVHlwZTogSHlkcm9nZW5DZWxsVHlwZSB9XG4pIHtcbiAgaWYgKCFlZGl0b3IgfHwgIWtlcm5lbCB8fCAhbWFya2VycykgcmV0dXJuO1xuXG4gIGlmIChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpIGluc3RhbmNlb2YgV2F0Y2hlc1BhbmUpIHtcbiAgICBrZXJuZWwud2F0Y2hlc1N0b3JlLnJ1bigpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBnbG9iYWxPdXRwdXRTdG9yZSA9XG4gICAgYXRvbS5jb25maWcuZ2V0KFwiSHlkcm9nZW4ub3V0cHV0QXJlYURlZmF1bHRcIikgfHxcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5maW5kKChpdGVtKSA9PiBpdGVtIGluc3RhbmNlb2YgT3V0cHV0UGFuZSlcbiAgICAgID8ga2VybmVsLm91dHB1dFN0b3JlXG4gICAgICA6IG51bGw7XG5cbiAgaWYgKGdsb2JhbE91dHB1dFN0b3JlKSBvcGVuT3JTaG93RG9jayhPVVRQVVRfQVJFQV9VUkkpO1xuXG4gIGNvbnN0IHsgb3V0cHV0U3RvcmUgfSA9IG5ldyBSZXN1bHRWaWV3KFxuICAgIG1hcmtlcnMsXG4gICAga2VybmVsLFxuICAgIGVkaXRvcixcbiAgICByb3csXG4gICAgIWdsb2JhbE91dHB1dFN0b3JlIHx8IGNlbGxUeXBlID09IFwibWFya2Rvd25cIlxuICApO1xuICBpZiAoY29kZS5zZWFyY2goL1tcXFNdLykgIT0gLTEpIHtcbiAgICBzd2l0Y2ggKGNlbGxUeXBlKSB7XG4gICAgICBjYXNlIFwibWFya2Rvd25cIjpcbiAgICAgICAgaWYgKGdsb2JhbE91dHB1dFN0b3JlKVxuICAgICAgICAgIGdsb2JhbE91dHB1dFN0b3JlLmFwcGVuZE91dHB1dChjb252ZXJ0TWFya2Rvd25Ub091dHB1dChjb2RlKSk7XG4gICAgICAgIGVsc2Ugb3V0cHV0U3RvcmUuYXBwZW5kT3V0cHV0KGNvbnZlcnRNYXJrZG93blRvT3V0cHV0KGNvZGUpKTtcbiAgICAgICAgb3V0cHV0U3RvcmUuYXBwZW5kT3V0cHV0KHsgZGF0YTogXCJva1wiLCBzdHJlYW06IFwic3RhdHVzXCIgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNvZGVjZWxsXCI6XG4gICAgICAgIGtlcm5lbC5leGVjdXRlKGNvZGUsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICBvdXRwdXRTdG9yZS5hcHBlbmRPdXRwdXQocmVzdWx0KTtcbiAgICAgICAgICBpZiAoZ2xvYmFsT3V0cHV0U3RvcmUpIGdsb2JhbE91dHB1dFN0b3JlLmFwcGVuZE91dHB1dChyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dHB1dFN0b3JlLmFwcGVuZE91dHB1dCh7IGRhdGE6IFwib2tcIiwgc3RyZWFtOiBcInN0YXR1c1wiIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBpbmxpbmUgcmVzdWx0cyBmcm9tIEtlcm5lbCBSZXNwb25zZXMgd2l0aG91dCBhIHRpZSB0byBhIGtlcm5lbC5cbiAqXG4gKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIEh5ZHJvZ2VuIHN0b3JlXG4gKiBAcGFyYW0ge2F0b20kVGV4dEVkaXRvcn0gc3RvcmUuZWRpdG9yIC0gVGhlIGVkaXRvciB0byBkaXNwbGF5IHRoZSByZXN1bHRzIGluLlxuICogQHBhcmFtIHtNYXJrZXJTdG9yZX0gc3RvcmUubWFya2VycyAtIFNob3VsZCBhbG1vc3QgYWx3YXlzIGJlIHRoZSBlZGl0b3IncyBgTWFya2VyU3RvcmVgXG4gKiBAcGFyYW0ge09iamVjdH0gYnVuZGxlIC0gVGhlIGJ1bmRsZSB0byBkaXNwbGF5LlxuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBidW5kbGUub3V0cHV0cyAtIFRoZSBLZXJuZWwgUmVzcG9uc2VzIHRvIGRpc3BsYXkuXG4gKiBAcGFyYW0ge051bWJlcn0gYnVuZGxlLnJvdyAtIFRoZSBlZGl0b3Igcm93IHRvIGRpc3BsYXkgdGhlIHJlc3VsdHMgb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRSZXN1bHQoXG4gIHtcbiAgICBlZGl0b3IsXG4gICAgbWFya2VycyxcbiAgfToge1xuICAgIGVkaXRvcjogP2F0b20kVGV4dEVkaXRvcixcbiAgICBtYXJrZXJzOiA/TWFya2VyU3RvcmUsXG4gIH0sXG4gIHsgb3V0cHV0cywgcm93IH06IHsgb3V0cHV0czogQXJyYXk8T2JqZWN0Piwgcm93OiBudW1iZXIgfVxuKSB7XG4gIGlmICghZWRpdG9yIHx8ICFtYXJrZXJzKSByZXR1cm47XG5cbiAgY29uc3QgeyBvdXRwdXRTdG9yZSB9ID0gbmV3IFJlc3VsdFZpZXcoXG4gICAgbWFya2VycyxcbiAgICBudWxsLFxuICAgIGVkaXRvcixcbiAgICByb3csXG4gICAgdHJ1ZSAvLyBBbHdheXMgc2hvdyBpbmxpbmVcbiAgKTtcblxuICBmb3IgKGxldCBvdXRwdXQgb2Ygb3V0cHV0cykge1xuICAgIG91dHB1dFN0b3JlLmFwcGVuZE91dHB1dChvdXRwdXQpO1xuICB9XG59XG5cbi8qKlxuICogQ2xlYXJzIGEgUmVzdWx0VmlldyBvciBzZWxlY3Rpb24gb2YgUmVzdWx0Vmlld3MuXG4gKiBUbyBzZWxlY3QgYSByZXN1bHQgdG8gY2xlYXIsIHB1dCB5b3VyIGN1cnNvciBvbiB0aGUgcm93IG9uIHRoZSBSZXN1bHRWaWV3LlxuICogVG8gc2VsZWN0IG11bHRpcGxlIFJlc3VsdFZpZXdzLCBzZWxlY3QgdGV4dCBzdGFydGluZyBvbiB0aGUgcm93IG9mXG4gKiB0aGUgZmlyc3QgUmVzdWx0VmlldyB0byByZW1vdmUgYWxsIHRoZSB3YXkgdG8gdGV4dCBvbiB0aGUgcm93IG9mIHRoZVxuICogbGFzdCBSZXN1bHRWaWV3IHRvIHJlbW92ZS4gKlRoaXMgbXVzdCBiZSBvbmUgc2VsZWN0aW9uIGFuZFxuICogdGhlIGxhc3Qgc2VsZWN0aW9uIG1hZGUqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN0b3JlIC0gR2xvYmFsIEh5ZHJvZ2VuIFN0b3JlXG4gKiBAcGFyYW0ge2F0b20kVGV4dEVkaXRvcn0gc3RvcmUuZWRpdG9yIC0gVGV4dEVkaXRvciBhc3NvY2lhdGVkIHdpdGggdGhlIFJlc3VsdFZpZXcuXG4gKiBAcGFyYW0ge01hcmtlclN0b3JlfSBzdG9yZS5tYXJrZXJzIC0gTWFya2VyU3RvcmUgdGhhdCBiZWxvbmdzIHRvIGBzdG9yZS5lZGl0b3JgIGFuZCB0aGUgUmVzdWx0Vmlldy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUmVzdWx0KHtcbiAgZWRpdG9yLFxuICBtYXJrZXJzLFxufTogJFJlYWRPbmx5PHtcbiAgZWRpdG9yOiA/YXRvbSRUZXh0RWRpdG9yLFxuICBtYXJrZXJzOiA/TWFya2VyU3RvcmUsXG59Pikge1xuICBpZiAoIWVkaXRvciB8fCAhbWFya2VycykgcmV0dXJuO1xuICBjb25zdCBbc3RhcnRSb3csIGVuZFJvd10gPSBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldEJ1ZmZlclJvd1JhbmdlKCk7XG5cbiAgZm9yIChsZXQgcm93ID0gc3RhcnRSb3c7IHJvdyA8PSBlbmRSb3c7IHJvdysrKSB7XG4gICAgbWFya2Vycy5jbGVhck9uUm93KHJvdyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGVhcnMgYWxsIFJlc3VsdFZpZXdzIG9mIGEgTWFya2VyU3RvcmUuXG4gKiBJdCBhbHNvIGNsZWFycyB0aGUgY3VycmVjdCBrZXJuZWwgcmVzdWx0cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc3RvcmUgLSBHbG9iYWwgSHlkcm9nZW4gU3RvcmVcbiAqIEBwYXJhbSB7S2VybmVsfSBzdG9yZS5rZXJuZWwgLSBLZXJuZWwgdG8gY2xlYXIgb3V0cHV0cy5cbiAqIEBwYXJhbSB7TWFya2VyU3RvcmV9IHN0b3JlLm1hcmtlcnMgLSBNYXJrZXJTdG9yZSB0byBjbGVhci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUmVzdWx0cyh7XG4gIGtlcm5lbCxcbiAgbWFya2Vycyxcbn06ICRSZWFkT25seTx7XG4gIGtlcm5lbDogP0tlcm5lbCxcbiAgbWFya2VyczogP01hcmtlclN0b3JlLFxufT4pIHtcbiAgaWYgKG1hcmtlcnMpIG1hcmtlcnMuY2xlYXIoKTtcbiAgaWYgKCFrZXJuZWwpIHJldHVybjtcbiAga2VybmVsLm91dHB1dFN0b3JlLmNsZWFyKCk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBzdHJpbmcgb2YgcmF3IG1hcmtkb3duIHRvIGEgZGlzcGxheV9kYXRhIEtlcm5lbCBSZXNwb25zZS5cbiAqIFRoaXMgYWxsb3dzIGZvciBoeWRyb2dlbiB0byBkaXNwbGF5IG1hcmtkb3duIHRleHQgYXMgaWYgaXMgd2FzIGFueSBub3JtYWxcbiAqIHJlc3VsdCB0aGF0IGNhbWUgYmFjayBmcm9tIHRoZSBrZXJuZWwuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1hcmtkb3duU3RyaW5nIC0gQSBzdHJpbmcgb2YgcmF3IG1hcmtkb3duIGNvZGUuXG4gKiBAcmV0dXJuIHtPYmplY3R9IEEgZmFrZSBkaXNwbGF5X2RhdGEgS2VybmVsIFJlc3BvbnNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydE1hcmtkb3duVG9PdXRwdXQobWFya2Rvd25TdHJpbmc6IHN0cmluZykge1xuICByZXR1cm4ge1xuICAgIG91dHB1dF90eXBlOiBcImRpc3BsYXlfZGF0YVwiLFxuICAgIGRhdGE6IHtcbiAgICAgIFwidGV4dC9tYXJrZG93blwiOiBtYXJrZG93blN0cmluZyxcbiAgICB9LFxuICAgIG1ldGFkYXRhOiB7fSxcbiAgfTtcbn1cbiJdfQ==