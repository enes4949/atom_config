Object.defineProperty(exports, "__esModule", {
  value: true
});

var Config = {
  getJson: function getJson(key) {
    var _default = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var value = atom.config.get("Hydrogen." + key);
    if (!value || typeof value !== "string") return _default;
    try {
      return JSON.parse(value);
    } catch (error) {
      var message = "Your Hydrogen config is broken: " + key;
      atom.notifications.addError(message, { detail: error });
    }
    return _default;
  },

  schema: {
    autocomplete: {
      title: "Enable Autocomplete",
      includeTitle: false,
      description: "If enabled, use autocomplete options provided by the current kernel.",
      type: "boolean",
      "default": true,
      order: 0
    },
    autocompleteSuggestionPriority: {
      title: "Autocomple Suggestion Priority",
      description: "Specify the sort order of Hydrogen's autocomplete suggestions. Note the default providers like snippets have priority of `1`.",
      type: "integer",
      "default": 3,
      order: 1
    },
    showInspectorResultsInAutocomplete: {
      title: "Enable Autocomplete description (Experimental)",
      description: "If enabled, Hydrogen will try to show [the results from kernel inspection](https://nteract.gitbooks.io/hydrogen/docs/Usage/GettingStarted.html#hydrogen-toggle-inspector) in each autocomplete suggestion's description. ⚠ May slow down the autocompletion performance. (**Note**: Even if you disable this, you would still get autocomplete suggestions.)",
      type: "boolean",
      "default": false,
      order: 2
    },
    importNotebookURI: {
      title: "Enable Notebook Auto-import",
      description: "If enabled, opening a file with extension `.ipynb` will [import the notebook](https://nteract.gitbooks.io/hydrogen/docs/Usage/NotebookFiles.html#notebook-import) file's source into a new tab. If disabled, or if the Hydrogen package is not activated, the raw file will open in Atom as normal.",
      type: "boolean",
      "default": true,
      order: 3
    },
    importNotebookResults: {
      title: "Enable Import of Notebook Results",
      description: "If enabled, anytime you import a notebook, the saved results are also rendered inline. If disabled, you can still import notebooks as normal.",
      type: "boolean",
      "default": true,
      order: 4
    },
    statusBarDisable: {
      title: "Disable the Hydrogen status bar",
      description: "If enabled, no kernel information will be provided in Atom's status bar.",
      type: "boolean",
      "default": false,
      order: 5
    },
    statusBarKernelInfo: {
      title: "Detailed kernel information in the Hydrogen status bar",
      description: "If enabled, more detailed kernel information (execution count, execution time if available) will be shown in the Hydrogen status bar. This requires the above **Disable the Hydrogen status bar** setting to be `false` to work.",
      type: "boolean",
      "default": true,
      order: 6
    },
    debug: {
      title: "Enable Debug Messages",
      includeTitle: false,
      description: "If enabled, log debug messages onto the dev console.",
      type: "boolean",
      "default": false,
      order: 7
    },
    autoScroll: {
      title: "Enable Autoscroll",
      includeTitle: false,
      description: "If enabled, Hydrogen will automatically scroll to the bottom of the result view.",
      type: "boolean",
      "default": true,
      order: 8
    },
    centerOnMoveDown: {
      title: "Center on Move Down",
      includeTitle: true,
      description: "If enabled, running center-and-move-down will center the screen on the new line",
      type: "boolean",
      "default": false,
      order: 9
    },
    wrapOutput: {
      title: "Enable Soft Wrap for Output",
      includeTitle: false,
      description: "If enabled, your output code from Hydrogen will break long text and items.",
      type: "boolean",
      "default": false,
      order: 10
    },
    outputAreaDefault: {
      title: "View output in the dock by default",
      description: "If enabled, output will be displayed in the dock by default rather than inline",
      type: "boolean",
      "default": false,
      order: 11
    },
    outputAreaDock: {
      title: "Leave output dock open",
      description: "Do not close dock when switching to an editor without a running kernel",
      type: "boolean",
      "default": false,
      order: 12
    },
    outputAreaFontSize: {
      title: "Output area fontsize",
      includeTitle: false,
      description: "Change the fontsize of the Output area.",
      type: "integer",
      minimum: 0,
      "default": 0,
      order: 13
    },
    globalMode: {
      title: "Enable Global Kernel",
      description: "If enabled, all files of the same grammar will share a single global kernel (requires Atom restart)",
      type: "boolean",
      "default": false,
      order: 14
    },
    kernelNotifications: {
      title: "Enable Kernel Notifications",
      includeTitle: false,
      description: "Notify if kernels writes to stdout. By default, kernel notifications are only displayed in the developer console.",
      type: "boolean",
      "default": false,
      order: 15
    },
    startDir: {
      title: "Directory to start kernel in",
      includeTitle: false,
      description: "Restart the kernel for changes to take effect.",
      type: "string",
      "enum": [{
        value: "firstProjectDir",
        description: "The first started project's directory (default)"
      }, {
        value: "projectDirOfFile",
        description: "The project directory relative to the file"
      }, {
        value: "dirOfFile",
        description: "Current directory of the file"
      }],
      "default": "firstProjectDir",
      order: 16
    },
    languageMappings: {
      title: "Language Mappings",
      includeTitle: false,
      description: 'Custom Atom grammars and some kernels use non-standard language names. That leaves Hydrogen unable to figure out what kernel to start for your code. This field should be a valid JSON mapping from a kernel language name to Atom\'s grammar name ``` { "kernel name": "grammar name" } ```. For example ``` { "scala211": "scala", "javascript": "babel es6 javascript", "python": "magicpython" } ```.',
      type: "string",
      "default": '{ "python": "magicpython" }',
      order: 17
    },
    startupCode: {
      title: "Startup Code",
      includeTitle: false,
      description: 'This code will be executed on kernel startup. Format: `{"kernel": "your code \\nmore code"}`. Example: `{"Python 2": "%matplotlib inline"}`',
      type: "string",
      "default": "{}",
      order: 18
    },
    gateways: {
      title: "Kernel Gateways",
      includeTitle: false,
      description: 'Hydrogen can connect to remote notebook servers and kernel gateways. Each gateway needs at minimum a name and a value for options.baseUrl. The options are passed directly to the `jupyter-js-services` npm package, which includes documentation for additional fields. Example value: ``` [{ "name": "Remote notebook", "options": { "baseUrl": "http://mysite.com:8888" } }] ```',
      type: "string",
      "default": "[]",
      order: 19
    }
  }
};

