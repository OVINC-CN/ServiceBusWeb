<template>
  <a-space
    id="application"
    direction="vertical"
  >
    <h2 id="application-title">
      {{ $t('OVINCCN') }}&nbsp;{{ $t('ApplicationCenter') }}
      <a-button
        type="text"
        shape="circle"
      >
        <icon-refresh @click="refresh" />
      </a-button>
      <a-button
        type="text"
        shape="circle"
        v-if="isSuperuser"
      >
        <icon-plus @click="toggleAdd" />
      </a-button>
    </h2>
    <a-spin
      :loading="loading"
      dot
    >
      <a-space
        wrap
        :size="[20, 20]"
        id="application-display"
      >
        <a-empty v-if="!total" />
        <application-item
          v-else
          v-for="item in apps"
          :key="item.app_code"
          :application="item"
          @handle-update-success="handleUpdateSuccess"
        />
      </a-space>
    </a-spin>
    <a-link
      :disabled="loading || current >= maxCurrent"
      @click="loadMore"
    >
      <span v-if="current >= maxCurrent">{{ $t('noMore') }}</span>
      <span v-else>{{ $t('loadMore') }}</span>
    </a-link>
  </a-space>
  <edit-application-item
    :visible="addVisible"
    :is-create="true"
    @change-visible="toggleAdd"
    @create-success="listApps"
  />
</template>

<script setup>
import ApplicationItem from '../components/ApplicationItem.vue'
import { listAppAPI } from '../api/app'
import { computed, onMounted, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { handleLoading } from '../utils/loading'
import { checkSuperPermissionAPI } from '../api/permission'
import EditApplicationItem from '../components/EditApplicationItem.vue'

// loading
const loading = ref(false)

// page
const current = ref(1)
const pageSize = ref(20)
const total = ref(0)
const maxCurrent = computed(() => {
  return total.value / pageSize.value
})

// apps
const apps = ref([])
const listApps = (isAppend=false) => {
  handleLoading(loading, true)
  listAppAPI(current.value, pageSize.value).then(
      res => {
        if (isAppend) {
          apps.value = apps.value.concat(res.data.results)
        } else {
          apps.value = res.data.results
        }
        current.value = res.data.current
        total.value = res.data.total
      },
      err => Message.error(err.response.data.message)
  ).finally(() => handleLoading(loading, false))
}
onMounted(() => listApps())

// refresh
const refresh = () => {
  current.value = 1
  listApps()
}

// load more
const loadMore = () => {
  current.value++
  listApps(true)
}

// edit
const handleUpdateSuccess = app => {
  for (const index in apps.value) {
    if (apps.value[index].app_code === app.app_code) {
      apps.value[index] = app
      break
    }
  }
}

// user
const isSuperuser = ref(false)
onMounted(() => {
  checkSuperPermissionAPI().then(res => isSuperuser.value = res.data.is_superuser)
})

// add
const addVisible = ref(false)
const toggleAdd = () => addVisible.value = !addVisible.value
</script>

<style scoped>
#application {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

#application-title {
  font-size: 24px;
}

#application-display {
  padding: 20px;
  justify-content: center;
}
</style>
