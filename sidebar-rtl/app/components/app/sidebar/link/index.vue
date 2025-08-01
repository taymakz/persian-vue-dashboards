<script setup lang="ts">
import type { LinkType } from '../Content.vue'
import Nested from './Nested.vue'
import Single from './Single.vue'

const { link } = defineProps<{
  link: LinkType
}>()

</script>

<template>
  <div >
    <Single v-if="!link.children" :link />
    <Nested v-else :link />
  </div>
</template>
