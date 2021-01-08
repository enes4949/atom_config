Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _consumed = require("./consumed");

var _consumed2 = _interopRequireDefault(_consumed);

var _provided = require("./provided");

var _provided2 = _interopRequireDefault(_provided);

exports["default"] = { consumed: _consumed2["default"], provided: _provided2["default"] };

/**
 * # Hydrogen <img src="https://cdn.rawgit.com/nteract/hydrogen/17eda245/static/animate-logo.svg" alt="hydrogen animated logo" height="50px" align="right" />
 *
 * ## Services API
 *
 * The [Atom Services API](https://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/) is a way for Atom packages to interact with each other. Hydrogen both provides and consumes *services* to add additional features to itself. `./lib/services` is our container folder for anything that functions through the [Atom Services API](https://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/). If the service is considered a *provided service*, then it is located inside of `./lib/services/provided`. If the service, however, is considered a *consumed service*, then it is located inside of `./lib/services/consumed`.
 *
 * ### Consumed Services
 * - [Status Bar Tile: `status-bar`](./consumed/status-bar/status-bar.js)
 *    - This allows us to add kernel controls to the status bar.
 * - [Autocomplete For Any Editor: `autocomplete-plus`](./consumed/autocomplete.js)
 *    - This allows us to add autocomplete to things like watches.
 *
 * ### Provided Services
 * - [Autocomplete Results: `autocomplete-plus`](./provided/autocomplete.js)
 *    - This allows us to provide autocomplete results that are similiar to jupyter's tab completion.
 *
 * ## License
 *
 * This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/nteract/hydrogen/blob/master/LICENSE.md) file for details.
 */
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc2VydmljZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3dCQUVxQixZQUFZOzs7O3dCQUNaLFlBQVk7Ozs7cUJBRWxCLEVBQUUsUUFBUSx1QkFBQSxFQUFFLFFBQVEsdUJBQUEsRUFBRSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3NlcnZpY2VzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGNvbnN1bWVkIGZyb20gXCIuL2NvbnN1bWVkXCI7XG5pbXBvcnQgcHJvdmlkZWQgZnJvbSBcIi4vcHJvdmlkZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgeyBjb25zdW1lZCwgcHJvdmlkZWQgfTtcblxuLyoqXG4gKiAjIEh5ZHJvZ2VuIDxpbWcgc3JjPVwiaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9udGVyYWN0L2h5ZHJvZ2VuLzE3ZWRhMjQ1L3N0YXRpYy9hbmltYXRlLWxvZ28uc3ZnXCIgYWx0PVwiaHlkcm9nZW4gYW5pbWF0ZWQgbG9nb1wiIGhlaWdodD1cIjUwcHhcIiBhbGlnbj1cInJpZ2h0XCIgLz5cbiAqXG4gKiAjIyBTZXJ2aWNlcyBBUElcbiAqXG4gKiBUaGUgW0F0b20gU2VydmljZXMgQVBJXShodHRwczovL2ZsaWdodC1tYW51YWwuYXRvbS5pby9iZWhpbmQtYXRvbS9zZWN0aW9ucy9pbnRlcmFjdGluZy13aXRoLW90aGVyLXBhY2thZ2VzLXZpYS1zZXJ2aWNlcy8pIGlzIGEgd2F5IGZvciBBdG9tIHBhY2thZ2VzIHRvIGludGVyYWN0IHdpdGggZWFjaCBvdGhlci4gSHlkcm9nZW4gYm90aCBwcm92aWRlcyBhbmQgY29uc3VtZXMgKnNlcnZpY2VzKiB0byBhZGQgYWRkaXRpb25hbCBmZWF0dXJlcyB0byBpdHNlbGYuIGAuL2xpYi9zZXJ2aWNlc2AgaXMgb3VyIGNvbnRhaW5lciBmb2xkZXIgZm9yIGFueXRoaW5nIHRoYXQgZnVuY3Rpb25zIHRocm91Z2ggdGhlIFtBdG9tIFNlcnZpY2VzIEFQSV0oaHR0cHM6Ly9mbGlnaHQtbWFudWFsLmF0b20uaW8vYmVoaW5kLWF0b20vc2VjdGlvbnMvaW50ZXJhY3Rpbmctd2l0aC1vdGhlci1wYWNrYWdlcy12aWEtc2VydmljZXMvKS4gSWYgdGhlIHNlcnZpY2UgaXMgY29uc2lkZXJlZCBhICpwcm92aWRlZCBzZXJ2aWNlKiwgdGhlbiBpdCBpcyBsb2NhdGVkIGluc2lkZSBvZiBgLi9saWIvc2VydmljZXMvcHJvdmlkZWRgLiBJZiB0aGUgc2VydmljZSwgaG93ZXZlciwgaXMgY29uc2lkZXJlZCBhICpjb25zdW1lZCBzZXJ2aWNlKiwgdGhlbiBpdCBpcyBsb2NhdGVkIGluc2lkZSBvZiBgLi9saWIvc2VydmljZXMvY29uc3VtZWRgLlxuICpcbiAqICMjIyBDb25zdW1lZCBTZXJ2aWNlc1xuICogLSBbU3RhdHVzIEJhciBUaWxlOiBgc3RhdHVzLWJhcmBdKC4vY29uc3VtZWQvc3RhdHVzLWJhci9zdGF0dXMtYmFyLmpzKVxuICogICAgLSBUaGlzIGFsbG93cyB1cyB0byBhZGQga2VybmVsIGNvbnRyb2xzIHRvIHRoZSBzdGF0dXMgYmFyLlxuICogLSBbQXV0b2NvbXBsZXRlIEZvciBBbnkgRWRpdG9yOiBgYXV0b2NvbXBsZXRlLXBsdXNgXSguL2NvbnN1bWVkL2F1dG9jb21wbGV0ZS5qcylcbiAqICAgIC0gVGhpcyBhbGxvd3MgdXMgdG8gYWRkIGF1dG9jb21wbGV0ZSB0byB0aGluZ3MgbGlrZSB3YXRjaGVzLlxuICpcbiAqICMjIyBQcm92aWRlZCBTZXJ2aWNlc1xuICogLSBbQXV0b2NvbXBsZXRlIFJlc3VsdHM6IGBhdXRvY29tcGxldGUtcGx1c2BdKC4vcHJvdmlkZWQvYXV0b2NvbXBsZXRlLmpzKVxuICogICAgLSBUaGlzIGFsbG93cyB1cyB0byBwcm92aWRlIGF1dG9jb21wbGV0ZSByZXN1bHRzIHRoYXQgYXJlIHNpbWlsaWFyIHRvIGp1cHl0ZXIncyB0YWIgY29tcGxldGlvbi5cbiAqXG4gKiAjIyBMaWNlbnNlXG4gKlxuICogVGhpcyBwcm9qZWN0IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAtIHNlZSB0aGUgW0xJQ0VOU0UubWRdKGh0dHBzOi8vZ2l0aHViLmNvbS9udGVyYWN0L2h5ZHJvZ2VuL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQpIGZpbGUgZm9yIGRldGFpbHMuXG4gKi9cbiJdfQ==