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

  it('移动不越过边界，靠右旋转时向内让出空间', () => {
    const game = new PlaygroundGame()
    game.drop()
    for (let i = 0; i < 12; i++) game.move(1)
    expect(game.x).toBe(7)

    game.rotate()
    game.move(1)
    expect(game.x).toBe(8)
    game.rotate()

    expect(game.x).toBe(7)
    expect(game.shape).toEqual([
      [1, 1, 1],
      [0, 1, 0],
    ])
    expect(game.fits(game.shape, game.x, game.y)).toBe(true)
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
