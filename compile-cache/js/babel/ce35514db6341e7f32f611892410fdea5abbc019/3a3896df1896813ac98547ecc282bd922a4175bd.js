Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MarkerStore = (function () {
  function MarkerStore() {
    _classCallCheck(this, MarkerStore);

    this.markers = new Map();
  }

  _createClass(MarkerStore, [{
    key: "clear",
    value: function clear() {
      this.markers.forEach(function (bubble) {
        return bubble.destroy();
      });
      this.markers.clear();
    }
  }, {
    key: "clearOnRow",
    value: function clearOnRow(row) {
      var _this = this;

      var destroyed = false;
      this.markers.forEach(function (bubble, key) {
        var _bubble$marker$getBufferRange = bubble.marker.getBufferRange();

        var start = _bubble$marker$getBufferRange.start;
        var end = _bubble$marker$getBufferRange.end;

        if (start.row <= row && row <= end.row) {
          _this["delete"](key);
          destroyed = true;
        }
      });
      return destroyed;
    }
  }, {
    key: "new",
    value: function _new(bubble) {
      this.markers.set(bubble.marker.id, bubble);
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var bubble = this.markers.get(key);
      if (bubble) bubble.destroy();
      this.markers["delete"](key);
    }
  }]);

  return MarkerStore;
})();

exports["default"] = MarkerStore;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvbWFya2Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUlxQixXQUFXO1dBQVgsV0FBVzswQkFBWCxXQUFXOztTQUM5QixPQUFPLEdBQTRCLElBQUksR0FBRyxFQUFFOzs7ZUFEekIsV0FBVzs7V0FHekIsaUJBQUc7QUFDTixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07ZUFBaUIsTUFBTSxDQUFDLE9BQU8sRUFBRTtPQUFBLENBQUMsQ0FBQztBQUMvRCxVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3RCOzs7V0FFUyxvQkFBQyxHQUFXLEVBQUU7OztBQUN0QixVQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQWMsR0FBRyxFQUFhOzRDQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRTs7WUFBN0MsS0FBSyxpQ0FBTCxLQUFLO1lBQUUsR0FBRyxpQ0FBSCxHQUFHOztBQUNsQixZQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ3RDLHlCQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakIsbUJBQVMsR0FBRyxJQUFJLENBQUM7U0FDbEI7T0FDRixDQUFDLENBQUM7QUFDSCxhQUFPLFNBQVMsQ0FBQztLQUNsQjs7O1dBRUUsY0FBQyxNQUFrQixFQUFFO0FBQ3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzVDOzs7V0FFSyxpQkFBQyxHQUFXLEVBQUU7QUFDbEIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsVUFBSSxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxPQUFPLFVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjs7O1NBNUJrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL21hcmtlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgdHlwZSBSZXN1bHRWaWV3IGZyb20gXCIuLy4uL2NvbXBvbmVudHMvcmVzdWx0LXZpZXdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyU3RvcmUge1xuICBtYXJrZXJzOiBNYXA8bnVtYmVyLCBSZXN1bHRWaWV3PiA9IG5ldyBNYXAoKTtcblxuICBjbGVhcigpIHtcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaCgoYnViYmxlOiBSZXN1bHRWaWV3KSA9PiBidWJibGUuZGVzdHJveSgpKTtcbiAgICB0aGlzLm1hcmtlcnMuY2xlYXIoKTtcbiAgfVxuXG4gIGNsZWFyT25Sb3cocm93OiBudW1iZXIpIHtcbiAgICBsZXQgZGVzdHJveWVkID0gZmFsc2U7XG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goKGJ1YmJsZTogUmVzdWx0Vmlldywga2V5OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gYnViYmxlLm1hcmtlci5nZXRCdWZmZXJSYW5nZSgpO1xuICAgICAgaWYgKHN0YXJ0LnJvdyA8PSByb3cgJiYgcm93IDw9IGVuZC5yb3cpIHtcbiAgICAgICAgdGhpcy5kZWxldGUoa2V5KTtcbiAgICAgICAgZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGVzdHJveWVkO1xuICB9XG5cbiAgbmV3KGJ1YmJsZTogUmVzdWx0Vmlldykge1xuICAgIHRoaXMubWFya2Vycy5zZXQoYnViYmxlLm1hcmtlci5pZCwgYnViYmxlKTtcbiAgfVxuXG4gIGRlbGV0ZShrZXk6IG51bWJlcikge1xuICAgIGNvbnN0IGJ1YmJsZSA9IHRoaXMubWFya2Vycy5nZXQoa2V5KTtcbiAgICBpZiAoYnViYmxlKSBidWJibGUuZGVzdHJveSgpO1xuICAgIHRoaXMubWFya2Vycy5kZWxldGUoa2V5KTtcbiAgfVxufVxuIl19