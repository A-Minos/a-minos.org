import { describe, expect, it } from 'vitest'
import { COLUMNS, ROWS, PlaygroundGame, type PieceKind } from './playground'

describe('方块游乐场', () => {
  it('第一块落入中间缺口，同时消除两行并保留上方堆叠', () => {
    const game = new PlaygroundGame()

    expect(game.drop()).toBe(2)
    expect(game.lines).toBe(2)
    expect(game.board[11]).toEqual([null, 'Z', 'Z', null, null, null, 'L', 'L', 'S', 'S'])
    expect(game.board).toHaveLength(12)
    expect(game.board.every((row) => row.includes(null))).toBe(true)
    expect(game.kind).toBe('T')
    expect(game.over).toBe(false)
  })

  it.each([
    { kind: 'T', direction: 1, wall: -1, before: -1, after: 0 },
    { kind: 'T', direction: -1, wall: 1, before: 8, after: 7 },
    { kind: 'I', direction: 1, wall: -1, before: -2, after: 0 },
    { kind: 'I', direction: -1, wall: 1, before: 8, after: 6 },
  ] as const)(
    '$kind 在墙边按 $direction 旋转使用对应的 SRS 踢墙',
    ({ kind, direction, wall, before, after }) => {
      const game = new PlaygroundGame()
      game.next = kind
      game.drop()
      game.board = Array.from({ length: ROWS }, () => Array<PieceKind | null>(COLUMNS).fill(null))
      game.rotate(direction)
      for (let i = 0; i < 12; i++) game.move(wall)
      expect(game.x).toBe(before)

      game.rotate(direction)

      expect(game.x).toBe(after)
      expect(game.y).toBe(0)
      expect(game.rotation).toBe(2)
      expect(game.shape).toEqual(
        kind === 'T'
          ? [
              [0, 0, 0],
              [1, 1, 1],
              [0, 1, 0],
            ]
          : [
              [0, 0, 0, 0],
              [0, 0, 0, 0],
              [1, 1, 1, 1],
              [0, 0, 0, 0],
            ],
      )
    },
  )

  it.each([
    { kind: 'T', direction: 1, x: 2, y: 9, rotation: 1 },
    { kind: 'T', direction: -1, x: 4, y: 9, rotation: 3 },
    { kind: 'I', direction: 1, x: 4, y: 8, rotation: 1 },
    { kind: 'I', direction: -1, x: 2, y: 8, rotation: 3 },
  ] as const)(
    '$kind 在地板上按 $direction 旋转时使用 SRS 踢地',
    ({ kind, direction, x, y, rotation }) => {
      const game = new PlaygroundGame()
      game.next = kind
      game.drop()
      game.board = Array.from({ length: ROWS }, () => Array<PieceKind | null>(COLUMNS).fill(null))
      game.y = 10
      expect(game.fits(game.shape, game.x, game.y)).toBe(true)

      game.rotate(direction)

      expect([game.x, game.y]).toEqual([x, y])
      expect(game.rotation).toBe(rotation)
      expect(game.fits(game.shape, game.x, game.y)).toBe(true)
    },
  )

  it('I 块按标准 SRS 的顺序尝试踢墙，不使用 Arika 的优先级', () => {
    const game = new PlaygroundGame()
    game.next = 'I'
    game.drop()
    game.board = Array.from({ length: ROWS }, () => Array<PieceKind | null>(COLUMNS).fill(null))
    game.y = 3
    game.board[3][5] = 'J'
    game.board[3][3] = 'J'
    game.board[6][6] = 'J'
    expect(game.fits(game.shape, game.x, game.y)).toBe(true)

    game.rotate()

    // 前三次被阻挡，第四、第五次都可行时，应先向左两格、向下一格。
    expect([game.x, game.y]).toEqual([1, 4])
    expect(game.rotation).toBe(1)
    expect(game.shape).toEqual([
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ])
  })

  it('五个旋转位置都被阻挡时保留原位置、形状和旋转状态', () => {
    const game = new PlaygroundGame()
    game.drop()
    game.board = Array.from({ length: ROWS }, () => Array<PieceKind | null>(COLUMNS).fill(null))
    game.y = 3
    game.board[5][4] = 'J'
    game.board[3][3] = 'J'
    game.board[5][3] = 'J'
    expect(game.fits(game.shape, game.x, game.y)).toBe(true)

    game.rotate()

    expect([game.x, game.y]).toEqual([3, 3])
    expect(game.shape).toEqual([
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ])
    expect(game.rotation).toBe(0)
  })

  it('O 块旋转不平移，下一块和重开均从出生旋转状态开始', () => {
    const game = new PlaygroundGame()
    game.rotate()
    game.rotate(-1)
    expect([game.x, game.y]).toEqual([4, 1])
    expect(game.shape).toEqual([
      [1, 1],
      [1, 1],
    ])
    expect(game.drop()).toBe(2)
    expect(game.rotation).toBe(0)
    game.rotate(-1)
    expect(game.rotation).toBe(3)
    game.drop()
    expect(game.rotation).toBe(0)
    game.reset()
    expect(game.rotation).toBe(0)
    expect(game.drop()).toBe(2)
  })

  it('出生位置被占用时结束，不再改变盘面，重新开始可恢复', () => {
    const game = new PlaygroundGame()
    game.board = Array.from({ length: ROWS }, () => Array<PieceKind | null>(COLUMNS).fill(null))
    game.board[0][4] = 'J'
    game.drop()
    expect(game.over).toBe(true)
    const stoppedBoard = game.board.map((row) => [...row])

    game.move(1)
    game.rotate()
    game.drop()
    expect(game.board).toEqual(stoppedBoard)

    game.reset()
    expect(game.over).toBe(false)
    expect(game.lines).toBe(0)
    expect(game.drop()).toBe(2)
  })
})
