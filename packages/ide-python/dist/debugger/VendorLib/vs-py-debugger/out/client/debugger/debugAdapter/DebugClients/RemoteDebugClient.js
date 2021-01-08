"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const RemoteDebugServerv2_1 = require("../DebugServers/RemoteDebugServerv2");

const DebugClient_1 = require("./DebugClient");

class RemoteDebugClient extends DebugClient_1.DebugClient {
  // tslint:disable-next-line:no-any
  constructor(args, debugSession) {
    super(args, debugSession);
  }

  CreateDebugServer() {
    this.debugServer = new RemoteDebugServerv2_1.RemoteDebugServerV2(this.debugSession, this.args);
    return this.debugServer;
  }

  get DebugType() {
    return DebugClient_1.DebugType.Remote;
  }

  Stop() {
    if (this.debugServer) {
      this.debugServer.Stop();
      this.debugServer = undefined;
    }
  }

}

exports.RemoteDebugClient = RemoteDebugClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlbW90ZURlYnVnQ2xpZW50LmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiUmVtb3RlRGVidWdTZXJ2ZXJ2Ml8xIiwicmVxdWlyZSIsIkRlYnVnQ2xpZW50XzEiLCJSZW1vdGVEZWJ1Z0NsaWVudCIsIkRlYnVnQ2xpZW50IiwiY29uc3RydWN0b3IiLCJhcmdzIiwiZGVidWdTZXNzaW9uIiwiQ3JlYXRlRGVidWdTZXJ2ZXIiLCJkZWJ1Z1NlcnZlciIsIlJlbW90ZURlYnVnU2VydmVyVjIiLCJEZWJ1Z1R5cGUiLCJSZW1vdGUiLCJTdG9wIiwidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFQyxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxNQUFNQyxxQkFBcUIsR0FBR0MsT0FBTyxDQUFDLHFDQUFELENBQXJDOztBQUNBLE1BQU1DLGFBQWEsR0FBR0QsT0FBTyxDQUFDLGVBQUQsQ0FBN0I7O0FBQ0EsTUFBTUUsaUJBQU4sU0FBZ0NELGFBQWEsQ0FBQ0UsV0FBOUMsQ0FBMEQ7QUFDdEQ7QUFDQUMsRUFBQUEsV0FBVyxDQUFDQyxJQUFELEVBQU9DLFlBQVAsRUFBcUI7QUFDNUIsVUFBTUQsSUFBTixFQUFZQyxZQUFaO0FBQ0g7O0FBQ0RDLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2hCLFNBQUtDLFdBQUwsR0FBbUIsSUFBSVQscUJBQXFCLENBQUNVLG1CQUExQixDQUE4QyxLQUFLSCxZQUFuRCxFQUFpRSxLQUFLRCxJQUF0RSxDQUFuQjtBQUNBLFdBQU8sS0FBS0csV0FBWjtBQUNIOztBQUNELE1BQUlFLFNBQUosR0FBZ0I7QUFDWixXQUFPVCxhQUFhLENBQUNTLFNBQWQsQ0FBd0JDLE1BQS9CO0FBQ0g7O0FBQ0RDLEVBQUFBLElBQUksR0FBRztBQUNILFFBQUksS0FBS0osV0FBVCxFQUFzQjtBQUNsQixXQUFLQSxXQUFMLENBQWlCSSxJQUFqQjtBQUNBLFdBQUtKLFdBQUwsR0FBbUJLLFNBQW5CO0FBQ0g7QUFDSjs7QUFqQnFEOztBQW1CMURoQixPQUFPLENBQUNLLGlCQUFSLEdBQTRCQSxpQkFBNUIiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFJlbW90ZURlYnVnU2VydmVydjJfMSA9IHJlcXVpcmUoXCIuLi9EZWJ1Z1NlcnZlcnMvUmVtb3RlRGVidWdTZXJ2ZXJ2MlwiKTtcbmNvbnN0IERlYnVnQ2xpZW50XzEgPSByZXF1aXJlKFwiLi9EZWJ1Z0NsaWVudFwiKTtcbmNsYXNzIFJlbW90ZURlYnVnQ2xpZW50IGV4dGVuZHMgRGVidWdDbGllbnRfMS5EZWJ1Z0NsaWVudCB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGNvbnN0cnVjdG9yKGFyZ3MsIGRlYnVnU2Vzc2lvbikge1xuICAgICAgICBzdXBlcihhcmdzLCBkZWJ1Z1Nlc3Npb24pO1xuICAgIH1cbiAgICBDcmVhdGVEZWJ1Z1NlcnZlcigpIHtcbiAgICAgICAgdGhpcy5kZWJ1Z1NlcnZlciA9IG5ldyBSZW1vdGVEZWJ1Z1NlcnZlcnYyXzEuUmVtb3RlRGVidWdTZXJ2ZXJWMih0aGlzLmRlYnVnU2Vzc2lvbiwgdGhpcy5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVidWdTZXJ2ZXI7XG4gICAgfVxuICAgIGdldCBEZWJ1Z1R5cGUoKSB7XG4gICAgICAgIHJldHVybiBEZWJ1Z0NsaWVudF8xLkRlYnVnVHlwZS5SZW1vdGU7XG4gICAgfVxuICAgIFN0b3AoKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnU2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnU2VydmVyLlN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuZGVidWdTZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLlJlbW90ZURlYnVnQ2xpZW50ID0gUmVtb3RlRGVidWdDbGllbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1SZW1vdGVEZWJ1Z0NsaWVudC5qcy5tYXAiXX0=