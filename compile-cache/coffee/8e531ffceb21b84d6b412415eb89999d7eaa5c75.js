(function() {
  var CompositeDisposable, Emitter, Logger, Metrics, os, path, ref, ref1,
    slice = [].slice;

  os = require('os');

  path = require('path');

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  ref1 = [], Metrics = ref1[0], Logger = ref1[1];

  window.DEBUG = false;

  module.exports = {
    config: {
      useKite: {
        type: 'boolean',
        "default": true,
        order: 0,
        title: 'Use Kite-powered Completions',
        description: 'Kite is a machine learning powered autocomplete engine.\nChoosing this option will allow you to get more intelligently ranked\ncompletions and other advanced features in addition to the completions\nprovided by Jedi.'
      },
      showDescriptions: {
        type: 'boolean',
        "default": true,
        order: 1,
        title: 'Show Descriptions',
        description: 'Show doc strings from functions, classes, etc.'
      },
      useSnippets: {
        type: 'string',
        "default": 'none',
        order: 2,
        "enum": ['none', 'all', 'required'],
        title: 'Autocomplete Function Parameters',
        description: 'Automatically complete function arguments after typing\nleft parenthesis character. Use completion key to jump between\narguments. See `autocomplete-python:complete-arguments` command if you\nwant to trigger argument completions manually. See README if it does not\nwork for you.'
      },
      pythonPaths: {
        type: 'string',
        "default": '',
        order: 3,
        title: 'Python Executable Paths',
        description: 'Optional semicolon separated list of paths to python\nexecutables (including executable names), where the first one will take\nhigher priority over the last one. By default autocomplete-python will\nautomatically look for virtual environments inside of your project and\ntry to use them as well as try to find global python executable. If you\nuse this config, automatic lookup will have lowest priority.\nUse `$PROJECT` or `$PROJECT_NAME` substitution for project-specific\npaths to point on executables in virtual environments.\nFor example:\n`/Users/name/.virtualenvs/$PROJECT_NAME/bin/python;$PROJECT/venv/bin/python3;/usr/bin/python`.\nSuch config will fall back on `/usr/bin/python` for projects not presented\nwith same name in `.virtualenvs` and without `venv` folder inside of one\nof project folders.\nIf you are using python3 executable while coding for python2 you will get\npython2 completions for some built-ins.'
      },
      extraPaths: {
        type: 'string',
        "default": '',
        order: 4,
        title: 'Extra Paths For Packages',
        description: 'Semicolon separated list of modules to additionally\ninclude for autocomplete. You can use same substitutions as in\n`Python Executable Paths`.\nNote that it still should be valid python package.\nFor example:\n`$PROJECT/env/lib/python2.7/site-packages`\nor\n`/User/name/.virtualenvs/$PROJECT_NAME/lib/python2.7/site-packages`.\nYou don\'t need to specify extra paths for libraries installed with python\nexecutable you use.'
      },
      caseInsensitiveCompletion: {
        type: 'boolean',
        "default": true,
        order: 5,
        title: 'Case Insensitive Completion',
        description: 'The completion is by default case insensitive.'
      },
      triggerCompletionRegex: {
        type: 'string',
        "default": '([\.\ (]|[a-zA-Z_][a-zA-Z0-9_]*)',
        order: 6,
        title: 'Regex To Trigger Autocompletions',
        description: 'By default completions triggered after words, dots, spaces\nand left parenthesis. You will need to restart your editor after changing\nthis.'
      },
      fuzzyMatcher: {
        type: 'boolean',
        "default": true,
        order: 7,
        title: 'Use Fuzzy Matcher For Completions.',
        description: 'Typing `stdr` will match `stderr`.\nFirst character should always match. Uses additional caching thus\ncompletions should be faster. Note that this setting does not affect\nbuilt-in autocomplete-plus provider.'
      },
      outputProviderErrors: {
        type: 'boolean',
        "default": false,
        order: 8,
        title: 'Output Provider Errors',
        description: 'Select if you would like to see the provider errors when\nthey happen. By default they are hidden. Note that critical errors are\nalways shown.'
      },
      outputDebug: {
        type: 'boolean',
        "default": false,
        order: 9,
        title: 'Output Debug Logs',
        description: 'Select if you would like to see debug information in\ndeveloper tools logs. May slow down your editor.'
      },
      showTooltips: {
        type: 'boolean',
        "default": false,
        order: 10,
        title: 'Show Tooltips with information about the object under the cursor',
        description: 'EXPERIMENTAL FEATURE WHICH IS NOT FINISHED YET.\nFeedback and ideas are welcome on github.'
      },
      suggestionPriority: {
        type: 'integer',
        "default": 3,
        minimum: 0,
        maximum: 99,
        order: 11,
        title: 'Suggestion Priority',
        description: 'You can use this to set the priority for autocomplete-python\nsuggestions. For example, you can use lower value to give higher priority\nfor snippets completions which has priority of 2.'
      },
      enableTouchBar: {
        type: 'boolean',
        "default": false,
        order: 12,
        title: 'Enable Touch Bar support',
        description: 'Proof of concept for now, requires tooltips to be enabled and Atom >=1.19.0.'
      }
    },
    installation: null,
    _handleGrammarChangeEvent: function(grammar) {
      var ref2;
      if ((ref2 = grammar.packageName) === 'language-python' || ref2 === 'MagicPython' || ref2 === 'atom-django') {
        this.provider.load();
        this.emitter.emit('did-load-provider');
        return this.disposables.dispose();
      }
    },
    _loadKite: function() {
      var AccountManager, AtomHelper, NodeClient, StateController, checkKiteInstallation, editorCfg, event, firstInstall, install, longRunning, pluginCfg, ref2;
      firstInstall = localStorage.getItem('autocomplete-python.installed') === null;
      localStorage.setItem('autocomplete-python.installed', true);
      longRunning = require('process').uptime() > 10;
      if (firstInstall && longRunning) {
        event = "installed";
      } else if (firstInstall) {
        event = "upgraded";
      } else {
        event = "restarted";
      }
      ref2 = require('kite-installer'), AccountManager = ref2.AccountManager, AtomHelper = ref2.AtomHelper, Metrics = ref2.Metrics, Logger = ref2.Logger, StateController = ref2.StateController, NodeClient = ref2.NodeClient, install = ref2.install;
      if (atom.config.get('kite.loggingLevel')) {
        Logger.LEVEL = Logger.LEVELS[atom.config.get('kite.loggingLevel').toUpperCase()];
      }
      editorCfg = {
        UUID: localStorage.getItem('metrics.userId'),
        name: 'atom'
      };
      pluginCfg = {
        name: 'autocomplete-python'
      };
      Metrics.Tracker.source = 'autocomplete-python';
      Metrics.enabled = atom.config.get('core.telemetryConsent') === 'limited';
      atom.packages.onDidActivatePackage((function(_this) {
        return function(pkg) {
          if (pkg.name === 'kite') {
            return _this.patchKiteCompletions(pkg);
          }
        };
      })(this));
      checkKiteInstallation = (function(_this) {
        return function() {
          var statusBar;
          if (!atom.config.get('autocomplete-python.useKite')) {
            return;
          }
          statusBar = _this.statusBar;
          if (atom.config.get('autocomplete-python.useKite')) {
            return StateController.canInstallKite().then(function() {
              var Install, initialClient, installed, installer, kiteAtom;
              kiteAtom = install.atom();
              Install = install.Install;
              installer = new Install(kiteAtom.autocompletePythonFlow(), {
                path: atom.project.getPaths()[0] || os.homedir()
              }, {
                statusBar: statusBar,
                failureStep: 'termination',
                title: 'Upgrade your autocomplete-python engine'
              });
              initialClient = AccountManager.client;
              AccountManager.client = new NodeClient('alpha.kite.com', -1, '', true);
              atom.workspace.getActivePane().addItem(installer);
              atom.workspace.getActivePane().activateItem(installer);
              installed = false;
              installer.onDidDestroy(function() {
                installed && atom.config.set('autocomplete-python.useKite', installed);
                return AccountManager.client = initialClient;
              });
              installer.onDidUdpdateState(function(state) {
                if (typeof state.install !== 'undefined') {
                  return installed = state.install.done || false;
                }
              });
              installer.on('did-skip-install', function() {
                installed = false;
                return atom.config.set('autocomplete-python.useKite', installed);
              });
              installer.on('not-admin-shown', function() {
                return installed = true;
              });
              installer.on('not-admin-dismissed', function() {
                installed = false;
                return atom.config.set('autocomplete-python.useKite', installed);
              });
              installer.on('headless-error', function(arg) {
                var error, errorView;
                error = arg.error;
                installer.updateState({
                  error: error
                });
                errorView = new kiteAtom.InstallErrorView(installer);
                atom.workspace.getActivePane().addItem(errorView);
                return atom.workspace.getActivePane().activateItem(errorView);
              });
              return installer.start();
            }, function(err) {
              if (typeof err !== 'undefined' && err.type === 'denied') {
                return atom.config.set('autocomplete-python.useKite', false);
              }
            });
          }
        };
      })(this);
      checkKiteInstallation();
      return atom.config.onDidChange('autocomplete-python.useKite', function(arg) {
        var newValue, oldValue;
        newValue = arg.newValue, oldValue = arg.oldValue;
        if (newValue) {
          checkKiteInstallation();
          return AtomHelper.enablePackage();
        } else {
          return AtomHelper.disablePackage();
        }
      });
    },
    load: function() {
      var disposable;
      this.disposables = new CompositeDisposable;
      disposable = atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this._handleGrammarChangeEvent(editor.getGrammar());
          disposable = editor.onDidChangeGrammar(function(grammar) {
            return _this._handleGrammarChangeEvent(grammar);
          });
          return _this.disposables.add(disposable);
        };
      })(this));
      this.disposables.add(disposable);
      return this._loadKite();
    },
    activate: function(state) {
      var disposable;
      this.emitter = new Emitter;
      this.provider = require('./provider');
      if (typeof atom.packages.hasActivatedInitialPackages === 'function' && atom.packages.hasActivatedInitialPackages()) {
        return this.load();
      } else {
        return disposable = atom.packages.onDidActivateInitialPackages((function(_this) {
          return function() {
            _this.load();
            return disposable.dispose();
          };
        })(this));
      }
    },
    deactivate: function() {
      if (this.provider) {
        this.provider.dispose();
      }
      if (this.installation) {
        return this.installation.destroy();
      }
    },
    getProvider: function() {
      return this.provider;
    },
    getHyperclickProvider: function() {
      return require('./hyperclick-provider');
    },
    consumeSnippets: function(snippetsManager) {
      var disposable;
      return disposable = this.emitter.on('did-load-provider', (function(_this) {
        return function() {
          _this.provider.setSnippetsManager(snippetsManager);
          return disposable.dispose();
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.statusBar = statusBar;
    },
    patchKiteCompletions: function(kite) {
      var getSuggestions;
      if (this.kitePackage != null) {
        return;
      }
      this.kitePackage = kite.mainModule;
      this.kiteProvider = this.kitePackage.completions();
      getSuggestions = this.kiteProvider.getSuggestions;
      return this.kiteProvider.getSuggestions = (function(_this) {
        return function() {
          var args, ref2, ref3;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return getSuggestions != null ? (ref2 = getSuggestions.apply(_this.kiteProvider, args)) != null ? (ref3 = ref2.then(function(suggestions) {
            _this.lastKiteSuggestions = suggestions;
            _this.kiteSuggested = suggestions != null;
            return suggestions;
          })) != null ? ref3["catch"](function(err) {
            _this.lastKiteSuggestions = [];
            _this.kiteSuggested = false;
            throw err;
          }) : void 0 : void 0 : void 0;
        };
      })(this);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24vbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrRUFBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFFdEIsT0FBb0IsRUFBcEIsRUFBQyxpQkFBRCxFQUFVOztFQUVWLE1BQU0sQ0FBQyxLQUFQLEdBQWU7O0VBQ2YsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLE9BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsS0FBQSxFQUFPLENBRlA7UUFHQSxLQUFBLEVBQU8sOEJBSFA7UUFJQSxXQUFBLEVBQWEsME5BSmI7T0FERjtNQVNBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLEtBQUEsRUFBTyxDQUZQO1FBR0EsS0FBQSxFQUFPLG1CQUhQO1FBSUEsV0FBQSxFQUFhLGdEQUpiO09BVkY7TUFlQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFEVDtRQUVBLEtBQUEsRUFBTyxDQUZQO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLFVBQWhCLENBSE47UUFJQSxLQUFBLEVBQU8sa0NBSlA7UUFLQSxXQUFBLEVBQWEseVJBTGI7T0FoQkY7TUEwQkEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFT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QUFBO01BQUEsSUFBVSx3QkFBVjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUM7TUFDcEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQUE7TUFDaEIsY0FBQSxHQUFpQixJQUFDLENBQUEsWUFBWSxDQUFDO2FBQy9CLElBQUMsQ0FBQSxZQUFZLENBQUMsY0FBZCxHQUErQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDN0IsY0FBQTtVQUQ4Qjs7Ozs7NEJBTTlCLEVBQUUsS0FBRixFQUxBLENBS1EsU0FBQyxHQUFEO1lBQ04sS0FBQyxDQUFBLG1CQUFELEdBQXVCO1lBQ3ZCLEtBQUMsQ0FBQSxhQUFELEdBQWlCO0FBQ2pCLGtCQUFNO1VBSEEsQ0FMUjtRQUQ2QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7SUFOWCxDQTFSdEI7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJvcyA9IHJlcXVpcmUgJ29zJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57Q29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5bTWV0cmljcywgTG9nZ2VyXSA9IFtdXG5cbndpbmRvdy5ERUJVRyA9IGZhbHNlXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICB1c2VLaXRlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogMFxuICAgICAgdGl0bGU6ICdVc2UgS2l0ZS1wb3dlcmVkIENvbXBsZXRpb25zJ1xuICAgICAgZGVzY3JpcHRpb246ICcnJ0tpdGUgaXMgYSBtYWNoaW5lIGxlYXJuaW5nIHBvd2VyZWQgYXV0b2NvbXBsZXRlIGVuZ2luZS5cbiAgICAgIENob29zaW5nIHRoaXMgb3B0aW9uIHdpbGwgYWxsb3cgeW91IHRvIGdldCBtb3JlIGludGVsbGlnZW50bHkgcmFua2VkXG4gICAgICBjb21wbGV0aW9ucyBhbmQgb3RoZXIgYWR2YW5jZWQgZmVhdHVyZXMgaW4gYWRkaXRpb24gdG8gdGhlIGNvbXBsZXRpb25zXG4gICAgICBwcm92aWRlZCBieSBKZWRpLicnJ1xuICAgIHNob3dEZXNjcmlwdGlvbnM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAxXG4gICAgICB0aXRsZTogJ1Nob3cgRGVzY3JpcHRpb25zJ1xuICAgICAgZGVzY3JpcHRpb246ICdTaG93IGRvYyBzdHJpbmdzIGZyb20gZnVuY3Rpb25zLCBjbGFzc2VzLCBldGMuJ1xuICAgIHVzZVNuaXBwZXRzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdub25lJ1xuICAgICAgb3JkZXI6IDJcbiAgICAgIGVudW06IFsnbm9uZScsICdhbGwnLCAncmVxdWlyZWQnXVxuICAgICAgdGl0bGU6ICdBdXRvY29tcGxldGUgRnVuY3Rpb24gUGFyYW1ldGVycydcbiAgICAgIGRlc2NyaXB0aW9uOiAnJydBdXRvbWF0aWNhbGx5IGNvbXBsZXRlIGZ1bmN0aW9uIGFyZ3VtZW50cyBhZnRlciB0eXBpbmdcbiAgICAgIGxlZnQgcGFyZW50aGVzaXMgY2hhcmFjdGVyLiBVc2UgY29tcGxldGlvbiBrZXkgdG8ganVtcCBiZXR3ZWVuXG4gICAgICBhcmd1bWVudHMuIFNlZSBgYXV0b2NvbXBsZXRlLXB5dGhvbjpjb21wbGV0ZS1hcmd1bWVudHNgIGNvbW1hbmQgaWYgeW91XG4gICAgICB3YW50IHRvIHRyaWdnZXIgYXJndW1lbnQgY29tcGxldGlvbnMgbWFudWFsbHkuIFNlZSBSRUFETUUgaWYgaXQgZG9lcyBub3RcbiAgICAgIHdvcmsgZm9yIHlvdS4nJydcbiAgICBweXRob25QYXRoczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgICAgb3JkZXI6IDNcbiAgICAgIHRpdGxlOiAnUHl0aG9uIEV4ZWN1dGFibGUgUGF0aHMnXG4gICAgICBkZXNjcmlwdGlvbjogJycnT3B0aW9uYWwgc2VtaWNvbG9uIHNlcGFyYXRlZCBsaXN0IG9mIHBhdGhzIHRvIHB5dGhvblxuICAgICAgZXhlY3V0YWJsZXMgKGluY2x1ZGluZyBleGVjdXRhYmxlIG5hbWVzKSwgd2hlcmUgdGhlIGZpcnN0IG9uZSB3aWxsIHRha2VcbiAgICAgIGhpZ2hlciBwcmlvcml0eSBvdmVyIHRoZSBsYXN0IG9uZS4gQnkgZGVmYXVsdCBhdXRvY29tcGxldGUtcHl0aG9uIHdpbGxcbiAgICAgIGF1dG9tYXRpY2FsbHkgbG9vayBmb3IgdmlydHVhbCBlbnZpcm9ubWVudHMgaW5zaWRlIG9mIHlvdXIgcHJvamVjdCBhbmRcbiAgICAgIHRyeSB0byB1c2UgdGhlbSBhcyB3ZWxsIGFzIHRyeSB0byBmaW5kIGdsb2JhbCBweXRob24gZXhlY3V0YWJsZS4gSWYgeW91XG4gICAgICB1c2UgdGhpcyBjb25maWcsIGF1dG9tYXRpYyBsb29rdXAgd2lsbCBoYXZlIGxvd2VzdCBwcmlvcml0eS5cbiAgICAgIFVzZSBgJFBST0pFQ1RgIG9yIGAkUFJPSkVDVF9OQU1FYCBzdWJzdGl0dXRpb24gZm9yIHByb2plY3Qtc3BlY2lmaWNcbiAgICAgIHBhdGhzIHRvIHBvaW50IG9uIGV4ZWN1dGFibGVzIGluIHZpcnR1YWwgZW52aXJvbm1lbnRzLlxuICAgICAgRm9yIGV4YW1wbGU6XG4gICAgICBgL1VzZXJzL25hbWUvLnZpcnR1YWxlbnZzLyRQUk9KRUNUX05BTUUvYmluL3B5dGhvbjskUFJPSkVDVC92ZW52L2Jpbi9weXRob24zOy91c3IvYmluL3B5dGhvbmAuXG4gICAgICBTdWNoIGNvbmZpZyB3aWxsIGZhbGwgYmFjayBvbiBgL3Vzci9iaW4vcHl0aG9uYCBmb3IgcHJvamVjdHMgbm90IHByZXNlbnRlZFxuICAgICAgd2l0aCBzYW1lIG5hbWUgaW4gYC52aXJ0dWFsZW52c2AgYW5kIHdpdGhvdXQgYHZlbnZgIGZvbGRlciBpbnNpZGUgb2Ygb25lXG4gICAgICBvZiBwcm9qZWN0IGZvbGRlcnMuXG4gICAgICBJZiB5b3UgYXJlIHVzaW5nIHB5dGhvbjMgZXhlY3V0YWJsZSB3aGlsZSBjb2RpbmcgZm9yIHB5dGhvbjIgeW91IHdpbGwgZ2V0XG4gICAgICBweXRob24yIGNvbXBsZXRpb25zIGZvciBzb21lIGJ1aWx0LWlucy4nJydcbiAgICBleHRyYVBhdGhzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICBvcmRlcjogNFxuICAgICAgdGl0bGU6ICdFeHRyYSBQYXRocyBGb3IgUGFja2FnZXMnXG4gICAgICBkZXNjcmlwdGlvbjogJycnU2VtaWNvbG9uIHNlcGFyYXRlZCBsaXN0IG9mIG1vZHVsZXMgdG8gYWRkaXRpb25hbGx5XG4gICAgICBpbmNsdWRlIGZvciBhdXRvY29tcGxldGUuIFlvdSBjYW4gdXNlIHNhbWUgc3Vic3RpdHV0aW9ucyBhcyBpblxuICAgICAgYFB5dGhvbiBFeGVjdXRhYmxlIFBhdGhzYC5cbiAgICAgIE5vdGUgdGhhdCBpdCBzdGlsbCBzaG91bGQgYmUgdmFsaWQgcHl0aG9uIHBhY2thZ2UuXG4gICAgICBGb3IgZXhhbXBsZTpcbiAgICAgIGAkUFJPSkVDVC9lbnYvbGliL3B5dGhvbjIuNy9zaXRlLXBhY2thZ2VzYFxuICAgICAgb3JcbiAgICAgIGAvVXNlci9uYW1lLy52aXJ0dWFsZW52cy8kUFJPSkVDVF9OQU1FL2xpYi9weXRob24yLjcvc2l0ZS1wYWNrYWdlc2AuXG4gICAgICBZb3UgZG9uJ3QgbmVlZCB0byBzcGVjaWZ5IGV4dHJhIHBhdGhzIGZvciBsaWJyYXJpZXMgaW5zdGFsbGVkIHdpdGggcHl0aG9uXG4gICAgICBleGVjdXRhYmxlIHlvdSB1c2UuJycnXG4gICAgY2FzZUluc2Vuc2l0aXZlQ29tcGxldGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDVcbiAgICAgIHRpdGxlOiAnQ2FzZSBJbnNlbnNpdGl2ZSBDb21wbGV0aW9uJ1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgY29tcGxldGlvbiBpcyBieSBkZWZhdWx0IGNhc2UgaW5zZW5zaXRpdmUuJ1xuICAgIHRyaWdnZXJDb21wbGV0aW9uUmVnZXg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJyhbXFwuXFwgKF18W2EtekEtWl9dW2EtekEtWjAtOV9dKiknXG4gICAgICBvcmRlcjogNlxuICAgICAgdGl0bGU6ICdSZWdleCBUbyBUcmlnZ2VyIEF1dG9jb21wbGV0aW9ucydcbiAgICAgIGRlc2NyaXB0aW9uOiAnJydCeSBkZWZhdWx0IGNvbXBsZXRpb25zIHRyaWdnZXJlZCBhZnRlciB3b3JkcywgZG90cywgc3BhY2VzXG4gICAgICBhbmQgbGVmdCBwYXJlbnRoZXNpcy4gWW91IHdpbGwgbmVlZCB0byByZXN0YXJ0IHlvdXIgZWRpdG9yIGFmdGVyIGNoYW5naW5nXG4gICAgICB0aGlzLicnJ1xuICAgIGZ1enp5TWF0Y2hlcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDdcbiAgICAgIHRpdGxlOiAnVXNlIEZ1enp5IE1hdGNoZXIgRm9yIENvbXBsZXRpb25zLidcbiAgICAgIGRlc2NyaXB0aW9uOiAnJydUeXBpbmcgYHN0ZHJgIHdpbGwgbWF0Y2ggYHN0ZGVycmAuXG4gICAgICBGaXJzdCBjaGFyYWN0ZXIgc2hvdWxkIGFsd2F5cyBtYXRjaC4gVXNlcyBhZGRpdGlvbmFsIGNhY2hpbmcgdGh1c1xuICAgICAgY29tcGxldGlvbnMgc2hvdWxkIGJlIGZhc3Rlci4gTm90ZSB0aGF0IHRoaXMgc2V0dGluZyBkb2VzIG5vdCBhZmZlY3RcbiAgICAgIGJ1aWx0LWluIGF1dG9jb21wbGV0ZS1wbHVzIHByb3ZpZGVyLicnJ1xuICAgIG91dHB1dFByb3ZpZGVyRXJyb3JzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDhcbiAgICAgIHRpdGxlOiAnT3V0cHV0IFByb3ZpZGVyIEVycm9ycydcbiAgICAgIGRlc2NyaXB0aW9uOiAnJydTZWxlY3QgaWYgeW91IHdvdWxkIGxpa2UgdG8gc2VlIHRoZSBwcm92aWRlciBlcnJvcnMgd2hlblxuICAgICAgdGhleSBoYXBwZW4uIEJ5IGRlZmF1bHQgdGhleSBhcmUgaGlkZGVuLiBOb3RlIHRoYXQgY3JpdGljYWwgZXJyb3JzIGFyZVxuICAgICAgYWx3YXlzIHNob3duLicnJ1xuICAgIG91dHB1dERlYnVnOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDlcbiAgICAgIHRpdGxlOiAnT3V0cHV0IERlYnVnIExvZ3MnXG4gICAgICBkZXNjcmlwdGlvbjogJycnU2VsZWN0IGlmIHlvdSB3b3VsZCBsaWtlIHRvIHNlZSBkZWJ1ZyBpbmZvcm1hdGlvbiBpblxuICAgICAgZGV2ZWxvcGVyIHRvb2xzIGxvZ3MuIE1heSBzbG93IGRvd24geW91ciBlZGl0b3IuJycnXG4gICAgc2hvd1Rvb2x0aXBzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDEwXG4gICAgICB0aXRsZTogJ1Nob3cgVG9vbHRpcHMgd2l0aCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgb2JqZWN0IHVuZGVyIHRoZSBjdXJzb3InXG4gICAgICBkZXNjcmlwdGlvbjogJycnRVhQRVJJTUVOVEFMIEZFQVRVUkUgV0hJQ0ggSVMgTk9UIEZJTklTSEVEIFlFVC5cbiAgICAgIEZlZWRiYWNrIGFuZCBpZGVhcyBhcmUgd2VsY29tZSBvbiBnaXRodWIuJycnXG4gICAgc3VnZ2VzdGlvblByaW9yaXR5OlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAzXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBtYXhpbXVtOiA5OVxuICAgICAgb3JkZXI6IDExXG4gICAgICB0aXRsZTogJ1N1Z2dlc3Rpb24gUHJpb3JpdHknXG4gICAgICBkZXNjcmlwdGlvbjogJycnWW91IGNhbiB1c2UgdGhpcyB0byBzZXQgdGhlIHByaW9yaXR5IGZvciBhdXRvY29tcGxldGUtcHl0aG9uXG4gICAgICBzdWdnZXN0aW9ucy4gRm9yIGV4YW1wbGUsIHlvdSBjYW4gdXNlIGxvd2VyIHZhbHVlIHRvIGdpdmUgaGlnaGVyIHByaW9yaXR5XG4gICAgICBmb3Igc25pcHBldHMgY29tcGxldGlvbnMgd2hpY2ggaGFzIHByaW9yaXR5IG9mIDIuJycnXG4gICAgZW5hYmxlVG91Y2hCYXI6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogMTJcbiAgICAgIHRpdGxlOiAnRW5hYmxlIFRvdWNoIEJhciBzdXBwb3J0J1xuICAgICAgZGVzY3JpcHRpb246ICcnJ1Byb29mIG9mIGNvbmNlcHQgZm9yIG5vdywgcmVxdWlyZXMgdG9vbHRpcHMgdG8gYmUgZW5hYmxlZCBhbmQgQXRvbSA+PTEuMTkuMC4nJydcblxuICBpbnN0YWxsYXRpb246IG51bGxcblxuICBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50OiAoZ3JhbW1hcikgLT5cbiAgICAjIHRoaXMgc2hvdWxkIGJlIHNhbWUgd2l0aCBhY3RpdmF0aW9uSG9va3MgbmFtZXNcbiAgICBpZiBncmFtbWFyLnBhY2thZ2VOYW1lIGluIFsnbGFuZ3VhZ2UtcHl0aG9uJywgJ01hZ2ljUHl0aG9uJywgJ2F0b20tZGphbmdvJ11cbiAgICAgIEBwcm92aWRlci5sb2FkKClcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1sb2FkLXByb3ZpZGVyJ1xuICAgICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG4gIF9sb2FkS2l0ZTogLT5cbiAgICBmaXJzdEluc3RhbGwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0b2NvbXBsZXRlLXB5dGhvbi5pbnN0YWxsZWQnKSA9PSBudWxsXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2F1dG9jb21wbGV0ZS1weXRob24uaW5zdGFsbGVkJywgdHJ1ZSlcbiAgICBsb25nUnVubmluZyA9IHJlcXVpcmUoJ3Byb2Nlc3MnKS51cHRpbWUoKSA+IDEwXG4gICAgaWYgZmlyc3RJbnN0YWxsIGFuZCBsb25nUnVubmluZ1xuICAgICAgZXZlbnQgPSBcImluc3RhbGxlZFwiXG4gICAgZWxzZSBpZiBmaXJzdEluc3RhbGxcbiAgICAgIGV2ZW50ID0gXCJ1cGdyYWRlZFwiXG4gICAgZWxzZVxuICAgICAgZXZlbnQgPSBcInJlc3RhcnRlZFwiXG5cbiAgICB7XG4gICAgICBBY2NvdW50TWFuYWdlcixcbiAgICAgIEF0b21IZWxwZXIsXG4gICAgICBNZXRyaWNzLFxuICAgICAgTG9nZ2VyLFxuICAgICAgU3RhdGVDb250cm9sbGVyLFxuICAgICAgTm9kZUNsaWVudCxcbiAgICAgIGluc3RhbGxcbiAgICB9ID0gcmVxdWlyZSAna2l0ZS1pbnN0YWxsZXInXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2tpdGUubG9nZ2luZ0xldmVsJylcbiAgICAgIExvZ2dlci5MRVZFTCA9IExvZ2dlci5MRVZFTFNbYXRvbS5jb25maWcuZ2V0KCdraXRlLmxvZ2dpbmdMZXZlbCcpLnRvVXBwZXJDYXNlKCldXG5cbiAgICBlZGl0b3JDZmcgPVxuICAgICAgVVVJRDogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21ldHJpY3MudXNlcklkJylcbiAgICAgIG5hbWU6ICdhdG9tJ1xuICAgIHBsdWdpbkNmZyA9XG4gICAgICBuYW1lOiAnYXV0b2NvbXBsZXRlLXB5dGhvbidcblxuICAgIE1ldHJpY3MuVHJhY2tlci5zb3VyY2UgPSAnYXV0b2NvbXBsZXRlLXB5dGhvbidcbiAgICBNZXRyaWNzLmVuYWJsZWQgPSBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUudGVsZW1ldHJ5Q29uc2VudCcpIGlzICdsaW1pdGVkJ1xuXG4gICAgYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSAocGtnKSA9PlxuICAgICAgaWYgcGtnLm5hbWUgaXMgJ2tpdGUnXG4gICAgICAgIEBwYXRjaEtpdGVDb21wbGV0aW9ucyhwa2cpXG5cbiAgICBjaGVja0tpdGVJbnN0YWxsYXRpb24gPSAoKSA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQgJ2F1dG9jb21wbGV0ZS1weXRob24udXNlS2l0ZSdcblxuICAgICAgc3RhdHVzQmFyID0gQHN0YXR1c0JhclxuXG4gICAgICBTdGF0ZUNvbnRyb2xsZXIuY2FuSW5zdGFsbEtpdGUoKS50aGVuKCgpIC0+XG4gICAgICAgIGtpdGVBdG9tID0gaW5zdGFsbC5hdG9tKClcbiAgICAgICAgSW5zdGFsbCA9IGluc3RhbGwuSW5zdGFsbFxuICAgICAgICBpbnN0YWxsZXIgPSBuZXcgSW5zdGFsbChraXRlQXRvbS5hdXRvY29tcGxldGVQeXRob25GbG93KCksIHtcbiAgICAgICAgICBwYXRoOiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSB8fCBvcy5ob21lZGlyKCksXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzdGF0dXNCYXI6IHN0YXR1c0JhcixcbiAgICAgICAgICBmYWlsdXJlU3RlcDogJ3Rlcm1pbmF0aW9uJyxcbiAgICAgICAgICB0aXRsZTogJ1VwZ3JhZGUgeW91ciBhdXRvY29tcGxldGUtcHl0aG9uIGVuZ2luZScsXG4gICAgICAgIH0pXG5cbiAgICAgICAgaW5pdGlhbENsaWVudCA9IEFjY291bnRNYW5hZ2VyLmNsaWVudFxuICAgICAgICBBY2NvdW50TWFuYWdlci5jbGllbnQgPSBuZXcgTm9kZUNsaWVudCgnYWxwaGEua2l0ZS5jb20nLCAtMSwgJycsIHRydWUpXG5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFkZEl0ZW0oaW5zdGFsbGVyKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGVJdGVtKGluc3RhbGxlcilcblxuICAgICAgICBpbnN0YWxsZWQgPSBmYWxzZVxuXG4gICAgICAgIGluc3RhbGxlci5vbkRpZERlc3Ryb3koLT5cbiAgICAgICAgICBpbnN0YWxsZWQgJiYgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnVzZUtpdGUnLCBpbnN0YWxsZWQpXG4gICAgICAgICAgQWNjb3VudE1hbmFnZXIuY2xpZW50ID0gaW5pdGlhbENsaWVudFxuICAgICAgICApXG5cbiAgICAgICAgaW5zdGFsbGVyLm9uRGlkVWRwZGF0ZVN0YXRlKChzdGF0ZSkgLT5cbiAgICAgICAgICBpZiB0eXBlb2Ygc3RhdGUuaW5zdGFsbCAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgaW5zdGFsbGVkID0gc3RhdGUuaW5zdGFsbC5kb25lIHx8IGZhbHNlXG4gICAgICAgIClcblxuICAgICAgICBpbnN0YWxsZXIub24oJ2RpZC1za2lwLWluc3RhbGwnLCAoKSAtPlxuICAgICAgICAgIGluc3RhbGxlZCA9IGZhbHNlXG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnVzZUtpdGUnLCBpbnN0YWxsZWQpXG4gICAgICAgIClcblxuICAgICAgICBpbnN0YWxsZXIub24oJ25vdC1hZG1pbi1zaG93bicsICgpIC0+XG4gICAgICAgICAgIyBTaG93IGluc3RhbGxhdGlvbiBhZ2FpbiBpZiB1c2VyIHJlc3RhcnRzIGFzIGFkbWluLiBUaGVyZSBpcyBhXG4gICAgICAgICAgIyBzZXBhcmF0ZSB1c2VyIG9wdGlvbiB0byBleHBsaWNpdGx5IG5vdCBzaG93IHRoaXMgYWdhaW4uXG4gICAgICAgICAgaW5zdGFsbGVkID0gdHJ1ZVxuICAgICAgICApXG5cbiAgICAgICAgaW5zdGFsbGVyLm9uKCdub3QtYWRtaW4tZGlzbWlzc2VkJywgKCkgLT5cbiAgICAgICAgICBpbnN0YWxsZWQgPSBmYWxzZVxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi51c2VLaXRlJywgaW5zdGFsbGVkKVxuICAgICAgICApXG5cbiAgICAgICAgaW5zdGFsbGVyLm9uKCdoZWFkbGVzcy1lcnJvcicsICh7ZXJyb3J9KSAtPlxuICAgICAgICAgIGluc3RhbGxlci51cGRhdGVTdGF0ZSh7ZXJyb3J9KTtcblxuICAgICAgICAgIGVycm9yVmlldyA9IG5ldyBraXRlQXRvbS5JbnN0YWxsRXJyb3JWaWV3KGluc3RhbGxlcik7XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFkZEl0ZW0oZXJyb3JWaWV3KVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZUl0ZW0oZXJyb3JWaWV3KVxuICAgICAgICApXG5cbiAgICAgICAgaW5zdGFsbGVyLnN0YXJ0KClcbiAgICAgICwgKGVycikgPT5cbiAgICAgICAgaWYgdHlwZW9mIGVyciAhPSAndW5kZWZpbmVkJyBhbmQgZXJyLnR5cGUgPT0gJ2RlbmllZCdcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ2F1dG9jb21wbGV0ZS1weXRob24udXNlS2l0ZScsIGZhbHNlXG4gICAgICApIGlmIGF0b20uY29uZmlnLmdldCAnYXV0b2NvbXBsZXRlLXB5dGhvbi51c2VLaXRlJ1xuXG4gICAgY2hlY2tLaXRlSW5zdGFsbGF0aW9uKClcblxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdhdXRvY29tcGxldGUtcHl0aG9uLnVzZUtpdGUnLCAoeyBuZXdWYWx1ZSwgb2xkVmFsdWUgfSkgLT5cbiAgICAgIGlmIG5ld1ZhbHVlXG4gICAgICAgIGNoZWNrS2l0ZUluc3RhbGxhdGlvbigpXG4gICAgICAgIEF0b21IZWxwZXIuZW5hYmxlUGFja2FnZSgpXG4gICAgICBlbHNlXG4gICAgICAgIEF0b21IZWxwZXIuZGlzYWJsZVBhY2thZ2UoKVxuXG4gIGxvYWQ6IC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBkaXNwb3NhYmxlID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAX2hhbmRsZUdyYW1tYXJDaGFuZ2VFdmVudChlZGl0b3IuZ2V0R3JhbW1hcigpKVxuICAgICAgZGlzcG9zYWJsZSA9IGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIgKGdyYW1tYXIpID0+XG4gICAgICAgIEBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50KGdyYW1tYXIpXG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2FibGVcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2FibGVcbiAgICBAX2xvYWRLaXRlKClcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAcHJvdmlkZXIgPSByZXF1aXJlKCcuL3Byb3ZpZGVyJylcbiAgICBpZiB0eXBlb2YgYXRvbS5wYWNrYWdlcy5oYXNBY3RpdmF0ZWRJbml0aWFsUGFja2FnZXMgPT0gJ2Z1bmN0aW9uJyBhbmRcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5oYXNBY3RpdmF0ZWRJbml0aWFsUGFja2FnZXMoKVxuICAgICAgQGxvYWQoKVxuICAgIGVsc2VcbiAgICAgIGRpc3Bvc2FibGUgPSBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVJbml0aWFsUGFja2FnZXMgPT5cbiAgICAgICAgQGxvYWQoKVxuICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHByb3ZpZGVyLmRpc3Bvc2UoKSBpZiBAcHJvdmlkZXJcbiAgICBAaW5zdGFsbGF0aW9uLmRlc3Ryb3koKSBpZiBAaW5zdGFsbGF0aW9uXG5cbiAgZ2V0UHJvdmlkZXI6IC0+XG4gICAgcmV0dXJuIEBwcm92aWRlclxuXG4gIGdldEh5cGVyY2xpY2tQcm92aWRlcjogLT5cbiAgICByZXR1cm4gcmVxdWlyZSgnLi9oeXBlcmNsaWNrLXByb3ZpZGVyJylcblxuICBjb25zdW1lU25pcHBldHM6IChzbmlwcGV0c01hbmFnZXIpIC0+XG4gICAgZGlzcG9zYWJsZSA9IEBlbWl0dGVyLm9uICdkaWQtbG9hZC1wcm92aWRlcicsID0+XG4gICAgICBAcHJvdmlkZXIuc2V0U25pcHBldHNNYW5hZ2VyIHNuaXBwZXRzTWFuYWdlclxuICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKClcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIEBzdGF0dXNCYXIgPSBzdGF0dXNCYXJcblxuICBwYXRjaEtpdGVDb21wbGV0aW9uczogKGtpdGUpIC0+XG4gICAgcmV0dXJuIGlmIEBraXRlUGFja2FnZT9cblxuICAgIEBraXRlUGFja2FnZSA9IGtpdGUubWFpbk1vZHVsZVxuICAgIEBraXRlUHJvdmlkZXIgPSBAa2l0ZVBhY2thZ2UuY29tcGxldGlvbnMoKVxuICAgIGdldFN1Z2dlc3Rpb25zID0gQGtpdGVQcm92aWRlci5nZXRTdWdnZXN0aW9uc1xuICAgIEBraXRlUHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbnMgPSAoYXJncy4uLikgPT5cbiAgICAgIGdldFN1Z2dlc3Rpb25zPy5hcHBseShAa2l0ZVByb3ZpZGVyLCBhcmdzKVxuICAgICAgPy50aGVuIChzdWdnZXN0aW9ucykgPT5cbiAgICAgICAgQGxhc3RLaXRlU3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9uc1xuICAgICAgICBAa2l0ZVN1Z2dlc3RlZCA9IHN1Z2dlc3Rpb25zP1xuICAgICAgICBzdWdnZXN0aW9uc1xuICAgICAgPy5jYXRjaCAoZXJyKSA9PlxuICAgICAgICBAbGFzdEtpdGVTdWdnZXN0aW9ucyA9IFtdXG4gICAgICAgIEBraXRlU3VnZ2VzdGVkID0gZmFsc2VcbiAgICAgICAgdGhyb3cgZXJyXG4iXX0=
