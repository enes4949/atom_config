Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Adapted from https://github.com/nteract/nteract/blob/master/packages/transform-plotly/src/index.tsx
 * Copyright (c) 2016 - present, nteract contributors
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @NOTE: This `PlotlyTransform` component could be used exactly same as the original `PlotlyTransform` component of @nteract/transform-plotly,
 *        except that this file adds the ability to download a plot from an electron context.
 */

var _lodash = require("lodash");

var _react = require("react");

var React = _interopRequireWildcard(_react);

var PlotlyTransform = (function (_React$Component) {
  _inherits(PlotlyTransform, _React$Component);

  _createClass(PlotlyTransform, null, [{
    key: "defaultProps",
    value: {
      data: "",
      mediaType: "application/vnd.plotly.v1+json"
    },
    enumerable: true
  }]);

  function PlotlyTransform(props) {
    var _this = this;

    _classCallCheck(this, PlotlyTransform);

    _get(Object.getPrototypeOf(PlotlyTransform.prototype), "constructor", this).call(this, props);

    this.plotDivRef = function (plotDiv) {
      _this.plotDiv = plotDiv;
    };

    this.getFigure = function () {
      var figure = _this.props.data;
      if (typeof figure === "string") {
        return JSON.parse(figure);
      }

      // The Plotly API *mutates* the figure to include a UID, which means
      // they won't take our frozen objects
      if (Object.isFrozen(figure)) {
        return (0, _lodash.cloneDeep)(figure);
      }

      var _figure$data = figure.data;
      var data = _figure$data === undefined ? {} : _figure$data;
      var _figure$layout = figure.layout;
      var layout = _figure$layout === undefined ? {} : _figure$layout;

      return { data: data, layout: layout };
    };

    this.downloadImage = function (gd) {
      _this.Plotly.toImage(gd).then(function (dataUrl) {
        var electron = require("electron");
        electron.remote.getCurrentWebContents().downloadURL(dataUrl);
      });
    };

    this.downloadImage = this.downloadImage.bind(this);
  }

  _createClass(PlotlyTransform, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Handle case of either string to be `JSON.parse`d or pure object
      var figure = this.getFigure();
      this.Plotly = require("@nteract/plotly");
      this.Plotly.newPlot(this.plotDiv, figure.data, figure.layout, {
        modeBarButtonsToRemove: ["toImage"],
        modeBarButtonsToAdd: [{
          name: "Download plot as a png",
          icon: this.Plotly.Icons.camera,
          click: this.downloadImage
        }]
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.data !== nextProps.data;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var figure = this.getFigure();
      if (!this.plotDiv) {
        return;
      }
      var plotDiv = this.plotDiv;
      plotDiv.data = figure.data;
      plotDiv.layout = figure.layout;
      this.Plotly.redraw(plotDiv);
    }
  }, {
    key: "render",
    value: function render() {
      var _getFigure = this.getFigure();

      var layout = _getFigure.layout;

      var style = {};
      if (layout && layout.height && !layout.autosize) {
        style.height = layout.height;
      }
      return React.createElement("div", { ref: this.plotDivRef, style: style });
    }
  }]);

  return PlotlyTransform;
})(React.Component);

