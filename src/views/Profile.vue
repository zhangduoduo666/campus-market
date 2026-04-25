<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 左侧菜单 -->
      <div class="profile-sidebar">
        <div class="user-card">
          <el-avatar :size="80" :src="userStore.userAvatar" />
          <h3>{{ userStore.userName }}</h3>
          <p class="user-school">{{ userInfo.school }}</p>
          <div class="credit-score">
            <span>信用分</span>
            <el-rate :model-value="5" disabled show-score text-color="#ff9900" score-template="{value}" />
          </div>
        </div>

        <el-menu
          :default-active="activeMenu"
          class="profile-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="info">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="products">
            <el-icon><Goods /></el-icon>
            <span>我的发布</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><ShoppingCart /></el-icon>
            <span>我的订单</span>
          </el-menu-item>
          <el-menu-item index="favorites">
            <el-icon><Star /></el-icon>
            <span>我的收藏</span>
          </el-menu-item>
          <el-menu-item index="followers">
            <el-icon><View /></el-icon>
            <span>关注/粉丝</span>
          </el-menu-item>
          <el-menu-item index="security">
            <el-icon><Lock /></el-icon>
            <span>账号安全</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容 -->
      <div class="profile-content">
        <!-- 个人信息 -->
        <div v-if="activeMenu === 'info'" class="content-section">
          <h3>个人信息</h3>
          <el-form :model="userInfo" label-width="100px" class="info-form">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAvatarChange"
              >
                <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="昵称">
              <el-input v-model="userInfo.nickname" />
            </el-form-item>

            <el-form-item label="手机号">
              <el-input v-model="userInfo.phone" disabled />
            </el-form-item>

            <el-form-item label="学生证号">
              <el-input v-model="userInfo.studentId" disabled />
            </el-form-item>

            <el-form-item label="学校">
              <el-input v-model="userInfo.school" disabled />
            </el-form-item>

            <el-form-item label="性别">
              <el-radio-group v-model="userInfo.gender">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="个人简介">
              <el-input
                v-model="userInfo.bio"
                type="textarea"
                :rows="3"
                placeholder="介绍一下自己吧"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 我的发布 -->
        <div v-if="activeMenu === 'products'" class="content-section">
          <h3>我的发布</h3>
          <el-tabs v-model="productTab">
            <el-tab-pane label="出售中" name="active">
              <div class="product-list">
                <div v-for="product in activeProducts" :key="product.id" class="product-item">
                  <img :src="product.images[0]" />
                  <div class="product-info">
                    <h4>{{ product.title }}</h4>
                    <p class="price">¥{{ product.price }}</p>
                    <p class="time">{{ product.publishTime }}</p>
                  </div>
                  <div class="product-actions">
                    <el-button size="small" @click="editProduct(product.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteProduct(product.id)">删除</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已售出" name="sold">
              <el-empty description="暂无已售出商品" />
            </el-tab-pane>
            <el-tab-pane label="审核中" name="pending">
              <el-empty description="暂无审核中商品" />
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 我的订单 -->
        <div v-if="activeMenu === 'orders'" class="content-section">
          <h3>我的订单</h3>
          <el-empty description="暂无订单" />
        </div>

        <!-- 我的收藏 -->
        <div v-if="activeMenu === 'favorites'" class="content-section">
          <h3>我的收藏</h3>
          <div class="favorite-list">
            <div v-for="item in favorites" :key="item.id" class="favorite-item">
              <img :src="item.images[0]" @click="goToDetail(item.id)" />
              <div class="favorite-info">
                <h4 @click="goToDetail(item.id)">{{ item.title }}</h4>
                <p class="price">¥{{ item.price }}</p>
              </div>
              <el-button type="danger" link @click="removeFavorite(item.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 关注/粉丝 -->
        <div v-if="activeMenu === 'followers'" class="content-section">
          <h3>关注/粉丝</h3>
          <el-tabs v-model="followTab">
            <el-tab-pane :label="`关注 ${following.length}`" name="following">
              <div class="user-list">
                <div v-for="user in following" :key="user.id" class="user-item">
                  <el-avatar :size="50" :src="user.avatar" />
                  <div class="user-info">
                    <h4>{{ user.nickname }}</h4>
                    <p>{{ user.school }}</p>
                  </div>
                  <el-button size="small" @click="unfollow(user.id)">取消关注</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="`粉丝 ${followers.length}`" name="followers">
              <div class="user-list">
                <div v-for="user in followers" :key="user.id" class="user-item">
                  <el-avatar :size="50" :src="user.avatar" />
                  <div class="user-info">
                    <h4>{{ user.nickname }}</h4>
                    <p>{{ user.school }}</p>
                  </div>
                  <el-button type="primary" size="small" @click="follow(user.id)">关注</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 账号安全 -->
        <div v-if="activeMenu === 'security'" class="content-section">
          <h3>账号安全</h3>
          <div class="security-list">
            <div class="security-item">
              <div class="security-info">
                <h4>登录密码</h4>
                <p>定期修改密码可以保护账号安全</p>
              </div>
              <el-button @click="showChangePassword = true">修改</el-button>
            </div>
            <div class="security-item">
              <div class="security-info">
                <h4>手机号</h4>
                <p>{{ userInfo.phone }}</p>
              </div>
              <el-button @click="showChangePhone = true">更换</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showChangePassword" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showChangePassword = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('info')
