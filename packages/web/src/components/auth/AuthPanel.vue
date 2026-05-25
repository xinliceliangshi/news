<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { login, register } from '../../api/auth'
import { HttpError } from '../../api/client'

const router = useRouter()

const activeTab = ref<'login' | 'register'>('login')
const isLoginSubmitting = ref(false)
const isRegisterSubmitting = ref(false)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const panelHint = computed(() =>
  activeTab.value === 'login'
    ? '已有账号就直接进入争议流程，系统会把你送到投票页。'
    : '第一次来先注册，完成后会直接进入投票页开始站队。'
)

async function handleLogin() {
  if (!loginForm.value.email || !loginForm.value.password) {
    ElMessage.warning('请输入邮箱和密码')
    return
  }

  isLoginSubmitting.value = true

  try {
    const result = await login(loginForm.value)
    ElMessage.success(`${result.message}：${result.data.nickname}`)
    await router.push({ name: 'vote' })
  } catch (error: unknown) {
    ElMessage.error(error instanceof HttpError ? error.message : '登录失败，请稍后重试')
  } finally {
    isLoginSubmitting.value = false
  }
}

async function handleRegister() {
  if (!registerForm.value.email || !registerForm.value.password) {
    ElMessage.warning('请输入邮箱和密码')
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }

  isRegisterSubmitting.value = true

  try {
    const result = await register(registerForm.value)
    ElMessage.success(`${result.message}：${result.data.nickname}`)
    await router.push({ name: 'vote' })
  } catch (error: unknown) {
    ElMessage.error(error instanceof HttpError ? error.message : '注册失败，请稍后重试')
  } finally {
    isRegisterSubmitting.value = false
  }
}
</script>

<template>
  <section class="auth-panel">
    <div class="auth-panel__glow" />

    <div class="auth-panel__header">
      <span class="badge">用户入口</span>
      <h2>欢迎回来，也欢迎第一次来站队。</h2>
      <p>{{ panelHint }}</p>
    </div>

    <el-tabs v-model="activeTab" class="auth-tabs" stretch>
      <el-tab-pane label="登录" name="login">
        <el-form :model="loginForm" label-position="top" class="auth-form">
          <el-form-item label="邮箱">
            <el-input v-model="loginForm.email" placeholder="you@example.com" size="large" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              v-model="loginForm.password"
              type="password"
              show-password
              placeholder="请输入密码"
              size="large"
            />
          </el-form-item>

          <div class="auth-form__meta">
            <el-checkbox label="记住我" />
            <button type="button" class="text-link">忘记密码？</button>
          </div>

          <el-button
            type="primary"
            size="large"
            class="auth-submit"
            :loading="isLoginSubmitting"
            @click="handleLogin"
          >
            登录进入
          </el-button>

          <p class="auth-switch-tip">
            第一次来？
            <button type="button" class="text-link" @click="activeTab = 'register'">直接去注册</button>
          </p>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="注册" name="register">
        <el-form :model="registerForm" label-position="top" class="auth-form">
          <el-form-item label="昵称">
            <el-input v-model="registerForm.nickname" placeholder="给自己起个阵营代号" size="large" />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="registerForm.email" placeholder="you@example.com" size="large" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              v-model="registerForm.password"
              type="password"
              show-password
              placeholder="设置登录密码"
              size="large"
            />
          </el-form-item>

          <el-form-item label="确认密码">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              show-password
              placeholder="再次输入密码"
              size="large"
            />
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="auth-submit"
            :loading="isRegisterSubmitting"
            @click="handleRegister"
          >
            注册并开始围观
          </el-button>

          <p class="auth-switch-tip">
            已有账号？
            <button type="button" class="text-link" @click="activeTab = 'login'">切回登录</button>
          </p>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
