<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <el-icon size="32" color="#409EFF"><Shop /></el-icon>
          <span class="logo-text">校园二手市场</span>
        </div>
        
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>

        <div class="header-actions">
          <template v-if="userStore.isLoggedIn">
            <el-button type="primary" @click="$router.push('/publish')">
              <el-icon><Plus /></el-icon>
              发布商品
            </el-button>
            <el-badge :value="unreadCount" class="message-badge" v-if="unreadCount > 0">
              <el-button circle @click="$router.push('/messages')">
                <el-icon><ChatDotRound /></el-icon>
              </el-button>
            </el-badge>
            <el-button v-else circle @click="$router.push('/messages')">
              <el-icon><ChatDotRound /></el-icon>
            </el-button>
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :size="36" :src="userStore.userAvatar" />
                <span class="username">{{ userStore.userName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button @click="$router.push('/login')">登录</el-button>
            <el-button type="primary" @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-content">
        <p>© 2024 校园二手交易平台 - 让闲置物品流动起来</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const unreadCount = ref(2) // 示例未读消息数

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/', query: { keyword: searchKeyword.value } })
  }
}

const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.search-box {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-badge :deep(.el-badge__content) {
  top: 8px;
  right: 8px;
}

.main-content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.footer {
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 24px;
  text-align: center;
  color: #999;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
