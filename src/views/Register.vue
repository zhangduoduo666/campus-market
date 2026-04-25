<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <el-icon size="48" color="#409EFF"><Shop /></el-icon>
        <h1>校园二手市场</h1>
        <p>校园闲置物品交易平台</p>
      </div>

      <el-card class="register-card">
        <h2 class="register-title">用户注册</h2>
        
        <el-steps :active="currentStep" finish-status="success" class="register-steps">
          <el-step title="验证学生证" />
          <el-step title="手机验证" />
          <el-step title="设置密码" />
          <el-step title="完善资料" />
        </el-steps>

        <!-- 步骤1：验证学生证 -->
        <div v-if="currentStep === 0" class="step-content">
          <el-form
            ref="studentFormRef"
            :model="studentForm"
            :rules="studentRules"
            class="register-form"
          >
            <el-form-item prop="studentId">
              <el-input
                v-model="studentForm.studentId"
                placeholder="请输入学生证号"
                size="large"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="school">
              <el-select
                v-model="studentForm.school"
                placeholder="请选择学校"
                size="large"
                style="width: 100%"
              >
                <el-option
                  v-for="school in schools"
                  :key="school.value"
                  :label="school.label"
                  :value="school.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="next-btn"
                :loading="loading"
                @click="verifyStudentId"
              >
                下一步
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤2：手机验证 -->
        <div v-if="currentStep === 1" class="step-content">
          <el-form
            ref="phoneFormRef"
            :model="phoneForm"
            :rules="phoneRules"
            class="register-form"
          >
            <el-form-item prop="phone">
              <el-input
                v-model="phoneForm.phone"
                placeholder="请输入手机号"
                size="large"
              >
                <template #prefix>
                  <el-icon><Iphone /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="code">
              <div class="code-input">
                <el-input
                  v-model="phoneForm.code"
                  placeholder="请输入验证码"
                  size="large"
                >
                  <template #prefix>
                    <el-icon><Message /></el-icon>
                  </template>
                </el-input>
                <el-button
                  :disabled="countdown > 0"
                  @click="sendSmsCode"
                  size="large"
                >
                  {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="next-btn"
                :loading="loading"
                @click="verifyPhone"
              >
                下一步
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤3：设置密码 -->
        <div v-if="currentStep === 2" class="step-content">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            class="register-form"
          >
            <el-form-item prop="password">
              <el-input
                v-model="passwordForm.password"
                type="password"
                placeholder="请设置密码（至少6位，包含字母和数字）"
                size="large"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                size="large"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="next-btn"
                :loading="loading"
                @click="setPassword"
              >
                下一步
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤4：完善资料 -->
        <div v-if="currentStep === 3" class="step-content">
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            class="register-form"
          >
            <el-form-item>
              <div class="avatar-upload">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleAvatarChange"
                >
                  <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <span class="upload-tip">点击上传头像</span>
              </div>
            </el-form-item>

            <el-form-item prop="nickname">
              <el-input
                v-model="profileForm.nickname"
                placeholder="请输入昵称"
                size="large"
              >
                <template #prefix>
                  <el-icon><UserFilled /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="gender">
              <el-radio-group v-model="profileForm.gender">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="next-btn"
                :loading="loading"
                @click="completeRegister"
              >
                完成注册
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="register-footer">
          <span>已有账号？</span>
          <el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const currentStep = ref(0)
const loading = ref(false)
const countdown = ref(0)

const studentFormRef = ref(null)
const phoneFormRef = ref(null)
const passwordFormRef = ref(null)
const profileFormRef = ref(null)

const schools = [
  { label: '清华大学', value: 'tsinghua' },
  { label: '北京大学', value: 'peking' },
  { label: '复旦大学', value: 'fudan' },
  { label: '上海交通大学', value: 'sjtu' },
  { label: '浙江大学', value: 'zju' },
  { label: '南京大学', value: 'nju' }
]

const studentForm = reactive({
  studentId: '',
  school: ''
})

const phoneForm = reactive({
  phone: '',
  code: ''
})

const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})

const profileForm = reactive({
  avatar: '',
  nickname: '',
  gender: 'male'
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const studentRules = {
  studentId: [
    { required: true, message: '请输入学生证号', trigger: 'blur' }
  ],
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ]
}

const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

const passwordRules = {
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码需包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const profileRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度2-20位', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
}

const verifyStudentId = async () => {
  const valid = await studentFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    // 模拟验证学生证
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('学生证验证通过')
    currentStep.value = 1
  } catch (error) {
    ElMessage.error('学生证验证失败')
  } finally {
    loading.value = false
  }
}

const sendSmsCode = () => {
  if (!phoneForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  
  ElMessage.success('验证码已发送')
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const verifyPhone = async () => {
  const valid = await phoneFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('手机验证通过')
    currentStep.value = 2
  } finally {
    loading.value = false
  }
}

const setPassword = async () => {
  const valid = await passwordFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('密码设置成功')
    currentStep.value = 3
  } finally {
    loading.value = false
  }
}

const handleAvatarChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    profileForm.avatar = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const completeRegister = async () => {
  const valid = await profileFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userStore.setToken('mock_token_' + Date.now())
    userStore.setUserInfo({
      id: Date.now(),
      phone: phoneForm.phone,
      nickname: profileForm.nickname,
      avatar: profileForm.avatar,
      studentId: studentForm.studentId,
      school: studentForm.school,
      gender: profileForm.gender,
      bio: ''
    })
    
    ElMessage.success('注册成功！')
    router.push('/')
  } catch (error) {
    ElMessage.error('注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 500px;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
  color: #fff;
}

.register-header h1 {
  font-size: 28px;
  margin: 16px 0 8px;
}

.register-header p {
  font-size: 14px;
  opacity: 0.9;
}

.register-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.register-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
  color: #333;
}

.register-steps {
  margin-bottom: 32px;
  padding: 0 20px;
}

.step-content {
  padding: 0 20px;
}

.register-form {
  max-width: 360px;
  margin: 0 auto;
}

.next-btn {
  width: 100%;
}

.code-input {
  display: flex;
  gap: 12px;
}

.code-input .el-input {
  flex: 1;
}

.avatar-upload {
  text-align: center;
}

.avatar-uploader {
  display: inline-block;
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

.upload-tip {
  display: block;
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

.register-footer {
  text-align: center;
  padding: 16px 20px;
  border-top: 1px solid #e8e8e8;
  color: #666;
  margin-top: 20px;
}
</style>
