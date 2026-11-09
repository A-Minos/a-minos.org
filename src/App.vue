<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MinoPlayground from './components/MinoPlayground.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ThemeSelector from './components/ThemeSelector.vue'

const playground = useTemplateRef('playground')
</script>

<template>
  <a class="skip-link" href="#main">跳到主要内容</a>
  <header class="site-header wrap">
    <a class="brand" href="#" aria-label="A-Minos 首页"
      ><img src="/favicon.svg" width="38" height="38" alt="" /><span
        >A-Minos<span class="brand-dot">.</span></span
      ></a
    >
    <nav aria-label="主导航">
      <a href="#projects">我们的作品</a>
      <a href="#about">关于我们</a>
      <a
        class="nav-github"
        href="https://github.com/A-Minos"
        target="_blank"
        rel="noopener noreferrer"
        >GitHub <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg
      ></a>
    </nav>
    <ThemeSelector />
  </header>

  <main id="main">
    <section class="hero wrap" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="status-dot"></span> 为方块社区而造
          <span class="eyebrow-divider">/</span> BUILT FOR THE COMMUNITY
        </p>
        <h1 id="hero-title">
          把热爱，<br /><span class="headline-bottom"
            >拼在一起<span class="coral-dot">。</span
            ><svg
              class="scribble"
              viewBox="0 0 400 22"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M4 15Q180 0 392 9M50 20Q210 8 350 16" /></svg
          ></span>
        </h1>
        <p class="hero-description">
          我们是 A-Minos，一群热爱 Tetris 的开发者。<br
            class="desktop-break"
          />写一点代码，做一些工具，让打块这件事更有趣。
        </p>
        <div class="hero-actions">
          <a class="button button-dark" href="#projects"
            >发现我们的作品 <span aria-hidden="true">↗</span></a
          >
          <button class="play-link" @click="playground?.focusBoard()" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z" /></svg>
            先来拼一块
          </button>
        </div>
        <div class="hero-footnote">
          <span class="mini-tetromino" aria-hidden="true"><i></i><i></i><i></i><i></i></span
          ><span>每一小块，都有它的位置。</span>
        </div>
      </div>

      <MinoPlayground ref="playground" />
    </section>

    <div class="values-strip" aria-label="我们的理念">
      <div class="wrap">
        <span>小方块。大可能。</span><span class="strip-star" aria-hidden="true">✳</span
        ><span>OPEN SOURCE, OPEN POSSIBILITIES.</span
        ><span class="strip-star" aria-hidden="true">✳</span><span>为热爱，不设限。</span
        ><span class="strip-star last-star" aria-hidden="true">✳</span>
      </div>
    </div>

    <ProjectsSection />

    <section class="about-section" id="about" aria-labelledby="about-title">
      <div class="wrap about-inner">
        <div class="about-visual" aria-hidden="true">
          <div class="large-mino">
            <i></i><i></i><i></i><i></i><span class="mino-eyes"></span
            ><span class="mino-smile"></span>
          </div>
          <span class="mino-friend friend-purple"></span
          ><span class="mino-friend friend-green"></span><span class="about-visual-star">✳</span
          ><span class="about-visual-note">BETTER TOGETHER.</span>
        </div>
        <div class="about-copy">
          <p class="eyebrow section-index">02 / THE PEOPLE BEHIND THE BLOCKS</p>
          <h2 id="about-title">为方块而来，<br />不止于方块。</h2>
          <p>
            我们因为 Tetris 相遇，也因为「想做点什么」聚在一起。<br />从玩家数据到开发工具，把自己的小想法，做成社区用得上的东西。
          </p>
          <p>
            这里没有完美的起手式。一个点子、一次反馈、一行代码，<br
              class="desktop-break"
            />都是很棒的开始。你的下一块，想放在哪里？
          </p>
          <a
            class="text-link"
            href="https://github.com/A-Minos"
            target="_blank"
            rel="noopener noreferrer"
            >认识 A-Minos <span aria-hidden="true">↗</span></a
          >
        </div>
      </div>
    </section>

    <section class="join-section wrap" aria-labelledby="join-title">
      <div class="join-topline">
        <p class="eyebrow section-index">YOUR TURN</p>
        <span class="join-coordinates" aria-hidden="true">[ YOU BELONG HERE ]</span>
      </div>
      <div class="join-content">
        <h2 id="join-title">
          下一块，<span
            >一起？<svg viewBox="0 0 300 105" preserveAspectRatio="none" aria-hidden="true">
              <ellipse cx="150" cy="52" rx="144" ry="47" /></svg
          ></span>
        </h2>
        <div>
          <p>来提个想法，修个小问题，或者只是打个招呼。<br />好玩的事情，总是从连接开始。</p>
          <a
            class="button button-dark"
            href="https://github.com/orgs/A-Minos/discussions"
            target="_blank"
            rel="noopener noreferrer"
            >在 GitHub 上碰个面 <span aria-hidden="true">↗</span></a
          >
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer wrap">
    <a class="brand footer-brand" href="#" aria-label="回到首页"
      ><img src="/favicon.svg" width="28" height="28" alt="" /><span>A-Minos.</span></a
    ><span class="footer-message">Made of little blocks & a lot of love.</span>
    <div>
      <a href="https://github.com/26F-Studio" target="_blank" rel="noopener noreferrer"
        >朋友 · 26F Studio ↗</a
      ><span
        >© <span>{{ new Date().getFullYear() }}</span> A-Minos</span
      >
    </div>
  </footer>
</template>
