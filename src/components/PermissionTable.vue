<template>
  <a-spin
    dot
    :loading="loading"
  >
    <a-table
      :data="data"
      :columns="columns"
      :pagination="pagination"
      :scroll="{y: tableHeight}"
      :scrollbar="true"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <template #status="{ record }">
        <a-tag :color="getColor(record.status)">
          <icon-loading v-if="record.status === 'dealing'" />
          <icon-check-circle v-if="record.status === 'allowed'" />
          <icon-stop v-if="record.status === 'denied'" />
          <span style="margin-left: 6px">{{ statusMap[record.status] }}</span>
        </a-tag>
      </template>
      <template #instances="{ record }">
        <a-button
          type="outline"
          size="mini"
          :disabled="!record.instances.length || record.all_instances"
          @click="showInstances(record.instances)"
        >
          {{ $t('Instances') }}({{ record.instances.length }})
        </a-button>
      </template>
      <template #all_instances="{ record }">
        <a-tag
          v-if="record.all_instances"
          color="green"
        >
          {{ $t('Yes') }}
        </a-tag>
        <a-tag v-else>
          {{ $t('No') }}
        </a-tag>
      </template>
      <template #optional="{record}">
        <a-space>
          <a-button
            :disabled="record.status !== 'dealing'"
            status="success"
            size="mini"
            @click="dealApply(record.id, 'allowed')"
          >
            {{ $t('Allow') }}
          </a-button>
          <a-button
            status="warning"
            size="mini"
            @click="dealApply(record.id, 'denied')"
          >
            {{ $t('Deny') }}
          </a-button>
        </a-space>
      </template>
    </a-table>
  </a-spin>
  <action-instance-list
    :visible="instanceVisible"
    :data="instanceDisplay"
    @change-visible="changeInstanceVisible"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { handleLoading } from '../utils/loading'
import { dealManagePermissionAPI, getManagePermissionAPI, getUserPermissionAPI } from '../api/permission'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import ActionInstanceList from './ActionInstanceList.vue'

// i18n
const i18n = useI18n()

// props
const props = defineProps({
  app: {
    type: String,
    default: ''
  },
  isManage: {
    type: Boolean,
    default: false
  }
})

// table
const tableHeight = window.innerHeight - 360
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showPageSize: true
})
const onPageSizeChange = size => {
  pagination.value.pageSize = size
  pagination.value.current = 1
  loadPermissions()
}
const onPageChange = current => {
  pagination.value.current = current
  loadPermissions()
}
const columns = ref([
  {
    title: i18n.t('Status'),
    slotName: 'status'
  },
  {
    title: i18n.t('ActionID'),
    dataIndex: 'action_id'
  },
  {
    title: i18n.t('ActionName'),
    dataIndex: 'action_name'
  },
  {
    title: i18n.t('isAllInstance'),
    slotName: 'all_instances'
  },
  {
    title: i18n.t('UpdateAt'),
    dataIndex: 'update_at'
  },
  {
    title: i18n.t('Instances'),
    slotName: 'instances'
  },
])
if (props.isManage) {
  columns.value.splice(1, 0 ,{
    title: i18n.t('Username'),
    dataIndex: 'user'
  })
  columns.value.push({
    title: i18n.t('Optional'),
    slotName: 'optional'
  })
}

// data
const loading = ref(false)
const data = ref([])
const loadPermissions = () => {
  handleLoading(loading, true)
  let promise
  if (props.isManage) {
    promise = getManagePermissionAPI(props.app, pagination.value.current, pagination.value.pageSize)
  } else {
    promise = getUserPermissionAPI(props.app, '', pagination.value.current, pagination.value.pageSize)
  }
  promise.then(
    res => {
      pagination.value.total = res.data.total
      data.value = res.data.results
    },
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(loading, false))
}
const statusMap = ref({
  denied: i18n.t('Denied'),
  allowed: i18n.t('Allowed'),
  dealing: i18n.t('Dealing'),
})
const getColor = (status) => {
  if (status === 'allowed') return 'green'
  if (status === 'allowed') return 'red'
  return ''
}
watch(() => props.app, val => {
  if (!val) return
  pagination.value.current = 1
  loadPermissions()
})

// instance
const instanceVisible = ref(false)
const instanceDisplay = ref([])
const showInstances = instances => {
  instanceDisplay.value = instances
  changeInstanceVisible()
}
const changeInstanceVisible = () => instanceVisible.value = !instanceVisible.value

// deal
const dealing = ref(false)
const dealApply = (id, status) => {
  handleLoading(dealing, true)
  dealManagePermissionAPI(id, status).then(
    () => loadPermissions(),
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(dealing, false))
}

// expose
defineExpose({loadPermissions})
</script>

<style scoped>

</style>
