Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

/**
 * This acts as a global storage for the consumed service.
 */

var AutocompleteWatchEditor = (function () {
  function AutocompleteWatchEditor() {
    _classCallCheck(this, AutocompleteWatchEditor);

    this.addAutocompleteToEditor = function (editor, labels) {
      return;
    };

    this.isEnabeled = false;
  }

  _createClass(AutocompleteWatchEditor, [{
    key: "consume",

    /**
     * This function is called on activation of autocomplete, or if autocomplete is
     * already active, then it is called when hydrogen activates.
     *
     * @param {Store} store - The global Hydrogen store.
     * @param {Function} watchEditor - The function provided by `autocomplete.watchEditor`.
     * @returns {Disposable} - This is for clean up when autocomplete or hydrogen deactivate.
     */
    value: function consume(store, watchEditor) {
      var _this = this;

      this.disposables = new _atom.CompositeDisposable();
      this.addAutocompleteToEditor = watchEditor;

      // Add autocomplete capabilities to already existing watches
      for (var kernel of store.runningKernels) {
        var watchesStoreDisposable = new _atom.CompositeDisposable();
        kernel.watchesStore.autocompleteDisposables = watchesStoreDisposable;
        this.disposables.add(watchesStoreDisposable);
        for (var watch of kernel.watchesStore.watches) {
          this.addAutocompleteToWatch(kernel.watchesStore, watch);
        }
      }
      this.isEnabeled = true;
      var disposable = new _atom.Disposable(function () {
        return _this.disable(store);
      });
      store.subscriptions.add(disposable);
      return disposable;
    }

    /**
     * This function is just for cleaning up when either autocomplete or hydrogen is deactivating.
     *
     * @param {Store} store - The global Hydrogen store.
     */
  }, {
    key: "disable",
    value: function disable(store) {
      // Removes the consumed function `watchEditor`
      this.addAutocompleteToEditor = function (editor, labels) {
        return;
      };

      /*
       * Removes disposables from all watches (leaves references inside
       * `this.disposables` to be disposed at the end).
       * Autocomplete is only actually disabled on dispose of `this.disposables`
       */
      for (var kernel of store.runningKernels) {
        for (var watch of kernel.watchesStore.watches) {
          watch.autocompleteDisposable = null;
        }
        kernel.watchesStore.autocompleteDisposables = null;
      }

      // Disables autocomplete, Cleans up everything, and Resets.
      this.disposables.dispose();
      this.isEnabeled = false;
    }

    /**
     * This function is for adding autocomplete capabilities to a watch.
     *
     * @param {WatchesStore} watchesStore - This should always be the parent `WatchesStore` of `watch`.
     * @param {WatchStore} watch - The watch to add autocomplete to.
     */
  }, {
    key: "addAutocompleteToWatch",
    value: function addAutocompleteToWatch(watchesStore, watch) {
      var disposable = this.addAutocompleteToEditor(watch.editor, ["default", "workspace-center", "symbol-provider"]);
      if (disposable) {
        watch.autocompleteDisposable = disposable;
        if (watchesStore.autocompleteDisposables) watchesStore.autocompleteDisposables.add(disposable);
      }
    }

    /**
     * This function is for removing autocomplete capabilities from a watch.
     *
     * @param {WatchesStore} watchesStore - This should always be the parent `WatchesStore` of `watch`.
     * @param {WatchStore} watch - The watch to remove autocomplete from.
     */
  }, {
    key: "removeAutocompleteFromWatch",
    value: function removeAutocompleteFromWatch(watchesStore, watch) {
      var disposable = watch.autocompleteDisposable;
      if (disposable) {
        if (watchesStore.autocompleteDisposables) watchesStore.autocompleteDisposables.remove(disposable);
        disposable.dispose();
        watch.autocompleteDisposable = null;
      }
    }

    /**
     * Removes and disposes an autocomplete disposable
     *
     * @param {Disposable | CompositeDisposable} disposable
     */
  }, {
    key: "dispose",
    value: function dispose(disposable) {
      this.disposables.remove(disposable);
      disposable.dispose();
    }

    /**
     * Adds a disposable as an autocomplete disposable.
     *
     * @param {Disposable | CompositeDisposable} disposable
     */
  }, {
    key: "register",
    value: function register(disposable) {
      this.disposables.add(disposable);
    }
  }]);

  return AutocompleteWatchEditor;
})();

