function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _libTerminalSession = require('../lib/terminal-session');

var _libTerminalSession2 = _interopRequireDefault(_libTerminalSession);

var _xterm = require('xterm');

describe('TerminalSession', function () {

  var testSession = undefined;

  beforeEach(function () {
    testSession = new _libTerminalSession2['default']();
  });

  afterEach(function () {
    testSession.destroy();
  });

  describe('xterm', function () {

    it('instance is initialized', function () {
      expect(testSession.xterm).not.toBe(null);
      expect(testSession.xterm).toBeInstanceOf(_xterm.Terminal);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC10YWIvc3BlYy90ZXJtaW5hbC1zZXNzaW9uLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztrQ0FFNEIseUJBQXlCOzs7O3FCQUNuQixPQUFPOztBQUV6QyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsWUFBTTs7QUFFaEMsTUFBSSxXQUFXLFlBQUEsQ0FBQzs7QUFFaEIsWUFBVSxDQUFDLFlBQU07QUFDZixlQUFXLEdBQUcscUNBQXFCLENBQUM7R0FDckMsQ0FBQyxDQUFDOztBQUVILFdBQVMsQ0FBQyxZQUFNO0FBQ2QsZUFBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsT0FBTyxFQUFFLFlBQU07O0FBRXRCLE1BQUUsQ0FBQyx5QkFBeUIsRUFBRSxZQUFNO0FBQ2xDLFlBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxZQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsaUJBQU8sQ0FBQztLQUNqRCxDQUFDLENBQUM7R0FFSixDQUFDLENBQUM7Q0FFSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXRhYi9zcGVjL3Rlcm1pbmFsLXNlc3Npb24tc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IFRlcm1pbmFsU2Vzc2lvbiBmcm9tICcuLi9saWIvdGVybWluYWwtc2Vzc2lvbic7XG5pbXBvcnQgeyBUZXJtaW5hbCBhcyBYdGVybSB9IGZyb20gJ3h0ZXJtJztcblxuZGVzY3JpYmUoJ1Rlcm1pbmFsU2Vzc2lvbicsICgpID0+IHtcblxuICBsZXQgdGVzdFNlc3Npb247XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdGVzdFNlc3Npb24gPSBuZXcgVGVybWluYWxTZXNzaW9uKCk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgdGVzdFNlc3Npb24uZGVzdHJveSgpO1xuICB9KTtcblxuICBkZXNjcmliZSgneHRlcm0nLCAoKSA9PiB7XG5cbiAgICBpdCgnaW5zdGFuY2UgaXMgaW5pdGlhbGl6ZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QodGVzdFNlc3Npb24ueHRlcm0pLm5vdC50b0JlKG51bGwpO1xuICAgICAgZXhwZWN0KHRlc3RTZXNzaW9uLnh0ZXJtKS50b0JlSW5zdGFuY2VPZihYdGVybSk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pO1xuIl19