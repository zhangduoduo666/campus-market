import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userId = computed(() => userInfo.value?.id)
  const userName = computed(() => userInfo.value?.nickname || userInfo.value?.phone)
  const userAvatar = computed(() => userInfo.value?.avatar || '')

  // Actions
  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    userId,
    userName,
    userAvatar,
    setUserInfo,
    setToken,
    logout
  }
})
