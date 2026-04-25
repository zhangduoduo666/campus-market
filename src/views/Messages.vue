<template>
  <div class="messages-page">
    <div class="messages-container">
      <div class="messages-header">
        <h2>消息列表</h2>
        <el-button type="primary" text @click="markAllRead">
          <el-icon><Check /></el-icon>
          全部已读
        </el-button>
      </div>

      <div class="conversation-list">
        <div
          v-for="conv in conversations"
          :key="conv.id"
          class="conversation-item"
          :class="{ unread: conv.unread > 0 }"
          @click="goToChat(conv.id)"
        >
          <div class="avatar-wrapper">
            <el-avatar :size="50" :src="conv.avatar" />
            <div v-if="conv.unread > 0" class="unread-badge">{{ conv.unread }}</div>
          </div>
          <div class="conversation-content">
            <div class="conversation-top">
              <h4 class="nickname">{{ conv.nickname }}</h4>
              <span class="time">{{ conv.lastTime }}</span>
            </div>
            <div class="conversation-bottom">
              <p class="last-message">{{ conv.lastMessage }}</p>
              <span v-if="conv.productTitle" class="product-tag">
                关于：{{ conv.productTitle }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="conversations.length === 0" class="empty-state">
        <el-empty description="暂无消息" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const conversations = ref([
  {
    id: 1,
    nickname: '小明同学',
    avatar: '',
    lastMessage: '你好，这个商品还在吗？',
    lastTime: '10分钟前',
    unread: 2,
    productTitle: 'iPhone 13 Pro Max'
  },
  {
    id: 2,
    nickname: '学霸学姐',
    avatar: '',
    lastMessage: '可以便宜一点吗？',
    lastTime: '1小时前',
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
  },
  {
    id: 4,
    nickname: '毕业生',
    avatar: '',
    lastMessage: '谢谢购买！',
    lastTime: '3天前',
    unread: 0,
    productTitle: '宜家台灯'
  }
])

const goToChat = (id) => {
  router.push(`/chat/${id}`)
}

const markAllRead = () => {
  conversations.value.forEach(conv => {
    conv.unread = 0
  })
  ElMessage.success('已全部标记为已读')
}
</script>

<style scoped>
.messages-page {
  padding-bottom: 40px;
}

.messages-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.messages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.messages-header h2 {
  font-size: 18px;
  font-weight: 600;
}

.conversation-list {
  display: flex;
  flex-direction: column;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  cursor: pointer;
  transition: background 0.3s;
  border-bottom: 1px solid #f0f0f0;
}

.conversation-item:hover {
  background: #f5f7fa;
}

.conversation-item.unread {
  background: #f0f9ff;
}

.avatar-wrapper {
  position: relative;
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.nickname {
  font-size: 15px;
  font-weight: 500;
}

.time {
  font-size: 12px;
  color: #999;
}

.conversation-bottom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.last-message {
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-tag {
  font-size: 12px;
  color: #409EFF;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}

.empty-state {
  padding: 60px 0;
}
</style>
