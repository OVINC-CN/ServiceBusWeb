<template>
  <a-space
    id="permission-mine"
    direction="vertical"
    :size="[20, 20]"
  >
    <a-form
      layout="inline"
      :model="formData"
      auto-label-width
      id="permission-mine-header-form"
    >
      <a-form-item :label="$t('App')">
        <a-select
          :loading="appsLoading"
          v-model="formData.app"
          :style="{width: '200px'}"
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
      <a-form-item :label="$t('Permission')">
        <a-space>
          <a-button
            @click="reload"
            :disabled="!formData.app"
          >
            <template #icon>
              <icon-refresh />
            </template>
          </a-button>
          <a-trigger
            position="top"
            :unmount-on-close="false"
            trigger="click"
          >
            <a-button>
              <template #icon>
                <icon-question />
              </template>
            </a-button>
            <template #content>
              <div id="permission-mine-header-help-content">
                {{ $t('deniedWontShow') }}
              </div>
            </template>
          </a-trigger>
        </a-space>
      </a-form-item>
    </a-form>
    <a-divider :style="{margin: 0}" />
    <permission-table
      :app="formData.app"
      ref="permissionTable"
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
const appsLoading = ref(true)
const apps = ref([])
const loadApps = () => {
  handleLoading(appsLoading, true)
  listAllAppAPI({}).then(
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
const reload = () => permissionTable.value.loadPermissions()
</script>

<style scoped>
#permission-mine {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-shadow: var(--shadow2-center);
  margin-right: 20px;
  box-sizing: border-box;
  border-radius: var(--border-radius-medium);
}

#permission-mine-header-form > :deep(.arco-form-item-layout-inline) {
  margin-bottom: 0;
}

#permission-mine-header-help-content {
  background: var(--color-neutral-1);
  padding: 10px;
  box-sizing: border-box;
  box-shadow: var(--shadow1-center);
  color: var(--color-text-1);
}
</style>
