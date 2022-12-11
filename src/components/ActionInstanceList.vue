<template>
  <a-drawer
    :width="600"
    :visible="visible"
    unmount-on-close
    @cancel="emits('changeVisible')"
    :footer="!data.length"
  >
    <template #title>
      {{ $t('Instances') }}
      <span v-show="action.action_name">&nbsp;({{ action.action_name }})</span>
    </template>
    <template #footer>
      <div class="action-list-instance-operate-notice">
        {{ $t('instanceOnlyOperateByAPI') }}
      </div>
    </template>
    <a-spin
      dot
      :loading="loading"
    >
      <a-table
        :scrollbar="true"
        :scroll="{y: tableHeight}"
        :data="instances"
        :columns="columns"
        :pagination="data.length ? false : pagination"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      />
    </a-spin>
  </a-drawer>
</template>

<script setup>
import { listInstanceAPI } from '../api/permission'
import { ref, watch } from 'vue'
import { handleLoading } from '../utils/loading'
import { useI18n } from 'vue-i18n'

// props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  action: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: () => ([])
  }
})
const emits = defineEmits(['changeVisible'])

// i18n
const i18n = useI18n()

// table
const tableHeight = props.data.length ? window.innerHeight - 220 : window.innerHeight - 120
const columns = ref([
  {
    title: i18n.t('ID'),
    dataIndex: 'instance_id',
  },
  {
    title: i18n.t('InstanceName'),
    dataIndex: 'instance_name'
  }
])

// data
const loading = ref(false)
const instances = ref([])
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showPageSize: true
})
const loadInstance = () => {
  handleLoading(loading, true)
  listInstanceAPI(props.action.id, pagination.value.current, pagination.value.pageSize).then(
    res => {
      instances.value = res.data.results
      pagination.value.total = res.data.total
    }
  ).finally(() => handleLoading(loading, false))
}
const onPageSizeChange = size => {
  pagination.value.current = 1
  pagination.value.pageSize = size
  loadInstance()
}
const onPageChange = page => {
  pagination.value.current = page
  loadInstance()
}

// visible
watch(() => props.visible, visible => {
  if (visible) {
    props.data.length ? instances.value = props.data : loadInstance()
  } else instances.value = []
})
</script>

<style scoped>
.action-list-instance-operate-notice {
  color: var(--color-text-2);
  width: 100%;
  text-align: center;
}
</style>
