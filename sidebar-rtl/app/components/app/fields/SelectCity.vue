<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Button from '~/components/ui/button/Button.vue'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'
import { iran_cities } from '~/utils/persian/locations'

const city = defineModel<string>('city')
const province = defineModel<string>('province')

const step = ref(1) // 1 for province, 2 for city
const isPopoverOpen = ref(false)

const provinces = computed(() => Object.keys(iran_cities))
const cities = computed(() => province.value ? iran_cities[province.value] : [])
const searchProvince = ref('')
const searchCity = ref('')

const filteredProvinces = computed(() =>
  provinces.value.filter(province =>
    province.includes(searchProvince.value),
  ),
)

const filteredCities = computed(() =>
  cities.value?.filter(city =>
    city.name.includes(searchCity.value),
  ),
)

function selectProvince(provinceValue: string) {
  if(city.value) {
    city.value = ''
  }
  province.value = provinceValue
  step.value = 2
  searchCity.value = ''
}

function selectCity(cityValue: { key: string, name: string }) {
  city.value = cityValue.name
  isPopoverOpen.value = false
  step.value = 1
  searchProvince.value = ''
  searchCity.value = ''
}

function goBack() {
  step.value = 1
  province.value = ''
  searchCity.value = ''
}

function openCitySelector() {
  isPopoverOpen.value = true
  step.value = 1
}
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        class="w-full justify-between"
        :class="{ 'text-muted-foreground': !city && !city }"
        @click="openCitySelector"
      >
        {{ (city) ? `${city} - ${province}` : 'انتخاب استان / شهر' }}
        <span class="icon-[lucide--chevron-left] size-5 text-muted-foreground" />
      </Button>
    </PopoverTrigger>
    
    <PopoverContent class="w-80 p-4">
      <!-- Step 1: Province Selection -->
      <div v-if="step === 1">
        <div class="mb-4">
          <div class="font-medium mb-2 h-8 flex items-center">
            انتخاب استان
          </div>
          <InputSecondary
            v-model="searchProvince"
            class="h-10"
            label="جستجوی استان..."
          />
        </div>
        <div class="max-h-48 overflow-y-auto">
          <button
            v-for="provinceItem in filteredProvinces"
            :key="provinceItem"
            class="w-full text-right p-2 hover:bg-accent/50 rounded-md"
            @click="selectProvince(provinceItem)"
          >
            {{ provinceItem }}
          </button>
        </div>
      </div>

      <!-- Step 2: City Selection -->
      <div v-if="step === 2">
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <div class="font-medium">
              انتخاب شهر - {{ province }}
            </div>
            <Button variant="outline" size="sm" @click="goBack">
              بازگشت
            </Button>
          </div>
          <InputSecondary
            v-model="searchCity"
            label="جستجوی شهر..."
            class="h-10"
          />
        </div>
        <div class="max-h-48 overflow-y-auto mb-4">
          <button
            v-for="cityItem in filteredCities"
            :key="cityItem.key"
            class="w-full text-right p-2 hover:bg-accent/50 rounded-md"
            @click="selectCity(cityItem)"
          >
            {{ cityItem.name }}
          </button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
