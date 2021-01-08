(function() {
  var log, touchbar;

  log = require('./log');

  if (atom.config.get('autocomplete-python-jedi.enableTouchBar')) {
    touchbar = require('./touchbar');
  }

  module.exports = {
    _showSignatureOverlay: function(event) {
      var cursor, disableForSelector, editor, getTooltip, i, len, marker, ref, scopeChain, scopeDescriptor, wordBufferRange;
      if (this.markers) {
        ref = this.markers;
        for (i = 0, len = ref.length; i < len; i++) {
          marker = ref[i];
          log.debug('destroying old marker', marker);
          marker.destroy();
        }
      } else {
        this.markers = [];
      }
      cursor = event.cursor;
      editor = event.cursor.editor;
      wordBufferRange = cursor.getCurrentWordBufferRange();
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(event.newBufferPosition);
      scopeChain = scopeDescriptor.getScopeChain();
      disableForSelector = this.disableForSelector + ", .source.python .numeric, .source.python .integer, .source.python .decimal, .source.python .punctuation, .source.python .keyword, .source.python .storage, .source.python .variable.parameter, .source.python .entity.name";
      disableForSelector = this.Selector.create(disableForSelector);
      if (this.selectorsMatchScopeChain(disableForSelector, scopeChain)) {
        log.debug('do nothing for this selector');
        return;
      }
      marker = editor.markBufferRange(wordBufferRange, {
        invalidate: 'never'
      });
      this.markers.push(marker);
      getTooltip = (function(_this) {
        return function(editor, bufferPosition) {
          var payload;
          payload = {
            id: _this._generateRequestId('tooltip', editor, bufferPosition),
            lookup: 'tooltip',
            path: editor.getPath(),
            source: editor.getText(),
            line: bufferPosition.row,
            column: bufferPosition.column,
            config: _this._generateRequestConfig()
          };
          _this._sendRequest(_this._serialize(payload));
          return new Promise(function(resolve) {
            return _this.requests[payload.id] = resolve;
          });
        };
      })(this);
      return getTooltip(editor, event.newBufferPosition).then((function(_this) {
        return function(results) {
          var column, decoration, description, fileName, line, ref1, text, type, view;
          if (marker.isDestroyed()) {
            return;
          }
          if (results.length > 0) {
            ref1 = results[0], text = ref1.text, fileName = ref1.fileName, line = ref1.line, column = ref1.column, type = ref1.type, description = ref1.description;
            description = description.trim();
            if (!description) {
              return;
            }
            view = document.createElement('autocomplete-python-jedi-suggestion');
            view.appendChild(document.createTextNode(description));
            decoration = editor.decorateMarker(marker, {
              type: 'overlay',
              item: view,
              position: 'head'
            });
            if (atom.config.get('autocomplete-python-jedi.enableTouchBar')) {
              return touchbar.update(results[0]);
            }
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24tamVkaS9saWIvdG9vbHRpcHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0VBQ04sSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUNBQWhCLENBQUg7SUFDRSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsRUFEYjs7O0VBR0EsTUFBTSxDQUFDLE9BQVAsR0FDQTtJQUFBLHFCQUFBLEVBQXVCLFNBQUMsS0FBRDtBQUNyQixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsT0FBSjtBQUNFO0FBQUEsYUFBQSxxQ0FBQTs7VUFDRSxHQUFHLENBQUMsS0FBSixDQUFVLHVCQUFWLEVBQW1DLE1BQW5DO1VBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBQTtBQUZGLFNBREY7T0FBQSxNQUFBO1FBS0UsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUxiOztNQU9BLE1BQUEsR0FBUyxLQUFLLENBQUM7TUFDZixNQUFBLEdBQVMsS0FBSyxDQUFDLE1BQU0sQ0FBQztNQUN0QixlQUFBLEdBQWtCLE1BQU0sQ0FBQyx5QkFBUCxDQUFBO01BQ2xCLGVBQUEsR0FBa0IsTUFBTSxDQUFDLGdDQUFQLENBQ2hCLEtBQUssQ0FBQyxpQkFEVTtNQUVsQixVQUFBLEdBQWEsZUFBZSxDQUFDLGFBQWhCLENBQUE7TUFFYixrQkFBQSxHQUF3QixJQUFDLENBQUEsa0JBQUYsR0FBcUI7TUFDNUMsa0JBQUEsR0FBcUIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLGtCQUFqQjtNQUVyQixJQUFHLElBQUMsQ0FBQSx3QkFBRCxDQUEwQixrQkFBMUIsRUFBOEMsVUFBOUMsQ0FBSDtRQUNFLEdBQUcsQ0FBQyxLQUFKLENBQVUsOEJBQVY7QUFDQSxlQUZGOztNQUlBLE1BQUEsR0FBUyxNQUFNLENBQUMsZUFBUCxDQUF1QixlQUF2QixFQUF3QztRQUFDLFVBQUEsRUFBWSxPQUFiO09BQXhDO01BRVQsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZDtNQUVBLFVBQUEsR0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRCxFQUFTLGNBQVQ7QUFDWCxjQUFBO1VBQUEsT0FBQSxHQUNFO1lBQUEsRUFBQSxFQUFJLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixTQUFwQixFQUErQixNQUEvQixFQUF1QyxjQUF2QyxDQUFKO1lBQ0EsTUFBQSxFQUFRLFNBRFI7WUFFQSxJQUFBLEVBQU0sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUZOO1lBR0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FIUjtZQUlBLElBQUEsRUFBTSxjQUFjLENBQUMsR0FKckI7WUFLQSxNQUFBLEVBQVEsY0FBYyxDQUFDLE1BTHZCO1lBTUEsTUFBQSxFQUFRLEtBQUMsQ0FBQSxzQkFBRCxDQUFBLENBTlI7O1VBT0YsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFDLENBQUEsVUFBRCxDQUFZLE9BQVosQ0FBZDtBQUNBLGlCQUFPLElBQUksT0FBSixDQUFZLFNBQUMsT0FBRDttQkFDakIsS0FBQyxDQUFBLFFBQVMsQ0FBQSxPQUFPLENBQUMsRUFBUixDQUFWLEdBQXdCO1VBRFAsQ0FBWjtRQVZJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQWFiLFVBQUEsQ0FBVyxNQUFYLEVBQW1CLEtBQUssQ0FBQyxpQkFBekIsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtBQUMvQyxjQUFBO1VBQUEsSUFBRyxNQUFNLENBQUMsV0FBUCxDQUFBLENBQUg7QUFDRSxtQkFERjs7VUFFQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXBCO1lBQ0UsT0FBb0QsT0FBUSxDQUFBLENBQUEsQ0FBNUQsRUFBQyxnQkFBRCxFQUFPLHdCQUFQLEVBQWlCLGdCQUFqQixFQUF1QixvQkFBdkIsRUFBK0IsZ0JBQS9CLEVBQXFDO1lBRXJDLFdBQUEsR0FBYyxXQUFXLENBQUMsSUFBWixDQUFBO1lBQ2QsSUFBRyxDQUFJLFdBQVA7QUFDRSxxQkFERjs7WUFFQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIscUNBQXZCO1lBQ1AsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBakI7WUFDQSxVQUFBLEdBQWEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEI7Y0FDekMsSUFBQSxFQUFNLFNBRG1DO2NBRXpDLElBQUEsRUFBTSxJQUZtQztjQUd6QyxRQUFBLEVBQVUsTUFIK0I7YUFBOUI7WUFLYixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsQ0FBSDtxQkFDRSxRQUFRLENBQUMsTUFBVCxDQUFnQixPQUFRLENBQUEsQ0FBQSxDQUF4QixFQURGO2FBYkY7O1FBSCtDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRDtJQXZDcUIsQ0FBdkI7O0FBTEEiLCJzb3VyY2VzQ29udGVudCI6WyJsb2cgPSByZXF1aXJlICcuL2xvZydcbmlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpLmVuYWJsZVRvdWNoQmFyJylcbiAgdG91Y2hiYXIgPSByZXF1aXJlICcuL3RvdWNoYmFyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5fc2hvd1NpZ25hdHVyZU92ZXJsYXk6IChldmVudCkgLT5cbiAgaWYgQG1hcmtlcnNcbiAgICBmb3IgbWFya2VyIGluIEBtYXJrZXJzXG4gICAgICBsb2cuZGVidWcgJ2Rlc3Ryb3lpbmcgb2xkIG1hcmtlcicsIG1hcmtlclxuICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICBlbHNlXG4gICAgQG1hcmtlcnMgPSBbXVxuXG4gIGN1cnNvciA9IGV2ZW50LmN1cnNvclxuICBlZGl0b3IgPSBldmVudC5jdXJzb3IuZWRpdG9yXG4gIHdvcmRCdWZmZXJSYW5nZSA9IGN1cnNvci5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKClcbiAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFxuICAgIGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uKVxuICBzY29wZUNoYWluID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3BlQ2hhaW4oKVxuXG4gIGRpc2FibGVGb3JTZWxlY3RvciA9IFwiI3tAZGlzYWJsZUZvclNlbGVjdG9yfSwgLnNvdXJjZS5weXRob24gLm51bWVyaWMsIC5zb3VyY2UucHl0aG9uIC5pbnRlZ2VyLCAuc291cmNlLnB5dGhvbiAuZGVjaW1hbCwgLnNvdXJjZS5weXRob24gLnB1bmN0dWF0aW9uLCAuc291cmNlLnB5dGhvbiAua2V5d29yZCwgLnNvdXJjZS5weXRob24gLnN0b3JhZ2UsIC5zb3VyY2UucHl0aG9uIC52YXJpYWJsZS5wYXJhbWV0ZXIsIC5zb3VyY2UucHl0aG9uIC5lbnRpdHkubmFtZVwiXG4gIGRpc2FibGVGb3JTZWxlY3RvciA9IEBTZWxlY3Rvci5jcmVhdGUoZGlzYWJsZUZvclNlbGVjdG9yKVxuXG4gIGlmIEBzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW4oZGlzYWJsZUZvclNlbGVjdG9yLCBzY29wZUNoYWluKVxuICAgIGxvZy5kZWJ1ZyAnZG8gbm90aGluZyBmb3IgdGhpcyBzZWxlY3RvcidcbiAgICByZXR1cm5cblxuICBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKHdvcmRCdWZmZXJSYW5nZSwge2ludmFsaWRhdGU6ICduZXZlcid9KVxuXG4gIEBtYXJrZXJzLnB1c2gobWFya2VyKVxuXG4gIGdldFRvb2x0aXAgPSAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgPT5cbiAgICBwYXlsb2FkID1cbiAgICAgIGlkOiBAX2dlbmVyYXRlUmVxdWVzdElkKCd0b29sdGlwJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGxvb2t1cDogJ3Rvb2x0aXAnXG4gICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBzb3VyY2U6IGVkaXRvci5nZXRUZXh0KClcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgIGNvbmZpZzogQF9nZW5lcmF0ZVJlcXVlc3RDb25maWcoKVxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gcmVzb2x2ZVxuXG4gIGdldFRvb2x0aXAoZWRpdG9yLCBldmVudC5uZXdCdWZmZXJQb3NpdGlvbikudGhlbiAocmVzdWx0cykgPT5cbiAgICBpZiBtYXJrZXIuaXNEZXN0cm95ZWQoKVxuICAgICAgcmV0dXJuXG4gICAgaWYgcmVzdWx0cy5sZW5ndGggPiAwXG4gICAgICB7dGV4dCwgZmlsZU5hbWUsIGxpbmUsIGNvbHVtbiwgdHlwZSwgZGVzY3JpcHRpb259ID0gcmVzdWx0c1swXVxuXG4gICAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnRyaW0oKVxuICAgICAgaWYgbm90IGRlc2NyaXB0aW9uXG4gICAgICAgIHJldHVyblxuICAgICAgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1dG9jb21wbGV0ZS1weXRob24tamVkaS1zdWdnZXN0aW9uJylcbiAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGVzY3JpcHRpb24pKVxuICAgICAgZGVjb3JhdGlvbiA9IGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBpdGVtOiB2aWV3LFxuICAgICAgICBwb3NpdGlvbjogJ2hlYWQnXG4gICAgICB9KVxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLWplZGkuZW5hYmxlVG91Y2hCYXInKVxuICAgICAgICB0b3VjaGJhci51cGRhdGUocmVzdWx0c1swXSlcbiJdfQ==
