<template>
  <a-space
    id="registry-box"
    direction="vertical"
  >
    <div id="registry-box-title-box">
      <h2 id="registry-box-title">
        {{ $t('LoginToOVINC') }}
      </h2>
    </div>
    <a-form
      id="registry-box-form"
      ref="registryFormRef"
      :model="registryData"
      @submit="handleSubmit"
      auto-label-width
    >
      <a-form-item
        field="username"
        :label="$t('Username')"
        :rules="registryRules.username"
        feedback
      >
        <a-input
          v-model="registryData.username"
          :disabled="loading"
          :placeholder="$t('Username')"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="nick_name"
        :label="$t('NickName')"
        :rules="registryRules.nick_name"
        feedback
      >
        <a-input
          v-model="registryData.nick_name"
          :disabled="loading"
          :placeholder="$t('NickName')"
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
        :rules="registryRules.password"
        feedback
      >
        <a-input-password
          v-model="registryData.password"
          :disabled="loading"
          :placeholder="$t('Password')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="password2"
        :label="$t('Password')"
        :rules="registryRules.password2"
        feedback
      >
        <a-input-password
          v-model="registryData.password2"
          :disabled="loading"
          :placeholder="$t('repeatPassword')"
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
            @click="$refs.registryFormRef.resetFields()"
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
import {ref} from 'vue'
import { useI18n } from 'vue-i18n'
import { handleLoading } from '../utils/loading'
import { signUpAPI } from '../api/user'
import { Message, Modal } from '@arco-design/web-vue'

// loading
const loading = ref(false)

// emit
const emits = defineEmits(['loginRedirect'])

// i18n
const i18n = useI18n()

// form
const registryData = ref({
  username: '',
  nick_name: '',
  password: '',
  password2: ''
})
const password2Validator = (value, cb) => {
  if (registryData.value.password === registryData.value.password2) return
  return cb(i18n.t('Password2NotMatch'))
}
const registryRules = ref({
  username: [
    {required: true, message: i18n.t('UsernameRequired')},
  ],
  nick_name: [
    {required: true, message: i18n.t('NickNameRequired')},
  ],
  password: [
    {required: true, message: i18n.t('PasswordRequired')},
  ],
  password2: [
    {required: true, message: i18n.t('PasswordRequired')},
    {validator: password2Validator}
  ]
})

// registry
const handleSubmit = ({values, errors}) => {
  if (errors) return
  handleLoading(loading, true)
  signUpAPI(values).then(
    () => {
      Message.success(i18n.t('RegistrySuccess'))
      emits('loginRedirect')
    },
    err => Modal.warning({
      title: i18n.t('RegistryFailed'),
      content: err.response.data.message,
      modalStyle: {textAlign: 'center'},
      width: 340
    })
  )
  handleLoading(loading, false)
}
</script>

<style scoped>
#registry-box {
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border-1);
  box-sizing: border-box;
  box-shadow: var(--shadow2-center);
  overflow: hidden;
}

#registry-box-title-box {
  background: linear-gradient(-45deg, rgb(var(--arcoblue-4)), rgb(var(--green-2)));
  padding: 32px 20px;
  margin-bottom: 20px;
}

#registry-box-title {
  text-align: center;
  margin: 0;
  color: var(--color-white);
}

#registry-box-form {
  width: 360px;
  padding: 20px;
}
</style>