exports["default"] = Config;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxJQUFNLE1BQU0sR0FBRztBQUNiLFNBQU8sRUFBQSxpQkFBQyxHQUFXLEVBQXlCO1FBQXZCLFFBQWdCLHlEQUFHLEVBQUU7O0FBQ3hDLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxlQUFhLEdBQUcsQ0FBRyxDQUFDO0FBQ2pELFFBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFLE9BQU8sUUFBUSxDQUFDO0FBQ3pELFFBQUk7QUFDRixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFVBQU0sT0FBTyx3Q0FBc0MsR0FBRyxBQUFFLENBQUM7QUFDekQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDekQ7QUFDRCxXQUFPLFFBQVEsQ0FBQztHQUNqQjs7QUFFRCxRQUFNLEVBQUU7QUFDTixnQkFBWSxFQUFFO0FBQ1osV0FBSyxFQUFFLHFCQUFxQjtBQUM1QixrQkFBWSxFQUFFLEtBQUs7QUFDbkIsaUJBQVcsRUFDVCxzRUFBc0U7QUFDeEUsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0FBQ2IsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELGtDQUE4QixFQUFFO0FBQzlCLFdBQUssRUFBRSxnQ0FBZ0M7QUFDdkMsaUJBQVcsRUFDVCwrSEFBK0g7QUFDakksVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxDQUFDO0FBQ1YsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELHNDQUFrQyxFQUFFO0FBQ2xDLFdBQUssRUFBRSxnREFBZ0Q7QUFDdkQsaUJBQVcsRUFDVCw4VkFBOFY7QUFD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ZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmNvbnN0IENvbmZpZyA9IHtcbiAgZ2V0SnNvbihrZXk6IHN0cmluZywgX2RlZmF1bHQ6IE9iamVjdCA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLiR7a2V5fWApO1xuICAgIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gX2RlZmF1bHQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGBZb3VyIEh5ZHJvZ2VuIGNvbmZpZyBpcyBicm9rZW46ICR7a2V5fWA7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSwgeyBkZXRhaWw6IGVycm9yIH0pO1xuICAgIH1cbiAgICByZXR1cm4gX2RlZmF1bHQ7XG4gIH0sXG5cbiAgc2NoZW1hOiB7XG4gICAgYXV0b2NvbXBsZXRlOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgQXV0b2NvbXBsZXRlXCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgdXNlIGF1dG9jb21wbGV0ZSBvcHRpb25zIHByb3ZpZGVkIGJ5IHRoZSBjdXJyZW50IGtlcm5lbC5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIG9yZGVyOiAwLFxuICAgIH0sXG4gICAgYXV0b2NvbXBsZXRlU3VnZ2VzdGlvblByaW9yaXR5OiB7XG4gICAgICB0aXRsZTogXCJBdXRvY29tcGxlIFN1Z2dlc3Rpb24gUHJpb3JpdHlcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIlNwZWNpZnkgdGhlIHNvcnQgb3JkZXIgb2YgSHlkcm9nZW4ncyBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbnMuIE5vdGUgdGhlIGRlZmF1bHQgcHJvdmlkZXJzIGxpa2Ugc25pcHBldHMgaGF2ZSBwcmlvcml0eSBvZiBgMWAuXCIsXG4gICAgICB0eXBlOiBcImludGVnZXJcIixcbiAgICAgIGRlZmF1bHQ6IDMsXG4gICAgICBvcmRlcjogMSxcbiAgICB9LFxuICAgIHNob3dJbnNwZWN0b3JSZXN1bHRzSW5BdXRvY29tcGxldGU6IHtcbiAgICAgIHRpdGxlOiBcIkVuYWJsZSBBdXRvY29tcGxldGUgZGVzY3JpcHRpb24gKEV4cGVyaW1lbnRhbClcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIEh5ZHJvZ2VuIHdpbGwgdHJ5IHRvIHNob3cgW3RoZSByZXN1bHRzIGZyb20ga2VybmVsIGluc3BlY3Rpb25dKGh0dHBzOi8vbnRlcmFjdC5naXRib29rcy5pby9oeWRyb2dlbi9kb2NzL1VzYWdlL0dldHRpbmdTdGFydGVkLmh0bWwjaHlkcm9nZW4tdG9nZ2xlLWluc3BlY3RvcikgaW4gZWFjaCBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbidzIGRlc2NyaXB0aW9uLiDimqAgTWF5IHNsb3cgZG93biB0aGUgYXV0b2NvbXBsZXRpb24gcGVyZm9ybWFuY2UuICgqKk5vdGUqKjogRXZlbiBpZiB5b3UgZGlzYWJsZSB0aGlzLCB5b3Ugd291bGQgc3RpbGwgZ2V0IGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9ucy4pXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXI6IDIsXG4gICAgfSxcbiAgICBpbXBvcnROb3RlYm9va1VSSToge1xuICAgICAgdGl0bGU6IFwiRW5hYmxlIE5vdGVib29rIEF1dG8taW1wb3J0XCIsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgXCJJZiBlbmFibGVkLCBvcGVuaW5nIGEgZmlsZSB3aXRoIGV4dGVuc2lvbiBgLmlweW5iYCB3aWxsIFtpbXBvcnQgdGhlIG5vdGVib29rXShodHRwczovL250ZXJhY3QuZ2l0Ym9va3MuaW8vaHlkcm9nZW4vZG9jcy9Vc2FnZS9Ob3RlYm9va0ZpbGVzLmh0bWwjbm90ZWJvb2staW1wb3J0KSBmaWxlJ3Mgc291cmNlIGludG8gYSBuZXcgdGFiLiBJZiBkaXNhYmxlZCwgb3IgaWYgdGhlIEh5ZHJvZ2VuIHBhY2thZ2UgaXMgbm90IGFjdGl2YXRlZCwgdGhlIHJhdyBmaWxlIHdpbGwgb3BlbiBpbiBBdG9tIGFzIG5vcm1hbC5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIG9yZGVyOiAzLFxuICAgIH0sXG4gICAgaW1wb3J0Tm90ZWJvb2tSZXN1bHRzOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgSW1wb3J0IG9mIE5vdGVib29rIFJlc3VsdHNcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIGFueXRpbWUgeW91IGltcG9ydCBhIG5vdGVib29rLCB0aGUgc2F2ZWQgcmVzdWx0cyBhcmUgYWxzbyByZW5kZXJlZCBpbmxpbmUuIElmIGRpc2FibGVkLCB5b3UgY2FuIHN0aWxsIGltcG9ydCBub3RlYm9va3MgYXMgbm9ybWFsLlwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgb3JkZXI6IDQsXG4gICAgfSxcbiAgICBzdGF0dXNCYXJEaXNhYmxlOiB7XG4gICAgICB0aXRsZTogXCJEaXNhYmxlIHRoZSBIeWRyb2dlbiBzdGF0dXMgYmFyXCIsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgXCJJZiBlbmFibGVkLCBubyBrZXJuZWwgaW5mb3JtYXRpb24gd2lsbCBiZSBwcm92aWRlZCBpbiBBdG9tJ3Mgc3RhdHVzIGJhci5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBvcmRlcjogNSxcbiAgICB9LFxuICAgIHN0YXR1c0Jhcktlcm5lbEluZm86IHtcbiAgICAgIHRpdGxlOiBcIkRldGFpbGVkIGtlcm5lbCBpbmZvcm1hdGlvbiBpbiB0aGUgSHlkcm9nZW4gc3RhdHVzIGJhclwiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgbW9yZSBkZXRhaWxlZCBrZXJuZWwgaW5mb3JtYXRpb24gKGV4ZWN1dGlvbiBjb3VudCwgZXhlY3V0aW9uIHRpbWUgaWYgYXZhaWxhYmxlKSB3aWxsIGJlIHNob3duIGluIHRoZSBIeWRyb2dlbiBzdGF0dXMgYmFyLiBUaGlzIHJlcXVpcmVzIHRoZSBhYm92ZSAqKkRpc2FibGUgdGhlIEh5ZHJvZ2VuIHN0YXR1cyBiYXIqKiBzZXR0aW5nIHRvIGJlIGBmYWxzZWAgdG8gd29yay5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIG9yZGVyOiA2LFxuICAgIH0sXG4gICAgZGVidWc6IHtcbiAgICAgIHRpdGxlOiBcIkVuYWJsZSBEZWJ1ZyBNZXNzYWdlc1wiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIklmIGVuYWJsZWQsIGxvZyBkZWJ1ZyBtZXNzYWdlcyBvbnRvIHRoZSBkZXYgY29uc29sZS5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBvcmRlcjogNyxcbiAgICB9LFxuICAgIGF1dG9TY3JvbGw6IHtcbiAgICAgIHRpdGxlOiBcIkVuYWJsZSBBdXRvc2Nyb2xsXCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgSHlkcm9nZW4gd2lsbCBhdXRvbWF0aWNhbGx5IHNjcm9sbCB0byB0aGUgYm90dG9tIG9mIHRoZSByZXN1bHQgdmlldy5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIG9yZGVyOiA4LFxuICAgIH0sXG4gICAgY2VudGVyT25Nb3ZlRG93bjoge1xuICAgICAgdGl0bGU6IFwiQ2VudGVyIG9uIE1vdmUgRG93blwiLFxuICAgICAgaW5jbHVkZVRpdGxlOiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgcnVubmluZyBjZW50ZXItYW5kLW1vdmUtZG93biB3aWxsIGNlbnRlciB0aGUgc2NyZWVuIG9uIHRoZSBuZXcgbGluZVwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiA5LFxuICAgIH0sXG4gICAgd3JhcE91dHB1dDoge1xuICAgICAgdGl0bGU6IFwiRW5hYmxlIFNvZnQgV3JhcCBmb3IgT3V0cHV0XCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgeW91ciBvdXRwdXQgY29kZSBmcm9tIEh5ZHJvZ2VuIHdpbGwgYnJlYWsgbG9uZyB0ZXh0IGFuZCBpdGVtcy5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBvcmRlcjogMTAsXG4gICAgfSxcbiAgICBvdXRwdXRBcmVhRGVmYXVsdDoge1xuICAgICAgdGl0bGU6IFwiVmlldyBvdXRwdXQgaW4gdGhlIGRvY2sgYnkgZGVmYXVsdFwiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgb3V0cHV0IHdpbGwgYmUgZGlzcGxheWVkIGluIHRoZSBkb2NrIGJ5IGRlZmF1bHQgcmF0aGVyIHRoYW4gaW5saW5lXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXI6IDExLFxuICAgIH0sXG4gICAgb3V0cHV0QXJlYURvY2s6IHtcbiAgICAgIHRpdGxlOiBcIkxlYXZlIG91dHB1dCBkb2NrIG9wZW5cIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIkRvIG5vdCBjbG9zZSBkb2NrIHdoZW4gc3dpdGNoaW5nIHRvIGFuIGVkaXRvciB3aXRob3V0IGEgcnVubmluZyBrZXJuZWxcIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBvcmRlcjogMTIsXG4gICAgfSxcbiAgICBvdXRwdXRBcmVhRm9udFNpemU6IHtcbiAgICAgIHRpdGxlOiBcIk91dHB1dCBhcmVhIGZvbnRzaXplXCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246IFwiQ2hhbmdlIHRoZSBmb250c2l6ZSBvZiB0aGUgT3V0cHV0IGFyZWEuXCIsXG4gICAgICB0eXBlOiBcImludGVnZXJcIixcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgICAgb3JkZXI6IDEzLFxuICAgIH0sXG4gICAgZ2xvYmFsTW9kZToge1xuICAgICAgdGl0bGU6IFwiRW5hYmxlIEdsb2JhbCBLZXJuZWxcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIGFsbCBmaWxlcyBvZiB0aGUgc2FtZSBncmFtbWFyIHdpbGwgc2hhcmUgYSBzaW5nbGUgZ2xvYmFsIGtlcm5lbCAocmVxdWlyZXMgQXRvbSByZXN0YXJ0KVwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiAxNCxcbiAgICB9LFxuICAgIGtlcm5lbE5vdGlmaWNhdGlvbnM6IHtcbiAgICAgIHRpdGxlOiBcIkVuYWJsZSBLZXJuZWwgTm90aWZpY2F0aW9uc1wiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIk5vdGlmeSBpZiBrZXJuZWxzIHdyaXRlcyB0byBzdGRvdXQuIEJ5IGRlZmF1bHQsIGtlcm5lbCBub3RpZmljYXRpb25zIGFyZSBvbmx5IGRpc3BsYXllZCBpbiB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUuXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXI6IDE1LFxuICAgIH0sXG4gICAgc3RhcnREaXI6IHtcbiAgICAgIHRpdGxlOiBcIkRpcmVjdG9yeSB0byBzdGFydCBrZXJuZWwgaW5cIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogXCJSZXN0YXJ0IHRoZSBrZXJuZWwgZm9yIGNoYW5nZXMgdG8gdGFrZSBlZmZlY3QuXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZW51bTogW1xuICAgICAgICB7XG4gICAgICAgICAgdmFsdWU6IFwiZmlyc3RQcm9qZWN0RGlyXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGZpcnN0IHN0YXJ0ZWQgcHJvamVjdCdzIGRpcmVjdG9yeSAoZGVmYXVsdClcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHZhbHVlOiBcInByb2plY3REaXJPZkZpbGVcIixcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgcHJvamVjdCBkaXJlY3RvcnkgcmVsYXRpdmUgdG8gdGhlIGZpbGVcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHZhbHVlOiBcImRpck9mRmlsZVwiLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkN1cnJlbnQgZGlyZWN0b3J5IG9mIHRoZSBmaWxlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgZGVmYXVsdDogXCJmaXJzdFByb2plY3REaXJcIixcbiAgICAgIG9yZGVyOiAxNixcbiAgICB9LFxuICAgIGxhbmd1YWdlTWFwcGluZ3M6IHtcbiAgICAgIHRpdGxlOiBcIkxhbmd1YWdlIE1hcHBpbmdzXCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdDdXN0b20gQXRvbSBncmFtbWFycyBhbmQgc29tZSBrZXJuZWxzIHVzZSBub24tc3RhbmRhcmQgbGFuZ3VhZ2UgbmFtZXMuIFRoYXQgbGVhdmVzIEh5ZHJvZ2VuIHVuYWJsZSB0byBmaWd1cmUgb3V0IHdoYXQga2VybmVsIHRvIHN0YXJ0IGZvciB5b3VyIGNvZGUuIFRoaXMgZmllbGQgc2hvdWxkIGJlIGEgdmFsaWQgSlNPTiBtYXBwaW5nIGZyb20gYSBrZXJuZWwgbGFuZ3VhZ2UgbmFtZSB0byBBdG9tXFwncyBncmFtbWFyIG5hbWUgYGBgIHsgXCJrZXJuZWwgbmFtZVwiOiBcImdyYW1tYXIgbmFtZVwiIH0gYGBgLiBGb3IgZXhhbXBsZSBgYGAgeyBcInNjYWxhMjExXCI6IFwic2NhbGFcIiwgXCJqYXZhc2NyaXB0XCI6IFwiYmFiZWwgZXM2IGphdmFzY3JpcHRcIiwgXCJweXRob25cIjogXCJtYWdpY3B5dGhvblwiIH0gYGBgLicsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogJ3sgXCJweXRob25cIjogXCJtYWdpY3B5dGhvblwiIH0nLFxuICAgICAgb3JkZXI6IDE3LFxuICAgIH0sXG4gICAgc3RhcnR1cENvZGU6IHtcbiAgICAgIHRpdGxlOiBcIlN0YXJ0dXAgQ29kZVwiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnVGhpcyBjb2RlIHdpbGwgYmUgZXhlY3V0ZWQgb24ga2VybmVsIHN0YXJ0dXAuIEZvcm1hdDogYHtcImtlcm5lbFwiOiBcInlvdXIgY29kZSBcXFxcbm1vcmUgY29kZVwifWAuIEV4YW1wbGU6IGB7XCJQeXRob24gMlwiOiBcIiVtYXRwbG90bGliIGlubGluZVwifWAnLFxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwie31cIixcbiAgICAgIG9yZGVyOiAxOCxcbiAgICB9LFxuICAgIGdhdGV3YXlzOiB7XG4gICAgICB0aXRsZTogXCJLZXJuZWwgR2F0ZXdheXNcIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ0h5ZHJvZ2VuIGNhbiBjb25uZWN0IHRvIHJlbW90ZSBub3RlYm9vayBzZXJ2ZXJzIGFuZCBrZXJuZWwgZ2F0ZXdheXMuIEVhY2ggZ2F0ZXdheSBuZWVkcyBhdCBtaW5pbXVtIGEgbmFtZSBhbmQgYSB2YWx1ZSBmb3Igb3B0aW9ucy5iYXNlVXJsLiBUaGUgb3B0aW9ucyBhcmUgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBganVweXRlci1qcy1zZXJ2aWNlc2AgbnBtIHBhY2thZ2UsIHdoaWNoIGluY2x1ZGVzIGRvY3VtZW50YXRpb24gZm9yIGFkZGl0aW9uYWwgZmllbGRzLiBFeGFtcGxlIHZhbHVlOiBgYGAgW3sgXCJuYW1lXCI6IFwiUmVtb3RlIG5vdGVib29rXCIsIFwib3B0aW9uc1wiOiB7IFwiYmFzZVVybFwiOiBcImh0dHA6Ly9teXNpdGUuY29tOjg4ODhcIiB9IH1dIGBgYCcsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCJbXVwiLFxuICAgICAgb3JkZXI6IDE5LFxuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb25maWc7XG4iXX0=