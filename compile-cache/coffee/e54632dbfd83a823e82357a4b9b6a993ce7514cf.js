(function() {
  var packagesToTest, path;

  path = require('path');

  packagesToTest = {
    Python: {
      name: 'language-python',
      file: 'test.py'
    }
  };

  describe('Jedi autocompletions', function() {
    var editor, getCompletions, getMethods, getUsages, goToDefinition, provider, ref;
    ref = [], editor = ref[0], provider = ref[1];
    getCompletions = function() {
      var cursor, end, prefix, request, start;
      cursor = editor.getLastCursor();
      start = cursor.getBeginningOfCurrentWordBufferPosition();
      end = cursor.getBufferPosition();
      prefix = editor.getTextInRange([start, end]);
      request = {
        editor: editor,
        bufferPosition: end,
        scopeDescriptor: cursor.getScopeDescriptor(),
        prefix: prefix
      };
      return Promise.resolve(provider.getSuggestions(request));
    };
    goToDefinition = function() {
      var bufferPosition;
      bufferPosition = editor.getCursorBufferPosition();
      return Promise.resolve(provider.goToDefinition(editor, bufferPosition));
    };
    getMethods = function() {
      var bufferPosition;
      bufferPosition = editor.getCursorBufferPosition();
      return Promise.resolve(provider.getMethods(editor, bufferPosition));
    };
    getUsages = function() {
      var bufferPosition;
      bufferPosition = editor.getCursorBufferPosition();
      return Promise.resolve(provider.getUsages(editor, bufferPosition));
    };
    beforeEach(function() {
      atom.config.getUserConfigPath = (function(_this) {
        return function() {
          return '';
        };
      })(this);
      atom.config.set('autocomplete-python.useKite', false);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-python');
      });
      waitsForPromise(function() {
        return atom.workspace.open('test.py');
      });
      runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setGrammar(atom.grammars.grammarForScopeName('test.py'));
        return atom.packages.loadPackage('autocomplete-python').activationHooks = [];
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-python');
      });
      runs(function() {
        return atom.packages.getActivePackage('autocomplete-python').mainModule.load();
      });
      return runs(function() {
        return provider = atom.packages.getActivePackage('autocomplete-python').mainModule.getProvider();
      });
    });
    it('autocompletes builtins', function() {
      editor.setText('isinstanc');
      editor.setCursorBufferPosition([1, 0]);
      return waitsForPromise(function() {
        return getCompletions().then(function(completions) {
          var completion, i, len;
          for (i = 0, len = completions.length; i < len; i++) {
            completion = completions[i];
            expect(completion.text.length).toBeGreaterThan(0);
            expect(completion.text).toBe('isinstance');
          }
          return expect(completions.length).toBe(1);
        });
      });
    });
    it('autocompletes python keywords', function() {
      editor.setText('impo');
      editor.setCursorBufferPosition([1, 0]);
      return waitsForPromise(function() {
        return getCompletions().then(function(completions) {
          var completion, i, len;
          for (i = 0, len = completions.length; i < len; i++) {
            completion = completions[i];
            if (completion.type === 'keyword') {
              expect(completion.text).toBe('import');
            }
            expect(completion.text.length).toBeGreaterThan(0);
          }
          return expect(completions.length).toBe(3);
        });
      });
    });
    it('autocompletes defined functions', function() {
      editor.setText("def hello_world():\n  return True\nhell");
      editor.setCursorBufferPosition([3, 0]);
      return waitsForPromise(function() {
        return getCompletions().then(function(completions) {
          expect(completions[0].text).toBe('hello_world');
          return expect(completions.length).toBe(1);
        });
      });
    });
    it('goes to definition', function() {
      editor.setText("def abc():\n    return True\nx = abc()");
      editor.setCursorBufferPosition([2, 4]);
      return waitsForPromise(function() {
        return goToDefinition().then(function() {
          var result;
          result = {
            row: 0,
            column: 4
          };
          return expect(editor.getCursorBufferPosition()).toEqual(result);
        });
      });
    });
    it('autocompletes function argument', function() {
      editor.setText("def abc(x, z: str):\n  return True\nx = abc()");
      editor.setCursorBufferPosition([2, 8]);
      return waitsForPromise(function() {
        return getCompletions().then(function(completions) {
          expect(completions.length).toBeGreaterThan(1);
          expect(completions[0].text).toBe('x');
          return expect(completions[1].text).toBe('z: str');
        });
      });
    });
    it('gets methods', function() {
      var FilePath;
      FilePath = path.join(__dirname, 'fixtures', 'test.py');
      waitsForPromise(function() {
        return atom.workspace.open(FilePath);
      });
      editor.setCursorBufferPosition([5, 4]);
      return waitsForPromise(function() {
        return getMethods().then(function(arg) {
          var bufferPosition, expectedBuffer, expectedMethod, indent, methods;
          methods = arg.methods, indent = arg.indent, bufferPosition = arg.bufferPosition;
          expect(indent).toBe(4);
          expectedBuffer = {
            row: 5,
            column: 4
          };
          expect(bufferPosition).toEqual(expectedBuffer);
          expect(methods.length).toBeGreaterThan(0);
          expectedMethod = {
            parent: 'Foo',
            instance: 'Bar',
            name: 'test',
            params: [],
            moduleName: 'test',
            fileName: FilePath,
            line: 2,
            column: 8
          };
          return expect(methods[0]).toEqual(expectedMethod);
        });
      });
    });
    it('gets usages', function() {
      var FilePaths;
      FilePaths = [path.join(__dirname, 'fixtures', 'test.py'), path.join(__dirname, 'fixtures', 'another.py')];
      waitsForPromise(function() {
        return atom.workspace.open({
          pathsToOpen: FilePaths
        });
      });
      editor.setCursorBufferPosition([4, 13]);
      return waitsForPromise(function() {
        return getUsages().then(function(usages) {
          var expectedUsage;
          expect(usages.length).toBe(3);
          expectedUsage = {
            name: 'Foo',
            moduleName: 'test',
            fileName: FilePaths[0],
            line: 1,
            column: 6
          };
          expect(usages).toContain(expectedUsage);
          expectedUsage = {
            name: 'Foo',
            moduleName: 'another',
            fileName: FilePaths[1],
            line: 3,
            column: 9
          };
          return expect(usages).toContain(expectedUsage);
        });
      });
    });
    it('fuzzy matches', function() {
      atom.config.set('autocomplete-python.fuzzyMatcher', true);
      editor.setText("def abcdef():\n  return True\nabdf");
      editor.setCursorBufferPosition([3, 0]);
      return waitsForPromise(function() {
        return getCompletions().then(function(completions) {
          expect(completions[0].text).toBe('abcdef');
          return expect(completions.length).toBe(1);
        });
      });
    });
    it('does not fuzzy match if disabled', function() {
      atom.config.set('autocomplete-python.fuzzyMatcher', false);
      editor.setText("def abcdef():\n  return True\nabdf");
      editor.setCursorBufferPosition([3, 0]);
      return waitsForPromise(function() {
        return getCompletions().then(function(completions) {
          return expect(completions.length).toBe(0);
        });
      });
    });
    it('uses provided regex for triggering completions', function() {
      provider.triggerCompletionRegex = RegExp('a');
      editor.setText("a = [1, 3, 2]\na.");
      editor.setCursorBufferPosition([2, 0]);
      return waitsForPromise(function() {
        return getCompletions().then(function(completions) {
          expect(completions.length).toBe(0);
          return provider.triggerCompletionRegex = RegExp(atom.config.get('autocomplete-python.triggerCompletionRegex'));
        });
      });
    });
    return it('uses extra paths for packages', function() {
      var filePath;
      filePath = path.join(__dirname, 'fixtures', 'packages');
      atom.config.set('autocomplete-python.extraPaths', filePath);
      editor.setText("import test_pkg\ntest_pkg.");
      editor.setCursorBufferPosition([2, 0]);
      return waitsForPromise(function() {
        return getCompletions().then(function(completions) {
          expect(completions.length).toBe(5);
          return expect(completions[0].text).toBe('FooBar');
        });
      });
    });
  });

  xdescribe('Argument completions', function() {
    var editor, editorElement, getArgumentcompletions, provider, ref;
    ref = [], editor = ref[0], provider = ref[1], editorElement = ref[2];
    getArgumentcompletions = function() {
      return Promise.resolve(atom.commands.dispatch(editorElement, 'autocomplete-python:complete-arguments'));
    };
    beforeEach(function() {
      var filePath;
      atom.config.set('autocomplete-python.useKite', false);
      filePath = path.join(__dirname, 'fixtures', 'argument-test.py');
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-python');
      });
      waitsForPromise(function() {
        return atom.workspace.open(filePath);
      });
      runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(editorElement);
        editor.setGrammar(atom.grammars.grammarForScopeName('test.py'));
        return atom.packages.loadPackage('autocomplete-python').activationHooks = [];
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-python');
      });
      runs(function() {
        return atom.packages.getActivePackage('autocomplete-python').mainModule.load();
      });
      return runs(function() {
        return provider = atom.packages.getActivePackage('autocomplete-python').mainModule.getProvider();
      });
    });
    it('completes all function parameters', function() {
      atom.config.set('autocomplete-python.useSnippets', 'all');
      editor.setCursorBufferPosition([2, 4]);
      return waitsForPromise(function() {
        return getArgumentcompletions().then(function() {
          process.stdout.write(editor.getCursorBufferPosition().toString());
          return process.stdout.write(editor.getText().toString());
        });
      });
    });
    return it('completes all function parameters', function() {
      atom.config.set('autocomplete-python.useSnippets', 'required');
      editor.setCursorBufferPosition([2, 4]);
      return waitsForPromise(function() {
        return getArgumentcompletions().then(function() {
          process.stdout.write(editor.getCursorBufferPosition().toString());
          return process.stdout.write(editor.getText().toString());
        });
      });
    });
  });

  xdescribe('Displays views', function() {
    var editor, editorElement, provider, ref, showUsages;
    ref = [], editor = ref[0], provider = ref[1], editorElement = ref[2];
    showUsages = function() {
      jasmine.attachToDOM(editorElement);
      return atom.commands.dispatch(editorElement, 'autocomplete-python:show-usages');
    };
    beforeEach(function() {
      atom.config.set('autocomplete-python.useKite', false);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-python');
      });
      waitsForPromise(function() {
        return atom.workspace.open('test.py');
      });
      runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorElement = atom.views.getView(editor);
        editor.setGrammar(atom.grammars.grammarForScopeName('test.py'));
        return atom.packages.loadPackage('autocomplete-python').activationHooks = [];
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-python');
      });
      runs(function() {
        return atom.packages.getActivePackage('autocomplete-python').mainModule.load();
      });
      return runs(function() {
        return provider = atom.packages.getActivePackage('autocomplete-python').mainModule.getProvider();
      });
    });
    return it('shows usage view', function() {
      var FilePaths;
      FilePaths = [path.join(__dirname, 'fixtures', 'test.py'), path.join(__dirname, 'fixtures', 'another.py')];
      waitsForPromise(function() {
        return atom.workspace.open({
          pathsToOpen: FilePaths
        });
      });
      editor.setCursorBufferPosition([4, 13]);
      showUsages();
      waitsFor("view to show", function() {
        var ref1;
        return (ref1 = provider.usagesView) != null ? ref1.isVisible() : void 0;
      });
      waitsFor("view to populate", function() {
        var ref1;
        return ((ref1 = provider.usagesView.items) != null ? ref1.length : void 0) > 0;
      });
      return runs(function() {
        expect(provider.usagesView).toHaveFocus();
        return expect(provider.usagesView.items.length).toBe(3);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24vc3BlYy9wcm92aWRlci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLGNBQUEsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxpQkFBTjtNQUNBLElBQUEsRUFBTSxTQUROO0tBREY7OztFQUlGLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO0FBQy9CLFFBQUE7SUFBQSxNQUFxQixFQUFyQixFQUFDLGVBQUQsRUFBUztJQUVULGNBQUEsR0FBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGFBQVAsQ0FBQTtNQUNULEtBQUEsR0FBUSxNQUFNLENBQUMsdUNBQVAsQ0FBQTtNQUNSLEdBQUEsR0FBTSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtNQUNOLE1BQUEsR0FBUyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLEtBQUQsRUFBUSxHQUFSLENBQXRCO01BQ1QsT0FBQSxHQUNFO1FBQUEsTUFBQSxFQUFRLE1BQVI7UUFDQSxjQUFBLEVBQWdCLEdBRGhCO1FBRUEsZUFBQSxFQUFpQixNQUFNLENBQUMsa0JBQVAsQ0FBQSxDQUZqQjtRQUdBLE1BQUEsRUFBUSxNQUhSOztBQUlGLGFBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBaEI7SUFWUTtJQVlqQixjQUFBLEdBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsY0FBQSxHQUFpQixNQUFNLENBQUMsdUJBQVAsQ0FBQTtBQUNqQixhQUFPLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLGNBQWhDLENBQWhCO0lBRlE7SUFJakIsVUFB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QixDQUF6QjtNQUdBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO0FBQzNCLFlBQUE7aUVBQXlCLENBQUUsZ0JBQTNCLEdBQW9DO01BRFQsQ0FBN0I7YUFHQSxJQUFBLENBQUssU0FBQTtRQUNILE1BQUEsQ0FBTyxRQUFRLENBQUMsVUFBaEIsQ0FBMkIsQ0FBQyxXQUE1QixDQUFBO2VBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQWpDLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsQ0FBOUM7TUFGRyxDQUFMO0lBZnFCLENBQXZCO0VBdEIwQixDQUE1QjtBQXpRQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5wYWNrYWdlc1RvVGVzdCA9XG4gIFB5dGhvbjpcbiAgICBuYW1lOiAnbGFuZ3VhZ2UtcHl0aG9uJ1xuICAgIGZpbGU6ICd0ZXN0LnB5J1xuXG5kZXNjcmliZSAnSmVkaSBhdXRvY29tcGxldGlvbnMnLCAtPlxuICBbZWRpdG9yLCBwcm92aWRlcl0gPSBbXVxuXG4gIGdldENvbXBsZXRpb25zID0gLT5cbiAgICBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgc3RhcnQgPSBjdXJzb3IuZ2V0QmVnaW5uaW5nT2ZDdXJyZW50V29yZEJ1ZmZlclBvc2l0aW9uKClcbiAgICBlbmQgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHByZWZpeCA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbc3RhcnQsIGVuZF0pXG4gICAgcmVxdWVzdCA9XG4gICAgICBlZGl0b3I6IGVkaXRvclxuICAgICAgYnVmZmVyUG9zaXRpb246IGVuZFxuICAgICAgc2NvcGVEZXNjcmlwdG9yOiBjdXJzb3IuZ2V0U2NvcGVEZXNjcmlwdG9yKClcbiAgICAgIHByZWZpeDogcHJlZml4XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwcm92aWRlci5nZXRTdWdnZXN0aW9ucyhyZXF1ZXN0KSlcblxuICBnb1RvRGVmaW5pdGlvbiA9IC0+XG4gICAgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvdmlkZXIuZ29Ub0RlZmluaXRpb24oZWRpdG9yLCBidWZmZXJQb3NpdGlvbikpXG5cbiAgZ2V0TWV0aG9kcyA9IC0+XG4gICAgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvdmlkZXIuZ2V0TWV0aG9kcyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSlcblxuICBnZXRVc2FnZXMgPSAtPlxuICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHByb3ZpZGVyLmdldFVzYWdlcyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSlcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgIyBmaXggZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIHZhbHVlIGlzIHVuZGVmaW5lZFxuICAgIGF0b20uY29uZmlnLmdldFVzZXJDb25maWdQYXRoID0gKCkgPT4gJydcblxuICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi51c2VLaXRlJywgZmFsc2UpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1weXRob24nKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKCd0ZXN0LnB5JylcbiAgICBydW5zIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvci5zZXRHcmFtbWFyKGF0b20uZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZSgndGVzdC5weScpKVxuICAgICAgYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnYXV0b2NvbXBsZXRlLXB5dGhvbicpLmFjdGl2YXRpb25Ib29rcyA9IFtdXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdXRvY29tcGxldGUtcHl0aG9uJylcbiAgICBydW5zIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ2F1dG9jb21wbGV0ZS1weXRob24nKS5tYWluTW9kdWxlLmxvYWQoKVxuICAgIHJ1bnMgLT4gcHJvdmlkZXIgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoXG4gICAgICAnYXV0b2NvbXBsZXRlLXB5dGhvbicpLm1haW5Nb2R1bGUuZ2V0UHJvdmlkZXIoKVxuXG4gIGl0ICdhdXRvY29tcGxldGVzIGJ1aWx0aW5zJywgLT5cbiAgICBlZGl0b3Iuc2V0VGV4dCAnaXNpbnN0YW5jJ1xuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMSwgMF0pXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBnZXRDb21wbGV0aW9ucygpLnRoZW4gKGNvbXBsZXRpb25zKSAtPlxuICAgICAgICBmb3IgY29tcGxldGlvbiBpbiBjb21wbGV0aW9uc1xuICAgICAgICAgIGV4cGVjdChjb21wbGV0aW9uLnRleHQubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4gMFxuICAgICAgICAgIGV4cGVjdChjb21wbGV0aW9uLnRleHQpLnRvQmUgJ2lzaW5zdGFuY2UnXG4gICAgICAgIGV4cGVjdChjb21wbGV0aW9ucy5sZW5ndGgpLnRvQmUgMVxuXG4gIGl0ICdhdXRvY29tcGxldGVzIHB5dGhvbiBrZXl3b3JkcycsIC0+XG4gICAgZWRpdG9yLnNldFRleHQgJ2ltcG8nXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxLCAwXSlcbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGdldENvbXBsZXRpb25zKCkudGhlbiAoY29tcGxldGlvbnMpIC0+XG4gICAgICAgIGZvciBjb21wbGV0aW9uIGluIGNvbXBsZXRpb25zXG4gICAgICAgICAgaWYgY29tcGxldGlvbi50eXBlID09ICdrZXl3b3JkJ1xuICAgICAgICAgICAgZXhwZWN0KGNvbXBsZXRpb24udGV4dCkudG9CZSAnaW1wb3J0J1xuICAgICAgICAgIGV4cGVjdChjb21wbGV0aW9uLnRleHQubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4gMFxuICAgICAgICBleHBlY3QoY29tcGxldGlvbnMubGVuZ3RoKS50b0JlIDNcblxuICBpdCAnYXV0b2NvbXBsZXRlcyBkZWZpbmVkIGZ1bmN0aW9ucycsIC0+XG4gICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICBkZWYgaGVsbG9fd29ybGQoKTpcbiAgICAgICAgcmV0dXJuIFRydWVcbiAgICAgIGhlbGxcbiAgICBcIlwiXCJcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzMsIDBdKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgZ2V0Q29tcGxldGlvbnMoKS50aGVuIChjb21wbGV0aW9ucykgLT5cbiAgICAgICAgZXhwZWN0KGNvbXBsZXRpb25zWzBdLnRleHQpLnRvQmUgJ2hlbGxvX3dvcmxkJ1xuICAgICAgICBleHBlY3QoY29tcGxldGlvbnMubGVuZ3RoKS50b0JlIDFcblxuICBpdCAnZ29lcyB0byBkZWZpbml0aW9uJywgLT5cbiAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgIGRlZiBhYmMoKTpcbiAgICAgICAgICByZXR1cm4gVHJ1ZVxuICAgICAgeCA9IGFiYygpXG4gICAgXCJcIlwiXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsyLCA0XSlcbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGdvVG9EZWZpbml0aW9uKCkudGhlbiAtPlxuICAgICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgICByb3c6IDBcbiAgICAgICAgICAgIGNvbHVtbjogNFxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCByZXN1bHRcblxuICBpdCAnYXV0b2NvbXBsZXRlcyBmdW5jdGlvbiBhcmd1bWVudCcsIC0+XG4gICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICBkZWYgYWJjKHgsIHo6IHN0cik6XG4gICAgICAgIHJldHVybiBUcnVlXG4gICAgICB4ID0gYWJjKClcbiAgICBcIlwiXCJcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzIsIDhdKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgZ2V0Q29tcGxldGlvbnMoKS50aGVuIChjb21wbGV0aW9ucykgLT5cbiAgICAgICAgZXhwZWN0KGNvbXBsZXRpb25zLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuIDFcbiAgICAgICAgZXhwZWN0KGNvbXBsZXRpb25zWzBdLnRleHQpLnRvQmUgJ3gnXG4gICAgICAgIGV4cGVjdChjb21wbGV0aW9uc1sxXS50ZXh0KS50b0JlICd6OiBzdHInXG5cbiAgaXQgJ2dldHMgbWV0aG9kcycsIC0+XG4gICAgRmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAndGVzdC5weScpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oRmlsZVBhdGgpXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs1LCA0XSlcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgZ2V0TWV0aG9kcygpLnRoZW4gKHttZXRob2RzLCBpbmRlbnQsIGJ1ZmZlclBvc2l0aW9ufSkgLT5cbiAgICAgICAgZXhwZWN0KGluZGVudCkudG9CZSA0XG5cbiAgICAgICAgZXhwZWN0ZWRCdWZmZXIgPVxuICAgICAgICAgIHJvdzogNVxuICAgICAgICAgIGNvbHVtbjogNFxuICAgICAgICBleHBlY3QoYnVmZmVyUG9zaXRpb24pLnRvRXF1YWwgZXhwZWN0ZWRCdWZmZXJcblxuICAgICAgICBleHBlY3QobWV0aG9kcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbiAwXG5cbiAgICAgICAgZXhwZWN0ZWRNZXRob2QgPVxuICAgICAgICAgIHBhcmVudDogJ0ZvbydcbiAgICAgICAgICBpbnN0YW5jZTogJ0JhcidcbiAgICAgICAgICBuYW1lOiAndGVzdCdcbiAgICAgICAgICBwYXJhbXM6IFtdXG4gICAgICAgICAgbW9kdWxlTmFtZTogJ3Rlc3QnXG4gICAgICAgICAgZmlsZU5hbWU6IEZpbGVQYXRoXG4gICAgICAgICAgbGluZTogMlxuICAgICAgICAgIGNvbHVtbjogOFxuICAgICAgICBleHBlY3QobWV0aG9kc1swXSkudG9FcXVhbCBleHBlY3RlZE1ldGhvZFxuXG4gIGl0ICdnZXRzIHVzYWdlcycsIC0+XG4gICAgRmlsZVBhdGhzID0gW1xuICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ3Rlc3QucHknKVxuICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ2Fub3RoZXIucHknKVxuICAgIF1cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3Blbih7cGF0aHNUb09wZW46IEZpbGVQYXRoc30pXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs0LCAxM10pXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBnZXRVc2FnZXMoKS50aGVuICh1c2FnZXMpIC0+XG4gICAgICAgIGV4cGVjdCh1c2FnZXMubGVuZ3RoKS50b0JlIDNcblxuICAgICAgICBleHBlY3RlZFVzYWdlID1cbiAgICAgICAgICBuYW1lOiAnRm9vJ1xuICAgICAgICAgIG1vZHVsZU5hbWU6ICd0ZXN0J1xuICAgICAgICAgIGZpbGVOYW1lOiBGaWxlUGF0aHNbMF1cbiAgICAgICAgICBsaW5lOiAxXG4gICAgICAgICAgY29sdW1uOiA2XG4gICAgICAgIGV4cGVjdCh1c2FnZXMpLnRvQ29udGFpbiBleHBlY3RlZFVzYWdlXG5cbiAgICAgICAgZXhwZWN0ZWRVc2FnZSA9XG4gICAgICAgICAgbmFtZTogJ0ZvbydcbiAgICAgICAgICBtb2R1bGVOYW1lOiAnYW5vdGhlcidcbiAgICAgICAgICBmaWxlTmFtZTogRmlsZVBhdGhzWzFdXG4gICAgICAgICAgbGluZTogM1xuICAgICAgICAgIGNvbHVtbjogOVxuICAgICAgICBleHBlY3QodXNhZ2VzKS50b0NvbnRhaW4gZXhwZWN0ZWRVc2FnZVxuXG4gIGl0ICdmdXp6eSBtYXRjaGVzJywgLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uZnV6enlNYXRjaGVyJywgdHJ1ZSlcblxuICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgZGVmIGFiY2RlZigpOlxuICAgICAgICByZXR1cm4gVHJ1ZVxuICAgICAgYWJkZlxuICAgIFwiXCJcIlxuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMywgMF0pXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGdldENvbXBsZXRpb25zKCkudGhlbiAoY29tcGxldGlvbnMpIC0+XG4gICAgICAgIGV4cGVjdChjb21wbGV0aW9uc1swXS50ZXh0KS50b0JlICdhYmNkZWYnXG4gICAgICAgIGV4cGVjdChjb21wbGV0aW9ucy5sZW5ndGgpLnRvQmUgMVxuXG4gIGl0ICdkb2VzIG5vdCBmdXp6eSBtYXRjaCBpZiBkaXNhYmxlZCcsIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLmZ1enp5TWF0Y2hlcicsIGZhbHNlKVxuXG4gICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICBkZWYgYWJjZGVmKCk6XG4gICAgICAgIHJldHVybiBUcnVlXG4gICAgICBhYmRmXG4gICAgXCJcIlwiXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFszLCAwXSlcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgZ2V0Q29tcGxldGlvbnMoKS50aGVuIChjb21wbGV0aW9ucykgLT5cbiAgICAgICAgZXhwZWN0KGNvbXBsZXRpb25zLmxlbmd0aCkudG9CZSAwXG5cbiAgaXQgJ3VzZXMgcHJvdmlkZWQgcmVnZXggZm9yIHRyaWdnZXJpbmcgY29tcGxldGlvbnMnLCAtPlxuICAgICMgU2V0IHRyaWdnZXJDb21wbGV0aW9uUmVnZXggd2l0aG91dCByZXN0YXJ0aW5nXG4gICAgcHJvdmlkZXIudHJpZ2dlckNvbXBsZXRpb25SZWdleCA9IFJlZ0V4cCAnYSdcblxuICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgYSA9IFsxLCAzLCAyXVxuICAgICAgYS5cbiAgICBcIlwiXCJcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzIsIDBdKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBnZXRDb21wbGV0aW9ucygpLnRoZW4gKGNvbXBsZXRpb25zKSAtPlxuICAgICAgICBleHBlY3QoY29tcGxldGlvbnMubGVuZ3RoKS50b0JlIDBcbiAgICAgICAgIyBVbi1zZXQgdHJpZ2dlckNvbXBsZXRpb25SZWdleFxuICAgICAgICBwcm92aWRlci50cmlnZ2VyQ29tcGxldGlvblJlZ2V4ID0gUmVnRXhwIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi50cmlnZ2VyQ29tcGxldGlvblJlZ2V4JylcblxuICBpdCAndXNlcyBleHRyYSBwYXRocyBmb3IgcGFja2FnZXMnLCAtPlxuICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ3BhY2thZ2VzJylcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uZXh0cmFQYXRocycsIGZpbGVQYXRoKVxuXG4gICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICBpbXBvcnQgdGVzdF9wa2dcbiAgICAgIHRlc3RfcGtnLlxuICAgIFwiXCJcIlxuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMiwgMF0pXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGdldENvbXBsZXRpb25zKCkudGhlbiAoY29tcGxldGlvbnMpIC0+XG4gICAgICAgIGV4cGVjdChjb21wbGV0aW9ucy5sZW5ndGgpLnRvQmUgNVxuICAgICAgICBleHBlY3QoY29tcGxldGlvbnNbMF0udGV4dCkudG9CZSAnRm9vQmFyJ1xuXG54ZGVzY3JpYmUgJ0FyZ3VtZW50IGNvbXBsZXRpb25zJywgLT5cbiAgW2VkaXRvciwgcHJvdmlkZXIsIGVkaXRvckVsZW1lbnRdID0gW11cblxuICBnZXRBcmd1bWVudGNvbXBsZXRpb25zID0gLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgJ2F1dG9jb21wbGV0ZS1weXRob246Y29tcGxldGUtYXJndW1lbnRzJykpXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi51c2VLaXRlJywgZmFsc2UpXG4gICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnYXJndW1lbnQtdGVzdC5weScpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1weXRob24nKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKVxuICAgIHJ1bnMgLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00oZWRpdG9yRWxlbWVudClcbiAgICAgIGVkaXRvci5zZXRHcmFtbWFyKGF0b20uZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZSgndGVzdC5weScpKVxuICAgICAgYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnYXV0b2NvbXBsZXRlLXB5dGhvbicpLmFjdGl2YXRpb25Ib29rcyA9IFtdXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdXRvY29tcGxldGUtcHl0aG9uJylcbiAgICBydW5zIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ2F1dG9jb21wbGV0ZS1weXRob24nKS5tYWluTW9kdWxlLmxvYWQoKVxuICAgIHJ1bnMgLT4gcHJvdmlkZXIgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoXG4gICAgICAnYXV0b2NvbXBsZXRlLXB5dGhvbicpLm1haW5Nb2R1bGUuZ2V0UHJvdmlkZXIoKVxuXG5cbiAgaXQgJ2NvbXBsZXRlcyBhbGwgZnVuY3Rpb24gcGFyYW1ldGVycycsIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnVzZVNuaXBwZXRzJywgJ2FsbCcpXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsyLCA0XSlcbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGdldEFyZ3VtZW50Y29tcGxldGlvbnMoKS50aGVuIC0+XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnRvU3RyaW5nKCkpXG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGVkaXRvci5nZXRUZXh0KCkudG9TdHJpbmcoKSlcblxuICBpdCAnY29tcGxldGVzIGFsbCBmdW5jdGlvbiBwYXJhbWV0ZXJzJywgLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2F1dG9jb21wbGV0ZS1weXRob24udXNlU25pcHBldHMnLCAncmVxdWlyZWQnKVxuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMiwgNF0pXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBnZXRBcmd1bWVudGNvbXBsZXRpb25zKCkudGhlbiAtPlxuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS50b1N0cmluZygpKVxuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShlZGl0b3IuZ2V0VGV4dCgpLnRvU3RyaW5nKCkpXG5cbnhkZXNjcmliZSAnRGlzcGxheXMgdmlld3MnLCAtPlxuICBbZWRpdG9yLCBwcm92aWRlciwgZWRpdG9yRWxlbWVudF0gPSBbXVxuXG4gIHNob3dVc2FnZXMgPSAtPlxuICAgIGphc21pbmUuYXR0YWNoVG9ET00oZWRpdG9yRWxlbWVudClcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsICdhdXRvY29tcGxldGUtcHl0aG9uOnNob3ctdXNhZ2VzJylcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnVzZUtpdGUnLCBmYWxzZSlcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLXB5dGhvbicpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ3Rlc3QucHknKVxuICAgIHJ1bnMgLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICBlZGl0b3Iuc2V0R3JhbW1hcihhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoJ3Rlc3QucHknKSlcbiAgICAgIGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UoJ2F1dG9jb21wbGV0ZS1weXRob24nKS5hY3RpdmF0aW9uSG9va3MgPSBbXVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYXV0b2NvbXBsZXRlLXB5dGhvbicpXG4gICAgcnVucyAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdhdXRvY29tcGxldGUtcHl0aG9uJykubWFpbk1vZHVsZS5sb2FkKClcbiAgICBydW5zIC0+IHByb3ZpZGVyID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKFxuICAgICAgICAgICAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uJykubWFpbk1vZHVsZS5nZXRQcm92aWRlcigpXG5cbiAgaXQgJ3Nob3dzIHVzYWdlIHZpZXcnLCAtPlxuICAgIEZpbGVQYXRocyA9IFtcbiAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICd0ZXN0LnB5JylcbiAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdhbm90aGVyLnB5JylcbiAgICBdXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oe3BhdGhzVG9PcGVuOiBGaWxlUGF0aHN9KVxuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNCwgMTNdKVxuICAgIHNob3dVc2FnZXMoKVxuXG4gICAgd2FpdHNGb3IgXCJ2aWV3IHRvIHNob3dcIiwgLT5cbiAgICAgIHByb3ZpZGVyLnVzYWdlc1ZpZXc/LmlzVmlzaWJsZSgpXG5cbiAgICB3YWl0c0ZvciBcInZpZXcgdG8gcG9wdWxhdGVcIiwgLT5cbiAgICAgIHByb3ZpZGVyLnVzYWdlc1ZpZXcuaXRlbXM/Lmxlbmd0aCA+IDBcblxuICAgIHJ1bnMgLT5cbiAgICAgIGV4cGVjdChwcm92aWRlci51c2FnZXNWaWV3KS50b0hhdmVGb2N1cygpXG4gICAgICBleHBlY3QocHJvdmlkZXIudXNhZ2VzVmlldy5pdGVtcy5sZW5ndGgpLnRvQmUgM1xuIl19
