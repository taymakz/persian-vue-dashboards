<script setup lang="ts">
import type { LinkType } from '../Content.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const { link } = defineProps<{
  link: LinkType
}>()

const route = useRoute()
const defaultValue = ref('')

function isCurrentRoute(link: string) {
  return route.path === link
}

onMounted(() => {
  if (link.children?.some(child => isCurrentRoute(child.to))) {
    defaultValue.value = link.label
  }
})
</script>

<template>
  <Accordion v-model:model-value="defaultValue" type="single" collapsible>
    <AccordionItem :value="link.label">
      <AccordionTrigger
        class="relative flex flex-row font-medium items-center gap-2 rounded-xl p-2 text-start [overflow-wrap:anywhere] text-muted-foreground"
      >
        <div class="flex items-center gap-3 ">
          <i :class="cn('size-5 duration-200', link.icon)" />
          <p class="text-sm duration-200">
            {{ link.label }}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ul class="mr-4.5 flex min-w-0 flex-col gap-1 border-r px-2.5 py-0.5">
          <template v-for="child in link.children" :key="child.to">
            <li>
              <NuxtLink
                :to="child.to" :class="cn(
                  'px-2 py-1.5 rounded-md flex items-center gap-3 duration-200',
                  {
                    'text-primary bg-primary/10':
                      isCurrentRoute(child.to!),
                  },
                  { 'hover:bg-accent/50 hover:text-accent-foreground/80': !isCurrentRoute(child.to!) },
                )"
              >
                {{ child.label }}
              </NuxtLink>
            </li>
          </template>
        </ul>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
