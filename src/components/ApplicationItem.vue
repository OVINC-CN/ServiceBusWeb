<template>
  <a-card
    hoverable
    class="application-item"
  >
    <a-tooltip
      background-color="#F7F8FA"
    >
      <template #content>
        <span style="color: var(--color-text-1)">{{ $t('Admin') }}:</span>&nbsp;
        <span
          v-for="item in application.managers"
          :key="item.username"
          style="color: var(--color-text-1)"
        >
          {{ item.username }}
          <span v-if="item.nick_name">
            ({{ item.nick_name }})
          </span>
          ;
        </span>
      </template>
      <a-space>
        <a-avatar
          class="application-item-img"
          :size="48"
        >
          <img
            v-if="application.app_logo"
            alt="app-logo"
            :src="application.app_logo"
          >
          <span
            class="application-logo-default-icon"
            v-else
          >
            <icon-common />
          </span>
        </a-avatar>
        <a-link
          @click="openUrl(application.app_url)"
          :disabled="application.app_url === null || application.app_url === ''"
        >
          <a-typography-text>{{ application.app_name }}&nbsp;({{ application.app_code }})</a-typography-text>
        </a-link>
        <icon-edit
          v-if="isManager"
          class="application-item-edit-icon"
          @click="openEdit"
        />
      </a-space>
    </a-tooltip>
  </a-card>
  <edit-application-item
    :visible="editVisible"
    :application="application"
    @change-visible="changeVisible"
    @success="handleUpdateSuccess"
  />
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import EditApplicationItem from './EditApplicationItem.vue'

// props
const props = defineProps({
  application: {
    type: Object,
    default: () => ({
      app_code: '',
      app_name: '',
      app_url: '',
      app_logo: '',
      managers: []
    })
  }
})
const emits = defineEmits(['handleUpdateSuccess'])

// url
const openUrl = url => {
  if (url) {
    window.open(url)
  }
}

// store
const store = useStore()
const user = computed(() => store.state.user)

// app
const isManager = computed(() => {
  let _isManager = false
  for (const item of props.application.managers) {
    if (item.username === user.value.username) {
      _isManager = true
      break
    }
  }
  return isManager
})

// edit
const editVisible = ref(false)
const openEdit = () => editVisible.value = true
const changeVisible = () => editVisible.value = !editVisible.value
const handleUpdateSuccess = app => emits('handleUpdateSuccess', app)
</script>

<style scoped>
.application-item {
  border: unset;
  box-shadow: var(--shadow2-center);
  border-radius: var(--border-radius-medium);
  overflow: hidden;
}

.application-item-edit-icon {
  cursor: pointer;
}
</style>
