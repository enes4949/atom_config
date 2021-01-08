Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** @babel */

var _atomJasmine3TestRunner = require("atom-jasmine3-test-runner");

var _packageJson = require("../package.json");

var _packageJson2 = _interopRequireDefault(_packageJson);

// https://github.com/UziTech/atom-jasmine3-test-runner#api
exports["default"] = (0, _atomJasmine3TestRunner.createRunner)({
  testPackages: Array.from(_packageJson2["default"]["package-deps"]),
  timeReporter: true,
  specHelper: {
    atom: true,
    ci: true,
    attachToDom: true,
    // Extra Packages
    customMatchers: true,
    jasmineFocused: false,
    jasmineJson: false,
    jasminePass: false,
    jasmineShouldFail: false,
    jasmineTagged: false,
    mockClock: true,
    mockLocalStorage: false,
    profile: true,
    unspy: false
  }
});
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9hdG9tLWlkZS1kZWJ1Z2dlci9zcGVjL3J1bm5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQ0FDNkIsMkJBQTJCOzsyQkFDeEMsaUJBQWlCOzs7OztxQkFHbEIsMENBQWE7QUFDMUIsY0FBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQUksY0FBYyxDQUFDLENBQUM7QUFDN0MsY0FBWSxFQUFFLElBQUk7QUFDbEIsWUFBVSxFQUFFO0FBQ1YsUUFBSSxFQUFFLElBQUk7QUFDVixNQUFFLEVBQUUsSUFBSTtBQUNSLGVBQVcsRUFBRSxJQUFJOztBQUVqQixrQkFBYyxFQUFFLElBQUk7QUFDcEIsa0JBQWMsRUFBRSxLQUFLO0FBQ3JCLGVBQVcsRUFBRSxLQUFLO0FBQ2xCLGVBQVcsRUFBRSxLQUFLO0FBQ2xCLHFCQUFpQixFQUFFLEtBQUs7QUFDeEIsaUJBQWEsRUFBRSxLQUFLO0FBQ3BCLGFBQVMsRUFBRSxJQUFJO0FBQ2Ysb0JBQWdCLEVBQUUsS0FBSztBQUN2QixXQUFPLEVBQUUsSUFBSTtBQUNiLFNBQUssRUFBRSxLQUFLO0dBQ2I7Q0FDRixDQUFDIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9hdG9tLWlkZS1kZWJ1Z2dlci9zcGVjL3J1bm5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbmltcG9ydCB7IGNyZWF0ZVJ1bm5lciB9IGZyb20gXCJhdG9tLWphc21pbmUzLXRlc3QtcnVubmVyXCJcbmltcG9ydCBwa2cgZnJvbSBcIi4uL3BhY2thZ2UuanNvblwiXG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9VemlUZWNoL2F0b20tamFzbWluZTMtdGVzdC1ydW5uZXIjYXBpXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdW5uZXIoe1xuICB0ZXN0UGFja2FnZXM6IEFycmF5LmZyb20ocGtnW1wicGFja2FnZS1kZXBzXCJdKSxcbiAgdGltZVJlcG9ydGVyOiB0cnVlLFxuICBzcGVjSGVscGVyOiB7XG4gICAgYXRvbTogdHJ1ZSxcbiAgICBjaTogdHJ1ZSxcbiAgICBhdHRhY2hUb0RvbTogdHJ1ZSxcbiAgICAvLyBFeHRyYSBQYWNrYWdlc1xuICAgIGN1c3RvbU1hdGNoZXJzOiB0cnVlLFxuICAgIGphc21pbmVGb2N1c2VkOiBmYWxzZSxcbiAgICBqYXNtaW5lSnNvbjogZmFsc2UsXG4gICAgamFzbWluZVBhc3M6IGZhbHNlLFxuICAgIGphc21pbmVTaG91bGRGYWlsOiBmYWxzZSxcbiAgICBqYXNtaW5lVGFnZ2VkOiBmYWxzZSxcbiAgICBtb2NrQ2xvY2s6IHRydWUsXG4gICAgbW9ja0xvY2FsU3RvcmFnZTogZmFsc2UsXG4gICAgcHJvZmlsZTogdHJ1ZSxcbiAgICB1bnNweTogZmFsc2UsXG4gIH0sXG59KVxuIl19