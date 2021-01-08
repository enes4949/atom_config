Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * The `HydrogenKernel` class wraps Hydrogen's internal representation of kernels
 * and exposes a small set of methods that should be usable by plugins.
 * @class HydrogenKernel
 */

var HydrogenKernel = (function () {
  function HydrogenKernel(_kernel) {
    _classCallCheck(this, HydrogenKernel);

    this._kernel = _kernel;
    this.destroyed = false;
  }

  _createClass(HydrogenKernel, [{
    key: "_assertNotDestroyed",
    value: function _assertNotDestroyed() {
      // Internal: plugins might hold references to long-destroyed kernels, so
      // all API calls should guard against this case
      if (this.destroyed) {
        throw new Error("HydrogenKernel: operation not allowed because the kernel has been destroyed");
      }
    }

    /*
     * The language of the kernel, as specified in its kernelspec
     */
  }, {
    key: "addMiddleware",

    /*
     * Add a kernel middleware, which allows intercepting and issuing commands to
     * the kernel.
     *
     * If the methods of a `middleware` object are added/modified/deleted after
     * `addMiddleware` has been called, the changes will take effect immediately.
     *
     * @param {HydrogenKernelMiddleware} middleware
     */
    value: function addMiddleware(middleware) {
      this._assertNotDestroyed();
      this._kernel.addMiddleware(middleware);
    }

    /*
     * Calls your callback when the kernel has been destroyed.
     * @param {Function} Callback
     */
  }, {
    key: "onDidDestroy",
    value: function onDidDestroy(callback) {
      this._assertNotDestroyed();
      this._kernel.emitter.on("did-destroy", callback);
    }

    /*
     * Get the [connection file](http://jupyter-notebook.readthedocs.io/en/latest/examples/Notebook/Connecting%20with%20the%20Qt%20Console.html) of the kernel.
     * @return {String} Path to connection file.
     */
  }, {
    key: "getConnectionFile",
    value: function getConnectionFile() {
      this._assertNotDestroyed();
      // $FlowFixMe
      var connectionFile = this._kernel.transport.connectionFile ? this._kernel.transport.connectionFile : null;
      if (!connectionFile) {
        throw new Error("No connection file for " + this._kernel.kernelSpec.display_name + " kernel found");
      }

      return connectionFile;
    }
  }, {
    key: "language",
    get: function get() {
      this._assertNotDestroyed();
      return this._kernel.language;
    }

    /*
     * The display name of the kernel, as specified in its kernelspec
     */
  }, {
    key: "displayName",
    get: function get() {
      this._assertNotDestroyed();
      return this._kernel.displayName;
    }
  }]);

  return HydrogenKernel;
})();

