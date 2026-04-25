<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <el-icon size="48" color="#409EFF"><Shop /></el-icon>
        <h1>校园二手市场</h1>
        <p>校园闲置物品交易平台</p>
      </div>

      <el-card class="login-card">
        <h2 class="login-title">欢迎登录</h2>
        
        <el-tabs v-model="loginType" class="login-tabs">
          <el-tab-pane label="密码登录" name="password">
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              class="login-form"
            >
              <el-form-item prop="phone">
                <el-input
                  v-model="passwordForm.phone"
                  placeholder="请输入手机号"
                  size="large"
                >
                  <template #prefix>
                    <el-icon><Iphone /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="passwordForm.password"
                  type="password"
                  placeholder="请输入密码"
                  size="large"
                  show-password
                  @keyup.enter="handlePasswordLogin"
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
                  class="login-btn"
                  :loading="loading"
                  @click="handlePasswordLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="验证码登录" name="sms">
            <el-form
              ref="smsFormRef"
              :model="smsForm"
              :rules="smsRules"
              class="login-form"
            >
              <el-form-item prop="phone">
                <el-input
                  v-model="smsForm.phone"
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
                    v-model="smsForm.code"
                    placeholder="请输入验证码"
                    size="large"
                    @keyup.enter="handleSmsLogin"
                  >
                    <template #prefix>
                      <el-icon><Message /></el-icon>
                    </template>
                  </el-input>
                  <el-button
                    :disabled="countdown > 0"
                    @click="sendCode"
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
                  class="login-btn"
                  :loading="loading"
                  @click="handleSmsLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="login-footer">
          <span>还没有账号？</span>
          <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
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

const loginType = ref('password')
const loading = ref(false)
const countdown = ref(0)

const passwordFormRef = ref(null)
const smsFormRef = ref(null)

const passwordForm = reactive({
  phone: '',
  password: ''
})

const smsForm = reactive({
  phone: '',
  code: ''
})

const passwordRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

const smsRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

const handlePasswordLogin = async () => {
  const valid = await passwordFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    // 模拟登录
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userStore.setToken('mock_token_' + Date.now())
    userStore.setUserInfo({
      id: 1,
      phone: passwordForm.phone,
      nickname: '校园用户',
      avatar: ''
    })
    
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleSmsLogin = async () => {
  const valid = await smsFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userStore.setToken('mock_token_' + Date.now())
    userStore.setUserInfo({
      id: 1,
      phone: smsForm.phone,
      nickname: '校园用户',
      avatar: ''
    })
    
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const sendCode = () => {
  if (!smsForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  
  // 模拟发送验证码
  ElMessage.success('验证码已发送')
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
  color: #fff;
}

.login-header h1 {
  font-size: 28px;
  margin: 16px 0 8px;
}

.login-header p {
  font-size: 14px;
  opacity: 0.9;
}

.login-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.login-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
  color: #333;
}

.login-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 20px;
}

.login-form {
  padding: 20px;
}

.login-btn {
  width: 100%;
}

.code-input {
  display: flex;
  gap: 12px;
}

.code-input .el-input {
  flex: 1;
}

.login-footer {
  text-align: center;
  padding: 16px 20px;
  border-top: 1px solid #e8e8e8;
  color: #666;
}
</style>
