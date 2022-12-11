<template>
  <a-space
    id="permission-manage"
    direction="vertical"
    :size="[20, 20]"
  >
    <a-form
      layout="inline"
      :auto-label-width="true"
      id="permission-manage-header-form"
      :model="formData"
    >
      <a-form-item
        :label="$t('App')"
      >
        <a-select
          :style="{width: '200px'}"
          id="permission-manager-header-app-select"
          :loading="appsLoading"
          v-model="formData.app"
          :allow-search="true"
        >
          <a-option
            v-for="item in apps"
            :value="item.app_code"
            :key="item.app_code"
          >
            {{ item.app_name }}&nbsp;({{ item.app_code }})
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('ApplyData')">
        <a-button
          @click="loadPermission"
          :disabled="!formData.app"
        >
          <template #icon>
            <icon-refresh />
          </template>
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider style="margin: 0" />
    <permission-table
      ref="permissionTable"
      :is-manage="true"
      :app="formData.app"
    />
  </a-space>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { handleLoading } from '../../utils/loading'
import { listAllAppAPI } from '../../api/app'
import { Message } from '@arco-design/web-vue'
import PermissionTable from '../../components/PermissionTable.vue'

// form
const formData = ref({
  app: ''
})

// apps
const appsLoading = ref(false)
const apps = ref([])
const loadApps = () => {
  handleLoading(appsLoading, true)
  listAllAppAPI({is_manager: true}).then(
    res => {
      apps.value = res.data
      if (apps.value.length > 0) formData.value.app = apps.value[0].app_code
    },
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(appsLoading, false))
}
onMounted(() => loadApps())

// reload
const permissionTable = ref(null)
const loadPermission = () => permissionTable.value.loadPermissions()
</script>

<style scoped>
#permission-manage {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-shadow: var(--shadow2-center);
  margin-right: 20px;
  box-sizing: border-box;
  border-radius: var(--border-radius-medium);
}

#permission-manage-header-form > :deep(.arco-form-item-layout-inline) {
  margin-bottom: 0;
}
</style>