exports["default"] = HydrogenKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGx1Z2luLWFwaS9oeWRyb2dlbi1rZXJuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFXcUIsY0FBYztBQUl0QixXQUpRLGNBQWMsQ0FJckIsT0FBZSxFQUFFOzBCQUpWLGNBQWM7O0FBSy9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0dBQ3hCOztlQVBrQixjQUFjOztXQVNkLCtCQUFHOzs7QUFHcEIsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLGNBQU0sSUFBSSxLQUFLLENBQ2IsNkVBQTZFLENBQzlFLENBQUM7T0FDSDtLQUNGOzs7Ozs7Ozs7Ozs7Ozs7OztXQTJCWSx1QkFBQyxVQUFvQyxFQUFFO0FBQ2xELFVBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3hDOzs7Ozs7OztXQU1XLHNCQUFDLFFBQWtCLEVBQVE7QUFDckMsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDM0IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNsRDs7Ozs7Ozs7V0FNZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRTNCLFVBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUNyQyxJQUFJLENBQUM7QUFDVCxVQUFJLENBQUMsY0FBYyxFQUFFO0FBQ25CLGNBQU0sSUFBSSxLQUFLLDZCQUNhLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVksbUJBQy9ELENBQUM7T0FDSDs7QUFFRCxhQUFPLGNBQWMsQ0FBQztLQUN2Qjs7O1NBckRXLGVBQVc7QUFDckIsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDM0IsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztLQUM5Qjs7Ozs7OztTQUtjLGVBQVc7QUFDeEIsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDM0IsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztLQUNqQzs7O1NBakNrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BsdWdpbi1hcGkvaHlkcm9nZW4ta2VybmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHR5cGUgS2VybmVsIGZyb20gXCIuLy4uL2tlcm5lbFwiO1xuaW1wb3J0IHR5cGUgeyBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmUgfSBmcm9tIFwiLi9oeWRyb2dlbi10eXBlc1wiO1xuXG4vKlxuICogVGhlIGBIeWRyb2dlbktlcm5lbGAgY2xhc3Mgd3JhcHMgSHlkcm9nZW4ncyBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiBrZXJuZWxzXG4gKiBhbmQgZXhwb3NlcyBhIHNtYWxsIHNldCBvZiBtZXRob2RzIHRoYXQgc2hvdWxkIGJlIHVzYWJsZSBieSBwbHVnaW5zLlxuICogQGNsYXNzIEh5ZHJvZ2VuS2VybmVsXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHlkcm9nZW5LZXJuZWwge1xuICBfa2VybmVsOiBLZXJuZWw7XG4gIGRlc3Ryb3llZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihfa2VybmVsOiBLZXJuZWwpIHtcbiAgICB0aGlzLl9rZXJuZWwgPSBfa2VybmVsO1xuICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2U7XG4gIH1cblxuICBfYXNzZXJ0Tm90RGVzdHJveWVkKCkge1xuICAgIC8vIEludGVybmFsOiBwbHVnaW5zIG1pZ2h0IGhvbGQgcmVmZXJlbmNlcyB0byBsb25nLWRlc3Ryb3llZCBrZXJuZWxzLCBzb1xuICAgIC8vIGFsbCBBUEkgY2FsbHMgc2hvdWxkIGd1YXJkIGFnYWluc3QgdGhpcyBjYXNlXG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiSHlkcm9nZW5LZXJuZWw6IG9wZXJhdGlvbiBub3QgYWxsb3dlZCBiZWNhdXNlIHRoZSBrZXJuZWwgaGFzIGJlZW4gZGVzdHJveWVkXCJcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogVGhlIGxhbmd1YWdlIG9mIHRoZSBrZXJuZWwsIGFzIHNwZWNpZmllZCBpbiBpdHMga2VybmVsc3BlY1xuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90RGVzdHJveWVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2tlcm5lbC5sYW5ndWFnZTtcbiAgfVxuXG4gIC8qXG4gICAqIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGtlcm5lbCwgYXMgc3BlY2lmaWVkIGluIGl0cyBrZXJuZWxzcGVjXG4gICAqL1xuICBnZXQgZGlzcGxheU5hbWUoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnROb3REZXN0cm95ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fa2VybmVsLmRpc3BsYXlOYW1lO1xuICB9XG5cbiAgLypcbiAgICogQWRkIGEga2VybmVsIG1pZGRsZXdhcmUsIHdoaWNoIGFsbG93cyBpbnRlcmNlcHRpbmcgYW5kIGlzc3VpbmcgY29tbWFuZHMgdG9cbiAgICogdGhlIGtlcm5lbC5cbiAgICpcbiAgICogSWYgdGhlIG1ldGhvZHMgb2YgYSBgbWlkZGxld2FyZWAgb2JqZWN0IGFyZSBhZGRlZC9tb2RpZmllZC9kZWxldGVkIGFmdGVyXG4gICAqIGBhZGRNaWRkbGV3YXJlYCBoYXMgYmVlbiBjYWxsZWQsIHRoZSBjaGFuZ2VzIHdpbGwgdGFrZSBlZmZlY3QgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIEBwYXJhbSB7SHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlfSBtaWRkbGV3YXJlXG4gICAqL1xuICBhZGRNaWRkbGV3YXJlKG1pZGRsZXdhcmU6IEh5ZHJvZ2VuS2VybmVsTWlkZGxld2FyZSkge1xuICAgIHRoaXMuX2Fzc2VydE5vdERlc3Ryb3llZCgpO1xuICAgIHRoaXMuX2tlcm5lbC5hZGRNaWRkbGV3YXJlKG1pZGRsZXdhcmUpO1xuICB9XG5cbiAgLypcbiAgICogQ2FsbHMgeW91ciBjYWxsYmFjayB3aGVuIHRoZSBrZXJuZWwgaGFzIGJlZW4gZGVzdHJveWVkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDYWxsYmFja1xuICAgKi9cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMuX2Fzc2VydE5vdERlc3Ryb3llZCgpO1xuICAgIHRoaXMuX2tlcm5lbC5lbWl0dGVyLm9uKFwiZGlkLWRlc3Ryb3lcIiwgY2FsbGJhY2spO1xuICB9XG5cbiAgLypcbiAgICogR2V0IHRoZSBbY29ubmVjdGlvbiBmaWxlXShodHRwOi8vanVweXRlci1ub3RlYm9vay5yZWFkdGhlZG9jcy5pby9lbi9sYXRlc3QvZXhhbXBsZXMvTm90ZWJvb2svQ29ubmVjdGluZyUyMHdpdGglMjB0aGUlMjBRdCUyMENvbnNvbGUuaHRtbCkgb2YgdGhlIGtlcm5lbC5cbiAgICogQHJldHVybiB7U3RyaW5nfSBQYXRoIHRvIGNvbm5lY3Rpb24gZmlsZS5cbiAgICovXG4gIGdldENvbm5lY3Rpb25GaWxlKCkge1xuICAgIHRoaXMuX2Fzc2VydE5vdERlc3Ryb3llZCgpO1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBjb25zdCBjb25uZWN0aW9uRmlsZSA9IHRoaXMuX2tlcm5lbC50cmFuc3BvcnQuY29ubmVjdGlvbkZpbGVcbiAgICAgID8gdGhpcy5fa2VybmVsLnRyYW5zcG9ydC5jb25uZWN0aW9uRmlsZVxuICAgICAgOiBudWxsO1xuICAgIGlmICghY29ubmVjdGlvbkZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYE5vIGNvbm5lY3Rpb24gZmlsZSBmb3IgJHt0aGlzLl9rZXJuZWwua2VybmVsU3BlYy5kaXNwbGF5X25hbWV9IGtlcm5lbCBmb3VuZGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbm5lY3Rpb25GaWxlO1xuICB9XG59XG4iXX0=