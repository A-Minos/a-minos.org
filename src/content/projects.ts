interface Project {
  id: 'stats' | 'rumen' | 'chinese'
  name: string
  category: string
  lead: string
  description: string
  language: 'Python' | 'Rust' | 'TypeScript'
  tag: string
  url: string
}

export const projects: Project[] = [
  {
    id: 'stats',
    name: 'Tetris Stats',
    category: '给玩家的工具',
    lead: '你的打块日常，数据来说话。',
    description: '在聊天里查询 TETR.IO、茶服与 TOP 玩家数据。',
    language: 'Python',
    tag: 'NoneBot2 插件',
    url: 'https://github.com/A-Minos/nonebot-plugin-tetris-stats',
  },
  {
    id: 'rumen',
    name: 'rumen',
    category: '给开发者的积木',
    lead: '小方块，大吞吐。',
    description: '用 Rust 解码 Fumen 谱面，轻松接入 Python。',
    language: 'Rust',
    tag: 'Python 绑定',
    url: 'https://github.com/A-Minos/rumen',
  },
  {
    id: 'chinese',
    name: 'TETR.IO 中文支持',
    category: '让热爱没有语言障碍',
    lead: '熟悉的语言，熟悉的快乐。',
    description: '让你和下一场对局之间，少一点距离。',
    language: 'TypeScript',
    tag: '本地化',
    url: 'https://github.com/A-Minos/tetrio-chinese',
  },
]
