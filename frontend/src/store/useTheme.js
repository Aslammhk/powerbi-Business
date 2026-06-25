import { create } from 'zustand'

var useTheme = create(function(set, get) {
  return {
    isDark: false,
    toggleDark: function() {
      var next = !get().isDark
      set({ isDark: next })
    },
    initTheme: function() {
      set({ isDark: false })
    }
  }
})

export { useTheme }
