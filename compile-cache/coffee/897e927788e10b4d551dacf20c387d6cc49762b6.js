(function() {
  var CompositeDisposable, RenameDialog, StatusIcon,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  RenameDialog = null;

  module.exports = StatusIcon = (function(superClass) {
    extend(StatusIcon, superClass);

    function StatusIcon() {
      return StatusIcon.__super__.constructor.apply(this, arguments);
    }

    StatusIcon.prototype.active = false;

    StatusIcon.prototype.initialize = function(terminalView) {
      var ref;
      this.terminalView = terminalView;
      this.classList.add('status-icon');
      this.icon = document.createElement('i');
      this.icon.classList.add('icon', 'icon-terminal');
      this.appendChild(this.icon);
      this.name = document.createElement('span');
      this.name.classList.add('name');
      this.appendChild(this.name);
      this.dataset.type = (ref = this.terminalView.constructor) != null ? ref.name : void 0;
      this.addEventListener('click', (function(_this) {
        return function(arg) {
          var ctrlKey, which;
          which = arg.which, ctrlKey = arg.ctrlKey;
          if (which === 1) {
            _this.terminalView.toggle();
            return true;
          } else if (which === 2) {
            _this.terminalView.destroy();
            return false;
          }
        };
      })(this));
      return this.setupTooltip();
    };

    StatusIcon.prototype.setupTooltip = function() {
      var onMouseEnter;
      onMouseEnter = (function(_this) {
        return function(event) {
          if (event.detail === 'terminal-plus') {
            return;
          }
          return _this.updateTooltip();
        };
      })(this);
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.removeEventListener('mouseenter', onMouseEnter);
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
      return this.addEventListener('mouseenter', onMouseEnter);
    };

    StatusIcon.prototype.updateTooltip = function() {
      var process;
      this.removeTooltip();
      if (process = this.terminalView.getTerminalTitle()) {
        this.tooltip = atom.tooltips.add(this, {
          title: process,
          html: false,
          delay: {
            show: 1000,
            hide: 100
          }
        });
      }
      return this.dispatchEvent(new CustomEvent('mouseenter', {
        bubbles: true,
        detail: 'terminal-plus'
      }));
    };

    StatusIcon.prototype.removeTooltip = function() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      return this.tooltip = null;
    };

    StatusIcon.prototype.destroy = function() {
      this.removeTooltip();
      if (this.mouseEnterSubscription) {
        this.mouseEnterSubscription.dispose();
      }
      return this.remove();
    };

    StatusIcon.prototype.activate = function() {
      this.classList.add('active');
      return this.active = true;
    };

    StatusIcon.prototype.isActive = function() {
      return this.classList.contains('active');
    };

    StatusIcon.prototype.deactivate = function() {
      this.classList.remove('active');
      return this.active = false;
    };

    StatusIcon.prototype.toggle = function() {
      if (this.active) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
      return this.active = !this.active;
    };

    StatusIcon.prototype.isActive = function() {
      return this.active;
    };

    StatusIcon.prototype.rename = function() {
      var dialog;
      if (RenameDialog == null) {
        RenameDialog = require('./rename-dialog');
      }
      dialog = new RenameDialog(this);
      return dialog.attach();
    };

    StatusIcon.prototype.getName = function() {
      return this.name.textContent.substring(1);
    };

    StatusIcon.prototype.updateName = function(name) {
      if (name !== this.getName()) {
        if (name) {
          name = "&nbsp;" + name;
        }
        this.name.innerHTML = name;
        return this.terminalView.emit('did-change-title');
      }
    };

    return StatusIcon;

  })(HTMLElement);

  module.exports = document.registerElement('status-icon', {
    prototype: StatusIcon.prototype,
    "extends": 'li'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXBsdXMvbGliL3N0YXR1cy1pY29uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkNBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixZQUFBLEdBQWU7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt5QkFDSixNQUFBLEdBQVE7O3lCQUVSLFVBQUEsR0FBWSxTQUFDLFlBQUQ7QUFDVixVQUFBO01BRFcsSUFBQyxDQUFBLGVBQUQ7TUFDWCxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxhQUFmO01BRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QjtNQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLE1BQXBCLEVBQTRCLGVBQTVCO01BQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsSUFBZDtNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7TUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixNQUFwQjtNQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLElBQWQ7TUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsc0RBQXlDLENBQUU7TUFFM0MsSUFBQyxDQUFBLGdCQUFELENBQWtCLE9BQWxCLEVBQTJCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQ3pCLGNBQUE7VUFEMkIsbUJBQU87VUFDbEMsSUFBRyxLQUFBLEtBQVMsQ0FBWjtZQUNFLEtBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUFBO21CQUNBLEtBRkY7V0FBQSxNQUdLLElBQUcsS0FBQSxLQUFTLENBQVo7WUFD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Q0FBQyxNQUFQLENBQUE7SUFITTs7eUJBS1IsT0FBQSxHQUFTLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFsQixDQUE0QixDQUE1QjtJQUFIOzt5QkFFVCxVQUFBLEdBQVksU0FBQyxJQUFEO01BQ1YsSUFBRyxJQUFBLEtBQVUsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFiO1FBQ0UsSUFBMEIsSUFBMUI7VUFBQSxJQUFBLEdBQU8sUUFBQSxHQUFXLEtBQWxCOztRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtlQUNsQixJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsa0JBQW5CLEVBSEY7O0lBRFU7Ozs7S0F4Rlc7O0VBOEZ6QixNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFRLENBQUMsZUFBVCxDQUF5QixhQUF6QixFQUF3QztJQUFBLFNBQUEsRUFBVyxVQUFVLENBQUMsU0FBdEI7SUFBaUMsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUExQztHQUF4QztBQW5HakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5SZW5hbWVEaWFsb2cgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0YXR1c0ljb24gZXh0ZW5kcyBIVE1MRWxlbWVudFxuICBhY3RpdmU6IGZhbHNlXG5cbiAgaW5pdGlhbGl6ZTogKEB0ZXJtaW5hbFZpZXcpIC0+XG4gICAgQGNsYXNzTGlzdC5hZGQgJ3N0YXR1cy1pY29uJ1xuXG4gICAgQGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcbiAgICBAaWNvbi5jbGFzc0xpc3QuYWRkICdpY29uJywgJ2ljb24tdGVybWluYWwnXG4gICAgQGFwcGVuZENoaWxkKEBpY29uKVxuXG4gICAgQG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBAbmFtZS5jbGFzc0xpc3QuYWRkICduYW1lJ1xuICAgIEBhcHBlbmRDaGlsZChAbmFtZSlcblxuICAgIEBkYXRhc2V0LnR5cGUgPSBAdGVybWluYWxWaWV3LmNvbnN0cnVjdG9yPy5uYW1lXG5cbiAgICBAYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCAoe3doaWNoLCBjdHJsS2V5fSkgPT5cbiAgICAgIGlmIHdoaWNoIGlzIDFcbiAgICAgICAgQHRlcm1pbmFsVmlldy50b2dnbGUoKVxuICAgICAgICB0cnVlXG4gICAgICBlbHNlIGlmIHdoaWNoIGlzIDJcbiAgICAgICAgQHRlcm1pbmFsVmlldy5kZXN0cm95KClcbiAgICAgICAgZmFsc2VcblxuICAgIEBzZXR1cFRvb2x0aXAoKVxuXG4gIHNldHVwVG9vbHRpcDogLT5cblxuICAgIG9uTW91c2VFbnRlciA9IChldmVudCkgPT5cbiAgICAgIHJldHVybiBpZiBldmVudC5kZXRhaWwgaXMgJ3Rlcm1pbmFsLXBsdXMnXG4gICAgICBAdXBkYXRlVG9vbHRpcCgpXG5cbiAgICBAbW91c2VFbnRlclN1YnNjcmlwdGlvbiA9IGRpc3Bvc2U6ID0+XG4gICAgICBAcmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uTW91c2VFbnRlcilcbiAgICAgIEBtb3VzZUVudGVyU3Vic2NyaXB0aW9uID0gbnVsbFxuXG4gICAgQGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpXG5cbiAgdXBkYXRlVG9vbHRpcDogLT5cbiAgICBAcmVtb3ZlVG9vbHRpcCgpXG5cbiAgICBpZiBwcm9jZXNzID0gQHRlcm1pbmFsVmlldy5nZXRUZXJtaW5hbFRpdGxlKClcbiAgICAgIEB0b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQgdGhpcyxcbiAgICAgICAgdGl0bGU6IHByb2Nlc3NcbiAgICAgICAgaHRtbDogZmFsc2VcbiAgICAgICAgZGVsYXk6XG4gICAgICAgICAgc2hvdzogMTAwMFxuICAgICAgICAgIGhpZGU6IDEwMFxuXG4gICAgQGRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdtb3VzZWVudGVyJywgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiAndGVybWluYWwtcGx1cycpKVxuXG4gIHJlbW92ZVRvb2x0aXA6IC0+XG4gICAgQHRvb2x0aXAuZGlzcG9zZSgpIGlmIEB0b29sdGlwXG4gICAgQHRvb2x0aXAgPSBudWxsXG5cbiAgZGVzdHJveTogLT5cbiAgICBAcmVtb3ZlVG9vbHRpcCgpXG4gICAgQG1vdXNlRW50ZXJTdWJzY3JpcHRpb24uZGlzcG9zZSgpIGlmIEBtb3VzZUVudGVyU3Vic2NyaXB0aW9uXG4gICAgQHJlbW92ZSgpXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQGNsYXNzTGlzdC5hZGQgJ2FjdGl2ZSdcbiAgICBAYWN0aXZlID0gdHJ1ZVxuXG4gIGlzQWN0aXZlOiAtPlxuICAgIEBjbGFzc0xpc3QuY29udGFpbnMgJ2FjdGl2ZSdcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBjbGFzc0xpc3QucmVtb3ZlICdhY3RpdmUnXG4gICAgQGFjdGl2ZSA9IGZhbHNlXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBhY3RpdmVcbiAgICAgIEBjbGFzc0xpc3QucmVtb3ZlICdhY3RpdmUnXG4gICAgZWxzZVxuICAgICAgQGNsYXNzTGlzdC5hZGQgJ2FjdGl2ZSdcbiAgICBAYWN0aXZlID0gIUBhY3RpdmVcblxuICBpc0FjdGl2ZTogLT5cbiAgICByZXR1cm4gQGFjdGl2ZVxuXG4gIHJlbmFtZTogLT5cbiAgICBSZW5hbWVEaWFsb2cgPz0gcmVxdWlyZSAnLi9yZW5hbWUtZGlhbG9nJ1xuICAgIGRpYWxvZyA9IG5ldyBSZW5hbWVEaWFsb2cgdGhpc1xuICAgIGRpYWxvZy5hdHRhY2goKVxuXG4gIGdldE5hbWU6IC0+IEBuYW1lLnRleHRDb250ZW50LnN1YnN0cmluZygxKVxuXG4gIHVwZGF0ZU5hbWU6IChuYW1lKSAtPlxuICAgIGlmIG5hbWUgaXNudCBAZ2V0TmFtZSgpXG4gICAgICBuYW1lID0gXCImbmJzcDtcIiArIG5hbWUgaWYgbmFtZVxuICAgICAgQG5hbWUuaW5uZXJIVE1MID0gbmFtZVxuICAgICAgQHRlcm1pbmFsVmlldy5lbWl0ICdkaWQtY2hhbmdlLXRpdGxlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnc3RhdHVzLWljb24nLCBwcm90b3R5cGU6IFN0YXR1c0ljb24ucHJvdG90eXBlLCBleHRlbmRzOiAnbGknKVxuIl19
