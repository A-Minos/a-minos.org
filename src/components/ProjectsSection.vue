<script setup lang="ts">
import { projects } from '../content/projects'
</script>

<template>
  <section id="projects" class="projects wrap section-space" aria-labelledby="projects-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow section-index">01 / THINGS WE BUILD</p>
        <h2 id="projects-title">好用，也要好玩<span class="coral-dot">。</span></h2>
      </div>
      <a
        class="text-link"
        href="https://github.com/orgs/A-Minos/repositories"
        target="_blank"
        rel="noopener noreferrer"
        >全部项目 <span aria-hidden="true">↗</span></a
      >
    </div>
    <div class="project-grid">
      <a
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        :class="`${project.id}-card`"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-labelledby="`${project.id}-title`"
      >
        <div class="card-topline">
          <span class="project-category">{{ project.category }}</span
          ><span class="card-arrow" aria-hidden="true">↗</span>
        </div>
        <div v-if="project.id === 'stats'" class="stats-art" aria-hidden="true">
          <div class="stat-bars"><i v-for="i in 7" :key="i"></i></div>
          <div class="stats-bubble">
            <span class="bubble-dot"></span> 每一点进步，都看得见。<span>↗</span>
          </div>
          <span class="art-cross">+</span>
        </div>
        <div v-else-if="project.id === 'rumen'" class="rumen-art" aria-hidden="true">
          <span class="code-bracket">{</span>
          <div class="code-blocks"><i v-for="i in 9" :key="i"></i></div>
          <span class="code-bracket">}</span><span class="code-caption">fumen → possibilities</span>
        </div>
        <div v-else class="chinese-art" aria-hidden="true">
          <span class="translation-en">Aa<span>↗</span></span
          ><span class="translation-zh">方</span><span class="translation-spark">✧</span>
        </div>
        <div class="card-content">
          <h3 :id="`${project.id}-title`">
            {{ project.name
            }}<span v-if="project.id === 'rumen'" class="title-period" aria-hidden="true">_</span>
          </h3>
          <p>{{ project.lead }}<br />{{ project.description }}</p>
          <div class="card-tags">
            <span
              ><i class="language-dot" :class="project.language.toLowerCase()"></i>
              {{ project.language }}</span
            ><span>{{ project.tag }}</span>
          </div>
        </div>
      </a>
    </div>
    <p class="project-note">
      <span aria-hidden="true">↳</span> 从一个「要是有这个就好了」开始，到每个人都能用得上。
    </p>
  </section>
</template>
