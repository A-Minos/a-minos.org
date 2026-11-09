<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watchEffect } from 'vue'
import { COLUMNS, ROWS, colors, shapes, PlaygroundGame } from '../game/playground'

const game = reactive(new PlaygroundGame())
const board = useTemplateRef('board')
const status = ref('不用赶时间，按空格，让第一块落下。')
const nextCells = computed(() =>
  shapes[game.next].flatMap((row, y) => row.map((cell, x) => ({ cell, x, y }))),
)
type Action = 'left' | 'right' | 'rotate' | 'drop'

function act(action: Action) {
  if (action === 'left') game.move(-1)
  else if (action === 'right') game.move(1)
  else if (action === 'rotate') game.rotate()
  else {
    const cleared = game.drop()
    status.value = game.over
      ? `这局拼出了 ${game.lines} 行，按「再来一局」重新开始。`
      : cleared
        ? `漂亮！消除了 ${cleared} 行。下一块，交给你。`
        : '稳稳落下。左右移动，↑ 旋转，空格落下。'
  }
}

function onKeydown(event: KeyboardEvent) {
  const actions: Record<string, Action> = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'rotate',
    ArrowDown: 'drop',
    ' ': 'drop',
  }
  const action = actions[event.key]
  if (!action || (event.key === ' ' && event.target instanceof HTMLButtonElement)) return
  event.preventDefault()
  if (event.repeat && (action === 'drop' || action === 'rotate')) return
  act(action)
}

function reset() {
  game.reset()
  status.value = '新的开始。把中间这块落下，试试消掉两行。'
  focusBoard()
}

function focusBoard() {
  board.value?.focus({ preventScroll: true })
  board.value?.scrollIntoView({ block: 'center' })
}

defineExpose({ focusBoard })

watchEffect(() => {
  const ctx = board.value?.getContext('2d')
  if (!ctx) return
  const size = 32
  ctx.setTransform(2, 0, 0, 2, 0, 0)
  ctx.clearRect(0, 0, COLUMNS * size, ROWS * size)
  ctx.fillStyle = '#e8eadd'
  ctx.fillRect(0, 0, COLUMNS * size, ROWS * size)
  ctx.strokeStyle = '#dce0cf'
  ctx.lineWidth = 0.6
  for (let x = 0; x <= COLUMNS; x++) {
    ctx.beginPath()
    ctx.moveTo(x * size, 0)
    ctx.lineTo(x * size, ROWS * size)
    ctx.stroke()
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * size)
    ctx.lineTo(COLUMNS * size, y * size)
    ctx.stroke()
  }
  function cell(x: number, y: number, color: string, ghost = false) {
    const context = ctx!
    context.globalAlpha = ghost ? 0.2 : 1
    context.fillStyle = color
    context.beginPath()
    context.roundRect(x * size + 1, y * size + 1, size - 2, size - 2, 3)
    context.fill()
    context.globalAlpha = 1
    if (ghost) {
      context.strokeStyle = '#a3aa8c'
      context.lineWidth = 1
      context.setLineDash([3, 3])
      context.stroke()
      context.setLineDash([])
    } else {
      context.fillStyle = '#ffffff25'
      context.fillRect(x * size + 3, y * size + 2, size - 6, 2)
      context.fillStyle = '#282a2510'
      context.fillRect(x * size + 3, y * size + size - 4, size - 6, 2)
    }
  }
  game.board.forEach((row, y) =>
    row.forEach((kind, x) => {
      if (kind) cell(x, y, colors[kind])
    }),
  )
  if (game.over) return
  game.shape.forEach((row, dy) =>
    row.forEach((occupied, dx) => {
      if (occupied) cell(game.x + dx, game.landingY + dy, colors[game.kind], true)
    }),
  )
  game.shape.forEach((row, dy) =>
    row.forEach((occupied, dx) => {
      if (occupied) cell(game.x + dx, game.y + dy, colors[game.kind])
    }),
  )
  if (game.kind === 'O') {
    ctx.fillStyle = '#4c4531'
    for (const dx of [18, 42]) {
      ctx.beginPath()
      ctx.roundRect(game.x * size + dx, game.y * size + 23, 5, 8, 2.5)
      ctx.fill()
    }
    ctx.strokeStyle = '#4c4531'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(game.x * size + 32, game.y * size + 39, 5, 0.15, Math.PI - 0.15)
    ctx.stroke()
  }
})
</script>

<template>
  <div class="playground-scene">
    <span class="scene-spark spark-one" aria-hidden="true">✳</span>
    <span class="scene-plus" aria-hidden="true">+</span>
    <div id="playground" class="playground" @keydown="onKeydown">
      <div class="playground-top">
        <span><span class="status-dot"></span> THE MINO PLAYGROUND</span>
        <button type="button" aria-label="重新开始棋盘" title="重新开始" @click="reset">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></svg>
        </button>
      </div>
      <div class="game-layout">
        <div class="board-shell">
          <canvas
            id="board"
            ref="board"
            width="640"
            height="768"
            tabindex="0"
            aria-label="方块游乐场。左右方向键移动，上方向键旋转，空格落下。没有计时，慢慢来。"
            aria-describedby="game-status"
            >请使用下方按钮操作方块。</canvas
          >
          <div v-if="game.over" class="game-over">
            <strong>下次，拼得更好。</strong><span>这局的每一块，都算数。</span>
            <button class="button button-dark" type="button" @click="reset">再来一局 ↻</button>
          </div>
        </div>
        <div class="game-sidebar">
          <div>
            <span class="game-label">NEXT</span>
            <div class="next-piece" :aria-label="`下一个方块：${game.next}`">
              <i
                v-for="(block, index) in nextCells"
                :key="index"
                :style="{
                  gridColumn: block.x + 1,
                  gridRow: block.y + 1,
                  background: block.cell ? colors[game.next] : 'transparent',
                }"
              ></i>
            </div>
          </div>
          <div class="line-count">
            <span class="game-label">LINES</span
            ><strong id="line-count">{{ String(game.lines).padStart(2, '0') }}</strong>
          </div>
          <div class="sidebar-note">NO RUSH.<br />JUST<br /><span>BLOCKS.</span></div>
          <svg class="sidebar-flower" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 0v40M0 20h40M6 6l28 28M6 34 34 6" />
          </svg>
        </div>
      </div>
      <div class="game-controls" aria-label="棋盘控制">
        <div class="direction-controls">
          <button type="button" aria-label="向左移动" :disabled="game.over" @click="act('left')">
            ←
          </button>
          <button type="button" aria-label="旋转方块" :disabled="game.over" @click="act('rotate')">
            ↻
          </button>
          <button type="button" aria-label="向右移动" :disabled="game.over" @click="act('right')">
            →
          </button>
        </div>
        <button type="button" class="drop-button" :disabled="game.over" @click="act('drop')">
          落下 <span aria-hidden="true">↓</span>
        </button>
      </div>
      <p id="game-status" class="game-status" aria-live="polite">{{ status }}</p>
    </div>
    <div class="scene-sticker" aria-hidden="true">
      少一块？<br /><strong>就等你了。</strong
      ><svg viewBox="0 0 54 35"><path d="M3 5q9 30 43 17m-10-8 13 6-7 12" /></svg>
    </div>
    <p class="scene-caption"><span aria-hidden="true">↖</span> 真的可以玩，不只是装饰。</p>
  </div>
</template>
