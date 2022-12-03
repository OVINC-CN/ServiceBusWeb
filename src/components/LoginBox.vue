<template>
  <a-space
    id="login-box"
    direction="vertical"
  >
    <div id="login-box-title-box">
      <h2 id="login-box-title">
        {{ $t('LoginToOVINC') }}
      </h2>
    </div>
    <a-form
      id="login-box-form"
      ref="formRef"
      :model="loginForm"
      @submit="handleSubmit"
      auto-label-width
    >
      <a-form-item
        field="username"
        :label="$t('Username')"
        :rules="loginFormRules.username"
        feedback
      >
        <a-input
          v-model="loginForm.username"
          :disabled="loading"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :label="$t('Password')"
        :rules="loginFormRules.password"
        feedback
      >
        <a-input-password
          v-model="loginForm.password"
          :disabled="loading"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            @click="$refs.formRef.resetFields()"
            :loading="loading"
          >
            {{ $t('Reset') }}
          </a-button>
          <a-button
            html-type="submit"
            type="primary"
            :loading="loading"
          >
            {{ $t('Submit') }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-space>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { signInAPI } from '../api/user'
import { Message, Modal } from '@arco-design/web-vue'
import { handleLoading } from '../utils/loading'

// loading
const loading = ref(false)

// emit
const emits = defineEmits(['loginRedirect'])

// locale
const i18n = useI18n()

// form
const loginForm = ref({
  username: '',
  password: ''
})
const loginFormRules = ref({
  username: [
    {required: true, message: i18n.t('UsernameRequired')}
  ],
  password: [
    {required: true, message: i18n.t('PasswordRequired')}
  ]
})

// login
const handleSubmit = ({values, errors}) => {
  if (errors) return
  handleLoading(loading, true)
  signInAPI(values).then(
    () => {
      Message.info(i18n.t('LoginSuccess'))
      emits('loginRedirect')
    },
    err => Modal.warning({
      title: i18n.t('LoginFailed'),
      content: err.response.data.message,
      modalStyle: {textAlign: 'center'},
      width: 340
    })
  ).finally(() =>   handleLoading(loading, false))
}
</script>

<style scoped>
#login-box {
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border-1);
  box-sizing: border-box;
  box-shadow: var(--shadow2-center);
  overflow: hidden;
}

#login-box-title-box {
  background: linear-gradient(-45deg, rgb(var(--arcoblue-4)), rgb(var(--green-2)));
  padding: 32px 20px;
  margin-bottom: 20px;
}

#login-box-title {
  text-align: center;
  margin: 0;
  color: var(--color-white);
}

#login-box-form {
  width: 360px;
  padding: 20px;
}
</style>