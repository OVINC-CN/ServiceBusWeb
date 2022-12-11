<template>
  <a-space
    id="permission"
    :size="[20, 20]"
    :fill="true"
  >
    <a-menu
      id="permission-menu"
      mode="vertical"
      show-collapse-button
      :default-selected-keys="[currentMenuItem]"
      @menu-item-click="goTo"
    >
      <a-menu-item
        v-for="item in menu"
        :key="item.key"
        class="permission-menu-item"
      >
        <template #icon>
          <component :is="item.icon" />
        </template>
        {{ item.name }}
      </a-menu-item>
    </a-menu>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </a-space>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// i18n
const i18n = useI18n()

// menu
const menu = ref([
  {
    key: 'PermissionMine',
    name: i18n.t('PermissionMine'),
    path_match: '/permission/mine',
    icon: "icon-user"
  },
  {
    key: 'PermissionApply',
    name: i18n.t('PermissionApply'),
    path_match: '/permission/apply',
    icon: "icon-file"
  },
  {
    key: 'PermissionModel',
    name: i18n.t('PermissionModel'),
    path_match: '/permission/model',
    icon: "icon-layers"
  },
  {
    key: 'PermissionManage',
    name: i18n.t('PermissionManage'),
    path_match: '/permission/manage',
    icon: "icon-stamp"
  },
])
const route = useRoute()
const router = useRouter()
const currentMenuItem = ref(menu.value[0].key)
const goTo = (key) => {
  router.push({name: key})
}
menu.value.forEach((item, index) => {
  if (index === 0) return
  if (window.location.pathname.startsWith(item.path_match)) currentMenuItem.value = item.key
})
</script>

<style scoped>
#permission {
  height: 100%
}

#permission > :deep(.arco-space-item) {
  height: 100%
}

#permission > :deep(.arco-space-item:nth-last-child(1)) {
  width: 100%;
}

#permission-menu {
  padding: 0;
  margin-left: 20px;
  box-shadow: var(--shadow2-center);
  height: 100%;
  border-radius: var(--border-radius-medium);
}

#permission-menu > :deep(.arco-menu-inner) {
  padding: 0;
}

.permission-menu-item {
  min-width: 240px;
}
</style>
