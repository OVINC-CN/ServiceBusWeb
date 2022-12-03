import { createI18n } from 'vue-i18n'
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import mZhCN from './zh-cn'
import mEnUS from './en-us'

export const langOption = [
  {
    name: '简体中文',
    value: 'zhCN',
    locale: zhCN,
  },
  {
    name: 'English',
    value: 'enUS',
    locale: enUS,
  }
]

const userLangKey = 'user-language'

let mLocal = 'zhCN'
export let locale = zhCN

export const changeLang = (value) => {
  localStorage.setItem(userLangKey, value)
  langOption.forEach(item => {
    if (item.value === value) {
      locale = item.locale
      mLocal = item.value
    }
  })
}
export const changeLangAndReload = (value) => {
  changeLang(value)
  window.location.reload()
}

const userLang = localStorage.getItem(userLangKey)
if (userLang) changeLang(userLang);

const i18n = createI18n({
  locale: mLocal,
  fallbackLocale: 'zhCN',
  legacy: false,
  messages: {
    zhCN: mZhCN,
    enUS: mEnUS
  }
})

export default i18n
