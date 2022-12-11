<template>
  <a-space
    id="permission-apply"
    direction="vertical"
    :size="[20, 20]"
  >
    <a-form
      ref="formRef"
      layout="vertical"
      :model="formData"
      :auto-label-width="true"
      @submit="onSubmit"
    >
      <a-form-item
        :label="$t('App')"
        field="app_code"
        :rules="rules.app_code"
        feedback
      >
        <a-select
          v-model="formData.app_code"
          :loading="appLoading"
          :disabled="loading"
          :allow-search="true"
        >
          <a-option
            v-for="item in apps"
            :key="item.app_code"
            :value="item.app_code"
          >
            {{ item.app_name }}&nbsp;({{ item.app_code }})
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('Action')"
        field="action"
        :rules="rules.action"
        feedback
      >
        <a-select
          v-model="formData.action"
          :loading="actionLoading"
          :disabled="loading"
          :allow-search="true"
        >
          <a-option
            v-for="item in actions"
            :key="item.id"
            :value="item.id"
          >
            {{ item.action_name }}&nbsp;({{ item.action_id }})
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('isAllInstance')"
        field="all_instances"
        feedback
      >
        <a-switch
          v-model="formData.all_instances"
          :disabled="permissionLoading || loading"
        />
      </a-form-item>
      <a-form-item
        :label="$t('Instances')"
        field="instances"
        feedback
        v-show="!formData.all_instances"
      >
        <a-transfer
          id="permission-apply-instance-transfer"
          :disabled="instanceLoading || permissionLoading || loading"
          :style="{width: '100%'}"
          :data="instances"
          v-model="formData.instances"
          :show-search="true"
          :show-select-all="false"
          :title="[$t('Instances'), $t('AppliedInstance')]"
        />
      </a-form-item>
      <a-form-item style="margin-bottom: 0">
        <a-space>
          <a-button
            @click="$refs.formRef.resetFields()"
            :loading="loading || permissionLoading"
          >
            {{ $t('Reset') }}
          </a-button>
          <a-button
            html-type="submit"
            type="primary"
            :loading="loading || permissionLoading"
          >
            {{ $t('Submit') }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-space>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { handleLoading } from '../../utils/loading'
import { listAllAppAPI } from '../../api/app'
import { Message } from '@arco-design/web-vue'
import {
  applyPermissionAPI,
  editPermissionAPI,
  getUserPermissionAPI,
  listActionAllAPI,
  listInstanceAllAPI
} from '../../api/permission'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// i18n
const i18n = useI18n()

// router
const router = useRouter()

// form
const formData = ref({
  app_code: '',
  action: '',
  instances: [],
  all_instances: false
})
const rules = ref({
  app_code: [
    {required: true, message: i18n.t('AppCodeRequired')}
  ],
  action: [
    {required: true, message: i18n.t('ActionRequired')}
  ]
})

// app
const appLoading = ref(false)
const apps = ref([])
const loadApps = () => {
  handleLoading(appLoading, true)
  listAllAppAPI({}).then(
    res => apps.value = res.data,
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(appLoading, false))
}
onMounted(() => loadApps())

// action
const actions = ref([])
const actionLoading = ref(false)
const loadActions = () => {
  handleLoading(actionLoading, true)
  listActionAllAPI(formData.value.app_code).then(
    res => actions.value = res.data,
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(actionLoading, false))
}
watch(() => formData.value.app_code, val => {
  actions.value = []
  formData.value.action = ''
  if (val) loadActions()
})

// instance
const instances = ref([])
const instanceLoading = ref(false)
const loadInstance = () => {
  handleLoading(instanceLoading, true)
  listInstanceAllAPI(formData.value.action).then(
    res => {
      instances.value = res.data.map(item => {
        const _instance = {
          value: item.id,
          label: item.instance_name + ' (' + item.instance_id + ')'
        }
        console.log(_instance)
        return _instance
      })
    },
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(instanceLoading, false))
}
watch(() => formData.value.action, val => {
  instances.value = []
  formData.value.instances = []
  if (val) loadInstance()
})

// permission
const permissionLoading = ref(false)
const currentPermission = ref({})
const loadPermission = () => {
  handleLoading(permissionLoading, true)
  getUserPermissionAPI(formData.value.app_code, formData.value.action, 1, 1).then(
    res => {
      if (res.data.total > 0) {
        currentPermission.value = res.data.results[0]
        formData.value.instances = currentPermission.value.instances.map(item => item.id)
        formData.value.all_instances = currentPermission.value.all_instances
      }
    },
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(permissionLoading, false))
}
watch(() => formData.value.action, val => {
  currentPermission.value = {}
  if (val) loadPermission()
})

// submit
const loading = ref(false)
const onSubmit = ({errors}) => {
  if (errors) return
  handleLoading(loading, true)
  let promise
  if (currentPermission.value.id) {
    promise = editPermissionAPI(currentPermission.value.id, formData.value)
  } else {
    promise = applyPermissionAPI(formData.value)
  }
  promise.then(
    () => window.location.href = '/permission/mine/',
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(loading, false))
}
</script>

<style scoped>
#permission-apply {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-shadow: var(--shadow2-center);
  margin-right: 20px;
  box-sizing: border-box;
  border-radius: var(--border-radius-medium);
}

#permission-apply-instance-transfer > :deep(.arco-transfer-view) {
  width: 100%;
  height: calc(100vh - 540px);
}
</style>
