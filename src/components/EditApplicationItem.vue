<template>
  <a-modal
    :visible="visible"
    @cancel="emits('changeVisible')"
    :unmount-on-close="true"
    :closable="true"
    :title="isCreate ? $t('createApp') : $t('editApp') + '&nbsp;(' + app.app_name + ')'"
    :ok-text="$t('Submit')"
    :footer="false"
  >
    <a-form
      :auto-label-width="true"
      :model="app"
      @submit="doSubmit"
    >
      <a-form-item
        field="app_code"
        :label="$t('AppCode')"
        :rules="rules.app_code"
      >
        <a-input
          :disabled="!isCreate || loading"
          v-model="app.app_code"
        />
      </a-form-item>
      <a-form-item
        v-if="isCreate"
        field="app_secret"
        :label="$t('AppSecret')"
        :rules="rules.app_secret"
      >
        <a-input
          :disabled="loading"
          v-model="app.app_secret"
        />
      </a-form-item>
      <a-form-item
        field="app_name"
        :label="$t('AppName')"
        :rules="rules.app_name"
      >
        <a-input
          :disabled="loading"
          v-model="app.app_name"
        />
      </a-form-item>
      <a-form-item
        field="managers"
        :label="$t('Managers')"
        :rules="rules.managers"
      >
        <a-select
          :loading="userLoading"
          multiple
          v-model="app.managers"
          :disabled="loading"
        >
          <a-option
            v-for="item of userOptions"
            :key="item.username"
            :value="item.username"
          >
            {{ item.nick_name ? item.username + '(' + item.nick_name + ')' : item.username }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="app_logo"
        :label="$t('AppLogo')"
        :rules="rules.app_logo"
      >
        <a-input
          v-model="app.app_logo"
          :disabled="loading"
        />
      </a-form-item>
      <a-form-item
        field="app_url"
        :label="$t('AppUrl')"
        :rules="rules.app_url"
      >
        <a-input
          v-model="app.app_url"
          :disabled="loading"
        />
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
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { searchUserAPI } from '../api/user'
import { Message } from '@arco-design/web-vue'
import { handleLoading } from '../utils/loading'
import { useI18n } from 'vue-i18n'
import { createAppAPI, editAppAPI } from '../api/app'

// props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isCreate: {
    type: Boolean,
    default: false
  },
  application: {
    type: Object,
    default: () => ({
      app_code: '',
      app_name: '',
      app_url: '',
      app_logo: '',
      managers: []
    })
  }
})
const emits = defineEmits(['changeVisible', 'success', 'createSuccess'])

// i18n
const i18n = useI18n()

// data
const app = ref({})
watch(() => props.visible, () => {
  if (props.visible) {
    app.value = JSON.parse(JSON.stringify(props.application))
    doSearch('')
  }
  if (app.value.managers) {
    const _managers = []
    app.value.managers.forEach(manager => _managers.push(manager.username))
    app.value.managers = _managers
  }
})

// user
const userOptions = ref([])
const userLoading = ref(false)
const doSearch = value => {
  handleLoading(userLoading, true)
  searchUserAPI(value).then(
    res => userOptions.value = res.data,
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(userLoading, false))
}

// submit
const doSubmit = ({values, errors}) => {
  if (errors) return
  if (props.isCreate) doCreate(values)
  else doUpdate(values)
}

// create
const doCreate = (values) => {
  handleLoading(loading, true)
  createAppAPI(values).then(
      () => {
        emits('changeVisible')
        emits('createSuccess')
      },
      err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(loading, false))
}

// update
const doUpdate = (values) => {
  handleLoading(loading, true)
  editAppAPI(values.app_code, values).then(
      res => {
        emits('changeVisible')
        emits('success', res.data)
      },
      err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(loading, false))
}

// validate
const loading = ref(false)
const urlValidator = (value, callback) => {
  if (!value || value.startsWith('https://')) {
    return
  }
  return callback({})
}
const rules = ref({
  app_code: [
    {required: true, message: i18n.t('AppCodeRequired')}
  ],
  app_secret: [
    {required: true, message: i18n.t('AppSecretRequired')}
  ],
  app_name: [
    {required: true, message: i18n.t('AppNameRequired')}
  ],
  managers: [
    {required: true, message: i18n.t('ManagersRequired')}
  ],
  app_url: [
    {validator: urlValidator, message: i18n.t('AppUrlInvalid')}
  ],
  app_logo: [
    {validator: urlValidator, message: i18n.t('AppLogoInvalid')}
  ]
})
</script>

<style scoped>

</style>
