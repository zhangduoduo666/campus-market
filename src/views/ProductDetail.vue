<template>
  <div class="product-detail-page">
    <div class="detail-container">
      <!-- 左侧图片区 -->
      <div class="image-section">
        <div class="main-image">
          <img :src="product.images?.[currentImageIndex]" :alt="product.title" />
        </div>
        <div class="thumbnail-list">
          <div
            v-for="(img, index) in product.images"
            :key="index"
            class="thumbnail"
            :class="{ active: currentImageIndex === index }"
            @click="currentImageIndex = index"
          >
            <img :src="img" />
          </div>
        </div>
      </div>

      <!-- 右侧信息区 -->
      <div class="info-section">
        <h1 class="product-title">{{ product.title }}</h1>
        <div class="product-price">
          <span class="price">¥{{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">
            原价 ¥{{ product.originalPrice }}
          </span>
        </div>

        <div class="product-tags">
          <el-tag v-if="product.isNew" type="success">全新</el-tag>
          <el-tag v-else type="warning">{{ product.condition }}</el-tag>
          <el-tag v-if="product.canBargain" type="info">可小刀</el-tag>
          <el-tag v-if="product.freeShipping" type="success">包邮</el-tag>
        </div>

        <div class="product-meta">
          <div class="meta-item">
            <span class="label">分类：</span>
            <span>{{ product.category }}</span>
          </div>
          <div class="meta-item">
            <span class="label">交易方式：</span>
            <span>{{ product.tradeType === 'pickup' ? '自提' : '送货' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">发布时间：</span>
            <span>{{ product.publishTime }}</span>
          </div>
          <div class="meta-item">
            <span class="label">浏览量：</span>
            <span>{{ product.views }}</span>
          </div>
        </div>

        <div class="product-description">
          <h3>商品描述</h3>
          <p>{{ product.description }}</p>
        </div>

        <div class="seller-card">
          <div class="seller-header">
            <el-avatar :size="50" :src="product.sellerAvatar" />
            <div class="seller-info">
              <h4>{{ product.sellerName }}</h4>
              <p>{{ product.sellerSchool }}</p>
              <div class="seller-stats">
                <span>信用分: {{ product.sellerCredit }}</span>
                <span>成交: {{ product.sellerDeals }}笔</span>
              </div>
            </div>
          </div>
          <div class="seller-actions">
            <el-button type="primary" size="large" @click="contactSeller">
              <el-icon><ChatDotRound /></el-icon>
              联系卖家
            </el-button>
            <el-button size="large" @click="toggleFollow">
              <el-icon><Star v-if="!isFollowed" /><StarFilled v-else /></el-icon>
              {{ isFollowed ? '已关注' : '关注' }}
            </el-button>
          </div>
        </div>

        <div class="action-buttons">
          <el-button type="danger" size="large" class="buy-btn" @click="buyNow">
            我想要
          </el-button>
          <el-button size="large" @click="toggleCollect">
            <el-icon><Collection v-if="!isCollected" /><CollectionTag v-else /></el-icon>
            {{ isCollected ? '已收藏' : '收藏' }}
          </el-button>
          <el-button size="large" @click="shareProduct">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </div>
      </div>
    </div>

    <!-- 相关推荐 -->
    <div class="recommend-section">
      <h3>相关推荐</h3>
      <div class="recommend-list">
        <div
          v-for="item in recommendProducts"
          :key="item.id"
          class="recommend-item"
          @click="goToDetail(item.id)"
        >
          <img :src="item.images[0]" />
          <p class="recommend-title">{{ item.title }}</p>
          <p class="recommend-price">¥{{ item.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const currentImageIndex = ref(0)
const isFollowed = ref(false)
const isCollected = ref(false)

// 模拟商品数据
const product = ref({
  id: productId,
  title: 'iPhone 13 Pro Max 256G 远峰蓝',
  price: 5800,
  originalPrice: 8999,
  isNew: false,
  condition: '95新',
  canBargain: true,
  freeShipping: true,
  category: '数码电子',
  tradeType: 'pickup',
  publishTime: '2024-01-15 14:30',
  views: 1234,
  description: '国行正品，使用一年，成色95新，电池健康88%。\n\n配件清单：\n- 手机本体\n- 原装数据线\n- 原装包装盒\n\n交易方式：\n支持本校自提，也可以送到宿舍楼下。\n\n备注：\n因换新机出闲置，平时使用很爱惜，屏幕一直贴膜，机身无划痕。',
  images: [
    'https://picsum.photos/seed/iphone13/500/500',
    'https://picsum.photos/seed/iphone13pro/500/500',
    'https://picsum.photos/seed/iphoneback/500/500',
    'https://picsum.photos/seed/iphoneside/500/500'
  ],
  sellerAvatar: '',
  sellerName: '小明同学',
  sellerSchool: '清华大学',
  sellerCredit: 98,
  sellerDeals: 23
})

// 推荐商品
const recommendProducts = ref([
  {
    id: 2,
    title: 'iPhone 12 Pro 128G',
    price: 3800,
    images: ['https://picsum.photos/seed/iphone12/200/200']
  },
  {
    id: 3,
    title: 'AirPods Pro 2代',
    price: 1200,
    images: ['https://picsum.photos/seed/airpods/200/200']
  },
  {
    id: 4,
    title: 'iPad Air 5 64G',
    price: 3200,
    images: ['https://picsum.photos/seed/ipad/200/200']
  },
  {
    id: 5,
    title: 'Apple Watch S8',
    price: 1800,
    images: ['https://picsum.photos/seed/watch/200/200']
  }
])

const contactSeller = () => {
  router.push(`/chat/${product.value.id}`)
}

const toggleFollow = () => {
  isFollowed.value = !isFollowed.value
  ElMessage.success(isFollowed.value ? '关注成功' : '已取消关注')
}

const buyNow = () => {
  ElMessage.success('已向卖家发送购买意向')
}

const toggleCollect = () => {
  isCollected.value = !isCollected.value
  ElMessage.success(isCollected.value ? '收藏成功' : '已取消收藏')
}

const shareProduct = () => {
  ElMessage.success('链接已复制到剪贴板')
}

const goToDetail = (id) => {
  router.push(`/product/${id}`)
  window.location.reload()
}

onMounted(() => {
  // 模拟获取商品详情
  console.log('获取商品ID:', productId)
})
</script>

<style scoped>
.product-detail-page {
  padding-bottom: 40px;
}

.detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 12px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.thumbnail:hover {
  border-color: #409EFF;
}

.thumbnail.active {
  border-color: #409EFF;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 16px;
  background: #fff5f5;
  border-radius: 8px;
}

.price {
  font-size: 32px;
  font-weight: bold;
  color: #f56c6c;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.product-tags {
  display: flex;
  gap: 8px;
}

.product-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  font-size: 14px;
}

.meta-item .label {
  color: #999;
  margin-right: 8px;
}

.product-description {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-description h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
}

.product-description p {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  white-space: pre-line;
}

.seller-card {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
}

.seller-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.seller-info h4 {
  font-size: 16px;
  margin-bottom: 4px;
}

.seller-info p {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.seller-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
}

.seller-actions {
  display: flex;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.buy-btn {
  flex: 1;
}

.recommend-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
}

.recommend-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.recommend-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.recommend-item {
  cursor: pointer;
  transition: all 0.3s;
}

.recommend-item:hover {
  transform: translateY(-4px);
}

.recommend-item img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 8px;
}

.recommend-title {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.recommend-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

@media (max-width: 768px) {
  .detail-container {
    grid-template-columns: 1fr;
  }
}
</style>
