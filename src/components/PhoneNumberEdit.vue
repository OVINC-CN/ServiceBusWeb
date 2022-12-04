<template>
  <a-modal
    :visible="visible"
    :footer="false"
    @cancel="emits('changeVisible', 'phone_number')"
  >
    <template #title>
      {{ $t('EditPhoneNumber') }}
    </template>
    <a-space
      align="center"
      id="phone-number-edit-content-space"
      :fill="true"
    >
      <a-input
        :disabled="loading"
        style="width: 300px"
        v-model="phoneNumber"
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
const phoneNumber = ref('')
const doSubmit = () => {
  handleLoading(loading, true)
  savePropertyAPI(
      [{ property_key: 'phone_number', property_val: phoneNumber.value }]
  ).then(
      () => {
        emits('editSuccess')
        emits('changeVisible', 'phone_number')
      }
  ).finally(() => {
    handleLoading(loading, false)
  })
}

// store
const store = useStore()
watch(() => props.visible, () => {
  phoneNumber.value = store.state.userProperties.phone_number
})
</script>

<style scoped>
#phone-number-edit-content-space {
  justify-content: center;
}
</style>
