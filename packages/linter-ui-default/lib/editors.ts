import { CompositeDisposable } from 'atom'
import type { TextEditor } from 'atom'
import Editor from './editor'
import { $file, getEditorsMap, filterMessages } from './helpers'
import type { LinterMessage, MessagesPatch, EditorsPatch } from './types'

export default class Editors {
  editors: Set<Editor> = new Set()
  messages: Array<LinterMessage> = []
  firstRender: boolean = true
  subscriptions: CompositeDisposable = new CompositeDisposable()

  constructor() {
    this.subscriptions.add(
      atom.workspace.observeTextEditors(textEditor => {
        this.getEditor(textEditor)
      }),
    )
    this.subscriptions.add(
      atom.workspace.getCenter().observeActivePaneItem(paneItem => {
        this.editors.forEach(editor => {
          if (editor.textEditor !== paneItem) {
            editor.removeTooltip()
          }
        })
      }),
    )
  }
  isFirstRender(): boolean {
    return this.firstRender
  }
  update({ messages, added, removed }: MessagesPatch) {
    this.messages = messages
    this.firstRender = false

    const { editorsMap, filePaths } = getEditorsMap(this)
    added.forEach(function (message) {
      if (!message || !message.location) {
        return
      }
      const filePath = $file(message)
      if (filePath && editorsMap.has(filePath)) {
        editorsMap.get(filePath)!.added.push(message)
      }
    })
    removed.forEach(function (message) {
      if (!message || !message.location) {
        return
      }
      const filePath = $file(message)
      if (filePath && editorsMap.has(filePath)) {
        editorsMap.get(filePath)!.removed.push(message)
      }
    })

    filePaths.forEach(function (filePath) {
      if (editorsMap.has(filePath)) {
        const { added, removed, editors } = editorsMap.get(filePath) as EditorsPatch
        if (added.length || removed.length) {
          editors.forEach(editor => editor.apply(added, removed))
        }
      }
    })
  }
  getEditor(textEditor: TextEditor): Editor {
    for (const entry of this.editors) {
      if (entry.textEditor === textEditor) {
        return entry
      }
    }
    const editor = new Editor(textEditor)
    this.editors.add(editor)
    editor.onDidDestroy(() => {
      this.editors.delete(editor)
    })
    editor.subscriptions.add(
      textEditor.onDidChangePath(() => {
        editor.dispose()
        this.getEditor(textEditor)
      }),
    )
    editor.subscriptions.add(
      textEditor.onDidChangeGrammar(() => {
        editor.dispose()
        this.getEditor(textEditor)
      }),
    )
    editor.apply(filterMessages(this.messages, textEditor.getPath()), [])
    return editor
  }
  dispose() {
    for (const entry of this.editors) {
      entry.dispose()
    }
    this.subscriptions.dispose()
  }
}