exports.AutocompleteWatchEditor = AutocompleteWatchEditor;

var autocompleteConsumer = new AutocompleteWatchEditor();
exports["default"] = autocompleteConsumer;

/** The `consumed autocompleteWatchEditor` */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc2VydmljZXMvY29uc3VtZWQvYXV0b2NvbXBsZXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVnRCxNQUFNOzs7Ozs7SUFTekMsdUJBQXVCO1dBQXZCLHVCQUF1QjswQkFBdkIsdUJBQXVCOztTQUdsQyx1QkFBdUIsR0FBRyxVQUN4QixNQUFNLEVBQ04sTUFBTSxFQUNIO0FBQ0gsYUFBTztLQUNSOztTQUNELFVBQVUsR0FBWSxLQUFLOzs7ZUFUaEIsdUJBQXVCOzs7Ozs7Ozs7OztXQW1CM0IsaUJBQUMsS0FBWSxFQUFFLFdBQXlDLEVBQUU7OztBQUMvRCxVQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFDO0FBQzdDLFVBQUksQ0FBQyx1QkFBdUIsR0FBRyxXQUFXLENBQUM7OztBQUczQyxXQUFLLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7QUFDdkMsWUFBTSxzQkFBc0IsR0FBRywrQkFBeUIsQ0FBQztBQUN6RCxjQUFNLENBQUMsWUFBWSxDQUFDLHVCQUF1QixHQUFHLHNCQUFzQixDQUFDO0FBQ3JFLFlBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDN0MsYUFBSyxJQUFJLEtBQUssSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtBQUM3QyxjQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN6RDtPQUNGO0FBQ0QsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsVUFBTSxVQUFVLEdBQUcscUJBQWU7ZUFBTSxNQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDN0QsV0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsYUFBTyxVQUFVLENBQUM7S0FDbkI7Ozs7Ozs7OztXQU9NLGlCQUFDLEtBQVksRUFBRTs7QUFFcEIsVUFBSSxDQUFDLHVCQUF1QixHQUFHLFVBQzdCLE1BQU0sRUFDTixNQUFNLEVBQ0g7QUFDSCxlQUFPO09BQ1IsQ0FBQzs7Ozs7OztBQU9GLFdBQUssSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtBQUN2QyxhQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO0FBQzdDLGVBQUssQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7U0FDckM7QUFDRCxjQUFNLENBQUMsWUFBWSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztPQUNwRDs7O0FBR0QsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQixVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztLQUN6Qjs7Ozs7Ozs7OztXQVFxQixnQ0FBQyxZQUEwQixFQUFFLEtBQWlCLEVBQUU7QUFDcEUsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FDNUQsU0FBUyxFQUNULGtCQUFrQixFQUNsQixpQkFBaUIsQ0FDbEIsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxVQUFVLEVBQUU7QUFDZCxhQUFLLENBQUMsc0JBQXNCLEdBQUcsVUFBVSxDQUFDO0FBQzFDLFlBQUksWUFBWSxDQUFDLHVCQUF1QixFQUN0QyxZQUFZLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ3hEO0tBQ0Y7Ozs7Ozs7Ozs7V0FRMEIscUNBQUMsWUFBMEIsRUFBRSxLQUFpQixFQUFFO0FBQ3pFLFVBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztBQUNoRCxVQUFJLFVBQVUsRUFBRTtBQUNkLFlBQUksWUFBWSxDQUFDLHVCQUF1QixFQUN0QyxZQUFZLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFELGtCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckIsYUFBSyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztPQUNyQztLQUNGOzs7Ozs7Ozs7V0FPTSxpQkFBQyxVQUE0QyxFQUFFO0FBQ3BELFVBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLGdCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDdEI7Ozs7Ozs7OztXQU9PLGtCQUFDLFVBQTRDLEVBQUU7QUFDckQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDbEM7OztTQXpIVSx1QkFBdUI7Ozs7O0FBNEhwQyxJQUFNLG9CQUFvQixHQUFHLElBQUksdUJBQXVCLEVBQUUsQ0FBQztxQkFDNUMsb0JBQW9CIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc2VydmljZXMvY29uc3VtZWQvYXV0b2NvbXBsZXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5cbmltcG9ydCB0eXBlIHsgU3RvcmUgfSBmcm9tIFwiLi4vLi4vc3RvcmVcIjtcbmltcG9ydCB0eXBlIFdhdGNoZXNTdG9yZSBmcm9tIFwiLi4vLi4vc3RvcmUvd2F0Y2hlc1wiO1xuaW1wb3J0IHR5cGUgV2F0Y2hTdG9yZSBmcm9tIFwiLi4vLi4vc3RvcmUvd2F0Y2hcIjtcblxuLyoqXG4gKiBUaGlzIGFjdHMgYXMgYSBnbG9iYWwgc3RvcmFnZSBmb3IgdGhlIGNvbnN1bWVkIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRvY29tcGxldGVXYXRjaEVkaXRvciB7XG4gIGRpc3Bvc2FibGVzOiBhdG9tJENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIC8qKiBUaGUgYGNvbnN1bWVkIGF1dG9jb21wbGV0ZVdhdGNoRWRpdG9yYCAqL1xuICBhZGRBdXRvY29tcGxldGVUb0VkaXRvciA9IChcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBsYWJlbHM6IEFycmF5PHN0cmluZz5cbiAgKSA9PiB7XG4gICAgcmV0dXJuO1xuICB9O1xuICBpc0VuYWJlbGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGFjdGl2YXRpb24gb2YgYXV0b2NvbXBsZXRlLCBvciBpZiBhdXRvY29tcGxldGUgaXNcbiAgICogYWxyZWFkeSBhY3RpdmUsIHRoZW4gaXQgaXMgY2FsbGVkIHdoZW4gaHlkcm9nZW4gYWN0aXZhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBnbG9iYWwgSHlkcm9nZW4gc3RvcmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHdhdGNoRWRpdG9yIC0gVGhlIGZ1bmN0aW9uIHByb3ZpZGVkIGJ5IGBhdXRvY29tcGxldGUud2F0Y2hFZGl0b3JgLlxuICAgKiBAcmV0dXJucyB7RGlzcG9zYWJsZX0gLSBUaGlzIGlzIGZvciBjbGVhbiB1cCB3aGVuIGF1dG9jb21wbGV0ZSBvciBoeWRyb2dlbiBkZWFjdGl2YXRlLlxuICAgKi9cbiAgY29uc3VtZShzdG9yZTogU3RvcmUsIHdhdGNoRWRpdG9yOiBhdG9tJEF1dG9jb21wbGV0ZVdhdGNoRWRpdG9yKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5hZGRBdXRvY29tcGxldGVUb0VkaXRvciA9IHdhdGNoRWRpdG9yO1xuXG4gICAgLy8gQWRkIGF1dG9jb21wbGV0ZSBjYXBhYmlsaXRpZXMgdG8gYWxyZWFkeSBleGlzdGluZyB3YXRjaGVzXG4gICAgZm9yIChsZXQga2VybmVsIG9mIHN0b3JlLnJ1bm5pbmdLZXJuZWxzKSB7XG4gICAgICBjb25zdCB3YXRjaGVzU3RvcmVEaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICAgIGtlcm5lbC53YXRjaGVzU3RvcmUuYXV0b2NvbXBsZXRlRGlzcG9zYWJsZXMgPSB3YXRjaGVzU3RvcmVEaXNwb3NhYmxlO1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQod2F0Y2hlc1N0b3JlRGlzcG9zYWJsZSk7XG4gICAgICBmb3IgKGxldCB3YXRjaCBvZiBrZXJuZWwud2F0Y2hlc1N0b3JlLndhdGNoZXMpIHtcbiAgICAgICAgdGhpcy5hZGRBdXRvY29tcGxldGVUb1dhdGNoKGtlcm5lbC53YXRjaGVzU3RvcmUsIHdhdGNoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pc0VuYWJlbGVkID0gdHJ1ZTtcbiAgICBjb25zdCBkaXNwb3NhYmxlID0gbmV3IERpc3Bvc2FibGUoKCkgPT4gdGhpcy5kaXNhYmxlKHN0b3JlKSk7XG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoZGlzcG9zYWJsZSk7XG4gICAgcmV0dXJuIGRpc3Bvc2FibGU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBqdXN0IGZvciBjbGVhbmluZyB1cCB3aGVuIGVpdGhlciBhdXRvY29tcGxldGUgb3IgaHlkcm9nZW4gaXMgZGVhY3RpdmF0aW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSAtIFRoZSBnbG9iYWwgSHlkcm9nZW4gc3RvcmUuXG4gICAqL1xuICBkaXNhYmxlKHN0b3JlOiBTdG9yZSkge1xuICAgIC8vIFJlbW92ZXMgdGhlIGNvbnN1bWVkIGZ1bmN0aW9uIGB3YXRjaEVkaXRvcmBcbiAgICB0aGlzLmFkZEF1dG9jb21wbGV0ZVRvRWRpdG9yID0gKFxuICAgICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAgICBsYWJlbHM6IEFycmF5PHN0cmluZz5cbiAgICApID0+IHtcbiAgICAgIHJldHVybjtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBSZW1vdmVzIGRpc3Bvc2FibGVzIGZyb20gYWxsIHdhdGNoZXMgKGxlYXZlcyByZWZlcmVuY2VzIGluc2lkZVxuICAgICAqIGB0aGlzLmRpc3Bvc2FibGVzYCB0byBiZSBkaXNwb3NlZCBhdCB0aGUgZW5kKS5cbiAgICAgKiBBdXRvY29tcGxldGUgaXMgb25seSBhY3R1YWxseSBkaXNhYmxlZCBvbiBkaXNwb3NlIG9mIGB0aGlzLmRpc3Bvc2FibGVzYFxuICAgICAqL1xuICAgIGZvciAobGV0IGtlcm5lbCBvZiBzdG9yZS5ydW5uaW5nS2VybmVscykge1xuICAgICAgZm9yIChsZXQgd2F0Y2ggb2Yga2VybmVsLndhdGNoZXNTdG9yZS53YXRjaGVzKSB7XG4gICAgICAgIHdhdGNoLmF1dG9jb21wbGV0ZURpc3Bvc2FibGUgPSBudWxsO1xuICAgICAgfVxuICAgICAga2VybmVsLndhdGNoZXNTdG9yZS5hdXRvY29tcGxldGVEaXNwb3NhYmxlcyA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gRGlzYWJsZXMgYXV0b2NvbXBsZXRlLCBDbGVhbnMgdXAgZXZlcnl0aGluZywgYW5kIFJlc2V0cy5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmlzRW5hYmVsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGZvciBhZGRpbmcgYXV0b2NvbXBsZXRlIGNhcGFiaWxpdGllcyB0byBhIHdhdGNoLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdGNoZXNTdG9yZX0gd2F0Y2hlc1N0b3JlIC0gVGhpcyBzaG91bGQgYWx3YXlzIGJlIHRoZSBwYXJlbnQgYFdhdGNoZXNTdG9yZWAgb2YgYHdhdGNoYC5cbiAgICogQHBhcmFtIHtXYXRjaFN0b3JlfSB3YXRjaCAtIFRoZSB3YXRjaCB0byBhZGQgYXV0b2NvbXBsZXRlIHRvLlxuICAgKi9cbiAgYWRkQXV0b2NvbXBsZXRlVG9XYXRjaCh3YXRjaGVzU3RvcmU6IFdhdGNoZXNTdG9yZSwgd2F0Y2g6IFdhdGNoU3RvcmUpIHtcbiAgICBjb25zdCBkaXNwb3NhYmxlID0gdGhpcy5hZGRBdXRvY29tcGxldGVUb0VkaXRvcih3YXRjaC5lZGl0b3IsIFtcbiAgICAgIFwiZGVmYXVsdFwiLFxuICAgICAgXCJ3b3Jrc3BhY2UtY2VudGVyXCIsXG4gICAgICBcInN5bWJvbC1wcm92aWRlclwiLFxuICAgIF0pO1xuICAgIGlmIChkaXNwb3NhYmxlKSB7XG4gICAgICB3YXRjaC5hdXRvY29tcGxldGVEaXNwb3NhYmxlID0gZGlzcG9zYWJsZTtcbiAgICAgIGlmICh3YXRjaGVzU3RvcmUuYXV0b2NvbXBsZXRlRGlzcG9zYWJsZXMpXG4gICAgICAgIHdhdGNoZXNTdG9yZS5hdXRvY29tcGxldGVEaXNwb3NhYmxlcy5hZGQoZGlzcG9zYWJsZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgZm9yIHJlbW92aW5nIGF1dG9jb21wbGV0ZSBjYXBhYmlsaXRpZXMgZnJvbSBhIHdhdGNoLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdGNoZXNTdG9yZX0gd2F0Y2hlc1N0b3JlIC0gVGhpcyBzaG91bGQgYWx3YXlzIGJlIHRoZSBwYXJlbnQgYFdhdGNoZXNTdG9yZWAgb2YgYHdhdGNoYC5cbiAgICogQHBhcmFtIHtXYXRjaFN0b3JlfSB3YXRjaCAtIFRoZSB3YXRjaCB0byByZW1vdmUgYXV0b2NvbXBsZXRlIGZyb20uXG4gICAqL1xuICByZW1vdmVBdXRvY29tcGxldGVGcm9tV2F0Y2god2F0Y2hlc1N0b3JlOiBXYXRjaGVzU3RvcmUsIHdhdGNoOiBXYXRjaFN0b3JlKSB7XG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IHdhdGNoLmF1dG9jb21wbGV0ZURpc3Bvc2FibGU7XG4gICAgaWYgKGRpc3Bvc2FibGUpIHtcbiAgICAgIGlmICh3YXRjaGVzU3RvcmUuYXV0b2NvbXBsZXRlRGlzcG9zYWJsZXMpXG4gICAgICAgIHdhdGNoZXNTdG9yZS5hdXRvY29tcGxldGVEaXNwb3NhYmxlcy5yZW1vdmUoZGlzcG9zYWJsZSk7XG4gICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgIHdhdGNoLmF1dG9jb21wbGV0ZURpc3Bvc2FibGUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCBkaXNwb3NlcyBhbiBhdXRvY29tcGxldGUgZGlzcG9zYWJsZVxuICAgKlxuICAgKiBAcGFyYW0ge0Rpc3Bvc2FibGUgfCBDb21wb3NpdGVEaXNwb3NhYmxlfSBkaXNwb3NhYmxlXG4gICAqL1xuICBkaXNwb3NlKGRpc3Bvc2FibGU6IERpc3Bvc2FibGUgfCBDb21wb3NpdGVEaXNwb3NhYmxlKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5yZW1vdmUoZGlzcG9zYWJsZSk7XG4gICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGRpc3Bvc2FibGUgYXMgYW4gYXV0b2NvbXBsZXRlIGRpc3Bvc2FibGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RGlzcG9zYWJsZSB8IENvbXBvc2l0ZURpc3Bvc2FibGV9IGRpc3Bvc2FibGVcbiAgICovXG4gIHJlZ2lzdGVyKGRpc3Bvc2FibGU6IERpc3Bvc2FibGUgfCBDb21wb3NpdGVEaXNwb3NhYmxlKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZGlzcG9zYWJsZSk7XG4gIH1cbn1cblxuY29uc3QgYXV0b2NvbXBsZXRlQ29uc3VtZXIgPSBuZXcgQXV0b2NvbXBsZXRlV2F0Y2hFZGl0b3IoKTtcbmV4cG9ydCBkZWZhdWx0IGF1dG9jb21wbGV0ZUNvbnN1bWVyO1xuIl19