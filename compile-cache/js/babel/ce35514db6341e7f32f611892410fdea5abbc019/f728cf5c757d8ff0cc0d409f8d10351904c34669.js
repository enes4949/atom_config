Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.provideAutocompleteResults = provideAutocompleteResults;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _anser = require("anser");

var _utils = require("../../utils");

var iconHTML = "<img src='" + __dirname + "/../../../static/logo.svg' style='width: 100%;'>";

var regexes = {
  // pretty dodgy, adapted from http://stackoverflow.com/a/8396658
  r: /([^\d\W]|[.])[\w.$]*$/,

  // adapted from http://stackoverflow.com/q/5474008
  python: /([^\d\W]|[\u00A0-\uFFFF])[\w.\u00A0-\uFFFF]*$/,

  // adapted from http://php.net/manual/en/language.variables.basics.php
  php: /[$a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/
};

function parseCompletions(results, prefix) {
  var matches = results.matches;
  var metadata = results.metadata;

  // @NOTE: This can make invalid `replacedPrefix` and `replacedText` when a line includes unicode characters
  // @TODO (@aviatesk): Use `Regex` to detect them regardless of the `results.cursor_*` feedbacks from kernels
  var cursor_start = (0, _utils.char_idx_to_js_idx)(results.cursor_start, prefix);
  var cursor_end = (0, _utils.char_idx_to_js_idx)(results.cursor_end, prefix);

  if (metadata && metadata._jupyter_types_experimental) {
    var comps = metadata._jupyter_types_experimental;
    if (comps.length > 0 && comps[0].text) {
      return _lodash2["default"].map(comps, function (match) {
        var text = match.text;
        var start = match.start && match.end ? match.start : cursor_start;
        var end = match.start && match.end ? match.end : cursor_end;
        var replacementPrefix = prefix.slice(start, end);
        var replacedText = prefix.slice(0, start) + text;
        var type = match.type;
        return {
          text: text,
          replacementPrefix: replacementPrefix,
          replacedText: replacedText,
          iconHTML: !type || type === "<unknown>" ? iconHTML : undefined,
          type: type
        };
      });
    }
  }

  var replacementPrefix = prefix.slice(cursor_start, cursor_end);

  return _lodash2["default"].map(matches, function (match) {
    var text = match;
    var replacedText = prefix.slice(0, cursor_start) + text;
    return {
      text: text,
      replacementPrefix: replacementPrefix,
      replacedText: replacedText,
      iconHTML: iconHTML
    };
  });
}

function provideAutocompleteResults(store) {
  var autocompleteProvider = {
    enabled: atom.config.get("Hydrogen.autocomplete"),

    selector: ".source",
    disableForSelector: ".comment",

    // The default provider has an inclusion priority of 0.
    inclusionPriority: 1,

    // The default provider has a suggestion priority of 1.
    suggestionPriority: atom.config.get("Hydrogen.autocompleteSuggestionPriority"),

    // It won't suppress providers with lower priority.
    excludeLowerPriority: false,

    suggestionDetailsEnabled: atom.config.get("Hydrogen.showInspectorResultsInAutocomplete"),

    // Required: Return a promise, an array of suggestions, or null.
    getSuggestions: function getSuggestions(_ref) {
      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var prefix = _ref.prefix;

      if (!this.enabled) return null;

      var kernel = store.kernel;
      if (!kernel || kernel.executionState !== "idle") return null;

      var line = editor.getTextInBufferRange([[bufferPosition.row, 0], bufferPosition]);

      var regex = regexes[kernel.language];
      if (regex) {
        prefix = _lodash2["default"].head(line.match(regex)) || "";
      } else {
        prefix = line;
      }

      // return if cursor is at whitespace
      if (prefix.trimRight().length < prefix.length) return null;

      var minimumWordLength = atom.config.get("autocomplete-plus.minimumWordLength");
      if (typeof minimumWordLength !== "number") {
        minimumWordLength = 3;
      }

      if (prefix.trim().length < minimumWordLength) return null;

      (0, _utils.log)("autocompleteProvider: request:", line, bufferPosition, prefix);

      var promise = new Promise(function (resolve) {
        kernel.complete(prefix, function (results) {
          return resolve(parseCompletions(results, prefix));
        });
      });

      return Promise.race([promise, this.timeout()]);
    },

    getSuggestionDetailsOnSelect: function getSuggestionDetailsOnSelect(_ref2) {
      var text = _ref2.text;
      var replacementPrefix = _ref2.replacementPrefix;
      var replacedText = _ref2.replacedText;
      var iconHTML = _ref2.iconHTML;
      var type = _ref2.type;

      if (!this.suggestionDetailsEnabled) return null;

      var kernel = store.kernel;
      if (!kernel || kernel.executionState !== "idle") return null;

      var promise = new Promise(function (resolve) {
        kernel.inspect(replacedText, replacedText.length, function (_ref3) {
          var found = _ref3.found;
          var data = _ref3.data;

          if (!found || !data["text/plain"]) {
            resolve(null);
            return;
          }
          var description = (0, _anser.ansiToText)(data["text/plain"]);
          resolve({
            text: text,
            replacementPrefix: replacementPrefix,
            replacedText: replacedText,
            iconHTML: iconHTML,
            type: type,
            description: description
          });
        });
      });

      return Promise.race([promise, this.timeout()]);
    },

    timeout: function timeout() {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(null);
        }, 1000);
      });
    }
  };

  store.subscriptions.add(atom.config.observe("Hydrogen.autocomplete", function (v) {
    autocompleteProvider.enabled = v;
  }), atom.config.observe("Hydrogen.autocompleteSuggestionPriority", function (v) {
    autocompleteProvider.suggestionPriority = v;
  }), atom.config.observe("Hydrogen.showInspectorResultsInAutocomplete", function (v) {
    autocompleteProvider.suggestionDetailsEnabled = v;
  }));

  return autocompleteProvider;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc2VydmljZXMvcHJvdmlkZWQvYXV0b2NvbXBsZXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7c0JBRWMsUUFBUTs7OztxQkFDSyxPQUFPOztxQkFFTSxhQUFhOztBQWlCckQsSUFBTSxRQUFRLGtCQUFnQixTQUFTLHFEQUFrRCxDQUFDOztBQUUxRixJQUFNLE9BQU8sR0FBRzs7QUFFZCxHQUFDLEVBQUUsdUJBQXVCOzs7QUFHMUIsUUFBTSxFQUFFLCtDQUErQzs7O0FBR3ZELEtBQUcsRUFBRSw0Q0FBNEM7Q0FDbEQsQ0FBQzs7QUFFRixTQUFTLGdCQUFnQixDQUFDLE9BQXNCLEVBQUUsTUFBYyxFQUFFO01BQ3hELE9BQU8sR0FBZSxPQUFPLENBQTdCLE9BQU87TUFBRSxRQUFRLEdBQUssT0FBTyxDQUFwQixRQUFROzs7O0FBR3pCLE1BQU0sWUFBWSxHQUFHLCtCQUFtQixPQUFPLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RFLE1BQU0sVUFBVSxHQUFHLCtCQUFtQixPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVsRSxNQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsMkJBQTJCLEVBQUU7QUFDcEQsUUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLDJCQUEyQixDQUFDO0FBQ25ELFFBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUNyQyxhQUFPLG9CQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDN0IsWUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN4QixZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7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Q0FBQyxHQUFHLENBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ2xELHdCQUFvQixDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7R0FDbEMsQ0FBQyxFQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlDQUF5QyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ3BFLHdCQUFvQixDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztHQUM3QyxDQUFDLEVBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNkNBQTZDLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDeEUsd0JBQW9CLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDO0dBQ25ELENBQUMsQ0FDSCxDQUFDOztBQUVGLFNBQU8sb0JBQW9CLENBQUM7Q0FDN0IiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9wcm92aWRlZC9hdXRvY29tcGxldGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBhbnNpVG9UZXh0IH0gZnJvbSBcImFuc2VyXCI7XG5cbmltcG9ydCB7IGxvZywgY2hhcl9pZHhfdG9fanNfaWR4IH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IFN0b3JlIH0gZnJvbSBcIi4uLy4uL3N0b3JlXCI7XG5cbnR5cGUgQ29tcGxldGVSZXBseSA9IHtcbiAgbWF0Y2hlczogQXJyYXk8c3RyaW5nPixcbiAgY3Vyc29yX3N0YXJ0OiBudW1iZXIsXG4gIGN1cnNvcl9lbmQ6IG51bWJlcixcbiAgbWV0YWRhdGE/OiB7XG4gICAgX2p1cHl0ZXJfdHlwZXNfZXhwZXJpbWVudGFsPzogQXJyYXk8e1xuICAgICAgc3RhcnQ/OiBudW1iZXIsXG4gICAgICBlbmQ/OiBudW1iZXIsXG4gICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICB0eXBlPzogc3RyaW5nLFxuICAgIH0+LFxuICB9LFxufTtcblxuY29uc3QgaWNvbkhUTUwgPSBgPGltZyBzcmM9JyR7X19kaXJuYW1lfS8uLi8uLi8uLi9zdGF0aWMvbG9nby5zdmcnIHN0eWxlPSd3aWR0aDogMTAwJTsnPmA7XG5cbmNvbnN0IHJlZ2V4ZXMgPSB7XG4gIC8vIHByZXR0eSBkb2RneSwgYWRhcHRlZCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzgzOTY2NThcbiAgcjogLyhbXlxcZFxcV118Wy5dKVtcXHcuJF0qJC8sXG5cbiAgLy8gYWRhcHRlZCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xLzU0NzQwMDhcbiAgcHl0aG9uOiAvKFteXFxkXFxXXXxbXFx1MDBBMC1cXHVGRkZGXSlbXFx3LlxcdTAwQTAtXFx1RkZGRl0qJC8sXG5cbiAgLy8gYWRhcHRlZCBmcm9tIGh0dHA6Ly9waHAubmV0L21hbnVhbC9lbi9sYW5ndWFnZS52YXJpYWJsZXMuYmFzaWNzLnBocFxuICBwaHA6IC9bJGEtekEtWl9cXHg3Zi1cXHhmZl1bYS16QS1aMC05X1xceDdmLVxceGZmXSokLyxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlQ29tcGxldGlvbnMocmVzdWx0czogQ29tcGxldGVSZXBseSwgcHJlZml4OiBzdHJpbmcpIHtcbiAgY29uc3QgeyBtYXRjaGVzLCBtZXRhZGF0YSB9ID0gcmVzdWx0cztcbiAgLy8gQE5PVEU6IFRoaXMgY2FuIG1ha2UgaW52YWxpZCBgcmVwbGFjZWRQcmVmaXhgIGFuZCBgcmVwbGFjZWRUZXh0YCB3aGVuIGEgbGluZSBpbmNsdWRlcyB1bmljb2RlIGNoYXJhY3RlcnNcbiAgLy8gQFRPRE8gKEBhdmlhdGVzayk6IFVzZSBgUmVnZXhgIHRvIGRldGVjdCB0aGVtIHJlZ2FyZGxlc3Mgb2YgdGhlIGByZXN1bHRzLmN1cnNvcl8qYCBmZWVkYmFja3MgZnJvbSBrZXJuZWxzXG4gIGNvbnN0IGN1cnNvcl9zdGFydCA9IGNoYXJfaWR4X3RvX2pzX2lkeChyZXN1bHRzLmN1cnNvcl9zdGFydCwgcHJlZml4KTtcbiAgY29uc3QgY3Vyc29yX2VuZCA9IGNoYXJfaWR4X3RvX2pzX2lkeChyZXN1bHRzLmN1cnNvcl9lbmQsIHByZWZpeCk7XG5cbiAgaWYgKG1ldGFkYXRhICYmIG1ldGFkYXRhLl9qdXB5dGVyX3R5cGVzX2V4cGVyaW1lbnRhbCkge1xuICAgIGNvbnN0IGNvbXBzID0gbWV0YWRhdGEuX2p1cHl0ZXJfdHlwZXNfZXhwZXJpbWVudGFsO1xuICAgIGlmIChjb21wcy5sZW5ndGggPiAwICYmIGNvbXBzWzBdLnRleHQpIHtcbiAgICAgIHJldHVybiBfLm1hcChjb21wcywgKG1hdGNoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBtYXRjaC50ZXh0O1xuICAgICAgICBjb25zdCBzdGFydCA9IG1hdGNoLnN0YXJ0ICYmIG1hdGNoLmVuZCA/IG1hdGNoLnN0YXJ0IDogY3Vyc29yX3N0YXJ0O1xuICAgICAgICBjb25zdCBlbmQgPSBtYXRjaC5zdGFydCAmJiBtYXRjaC5lbmQgPyBtYXRjaC5lbmQgOiBjdXJzb3JfZW5kO1xuICAgICAgICBjb25zdCByZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeC5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgICAgY29uc3QgcmVwbGFjZWRUZXh0ID0gcHJlZml4LnNsaWNlKDAsIHN0YXJ0KSArIHRleHQ7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBtYXRjaC50eXBlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRleHQsXG4gICAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXgsXG4gICAgICAgICAgcmVwbGFjZWRUZXh0LFxuICAgICAgICAgIGljb25IVE1MOiAhdHlwZSB8fCB0eXBlID09PSBcIjx1bmtub3duPlwiID8gaWNvbkhUTUwgOiB1bmRlZmluZWQsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlcGxhY2VtZW50UHJlZml4ID0gcHJlZml4LnNsaWNlKGN1cnNvcl9zdGFydCwgY3Vyc29yX2VuZCk7XG5cbiAgcmV0dXJuIF8ubWFwKG1hdGNoZXMsIChtYXRjaCkgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBtYXRjaDtcbiAgICBjb25zdCByZXBsYWNlZFRleHQgPSBwcmVmaXguc2xpY2UoMCwgY3Vyc29yX3N0YXJ0KSArIHRleHQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQsXG4gICAgICByZXBsYWNlbWVudFByZWZpeCxcbiAgICAgIHJlcGxhY2VkVGV4dCxcbiAgICAgIGljb25IVE1MLFxuICAgIH07XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUF1dG9jb21wbGV0ZVJlc3VsdHMoXG4gIHN0b3JlOiBTdG9yZVxuKTogYXRvbSRBdXRvY29tcGxldGVQcm92aWRlciB7XG4gIGNvbnN0IGF1dG9jb21wbGV0ZVByb3ZpZGVyID0ge1xuICAgIGVuYWJsZWQ6IGF0b20uY29uZmlnLmdldChcIkh5ZHJvZ2VuLmF1dG9jb21wbGV0ZVwiKSxcblxuICAgIHNlbGVjdG9yOiBcIi5zb3VyY2VcIixcbiAgICBkaXNhYmxlRm9yU2VsZWN0b3I6IFwiLmNvbW1lbnRcIixcblxuICAgIC8vIFRoZSBkZWZhdWx0IHByb3ZpZGVyIGhhcyBhbiBpbmNsdXNpb24gcHJpb3JpdHkgb2YgMC5cbiAgICBpbmNsdXNpb25Qcmlvcml0eTogMSxcblxuICAgIC8vIFRoZSBkZWZhdWx0IHByb3ZpZGVyIGhhcyBhIHN1Z2dlc3Rpb24gcHJpb3JpdHkgb2YgMS5cbiAgICBzdWdnZXN0aW9uUHJpb3JpdHk6IGF0b20uY29uZmlnLmdldChcbiAgICAgIFwiSHlkcm9nZW4uYXV0b2NvbXBsZXRlU3VnZ2VzdGlvblByaW9yaXR5XCJcbiAgICApLFxuXG4gICAgLy8gSXQgd29uJ3Qgc3VwcHJlc3MgcHJvdmlkZXJzIHdpdGggbG93ZXIgcHJpb3JpdHkuXG4gICAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IGZhbHNlLFxuXG4gICAgc3VnZ2VzdGlvbkRldGFpbHNFbmFibGVkOiBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICBcIkh5ZHJvZ2VuLnNob3dJbnNwZWN0b3JSZXN1bHRzSW5BdXRvY29tcGxldGVcIlxuICAgICksXG5cbiAgICAvLyBSZXF1aXJlZDogUmV0dXJuIGEgcHJvbWlzZSwgYW4gYXJyYXkgb2Ygc3VnZ2VzdGlvbnMsIG9yIG51bGwuXG4gICAgZ2V0U3VnZ2VzdGlvbnMoeyBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBwcmVmaXggfSkge1xuICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpIHJldHVybiBudWxsO1xuXG4gICAgICBjb25zdCBrZXJuZWwgPSBzdG9yZS5rZXJuZWw7XG4gICAgICBpZiAoIWtlcm5lbCB8fCBrZXJuZWwuZXhlY3V0aW9uU3RhdGUgIT09IFwiaWRsZVwiKSByZXR1cm4gbnVsbDtcblxuICAgICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbXG4gICAgICAgIFtidWZmZXJQb3NpdGlvbi5yb3csIDBdLFxuICAgICAgICBidWZmZXJQb3NpdGlvbixcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCByZWdleCA9IHJlZ2V4ZXNba2VybmVsLmxhbmd1YWdlXTtcbiAgICAgIGlmIChyZWdleCkge1xuICAgICAgICBwcmVmaXggPSBfLmhlYWQobGluZS5tYXRjaChyZWdleCkpIHx8IFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmVmaXggPSBsaW5lO1xuICAgICAgfVxuXG4gICAgICAvLyByZXR1cm4gaWYgY3Vyc29yIGlzIGF0IHdoaXRlc3BhY2VcbiAgICAgIGlmIChwcmVmaXgudHJpbVJpZ2h0KCkubGVuZ3RoIDwgcHJlZml4Lmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cbiAgICAgIGxldCBtaW5pbXVtV29yZExlbmd0aCA9IGF0b20uY29uZmlnLmdldChcbiAgICAgICAgXCJhdXRvY29tcGxldGUtcGx1cy5taW5pbXVtV29yZExlbmd0aFwiXG4gICAgICApO1xuICAgICAgaWYgKHR5cGVvZiBtaW5pbXVtV29yZExlbmd0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICBtaW5pbXVtV29yZExlbmd0aCA9IDM7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmVmaXgudHJpbSgpLmxlbmd0aCA8IG1pbmltdW1Xb3JkTGVuZ3RoKSByZXR1cm4gbnVsbDtcblxuICAgICAgbG9nKFwiYXV0b2NvbXBsZXRlUHJvdmlkZXI6IHJlcXVlc3Q6XCIsIGxpbmUsIGJ1ZmZlclBvc2l0aW9uLCBwcmVmaXgpO1xuXG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAga2VybmVsLmNvbXBsZXRlKHByZWZpeCwgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwYXJzZUNvbXBsZXRpb25zKHJlc3VsdHMsIHByZWZpeCkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtwcm9taXNlLCB0aGlzLnRpbWVvdXQoKV0pO1xuICAgIH0sXG5cbiAgICBnZXRTdWdnZXN0aW9uRGV0YWlsc09uU2VsZWN0KHtcbiAgICAgIHRleHQsXG4gICAgICByZXBsYWNlbWVudFByZWZpeCxcbiAgICAgIHJlcGxhY2VkVGV4dCxcbiAgICAgIGljb25IVE1MLFxuICAgICAgdHlwZSxcbiAgICB9KSB7XG4gICAgICBpZiAoIXRoaXMuc3VnZ2VzdGlvbkRldGFpbHNFbmFibGVkKSByZXR1cm4gbnVsbDtcblxuICAgICAgY29uc3Qga2VybmVsID0gc3RvcmUua2VybmVsO1xuICAgICAgaWYgKCFrZXJuZWwgfHwga2VybmVsLmV4ZWN1dGlvblN0YXRlICE9PSBcImlkbGVcIikgcmV0dXJuIG51bGw7XG5cbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBrZXJuZWwuaW5zcGVjdChyZXBsYWNlZFRleHQsIHJlcGxhY2VkVGV4dC5sZW5ndGgsICh7IGZvdW5kLCBkYXRhIH0pID0+IHtcbiAgICAgICAgICBpZiAoIWZvdW5kIHx8ICFkYXRhW1widGV4dC9wbGFpblwiXSkge1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBhbnNpVG9UZXh0KGRhdGFbXCJ0ZXh0L3BsYWluXCJdKTtcbiAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeCxcbiAgICAgICAgICAgIHJlcGxhY2VkVGV4dCxcbiAgICAgICAgICAgIGljb25IVE1MLFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtwcm9taXNlLCB0aGlzLnRpbWVvdXQoKV0pO1xuICAgIH0sXG5cbiAgICB0aW1lb3V0KCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcblxuICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKFwiSHlkcm9nZW4uYXV0b2NvbXBsZXRlXCIsICh2KSA9PiB7XG4gICAgICBhdXRvY29tcGxldGVQcm92aWRlci5lbmFibGVkID0gdjtcbiAgICB9KSxcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKFwiSHlkcm9nZW4uYXV0b2NvbXBsZXRlU3VnZ2VzdGlvblByaW9yaXR5XCIsICh2KSA9PiB7XG4gICAgICBhdXRvY29tcGxldGVQcm92aWRlci5zdWdnZXN0aW9uUHJpb3JpdHkgPSB2O1xuICAgIH0pLFxuICAgIGF0b20uY29uZmlnLm9ic2VydmUoXCJIeWRyb2dlbi5zaG93SW5zcGVjdG9yUmVzdWx0c0luQXV0b2NvbXBsZXRlXCIsICh2KSA9PiB7XG4gICAgICBhdXRvY29tcGxldGVQcm92aWRlci5zdWdnZXN0aW9uRGV0YWlsc0VuYWJsZWQgPSB2O1xuICAgIH0pXG4gICk7XG5cbiAgcmV0dXJuIGF1dG9jb21wbGV0ZVByb3ZpZGVyO1xufVxuIl19