<template>
  <a-space
    id="property-display"
    :wrap="true"
  >
    <a-list
      id="property-display-list"
      :max-height="400"
    >
      <a-list-item
        class="property-display-list-item"
      >
        <a-tag
          class="property-display-list-item-tag property-display-list-item-tag-clickable"
          @click="visible.avatar = true"
        >
          {{ $t('avatar') }}
          <icon-edit
            class="property-display-build-in-icon"
            :size="18"
          />
        </a-tag>
        <a-typography class="property-display-list-item-typography">
          <a-typography-paragraph copyable>
            {{ propertyMap.avatar || '- -' }}
          </a-typography-paragraph>
        </a-typography>
      </a-list-item>
      <a-list-item
        class="property-display-list-item"
      >
        <a-tag
          class="property-display-list-item-tag property-display-list-item-tag-clickable"
          @click="visible.phone_number = true"
        >
          {{ $t('phone_number') }}
          <icon-edit
            class="property-display-build-in-icon"
            :size="18"
          />
        </a-tag>
        <a-typography class="property-display-list-item-typography">
          <a-typography-paragraph copyable>
            {{ propertyMap.phone_number || '- -' }}
          </a-typography-paragraph>
        </a-typography>
      </a-list-item>
      <a-list-item
        class="property-display-list-item"
      >
        <a-tag
          class="property-display-list-item-tag property-display-list-item-tag-clickable"
          @click="visible.mail_address = true"
        >
          {{ $t('mail_address') }}
          <icon-edit
            class="property-display-build-in-icon"
            :size="18"
          />
        </a-tag>
        <a-typography class="property-display-list-item-typography">
          <a-typography-paragraph copyable>
            {{ propertyMap.mail_address || '- -' }}
          </a-typography-paragraph>
        </a-typography>
      </a-list-item>
      <template
        v-for="(item, index) in properties"
        :key="index"
      >
        <a-list-item
          v-if="buildInPropertyKeys.indexOf(item.property_key) === -1"
          class="property-display-list-item"
        >
          <a-tag class="property-display-list-item-tag">
            {{ $t(item.property_key) }}
          </a-tag>
          <a-typography class="property-display-list-item-typography">
            <a-typography-paragraph copyable>
              {{ item.property_val }}
            </a-typography-paragraph>
          </a-typography>
        </a-list-item>
      </template>
    </a-list>
  </a-space>
  <user-avatar-edit
    :visible="visible.avatar"
    @change-visible="changeVisible"
    @edit-success="editSuccess"
  />
  <phone-number-edit
    :visible="visible.phone_number"
    @change-visible="changeVisible"
    @edit-success="editSuccess"
  />
  <mail-address-edit
    :visible="visible.mail_address"
    @change-visible="changeVisible"
    @edit-success="editSuccess"
  />
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import UserAvatarEdit from './UserAvatarEdit.vue'
import PhoneNumberEdit from './PhoneNumberEdit.vue'
import MailAddressEdit from './MailAddressEdit.vue'

// edit visible
const visible = ref({
  avatar: false,
  phone_number: false,
  mail_address: false
})
const changeVisible = (key) => visible.value[key] = !visible.value[key]
const editSuccess = () => {
  store.dispatch('getUserInfo')
}

// build in property
const buildInPropertyKeys = ref(['avatar', 'mail_address', 'phone_number'])

// store
const store = useStore()
const properties = computed(() => store.state.userPropertiesRaw)
const propertyMap = computed(() => store.state.userProperties)
</script>

<style scoped>
#property-display-list {
  width: 480px;
}

.property-display-list-item-tag {
  margin-right: 20px;
}

.property-display-list-item-tag-clickable {
  cursor: pointer;
}

.property-display-list-item {
  word-break: break-all;
}

.property-display-list-item-typography :deep(.arco-typography) {
  margin: 10px 0 0 0;
}

.property-display-build-in-icon {
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px !important;
}
</style>
