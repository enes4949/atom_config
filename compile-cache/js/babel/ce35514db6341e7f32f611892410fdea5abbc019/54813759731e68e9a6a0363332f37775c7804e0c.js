function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libCheatsheet = require('../lib/cheatsheet');

var _libCheatsheet2 = _interopRequireDefault(_libCheatsheet);

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

'use babel';

describe('Cheatsheet', function () {
  var workspaceElement = undefined,
      activationPromise = undefined;

  beforeEach(function () {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('cheatsheet');
  });

  describe('when the cheatsheet:toggle event is triggered', function () {
    it('hides and shows the modal panel', function () {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.cheatsheet')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'cheatsheet:toggle');

      waitsForPromise(function () {
        return activationPromise;
      });

      runs(function () {
        expect(workspaceElement.querySelector('.cheatsheet')).toExist();

        var cheatsheetElement = workspaceElement.querySelector('.cheatsheet');
        expect(cheatsheetElement).toExist();

        var cheatsheetPanel = atom.workspace.panelForItem(cheatsheetElement);
        expect(cheatsheetPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'cheatsheet:toggle');
        expect(cheatsheetPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', function () {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.cheatsheet')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'cheatsheet:toggle');

      waitsForPromise(function () {
        return activationPromise;
      });

      runs(function () {
        // Now we can test for view visibility
        var cheatsheetElement = workspaceElement.querySelector('.cheatsheet');
        expect(cheatsheetElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'cheatsheet:toggle');
        expect(cheatsheetElement).not.toBeVisible();
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9jaGVhdHNoZWV0L3NwZWMvY2hlYXRzaGVldC1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzZCQUV1QixtQkFBbUI7Ozs7Ozs7OztBQUYxQyxXQUFXLENBQUM7O0FBU1osUUFBUSxDQUFDLFlBQVksRUFBRSxZQUFNO0FBQzNCLE1BQUksZ0JBQWdCLFlBQUE7TUFBRSxpQkFBaUIsWUFBQSxDQUFDOztBQUV4QyxZQUFVLENBQUMsWUFBTTtBQUNmLG9CQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RCxxQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNqRSxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLCtDQUErQyxFQUFFLFlBQU07QUFDOUQsTUFBRSxDQUFDLGlDQUFpQyxFQUFFLFlBQU07OztBQUcxQyxZQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDOzs7O0FBSXBFLFVBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLENBQUM7O0FBRTlELHFCQUFlLENBQUMsWUFBTTtBQUNwQixlQUFPLGlCQUFpQixDQUFDO09BQzFCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsWUFBTTtBQUNULGNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFaEUsWUFBSSxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEUsY0FBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRXBDLFlBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDckUsY0FBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxZQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlELGNBQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDakQsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQywwQkFBMEIsRUFBRSxZQUFNOzs7Ozs7O0FBT25DLGFBQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFdEMsWUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7OztBQUlwRSxVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztBQUU5RCxxQkFBZSxDQUFDLFlBQU07QUFDcEIsZUFBTyxpQkFBaUIsQ0FBQztPQUMxQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQU07O0FBRVQsWUFBSSxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEUsY0FBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDeEMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUM5RCxjQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7T0FDN0MsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9jaGVhdHNoZWV0L3NwZWMvY2hlYXRzaGVldC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBDaGVhdHNoZWV0IGZyb20gJy4uL2xpYi9jaGVhdHNoZWV0JztcblxuLy8gVXNlIHRoZSBjb21tYW5kIGB3aW5kb3c6cnVuLXBhY2thZ2Utc3BlY3NgIChjbWQtYWx0LWN0cmwtcCkgdG8gcnVuIHNwZWNzLlxuLy9cbi8vIFRvIHJ1biBhIHNwZWNpZmljIGBpdGAgb3IgYGRlc2NyaWJlYCBibG9jayBhZGQgYW4gYGZgIHRvIHRoZSBmcm9udCAoZS5nLiBgZml0YFxuLy8gb3IgYGZkZXNjcmliZWApLiBSZW1vdmUgdGhlIGBmYCB0byB1bmZvY3VzIHRoZSBibG9jay5cblxuZGVzY3JpYmUoJ0NoZWF0c2hlZXQnLCAoKSA9PiB7XG4gIGxldCB3b3Jrc3BhY2VFbGVtZW50LCBhY3RpdmF0aW9uUHJvbWlzZTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdjaGVhdHNoZWV0Jyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBjaGVhdHNoZWV0OnRvZ2dsZSBldmVudCBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgaXQoJ2hpZGVzIGFuZCBzaG93cyB0aGUgbW9kYWwgcGFuZWwnLCAoKSA9PiB7XG4gICAgICAvLyBCZWZvcmUgdGhlIGFjdGl2YXRpb24gZXZlbnQgdGhlIHZpZXcgaXMgbm90IG9uIHRoZSBET00sIGFuZCBubyBwYW5lbFxuICAgICAgLy8gaGFzIGJlZW4gY3JlYXRlZFxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNoZWF0c2hlZXQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgLy8gVGhpcyBpcyBhbiBhY3RpdmF0aW9uIGV2ZW50LCB0cmlnZ2VyaW5nIGl0IHdpbGwgY2F1c2UgdGhlIHBhY2thZ2UgdG8gYmVcbiAgICAgIC8vIGFjdGl2YXRlZC5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2NoZWF0c2hlZXQ6dG9nZ2xlJyk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhY3RpdmF0aW9uUHJvbWlzZTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNoZWF0c2hlZXQnKSkudG9FeGlzdCgpO1xuXG4gICAgICAgIGxldCBjaGVhdHNoZWV0RWxlbWVudCA9IHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNoZWF0c2hlZXQnKTtcbiAgICAgICAgZXhwZWN0KGNoZWF0c2hlZXRFbGVtZW50KS50b0V4aXN0KCk7XG5cbiAgICAgICAgbGV0IGNoZWF0c2hlZXRQYW5lbCA9IGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShjaGVhdHNoZWV0RWxlbWVudCk7XG4gICAgICAgIGV4cGVjdChjaGVhdHNoZWV0UGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2NoZWF0c2hlZXQ6dG9nZ2xlJyk7XG4gICAgICAgIGV4cGVjdChjaGVhdHNoZWV0UGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaGlkZXMgYW5kIHNob3dzIHRoZSB2aWV3JywgKCkgPT4ge1xuICAgICAgLy8gVGhpcyB0ZXN0IHNob3dzIHlvdSBhbiBpbnRlZ3JhdGlvbiB0ZXN0IHRlc3RpbmcgYXQgdGhlIHZpZXcgbGV2ZWwuXG5cbiAgICAgIC8vIEF0dGFjaGluZyB0aGUgd29ya3NwYWNlRWxlbWVudCB0byB0aGUgRE9NIGlzIHJlcXVpcmVkIHRvIGFsbG93IHRoZVxuICAgICAgLy8gYHRvQmVWaXNpYmxlKClgIG1hdGNoZXJzIHRvIHdvcmsuIEFueXRoaW5nIHRlc3RpbmcgdmlzaWJpbGl0eSBvciBmb2N1c1xuICAgICAgLy8gcmVxdWlyZXMgdGhhdCB0aGUgd29ya3NwYWNlRWxlbWVudCBpcyBvbiB0aGUgRE9NLiBUZXN0cyB0aGF0IGF0dGFjaCB0aGVcbiAgICAgIC8vIHdvcmtzcGFjZUVsZW1lbnQgdG8gdGhlIERPTSBhcmUgZ2VuZXJhbGx5IHNsb3dlciB0aGFuIHRob3NlIG9mZiBET00uXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuXG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2hlYXRzaGVldCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICAvLyBUaGlzIGlzIGFuIGFjdGl2YXRpb24gZXZlbnQsIHRyaWdnZXJpbmcgaXQgY2F1c2VzIHRoZSBwYWNrYWdlIHRvIGJlXG4gICAgICAvLyBhY3RpdmF0ZWQuXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdjaGVhdHNoZWV0OnRvZ2dsZScpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYWN0aXZhdGlvblByb21pc2U7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gdGVzdCBmb3IgdmlldyB2aXNpYmlsaXR5XG4gICAgICAgIGxldCBjaGVhdHNoZWV0RWxlbWVudCA9IHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNoZWF0c2hlZXQnKTtcbiAgICAgICAgZXhwZWN0KGNoZWF0c2hlZXRFbGVtZW50KS50b0JlVmlzaWJsZSgpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdjaGVhdHNoZWV0OnRvZ2dsZScpO1xuICAgICAgICBleHBlY3QoY2hlYXRzaGVldEVsZW1lbnQpLm5vdC50b0JlVmlzaWJsZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=