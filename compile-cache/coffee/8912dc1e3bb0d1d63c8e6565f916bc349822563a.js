(function() {
  var log;

  log = require('./log');

  module.exports = {
    selector: '.source.python',
    disableForSelector: '.source.python .comment, .source.python .string',
    inclusionPriority: 2,
    suggestionPriority: atom.config.get('autocomplete-python-jedi.suggestionPriority'),
    excludeLowerPriority: false,
    cacheSize: 10,
    _addEventListener: function(editor, eventName, handler) {
      var disposable, editorView;
      editorView = atom.views.getView(editor);
      editorView.addEventListener(eventName, handler);
      disposable = new this.Disposable(function() {
        log.debug('Unsubscribing from event listener ', eventName, handler);
        return editorView.removeEventListener(eventName, handler);
      });
      return disposable;
    },
    _noExecutableError: function(error) {
      if (this.providerNoExecutable) {
        return;
      }
      log.warning('No python executable found', error);
      atom.notifications.addWarning('autocomplete-python-jedi unable to find python binary.', {
        detail: "Please set path to python executable manually in package\nsettings and restart your editor. Be sure to migrate on new settings\nif everything worked on previous version.\nDetailed error message: " + error + "\n\nCurrent config: " + (atom.config.get('autocomplete-python-jedi.pythonPaths')),
        dismissable: true
      });
      return this.providerNoExecutable = true;
    },
    _spawnDaemon: function() {
      var interpreter, ref;
      interpreter = this.InterpreterLookup.getInterpreter();
      log.debug('Using interpreter', interpreter);
      this.provider = new this.BufferedProcess({
        command: interpreter || 'python',
        args: [__dirname + '/completion.py'],
        stdout: (function(_this) {
          return function(data) {
            return _this._deserialize(data);
          };
        })(this),
        stderr: (function(_this) {
          return function(data) {
            var ref, requestId, resolve, results1;
            if (data.indexOf('is not recognized as an internal or external') > -1) {
              return _this._noExecutableError(data);
            }
            log.debug("autocomplete-python-jedi traceback output: " + data);
            if (data.indexOf('jedi') > -1) {
              if (atom.config.get('autocomplete-python-jedi.outputProviderErrors')) {
                atom.notifications.addWarning('Looks like this error originated from Jedi. Please report this \nissue to autocomplete-python-jedi so we can help improve Jedi. \nTurn off the `outputProviderErrors` setting to hide such errors \nin future. Traceback output:', {
                  detail: "" + data,
                  dismissable: true
                });
              }
            } else {
              atom.notifications.addError('autocomplete-python-jedi traceback output:', {
                detail: "" + data,
                dismissable: true
              });
            }
            log.debug("Forcing to resolve " + (Object.keys(_this.requests).length) + " promises");
            ref = _this.requests;
            results1 = [];
            for (requestId in ref) {
              resolve = ref[requestId];
              if (typeof resolve === 'function') {
                resolve([]);
              }
              results1.push(delete _this.requests[requestId]);
            }
            return results1;
          };
        })(this),
        exit: (function(_this) {
          return function(code) {
            return log.warning('Process exit with', code, _this.provider);
          };
        })(this)
      });
      this.provider.onWillThrowError((function(_this) {
        return function(arg) {
          var error, handle;
          error = arg.error, handle = arg.handle;
          if (error.code === 'ENOENT' && error.syscall.indexOf('spawn') === 0) {
            _this._noExecutableError(error);
            _this.dispose();
            return handle();
          } else {
            throw error;
          }
        };
      })(this));
      if ((ref = this.provider.process) != null) {
        ref.stdin.on('error', function(err) {
          return log.debug('stdin', err);
        });
      }
      return setTimeout((function(_this) {
        return function() {
          log.debug('Killing python process after timeout...');
          if (_this.provider && _this.provider.process) {
            return _this.provider.kill();
          }
        };
      })(this), 60 * 10 * 1000);
    },
    load: function() {
      if (!this.constructed) {
        this.constructor();
      }
      return this;
    },
    constructor: function() {
      var err, ref, selector;
      ref = require('atom'), this.Disposable = ref.Disposable, this.CompositeDisposable = ref.CompositeDisposable, this.BufferedProcess = ref.BufferedProcess;
      this.selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;
      this.Selector = require('selector-kit').Selector;
      this.DefinitionsView = require('./definitions-view');
      this.UsagesView = require('./usages-view');
      this.OverrideView = require('./override-view');
      this.RenameView = require('./rename-view');
      this.InterpreterLookup = require('./interpreters-lookup');
      this._ = require('underscore');
      this.filter = require('fuzzaldrin-plus').filter;
      this._showSignatureOverlay = require('./tooltips')._showSignatureOverlay;
      this.requests = {};
      this.responses = {};
      this.provider = null;
      this.disposables = new this.CompositeDisposable;
      this.subscriptions = {};
      this.definitionsView = null;
      this.usagesView = null;
      this.renameView = null;
      this.constructed = true;
      this.snippetsManager = null;
      log.debug("Init autocomplete-python-jedi with priority " + this.suggestionPriority);
      try {
        this.triggerCompletionRegex = RegExp(atom.config.get('autocomplete-python-jedi.triggerCompletionRegex'));
      } catch (error1) {
        err = error1;
        atom.notifications.addWarning('autocomplete-python-jedi invalid regexp to trigger autocompletions.\nFalling back to default value.', {
          detail: "Original exception: " + err,
          dismissable: true
        });
        atom.config.set('autocomplete-python-jedi.triggerCompletionRegex', '([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)');
        this.triggerCompletionRegex = /([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)/;
      }
      selector = 'atom-text-editor[data-grammar~=python]';
      atom.commands.add(selector, 'autocomplete-python-jedi:go-to-definition', (function(_this) {
        return function() {
          return _this.goToDefinition();
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python-jedi:complete-arguments', (function(_this) {
        return function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return _this._completeArguments(editor, editor.getCursorBufferPosition(), true);
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python-jedi:show-usages', (function(_this) {
        return function() {
          var bufferPosition, editor;
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          if (_this.usagesView) {
            _this.usagesView.destroy();
          }
          _this.usagesView = new _this.UsagesView();
          return _this.getUsages(editor, bufferPosition).then(function(usages) {
            return _this.usagesView.setItems(usages);
          });
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python-jedi:override-method', (function(_this) {
        return function() {
          var bufferPosition, editor;
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          if (_this.overrideView) {
            _this.overrideView.destroy();
          }
          _this.overrideView = new _this.OverrideView();
          return _this.getMethods(editor, bufferPosition).then(function(arg) {
            var bufferPosition, indent, methods;
            methods = arg.methods, indent = arg.indent, bufferPosition = arg.bufferPosition;
            _this.overrideView.indent = indent;
            _this.overrideView.bufferPosition = bufferPosition;
            return _this.overrideView.setItems(methods);
          });
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python-jedi:rename', (function(_this) {
        return function() {
          var bufferPosition, editor;
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          return _this.getUsages(editor, bufferPosition).then(function(usages) {
            if (_this.renameView) {
              _this.renameView.destroy();
            }
            if (usages.length > 0) {
              _this.renameView = new _this.RenameView(usages);
              return _this.renameView.onInput(function(newName) {
                var _relative, fileName, project, ref1, ref2, results1;
                ref1 = _this._.groupBy(usages, 'fileName');
                results1 = [];
                for (fileName in ref1) {
                  usages = ref1[fileName];
                  ref2 = atom.project.relativizePath(fileName), project = ref2[0], _relative = ref2[1];
                  if (project) {
                    results1.push(_this._updateUsagesInFile(fileName, usages, newName));
                  } else {
                    results1.push(log.debug('Ignoring file outside of project', fileName));
                  }
                }
                return results1;
              });
            } else {
              if (_this.usagesView) {
                _this.usagesView.destroy();
              }
              _this.usagesView = new _this.UsagesView();
              return _this.usagesView.setItems(usages);
            }
          });
        };
      })(this));
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this._handleGrammarChangeEvent(editor, editor.getGrammar());
          return editor.onDidChangeGrammar(function(grammar) {
            return _this._handleGrammarChangeEvent(editor, grammar);
          });
        };
      })(this));
      return atom.config.onDidChange('autocomplete-plus.enableAutoActivation', (function(_this) {
        return function() {
          return atom.workspace.observeTextEditors(function(editor) {
            return _this._handleGrammarChangeEvent(editor, editor.getGrammar());
          });
        };
      })(this));
    },
    _updateUsagesInFile: function(fileName, usages, newName) {
      var columnOffset;
      columnOffset = {};
      return atom.workspace.open(fileName, {
        activateItem: false
      }).then(function(editor) {
        var buffer, column, i, len, line, name, usage;
        buffer = editor.getBuffer();
        for (i = 0, len = usages.length; i < len; i++) {
          usage = usages[i];
          name = usage.name, line = usage.line, column = usage.column;
          if (columnOffset[line] == null) {
            columnOffset[line] = 0;
          }
          log.debug('Replacing', usage, 'with', newName, 'in', editor.id);
          log.debug('Offset for line', line, 'is', columnOffset[line]);
          buffer.setTextInRange([[line - 1, column + columnOffset[line]], [line - 1, column + name.length + columnOffset[line]]], newName);
          columnOffset[line] += newName.length - name.length;
        }
        return buffer.save();
      });
    },
    _handleGrammarChangeEvent: function(editor, grammar) {
      var disposable, eventId, eventName;
      eventName = 'keyup';
      eventId = editor.id + "." + eventName;
      if (grammar.scopeName === 'source.python') {
        if (atom.config.get('autocomplete-python-jedi.showTooltips') === true) {
          editor.onDidChangeCursorPosition((function(_this) {
            return function(event) {
              return _this._showSignatureOverlay(event, _this);
            };
          })(this));
        }
        if (!atom.config.get('autocomplete-plus.enableAutoActivation')) {
          log.debug('Ignoring keyup events due to autocomplete-plus settings.');
          return;
        }
        disposable = this._addEventListener(editor, eventName, (function(_this) {
          return function(e) {
            if (atom.keymaps.keystrokeForKeyboardEvent(e) === '^(') {
              log.debug('Trying to complete arguments on keyup event', e);
              return _this._completeArguments(editor, editor.getCursorBufferPosition());
            }
          };
        })(this));
        this.disposables.add(disposable);
        this.subscriptions[eventId] = disposable;
        return log.debug('Subscribed on event', eventId);
      } else {
        if (eventId in this.subscriptions) {
          this.subscriptions[eventId].dispose();
          return log.debug('Unsubscribed from event', eventId);
        }
      }
    },
    _serialize: function(request) {
      log.debug('Serializing request to be sent to Jedi', request);
      return JSON.stringify(request);
    },
    _sendRequest: function(data, respawned) {
      var process;
      log.debug('Pending requests:', Object.keys(this.requests).length, this.requests);
      if (Object.keys(this.requests).length > 10) {
        log.debug('Cleaning up request queue to avoid overflow, ignoring request');
        this.requests = {};
        if (this.provider && this.provider.process) {
          log.debug('Killing python process');
          this.provider.kill();
          return;
        }
      }
      if (this.provider && this.provider.process) {
        process = this.provider.process;
        if (process.exitCode === null && process.signalCode === null) {
          if (this.provider.process.pid) {
            return this.provider.process.stdin.write(data + '\n');
          } else {
            return log.debug('Attempt to communicate with terminated process', this.provider);
          }
        } else if (respawned) {
          atom.notifications.addWarning(["Failed to spawn daemon for autocomplete-python-jedi.", "Completions will not work anymore", "unless you restart your editor."].join(' '), {
            detail: ["exitCode: " + process.exitCode, "signalCode: " + process.signalCode].join('\n'),
            dismissable: true
          });
          return this.dispose();
        } else {
          this._spawnDaemon();
          this._sendRequest(data, {
            respawned: true
          });
          return log.debug('Re-spawning python process...');
        }
      } else {
        log.debug('Spawning python process...');
        this._spawnDaemon();
        return this._sendRequest(data);
      }
    },
    _deserialize: function(response) {
      var bufferPosition, cacheSizeDelta, e, editor, i, id, ids, j, len, len1, ref, ref1, ref2, resolve, responseSource, results1;
      log.debug('Deserealizing response from Jedi', response);
      log.debug("Got " + (response.trim().split('\n').length) + " lines");
      ref = response.trim().split('\n');
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        responseSource = ref[i];
        try {
          response = JSON.parse(responseSource);
        } catch (error1) {
          e = error1;
          throw new Error("Failed to parse JSON from \"" + responseSource + "\".\nOriginal exception: " + e);
        }
        if (response['arguments']) {
          editor = this.requests[response['id']];
          if (typeof editor === 'object') {
            bufferPosition = editor.getCursorBufferPosition();
            if (response['id'] === this._generateRequestId('arguments', editor, bufferPosition)) {
              if ((ref1 = this.snippetsManager) != null) {
                ref1.insertSnippet(response['arguments'], editor);
              }
            }
          }
        } else {
          resolve = this.requests[response['id']];
          if (typeof resolve === 'function') {
            resolve(response['results']);
          }
        }
        cacheSizeDelta = Object.keys(this.responses).length > this.cacheSize;
        if (cacheSizeDelta > 0) {
          ids = Object.keys(this.responses).sort((function(_this) {
            return function(a, b) {
              return _this.responses[a]['timestamp'] - _this.responses[b]['timestamp'];
            };
          })(this));
          ref2 = ids.slice(0, cacheSizeDelta);
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            id = ref2[j];
            log.debug('Removing old item from cache with ID', id);
            delete this.responses[id];
          }
        }
        this.responses[response['id']] = {
          source: responseSource,
          timestamp: Date.now()
        };
        log.debug('Cached request with ID', response['id']);
        results1.push(delete this.requests[response['id']]);
      }
      return results1;
    },
    _generateRequestId: function(type, editor, bufferPosition, text) {
      if (!text) {
        text = editor.getText();
      }
      return require('crypto').createHash('md5').update([editor.getPath(), text, bufferPosition.row, bufferPosition.column, type].join()).digest('hex');
    },
    _generateRequestConfig: function() {
      var args, extraPaths;
      extraPaths = this.InterpreterLookup.applySubstitutions(atom.config.get('autocomplete-python-jedi.extraPaths').split(';'));
      args = {
        'extraPaths': extraPaths,
        'useSnippets': atom.config.get('autocomplete-python-jedi.useSnippets'),
        'caseInsensitiveCompletion': atom.config.get('autocomplete-python-jedi.caseInsensitiveCompletion'),
        'showDescriptions': atom.config.get('autocomplete-python-jedi.showDescriptions'),
        'fuzzyMatcher': atom.config.get('autocomplete-python-jedi.fuzzyMatcher')
      };
      return args;
    },
    setSnippetsManager: function(snippetsManager) {
      this.snippetsManager = snippetsManager;
    },
    _completeArguments: function(editor, bufferPosition, force) {
      var disableForSelector, line, lines, payload, prefix, scopeChain, scopeDescriptor, suffix, useSnippets;
      useSnippets = atom.config.get('autocomplete-python-jedi.useSnippets');
      if (!force && useSnippets === 'none') {
        atom.commands.dispatch(document.querySelector('atom-text-editor'), 'autocomplete-plus:activate');
        return;
      }
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
      scopeChain = scopeDescriptor.getScopeChain();
      disableForSelector = this.Selector.create(this.disableForSelector);
      if (this.selectorsMatchScopeChain(disableForSelector, scopeChain)) {
        log.debug('Ignoring argument completion inside of', scopeChain);
        return;
      }
      lines = editor.getBuffer().getLines();
      line = lines[bufferPosition.row];
      prefix = line.slice(bufferPosition.column - 1, bufferPosition.column);
      if (prefix !== '(') {
        log.debug('Ignoring argument completion with prefix', prefix);
        return;
      }
      suffix = line.slice(bufferPosition.column, line.length);
      if (!/^(\)(?:$|\s)|\s|$)/.test(suffix)) {
        log.debug('Ignoring argument completion with suffix', suffix);
        return;
      }
      payload = {
        id: this._generateRequestId('arguments', editor, bufferPosition),
        lookup: 'arguments',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function() {
          return _this.requests[payload.id] = editor;
        };
      })(this));
    },
    _fuzzyFilter: function(candidates, query) {
      if (candidates.length !== 0 && (query !== ' ' && query !== '.' && query !== '(')) {
        candidates = this.filter(candidates, query, {
          key: 'text'
        });
      }
      return candidates;
    },
    getSuggestions: function(arg) {
      var bufferPosition, editor, lastIdentifier, line, lines, matches, payload, prefix, requestId, scopeDescriptor;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      this.load();
      if (!this.triggerCompletionRegex.test(prefix)) {
        return this.lastSuggestions = [];
      }
      bufferPosition = {
        row: bufferPosition.row,
        column: bufferPosition.column
      };
      lines = editor.getBuffer().getLines();
      if (atom.config.get('autocomplete-python-jedi.fuzzyMatcher')) {
        line = lines[bufferPosition.row];
        lastIdentifier = /\.?[a-zA-Z_][a-zA-Z0-9_]*$/.exec(line.slice(0, bufferPosition.column));
        if (lastIdentifier) {
          bufferPosition.column = lastIdentifier.index + 1;
          lines[bufferPosition.row] = line.slice(0, bufferPosition.column);
        }
      }
      requestId = this._generateRequestId('completions', editor, bufferPosition, lines.join('\n'));
      if (requestId in this.responses) {
        log.debug('Using cached response with ID', requestId);
        matches = JSON.parse(this.responses[requestId]['source'])['results'];
        if (atom.config.get('autocomplete-python-jedi.fuzzyMatcher')) {
          return this.lastSuggestions = this._fuzzyFilter(matches, prefix);
        } else {
          return this.lastSuggestions = matches;
        }
      }
      payload = {
        id: requestId,
        prefix: prefix,
        lookup: 'completions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          if (atom.config.get('autocomplete-python-jedi.fuzzyMatcher')) {
            return _this.requests[payload.id] = function(matches) {
              return resolve(_this.lastSuggestions = _this._fuzzyFilter(matches, prefix));
            };
          } else {
            return _this.requests[payload.id] = function(suggestions) {
              return resolve(_this.lastSuggestions = suggestions);
            };
          }
        };
      })(this));
    },
    getDefinitions: function(editor, bufferPosition) {
      var payload;
      payload = {
        id: this._generateRequestId('definitions', editor, bufferPosition),
        lookup: 'definitions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = resolve;
        };
      })(this));
    },
    getUsages: function(editor, bufferPosition) {
      var payload;
      payload = {
        id: this._generateRequestId('usages', editor, bufferPosition),
        lookup: 'usages',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = resolve;
        };
      })(this));
    },
    getMethods: function(editor, bufferPosition) {
      var indent, lines, payload;
      indent = bufferPosition.column;
      lines = editor.getBuffer().getLines();
      lines.splice(bufferPosition.row + 1, 0, "  def __autocomplete_python(s):");
      lines.splice(bufferPosition.row + 2, 0, "    s.");
      payload = {
        id: this._generateRequestId('methods', editor, bufferPosition),
        lookup: 'methods',
        path: editor.getPath(),
        source: lines.join('\n'),
        line: bufferPosition.row + 2,
        column: 6,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = function(methods) {
            return resolve({
              methods: methods,
              indent: indent,
              bufferPosition: bufferPosition
            });
          };
        };
      })(this));
    },
    goToDefinition: function(editor, bufferPosition) {
      if (!editor) {
        editor = atom.workspace.getActiveTextEditor();
      }
      if (!bufferPosition) {
        bufferPosition = editor.getCursorBufferPosition();
      }
      if (this.definitionsView) {
        this.definitionsView.destroy();
      }
      this.definitionsView = new this.DefinitionsView();
      return this.getDefinitions(editor, bufferPosition).then((function(_this) {
        return function(results) {
          _this.definitionsView.setItems(results);
          if (results.length === 1) {
            return _this.definitionsView.confirmed(results[0]);
          }
        };
      })(this));
    },
    dispose: function() {
      if (this.disposables) {
        this.disposables.dispose();
      }
      if (this.provider) {
        return this.provider.kill();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24tamVkaS9saWIvcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0VBRU4sTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxnQkFBVjtJQUNBLGtCQUFBLEVBQW9CLGlEQURwQjtJQUVBLGlCQUFBLEVBQW1CLENBRm5CO0lBR0Esa0JBQUEsRUFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZDQUFoQixDQUhwQjtJQUlBLG9CQUFBLEVBQXNCLEtBSnRCO0lBS0EsU0FBQSxFQUFXLEVBTFg7SUFPQSxpQkFBQSxFQUFtQixTQUFDLE1BQUQsRUFBUyxTQUFULEVBQW9CLE9BQXBCO0FBQ2pCLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CO01BQ2IsVUFBVSxDQUFDLGdCQUFYLENBQTRCLFNBQTVCLEVBQXVDLE9BQXZDO01BQ0EsVUFBQSxHQUFhLElBQUksSUFBQyxDQUFBLFVBQUwsQ0FBZ0IsU0FBQTtRQUMzQixHQUFHLENBQUMsS0FBSixDQUFVLG9DQUFWLEVBQWdELFNBQWhELEVBQTJELE9BQTNEO2VBQ0EsVUFBVSxDQUFDLG1CQUFYLENBQStCLFNBQS9CLEVBQTBDLE9BQTFDO01BRjJCLENBQWhCO0FBR2IsYUFBTztJQU5VLENBUG5CO0lBZUEsa0JBQUEsRUFBb0IsU0FBQyxLQUFEO01BQ2xCLElBQUcsSUFBQyxDQUFBLG9CQUFKO0FBQ0UsZUFERjs7TUFFQSxHQUFHLENBQUMsT0FBSixDQUFZLDRCQUFaLEVBQTBDLEtBQTFDO01BQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUNFLHdEQURGLEVBQzREO1FBQzFELE1BQUEsRUFB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QUFBLGVBQUQsR0FBbUIsSUFBSSxJQUFDLENBQUEsZUFBTCxDQUFBO2FBQ25CLElBQUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCLEVBQXdCLGNBQXhCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7VUFDM0MsS0FBQyxDQUFBLGVBQWUsQ0FBQyxRQUFqQixDQUEwQixPQUExQjtVQUNBLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7bUJBQ0UsS0FBQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixDQUEyQixPQUFRLENBQUEsQ0FBQSxDQUFuQyxFQURGOztRQUYyQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0M7SUFSYyxDQXRjaEI7SUFtZEEsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFHLElBQUMsQ0FBQSxXQUFKO1FBQ0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFERjs7TUFFQSxJQUFHLElBQUMsQ0FBQSxRQUFKO2VBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQUEsRUFERjs7SUFITyxDQW5kVDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbImxvZyA9IHJlcXVpcmUgJy4vbG9nJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNlbGVjdG9yOiAnLnNvdXJjZS5weXRob24nXG4gIGRpc2FibGVGb3JTZWxlY3RvcjogJy5zb3VyY2UucHl0aG9uIC5jb21tZW50LCAuc291cmNlLnB5dGhvbiAuc3RyaW5nJ1xuICBpbmNsdXNpb25Qcmlvcml0eTogMlxuICBzdWdnZXN0aW9uUHJpb3JpdHk6IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpLnN1Z2dlc3Rpb25Qcmlvcml0eScpXG4gIGV4Y2x1ZGVMb3dlclByaW9yaXR5OiBmYWxzZVxuICBjYWNoZVNpemU6IDEwXG5cbiAgX2FkZEV2ZW50TGlzdGVuZXI6IChlZGl0b3IsIGV2ZW50TmFtZSwgaGFuZGxlcikgLT5cbiAgICBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3IGVkaXRvclxuICAgIGVkaXRvclZpZXcuYWRkRXZlbnRMaXN0ZW5lciBldmVudE5hbWUsIGhhbmRsZXJcbiAgICBkaXNwb3NhYmxlID0gbmV3IEBEaXNwb3NhYmxlIC0+XG4gICAgICBsb2cuZGVidWcgJ1Vuc3Vic2NyaWJpbmcgZnJvbSBldmVudCBsaXN0ZW5lciAnLCBldmVudE5hbWUsIGhhbmRsZXJcbiAgICAgIGVkaXRvclZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lciBldmVudE5hbWUsIGhhbmRsZXJcbiAgICByZXR1cm4gZGlzcG9zYWJsZVxuXG4gIF9ub0V4ZWN1dGFibGVFcnJvcjogKGVycm9yKSAtPlxuICAgIGlmIEBwcm92aWRlck5vRXhlY3V0YWJsZVxuICAgICAgcmV0dXJuXG4gICAgbG9nLndhcm5pbmcgJ05vIHB5dGhvbiBleGVjdXRhYmxlIGZvdW5kJywgZXJyb3JcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uLWplZGkgdW5hYmxlIHRvIGZpbmQgcHl0aG9uIGJpbmFyeS4nLCB7XG4gICAgICBkZXRhaWw6IFwiXCJcIlBsZWFzZSBzZXQgcGF0aCB0byBweXRob24gZXhlY3V0YWJsZSBtYW51YWxseSBpbiBwYWNrYWdlXG4gICAgICBzZXR0aW5ncyBhbmQgcmVzdGFydCB5b3VyIGVkaXRvci4gQmUgc3VyZSB0byBtaWdyYXRlIG9uIG5ldyBzZXR0aW5nc1xuICAgICAgaWYgZXZlcnl0aGluZyB3b3JrZWQgb24gcHJldmlvdXMgdmVyc2lvbi5cbiAgICAgIERldGFpbGVkIGVycm9yIG1lc3NhZ2U6ICN7ZXJyb3J9XG5cbiAgICAgIEN1cnJlbnQgY29uZmlnOiAje2F0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpLnB5dGhvblBhdGhzJyl9XCJcIlwiXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gICAgQHByb3ZpZGVyTm9FeGVjdXRhYmxlID0gdHJ1ZVxuXG4gIF9zcGF3bkRhZW1vbjogLT5cbiAgICBpbnRlcnByZXRlciA9IEBJbnRlcnByZXRlckxvb2t1cC5nZXRJbnRlcnByZXRlcigpXG4gICAgbG9nLmRlYnVnICdVc2luZyBpbnRlcnByZXRlcicsIGludGVycHJldGVyXG4gICAgQHByb3ZpZGVyID0gbmV3IEBCdWZmZXJlZFByb2Nlc3NcbiAgICAgIGNvbW1hbmQ6IGludGVycHJldGVyIG9yICdweXRob24nXG4gICAgICBhcmdzOiBbX19kaXJuYW1lICsgJy9jb21wbGV0aW9uLnB5J11cbiAgICAgIHN0ZG91dDogKGRhdGEpID0+XG4gICAgICAgIEBfZGVzZXJpYWxpemUoZGF0YSlcbiAgICAgIHN0ZGVycjogKGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGEuaW5kZXhPZignaXMgbm90IHJlY29nbml6ZWQgYXMgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwnKSA+IC0xXG4gICAgICAgICAgcmV0dXJuIEBfbm9FeGVjdXRhYmxlRXJyb3IoZGF0YSlcbiAgICAgICAgbG9nLmRlYnVnIFwiYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpIHRyYWNlYmFjayBvdXRwdXQ6ICN7ZGF0YX1cIlxuICAgICAgICBpZiBkYXRhLmluZGV4T2YoJ2plZGknKSA+IC0xXG4gICAgICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLWplZGkub3V0cHV0UHJvdmlkZXJFcnJvcnMnKVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgICAgICAgICcnJ0xvb2tzIGxpa2UgdGhpcyBlcnJvciBvcmlnaW5hdGVkIGZyb20gSmVkaS4gUGxlYXNlIHJlcG9ydCB0aGlzIFxuICAgICAgICAgICAgICBpc3N1ZSB0byBhdXRvY29tcGxldGUtcHl0aG9uLWplZGkgc28gd2UgY2FuIGhlbHAgaW1wcm92ZSBKZWRpLiBcbiAgICAgICAgICAgICAgVHVybiBvZmYgdGhlIGBvdXRwdXRQcm92aWRlckVycm9yc2Agc2V0dGluZyB0byBoaWRlIHN1Y2ggZXJyb3JzIFxuICAgICAgICAgICAgICBpbiBmdXR1cmUuIFRyYWNlYmFjayBvdXRwdXQ6JycnLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogXCIje2RhdGF9XCIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uLWplZGkgdHJhY2ViYWNrIG91dHB1dDonLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogXCIje2RhdGF9XCIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlfSlcblxuICAgICAgICBsb2cuZGVidWcgXCJGb3JjaW5nIHRvIHJlc29sdmUgI3tPYmplY3Qua2V5cyhAcmVxdWVzdHMpLmxlbmd0aH0gcHJvbWlzZXNcIlxuICAgICAgICBmb3IgcmVxdWVzdElkLCByZXNvbHZlIG9mIEByZXF1ZXN0c1xuICAgICAgICAgIGlmIHR5cGVvZiByZXNvbHZlID09ICdmdW5jdGlvbidcbiAgICAgICAgICAgIHJlc29sdmUoW10pXG4gICAgICAgICAgZGVsZXRlIEByZXF1ZXN0c1tyZXF1ZXN0SWRdXG5cbiAgICAgIGV4aXQ6IChjb2RlKSA9PlxuICAgICAgICBsb2cud2FybmluZyAnUHJvY2VzcyBleGl0IHdpdGgnLCBjb2RlLCBAcHJvdmlkZXJcbiAgICBAcHJvdmlkZXIub25XaWxsVGhyb3dFcnJvciAoe2Vycm9yLCBoYW5kbGV9KSA9PlxuICAgICAgaWYgZXJyb3IuY29kZSBpcyAnRU5PRU5UJyBhbmQgZXJyb3Iuc3lzY2FsbC5pbmRleE9mKCdzcGF3bicpIGlzIDBcbiAgICAgICAgQF9ub0V4ZWN1dGFibGVFcnJvcihlcnJvcilcbiAgICAgICAgQGRpc3Bvc2UoKVxuICAgICAgICBoYW5kbGUoKVxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBlcnJvclxuXG4gICAgQHByb3ZpZGVyLnByb2Nlc3M/LnN0ZGluLm9uICdlcnJvcicsIChlcnIpIC0+XG4gICAgICBsb2cuZGVidWcgJ3N0ZGluJywgZXJyXG5cbiAgICBzZXRUaW1lb3V0ID0+XG4gICAgICBsb2cuZGVidWcgJ0tpbGxpbmcgcHl0aG9uIHByb2Nlc3MgYWZ0ZXIgdGltZW91dC4uLidcbiAgICAgIGlmIEBwcm92aWRlciBhbmQgQHByb3ZpZGVyLnByb2Nlc3NcbiAgICAgICAgQHByb3ZpZGVyLmtpbGwoKVxuICAgICwgNjAgKiAxMCAqIDEwMDBcblxuICBsb2FkOiAtPlxuICAgIGlmIG5vdCBAY29uc3RydWN0ZWRcbiAgICAgIEBjb25zdHJ1Y3RvcigpXG4gICAgcmV0dXJuIHRoaXNcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICB7QERpc3Bvc2FibGUsIEBDb21wb3NpdGVEaXNwb3NhYmxlLCBAQnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUgJ2F0b20nXG4gICAge0BzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW59ID0gcmVxdWlyZSAnLi9zY29wZS1oZWxwZXJzJ1xuICAgIHtAU2VsZWN0b3J9ID0gcmVxdWlyZSAnc2VsZWN0b3Ita2l0J1xuICAgIEBEZWZpbml0aW9uc1ZpZXcgPSByZXF1aXJlICcuL2RlZmluaXRpb25zLXZpZXcnXG4gICAgQFVzYWdlc1ZpZXcgPSByZXF1aXJlICcuL3VzYWdlcy12aWV3J1xuICAgIEBPdmVycmlkZVZpZXcgPSByZXF1aXJlICcuL292ZXJyaWRlLXZpZXcnXG4gICAgQFJlbmFtZVZpZXcgPSByZXF1aXJlICcuL3JlbmFtZS12aWV3J1xuICAgIEBJbnRlcnByZXRlckxvb2t1cCA9IHJlcXVpcmUgJy4vaW50ZXJwcmV0ZXJzLWxvb2t1cCdcbiAgICBAXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG4gICAgQGZpbHRlciA9IHJlcXVpcmUoJ2Z1enphbGRyaW4tcGx1cycpLmZpbHRlclxuICAgIHtAX3Nob3dTaWduYXR1cmVPdmVybGF5fSA9IHJlcXVpcmUgJy4vdG9vbHRpcHMnXG5cbiAgICBAcmVxdWVzdHMgPSB7fVxuICAgIEByZXNwb25zZXMgPSB7fVxuICAgIEBwcm92aWRlciA9IG51bGxcbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgQGRlZmluaXRpb25zVmlldyA9IG51bGxcbiAgICBAdXNhZ2VzVmlldyA9IG51bGxcbiAgICBAcmVuYW1lVmlldyA9IG51bGxcbiAgICBAY29uc3RydWN0ZWQgPSB0cnVlXG4gICAgQHNuaXBwZXRzTWFuYWdlciA9IG51bGxcblxuICAgIGxvZy5kZWJ1ZyBcIkluaXQgYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpIHdpdGggcHJpb3JpdHkgI3tAc3VnZ2VzdGlvblByaW9yaXR5fVwiXG5cbiAgICB0cnlcbiAgICAgIEB0cmlnZ2VyQ29tcGxldGlvblJlZ2V4ID0gUmVnRXhwIGF0b20uY29uZmlnLmdldChcbiAgICAgICAgJ2F1dG9jb21wbGV0ZS1weXRob24tamVkaS50cmlnZ2VyQ29tcGxldGlvblJlZ2V4JylcbiAgICBjYXRjaCBlcnJcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICAnJydhdXRvY29tcGxldGUtcHl0aG9uLWplZGkgaW52YWxpZCByZWdleHAgdG8gdHJpZ2dlciBhdXRvY29tcGxldGlvbnMuXG4gICAgICAgIEZhbGxpbmcgYmFjayB0byBkZWZhdWx0IHZhbHVlLicnJywge1xuICAgICAgICBkZXRhaWw6IFwiT3JpZ2luYWwgZXhjZXB0aW9uOiAje2Vycn1cIlxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F1dG9jb21wbGV0ZS1weXRob24tamVkaS50cmlnZ2VyQ29tcGxldGlvblJlZ2V4JyxcbiAgICAgICAgICAgICAgICAgICAgICAnKFtcXC5cXCBdfFthLXpBLVpfXVthLXpBLVowLTlfXSopJylcbiAgICAgIEB0cmlnZ2VyQ29tcGxldGlvblJlZ2V4ID0gLyhbXFwuXFwgXXxbYS16QS1aX11bYS16QS1aMC05X10qKS9cblxuICAgIHNlbGVjdG9yID0gJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1weXRob25dJ1xuICAgIGF0b20uY29tbWFuZHMuYWRkIHNlbGVjdG9yLCAnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpOmdvLXRvLWRlZmluaXRpb24nLCA9PlxuICAgICAgQGdvVG9EZWZpbml0aW9uKClcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBzZWxlY3RvciwgJ2F1dG9jb21wbGV0ZS1weXRob24tamVkaTpjb21wbGV0ZS1hcmd1bWVudHMnLCA9PlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBAX2NvbXBsZXRlQXJndW1lbnRzKGVkaXRvciwgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCksIHRydWUpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBzZWxlY3RvciwgJ2F1dG9jb21wbGV0ZS1weXRob24tamVkaTpzaG93LXVzYWdlcycsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGlmIEB1c2FnZXNWaWV3XG4gICAgICAgIEB1c2FnZXNWaWV3LmRlc3Ryb3koKVxuICAgICAgQHVzYWdlc1ZpZXcgPSBuZXcgQFVzYWdlc1ZpZXcoKVxuICAgICAgQGdldFVzYWdlcyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS50aGVuICh1c2FnZXMpID0+XG4gICAgICAgIEB1c2FnZXNWaWV3LnNldEl0ZW1zKHVzYWdlcylcblxuICAgIGF0b20uY29tbWFuZHMuYWRkIHNlbGVjdG9yLCAnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpOm92ZXJyaWRlLW1ldGhvZCcsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGlmIEBvdmVycmlkZVZpZXdcbiAgICAgICAgQG92ZXJyaWRlVmlldy5kZXN0cm95KClcbiAgICAgIEBvdmVycmlkZVZpZXcgPSBuZXcgQE92ZXJyaWRlVmlldygpXG4gICAgICBAZ2V0TWV0aG9kcyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS50aGVuICh7bWV0aG9kcywgaW5kZW50LCBidWZmZXJQb3NpdGlvbn0pID0+XG4gICAgICAgIEBvdmVycmlkZVZpZXcuaW5kZW50ID0gaW5kZW50XG4gICAgICAgIEBvdmVycmlkZVZpZXcuYnVmZmVyUG9zaXRpb24gPSBidWZmZXJQb3NpdGlvblxuICAgICAgICBAb3ZlcnJpZGVWaWV3LnNldEl0ZW1zKG1ldGhvZHMpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBzZWxlY3RvciwgJ2F1dG9jb21wbGV0ZS1weXRob24tamVkaTpyZW5hbWUnLCA9PlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBidWZmZXJQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgICBAZ2V0VXNhZ2VzKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pLnRoZW4gKHVzYWdlcykgPT5cbiAgICAgICAgaWYgQHJlbmFtZVZpZXdcbiAgICAgICAgICBAcmVuYW1lVmlldy5kZXN0cm95KClcbiAgICAgICAgaWYgdXNhZ2VzLmxlbmd0aCA+IDBcbiAgICAgICAgICBAcmVuYW1lVmlldyA9IG5ldyBAUmVuYW1lVmlldyh1c2FnZXMpXG4gICAgICAgICAgQHJlbmFtZVZpZXcub25JbnB1dCAobmV3TmFtZSkgPT5cbiAgICAgICAgICAgIGZvciBmaWxlTmFtZSwgdXNhZ2VzIG9mIEBfLmdyb3VwQnkodXNhZ2VzLCAnZmlsZU5hbWUnKVxuICAgICAgICAgICAgICBbcHJvamVjdCwgX3JlbGF0aXZlXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlTmFtZSlcbiAgICAgICAgICAgICAgaWYgcHJvamVjdFxuICAgICAgICAgICAgICAgIEBfdXBkYXRlVXNhZ2VzSW5GaWxlKGZpbGVOYW1lLCB1c2FnZXMsIG5ld05hbWUpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcgJ0lnbm9yaW5nIGZpbGUgb3V0c2lkZSBvZiBwcm9qZWN0JywgZmlsZU5hbWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIEB1c2FnZXNWaWV3XG4gICAgICAgICAgICBAdXNhZ2VzVmlldy5kZXN0cm95KClcbiAgICAgICAgICBAdXNhZ2VzVmlldyA9IG5ldyBAVXNhZ2VzVmlldygpXG4gICAgICAgICAgQHVzYWdlc1ZpZXcuc2V0SXRlbXModXNhZ2VzKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAX2hhbmRsZUdyYW1tYXJDaGFuZ2VFdmVudChlZGl0b3IsIGVkaXRvci5nZXRHcmFtbWFyKCkpXG4gICAgICBlZGl0b3Iub25EaWRDaGFuZ2VHcmFtbWFyIChncmFtbWFyKSA9PlxuICAgICAgICBAX2hhbmRsZUdyYW1tYXJDaGFuZ2VFdmVudChlZGl0b3IsIGdyYW1tYXIpXG5cbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXV0b2NvbXBsZXRlLXBsdXMuZW5hYmxlQXV0b0FjdGl2YXRpb24nLCA9PlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgIEBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50KGVkaXRvciwgZWRpdG9yLmdldEdyYW1tYXIoKSlcblxuICBfdXBkYXRlVXNhZ2VzSW5GaWxlOiAoZmlsZU5hbWUsIHVzYWdlcywgbmV3TmFtZSkgLT5cbiAgICBjb2x1bW5PZmZzZXQgPSB7fVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZU5hbWUsIGFjdGl2YXRlSXRlbTogZmFsc2UpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgZm9yIHVzYWdlIGluIHVzYWdlc1xuICAgICAgICB7bmFtZSwgbGluZSwgY29sdW1ufSA9IHVzYWdlXG4gICAgICAgIGNvbHVtbk9mZnNldFtsaW5lXSA/PSAwXG4gICAgICAgIGxvZy5kZWJ1ZyAnUmVwbGFjaW5nJywgdXNhZ2UsICd3aXRoJywgbmV3TmFtZSwgJ2luJywgZWRpdG9yLmlkXG4gICAgICAgIGxvZy5kZWJ1ZyAnT2Zmc2V0IGZvciBsaW5lJywgbGluZSwgJ2lzJywgY29sdW1uT2Zmc2V0W2xpbmVdXG4gICAgICAgIGJ1ZmZlci5zZXRUZXh0SW5SYW5nZShbXG4gICAgICAgICAgW2xpbmUgLSAxLCBjb2x1bW4gKyBjb2x1bW5PZmZzZXRbbGluZV1dLFxuICAgICAgICAgIFtsaW5lIC0gMSwgY29sdW1uICsgbmFtZS5sZW5ndGggKyBjb2x1bW5PZmZzZXRbbGluZV1dLFxuICAgICAgICAgIF0sIG5ld05hbWUpXG4gICAgICAgIGNvbHVtbk9mZnNldFtsaW5lXSArPSBuZXdOYW1lLmxlbmd0aCAtIG5hbWUubGVuZ3RoXG4gICAgICBidWZmZXIuc2F2ZSgpXG5cblxuICBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50OiAoZWRpdG9yLCBncmFtbWFyKSAtPlxuICAgIGV2ZW50TmFtZSA9ICdrZXl1cCdcbiAgICBldmVudElkID0gXCIje2VkaXRvci5pZH0uI3tldmVudE5hbWV9XCJcbiAgICBpZiBncmFtbWFyLnNjb3BlTmFtZSA9PSAnc291cmNlLnB5dGhvbidcblxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLWplZGkuc2hvd1Rvb2x0aXBzJykgaXMgdHJ1ZVxuICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICAgICAgQF9zaG93U2lnbmF0dXJlT3ZlcmxheShldmVudCwgQClcblxuICAgICAgaWYgbm90IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBsdXMuZW5hYmxlQXV0b0FjdGl2YXRpb24nKVxuICAgICAgICBsb2cuZGVidWcgJ0lnbm9yaW5nIGtleXVwIGV2ZW50cyBkdWUgdG8gYXV0b2NvbXBsZXRlLXBsdXMgc2V0dGluZ3MuJ1xuICAgICAgICByZXR1cm5cbiAgICAgIGRpc3Bvc2FibGUgPSBAX2FkZEV2ZW50TGlzdGVuZXIgZWRpdG9yLCBldmVudE5hbWUsIChlKSA9PlxuICAgICAgICBpZiBhdG9tLmtleW1hcHMua2V5c3Ryb2tlRm9yS2V5Ym9hcmRFdmVudChlKSA9PSAnXignXG4gICAgICAgICAgbG9nLmRlYnVnICdUcnlpbmcgdG8gY29tcGxldGUgYXJndW1lbnRzIG9uIGtleXVwIGV2ZW50JywgZVxuICAgICAgICAgIEBfY29tcGxldGVBcmd1bWVudHMoZWRpdG9yLCBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSlcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZVxuICAgICAgQHN1YnNjcmlwdGlvbnNbZXZlbnRJZF0gPSBkaXNwb3NhYmxlXG4gICAgICBsb2cuZGVidWcgJ1N1YnNjcmliZWQgb24gZXZlbnQnLCBldmVudElkXG4gICAgZWxzZVxuICAgICAgaWYgZXZlbnRJZCBvZiBAc3Vic2NyaXB0aW9uc1xuICAgICAgICBAc3Vic2NyaXB0aW9uc1tldmVudElkXS5kaXNwb3NlKClcbiAgICAgICAgbG9nLmRlYnVnICdVbnN1YnNjcmliZWQgZnJvbSBldmVudCcsIGV2ZW50SWRcblxuICBfc2VyaWFsaXplOiAocmVxdWVzdCkgLT5cbiAgICBsb2cuZGVidWcgJ1NlcmlhbGl6aW5nIHJlcXVlc3QgdG8gYmUgc2VudCB0byBKZWRpJywgcmVxdWVzdFxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0KVxuXG4gIF9zZW5kUmVxdWVzdDogKGRhdGEsIHJlc3Bhd25lZCkgLT5cbiAgICBsb2cuZGVidWcgJ1BlbmRpbmcgcmVxdWVzdHM6JywgT2JqZWN0LmtleXMoQHJlcXVlc3RzKS5sZW5ndGgsIEByZXF1ZXN0c1xuICAgIGlmIE9iamVjdC5rZXlzKEByZXF1ZXN0cykubGVuZ3RoID4gMTBcbiAgICAgIGxvZy5kZWJ1ZyAnQ2xlYW5pbmcgdXAgcmVxdWVzdCBxdWV1ZSB0byBhdm9pZCBvdmVyZmxvdywgaWdub3JpbmcgcmVxdWVzdCdcbiAgICAgIEByZXF1ZXN0cyA9IHt9XG4gICAgICBpZiBAcHJvdmlkZXIgYW5kIEBwcm92aWRlci5wcm9jZXNzXG4gICAgICAgIGxvZy5kZWJ1ZyAnS2lsbGluZyBweXRob24gcHJvY2VzcydcbiAgICAgICAgQHByb3ZpZGVyLmtpbGwoKVxuICAgICAgICByZXR1cm5cblxuICAgIGlmIEBwcm92aWRlciBhbmQgQHByb3ZpZGVyLnByb2Nlc3NcbiAgICAgIHByb2Nlc3MgPSBAcHJvdmlkZXIucHJvY2Vzc1xuICAgICAgaWYgcHJvY2Vzcy5leGl0Q29kZSA9PSBudWxsIGFuZCBwcm9jZXNzLnNpZ25hbENvZGUgPT0gbnVsbFxuICAgICAgICBpZiBAcHJvdmlkZXIucHJvY2Vzcy5waWRcbiAgICAgICAgICByZXR1cm4gQHByb3ZpZGVyLnByb2Nlc3Muc3RkaW4ud3JpdGUoZGF0YSArICdcXG4nKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbG9nLmRlYnVnICdBdHRlbXB0IHRvIGNvbW11bmljYXRlIHdpdGggdGVybWluYXRlZCBwcm9jZXNzJywgQHByb3ZpZGVyXG4gICAgICBlbHNlIGlmIHJlc3Bhd25lZFxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgICBbXCJGYWlsZWQgdG8gc3Bhd24gZGFlbW9uIGZvciBhdXRvY29tcGxldGUtcHl0aG9uLWplZGkuXCJcbiAgICAgICAgICAgXCJDb21wbGV0aW9ucyB3aWxsIG5vdCB3b3JrIGFueW1vcmVcIlxuICAgICAgICAgICBcInVubGVzcyB5b3UgcmVzdGFydCB5b3VyIGVkaXRvci5cIl0uam9pbignICcpLCB7XG4gICAgICAgICAgZGV0YWlsOiBbXCJleGl0Q29kZTogI3twcm9jZXNzLmV4aXRDb2RlfVwiXG4gICAgICAgICAgICAgICAgICAgXCJzaWduYWxDb2RlOiAje3Byb2Nlc3Muc2lnbmFsQ29kZX1cIl0uam9pbignXFxuJyksXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWV9KVxuICAgICAgICBAZGlzcG9zZSgpXG4gICAgICBlbHNlXG4gICAgICAgIEBfc3Bhd25EYWVtb24oKVxuICAgICAgICBAX3NlbmRSZXF1ZXN0KGRhdGEsIHJlc3Bhd25lZDogdHJ1ZSlcbiAgICAgICAgbG9nLmRlYnVnICdSZS1zcGF3bmluZyBweXRob24gcHJvY2Vzcy4uLidcbiAgICBlbHNlXG4gICAgICBsb2cuZGVidWcgJ1NwYXduaW5nIHB5dGhvbiBwcm9jZXNzLi4uJ1xuICAgICAgQF9zcGF3bkRhZW1vbigpXG4gICAgICBAX3NlbmRSZXF1ZXN0KGRhdGEpXG5cbiAgX2Rlc2VyaWFsaXplOiAocmVzcG9uc2UpIC0+XG4gICAgbG9nLmRlYnVnICdEZXNlcmVhbGl6aW5nIHJlc3BvbnNlIGZyb20gSmVkaScsIHJlc3BvbnNlXG4gICAgbG9nLmRlYnVnIFwiR290ICN7cmVzcG9uc2UudHJpbSgpLnNwbGl0KCdcXG4nKS5sZW5ndGh9IGxpbmVzXCJcbiAgICBmb3IgcmVzcG9uc2VTb3VyY2UgaW4gcmVzcG9uc2UudHJpbSgpLnNwbGl0KCdcXG4nKVxuICAgICAgdHJ5XG4gICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZVNvdXJjZSlcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCJcIkZhaWxlZCB0byBwYXJzZSBKU09OIGZyb20gXFxcIiN7cmVzcG9uc2VTb3VyY2V9XFxcIi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yaWdpbmFsIGV4Y2VwdGlvbjogI3tlfVwiXCJcIilcblxuICAgICAgaWYgcmVzcG9uc2VbJ2FyZ3VtZW50cyddXG4gICAgICAgIGVkaXRvciA9IEByZXF1ZXN0c1tyZXNwb25zZVsnaWQnXV1cbiAgICAgICAgaWYgdHlwZW9mIGVkaXRvciA9PSAnb2JqZWN0J1xuICAgICAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgICAjIENvbXBhcmUgcmVzcG9uc2UgSUQgd2l0aCBjdXJyZW50IHN0YXRlIHRvIGF2b2lkIHN0YWxlIGNvbXBsZXRpb25zXG4gICAgICAgICAgaWYgcmVzcG9uc2VbJ2lkJ10gPT0gQF9nZW5lcmF0ZVJlcXVlc3RJZCgnYXJndW1lbnRzJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgICAgICAgIEBzbmlwcGV0c01hbmFnZXI/Lmluc2VydFNuaXBwZXQocmVzcG9uc2VbJ2FyZ3VtZW50cyddLCBlZGl0b3IpXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUgPSBAcmVxdWVzdHNbcmVzcG9uc2VbJ2lkJ11dXG4gICAgICAgIGlmIHR5cGVvZiByZXNvbHZlID09ICdmdW5jdGlvbidcbiAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlWydyZXN1bHRzJ10pXG4gICAgICBjYWNoZVNpemVEZWx0YSA9IE9iamVjdC5rZXlzKEByZXNwb25zZXMpLmxlbmd0aCA+IEBjYWNoZVNpemVcbiAgICAgIGlmIGNhY2hlU2l6ZURlbHRhID4gMFxuICAgICAgICBpZHMgPSBPYmplY3Qua2V5cyhAcmVzcG9uc2VzKS5zb3J0IChhLCBiKSA9PlxuICAgICAgICAgIHJldHVybiBAcmVzcG9uc2VzW2FdWyd0aW1lc3RhbXAnXSAtIEByZXNwb25zZXNbYl1bJ3RpbWVzdGFtcCddXG4gICAgICAgIGZvciBpZCBpbiBpZHMuc2xpY2UoMCwgY2FjaGVTaXplRGVsdGEpXG4gICAgICAgICAgbG9nLmRlYnVnICdSZW1vdmluZyBvbGQgaXRlbSBmcm9tIGNhY2hlIHdpdGggSUQnLCBpZFxuICAgICAgICAgIGRlbGV0ZSBAcmVzcG9uc2VzW2lkXVxuICAgICAgQHJlc3BvbnNlc1tyZXNwb25zZVsnaWQnXV0gPVxuICAgICAgICBzb3VyY2U6IHJlc3BvbnNlU291cmNlXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICAgICAgbG9nLmRlYnVnICdDYWNoZWQgcmVxdWVzdCB3aXRoIElEJywgcmVzcG9uc2VbJ2lkJ11cbiAgICAgIGRlbGV0ZSBAcmVxdWVzdHNbcmVzcG9uc2VbJ2lkJ11dXG5cbiAgX2dlbmVyYXRlUmVxdWVzdElkOiAodHlwZSwgZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgdGV4dCkgLT5cbiAgICBpZiBub3QgdGV4dFxuICAgICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICByZXR1cm4gcmVxdWlyZSgnY3J5cHRvJykuY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKFtcbiAgICAgIGVkaXRvci5nZXRQYXRoKCksIHRleHQsIGJ1ZmZlclBvc2l0aW9uLnJvdyxcbiAgICAgIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiwgdHlwZV0uam9pbigpKS5kaWdlc3QoJ2hleCcpXG5cbiAgX2dlbmVyYXRlUmVxdWVzdENvbmZpZzogLT5cbiAgICBleHRyYVBhdGhzID0gQEludGVycHJldGVyTG9va3VwLmFwcGx5U3Vic3RpdHV0aW9ucyhcbiAgICAgIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpLmV4dHJhUGF0aHMnKS5zcGxpdCgnOycpKVxuICAgIGFyZ3MgPVxuICAgICAgJ2V4dHJhUGF0aHMnOiBleHRyYVBhdGhzXG4gICAgICAndXNlU25pcHBldHMnOiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24tamVkaS51c2VTbmlwcGV0cycpXG4gICAgICAnY2FzZUluc2Vuc2l0aXZlQ29tcGxldGlvbic6IGF0b20uY29uZmlnLmdldChcbiAgICAgICAgJ2F1dG9jb21wbGV0ZS1weXRob24tamVkaS5jYXNlSW5zZW5zaXRpdmVDb21wbGV0aW9uJylcbiAgICAgICdzaG93RGVzY3JpcHRpb25zJzogYXRvbS5jb25maWcuZ2V0KFxuICAgICAgICAnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpLnNob3dEZXNjcmlwdGlvbnMnKVxuICAgICAgJ2Z1enp5TWF0Y2hlcic6IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpLmZ1enp5TWF0Y2hlcicpXG4gICAgcmV0dXJuIGFyZ3NcblxuICBzZXRTbmlwcGV0c01hbmFnZXI6IChAc25pcHBldHNNYW5hZ2VyKSAtPlxuXG4gIF9jb21wbGV0ZUFyZ3VtZW50czogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIGZvcmNlKSAtPlxuICAgIHVzZVNuaXBwZXRzID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLWplZGkudXNlU25pcHBldHMnKVxuICAgIGlmIG5vdCBmb3JjZSBhbmQgdXNlU25pcHBldHMgPT0gJ25vbmUnXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3InKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F1dG9jb21wbGV0ZS1wbHVzOmFjdGl2YXRlJylcbiAgICAgIHJldHVyblxuICAgIHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcbiAgICBzY29wZUNoYWluID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3BlQ2hhaW4oKVxuICAgIGRpc2FibGVGb3JTZWxlY3RvciA9IEBTZWxlY3Rvci5jcmVhdGUoQGRpc2FibGVGb3JTZWxlY3RvcilcbiAgICBpZiBAc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWluKGRpc2FibGVGb3JTZWxlY3Rvciwgc2NvcGVDaGFpbilcbiAgICAgIGxvZy5kZWJ1ZyAnSWdub3JpbmcgYXJndW1lbnQgY29tcGxldGlvbiBpbnNpZGUgb2YnLCBzY29wZUNoYWluXG4gICAgICByZXR1cm5cblxuICAgICMgd2UgZG9uJ3Qgd2FudCB0byBjb21wbGV0ZSBhcmd1bWVudHMgaW5zaWRlIG9mIGV4aXN0aW5nIGNvZGVcbiAgICBsaW5lcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRMaW5lcygpXG4gICAgbGluZSA9IGxpbmVzW2J1ZmZlclBvc2l0aW9uLnJvd11cbiAgICBwcmVmaXggPSBsaW5lLnNsaWNlKGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiAtIDEsIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbilcbiAgICBpZiBwcmVmaXggaXNudCAnKCdcbiAgICAgIGxvZy5kZWJ1ZyAnSWdub3JpbmcgYXJndW1lbnQgY29tcGxldGlvbiB3aXRoIHByZWZpeCcsIHByZWZpeFxuICAgICAgcmV0dXJuXG4gICAgc3VmZml4ID0gbGluZS5zbGljZSBidWZmZXJQb3NpdGlvbi5jb2x1bW4sIGxpbmUubGVuZ3RoXG4gICAgaWYgbm90IC9eKFxcKSg/OiR8XFxzKXxcXHN8JCkvLnRlc3Qoc3VmZml4KVxuICAgICAgbG9nLmRlYnVnICdJZ25vcmluZyBhcmd1bWVudCBjb21wbGV0aW9uIHdpdGggc3VmZml4Jywgc3VmZml4XG4gICAgICByZXR1cm5cblxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ2FyZ3VtZW50cycsIGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICBsb29rdXA6ICdhcmd1bWVudHMnXG4gICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBzb3VyY2U6IGVkaXRvci5nZXRUZXh0KClcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgIGNvbmZpZzogQF9nZW5lcmF0ZVJlcXVlc3RDb25maWcoKVxuXG4gICAgQF9zZW5kUmVxdWVzdChAX3NlcmlhbGl6ZShwYXlsb2FkKSlcbiAgICByZXR1cm4gbmV3IFByb21pc2UgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IGVkaXRvclxuXG4gIF9mdXp6eUZpbHRlcjogKGNhbmRpZGF0ZXMsIHF1ZXJ5KSAtPlxuICAgIGlmIGNhbmRpZGF0ZXMubGVuZ3RoIGlzbnQgMCBhbmQgcXVlcnkgbm90IGluIFsnICcsICcuJywgJygnXVxuICAgICAgY2FuZGlkYXRlcyA9IEBmaWx0ZXIoY2FuZGlkYXRlcywgcXVlcnksIGtleTogJ3RleHQnKVxuICAgIHJldHVybiBjYW5kaWRhdGVzXG5cbiAgZ2V0U3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXh9KSAtPlxuICAgIEBsb2FkKClcbiAgICBpZiBub3QgQHRyaWdnZXJDb21wbGV0aW9uUmVnZXgudGVzdChwcmVmaXgpXG4gICAgICByZXR1cm4gQGxhc3RTdWdnZXN0aW9ucyA9IFtdXG4gICAgYnVmZmVyUG9zaXRpb24gPVxuICAgICAgcm93OiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgbGluZXMgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TGluZXMoKVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpLmZ1enp5TWF0Y2hlcicpXG4gICAgICAjIHdlIHdhbnQgdG8gZG8gb3VyIG93biBmaWx0ZXJpbmcsIGhpZGUgYW55IGV4aXN0aW5nIHN1ZmZpeCBmcm9tIEplZGlcbiAgICAgIGxpbmUgPSBsaW5lc1tidWZmZXJQb3NpdGlvbi5yb3ddXG4gICAgICBsYXN0SWRlbnRpZmllciA9IC9cXC4/W2EtekEtWl9dW2EtekEtWjAtOV9dKiQvLmV4ZWMoXG4gICAgICAgIGxpbmUuc2xpY2UgMCwgYnVmZmVyUG9zaXRpb24uY29sdW1uKVxuICAgICAgaWYgbGFzdElkZW50aWZpZXJcbiAgICAgICAgYnVmZmVyUG9zaXRpb24uY29sdW1uID0gbGFzdElkZW50aWZpZXIuaW5kZXggKyAxXG4gICAgICAgIGxpbmVzW2J1ZmZlclBvc2l0aW9uLnJvd10gPSBsaW5lLnNsaWNlKDAsIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbilcbiAgICByZXF1ZXN0SWQgPSBAX2dlbmVyYXRlUmVxdWVzdElkKFxuICAgICAgJ2NvbXBsZXRpb25zJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgbGluZXMuam9pbignXFxuJykpXG4gICAgaWYgcmVxdWVzdElkIG9mIEByZXNwb25zZXNcbiAgICAgIGxvZy5kZWJ1ZyAnVXNpbmcgY2FjaGVkIHJlc3BvbnNlIHdpdGggSUQnLCByZXF1ZXN0SWRcbiAgICAgICMgV2UgaGF2ZSB0byBwYXJzZSBKU09OIG9uIGVhY2ggcmVxdWVzdCBoZXJlIHRvIHBhc3Mgb25seSBhIGNvcHlcbiAgICAgIG1hdGNoZXMgPSBKU09OLnBhcnNlKEByZXNwb25zZXNbcmVxdWVzdElkXVsnc291cmNlJ10pWydyZXN1bHRzJ11cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi1qZWRpLmZ1enp5TWF0Y2hlcicpXG4gICAgICAgIHJldHVybiBAbGFzdFN1Z2dlc3Rpb25zID0gQF9mdXp6eUZpbHRlcihtYXRjaGVzLCBwcmVmaXgpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBAbGFzdFN1Z2dlc3Rpb25zID0gbWF0Y2hlc1xuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IHJlcXVlc3RJZFxuICAgICAgcHJlZml4OiBwcmVmaXhcbiAgICAgIGxvb2t1cDogJ2NvbXBsZXRpb25zJ1xuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcblxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLWplZGkuZnV6enlNYXRjaGVyJylcbiAgICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gKG1hdGNoZXMpID0+XG4gICAgICAgICAgcmVzb2x2ZShAbGFzdFN1Z2dlc3Rpb25zID0gQF9mdXp6eUZpbHRlcihtYXRjaGVzLCBwcmVmaXgpKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVxdWVzdHNbcGF5bG9hZC5pZF0gPSAoc3VnZ2VzdGlvbnMpID0+XG4gICAgICAgICAgcmVzb2x2ZShAbGFzdFN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnMpXG5cbiAgZ2V0RGVmaW5pdGlvbnM6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ2RlZmluaXRpb25zJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGxvb2t1cDogJ2RlZmluaXRpb25zJ1xuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcblxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gcmVzb2x2ZVxuXG4gIGdldFVzYWdlczogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgcGF5bG9hZCA9XG4gICAgICBpZDogQF9nZW5lcmF0ZVJlcXVlc3RJZCgndXNhZ2VzJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGxvb2t1cDogJ3VzYWdlcydcbiAgICAgIHBhdGg6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHNvdXJjZTogZWRpdG9yLmdldFRleHQoKVxuICAgICAgbGluZTogYnVmZmVyUG9zaXRpb24ucm93XG4gICAgICBjb2x1bW46IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG5cbiAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IHJlc29sdmVcblxuICBnZXRNZXRob2RzOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICBpbmRlbnQgPSBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICBsaW5lcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRMaW5lcygpXG4gICAgbGluZXMuc3BsaWNlKGJ1ZmZlclBvc2l0aW9uLnJvdyArIDEsIDAsIFwiICBkZWYgX19hdXRvY29tcGxldGVfcHl0aG9uKHMpOlwiKVxuICAgIGxpbmVzLnNwbGljZShidWZmZXJQb3NpdGlvbi5yb3cgKyAyLCAwLCBcIiAgICBzLlwiKVxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ21ldGhvZHMnLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgbG9va3VwOiAnbWV0aG9kcydcbiAgICAgIHBhdGg6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHNvdXJjZTogbGluZXMuam9pbignXFxuJylcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvdyArIDJcbiAgICAgIGNvbHVtbjogNlxuICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG5cbiAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IChtZXRob2RzKSAtPlxuICAgICAgICByZXNvbHZlKHttZXRob2RzLCBpbmRlbnQsIGJ1ZmZlclBvc2l0aW9ufSlcblxuICBnb1RvRGVmaW5pdGlvbjogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgaWYgbm90IGVkaXRvclxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgbm90IGJ1ZmZlclBvc2l0aW9uXG4gICAgICBidWZmZXJQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgaWYgQGRlZmluaXRpb25zVmlld1xuICAgICAgQGRlZmluaXRpb25zVmlldy5kZXN0cm95KClcbiAgICBAZGVmaW5pdGlvbnNWaWV3ID0gbmV3IEBEZWZpbml0aW9uc1ZpZXcoKVxuICAgIEBnZXREZWZpbml0aW9ucyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS50aGVuIChyZXN1bHRzKSA9PlxuICAgICAgQGRlZmluaXRpb25zVmlldy5zZXRJdGVtcyhyZXN1bHRzKVxuICAgICAgaWYgcmVzdWx0cy5sZW5ndGggPT0gMVxuICAgICAgICBAZGVmaW5pdGlvbnNWaWV3LmNvbmZpcm1lZChyZXN1bHRzWzBdKVxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgaWYgQGRpc3Bvc2FibGVzXG4gICAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgaWYgQHByb3ZpZGVyXG4gICAgICBAcHJvdmlkZXIua2lsbCgpXG4iXX0=
