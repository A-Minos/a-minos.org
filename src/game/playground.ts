export type PieceKind = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'
export type Shape = (0 | 1)[][]
export type Board = (PieceKind | null)[][]

export const COLUMNS = 10
export const ROWS = 12
export const colors: Record<PieceKind, string> = {
  I: '#83b6ba',
  J: '#8a9ebd',
  L: '#e89b68',
  O: '#f1ca4d',
  S: '#a4b986',
  T: '#ad99c4',
  Z: '#e58c79',
}
export const shapes: Record<PieceKind, Shape> = {
  I: [[1, 1, 1, 1]],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
}

export class PlaygroundGame {
  board: Board = []
  kind: PieceKind = 'O'
  shape: Shape = shapes.O
  next: PieceKind = 'T'
  x = 4
  y = 1
  lines = 0
  over = false
  private bag: PieceKind[] = []

  constructor() {
    this.reset()
  }

  reset() {
    this.board = Array.from({ length: ROWS }, () => Array<PieceKind | null>(COLUMNS).fill(null))
    // 预置一个中间留空的双行，让初次落块就能体验消行。
    this.board.splice(
      8,
      4,
      ['Z', 'Z', null, null, null, null, null, 'S', 'S', null],
      [null, 'Z', 'Z', null, null, null, 'L', 'L', 'S', 'S'],
      ['I', 'I', 'L', 'L', null, null, 'T', 'T', 'T', 'J'],
      ['I', 'L', 'L', 'J', null, null, 'S', 'T', 'J', 'J'],
    )
    this.kind = 'O'
    this.shape = shapes.O.map((row) => [...row])
    this.next = 'T'
    this.x = 4
    this.y = 1
    this.lines = 0
    this.over = false
    this.bag = []
  }

  fits(shape: Shape, x: number, y: number): boolean {
    return shape.every((row, dy) =>
      row.every(
        (cell, dx) =>
          !cell ||
          (x + dx >= 0 &&
            x + dx < COLUMNS &&
            y + dy >= 0 &&
            y + dy < ROWS &&
            this.board[y + dy][x + dx] === null),
      ),
    )
  }

  move(direction: -1 | 1) {
    if (!this.over && this.fits(this.shape, this.x + direction, this.y)) this.x += direction
  }

  rotate() {
    if (this.over) return
    const rotated: Shape = this.shape[0].map((_, column) =>
      this.shape.map((row) => row[column]).reverse(),
    )
    for (const offset of [0, -1, 1, -2, 2]) {
      if (this.fits(rotated, this.x + offset, this.y)) {
        this.shape = rotated
        this.x += offset
        return
      }
    }
  }

  get landingY(): number {
    let y = this.y
    while (this.fits(this.shape, this.x, y + 1)) y++
    return y
  }

  drop(): number {
    if (this.over) return 0
    this.y = this.landingY
    this.shape.forEach((row, dy) =>
      row.forEach((cell, dx) => {
        if (cell) this.board[this.y + dy][this.x + dx] = this.kind
      }),
    )
    const remaining = this.board.filter((row) => row.some((cell) => cell === null))
    const cleared = ROWS - remaining.length
    this.board = [
      ...Array.from({ length: cleared }, () => Array<PieceKind | null>(COLUMNS).fill(null)),
      ...remaining,
    ]
    this.lines += cleared
    this.kind = this.next
    this.shape = shapes[this.kind].map((row) => [...row])
    this.x = Math.floor((COLUMNS - this.shape[0].length) / 2)
    this.y = 0
    if (!this.bag.length) {
      this.bag = Object.keys(shapes) as PieceKind[]
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]
      }
    }
    this.next = this.bag.pop()!
    this.over = !this.fits(this.shape, this.x, this.y)
    return cleared
  }
}
