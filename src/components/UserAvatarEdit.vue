<template>
  <a-modal
    :visible="visible"
    :footer="false"
    @cancel="emits('changeVisible', 'avatar')"
  >
    <template #title>
      {{ $t('UploadAvatar') }}
    </template>
    <a-space
      align="center"
      direction="vertical"
      :fill="true"
    >
      <a-spin
        :loading="loading"
      >
        <a-upload
          :disabled="loading"
          :file-list="file ? [file] : []"
          :show-file-list="false"
          accept="image/*"
          :draggable="true"
          :action="uploadAvatarUrl"
          :with-credentials="true"
          :on-before-upload="onBeforeUpload"
          @success="onSuccess"
          @error="onError"
        >
          <template #upload-button>
            <a-avatar
              :size="64"
              id="user-avatar-edit-avatar"
            >
              <img
                v-if="avatar"
                alt="avatar"
                :src="avatar"
              >
              <icon-user
                v-else
                style="font-size: 24px"
              />
            </a-avatar>
          </template>
        </a-upload>
      </a-spin>

      <div id="user-avatar-edit-avatar-info">
        {{ $t('maxAvatarSizeIs2M') }}
      </div>
    </a-space>
  </a-modal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import globalContext from '../context'
import { savePropertyAPI } from '../api/user'
import { Modal } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { handleLoading } from '../utils/loading'

// props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// loading
const loading = ref(false)

// i18n
const i18n = useI18n()

// emits
const emits = defineEmits(['changeVisible', 'editSuccess'])

// upload
const file = ref(null)
const uploadAvatarUrl = computed(() => globalContext.backendUrl + '/cos/upload_avatar/')

// update avatar
const onSuccess = fileItem => {
  const url = fileItem.response.data.url
  const message = fileItem.response.data.message
  if (url) {
    savePropertyAPI(
        [{property_key: 'avatar', property_val: url}]
    ).finally(() => {
      handleLoading(loading, false)
      emits('changeVisible', 'avatar')
      emits('editSuccess')
    })
  }
  else if (message) {
    handleLoading(loading, false)
    Modal.warning({
      title: i18n.t('UploadFailed'),
      content: message,
      modalStyle: {textAlign: 'center'},
      okText: i18n.t('OK')
    })
  }
}
const onError = fileItem => {
  handleLoading(loading, false)
  Modal.warning({
    title: i18n.t('UploadFailed'),
    content: fileItem.response.message,
    modalStyle: {textAlign: 'center'},
    okText: i18n.t('OK')
  })
}
const onBeforeUpload = file => new Promise(resolve => {
  handleLoading(loading, true)
  return resolve(file)
})

// store
const store = useStore()
const avatar = computed(() => store.state.userProperties.avatar)
</script>

<style scoped>
#user-avatar-edit-avatar {
  overflow: hidden;
}

#user-avatar-edit-avatar :deep(.arco-avatar-text) {
  line-height: 0;
}

#user-avatar-edit-avatar-info {
  color: var(--color-neutral-6);
  font-size: 14px;
  margin-top: 10px;
}
</style>
