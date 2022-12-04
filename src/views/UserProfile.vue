<template>
  <a-space id="user-profile">
    <a-space
      id="user-profile-box"
      align="center"
      direction="vertical"
      :size="[20, 20]"
    >
      <a-space :size="[20, 20]">
        <user-avatar :size="60" />
        <a-space
          direction="vertical"
          id="user-profile-user-login"
        >
          <div id="user-profile-username-line">
            <span>{{ user.username }}</span>
            <span v-if="user.nick_name">&nbsp;({{ user.nick_name }})</span>
          </div>
          <div>
            {{ $t('lastLogin') + ':&nbsp;' + user.last_login }}
          </div>
        </a-space>
      </a-space>
      <a-space
        direction="vertical"
        align="center"
      >
        <property-display />
        <a-button
          status="warning"
          @click="logout"
        >
          {{ $t('logout') }}
        </a-button>
      </a-space>
    </a-space>
  </a-space>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import UserAvatar from '../components/UserAvatar.vue'
import PropertyDisplay from '../components/PropertyDisplay.vue'
import { Modal } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { signOutAPI } from '../api/user'
import globalContext from '../context'

// i18n
const i18n = useI18n()

// store
const store = useStore()
const user = computed(() => store.state.user)

// logout
const doLogout = () => {
  signOutAPI()
  window.location.replace(globalContext.siteUrl)
}
const logout = () => {
  Modal.warning({
    title: i18n.t('logoutConfirm'),
    content: i18n.t(
      'logoutConfirmContent',
      {
        username: user.value.nick_name ? user.value.username + ' (' + user.value.nick_name + ')' : user.value.username
      }
    ),
    modalStyle: {textAlign: 'center'},
    hideCancel: false,
    okText: i18n.t('logout'),
    onOk: doLogout
  });
}
</script>

<style scoped>
#user-profile {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

#user-profile-box {
  width: 480px;
  box-shadow: var(--shadow2-center);
  padding: 20px;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  justify-content: center;
}

#user-profile-username-line {
  word-break: break-all;
  font-weight: bold;
  font-size: 18px;
}
</style>
