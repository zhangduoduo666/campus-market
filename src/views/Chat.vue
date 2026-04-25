<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- 左侧会话列表 -->
      <div class="conversation-sidebar">
        <div class="sidebar-header">
          <h3>消息</h3>
        </div>
        <div class="conversation-list">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            class="conversation-item"
            :class="{ active: currentConversation?.id === conv.id, unread: conv.unread > 0 }"
            @click="selectConversation(conv)"
          >
            <div class="avatar-wrapper">
              <el-avatar :size="40" :src="conv.avatar" />
              <div v-if="conv.unread > 0" class="unread-dot"></div>
            </div>
            <div class="conversation-info">
              <div class="conversation-top">
                <span class="nickname">{{ conv.nickname }}</span>
                <span class="time">{{ conv.lastTime }}</span>
              </div>
              <p class="last-message">{{ conv.lastMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="chat-main" v-if="currentConversation">
        <div class="chat-header">
          <div class="user-info">
            <el-avatar :size="40" :src="currentConversation.avatar" />
            <div class="user-meta">
              <h4>{{ currentConversation.nickname }}</h4>
              <p v-if="currentConversation.productTitle">
                关于商品：{{ currentConversation.productTitle }}
              </p>
            </div>
          </div>
          <div class="header-actions">
            <el-button text @click="viewProduct">
              <el-icon><Goods /></el-icon>
              查看商品
            </el-button>
          </div>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div class="message-time">{{ currentDate }}</div>
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message-item"
            :class="{ self: msg.isSelf }"
          >
            <el-avatar :size="36" :src="msg.isSelf ? userAvatar : currentConversation.avatar" />
            <div class="message-content">
              <div v-if="msg.type === 'text'" class="text-message">{{ msg.content }}</div>
              <div v-else-if="msg.type === 'image'" class="image-message">
                <img :src="msg.content" @click="previewImage(msg.content)" />
              </div>
            </div>
            <span class="message-time">{{ msg.time }}</span>
          </div>
        </div>

        <div class="chat-input">
          <div class="input-toolbar">
            <el-upload
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleImageUpload"
            >
              <el-button text>
                <el-icon><Picture /></el-icon>
              </el-button>
            </el-upload>
            <el-button text @click="showEmoji = !showEmoji">
              <el-icon><ChatDotRound /></el-icon>
            </el-button>
          </div>
          <div class="input-area">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="3"
              placeholder="输入消息..."
              @keyup.enter.ctrl="sendMessage"
            />
          </div>
          <div class="input-actions">
            <span class="input-tip">按 Ctrl + Enter 发送</span>
            <el-button type="primary" @click="sendMessage" :disabled="!inputMessage.trim()">
              发送
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="chat-empty" v-else>
        <el-empty description="选择一个会话开始聊天" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const chatId = route.params.id

const messagesContainer = ref(null)
const inputMessage = ref('')
const showEmoji = ref(false)
const userAvatar = ref('')
const currentDate = ref(new Date().toLocaleDateString())

const conversations = ref([
  {
    id: 1,
    nickname: '小明同学',
    avatar: '',
    lastMessage: '你好，这个商品还在吗？',
    lastTime: '10:30',
    unread: 2,
    productTitle: 'iPhone 13 Pro Max'
  },
  {
    id: 2,
    nickname: '学霸学姐',
    avatar: '',
    lastMessage: '可以便宜一点吗？',
    lastTime: '09:15',
    unread: 0,
    productTitle: '考研数学复习全书'
  },
  {
    id: 3,
    nickname: '运动达人',
    avatar: '',
    lastMessage: '好的，明天下午图书馆门口见',
    lastTime: '昨天',
    unread: 0,
    productTitle: 'Nike Air Force 1'
  }
])

const currentConversation = ref(null)

const messages = ref([
  {
    type: 'text',
    content: '你好，这个商品还在吗？',
    isSelf: false,
    time: '10:30'
  },
  {
    type: 'text',
    content: '在的，还在出售中',
    isSelf: true,
    time: '10:32'
  },
  {
    type: 'text',
    content: '可以便宜一点吗？',
    isSelf: false,
    time: '10:35'
  },
  {
    type: 'text',
    content: '最低5500，不能再少了',
    isSelf: true,
    time: '10:36'
  }
])

const selectConversation = (conv) => {
  currentConversation.value = conv
  conv.unread = 0
  scrollToBottom()
}

const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  messages.value.push({
    type: 'text',
    content: inputMessage.value,
    isSelf: true,
    time
  })

  if (currentConversation.value) {
    currentConversation.value.lastMessage = inputMessage.value
    currentConversation.value.lastTime = time
  }

  inputMessage.value = ''
  scrollToBottom()

  // 模拟对方回复
  setTimeout(() => {
    messages.value.push({
      type: 'text',
      content: '好的，我再考虑一下',
      isSelf: false,
      time: `${now.getHours().toString().padStart(2, '0')}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`
    })
    scrollToBottom()
  }, 2000)
}

const handleImageUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    messages.value.push({
      type: 'image',
      content: e.target.result,
      isSelf: true,
      time
    })
    scrollToBottom()
  }
  reader.readAsDataURL(file.raw)
}

const previewImage = (url) => {
  // 图片预览
  ElMessage.info('图片预览功能')
}

const viewProduct = () => {
  router.push('/product/1')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  // 根据URL参数选择会话
  const conv = conversations.value.find(c => c.id === parseInt(chatId))
  if (conv) {
    selectConversation(conv)
  }
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
  height: calc(100vh - 200px);
  min-height: 500px;
}

.chat-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  overflow: hidden;
}

.conversation-sidebar {
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.conversation-item:hover {
  background: #f5f7fa;
}

.conversation-item.active {
  background: #ecf5ff;
}

.conversation-item.unread {
  background: #f0f9ff;
}

.avatar-wrapper {
  position: relative;
}

.unread-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #f56c6c;
  border-radius: 50%;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.nickname {
  font-size: 14px;
  font-weight: 500;
}

.time {
  font-size: 11px;
  color: #999;
}

.last-message {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-main {
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-meta h4 {
  font-size: 15px;
  margin-bottom: 2px;
}

.user-meta p {
  font-size: 12px;
  color: #999;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.message-time {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin: 16px 0;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.message-item.self {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 60%;
}

.text-message {
  background: #fff;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.message-item.self .text-message {
  background: #95ec69;
}

.image-message img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
}

.message-item .message-time {
  font-size: 11px;
  color: #999;
  margin: 0;
  align-self: flex-end;
}

.chat-input {
  padding: 12px 20px;
  border-top: 1px solid #e8e8e8;
  background: #fff;
}

.input-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.input-area :deep(.el-textarea__inner) {
  resize: none;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.input-tip {
  font-size: 12px;
  color: #999;
}

.chat-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .chat-container {
    grid-template-columns: 1fr;
  }

  .conversation-sidebar {
    display: none;
  }
}
</style>
