function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _libTerminalSession = require('../lib/terminal-session');

var _libTerminalSession2 = _interopRequireDefault(_libTerminalSession);

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('TerminalTab', function () {
  var workspaceElement = undefined,
      activationPromise = undefined;

  beforeEach(function () {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('terminal-tab');
  });

  describe('when the terminal:open event is triggered', function () {

    it('opens a new terminal', function () {

      // Ensure that the terminal view element is not present in the workspace.
      expect(workspaceElement.querySelector('terminal-view')).not.toExist();

      var terminalPromise = atom.commands.dispatch(workspaceElement, 'terminal:open');

      waitsForPromise(function () {
        return activationPromise;
      });

      waitsForPromise(function () {
        return terminalPromise;
      });

      runs(function () {
        // Ensure that the terminal view element is present in the workspace.
        var terminalViewElement = workspaceElement.querySelector('terminal-view');
        expect(terminalViewElement).toExist();

        // Ensure that the bottom dock is visible.
        var bottomDock = atom.workspace.getBottomDock();
        expect(bottomDock.isVisible()).toBe(true);

        // Ensure that the terminal view is present in the bottom dock's pane.
        var activePaneItem = bottomDock.getActivePaneItem();
        expect(activePaneItem).toBeInstanceOf(_libTerminalSession2['default']);
        var terminalView = atom.views.getView(activePaneItem);
        expect(terminalView).toEqual(terminalViewElement);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC10YWIvc3BlYy90ZXJtaW5hbC10YWItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O2tDQUU0Qix5QkFBeUI7Ozs7Ozs7OztBQU9yRCxRQUFRLENBQUMsYUFBYSxFQUFFLFlBQU07QUFDNUIsTUFBSSxnQkFBZ0IsWUFBQTtNQUFFLGlCQUFpQixZQUFBLENBQUM7O0FBRXhDLFlBQVUsQ0FBQyxZQUFNO0FBQ2Ysb0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELHFCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0dBQ25FLENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsMkNBQTJDLEVBQUUsWUFBTTs7QUFFMUQsTUFBRSxDQUFDLHNCQUFzQixFQUFFLFlBQU07OztBQUcvQixZQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUV0RSxVQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsQ0FBQzs7QUFFaEYscUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGVBQU8saUJBQWlCLENBQUM7T0FDMUIsQ0FBQyxDQUFDOztBQUVILHFCQUFlLENBQUMsWUFBTTtBQUNwQixlQUFPLGVBQWUsQ0FBQztPQUN4QixDQUFDLENBQUE7O0FBRUYsVUFBSSxDQUFDLFlBQU07O0FBRVQsWUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDNUUsY0FBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7OztBQUd0QyxZQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ2hELGNBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7OztBQUcxQyxZQUFJLGNBQWMsR0FBRyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUNwRCxjQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsY0FBYyxpQ0FBaUIsQ0FBQztBQUN2RCxZQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0RCxjQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7T0FDbkQsQ0FBQyxDQUFDO0tBRUosQ0FBQyxDQUFDO0dBRUosQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC10YWIvc3BlYy90ZXJtaW5hbC10YWItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IFRlcm1pbmFsU2Vzc2lvbiBmcm9tICcuLi9saWIvdGVybWluYWwtc2Vzc2lvbic7XG5cbi8vIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbi8vXG4vLyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbi8vIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbmRlc2NyaWJlKCdUZXJtaW5hbFRhYicsICgpID0+IHtcbiAgbGV0IHdvcmtzcGFjZUVsZW1lbnQsIGFjdGl2YXRpb25Qcm9taXNlO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgIGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3Rlcm1pbmFsLXRhYicpO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgdGVybWluYWw6b3BlbiBldmVudCBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG5cbiAgICBpdCgnb3BlbnMgYSBuZXcgdGVybWluYWwnLCAoKSA9PiB7XG5cbiAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSB0ZXJtaW5hbCB2aWV3IGVsZW1lbnQgaXMgbm90IHByZXNlbnQgaW4gdGhlIHdvcmtzcGFjZS5cbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3Rlcm1pbmFsLXZpZXcnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgbGV0IHRlcm1pbmFsUHJvbWlzZSA9IGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3Rlcm1pbmFsOm9wZW4nKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRpb25Qcm9taXNlO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiB0ZXJtaW5hbFByb21pc2U7XG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGhlIHRlcm1pbmFsIHZpZXcgZWxlbWVudCBpcyBwcmVzZW50IGluIHRoZSB3b3Jrc3BhY2UuXG4gICAgICAgIGNvbnN0IHRlcm1pbmFsVmlld0VsZW1lbnQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3Rlcm1pbmFsLXZpZXcnKTtcbiAgICAgICAgZXhwZWN0KHRlcm1pbmFsVmlld0VsZW1lbnQpLnRvRXhpc3QoKTtcblxuICAgICAgICAvLyBFbnN1cmUgdGhhdCB0aGUgYm90dG9tIGRvY2sgaXMgdmlzaWJsZS5cbiAgICAgICAgbGV0IGJvdHRvbURvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21Eb2NrKCk7XG4gICAgICAgIGV4cGVjdChib3R0b21Eb2NrLmlzVmlzaWJsZSgpKS50b0JlKHRydWUpO1xuXG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSB0ZXJtaW5hbCB2aWV3IGlzIHByZXNlbnQgaW4gdGhlIGJvdHRvbSBkb2NrJ3MgcGFuZS5cbiAgICAgICAgbGV0IGFjdGl2ZVBhbmVJdGVtID0gYm90dG9tRG9jay5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuICAgICAgICBleHBlY3QoYWN0aXZlUGFuZUl0ZW0pLnRvQmVJbnN0YW5jZU9mKFRlcm1pbmFsU2Vzc2lvbik7XG4gICAgICAgIGxldCB0ZXJtaW5hbFZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYWN0aXZlUGFuZUl0ZW0pO1xuICAgICAgICBleHBlY3QodGVybWluYWxWaWV3KS50b0VxdWFsKHRlcm1pbmFsVmlld0VsZW1lbnQpO1xuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9KTtcbn0pO1xuIl19