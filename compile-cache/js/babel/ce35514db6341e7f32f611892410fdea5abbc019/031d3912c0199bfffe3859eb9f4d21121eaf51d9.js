Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _atomJasmine3TestRunner = require("atom-jasmine3-test-runner");

var _packageJson = require("../package.json");

var _packageJson2 = _interopRequireDefault(_packageJson);

// https://github.com/UziTech/atom-jasmine3-test-runner#api
"use babel";
exports["default"] = (0, _atomJasmine3TestRunner.createRunner)({
  testPackages: Array.from(_packageJson2["default"]["package-deps"]),
  timeReporter: true,
  // Extra Packages
  specHelper: {
    atom: true,
    attachToDom: true,
    ci: true,
    customMatchers: true,
    jasmineFocused: false,
    jasmineJson: false,
    jasminePass: false,
    jasmineShouldFail: false,
    jasmineTagged: false,
    mockClock: true,
    mockLocalStorage: false,
    profile: true,
    set: false,
    unspy: false
  }
});
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9hdG9tLWlkZS1iYXNlL3NwZWMvcnVubmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQ0FDNkIsMkJBQTJCOzsyQkFDeEMsaUJBQWlCOzs7OztBQUZqQyxXQUFXLENBQUE7cUJBS0ksMENBQWE7QUFDMUIsY0FBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQUksY0FBYyxDQUFDLENBQUM7QUFDN0MsY0FBWSxFQUFFLElBQUk7O0FBRWxCLFlBQVUsRUFBRTtBQUNWLFFBQUksRUFBRSxJQUFJO0FBQ1YsZUFBVyxFQUFFLElBQUk7QUFDakIsTUFBRSxFQUFFLElBQUk7QUFDUixrQkFBYyxFQUFFLElBQUk7QUFDcEIsa0JBQWMsRUFBRSxLQUFLO0FBQ3JCLGVBQVcsRUFBRSxLQUFLO0FBQ2xCLGVBQVcsRUFBRSxLQUFLO0FBQ2xCLHFCQUFpQixFQUFFLEtBQUs7QUFDeEIsaUJBQWEsRUFBRSxLQUFLO0FBQ3BCLGFBQVMsRUFBRSxJQUFJO0FBQ2Ysb0JBQWdCLEVBQUUsS0FBSztBQUN2QixXQUFPLEVBQUUsSUFBSTtBQUNiLE9BQUcsRUFBRSxLQUFLO0FBQ1YsU0FBSyxFQUFFLEtBQUs7R0FDYjtDQUNGLENBQUMiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL2F0b20taWRlLWJhc2Uvc3BlYy9ydW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiXG5pbXBvcnQgeyBjcmVhdGVSdW5uZXIgfSBmcm9tIFwiYXRvbS1qYXNtaW5lMy10ZXN0LXJ1bm5lclwiXG5pbXBvcnQgcGtnIGZyb20gXCIuLi9wYWNrYWdlLmpzb25cIlxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vVXppVGVjaC9hdG9tLWphc21pbmUzLXRlc3QtcnVubmVyI2FwaVxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUnVubmVyKHtcbiAgdGVzdFBhY2thZ2VzOiBBcnJheS5mcm9tKHBrZ1tcInBhY2thZ2UtZGVwc1wiXSksXG4gIHRpbWVSZXBvcnRlcjogdHJ1ZSxcbiAgLy8gRXh0cmEgUGFja2FnZXNcbiAgc3BlY0hlbHBlcjoge1xuICAgIGF0b206IHRydWUsXG4gICAgYXR0YWNoVG9Eb206IHRydWUsXG4gICAgY2k6IHRydWUsXG4gICAgY3VzdG9tTWF0Y2hlcnM6IHRydWUsXG4gICAgamFzbWluZUZvY3VzZWQ6IGZhbHNlLFxuICAgIGphc21pbmVKc29uOiBmYWxzZSxcbiAgICBqYXNtaW5lUGFzczogZmFsc2UsXG4gICAgamFzbWluZVNob3VsZEZhaWw6IGZhbHNlLFxuICAgIGphc21pbmVUYWdnZWQ6IGZhbHNlLFxuICAgIG1vY2tDbG9jazogdHJ1ZSxcbiAgICBtb2NrTG9jYWxTdG9yYWdlOiBmYWxzZSxcbiAgICBwcm9maWxlOiB0cnVlLFxuICAgIHNldDogZmFsc2UsXG4gICAgdW5zcHk6IGZhbHNlLFxuICB9LFxufSlcbiJdfQ==