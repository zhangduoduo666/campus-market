<template>
  <div class="home-page">
    <!-- 分类导航 -->
    <div class="category-section">
      <div class="category-list">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <el-icon size="24"><component :is="category.icon" /></el-icon>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选排序 -->
    <div class="filter-section">
      <div class="filter-left">
        <el-radio-group v-model="sortBy" size="small">
          <el-radio-button label="newest">最新发布</el-radio-button>
          <el-radio-button label="price_asc">价格最低</el-radio-button>
          <el-radio-button label="price_desc">价格最高</el-radio-button>
          <el-radio-button label="hot">最热商品</el-radio-button>
        </el-radio-group>
      </div>
      <div class="filter-right">
        <el-checkbox v-model="onlyCampus">仅看本校</el-checkbox>
        <el-checkbox v-model="freeShipping">包邮</el-checkbox>
        <el-input
          v-model="priceMin"
          placeholder="最低价"
          style="width: 80px"
          size="small"
        />
        <span>-</span>
        <el-input
          v-model="priceMax"
          placeholder="最高价"
          style="width: 80px"
          size="small"
        />
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="products-section">
      <div v-if="loading" class="loading-wrapper">
        <el-skeleton :rows="3" animated />
        <el-skeleton :rows="3" animated />
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="products.length === 0" class="empty-wrapper">
        <el-empty description="暂无商品" />
      </div>

      <div v-else class="products-grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
          @click="goToDetail(product.id)"
        >
          <div class="product-image">
            <img :src="product.images[0]" :alt="product.title" />
            <div v-if="product.status === 'sold'" class="sold-tag">已售出</div>
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-price">
              <span class="price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ¥{{ product.originalPrice }}
              </span>
            </div>
            <div class="product-meta">
              <div class="seller-info">
                <el-avatar :size="20" :src="product.sellerAvatar" />
                <span class="seller-name">{{ product.sellerName }}</span>
              </div>
              <span class="school-tag">{{ product.school }}</span>
            </div>
            <div class="product-stats">
              <span><el-icon><View /></el-icon> {{ product.views }}</span>
              <span><el-icon><ChatDotRound /></el-icon> {{ product.messages }}</span>
              <span>{{ product.publishTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 36, 48]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 分类数据
const categories = [
  { id: 'all', name: '全部', icon: 'Grid' },
  { id: 'digital', name: '数码电子', icon: 'Cellphone' },
  { id: 'books', name: '图书教材', icon: 'Reading' },
  { id: 'clothes', name: '服装鞋帽', icon: 'ShoppingBag' },
  { id: 'sports', name: '运动户外', icon: 'Basketball' },
  { id: 'furniture', name: '家具家居', icon: 'House' },
  { id: 'beauty', name: '美妆护肤', icon: 'Brush' },
  { id: 'toys', name: '玩具乐器', icon: 'Headset' },
  { id: 'others', name: '其他', icon: 'More' }
]

// 状态
const selectedCategory = ref('all')
const sortBy = ref('newest')
const onlyCampus = ref(false)
const freeShipping = ref(false)
const priceMin = ref('')
const priceMax = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(100)

// 模拟商品数据
const products = ref([
  {
    id: 1,
    title: 'iPhone 13 Pro Max 256G 远峰蓝',
    description: '国行正品，使用一年，成色95新，电池健康88%',
    price: 5800,
    originalPrice: 8999,
    images: ['https://picsum.photos/seed/iphone/300/300'],
    sellerAvatar: '',
    sellerName: '小明同学',
    school: '清华大学',
    views: 234,
    messages: 12,
    publishTime: '2小时前',
    status: 'active'
  },
  {
    id: 2,
    title: '考研数学复习全书',
    description: '李永乐版，全新未拆封，买多了出一本',
    price: 45,
    originalPrice: 89,
    images: ['https://picsum.photos/seed/book/300/300'],
    sellerAvatar: '',
    sellerName: '学霸学姐',
    school: '北京大学',
    views: 56,
    messages: 3,
    publishTime: '5小时前',
    status: 'active'
  },
  {
    id: 3,
    title: 'Nike Air Force 1 纯白 42码',
    description: '穿过几次，清洗干净，鞋盒还在',
    price: 380,
    originalPrice: 749,
    images: ['https://picsum.photos/seed/shoes/300/300'],
    sellerAvatar: '',
    sellerName: '运动达人',
    school: '复旦大学',
    views: 128,
    messages: 8,
    publishTime: '1天前',
    status: 'active'
  },
  {
    id: 4,
    title: '宜家台灯',
    description: '毕业出闲置，功能完好，暖光护眼',
    price: 35,
    originalPrice: 99,
    images: ['https://picsum.photos/seed/lamp/300/300'],
    sellerAvatar: '',
    sellerName: '毕业生',
    school: '上海交通大学',
    views: 89,
    messages: 5,
    publishTime: '2天前',
    status: 'active'
  },
  {
    id: 5,
    title: 'MacBook Air M1 8+256',
    description: '无磕碰无划痕，箱说全，送电脑包',
    price: 5200,
    originalPrice: 7999,
    images: ['https://picsum.photos/seed/macbook/300/300'],
    sellerAvatar: '',
    sellerName: '程序员',
    school: '浙江大学',
    views: 567,
    messages: 34,
    publishTime: '3小时前',
    status: 'active'
  },
  {
    id: 6,
    title: '尤尼克斯羽毛球拍',
    description: '天斧100zz，3U5，刚穿的AB线26磅',
    price: 850,
    originalPrice: 1540,
    images: ['https://picsum.photos/seed/racket/300/300'],
    sellerAvatar: '',
    sellerName: '羽球少年',
    school: '南京大学',
    views: 234,
    messages: 15,
    publishTime: '6小时前',
    status: 'sold'
  }
])

// 方法
const selectCategory = (id) => {
  selectedCategory.value = id
  currentPage.value = 1
  fetchProducts()
}

const fetchProducts = async () => {
  loading.value = true
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 500))
  loading.value = false
}

const goToDetail = (id) => {
  router.push(`/product/${id}`)
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchProducts()
}

// 监听搜索关键词
watch(() => route.query.keyword, (newVal) => {
  if (newVal) {
    // 执行搜索
    fetchProducts()
  }
})

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.home-page {
  padding-bottom: 40px;
}

.category-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 80px;
}

.category-item:hover {
  background: #f5f7fa;
}

.category-item.active {
  background: #409EFF;
  color: #fff;
}

.category-item span {
  font-size: 14px;
}

.filter-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.products-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.empty-wrapper {
  padding: 60px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e8e8e8;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sold-tag {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 8px 24px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 4px;
}

.product-info {
  padding: 16px;
}

.product-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.seller-name {
  font-size: 13px;
  color: #666;
}

.school-tag {
  font-size: 12px;
  color: #409EFF;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.product-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.product-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}
</style>
