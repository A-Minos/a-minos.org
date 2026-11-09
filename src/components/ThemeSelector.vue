<script setup lang="ts">
import { themePreference } from '../theme'
</script>

<template>
  <label class="theme-selector">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <template v-if="themePreference === 'system'">
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M12 17v4m-4 0h8" />
      </template>
      <template v-else-if="themePreference === 'light'">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </template>
      <path v-else d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" />
    </svg>
    <select v-model="themePreference" aria-label="颜色主题">
      <option value="system">跟随系统</option>
      <option value="light">浅色</option>
      <option value="dark">深色</option>
    </select>
  </label>
</template>