const productTab = ref('active')
const followTab = ref('following')
const showChangePassword = ref(false)
const showChangePhone = ref(false)

const userInfo = reactive({
  avatar: '',
  nickname: '校园用户',
  phone: '138****8888',
  studentId: '20210001',
  school: '清华大学',
  gender: 'male',
  bio: ''
})

// 同步用户信息
const syncUserInfo = () => {
  if (userStore.userInfo) {
    userInfo.avatar = userStore.userInfo.avatar || ''
    userInfo.nickname = userStore.userInfo.nickname || '校园用户'
    userInfo.phone = userStore.userInfo.phone || '138****8888'
    userInfo.studentId = userStore.userInfo.studentId || '20210001'
    userInfo.school = userStore.userInfo.school || '清华大学'
    userInfo.gender = userStore.userInfo.gender || 'male'
    userInfo.bio = userStore.userInfo.bio || ''
  }
}

// 监听 userStore 变化
watch(() => userStore.userInfo, () => {
  syncUserInfo()
}, { deep: true })

// 页面加载时同步
onMounted(() => {
  syncUserInfo()
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const activeProducts = ref([
  {
    id: 1,
    title: 'iPhone 13 Pro Max',
    price: 5800,
    images: ['https://picsum.photos/seed/iphone13profile/100/100'],
    publishTime: '2024-01-15'
  },
  {
    id: 2,
    title: '考研数学复习全书',
    price: 45,
    images: ['https://picsum.photos/seed/bookprofile/100/100'],
    publishTime: '2024-01-14'
  }
])

const favorites = ref([
  {
    id: 3,
    title: 'Nike Air Force 1',
    price: 380,
    images: ['https://picsum.photos/seed/shoesprofile/100/100']
  }
])

const following = ref([
  { id: 1, nickname: '小明同学', school: '北京大学', avatar: '' },
  { id: 2, nickname: '学霸学姐', school: '复旦大学', avatar: '' }
])

const followers = ref([
  { id: 3, nickname: '运动达人', school: '浙江大学', avatar: '' }
])

const handleMenuSelect = (index) => {
  activeMenu.value = index
}

const handleAvatarChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.avatar = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const saveProfile = () => {
  if (userStore.userInfo) {
    userStore.setUserInfo({
      ...userStore.userInfo,
      ...userInfo
    })
  }
  ElMessage.success('保存成功')
}

const editProduct = (id) => {
  router.push(`/publish?id=${id}`)
}

const deleteProduct = (id) => {
  ElMessage.success('删除成功')
}

const goToDetail = (id) => {
  router.push(`/product/${id}`)
}

const removeFavorite = (id) => {
  favorites.value = favorites.value.filter(item => item.id !== id)
  ElMessage.success('已取消收藏')
}

const unfollow = (id) => {
  following.value = following.value.filter(user => user.id !== id)
  ElMessage.success('已取消关注')
}

const follow = (id) => {
  ElMessage.success('关注成功')
}

const changePassword = () => {
  showChangePassword.value = false
  ElMessage.success('密码修改成功')
}
</script>

<style scoped>
.profile-page {
  padding-bottom: 40px;
}

.profile-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.profile-sidebar {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.user-card {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 16px;
}

.user-card h3 {
  margin: 12px 0 4px;
  font-size: 18px;
}

.user-school {
  color: #999;
  font-size: 13px;
  margin-bottom: 12px;
}

.credit-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.credit-score span {
  font-size: 12px;
  color: #999;
}

.profile-menu {
  border: none;
}

.profile-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.content-section h3 {
  font-size: 18px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.info-form {
  max-width: 500px;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 100px;
  height: 100px;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.product-list,
.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item,
.favorite-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.product-item img,
.favorite-item img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
}

.product-info,
.favorite-info {
  flex: 1;
}

.product-info h4,
.favorite-info h4 {
  font-size: 15px;
  margin-bottom: 8px;
  cursor: pointer;
}

.product-info h4:hover,
.favorite-info h4:hover {
  color: #409EFF;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.time {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.user-item h4 {
  font-size: 15px;
  margin-bottom: 4px;
}

.user-item p {
  color: #999;
  font-size: 13px;
}

.security-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.security-item h4 {
  font-size: 15px;
  margin-bottom: 4px;
}

.security-item p {
  color: #999;
  font-size: 13px;
}

@media (max-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}
</style>
