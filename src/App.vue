<template>
  <a-config-provider :locale="locale">
    <a-spin
      :size="32"
      :loading="mainLoading"
      :tip="$t('loading')"
    >
      <a-layout id="app-layout">
        <a-layout-header id="app-header">
          <div>
            <a-menu
              mode="horizontal"
              :default-selected-keys="[currentMenuItem]"
              @menu-item-click="goTo"
            >
              <a-menu-item
                disabled
                id="app-menu-logo"
              >
                <div>
                  Service Bus
                </div>
              </a-menu-item>
              <a-menu-item
                v-for="item in menu"
                :key="item.key"
              >
                {{ item.name }}
              </a-menu-item>
            </a-menu>
            <a-space id="app-header-right">
              <a-dropdown @select="changeLangAndReload">
                <icon-public id="app-header-menu-lang" />
                <template #content>
                  <a-doption
                    v-for="item in langOption"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </a-doption>
                </template>
              </a-dropdown>
              <a-avatar
                v-if="userAvatar"
                id="app-menu-avatar"
              >
                <img
                  alt="avatar"
                  :src="userAvatar"
                >
              </a-avatar>
              <a-avatar
                v-else-if="isLogin && user.nickname"
                id="app-menu-avatar"
              >
                {{ user.nickname.slice(0, 1) }}
              </a-avatar>
              <a-avatar
                v-else-if="isLogin && user.username"
                id="app-menu-avatar"
              >
                {{ user.username.slice(0, 1) }}
              </a-avatar>
              <a-avatar
                v-else
                id="app-menu-avatar-no-login"
              >
                <icon-user />
              </a-avatar>
            </a-space>
          </div>
        </a-layout-header>
        <a-layout-content>
          <router-view />
        </a-layout-content>
        <a-layout-footer id="app-footer">
          Copyright&nbsp;&copy;&nbsp;2022 - {{ currentYear }} OVINC-CN
        </a-layout-footer>
      </a-layout>
    </a-spin>
  </a-config-provider>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { locale, langOption, changeLangAndReload } from './locale'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

// locale
const i18n = useI18n()

// title
const title = ref(i18n.t('ServiceBus') + ' | ' + i18n.t('OVINCCN'))
document.title = title.value

// menu
const menu = ref([
  {
    key: 'Home',
    name: i18n.t('Home'),
    path_match: '/'
  },
  {
    key: 'Application',
    name: i18n.t('Application'),
    path_match: '/application/'
  },
  {
    key: 'Permission',
    name: i18n.t('PermissionCenter'),
    path_match: '/permission/'
  }
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

// footer
const currentYear = ref(new Date().getFullYear())

// store
const store = useStore()
const user = computed(() => store.state.user)
const isLogin = computed(() => store.state.isLogin)
const userAvatar = computed(() => store.state.userProperties.avatar)
const mainLoading = computed(() => store.state.mainLoading)
store.dispatch('getUserInfo')
onMounted(() => store.dispatch('setMainLoading', false))
</script>

<style>
@import "App.css";

#app-layout {
  height: 100vh;
  width: 100vw;
}

#app-header {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-border-1);
}

#app-header > div {
  display: flex;
  justify-content: space-around;
}

#app-header-right {
  display: flex;
  align-items: center;
  padding: 14px 20px 14px 0;
}

#app-menu-logo {
  padding-left: 0;
  margin-left: 0;
}

#app-header-menu-lang {
  cursor: pointer;
  margin-right: 12px;
}

#app-menu-logo > div {
  width: 100px;
  height: 30px;
  border-radius: var(--border-radius-medium);
  background: var(--color-fill-3);
  padding: 4px;
  cursor: text;
  color: var(--color-text-1);
  text-align: center;
  font-weight: bold;
}

#app-menu-avatar {
  background: rgb(var(--arcoblue-5));
}

#app-menu-avatar-no-login {
  background: var(--color-neutral-4);
}

#app-footer {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-top: 1px solid var(--color-border-1);
  color: var(--color-text-1);
  margin-top: 20px;
}
</style>
