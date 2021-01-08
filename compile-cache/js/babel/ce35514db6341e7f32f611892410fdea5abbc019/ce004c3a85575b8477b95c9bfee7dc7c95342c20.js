Object.defineProperty(exports, '__esModule', {
  value: true
});
/** @babel */

exports['default'] = {

  defaultLocation: {
    title: 'Default Location',
    description: 'Where to open new terminals. They will open in the bottom pane, by default.',
    type: 'string',
    'default': 'bottom',
    'enum': [{ value: 'bottom', description: 'Bottom' }, { value: 'center', description: 'Center' }, { value: 'left', description: 'Left' }, { value: 'right', description: 'Right' }]
  },

  fontFamily: {
    title: 'Font Family',
    description: 'The name of the font family used for terminal text. By default, this matches the editor font family.',
    type: 'string',
    'default': ''
  },

  matchTheme: {
    title: 'Match Theme',
    description: 'When enabled, the look of the terminal will match the currently configured Atom theme.',
    type: 'boolean',
    'default': true
  },

  shellSettings: {
    type: 'object',
    properties: {

      sanitizeEnvironment: {
        title: 'Sanitized Environment Variables',
        description: 'Specify variables to remove from the environment in the terminal session. For example, the default behavior is to unset `NODE_ENV`, since Atom sets this to "production" on launch and may not be what you want when developing a Node application.',
        type: 'array',
        'default': ['NODE_ENV']
      },

      shellPath: {
        title: 'Shell Path',
        description: 'Path to your shell application. Uses the $SHELL environment variable by default on *NIX and %COMSPEC% on Windows.',
        type: 'string',
        'default': (function () {
          if (process.platform === 'win32') {
            return process.env.COMSPEC || 'cmd.exe';
          } else {
            return process.env.SHELL || '/bin/bash';
          }
        })()
      },

      shellArgs: {
        title: 'Shell Arguments',
        description: 'Arguments to send to the shell application on launch. Sends "--login" by default on *NIX and nothing on Windows.',
        type: 'string',
        'default': (function () {
          if (process.platform !== 'win32' && process.env.SHELL === '/bin/bash') {
            return '--login';
          } else {
            return '';
          }
        })()
      }

    }
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC10YWIvbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFFZTs7QUFFYixpQkFBZSxFQUFFO0FBQ2YsU0FBSyxFQUFFLGtCQUFrQjtBQUN6QixlQUFXLEVBQUUsNkVBQTZFO0FBQzFGLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxRQUFRO0FBQ2pCLFlBQU0sQ0FDSixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxFQUMxQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxFQUMxQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxFQUN0QyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUN6QztHQUNGOztBQUVELFlBQVUsRUFBRTtBQUNWLFNBQUssRUFBRSxhQUFhO0FBQ3BCLGVBQVcsRUFBRSxzR0FBc0c7QUFDbkgsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLEVBQUU7R0FDWjs7QUFFRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsYUFBYTtBQUNwQixlQUFXLEVBQUUsd0ZBQXdGO0FBQ3JHLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7O0FBRUQsZUFBYSxFQUFFO0FBQ2IsUUFBSSxFQUFFLFFBQVE7QUFDZCxjQUFVLEVBQUU7O0FBRVYseUJBQW1CLEVBQUU7QUFDbkIsYUFBSyxFQUFFLGlDQUFpQztBQUN4QyxtQkFBVyxFQUFFLHFQQUFxUDtBQUNsUSxZQUFJLEVBQUUsT0FBTztBQUNiLG1CQUFTLENBQUUsVUFBVSxDQUFFO09BQ3hCOztBQUVELGVBQVMsRUFBRTtBQUNULGFBQUssRUFBRSxZQUFZO0FBQ25CLG1CQUFXLEVBQUUsbUhBQW1IO0FBQ2hJLFlBQUksRUFBRSxRQUFRO0FBQ2QsbUJBQVMsQ0FBQyxZQUFNO0FBQ2QsY0FBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUNoQyxtQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUM7V0FDekMsTUFBTTtBQUNMLG1CQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQztXQUN6QztTQUNGLENBQUEsRUFBRztPQUNMOztBQUVELGVBQVMsRUFBRTtBQUNULGFBQUssRUFBRSxpQkFBaUI7QUFDeEIsbUJBQVcsRUFBRSxrSEFBa0g7QUFDL0gsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxDQUFDLFlBQU07QUFDZCxjQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtBQUNyRSxtQkFBTyxTQUFTLENBQUM7V0FDbEIsTUFBTTtBQUNMLG1CQUFPLEVBQUUsQ0FBQztXQUNYO1NBQ0YsQ0FBQSxFQUFHO09BQ0w7O0tBRUY7R0FDRjs7Q0FFRiIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvdGVybWluYWwtdGFiL2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBkZWZhdWx0TG9jYXRpb246IHtcbiAgICB0aXRsZTogJ0RlZmF1bHQgTG9jYXRpb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hlcmUgdG8gb3BlbiBuZXcgdGVybWluYWxzLiBUaGV5IHdpbGwgb3BlbiBpbiB0aGUgYm90dG9tIHBhbmUsIGJ5IGRlZmF1bHQuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnYm90dG9tJyxcbiAgICBlbnVtOiBbXG4gICAgICB7IHZhbHVlOiAnYm90dG9tJywgZGVzY3JpcHRpb246ICdCb3R0b20nIH0sXG4gICAgICB7IHZhbHVlOiAnY2VudGVyJywgZGVzY3JpcHRpb246ICdDZW50ZXInIH0sXG4gICAgICB7IHZhbHVlOiAnbGVmdCcsIGRlc2NyaXB0aW9uOiAnTGVmdCcgfSxcbiAgICAgIHsgdmFsdWU6ICdyaWdodCcsIGRlc2NyaXB0aW9uOiAnUmlnaHQnIH1cbiAgICBdXG4gIH0sXG5cbiAgZm9udEZhbWlseToge1xuICAgIHRpdGxlOiAnRm9udCBGYW1pbHknLFxuICAgIGRlc2NyaXB0aW9uOiAnVGhlIG5hbWUgb2YgdGhlIGZvbnQgZmFtaWx5IHVzZWQgZm9yIHRlcm1pbmFsIHRleHQuIEJ5IGRlZmF1bHQsIHRoaXMgbWF0Y2hlcyB0aGUgZWRpdG9yIGZvbnQgZmFtaWx5LicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJydcbiAgfSxcblxuICBtYXRjaFRoZW1lOiB7XG4gICAgdGl0bGU6ICdNYXRjaCBUaGVtZScsXG4gICAgZGVzY3JpcHRpb246ICdXaGVuIGVuYWJsZWQsIHRoZSBsb29rIG9mIHRoZSB0ZXJtaW5hbCB3aWxsIG1hdGNoIHRoZSBjdXJyZW50bHkgY29uZmlndXJlZCBBdG9tIHRoZW1lLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcblxuICBzaGVsbFNldHRpbmdzOiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICBzYW5pdGl6ZUVudmlyb25tZW50OiB7XG4gICAgICAgIHRpdGxlOiAnU2FuaXRpemVkIEVudmlyb25tZW50IFZhcmlhYmxlcycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU3BlY2lmeSB2YXJpYWJsZXMgdG8gcmVtb3ZlIGZyb20gdGhlIGVudmlyb25tZW50IGluIHRoZSB0ZXJtaW5hbCBzZXNzaW9uLiBGb3IgZXhhbXBsZSwgdGhlIGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gdW5zZXQgYE5PREVfRU5WYCwgc2luY2UgQXRvbSBzZXRzIHRoaXMgdG8gXCJwcm9kdWN0aW9uXCIgb24gbGF1bmNoIGFuZCBtYXkgbm90IGJlIHdoYXQgeW91IHdhbnQgd2hlbiBkZXZlbG9waW5nIGEgTm9kZSBhcHBsaWNhdGlvbi4nLFxuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBkZWZhdWx0OiBbICdOT0RFX0VOVicgXVxuICAgICAgfSxcblxuICAgICAgc2hlbGxQYXRoOiB7XG4gICAgICAgIHRpdGxlOiAnU2hlbGwgUGF0aCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUGF0aCB0byB5b3VyIHNoZWxsIGFwcGxpY2F0aW9uLiBVc2VzIHRoZSAkU0hFTEwgZW52aXJvbm1lbnQgdmFyaWFibGUgYnkgZGVmYXVsdCBvbiAqTklYIGFuZCAlQ09NU1BFQyUgb24gV2luZG93cy4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogKCgpID0+IHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MuZW52LkNPTVNQRUMgfHwgJ2NtZC5leGUnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvY2Vzcy5lbnYuU0hFTEwgfHwgJy9iaW4vYmFzaCc7XG4gICAgICAgICAgfVxuICAgICAgICB9KSgpXG4gICAgICB9LFxuXG4gICAgICBzaGVsbEFyZ3M6IHtcbiAgICAgICAgdGl0bGU6ICdTaGVsbCBBcmd1bWVudHMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FyZ3VtZW50cyB0byBzZW5kIHRvIHRoZSBzaGVsbCBhcHBsaWNhdGlvbiBvbiBsYXVuY2guIFNlbmRzIFwiLS1sb2dpblwiIGJ5IGRlZmF1bHQgb24gKk5JWCBhbmQgbm90aGluZyBvbiBXaW5kb3dzLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBkZWZhdWx0OiAoKCkgPT4ge1xuICAgICAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInICYmIHByb2Nlc3MuZW52LlNIRUxMID09PSAnL2Jpbi9iYXNoJykge1xuICAgICAgICAgICAgcmV0dXJuICctLWxvZ2luJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkoKVxuICAgICAgfVxuXG4gICAgfVxuICB9LFxuXG59O1xuIl19