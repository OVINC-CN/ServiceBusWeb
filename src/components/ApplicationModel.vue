<template>
  <a-space id="permission-model-content">
    <a-spin
      :loading="actionsLoading"
      dot
    >
      <a-table
        id="permission-model-action-table"
        :scrollbar="true"
        :scroll="{y: tableHeight}"
        :columns="columns"
        :data="actionData"
        :pagination="actionPage"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #optional="{record}">
          <a-space>
            <a-button
              type="outline"
              size="mini"
              @click="showInstance(record)"
            >
              {{ $t('showInstance') }}
            </a-button>
            <a-button
              type="outline"
              size="mini"
              @click="showEdit(record)"
            >
              {{ $t('Edit') }}
            </a-button>
            <a-button
              status="danger"
              type="outline"
              size="mini"
              @click="deleteConfirm(record)"
            >
              {{ $t('Delete') }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-spin>
  </a-space>
  <edit-action
    :data="editData"
    :visible="editVisible"
    @change-visible="changeEditVisible"
    @edit-success="editSuccess"
  />
  <action-instance-list
    :visible="instanceVisible"
    :action="currentAction"
    @change-visible="changeInstanceVisible"
  />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { deleteActionAPI, listActionAPI } from '../api/permission'
import { handleLoading } from '../utils/loading'
import { Message, Modal } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import EditAction from './EditAction.vue'
import ActionInstanceList from './ActionInstanceList.vue'

// window
const tableHeight = window.innerHeight - 360

// props
const props = defineProps({
  appCode: {
    type: String,
    default: ''
  }
})

// i18n
const i18n = useI18n()

// actions
const actionsLoading = ref(false)
const actionData = ref([])
const actionPage = ref({
  total: 0,
  pageSize: 20,
  current: 1,
  showPageSize: true,
  showTotal: true
})
const onPageChange = (current) => {
  actionPage.value.current = current
  loadActions()
}
const onPageSizeChange = (size) => {
  pagination.value.current = 1
  actionPage.value.pageSize = size
  loadActions()
}
const loadActions = () => {
  if (!props.appCode) return
  handleLoading(actionsLoading, true)
  listActionAPI(props.appCode, actionPage.value.current, actionPage.value.pageSize).then(
    res => {
      actionPage.value.total = res.data.total
      actionData.value = res.data.results
    },
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(actionsLoading, false))
}
const columns = [
  {
    title: i18n.t('ID'),
    dataIndex: 'id',
  },
  {
    title: i18n.t('ActionID'),
    dataIndex: 'action_id',
  },
  {
    title: i18n.t('ActionName'),
    dataIndex: 'action_name',
  },
  {
    title: i18n.t('ResourceName'),
    dataIndex: 'resource_name',
  },
  {
    title: i18n.t('Description'),
    dataIndex: 'description',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: i18n.t('Optional'),
    slotName: 'optional',
    width: 240
  }
]

// operate
const operateLoading = ref(false)
const editData = ref({})
const editVisible = ref(false)
const changeEditVisible = () => editVisible.value = !editVisible.value
const showEdit = (data) => {
  editData.value = data
  changeEditVisible()
}
const editSuccess = (value) => {
  changeEditVisible()
  for (const index in actionData.value) {
    if (actionData.value[index].id === value.id) {
      actionData.value[index] = value
      break
    }
  }
}
const doDelete = (id) => {
  handleLoading(actionsLoading, true)
  deleteActionAPI(id).then(
    () => reload(),
    err => {
      Message.error(err.response.data.message)
      handleLoading(actionsLoading, false)
    }
  )
}
const deleteConfirm = (data) => {
  Modal.warning({
    title: i18n.t('deleteConfirm'),
    content: i18n.t(
      'deleteActionConfirmContent',
      {
        actionId: data.action_id,
        actionName: data.action_name
      }
    ),
    modalStyle: {textAlign: 'center'},
    hideCancel: false,
    cancelText: i18n.t('Cancel'),
    okText: i18n.t('Delete'),
    onOk: () => doDelete(data.id)
  });
}
const currentAction = ref({})
const instanceVisible = ref(false)
const changeInstanceVisible = () => instanceVisible.value = !instanceVisible.value
const showInstance = (data) => {
  currentAction.value = data
  changeInstanceVisible()
}

// load
const reload = () => {
  loadActions()
}
onMounted(() => reload())
watch(() => props.appCode, () => reload())

// expose
defineExpose({reload})
</script>

<style scoped>
</style>
