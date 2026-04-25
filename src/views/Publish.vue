<template>
  <div class="publish-page">
    <div class="publish-container">
      <h2 class="page-title">发布商品</h2>
      
      <el-steps :active="currentStep" finish-status="success" class="publish-steps">
        <el-step title="选择分类" />
        <el-step title="上传图片" />
        <el-step title="填写信息" />
        <el-step title="设置交易" />
      </el-steps>

      <!-- 步骤1：选择分类 -->
      <div v-if="currentStep === 0" class="step-content">
        <h3>请选择商品分类</h3>
        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            :class="{ active: selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <el-icon size="32"><component :is="category.icon" /></el-icon>
            <span>{{ category.name }}</span>
          </div>
        </div>
        <div class="step-actions">
          <el-button type="primary" size="large" :disabled="!selectedCategory" @click="nextStep">
            下一步
          </el-button>
        </div>
      </div>

      <!-- 步骤2：上传图片 -->
      <div v-if="currentStep === 1" class="step-content">
        <h3>上传商品图片（最多5张）</h3>
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :limit="5"
          :on-exceed="handleExceed"
          :on-change="handleImageChange"
          :on-remove="handleRemove"
          class="upload-area"
        >
          <el-icon><Plus /></el-icon>
          <template #tip>
            <div class="upload-tip">
              支持 JPG、PNG 格式，单张不超过 5MB
            </div>
          </template>
        </el-upload>
        <div class="step-actions">
          <el-button size="large" @click="prevStep">上一步</el-button>
          <el-button type="primary" size="large" :disabled="fileList.length === 0" @click="nextStep">
            下一步
          </el-button>
        </div>
      </div>

      <!-- 步骤3：填写信息 -->
      <div v-if="currentStep === 2" class="step-content">
        <el-form
          ref="infoFormRef"
          :model="infoForm"
          :rules="infoRules"
          label-width="100px"
          class="info-form"
        >
          <el-form-item label="商品标题" prop="title">
            <el-input
              v-model="infoForm.title"
              placeholder="请输入商品标题，简洁明了"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="商品描述" prop="description">
            <el-input
              v-model="infoForm.description"
              type="textarea"
              :rows="5"
              placeholder="详细描述商品的品牌、型号、成色、功能状态等信息"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="价格" prop="price">
            <el-input-number
              v-model="infoForm.price"
              :min="0"
              :max="10000"
              :precision="2"
              :step="10"
              style="width: 200px"
            />
            <span class="form-tip">元</span>
          </el-form-item>

          <el-form-item label="原价" prop="originalPrice">
            <el-input-number
              v-model="infoForm.originalPrice"
              :min="0"
              :max="10000"
              :precision="2"
              :step="10"
              style="width: 200px"
            />
            <span class="form-tip">元（选填）</span>
          </el-form-item>

          <el-form-item label="成色" prop="condition">
            <el-radio-group v-model="infoForm.condition">
              <el-radio-button label="全新">全新</el-radio-button>
              <el-radio-button label="99新">99新</el-radio-button>
              <el-radio-button label="95新">95新</el-radio-button>
              <el-radio-button label="9成新">9成新</el-radio-button>
              <el-radio-button label="8成新">8成新</el-radio-button>
              <el-radio-button label="战损">战损</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="可议价">
            <el-switch v-model="infoForm.canBargain" />
          </el-form-item>
        </el-form>
        <div class="step-actions">
          <el-button size="large" @click="prevStep">上一步</el-button>
          <el-button type="primary" size="large" @click="validateInfoForm">
            下一步
          </el-button>
        </div>
      </div>

      <!-- 步骤4：设置交易 -->
      <div v-if="currentStep === 3" class="step-content">
        <el-form
          ref="tradeFormRef"
          :model="tradeForm"
          :rules="tradeRules"
          label-width="100px"
          class="trade-form"
        >
          <el-form-item label="交易方式" prop="tradeType">
            <el-radio-group v-model="tradeForm.tradeType">
              <el-radio-button label="pickup">自提</el-radio-button>
              <el-radio-button label="delivery">送货上门</el-radio-button>
              <el-radio-button label="both">均可</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="交易地点" prop="location" v-if="tradeForm.tradeType !== 'delivery'">
            <el-input
              v-model="tradeForm.location"
              placeholder="请输入交易地点，如：图书馆门口、食堂等"
            />
          </el-form-item>

          <el-form-item label="包邮">
            <el-switch v-model="tradeForm.freeShipping" />
          </el-form-item>

          <el-form-item label="联系方式" prop="contact">
            <el-input
              v-model="tradeForm.contact"
              placeholder="请输入联系方式，如：微信、手机号等"
            />
          </el-form-item>
        </el-form>
        <div class="step-actions">
          <el-button size="large" @click="prevStep">上一步</el-button>
          <el-button type="primary" size="large" :loading="publishing" @click="submitPublish">
            发布商品
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const currentStep = ref(0)
const selectedCategory = ref('')
const fileList = ref([])
const publishing = ref(false)

