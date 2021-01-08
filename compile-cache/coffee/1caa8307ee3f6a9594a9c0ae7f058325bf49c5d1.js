(function() {
  var slice = [].slice;

  module.exports = {
    prefix: 'autocomplete-python-jedi:',
    debug: function() {
      var msg;
      msg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (atom.config.get('autocomplete-python-jedi.outputDebug')) {
        return console.debug.apply(console, [this.prefix].concat(slice.call(msg)));
      }
    },
    warning: function() {
      var msg;
      msg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return console.warn.apply(console, [this.prefix].concat(slice.call(msg)));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24tamVkaS9saWIvbG9nLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSwyQkFBUjtJQUNBLEtBQUEsRUFBTyxTQUFBO0FBQ0wsVUFBQTtNQURNO01BQ04sSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQUg7QUFDRSxlQUFPLE9BQU8sQ0FBQyxLQUFSLGdCQUFjLENBQUEsSUFBQyxDQUFBLE1BQVEsU0FBQSxXQUFBLEdBQUEsQ0FBQSxDQUF2QixFQURUOztJQURLLENBRFA7SUFLQSxPQUFBLEVBQVMsU0FBQTtBQUNQLFVBQUE7TUFEUTtBQUNSLGFBQU8sT0FBTyxDQUFDLElBQVIsZ0JBQWEsQ0FBQSxJQUFDLENBQUEsTUFBUSxTQUFBLFdBQUEsR0FBQSxDQUFBLENBQXRCO0lBREEsQ0FMVDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgcHJlZml4OiAnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpOidcbiAgZGVidWc6IChtc2cuLi4pIC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLWplZGkub3V0cHV0RGVidWcnKVxuICAgICAgcmV0dXJuIGNvbnNvbGUuZGVidWcgQHByZWZpeCwgbXNnLi4uXG5cbiAgd2FybmluZzogKG1zZy4uLikgLT5cbiAgICByZXR1cm4gY29uc29sZS53YXJuIEBwcmVmaXgsIG1zZy4uLlxuIl19
