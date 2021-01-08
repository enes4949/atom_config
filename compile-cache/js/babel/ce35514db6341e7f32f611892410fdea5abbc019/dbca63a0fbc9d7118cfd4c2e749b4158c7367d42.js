Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var InputView = (function () {
  function InputView(_ref, onConfirmed) {
    var _this = this;

    var prompt = _ref.prompt;
    var defaultText = _ref.defaultText;
    var allowCancel = _ref.allowCancel;
    var password = _ref.password;

    _classCallCheck(this, InputView);

    this.onConfirmed = onConfirmed;

    this.element = document.createElement("div");
    this.element.classList.add("hydrogen", "input-view");
    if (password) this.element.classList.add("password");

    var label = document.createElement("div");
    label.classList.add("label", "icon", "icon-arrow-right");
    label.textContent = prompt || "Kernel requires input";

    this.miniEditor = new _atom.TextEditor({ mini: true });
    if (defaultText) this.miniEditor.setText(defaultText);

    this.element.appendChild(label);
    this.element.appendChild(this.miniEditor.element);

    if (allowCancel) {
      atom.commands.add(this.element, {
        "core:confirm": function coreConfirm() {
          return _this.confirm();
        },
        "core:cancel": function coreCancel() {
          return _this.close();
        }
      });
      this.miniEditor.element.addEventListener("blur", function () {
        if (document.hasFocus()) _this.close();
      });
    } else {
      atom.commands.add(this.element, {
        "core:confirm": function coreConfirm() {
          return _this.confirm();
        }
      });
    }
  }

  _createClass(InputView, [{
    key: "confirm",
    value: function confirm() {
      var text = this.miniEditor.getText();
      if (this.onConfirmed) this.onConfirmed(text);
      this.close();
    }
  }, {
    key: "close",
    value: function close() {
      if (this.panel) this.panel.destroy();
      this.panel = null;
      this.element.remove();
      if (this.previouslyFocusedElement) this.previouslyFocusedElement.focus();
    }
  }, {
    key: "attach",
    value: function attach() {
      this.previouslyFocusedElement = document.activeElement;
      this.panel = atom.workspace.addModalPanel({ item: this.element });
      this.miniEditor.element.focus();
      this.miniEditor.scrollToCursorPosition();
    }
  }]);

  return InputView;
})();

