Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

exports.reduceOutputs = reduceOutputs;
exports.isSingleLine = isSingleLine;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _escapeCarriage = require("escape-carriage");

var _componentsResultViewDisplay = require("../components/result-view/display");

var outputTypes = ["execute_result", "display_data", "stream", "error"];

/**
 * https://github.com/nteract/hydrogen/issues/466#issuecomment-274822937
 * An output can be a stream of data that does not arrive at a single time. This
 * function handles the different types of outputs and accumulates the data
 * into a reduced output.
 *
 * @param {Array<Object>} outputs - Kernel output messages
 * @param {Object} output - Outputted to be reduced into list of outputs
 * @return {Array<Object>} updated-outputs - Outputs + Output
 */

function reduceOutputs(outputs, output) {
  var last = outputs.length - 1;
  if (outputs.length > 0 && output.output_type === "stream" && outputs[last].output_type === "stream") {
    var appendText = function appendText(previous, next) {
      previous.text = (0, _escapeCarriage.escapeCarriageReturnSafe)(previous.text + next.text);
    };

    if (outputs[last].name === output.name) {
      appendText(outputs[last], output);
      return outputs;
    }

    if (outputs.length > 1 && outputs[last - 1].name === output.name) {
      appendText(outputs[last - 1], output);
      return outputs;
    }
  }
  outputs.push(output);
  return outputs;
}

function isSingleLine(text, availableSpace) {
  // If it turns out escapeCarriageReturn is a bottleneck, we should remove it.
  return (!text || text.indexOf("\n") === -1 || text.indexOf("\n") === text.length - 1) && availableSpace > (0, _escapeCarriage.escapeCarriageReturn)(text).length;
}

var OutputStore = (function () {
  var _instanceInitializers = {};

  function OutputStore() {
    _classCallCheck(this, OutputStore);

    _defineDecoratedPropertyDescriptor(this, "outputs", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "status", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "executionCount", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "index", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "position", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "incrementIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "decrementIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "clear", _instanceInitializers);
  }

  _createDecoratedClass(OutputStore, [{
    key: "appendOutput",
    decorators: [_mobx.action],
    value: function appendOutput(message) {
      if (message.stream === "execution_count") {
        this.executionCount = message.data;
      } else if (message.stream === "status") {
        this.status = message.data;
      } else if (outputTypes.indexOf(message.output_type) > -1) {
        reduceOutputs(this.outputs, message);
        this.setIndex(this.outputs.length - 1);
      }
    }
  }, {
    key: "updatePosition",
    decorators: [_mobx.action],
    value: function updatePosition(position) {
      Object.assign(this.position, position);
    }
  }, {
    key: "outputs",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: "status",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return "running";
    },
    enumerable: true
  }, {
    key: "executionCount",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return null;
    },
    enumerable: true
  }, {
    key: "index",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return -1;
    },
    enumerable: true
  }, {
    key: "position",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return {
        lineHeight: 0,
        lineLength: 0,
        editorWidth: 0,
        charWidth: 0
      };
    },
    enumerable: true
  }, {
    key: "isPlain",
    decorators: [_mobx.computed],
    get: function get() {
      if (this.outputs.length !== 1) return false;

      var availableSpace = Math.floor((this.position.editorWidth - this.position.lineLength) / this.position.charWidth);
      if (availableSpace <= 0) return false;

      var output = this.outputs[0];
      switch (output.output_type) {
        case "execute_result":
        case "display_data":
          {
            var bundle = output.data;
            return (0, _componentsResultViewDisplay.isTextOutputOnly)(bundle) ? isSingleLine(bundle["text/plain"], availableSpace) : false;
          }
        case "stream":
          {
            return isSingleLine(output.text, availableSpace);
          }
        default:
          {
            return false;
          }
      }
    }
  }, {
    key: "setIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this = this;

      return function (index) {
        if (index < 0) {
          _this.index = 0;
        } else if (index < _this.outputs.length) {
          _this.index = index;
        } else {
          _this.index = _this.outputs.length - 1;
        }
      };
    },
    enumerable: true
  }, {
    key: "incrementIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.index = _this2.index < _this2.outputs.length - 1 ? _this2.index + 1 : _this2.outputs.length - 1;
      };
    },
    enumerable: true
  }, {
    key: "decrementIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function () {
        _this3.index = _this3.index > 0 ? _this3.index - 1 : 0;
      };
    },
    enumerable: true
  }, {
    key: "clear",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this4 = this;

      return function () {
        _this4.outputs = [];
        _this4.index = -1;
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return OutputStore;
})();

