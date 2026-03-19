type TextElement = HTMLTextAreaElement | HTMLInputElement
export class TextInputBinder {
  element: TextElement;
  nextPositions: number[];
  history: [number, string][];
  constructor(element: TextElement) {
    this.element = element;
    this.nextPositions = [];
    this.history = [];
  }

  // 插入文本
  /**
   * @param text 要插入的文本
   * @param backspaces 往前删除多少个字符
   * @param cursorOffset 光标偏移多少个字符，负数往前，正数往后
   */
  insertText(text: string, backspaces = 0, cursorOffset = 0): void {
    const ed = this.element;
    const selStart = ed.selectionStart;
    const selEnd = ed.selectionEnd;
    const preText = this.preText;
    let postText = this.postText;

    // 插入文本
    ed.value = preText.slice(0, preText.length - backspaces) + text + postText;
    // 同步光标的框选位置
    const offset = - backspaces + text.length + cursorOffset
    ed.selectionStart = selStart + offset;
    ed.selectionEnd = selEnd + offset;
    this.nextPositions = this.nextPositions.map(i => i + offset)
    // this.history.push([ed.selectionStart, ed.value]);
    // 触发 oninput
    ed.dispatchEvent(new Event('input'));
  }
  // 光标前的文本
  get preText(): string {
    return this.element.value.slice(0, this.element.selectionStart)
  }
  // 光标后的文本
  get postText(): string {
    return this.element.value.slice(this.element.selectionStart)
  }
  // 前一行
  get lastLine(): string {
    return this.preText.split('\n').slice(-1)[0]
  }
  get lastLineIndent(): string {
    return this.lastLine.match(/^ */)?.[0] ?? ''
  }
  get position() {
    return this.element.selectionStart;
  }
  goNext() {
    this.moveTo(this.nextPositions.shift())
  }

  get selectionRange() {
    return this.element.selectionEnd - this.element.selectionStart;
  }

  get selectedText() {
    return this.element.value.slice(this.element.selectionStart, this.element.selectionEnd)
  }
  get selectedLines() {
    return this.element.value.slice(this.element.selectionStart, this.element.selectionEnd).split("\n")
  }
  moveTo(position: number) {
    const selRange = this.element.selectionEnd - this.element.selectionStart;
    this.element.selectionStart = position;
    this.element.selectionEnd = position + selRange;
  }

  undo(): [number, string] | void {
    if(this.history.length > 0) {
      const [pos, text] = this.history.pop()
      this.element.value = text;
      this.element.selectionStart = pos;
      this.element.selectionEnd = pos;
      this.element.dispatchEvent(new Event('input'))
      this.nextPositions = [];
      return [pos, text]
    }
  }

}

export function bindTextInput(element: TextElement): TextInputBinder {
  return new TextInputBinder(element);
}