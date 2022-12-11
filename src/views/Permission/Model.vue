<template>
  <a-space
    id="permission-model"
    direction="vertical"
    :size="[20, 20]"
  >
    <a-space
      id="permission-model-header"
    >
      <a-form
        layout="inline"
        :auto-label-width="true"
        id="permission-model-header-form"
        :model="formData"
      >
        <a-form-item
          :label="$t('App')"
        >
          <a-select
            :style="{width: '200px'}"
            id="permission-model-header-app-select"
            :loading="appsLoading"
            v-model="formData.currentApp"
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
        <a-form-item :label="$t('ModelData')">
          <a-space>
            <a-button
              @click="reloadModel"
              :disabled="!formData.currentApp"
            >
              <template #icon>
                <icon-refresh />
              </template>
            </a-button>
            <a-button
              @click="changeAddModelVisible"
              :disabled="!formData.currentApp"
            >
              <template #icon>
                <icon-plus />
              </template>
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-space>
    <a-divider style="margin: 0" />
    <application-model
      ref="model"
      :app-code="formData.currentApp"
    />
  </a-space>
  <edit-action
    :visible="addModelVisible"
    :is-create="true"
    :app-code="formData.currentApp"
    @change-visible="changeAddModelVisible"
    @create-success="onCreateSuccess"
  />
</template>

<script setup>
import { listAllAppAPI } from '../../api/app'
import { onMounted, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { handleLoading } from '../../utils/loading'
import ApplicationModel from '../../components/ApplicationModel.vue'
import EditAction from '../../components/EditAction.vue'

// apps
const formData = ref({
  currentApp: ''
})
const appsLoading = ref(true)
const apps = ref([])
const loadApps = () => {
  handleLoading(appsLoading, true)
  listAllAppAPI({is_manager: true}).then(
      res => {
        apps.value = res.data
        if (apps.value.length > 0) formData.value.currentApp = apps.value[0].app_code
      },
      err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(appsLoading, false))
}
onMounted(() => loadApps())

// model
const model = ref(null)
const reloadModel = () => model.value.reload()
const addModelVisible = ref(false)
const changeAddModelVisible = () => addModelVisible.value = !addModelVisible.value
const onCreateSuccess = () => {
  changeAddModelVisible()
  reloadModel()
}
</script>

<style scoped>
#permission-model {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-shadow: var(--shadow2-center);
  margin-right: 20px;
  box-sizing: border-box;
  border-radius: var(--border-radius-medium);
}

#permission-model-header-form > :deep(.arco-form-item-layout-inline) {
  margin-bottom: 0;
}
</style>