exports["default"] = OutputStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvb3V0cHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFFNkMsTUFBTTs7c0JBQ3JDLFFBQVE7Ozs7OEJBSWYsaUJBQWlCOzsyQ0FHUyxtQ0FBbUM7O0FBQ3BFLElBQU0sV0FBVyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQVluRSxTQUFTLGFBQWEsQ0FDM0IsT0FBc0IsRUFDdEIsTUFBYyxFQUNDO0FBQ2YsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEMsTUFDRSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsSUFDbEIsTUFBTSxDQUFDLFdBQVcsS0FBSyxRQUFRLElBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUN0QztRQUNTLFVBQVUsR0FBbkIsU0FBUyxVQUFVLENBQUMsUUFBZ0IsRUFBRSxJQUFZLEVBQUU7QUFDbEQsY0FBUSxDQUFDLElBQUksR0FBRyw4Q0FBeUIsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckU7O0FBRUQsUUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDdEMsZ0JBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEMsYUFBTyxPQUFPLENBQUM7S0FDaEI7O0FBRUQsUUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ2hFLGdCQUFVLENBQUMsT0FBTyxDQUFDLElBQUks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Q0Y7S0FDRjs7Ozs7OzthQXdCVSxVQUFDLEtBQUssRUFBYTtBQUM1QixZQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDYixnQkFBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ2hCLE1BQU0sSUFBSSxLQUFLLEdBQUcsTUFBSyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3RDLGdCQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDcEIsTUFBTTtBQUNMLGdCQUFLLEtBQUssR0FBRyxNQUFLLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ3RDO09BQ0Y7Ozs7Ozs7OzthQUdnQixZQUFNO0FBQ3JCLGVBQUssS0FBSyxHQUNSLE9BQUssS0FBSyxHQUFHLE9BQUssT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQ2hDLE9BQUssS0FBSyxHQUFHLENBQUMsR0FDZCxPQUFLLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO09BQy9COzs7Ozs7Ozs7YUFHZ0IsWUFBTTtBQUNyQixlQUFLLEtBQUssR0FBRyxPQUFLLEtBQUssR0FBRyxDQUFDLEdBQUcsT0FBSyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNsRDs7Ozs7Ozs7O2FBR08sWUFBTTtBQUNaLGVBQUssT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixlQUFLLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztPQUNqQjs7Ozs7U0E5RmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvb3V0cHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgYWN0aW9uLCBjb21wdXRlZCwgb2JzZXJ2YWJsZSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQge1xuICBlc2NhcGVDYXJyaWFnZVJldHVybixcbiAgZXNjYXBlQ2FycmlhZ2VSZXR1cm5TYWZlLFxufSBmcm9tIFwiZXNjYXBlLWNhcnJpYWdlXCI7XG5cbmltcG9ydCB0eXBlIHsgSU9ic2VydmFibGVBcnJheSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyBpc1RleHRPdXRwdXRPbmx5IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvZGlzcGxheVwiO1xuY29uc3Qgb3V0cHV0VHlwZXMgPSBbXCJleGVjdXRlX3Jlc3VsdFwiLCBcImRpc3BsYXlfZGF0YVwiLCBcInN0cmVhbVwiLCBcImVycm9yXCJdO1xuXG4vKipcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9udGVyYWN0L2h5ZHJvZ2VuL2lzc3Vlcy80NjYjaXNzdWVjb21tZW50LTI3NDgyMjkzN1xuICogQW4gb3V0cHV0IGNhbiBiZSBhIHN0cmVhbSBvZiBkYXRhIHRoYXQgZG9lcyBub3QgYXJyaXZlIGF0IGEgc2luZ2xlIHRpbWUuIFRoaXNcbiAqIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIGRpZmZlcmVudCB0eXBlcyBvZiBvdXRwdXRzIGFuZCBhY2N1bXVsYXRlcyB0aGUgZGF0YVxuICogaW50byBhIHJlZHVjZWQgb3V0cHV0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gb3V0cHV0cyAtIEtlcm5lbCBvdXRwdXQgbWVzc2FnZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvdXRwdXQgLSBPdXRwdXR0ZWQgdG8gYmUgcmVkdWNlZCBpbnRvIGxpc3Qgb2Ygb3V0cHV0c1xuICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn0gdXBkYXRlZC1vdXRwdXRzIC0gT3V0cHV0cyArIE91dHB1dFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlT3V0cHV0cyhcbiAgb3V0cHV0czogQXJyYXk8T2JqZWN0PixcbiAgb3V0cHV0OiBPYmplY3Rcbik6IEFycmF5PE9iamVjdD4ge1xuICBjb25zdCBsYXN0ID0gb3V0cHV0cy5sZW5ndGggLSAxO1xuICBpZiAoXG4gICAgb3V0cHV0cy5sZW5ndGggPiAwICYmXG4gICAgb3V0cHV0Lm91dHB1dF90eXBlID09PSBcInN0cmVhbVwiICYmXG4gICAgb3V0cHV0c1tsYXN0XS5vdXRwdXRfdHlwZSA9PT0gXCJzdHJlYW1cIlxuICApIHtcbiAgICBmdW5jdGlvbiBhcHBlbmRUZXh0KHByZXZpb3VzOiBPYmplY3QsIG5leHQ6IE9iamVjdCkge1xuICAgICAgcHJldmlvdXMudGV4dCA9IGVzY2FwZUNhcnJpYWdlUmV0dXJuU2FmZShwcmV2aW91cy50ZXh0ICsgbmV4dC50ZXh0KTtcbiAgICB9XG5cbiAgICBpZiAob3V0cHV0c1tsYXN0XS5uYW1lID09PSBvdXRwdXQubmFtZSkge1xuICAgICAgYXBwZW5kVGV4dChvdXRwdXRzW2xhc3RdLCBvdXRwdXQpO1xuICAgICAgcmV0dXJuIG91dHB1dHM7XG4gICAgfVxuXG4gICAgaWYgKG91dHB1dHMubGVuZ3RoID4gMSAmJiBvdXRwdXRzW2xhc3QgLSAxXS5uYW1lID09PSBvdXRwdXQubmFtZSkge1xuICAgICAgYXBwZW5kVGV4dChvdXRwdXRzW2xhc3QgLSAxXSwgb3V0cHV0KTtcbiAgICAgIHJldHVybiBvdXRwdXRzO1xuICAgIH1cbiAgfVxuICBvdXRwdXRzLnB1c2gob3V0cHV0KTtcbiAgcmV0dXJuIG91dHB1dHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NpbmdsZUxpbmUodGV4dDogP3N0cmluZywgYXZhaWxhYmxlU3BhY2U6IG51bWJlcikge1xuICAvLyBJZiBpdCB0dXJucyBvdXQgZXNjYXBlQ2FycmlhZ2VSZXR1cm4gaXMgYSBib3R0bGVuZWNrLCB3ZSBzaG91bGQgcmVtb3ZlIGl0LlxuICByZXR1cm4gKFxuICAgICghdGV4dCB8fFxuICAgICAgdGV4dC5pbmRleE9mKFwiXFxuXCIpID09PSAtMSB8fFxuICAgICAgdGV4dC5pbmRleE9mKFwiXFxuXCIpID09PSB0ZXh0Lmxlbmd0aCAtIDEpICYmXG4gICAgYXZhaWxhYmxlU3BhY2UgPiBlc2NhcGVDYXJyaWFnZVJldHVybih0ZXh0KS5sZW5ndGhcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3V0cHV0U3RvcmUge1xuICBAb2JzZXJ2YWJsZVxuICBvdXRwdXRzOiBBcnJheTxPYmplY3Q+ID0gW107XG4gIEBvYnNlcnZhYmxlXG4gIHN0YXR1czogc3RyaW5nID0gXCJydW5uaW5nXCI7XG4gIEBvYnNlcnZhYmxlXG4gIGV4ZWN1dGlvbkNvdW50OiA/bnVtYmVyID0gbnVsbDtcbiAgQG9ic2VydmFibGVcbiAgaW5kZXg6IG51bWJlciA9IC0xO1xuICBAb2JzZXJ2YWJsZVxuICBwb3NpdGlvbiA9IHtcbiAgICBsaW5lSGVpZ2h0OiAwLFxuICAgIGxpbmVMZW5ndGg6IDAsXG4gICAgZWRpdG9yV2lkdGg6IDAsXG4gICAgY2hhcldpZHRoOiAwLFxuICB9O1xuXG4gIEBjb21wdXRlZFxuICBnZXQgaXNQbGFpbigpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5vdXRwdXRzLmxlbmd0aCAhPT0gMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgYXZhaWxhYmxlU3BhY2UgPSBNYXRoLmZsb29yKFxuICAgICAgKHRoaXMucG9zaXRpb24uZWRpdG9yV2lkdGggLSB0aGlzLnBvc2l0aW9uLmxpbmVMZW5ndGgpIC9cbiAgICAgICAgdGhpcy5wb3NpdGlvbi5jaGFyV2lkdGhcbiAgICApO1xuICAgIGlmIChhdmFpbGFibGVTcGFjZSA8PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLm91dHB1dHNbMF07XG4gICAgc3dpdGNoIChvdXRwdXQub3V0cHV0X3R5cGUpIHtcbiAgICAgIGNhc2UgXCJleGVjdXRlX3Jlc3VsdFwiOlxuICAgICAgY2FzZSBcImRpc3BsYXlfZGF0YVwiOiB7XG4gICAgICAgIGNvbnN0IGJ1bmRsZSA9IG91dHB1dC5kYXRhO1xuICAgICAgICByZXR1cm4gaXNUZXh0T3V0cHV0T25seShidW5kbGUpXG4gICAgICAgICAgPyBpc1NpbmdsZUxpbmUoYnVuZGxlW1widGV4dC9wbGFpblwiXSwgYXZhaWxhYmxlU3BhY2UpXG4gICAgICAgICAgOiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJzdHJlYW1cIjoge1xuICAgICAgICByZXR1cm4gaXNTaW5nbGVMaW5lKG91dHB1dC50ZXh0LCBhdmFpbGFibGVTcGFjZSk7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBAYWN0aW9uXG4gIGFwcGVuZE91dHB1dChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICBpZiAobWVzc2FnZS5zdHJlYW0gPT09IFwiZXhlY3V0aW9uX2NvdW50XCIpIHtcbiAgICAgIHRoaXMuZXhlY3V0aW9uQ291bnQgPSBtZXNzYWdlLmRhdGE7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLnN0cmVhbSA9PT0gXCJzdGF0dXNcIikge1xuICAgICAgdGhpcy5zdGF0dXMgPSBtZXNzYWdlLmRhdGE7XG4gICAgfSBlbHNlIGlmIChvdXRwdXRUeXBlcy5pbmRleE9mKG1lc3NhZ2Uub3V0cHV0X3R5cGUpID4gLTEpIHtcbiAgICAgIHJlZHVjZU91dHB1dHModGhpcy5vdXRwdXRzLCBtZXNzYWdlKTtcbiAgICAgIHRoaXMuc2V0SW5kZXgodGhpcy5vdXRwdXRzLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb25cbiAgdXBkYXRlUG9zaXRpb24ocG9zaXRpb246IHtcbiAgICBsaW5lSGVpZ2h0PzogbnVtYmVyLFxuICAgIGxpbmVMZW5ndGg/OiBudW1iZXIsXG4gICAgZWRpdG9yV2lkdGg/OiBudW1iZXIsXG4gIH0pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMucG9zaXRpb24sIHBvc2l0aW9uKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgc2V0SW5kZXggPSAoaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPCB0aGlzLm91dHB1dHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5kZXggPSB0aGlzLm91dHB1dHMubGVuZ3RoIC0gMTtcbiAgICB9XG4gIH07XG5cbiAgQGFjdGlvblxuICBpbmNyZW1lbnRJbmRleCA9ICgpID0+IHtcbiAgICB0aGlzLmluZGV4ID1cbiAgICAgIHRoaXMuaW5kZXggPCB0aGlzLm91dHB1dHMubGVuZ3RoIC0gMVxuICAgICAgICA/IHRoaXMuaW5kZXggKyAxXG4gICAgICAgIDogdGhpcy5vdXRwdXRzLmxlbmd0aCAtIDE7XG4gIH07XG5cbiAgQGFjdGlvblxuICBkZWNyZW1lbnRJbmRleCA9ICgpID0+IHtcbiAgICB0aGlzLmluZGV4ID0gdGhpcy5pbmRleCA+IDAgPyB0aGlzLmluZGV4IC0gMSA6IDA7XG4gIH07XG5cbiAgQGFjdGlvblxuICBjbGVhciA9ICgpID0+IHtcbiAgICB0aGlzLm91dHB1dHMgPSBbXTtcbiAgICB0aGlzLmluZGV4ID0gLTE7XG4gIH07XG59XG4iXX0=