exports["default"] = InputView;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvaW5wdXQtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFMkIsTUFBTTs7SUFVWixTQUFTO0FBTWpCLFdBTlEsU0FBUyxDQU8xQixJQUFvRCxFQUNwRCxXQUFlLEVBQ2Y7OztRQUZFLE1BQU0sR0FBUixJQUFvRCxDQUFsRCxNQUFNO1FBQUUsV0FBVyxHQUFyQixJQUFvRCxDQUExQyxXQUFXO1FBQUUsV0FBVyxHQUFsQyxJQUFvRCxDQUE3QixXQUFXO1FBQUUsUUFBUSxHQUE1QyxJQUFvRCxDQUFoQixRQUFROzswQkFQM0IsU0FBUzs7QUFVMUIsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRS9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3JELFFBQUksUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFckQsUUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxTQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDekQsU0FBSyxDQUFDLFdBQVcsR0FBRyxNQUFNLElBQUksdUJBQXVCLENBQUM7O0FBRXRELFFBQUksQ0FBQyxVQUFVLEdBQUcscUJBQWUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNqRCxRQUFJLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFdEQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFbEQsUUFBSSxXQUFXLEVBQUU7QUFDZixVQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlCLHNCQUFjLEVBQUU7aUJBQU0sTUFBSyxPQUFPLEVBQUU7U0FBQTtBQUNwQyxxQkFBYSxFQUFFO2lCQUFNLE1BQUssS0FBSyxFQUFFO1NBQUE7T0FDbEMsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDckQsWUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBSyxLQUFLLEVBQUUsQ0FBQztPQUN2QyxDQUFDLENBQUM7S0FDSixNQUFNO0FBQ0wsVUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUM5QixzQkFBYyxFQUFFO2lCQUFNLE1BQUssT0FBTyxFQUFFO1NBQUE7T0FDckMsQ0FBQyxDQUFDO0tBQ0o7R0FDRjs7ZUF2Q2tCLFNBQVM7O1dBeUNyQixtQkFBRztBQUNSLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkMsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckMsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN0QixVQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDMUU7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7QUFDdkQsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUNsRSxVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoQyxVQUFJLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLENBQUM7S0FDMUM7OztTQTNEa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9pbnB1dC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgVGV4dEVkaXRvciB9IGZyb20gXCJhdG9tXCI7XG5cbnR5cGUgb3B0cyA9IHtcbiAgcHJvbXB0OiBzdHJpbmcsXG4gIGRlZmF1bHRUZXh0Pzogc3RyaW5nLFxuICBhbGxvd0NhbmNlbD86IGJvb2xlYW4sXG4gIHBhc3N3b3JkPzogYm9vbGVhbixcbn07XG50eXBlIGNiID0gKHM6IHN0cmluZykgPT4gdm9pZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXRWaWV3IHtcbiAgb25Db25maXJtZWQ6IGNiO1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgbWluaUVkaXRvcjogYXRvbSRUZXh0RWRpdG9yO1xuICBwYW5lbDogP2F0b20kUGFuZWw7XG4gIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudDogP0hUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihcbiAgICB7IHByb21wdCwgZGVmYXVsdFRleHQsIGFsbG93Q2FuY2VsLCBwYXNzd29yZCB9OiBvcHRzLFxuICAgIG9uQ29uZmlybWVkOiBjYlxuICApIHtcbiAgICB0aGlzLm9uQ29uZmlybWVkID0gb25Db25maXJtZWQ7XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaHlkcm9nZW5cIiwgXCJpbnB1dC12aWV3XCIpO1xuICAgIGlmIChwYXNzd29yZCkgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJwYXNzd29yZFwiKTtcblxuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKFwibGFiZWxcIiwgXCJpY29uXCIsIFwiaWNvbi1hcnJvdy1yaWdodFwiKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHByb21wdCB8fCBcIktlcm5lbCByZXF1aXJlcyBpbnB1dFwiO1xuXG4gICAgdGhpcy5taW5pRWRpdG9yID0gbmV3IFRleHRFZGl0b3IoeyBtaW5pOiB0cnVlIH0pO1xuICAgIGlmIChkZWZhdWx0VGV4dCkgdGhpcy5taW5pRWRpdG9yLnNldFRleHQoZGVmYXVsdFRleHQpO1xuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5taW5pRWRpdG9yLmVsZW1lbnQpO1xuXG4gICAgaWYgKGFsbG93Q2FuY2VsKSB7XG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOmNvbmZpcm1cIjogKCkgPT4gdGhpcy5jb25maXJtKCksXG4gICAgICAgIFwiY29yZTpjYW5jZWxcIjogKCkgPT4gdGhpcy5jbG9zZSgpLFxuICAgICAgfSk7XG4gICAgICB0aGlzLm1pbmlFZGl0b3IuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5oYXNGb2N1cygpKSB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ICgpID0+IHRoaXMuY29uZmlybSgpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY29uZmlybSgpIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5taW5pRWRpdG9yLmdldFRleHQoKTtcbiAgICBpZiAodGhpcy5vbkNvbmZpcm1lZCkgdGhpcy5vbkNvbmZpcm1lZCh0ZXh0KTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGF0dGFjaCgpIHtcbiAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzLmVsZW1lbnQgfSk7XG4gICAgdGhpcy5taW5pRWRpdG9yLmVsZW1lbnQuZm9jdXMoKTtcbiAgICB0aGlzLm1pbmlFZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpO1xuICB9XG59XG4iXX0=