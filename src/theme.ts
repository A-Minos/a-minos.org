import { computed, ref, watch, watchEffect } from 'vue'

type ThemePreference = 'system' | 'light' | 'dark'

export const themePreference = ref<ThemePreference>(
  (document.documentElement.dataset.theme as ThemePreference | undefined) ?? 'system',
)

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
const systemDark = ref(systemTheme.matches)
systemTheme.addEventListener('change', (event) => {
  systemDark.value = event.matches
})

export const isDark = computed(
  () =>
    themePreference.value === 'dark' || (themePreference.value === 'system' && systemDark.value),
)

watchEffect(() => {
  document.documentElement.dataset.theme = themePreference.value
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = isDark.value
    ? '#1d211c'
    : '#f7f7ef'
})

watch(themePreference, (preference) => {
  if (preference === 'system') localStorage.removeItem('a-minos-theme')
  else localStorage.setItem('a-minos-theme', preference)
})
