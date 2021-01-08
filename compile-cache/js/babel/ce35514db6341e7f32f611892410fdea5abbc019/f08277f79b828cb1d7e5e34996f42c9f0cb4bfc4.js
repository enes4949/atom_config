Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cheatsheetView = require('./cheatsheet-view');

var _cheatsheetView2 = _interopRequireDefault(_cheatsheetView);

var _atom = require('atom');

'use babel';

var fs = require('fs');
var path = require('path');
var defaultName = 'default-cheatsheet.coffee';
var customName = 'cheatsheet.coffee';

exports['default'] = {

  configPath: null,
  cheatsheetView: null,
  rightPanel: null,
  subscriptions: null,

  // Set up settings view
  config: {
    configPath: {
      title: 'Set your configuration file path',
      description: 'You must edit and reload the cheatsheet to see the effect.',
      type: 'string',
      'default': atom.getConfigDirPath()
    }
  },

  activate: function activate(state) {
    var _this = this;

    this.cheatsheetView = new _cheatsheetView2['default'](state.cheatsheetViewState);

    this.rightPanel = atom.workspace.addRightPanel({
      item: this.cheatsheetView.getElement(),
      visible: false
    });

    this.loadCheatSheetContent();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'cheatsheet:toggle': function cheatsheetToggle() {
        return _this.toggle();
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'cheatsheet:edit': function cheatsheetEdit() {
        return _this.editCheatsheet();
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'cheatsheet:reload': function cheatsheetReload() {
        return _this.loadCheatSheetContent();
      }
    }));
  },

  deactivate: function deactivate() {
    this.rightPanel.destroy();
    this.subscriptions.dispose();
    this.cheatsheetView.destroy();
  },

  serialize: function serialize() {
    return {
      cheatsheetViewState: this.cheatsheetView.serialize()
    };
  },

  toggle: function toggle() {
    console.log('Cheatsheet was toggled!');
    return this.rightPanel.isVisible() ? this.rightPanel.hide() : this.rightPanel.show();
  },

  editCheatsheet: function editCheatsheet() {

    // Destination path from config file
    var customPath = atom.config.get('cheatsheet.configPath');
    console.log(customPath);
    if (fs.existsSync(customPath)) {

      var customPathTotal = path.join(customPath, customName);

      if (fs.existsSync(customPathTotal)) {
        atom.workspace.open(customPathTotal);
      } else {
        this.copyDefaultConfig(customPathTotal);
      }
    } else {
      customPath = path.normalize(customPath);
      atom.config.set('cheatsheet.configPath', customPath);
      var customPathTotal = path.join(customPath, customName);
      fs.mkdirSync(customPath);
      this.copyDefaultConfig(customPathTotal);
    }
  },

  copyDefaultConfig: function copyDefaultConfig(destinationPathFile) {
    // Default config file path
    var defaultPath = __dirname;
    var defaultPathTotal = path.join(defaultPath, defaultName);
    if (fs.existsSync(defaultPathTotal)) {
      var COPYFILE_EXCL = fs.constants.COPYFILE_EXCL;

      // By using COPYFILE_EXCL, the operation will fail if destination exists.
      fs.copyFileSync(defaultPathTotal, destinationPathFile, COPYFILE_EXCL);

      atom.notifications.addInfo('We created your custom cheatsheet config file for you...', {
        detail: destinationPathFile,
        dismissable: true,
        buttons: [{
          text: 'Edit Config',
          onDidClick: function onDidClick() {
            atom.workspace.open(destinationPathFile);
          }
        }]
      });
    } else {
      atom.notifications.addError('Default configuration file not found. Please reinstall the package.', { dismissable: true });
    }
  },

  getCurrentPath: function getCurrentPath() {

    // Destination path from config file
    var customPath = atom.config.get('cheatsheet.configPath');
    var customPathTotal = path.join(customPath, customName);

    if (fs.existsSync(customPathTotal)) {
      return customPathTotal;
    } else {
      // Set up default path
      var defaultPathTotal = path.join(__dirname, defaultName);
      return defaultPathTotal;
    }
  },

  loadConfigFile: function loadConfigFile() {

    // Get current path
    var currentPath = this.getCurrentPath();
    console.log(currentPath);

    // Set content to undefined
    var content = undefined;
    console.log(content);
    // If the module is loaded remove it
    this.removeCache(currentPath);

    try {
      // Load module again
      content = require(currentPath);
    } catch (err) {
      atom.notifications.addError('Invalid syntax in configuration file.', {
        dismissable: true,
        buttons: [{
          text: 'Open file',
          onDidClick: function onDidClick() {
            // open the config file in atom
            atom.workspace.open(currentPath);
          }
        }]
      });
    }

    console.log(content);
    return content;
  },

  removeCache: function removeCache(filePath) {
    // Credits to flex-tool-bar contributers
    delete require.cache[filePath];

    try {
      var relativeFilePath = path.relative(path.join(process.cwd(), 'resources', 'app', 'static'), filePath);
      if (process.platform === 'win32') {
        relativeFilePath = relativeFilePath.replace(/\\/g, '/');
      }
      delete snapshotResult.customRequire.cache[relativeFilePath];
    } catch (err) {
      // most likely snapshotResult does not exist
    }
  },

  loadCheatSheetContent: function loadCheatSheetContent() {
    var content = this.loadConfigFile();
    if (content !== undefined) {
      this.drawCheatSheet(content);
    }
  },

  drawCheatSheet: function drawCheatSheet(content) {
    // Set html const for the copied effect
    var spanElements = '<span class="focus-text icon icon-clippy"></span><span class="focus-text">Copied</span>';

    // Remove all childs in the scrollable content div
    var scrollableContent = document.getElementById("ScrollableContent");
    while (scrollableContent.firstChild) {
      scrollableContent.removeChild(scrollableContent.firstChild);
      //console.log(scrollableContent.firstChild);
    }

    // Draw all HTML elements
    for (var i = 0; i < content.length; i++) {
      //console.log(content[i]);
      json = content[i];

      switch (json.type) {
        case 'header':
          var header = document.createElement('h2');
          header.innerHTML = '<span class="' + json.icon + '"></span>' + '<span class="devicons-text">' + json.text + '</span>';
          scrollableContent.appendChild(header);
          break;
        case 'subheader':
          var subheader = document.createElement('h3');
          subheader.textContent = json.text.toUpperCase();
          scrollableContent.appendChild(subheader);
          break;
        case 'content':

          var textarea = document.createElement("textarea");
          var divCodeContainer = document.createElement("div");
          var divFocusContainer = document.createElement("div");
          var divFocusBackground = document.createElement("div");

          // Set textarea properties
          if (json.hasOwnProperty('rows')) {
            textarea.rows = json.rows;
          } else {
            textarea.rows = 1;
          }
          textarea.value = json.text;
          textarea.readOnly = true;
          textarea.classList.add('noselect');
          textarea.onclick = function () {
            atom.clipboard.write(this.value);
          };

          divCodeContainer.classList.add('code-container');
          divFocusContainer.classList.add('focus-container');
          divFocusContainer.innerHTML = spanElements;
          divFocusBackground.classList.add('focus-background');

          divCodeContainer.appendChild(textarea);
          divCodeContainer.appendChild(divFocusContainer);
          divCodeContainer.appendChild(divFocusBackground);
          scrollableContent.appendChild(divCodeContainer);

          //description
          if (json.description != "") {
            var description = document.createElement('div');
            description.textContent = json.description;
            description.classList.add("description");
            scrollableContent.appendChild(description);
          }

          break;
        default:
          var spacer = document.createElement('hr');
          scrollableContent.appendChild(spacer);
      }
    }
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9jaGVhdHNoZWV0L2xpYi9jaGVhdHNoZWV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs4QkFFMkIsbUJBQW1COzs7O29CQUNWLE1BQU07O0FBSDFDLFdBQVcsQ0FBQzs7QUFLWixJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sV0FBVyxHQUFHLDJCQUEyQixDQUFDO0FBQ2hELElBQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDOztxQkFFeEI7O0FBRWIsWUFBVSxFQUFFLElBQUk7QUFDaEIsZ0JBQWMsRUFBRSxJQUFJO0FBQ3BCLFlBQVUsRUFBRSxJQUFJO0FBQ2hCLGVBQWEsRUFBRSxJQUFJOzs7QUFHbkIsUUFBTSxFQUFFO0FBQ04sY0FBVSxFQUFFO0FBQ1YsV0FBSyxFQUFFLGtDQUFrQztBQUN6QyxpQkFBVyxFQUFFLDREQUE0RDtBQUN6RSxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtLQUNqQztHQUNGOztBQUlELFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7OztBQUVkLFFBQUksQ0FBQyxjQUFjLEdBQUcsZ0NBQW1CLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUVwRSxRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO0FBQzdDLFVBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRTtBQUN0QyxhQUFPLEVBQUUsS0FBSztLQUNmLENBQUMsQ0FBQzs7QUFHSCxRQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7O0FBRzdCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7OztBQUcvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJ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aEQsMEJBQWdCLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDakQsMkJBQWlCLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7OztBQUdoRCxjQUFJLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFO0FBQzFCLGdCQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hELHVCQUFXLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDM0MsdUJBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pDLDZCQUFpQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztXQUM1Qzs7QUFFRCxnQkFBTTtBQUFBLEFBQ1I7QUFDRSxjQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFDLDJCQUFpQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUFBLE9BQ3pDO0tBQ0Y7R0FDRjs7Q0FHRiIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvY2hlYXRzaGVldC9saWIvY2hlYXRzaGVldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgQ2hlYXRzaGVldFZpZXcgZnJvbSAnLi9jaGVhdHNoZWV0LXZpZXcnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgZGVmYXVsdE5hbWUgPSAnZGVmYXVsdC1jaGVhdHNoZWV0LmNvZmZlZSc7XG5jb25zdCBjdXN0b21OYW1lID0gJ2NoZWF0c2hlZXQuY29mZmVlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGNvbmZpZ1BhdGg6IG51bGwsXG4gIGNoZWF0c2hlZXRWaWV3OiBudWxsLFxuICByaWdodFBhbmVsOiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIC8vIFNldCB1cCBzZXR0aW5ncyB2aWV3XG4gIGNvbmZpZzoge1xuICAgIGNvbmZpZ1BhdGg6IHtcbiAgICAgIHRpdGxlOiAnU2V0IHlvdXIgY29uZmlndXJhdGlvbiBmaWxlIHBhdGgnLFxuICAgICAgZGVzY3JpcHRpb246ICdZb3UgbXVzdCBlZGl0IGFuZCByZWxvYWQgdGhlIGNoZWF0c2hlZXQgdG8gc2VlIHRoZSBlZmZlY3QuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogYXRvbS5nZXRDb25maWdEaXJQYXRoKCksXG4gICAgfVxuICB9LFxuXG5cblxuICBhY3RpdmF0ZShzdGF0ZSkge1xuXG4gICAgdGhpcy5jaGVhdHNoZWV0VmlldyA9IG5ldyBDaGVhdHNoZWV0VmlldyhzdGF0ZS5jaGVhdHNoZWV0Vmlld1N0YXRlKTtcblxuICAgIHRoaXMucmlnaHRQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZFJpZ2h0UGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5jaGVhdHNoZWV0Vmlldy5nZXRFbGVtZW50KCksXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuXG5cbiAgICB0aGlzLmxvYWRDaGVhdFNoZWV0Q29udGVudCgpO1xuXG4gICAgLy8gRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgLy8gUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnY2hlYXRzaGVldDp0b2dnbGUnOiAoKSA9PiB0aGlzLnRvZ2dsZSgpXG4gICAgfSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2NoZWF0c2hlZXQ6ZWRpdCc6ICgpID0+IHRoaXMuZWRpdENoZWF0c2hlZXQoKVxuICAgIH0pKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdjaGVhdHNoZWV0OnJlbG9hZCc6ICgpID0+IHRoaXMubG9hZENoZWF0U2hlZXRDb250ZW50KClcbiAgICB9KSk7XG4gIH0sXG5cblxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5yaWdodFBhbmVsLmRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIHRoaXMuY2hlYXRzaGVldFZpZXcuZGVzdHJveSgpO1xuICB9LFxuXG5cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoZWF0c2hlZXRWaWV3U3RhdGU6IHRoaXMuY2hlYXRzaGVldFZpZXcuc2VyaWFsaXplKClcbiAgICB9O1xuICB9LFxuXG5cblxuICB0b2dnbGUoKSB7XG4gICAgY29uc29sZS5sb2coJ0NoZWF0c2hlZXQgd2FzIHRvZ2dsZWQhJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucmlnaHRQYW5lbC5pc1Zpc2libGUoKSA/XG4gICAgICB0aGlzLnJpZ2h0UGFuZWwuaGlkZSgpIDpcbiAgICAgIHRoaXMucmlnaHRQYW5lbC5zaG93KClcbiAgICApO1xuICB9LFxuXG5cblxuICBlZGl0Q2hlYXRzaGVldCgpIHtcblxuXHRcdC8vIERlc3RpbmF0aW9uIHBhdGggZnJvbSBjb25maWcgZmlsZVxuXHRcdGxldCBjdXN0b21QYXRoID0gYXRvbS5jb25maWcuZ2V0KCdjaGVhdHNoZWV0LmNvbmZpZ1BhdGgnKTtcbiAgICBjb25zb2xlLmxvZyhjdXN0b21QYXRoKTtcblx0XHRpZiAoZnMuZXhpc3RzU3luYyhjdXN0b21QYXRoKSkge1xuXG5cdFx0XHR2YXIgY3VzdG9tUGF0aFRvdGFsID0gcGF0aC5qb2luKGN1c3RvbVBhdGgsIGN1c3RvbU5hbWUpO1xuXG5cdFx0XHRpZiAoZnMuZXhpc3RzU3luYyhjdXN0b21QYXRoVG90YWwpKSB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oY3VzdG9tUGF0aFRvdGFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29weURlZmF1bHRDb25maWcoY3VzdG9tUGF0aFRvdGFsKVxuICAgICAgfVxuXG5cdFx0fSBlbHNlIHtcbiAgICAgIGN1c3RvbVBhdGggPSBwYXRoLm5vcm1hbGl6ZShjdXN0b21QYXRoKTtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnY2hlYXRzaGVldC5jb25maWdQYXRoJywgY3VzdG9tUGF0aCk7XG4gICAgICB2YXIgY3VzdG9tUGF0aFRvdGFsID0gcGF0aC5qb2luKGN1c3RvbVBhdGgsIGN1c3RvbU5hbWUpO1xuICAgICAgZnMubWtkaXJTeW5jKGN1c3RvbVBhdGgpO1xuICAgICAgdGhpcy5jb3B5RGVmYXVsdENvbmZpZyhjdXN0b21QYXRoVG90YWwpXG4gICAgfVxuICB9LFxuXG5cblxuICBjb3B5RGVmYXVsdENvbmZpZyhkZXN0aW5hdGlvblBhdGhGaWxlKSB7XG4gICAgLy8gRGVmYXVsdCBjb25maWcgZmlsZSBwYXRoXG4gICAgdmFyIGRlZmF1bHRQYXRoID0gX19kaXJuYW1lO1xuICAgIHZhciBkZWZhdWx0UGF0aFRvdGFsID0gcGF0aC5qb2luKGRlZmF1bHRQYXRoLCBkZWZhdWx0TmFtZSk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoZGVmYXVsdFBhdGhUb3RhbCkpIHtcbiAgICAgIGNvbnN0IHsgQ09QWUZJTEVfRVhDTCB9ID0gZnMuY29uc3RhbnRzO1xuICAgICAgLy8gQnkgdXNpbmcgQ09QWUZJTEVfRVhDTCwgdGhlIG9wZXJhdGlvbiB3aWxsIGZhaWwgaWYgZGVzdGluYXRpb24gZXhpc3RzLlxuICAgICAgZnMuY29weUZpbGVTeW5jKGRlZmF1bHRQYXRoVG90YWwsIGRlc3RpbmF0aW9uUGF0aEZpbGUsIENPUFlGSUxFX0VYQ0wpO1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnV2UgY3JlYXRlZCB5b3VyIGN1c3RvbSBjaGVhdHNoZWV0IGNvbmZpZyBmaWxlIGZvciB5b3UuLi4nLCB7XG4gICAgICAgIGRldGFpbDogZGVzdGluYXRpb25QYXRoRmlsZSxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgdGV4dDogJ0VkaXQgQ29uZmlnJyxcbiAgICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihkZXN0aW5hdGlvblBhdGhGaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0RlZmF1bHQgY29uZmlndXJhdGlvbiBmaWxlIG5vdCBmb3VuZC4gUGxlYXNlIHJlaW5zdGFsbCB0aGUgcGFja2FnZS4nLCB7ZGlzbWlzc2FibGU6IHRydWV9KTtcbiAgICB9XG4gIH0sXG5cblxuXG4gIGdldEN1cnJlbnRQYXRoKCkge1xuXG5cdFx0Ly8gRGVzdGluYXRpb24gcGF0aCBmcm9tIGNvbmZpZyBmaWxlXG5cdFx0bGV0IGN1c3RvbVBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2NoZWF0c2hlZXQuY29uZmlnUGF0aCcpO1xuICAgIGxldCBjdXN0b21QYXRoVG90YWwgPSBwYXRoLmpvaW4oY3VzdG9tUGF0aCwgY3VzdG9tTmFtZSk7XG5cblx0XHRpZiAoZnMuZXhpc3RzU3luYyhjdXN0b21QYXRoVG90YWwpKSB7XG4gICAgICByZXR1cm4gY3VzdG9tUGF0aFRvdGFsO1xuXHRcdH0gZWxzZSB7XG4gICAgICAvLyBTZXQgdXAgZGVmYXVsdCBwYXRoXG4gICAgICBsZXQgZGVmYXVsdFBhdGhUb3RhbCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIGRlZmF1bHROYW1lKTtcblx0XHRcdHJldHVybiBkZWZhdWx0UGF0aFRvdGFsO1xuXHRcdH1cbiAgfSxcblxuXG5cbiAgbG9hZENvbmZpZ0ZpbGUoKSB7XG5cbiAgICAvLyBHZXQgY3VycmVudCBwYXRoXG4gICAgbGV0IGN1cnJlbnRQYXRoID0gdGhpcy5nZXRDdXJyZW50UGF0aCgpO1xuICAgIGNvbnNvbGUubG9nKGN1cnJlbnRQYXRoKTtcblxuICAgIC8vIFNldCBjb250ZW50IHRvIHVuZGVmaW5lZFxuICAgIGxldCBjb250ZW50O1xuICAgIGNvbnNvbGUubG9nKGNvbnRlbnQpO1xuICAgIC8vIElmIHRoZSBtb2R1bGUgaXMgbG9hZGVkIHJlbW92ZSBpdFxuICAgIHRoaXMucmVtb3ZlQ2FjaGUoY3VycmVudFBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIExvYWQgbW9kdWxlIGFnYWluXG4gICAgICBjb250ZW50ID0gcmVxdWlyZShjdXJyZW50UGF0aCk7XG4gICAgfVxuICAgIGNhdGNoKGVycikge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdJbnZhbGlkIHN5bnRheCBpbiBjb25maWd1cmF0aW9uIGZpbGUuJywge1xuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgICB0ZXh0OiAnT3BlbiBmaWxlJyxcbiAgICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgICAgLy8gb3BlbiB0aGUgY29uZmlnIGZpbGUgaW4gYXRvbVxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihjdXJyZW50UGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coY29udGVudCk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG5cbiAgfSxcblxuXG5cbiAgcmVtb3ZlQ2FjaGUoZmlsZVBhdGgpIHtcbiAgICAvLyBDcmVkaXRzIHRvIGZsZXgtdG9vbC1iYXIgY29udHJpYnV0ZXJzXG4gICAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbZmlsZVBhdGhdO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCByZWxhdGl2ZUZpbGVQYXRoID0gcGF0aC5yZWxhdGl2ZShwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3Jlc291cmNlcycsICdhcHAnLCAnc3RhdGljJyksIGZpbGVQYXRoKTtcbiAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICAgIHJlbGF0aXZlRmlsZVBhdGggPSByZWxhdGl2ZUZpbGVQYXRoLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBzbmFwc2hvdFJlc3VsdC5jdXN0b21SZXF1aXJlLmNhY2hlW3JlbGF0aXZlRmlsZVBhdGhdO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gbW9zdCBsaWtlbHkgc25hcHNob3RSZXN1bHQgZG9lcyBub3QgZXhpc3RcbiAgICB9XG4gIH0sXG5cblxuXG4gIGxvYWRDaGVhdFNoZWV0Q29udGVudCgpIHtcbiAgICBsZXQgY29udGVudCA9IHRoaXMubG9hZENvbmZpZ0ZpbGUoKTtcbiAgICBpZiAoY29udGVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRyYXdDaGVhdFNoZWV0KGNvbnRlbnQpO1xuICAgIH1cbiAgfSxcblxuXG5cbiAgZHJhd0NoZWF0U2hlZXQoY29udGVudCkge1xuICAgIC8vIFNldCBodG1sIGNvbnN0IGZvciB0aGUgY29waWVkIGVmZmVjdFxuICAgIGNvbnN0IHNwYW5FbGVtZW50cyA9ICc8c3BhbiBjbGFzcz1cImZvY3VzLXRleHQgaWNvbiBpY29uLWNsaXBweVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImZvY3VzLXRleHRcIj5Db3BpZWQ8L3NwYW4+J1xuXG4gICAgLy8gUmVtb3ZlIGFsbCBjaGlsZHMgaW4gdGhlIHNjcm9sbGFibGUgY29udGVudCBkaXZcbiAgICBsZXQgc2Nyb2xsYWJsZUNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlNjcm9sbGFibGVDb250ZW50XCIpO1xuICAgIHdoaWxlIChzY3JvbGxhYmxlQ29udGVudC5maXJzdENoaWxkKSB7XG4gICAgICBzY3JvbGxhYmxlQ29udGVudC5yZW1vdmVDaGlsZChzY3JvbGxhYmxlQ29udGVudC5maXJzdENoaWxkKTtcbiAgICAgIC8vY29uc29sZS5sb2coc2Nyb2xsYWJsZUNvbnRlbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyBhbGwgSFRNTCBlbGVtZW50c1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udGVudC5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyhjb250ZW50W2ldKTtcbiAgICAgIGpzb24gPSBjb250ZW50W2ldXG5cbiAgICAgIHN3aXRjaChqc29uLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICAgIGhlYWRlci5pbm5lckhUTUwgPSAnPHNwYW4gY2xhc3M9XCInICsganNvbi5pY29uICsgJ1wiPjwvc3Bhbj4nICsgJzxzcGFuIGNsYXNzPVwiZGV2aWNvbnMtdGV4dFwiPicgKyBqc29uLnRleHQgKyAnPC9zcGFuPic7XG4gICAgICAgICAgc2Nyb2xsYWJsZUNvbnRlbnQuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3ViaGVhZGVyJzpcbiAgICAgICAgICBjb25zdCBzdWJoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuICAgICAgICAgIHN1YmhlYWRlci50ZXh0Q29udGVudCA9IGpzb24udGV4dC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIHNjcm9sbGFibGVDb250ZW50LmFwcGVuZENoaWxkKHN1YmhlYWRlcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuXG4gICAgICAgICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuICAgICAgICAgIHZhciBkaXZDb2RlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICB2YXIgZGl2Rm9jdXNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgIHZhciBkaXZGb2N1c0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgLy8gU2V0IHRleHRhcmVhIHByb3BlcnRpZXNcbiAgICAgICAgICBpZihqc29uLmhhc093blByb3BlcnR5KCdyb3dzJykpe1xuICAgICAgICAgICAgdGV4dGFyZWEucm93cyA9IGpzb24ucm93cztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dGFyZWEucm93cyA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRleHRhcmVhLnZhbHVlID0ganNvbi50ZXh0O1xuICAgICAgICAgIHRleHRhcmVhLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICB0ZXh0YXJlYS5jbGFzc0xpc3QuYWRkKCdub3NlbGVjdCcpO1xuICAgICAgICAgIHRleHRhcmVhLm9uY2xpY2sgPSBmdW5jdGlvbigpe2F0b20uY2xpcGJvYXJkLndyaXRlKHRoaXMudmFsdWUpO307XG5cbiAgICAgICAgICBkaXZDb2RlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvZGUtY29udGFpbmVyJyk7XG4gICAgICAgICAgZGl2Rm9jdXNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZm9jdXMtY29udGFpbmVyJyk7XG4gICAgICAgICAgZGl2Rm9jdXNDb250YWluZXIuaW5uZXJIVE1MID0gc3BhbkVsZW1lbnRzO1xuICAgICAgICAgIGRpdkZvY3VzQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdmb2N1cy1iYWNrZ3JvdW5kJyk7XG5cbiAgICAgICAgICBkaXZDb2RlQ29udGFpbmVyLmFwcGVuZENoaWxkKHRleHRhcmVhKTtcbiAgICAgICAgICBkaXZDb2RlQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdkZvY3VzQ29udGFpbmVyKTtcbiAgICAgICAgICBkaXZDb2RlQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdkZvY3VzQmFja2dyb3VuZCk7XG4gICAgICAgICAgc2Nyb2xsYWJsZUNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2Q29kZUNvbnRhaW5lcik7XG5cbiAgICAgICAgICAvL2Rlc2NyaXB0aW9uXG4gICAgICAgICAgaWYgKGpzb24uZGVzY3JpcHRpb24gIT0gXCJcIikge1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IGpzb24uZGVzY3JpcHRpb247XG4gICAgICAgICAgICBkZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKFwiZGVzY3JpcHRpb25cIik7XG4gICAgICAgICAgICBzY3JvbGxhYmxlQ29udGVudC5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdmFyIHNwYWNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJyk7XG4gICAgICAgICAgc2Nyb2xsYWJsZUNvbnRlbnQuYXBwZW5kQ2hpbGQoc3BhY2VyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cblxufTtcbiJdfQ==