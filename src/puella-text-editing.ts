type TextElement = HTMLTextAreaElement | HTMLInputElement

/**
 * PuellaTextEditing
 *
 * 使用
 * ```ts
 *   // 绑定可编辑元素
 *   const editor = document.getElementById('editor')
 *   const editing = new PuellaTextEditing(editor)
 *   // 插入文本
 *   editing.insertText('hello, world')
 *   // 退格覆写
 *   editing.insertText('alice', 5)
 *   // 退格覆写，完成后，光标往前移动5格。
 *   editing.insertText('carol', 5, -5)
 * ```
 */
export class PuellaTextEditing {
  element: TextElement;
  nextPositions: number[];
  // 历史文本
  history: [number, string][];
  // 最后一次输入的内容
  lastInput: string;

  constructor(element: TextElement) {
    this.element = element;
    this.lastInput = '';
    element.addEventListener('input', (event) => {
      this.lastInput = event.data;
    })
    this.nextPositions = [];
    this.history = [];
  }

  /**
   * @description 插入文本，用于 各种短语的即时插入
   * @example
   *   使用示例
   *   ```js
   *   editor.addEventListener('keydown', event => {
   *     if(event.key == "Tab") {
   *       editing.insertText("function () {\n  \n}\n", 7, -11)
   *     }
   *   })
   *   ```
   * @param text 要插入的文本
   * @param backspaces 往前删除多少个字符
   * @param cursorEndOffset 插入结束后，光标偏移多少个字符，负数往前，正数往后
   */
  insertText(text: string, backspaces = 0, cursorEndOffset = 0, options = { cover: false }): void {
    const ed = this.element;
    const selStart = ed.selectionStart;
    const selEnd = ed.selectionEnd;
    const preText = this.preText;
    let postText = this.postText;

    // 插入文本

    ed.value = preText.slice(0, preText.length - backspaces) + text + postText.slice(options.cover ? (text.length - backspaces) : 0);
    // ed.setRangeText(text, selStart - backspaces, selStart)
    // // 同步光标的框选位置
    const offset = - backspaces + text.length + cursorEndOffset
    ed.selectionStart = selStart + offset;
    ed.selectionEnd = selEnd + offset;
    this.nextPositions = this.nextPositions.map(i => i + offset)
    this.history.push([ed.selectionStart, ed.value]);
    // // 触发 oninput
    ed.dispatchEvent(new Event('input'));
  }

  // get text behind cursor
  // 光标前的文本
  get preText(): string {
    return this.element.value.slice(0, this.element.selectionStart)
  }

  // get text after cursor
  // 光标后的文本
  get postText(): string {
    return this.element.value.slice(this.element.selectionStart)
  }

  // text of the Current-Line behind Cursor
  // 当前行光标前的文本
  get lastLine(): string {
    return this.preText.split('\n').slice(-1)[0]
  }

  get lastLineIndent(): string {
    return this.lastLine.match(/^ */)?.[0] ?? ''
  }
  get position() {
    return this.element.selectionStart;
  }

  // go to next set-position, will delete set
  // 光标移到下一处
  goNext() {
    this.moveTo(this.nextPositions.shift())
  }

  // 选区大小
  get selectionRange() {
    return this.element.selectionEnd - this.element.selectionStart;
  }

  // 选取文本
  get selectedText() {
    return this.element.value.slice(this.element.selectionStart, this.element.selectionEnd)
  }

  get selectedLines() {
    return this.element.value.slice(this.element.selectionStart, this.element.selectionEnd).split("\n")
  }

  select(start = 0, length = 0) {
    this.element.selectionStart = start;
    this.element.selectionEnd = start + length;
  }
  // 移动光标到绝对位置
  moveTo(position: number) {
    const selRange = this.element.selectionEnd - this.element.selectionStart;
    this.element.selectionStart = position;
    this.element.selectionEnd = position + selRange;
  }

  // move the cursor position relative, -d move left, +d move right
  // 移动光标相对位置，负数往前，负数往后。
  moveCaret(offset: number = 0) {
    this.element.selectionStart += offset;
  }
  caretMoveLeft(offset: number = 1) {
    this.element.selectionStart -= offset;
  }
  caretMoveRight(offset: number = 1) {
    this.element.selectionStart += offset;
  }
  caretMoveUp(offset: number = 1) {
    this.element.selectionStart += offset;
  }
  caretMoveDown(offset: number = 1) {
    this.element.selectionStart += offset;
  }

  /**
   * 撤回
   */
  undo(): [number, string] | void {
    if(this.history.length > 0) {
      const [pos, text] = this.history.pop();
      // const [pos, text] = this.history.at(this.historyIndex)
      this.element.value = text;
      this.element.selectionStart = pos;
      this.element.selectionEnd = pos;
      this.element.dispatchEvent(new Event('input'))
      this.nextPositions = [];
      return [pos, text]
    }
  }

}

export function puellaEditing(element: TextElement): PuellaTextEditing {
  return new PuellaTextEditing(element);
}