exports.PlotlyTransform = PlotlyTransform;
exports["default"] = PlotlyTransform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9wbG90bHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBYTBCLFFBQVE7O3FCQUNYLE9BQU87O0lBQWxCLEtBQUs7O0lBMEJKLGVBQWU7WUFBZixlQUFlOztlQUFmLGVBQWU7O1dBQ0o7QUFDcEIsVUFBSSxFQUFFLEVBQUU7QUFDUixlQUFTLEVBQUUsZ0NBQWdDO0tBQzVDOzs7O0FBYVUsV0FqQkEsZUFBZSxDQWlCZCxLQUFZLEVBQUU7OzswQkFqQmYsZUFBZTs7QUFrQnhCLCtCQWxCUyxlQUFlLDZDQWtCbEIsS0FBSyxFQUFFOztTQW1DZixVQUFVLEdBQUcsVUFBQyxPQUFPLEVBQWtDO0FBQ3JELFlBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUN4Qjs7U0FFRCxTQUFTLEdBQUcsWUFBYztBQUN4QixVQUFNLE1BQU0sR0FBRyxNQUFLLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDL0IsVUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7QUFDOUIsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQzNCOzs7O0FBSUQsVUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzNCLGVBQU8sdUJBQVUsTUFBTSxDQUFDLENBQUM7T0FDMUI7O3lCQUVrQyxNQUFNLENBQWpDLElBQUk7VUFBSixJQUFJLGdDQUFHLEVBQUU7MkJBQWtCLE1BQU0sQ0FBdEIsTUFBTTtVQUFOLE1BQU0sa0NBQUcsRUFBRTs7QUFFOUIsYUFBTyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDO0tBQ3pCOztTQUVELGFBQWEsR0FBRyxVQUFDLEVBQUUsRUFBVTtBQUMzQixZQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsT0FBTyxFQUFFO0FBQzlDLFlBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUM5RCxDQUFDLENBQUM7S0FDSjs7QUE1REMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNwRDs7ZUFwQlUsZUFBZTs7V0FzQlQsNkJBQVM7O0FBRXhCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQyxVQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQzVELDhCQUFzQixFQUFFLENBQUMsU0FBUyxDQUFDO0FBQ25DLDJCQUFtQixFQUFFLENBQ25CO0FBQ0UsY0FBSSxFQUFFLHdCQUF3QjtBQUM5QixjQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTTtBQUM5QixlQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWE7U0FDMUIsQ0FDRjtPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFb0IsK0JBQUMsU0FBZ0IsRUFBVztBQUMvQyxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUM7S0FDM0M7OztXQUVpQiw4QkFBRztBQUNuQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakIsZUFBTztPQUNSO0FBQ0QsVUFBTSxPQUEwQixHQUFJLElBQUksQ0FBQyxPQUFPLEFBQU0sQ0FBQztBQUN2RCxhQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDM0IsYUFBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzdCOzs7V0E4Qkssa0JBQUc7dUJBQ1ksSUFBSSxDQUFDLFNBQVMsRUFBRTs7VUFBM0IsTUFBTSxjQUFOLE1BQU07O0FBQ2QsVUFBTSxLQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLFVBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0FBQy9DLGFBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztPQUM5QjtBQUNELGFBQU8sNkJBQUssR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxBQUFDLEdBQUcsQ0FBQztLQUNwRDs7O1NBeEZVLGVBQWU7R0FBUyxLQUFLLENBQUMsU0FBUzs7O3FCQTJGckMsZUFBZSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvcGxvdGx5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qKlxuICogQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9udGVyYWN0L250ZXJhY3QvYmxvYi9tYXN0ZXIvcGFja2FnZXMvdHJhbnNmb3JtLXBsb3RseS9zcmMvaW5kZXgudHN4XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgLSBwcmVzZW50LCBudGVyYWN0IGNvbnRyaWJ1dG9yc1xuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBOT1RFOiBUaGlzIGBQbG90bHlUcmFuc2Zvcm1gIGNvbXBvbmVudCBjb3VsZCBiZSB1c2VkIGV4YWN0bHkgc2FtZSBhcyB0aGUgb3JpZ2luYWwgYFBsb3RseVRyYW5zZm9ybWAgY29tcG9uZW50IG9mIEBudGVyYWN0L3RyYW5zZm9ybS1wbG90bHksXG4gKiAgICAgICAgZXhjZXB0IHRoYXQgdGhpcyBmaWxlIGFkZHMgdGhlIGFiaWxpdHkgdG8gZG93bmxvYWQgYSBwbG90IGZyb20gYW4gZWxlY3Ryb24gY29udGV4dC5cbiAqL1xuXG5pbXBvcnQgeyBjbG9uZURlZXAgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgZGF0YTogc3RyaW5nIHwgT2JqZWN0O1xuICBtZWRpYVR5cGU6IFwiYXBwbGljYXRpb24vdm5kLnBsb3RseS52MStqc29uXCI7XG59XG5cbnR5cGUgT2JqZWN0VHlwZSA9IE9iamVjdDtcblxuaW50ZXJmYWNlIEZpZ3VyZUxheW91dCBleHRlbmRzIE9iamVjdFR5cGUge1xuICBoZWlnaHQ/OiBzdHJpbmc7XG4gIGF1dG9zaXplPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEZpZ3VyZSBleHRlbmRzIE9iamVjdFR5cGUge1xuICBkYXRhOiBPYmplY3Q7XG4gIGxheW91dDogRmlndXJlTGF5b3V0O1xufVxuXG5kZWNsYXJlIGNsYXNzIFBsb3RseUhUTUxFbGVtZW50IGV4dGVuZHMgSFRNTERpdkVsZW1lbnQge1xuICBkYXRhOiBPYmplY3Q7XG4gIGxheW91dDogT2JqZWN0O1xuICBuZXdQbG90OiAoKSA9PiB2b2lkO1xuICByZWRyYXc6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBQbG90bHlUcmFuc2Zvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHM+IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkYXRhOiBcIlwiLFxuICAgIG1lZGlhVHlwZTogXCJhcHBsaWNhdGlvbi92bmQucGxvdGx5LnYxK2pzb25cIixcbiAgfTtcblxuICBwbG90RGl2OiBIVE1MRGl2RWxlbWVudCB8IG51bGw7XG4gIFBsb3RseToge1xuICAgIG5ld1Bsb3Q6IChcbiAgICAgIGRpdjogSFRNTERpdkVsZW1lbnQgfCBudWxsIHwgdm9pZCxcbiAgICAgIGRhdGE6IE9iamVjdCxcbiAgICAgIGxheW91dDogRmlndXJlTGF5b3V0XG4gICAgKSA9PiB2b2lkLFxuICAgIHJlZHJhdzogKGRpdj86IFBsb3RseUhUTUxFbGVtZW50KSA9PiB2b2lkLFxuICAgIHRvSW1hZ2U6IChnZDogYW55KSA9PiBQcm9taXNlPHN0cmluZz4sXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZG93bmxvYWRJbWFnZSA9IHRoaXMuZG93bmxvYWRJbWFnZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKTogdm9pZCB7XG4gICAgLy8gSGFuZGxlIGNhc2Ugb2YgZWl0aGVyIHN0cmluZyB0byBiZSBgSlNPTi5wYXJzZWBkIG9yIHB1cmUgb2JqZWN0XG4gICAgY29uc3QgZmlndXJlID0gdGhpcy5nZXRGaWd1cmUoKTtcbiAgICB0aGlzLlBsb3RseSA9IHJlcXVpcmUoXCJAbnRlcmFjdC9wbG90bHlcIik7XG4gICAgdGhpcy5QbG90bHkubmV3UGxvdCh0aGlzLnBsb3REaXYsIGZpZ3VyZS5kYXRhLCBmaWd1cmUubGF5b3V0LCB7XG4gICAgICBtb2RlQmFyQnV0dG9uc1RvUmVtb3ZlOiBbXCJ0b0ltYWdlXCJdLFxuICAgICAgbW9kZUJhckJ1dHRvbnNUb0FkZDogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJEb3dubG9hZCBwbG90IGFzIGEgcG5nXCIsXG4gICAgICAgICAgaWNvbjogdGhpcy5QbG90bHkuSWNvbnMuY2FtZXJhLFxuICAgICAgICAgIGNsaWNrOiB0aGlzLmRvd25sb2FkSW1hZ2UsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wczogUHJvcHMpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kYXRhICE9PSBuZXh0UHJvcHMuZGF0YTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBjb25zdCBmaWd1cmUgPSB0aGlzLmdldEZpZ3VyZSgpO1xuICAgIGlmICghdGhpcy5wbG90RGl2KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBsb3REaXY6IFBsb3RseUhUTUxFbGVtZW50ID0gKHRoaXMucGxvdERpdjogYW55KTtcbiAgICBwbG90RGl2LmRhdGEgPSBmaWd1cmUuZGF0YTtcbiAgICBwbG90RGl2LmxheW91dCA9IGZpZ3VyZS5sYXlvdXQ7XG4gICAgdGhpcy5QbG90bHkucmVkcmF3KHBsb3REaXYpO1xuICB9XG5cbiAgcGxvdERpdlJlZiA9IChwbG90RGl2OiBIVE1MRGl2RWxlbWVudCB8IG51bGwpOiB2b2lkID0+IHtcbiAgICB0aGlzLnBsb3REaXYgPSBwbG90RGl2O1xuICB9O1xuXG4gIGdldEZpZ3VyZSA9ICgpOiBGaWd1cmUgPT4ge1xuICAgIGNvbnN0IGZpZ3VyZSA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBpZiAodHlwZW9mIGZpZ3VyZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZmlndXJlKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgUGxvdGx5IEFQSSAqbXV0YXRlcyogdGhlIGZpZ3VyZSB0byBpbmNsdWRlIGEgVUlELCB3aGljaCBtZWFuc1xuICAgIC8vIHRoZXkgd29uJ3QgdGFrZSBvdXIgZnJvemVuIG9iamVjdHNcbiAgICBpZiAoT2JqZWN0LmlzRnJvemVuKGZpZ3VyZSkpIHtcbiAgICAgIHJldHVybiBjbG9uZURlZXAoZmlndXJlKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGRhdGEgPSB7fSwgbGF5b3V0ID0ge30gfSA9IGZpZ3VyZTtcblxuICAgIHJldHVybiB7IGRhdGEsIGxheW91dCB9O1xuICB9O1xuXG4gIGRvd25sb2FkSW1hZ2UgPSAoZ2Q6IGFueSkgPT4ge1xuICAgIHRoaXMuUGxvdGx5LnRvSW1hZ2UoZ2QpLnRoZW4oZnVuY3Rpb24gKGRhdGFVcmwpIHtcbiAgICAgIGNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuICAgICAgZWxlY3Ryb24ucmVtb3RlLmdldEN1cnJlbnRXZWJDb250ZW50cygpLmRvd25sb2FkVVJMKGRhdGFVcmwpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxheW91dCB9ID0gdGhpcy5nZXRGaWd1cmUoKTtcbiAgICBjb25zdCBzdHlsZTogT2JqZWN0ID0ge307XG4gICAgaWYgKGxheW91dCAmJiBsYXlvdXQuaGVpZ2h0ICYmICFsYXlvdXQuYXV0b3NpemUpIHtcbiAgICAgIHN0eWxlLmhlaWdodCA9IGxheW91dC5oZWlnaHQ7XG4gICAgfVxuICAgIHJldHVybiA8ZGl2IHJlZj17dGhpcy5wbG90RGl2UmVmfSBzdHlsZT17c3R5bGV9IC8+O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsb3RseVRyYW5zZm9ybTtcbiJdfQ==