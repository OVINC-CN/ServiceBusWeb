<template>
  <a-modal
    :visible="visible"
    :footer="false"
    @cancel="emits('changeVisible', 'mail_address')"
  >
    <template #title>
      {{ $t('EditMailAddress') }}
    </template>
    <a-space
      align="center"
      id="mail-address-edit-content-space"
      :fill="true"
    >
      <a-input
        :disabled="loading"
        style="width: 300px"
        v-model="mail"
      />
      <a-button
        :loading="loading"
        type="primary"
        @click="doSubmit"
      >
        {{ $t('Submit') }}
      </a-button>
    </a-space>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { savePropertyAPI } from '../api/user'
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

// phoneNumber
const mail = ref('')
const doSubmit = () => {
  handleLoading(loading, true)
  savePropertyAPI(
      [{ property_key: 'mail_address', property_val: mail.value }]
  ).then(
      () => {
        emits('editSuccess')
        emits('changeVisible', 'mail_address')
      }
  ).finally(() => {
    handleLoading(loading, false)
  })
}

// store
const store = useStore()
watch(() => props.visible, () => {
  mail.value = store.state.userProperties.mail_address
})
</script>

<style scoped>
#mail-address-edit-content-space {
  justify-content: center;
}
</style>
