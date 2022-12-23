<template>
  <a-modal
    :visible="visible"
    :footer="false"
    @cancel="emits('changeVisible')"
    unmount-on-close
  >
    <a-form
      ref="formRef"
      :model="action"
      :auto-label-width="true"
      @submit="doSubmit"
    >
      <a-form-item
        :label="$t('ActionID')"
        field="action_id"
        :rules="rules.action_id"
        feedback
      >
        <a-input
          :disabled="!props.isCreate"
          v-model="action.action_id"
        />
      </a-form-item>
      <a-form-item
        :label="$t('ActionName')"
        field="action_name"
        :rules="rules.action_name"
        feedback
      >
        <a-input
          v-model="action.action_name"
          :disabled="loading"
        />
      </a-form-item>
      <a-form-item
        :label="$t('ResourceID')"
        field="=resource_id"
        feedback
      >
        <a-input
          v-model="action.resource_id"
          :disabled="loading"
        />
      </a-form-item>
      <a-form-item
        :label="$t('ResourceName')"
        field="=resource_name"
        feedback
      >
        <a-input
          v-model="action.resource_name"
          :disabled="loading"
        />
      </a-form-item>
      <a-form-item
        :label="$t('Description')"
        field="=description"
        feedback
      >
        <a-input
          v-model="action.description"
          :disabled="loading"
        />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            :disabled="!isCreate"
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
import { createActionAPI, editActionAPI } from '../api/permission'
import { handleLoading } from '../utils/loading'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'

// i18n
const i18n = useI18n()

// create
const isCreate = ref(false)

// loading
const loading = ref(false)

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
  appCode: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['changeVisible', 'editSuccess', 'createSuccess'])

// data
const action = ref({})
watch(() => props.visible, () => action.value = JSON.parse(JSON.stringify(props.data)))
const rules = {
  action_id: [
    {required: true, message: i18n.t('ActionIDRequired')}
  ],
  action_name: [
    {required: true, message: i18n.t('ActionNameRequired')}
  ]
}

// submit
const doEdit = () => {
  editActionAPI(action.value).then(
    res => emits('editSuccess', res.data),
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(loading, false))
}
const doCreate = () => {
  const _data = JSON.parse(JSON.stringify(action.value))
  _data.application = props.appCode
  createActionAPI(_data).then(
    () => emits('createSuccess'),
    err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(loading, false))
}
const doSubmit = ({errors}) => {
  if (errors) return
  handleLoading(loading, true)
  props.isCreate ? doCreate() : doEdit()
}
</script>

<style scoped>

</style>