const infoFormRef = ref(null)
const tradeFormRef = ref(null)

const categories = [
  { id: 'digital', name: '数码电子', icon: 'Cellphone' },
  { id: 'books', name: '图书教材', icon: 'Reading' },
  { id: 'clothes', name: '服装鞋帽', icon: 'ShoppingBag' },
  { id: 'sports', name: '运动户外', icon: 'Basketball' },
  { id: 'furniture', name: '家具家居', icon: 'House' },
  { id: 'beauty', name: '美妆护肤', icon: 'Brush' },
  { id: 'toys', name: '玩具乐器', icon: 'Headset' },
  { id: 'others', name: '其他', icon: 'More' }
]

const infoForm = reactive({
  title: '',
  description: '',
  price: undefined,
  originalPrice: undefined,
  condition: '95新',
  canBargain: true
})

const tradeForm = reactive({
  tradeType: 'pickup',
  location: '',
  freeShipping: false,
  contact: ''
})

const infoRules = {
  title: [
    { required: true, message: '请输入商品标题', trigger: 'blur' },
    { min: 5, max: 50, message: '标题长度5-50字', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度10-500字', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ],
  condition: [
    { required: true, message: '请选择成色', trigger: 'change' }
  ]
}

const tradeRules = {
  tradeType: [
    { required: true, message: '请选择交易方式', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入交易地点', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ]
}

const selectCategory = (id) => {
  selectedCategory.value = id
}

const nextStep = () => {
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const handleExceed = () => {
  ElMessage.warning('最多上传5张图片')
}

const handleImageChange = (file) => {
  // 图片预览处理
  const reader = new FileReader()
  reader.onload = (e) => {
    file.url = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const handleRemove = () => {
  // 处理图片移除
}

const validateInfoForm = async () => {
  const valid = await infoFormRef.value?.validate().catch(() => false)
  if (valid) {
    nextStep()
  }
}

const submitPublish = async () => {
  const valid = await tradeFormRef.value?.validate().catch(() => false)
  if (!valid) return

  publishing.value = true
  try {
    // 模拟发布请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    ElMessage.success('发布成功！商品正在审核中')
    router.push('/')
  } catch (error) {
    ElMessage.error('发布失败，请重试')
  } finally {
    publishing.value = false
  }
}
</script>

<style scoped>
.publish-page {
  padding-bottom: 40px;
}

.publish-container {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.publish-steps {
  margin-bottom: 40px;
}

.step-content {
  max-width: 700px;
  margin: 0 auto;
}

.step-content h3 {
  font-size: 18px;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:hover {
  border-color: #409EFF;
  background: #f5f7fa;
}

.category-card.active {
  border-color: #409EFF;
  background: #ecf5ff;
  color: #409EFF;
}

.upload-area :deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 120px;
}

.upload-area :deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 120px;
}

.upload-tip {
  margin-top: 12px;
  color: #999;
  font-size: 13px;
}

.info-form,
.trade-form {
  margin-bottom: 32px;
}

.form-tip {
  margin-left: 8px;
  color: #999;
  font-size: 13px;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
