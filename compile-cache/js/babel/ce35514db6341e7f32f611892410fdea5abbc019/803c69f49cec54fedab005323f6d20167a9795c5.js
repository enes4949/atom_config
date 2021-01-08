'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CheatsheetView = (function () {
  function CheatsheetView(serializedState) {
    _classCallCheck(this, CheatsheetView);

    // Create root element
    this.element = document.createElement('div');
    var root = this.element;
    root.classList.add('root-cheatsheet');

    // Create fixed header element
    var fixedHeader = document.createElement("div");
    fixedHeader.classList.add('fixed-header');
    root.appendChild(fixedHeader);

    // Set up header
    var titleTag = document.createElement('h1');
    titleTag.textContent = "CheatSheet";
    fixedHeader.appendChild(titleTag);

    var button = document.createElement('button');
    button.classList.add('close-button');
    button.innerHTML = '<span class="icon icon-x"></span>';
    button.onclick = function () {
      atom.commands.dispatch(atom.views.getView(atom.workspace), "cheatsheet:toggle");
    };
    fixedHeader.appendChild(button);

    // Create scrollable content element
    var scrollableContent = document.createElement("div");
    scrollableContent.classList.add('scrollable-content');
    scrollableContent.id = 'ScrollableContent';
    root.appendChild(scrollableContent);
  }

  // Returns an object that can be retrieved when package is activated

  _createClass(CheatsheetView, [{
    key: 'serialize',
    value: function serialize() {}

    // Tear down any state and detach
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element.remove();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }]);

  return CheatsheetView;
})();

exports['default'] = CheatsheetView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9jaGVhdHNoZWV0L2xpYi9jaGVhdHNoZWV0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0lBRVMsY0FBYztBQUV0QixXQUZRLGNBQWMsQ0FFckIsZUFBZSxFQUFFOzBCQUZWLGNBQWM7OztBQUsvQixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtBQUN2QixRQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOzs7QUFHdEMsUUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxlQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxRQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7QUFHOUIsUUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxZQUFRLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztBQUNwQyxlQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVsQyxRQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFVBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDLFVBQU0sQ0FBQyxTQUFTLEdBQUcsbUNBQW1DLENBQUM7QUFDdkQsVUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFVO0FBQUMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7S0FBQyxDQUFDO0FBQzlHLGVBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUdoQyxRQUFJLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEQscUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3RELHFCQUFpQixDQUFDLEVBQUUsR0FBRSxtQkFBbUIsQ0FBQztBQUMxQyxRQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7R0FFckM7Ozs7ZUEvQmtCLGNBQWM7O1dBa0N4QixxQkFBRyxFQUFFOzs7OztXQUdQLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN2Qjs7O1dBRVMsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7OztTQTNDa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL2NoZWF0c2hlZXQvbGliL2NoZWF0c2hlZXQtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGVhdHNoZWV0VmlldyB7XG5cbiAgY29uc3RydWN0b3Ioc2VyaWFsaXplZFN0YXRlKSB7XG5cbiAgICAvLyBDcmVhdGUgcm9vdCBlbGVtZW50XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdmFyIHJvb3QgPSB0aGlzLmVsZW1lbnRcbiAgICByb290LmNsYXNzTGlzdC5hZGQoJ3Jvb3QtY2hlYXRzaGVldCcpO1xuXG4gICAgLy8gQ3JlYXRlIGZpeGVkIGhlYWRlciBlbGVtZW50XG4gICAgdmFyIGZpeGVkSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBmaXhlZEhlYWRlci5jbGFzc0xpc3QuYWRkKCdmaXhlZC1oZWFkZXInKTtcbiAgICByb290LmFwcGVuZENoaWxkKGZpeGVkSGVhZGVyKTtcblxuICAgIC8vIFNldCB1cCBoZWFkZXJcbiAgICB2YXIgdGl0bGVUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgIHRpdGxlVGFnLnRleHRDb250ZW50ID0gXCJDaGVhdFNoZWV0XCI7XG4gICAgZml4ZWRIZWFkZXIuYXBwZW5kQ2hpbGQodGl0bGVUYWcpO1xuXG4gICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1idXR0b24nKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gJzxzcGFuIGNsYXNzPVwiaWNvbiBpY29uLXhcIj48L3NwYW4+JztcbiAgICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCl7YXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCBcImNoZWF0c2hlZXQ6dG9nZ2xlXCIpO307XG4gICAgZml4ZWRIZWFkZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgIC8vIENyZWF0ZSBzY3JvbGxhYmxlIGNvbnRlbnQgZWxlbWVudFxuICAgIHZhciBzY3JvbGxhYmxlQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc2Nyb2xsYWJsZUNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc2Nyb2xsYWJsZS1jb250ZW50Jyk7XG4gICAgc2Nyb2xsYWJsZUNvbnRlbnQuaWQgPSdTY3JvbGxhYmxlQ29udGVudCc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChzY3JvbGxhYmxlQ29udGVudCk7XG5cbiAgfVxuXG4gIC8vIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHJldHJpZXZlZCB3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkXG4gIHNlcmlhbGl6ZSgpIHt9XG5cbiAgLy8gVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICB9XG5cbn1cbiJdfQ==