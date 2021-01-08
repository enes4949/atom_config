Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Adapted from https://github.com/nteract/nteract/blob/master/packages/outputs/src/components/media/markdown.tsx
 * Copyright (c) 2016 - present, nteract contributors
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @NOTE: This `Markdown` component could be used exactly same as the original `Media.Markdown` component of @nteract/outputs,
 *        except that this file adds a class name to it for further stylings in styles/hydrogen.less.
 */

var _nteractMarkdown = require("@nteract/markdown");

var _nteractMarkdown2 = _interopRequireDefault(_nteractMarkdown);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var Markdown = (function (_React$PureComponent) {
  _inherits(Markdown, _React$PureComponent);

  function Markdown() {
    _classCallCheck(this, Markdown);

    _get(Object.getPrototypeOf(Markdown.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Markdown, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        { className: "markdown" },
        _react2["default"].createElement(_nteractMarkdown2["default"], { source: this.props.data })
      );
    }
  }], [{
    key: "defaultProps",
    value: {
      data: "",
      mediaType: "text/markdown"
    },
    enumerable: true
  }]);

  return Markdown;
})(_react2["default"].PureComponent);

exports.Markdown = Markdown;
exports["default"] = Markdown;

/**
 * Markdown text.
 */

/**
 * Media type. Defaults to `text/markdown`.
 * For more on media types, see: https://www.w3.org/TR/CSS21/media.html%23media-types.
 */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9tYXJrZG93bi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQkFjOEIsbUJBQW1COzs7O3FCQUMvQixPQUFPOzs7O0lBY1osUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROzsrQkFBUixRQUFROzs7ZUFBUixRQUFROztXQU1iLGtCQUFHO0FBQ1AsYUFDRTs7VUFBSyxTQUFTLEVBQUMsVUFBVTtRQUN2QixpRUFBbUIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUFDLEdBQUc7T0FDMUMsQ0FDTjtLQUNIOzs7V0FYcUI7QUFDcEIsVUFBSSxFQUFFLEVBQUU7QUFDUixlQUFTLEVBQUUsZUFBZTtLQUMzQjs7OztTQUpVLFFBQVE7R0FBUyxtQkFBTSxhQUFhOzs7cUJBZWxDLFFBQVEiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3Jlc3VsdC12aWV3L21hcmtkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLyoqXG4gKiBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL250ZXJhY3QvbnRlcmFjdC9ibG9iL21hc3Rlci9wYWNrYWdlcy9vdXRwdXRzL3NyYy9jb21wb25lbnRzL21lZGlhL21hcmtkb3duLnRzeFxuICogQ29weXJpZ2h0IChjKSAyMDE2IC0gcHJlc2VudCwgbnRlcmFjdCBjb250cmlidXRvcnNcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBATk9URTogVGhpcyBgTWFya2Rvd25gIGNvbXBvbmVudCBjb3VsZCBiZSB1c2VkIGV4YWN0bHkgc2FtZSBhcyB0aGUgb3JpZ2luYWwgYE1lZGlhLk1hcmtkb3duYCBjb21wb25lbnQgb2YgQG50ZXJhY3Qvb3V0cHV0cyxcbiAqICAgICAgICBleGNlcHQgdGhhdCB0aGlzIGZpbGUgYWRkcyBhIGNsYXNzIG5hbWUgdG8gaXQgZm9yIGZ1cnRoZXIgc3R5bGluZ3MgaW4gc3R5bGVzL2h5ZHJvZ2VuLmxlc3MuXG4gKi9cblxuaW1wb3J0IE1hcmtkb3duQ29tcG9uZW50IGZyb20gXCJAbnRlcmFjdC9tYXJrZG93blwiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICAvKipcbiAgICogTWFya2Rvd24gdGV4dC5cbiAgICovXG4gIGRhdGE6IHN0cmluZztcbiAgLyoqXG4gICAqIE1lZGlhIHR5cGUuIERlZmF1bHRzIHRvIGB0ZXh0L21hcmtkb3duYC5cbiAgICogRm9yIG1vcmUgb24gbWVkaWEgdHlwZXMsIHNlZTogaHR0cHM6Ly93d3cudzMub3JnL1RSL0NTUzIxL21lZGlhLmh0bWwlMjNtZWRpYS10eXBlcy5cbiAgICovXG4gIG1lZGlhVHlwZTogXCJ0ZXh0L21hcmtkb3duXCI7XG59XG5cbmV4cG9ydCBjbGFzcyBNYXJrZG93biBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQ8UHJvcHM+IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkYXRhOiBcIlwiLFxuICAgIG1lZGlhVHlwZTogXCJ0ZXh0L21hcmtkb3duXCIsXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcmtkb3duXCI+XG4gICAgICAgIDxNYXJrZG93bkNvbXBvbmVudCBzb3VyY2U9e3RoaXMucHJvcHMuZGF0YX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2Rvd247XG4iXX0=