<template>
  <a-space
    id="login"
    align="center"
    direction="vertical"
  >
    <login-box
      v-show="showLogin"
      @login-redirect="loginRedirect"
    />
    <registry-box
      v-show="!showLogin"
      @login-redirect="loginRedirect"
    />
    <a-divider
      id="login-bottom-divider"
      orientation="center"
      :margin="40"
    >
      <a-button
        type="text"
        @click="handleToggle"
      >
        {{ showLogin ? $t('goToRegistry') : $t('backToLogin') }}
      </a-button>
    </a-divider>
  </a-space>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import LoginBox from '../components/LoginBox.vue'
import RegistryBox from '../components/RegistryBox.vue'
import globalContext from '../context'

// route
const route = useRoute()
const next = computed(() => route.query.next)

// login & registry
const showLogin = ref(true)
const handleToggle = () => showLogin.value = ! showLogin.value

// redirect
const loginRedirect = () => {
  if (next.value) {
    window.location.href = next.value
    return
  }
  window.location.href = globalContext.siteUrl
}
</script>

<style scoped>
#login {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

#login-bottom-divider {
  width: 400px;
}
</style>
