<script setup lang="ts">
import jalaliPlugin from '@zoomit/dayjs-jalali-plugin'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import jalaali from 'jalaali-js'
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/utils/cn'

interface Props {
  placeholder?: string
  disabled?: boolean
  class?: string
  enableTime?: boolean
  showPresets?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'انتخاب تاریخ',
  disabled: false,
  enableTime: false,
  showPresets: false,
})

const modelValue = defineModel<string>()

const isOpen = ref(false)
const selectedDate = ref<string>(modelValue.value || '')
const showYearPicker = ref(false)
const yearScrollContainer = ref<HTMLElement>()

// Time state
const selectedHour = ref<number>(12)
const selectedMinute = ref<number>(0)

// Current view state
const currentYear = ref<number>(getCurrentPersianYear())
const currentMonth = ref<number>(getCurrentPersianMonth())

// Get current Persian year and month
function getCurrentPersianYear(): number {
  const dayjs = useDayjs()
  dayjs.extend(jalaliPlugin)
  return Number.parseInt(dayjs().calendar('jalali').format('YYYY'))
}

function getCurrentPersianMonth(): number {
  const dayjs = useDayjs()
  dayjs.extend(jalaliPlugin)
  return Number.parseInt(dayjs().calendar('jalali').format('MM'))
}

// Persian month names
const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
]

// Persian weekday names
const persianWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

// Preset options
const presetItems = [
  { value: 0, label: 'امروز' },
  { value: 1, label: 'فردا' },
  { value: 3, label: '۳ روز بعد' },
  { value: 7, label: '۱ هفته بعد' },
  { value: 30, label: '۱ ماه بعد' },
]

// Computed properties
const currentMonthName = computed(() => persianMonths[currentMonth.value - 1])

// Generate year range (-40 to +40 from current year)
const yearRange = computed(() => {
  const currentPersianYear = getCurrentPersianYear()
  const years = []
  for (let i = currentPersianYear - 40; i <= currentPersianYear + 40; i++) {
    years.push(i)
  }
  return years
})

const displayValue = computed(() => {
  if (!selectedDate.value)
    return props.placeholder

  try {
    const parts = selectedDate.value.split('/')
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const year = Number.parseInt(parts[0])
      const month = Number.parseInt(parts[1])
      const day = Number.parseInt(parts[2])

      if (month >= 1 && month <= 12) {
        let dateStr = `${day} ${persianMonths[month - 1]} ${year}`

        if (props.enableTime) {
          dateStr += ` ${selectedHour.value.toString().padStart(2, '0')}:${selectedMinute.value.toString().padStart(2, '0')}`
        }

        return dateStr
      }
    }
  }
  catch (error) {
    console.error('Error formatting date:', error)
  }

  return selectedDate.value
})

// Generate calendar days for current month
const calendarDays = computed(() => {
  try {
    const daysInMonth = jalaali.jalaaliMonthLength(currentYear.value, currentMonth.value)
    const firstDayOfMonth = jalaali.toGregorian(currentYear.value, currentMonth.value, 1)
    const firstDayWeekday = new Date(firstDayOfMonth.gy, firstDayOfMonth.gm - 1, firstDayOfMonth.gd).getDay()

    // Adjust for Persian week (Saturday = 0)
    const adjustedFirstDay = (firstDayWeekday + 1) % 7

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({ day: '', disabled: true, isCurrentMonth: false })
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear.value}/${currentMonth.value.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`
      const isSelected = selectedDate.value === dateString

      days.push({
        day: day.toString(),
        disabled: false,
        isCurrentMonth: true,
        isSelected,
        dateString,
      })
    }

    return days
  }
  catch (error) {
    console.error('Error generating calendar days:', error)
    return []
  }
})

// Navigation functions
function goToPreviousMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  }
  else {
    currentMonth.value--
  }
}

function goToNextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  }
  else {
    currentMonth.value++
  }
}

function selectDate(day: any) {
  if (day.disabled || !day.isCurrentMonth)
    return

  let dateValue = day.dateString

  if (props.enableTime) {
    dateValue += ` ${selectedHour.value.toString().padStart(2, '0')}:${selectedMinute.value.toString().padStart(2, '0')}`
  }

  selectedDate.value = dateValue
  modelValue.value = dateValue
  isOpen.value = false
}

function goToToday() {
  const dayjs = useDayjs()
  dayjs.extend(jalaliPlugin)
  let today = dayjs().calendar('jalali').format('YYYY/MM/DD')

  if (props.enableTime) {
    today += ` ${dayjs().format('HH:mm')}`
    selectedHour.value = dayjs().hour()
    selectedMinute.value = dayjs().minute()
  }

  selectedDate.value = today
  modelValue.value = today

  // Update current view to today's month
  currentYear.value = getCurrentPersianYear()
  currentMonth.value = getCurrentPersianMonth()
  isOpen.value = false
}

function toggleYearPicker() {
  showYearPicker.value = !showYearPicker.value

  if (showYearPicker.value) {
    nextTick(() => {
      // Scroll to current year without animation
      const currentYearElement = yearScrollContainer.value?.querySelector(`[data-year="${currentYear.value}"]`)
      if (currentYearElement) {
        currentYearElement.scrollIntoView({ behavior: 'instant', block: 'center' })
      }
    })
  }
}

function selectYear(year: number) {
  currentYear.value = year
  showYearPicker.value = false
}

function updateTime(type: 'hour' | 'minute', value: number) {
  if (type === 'hour') {
    selectedHour.value = value
  }
  else {
    selectedMinute.value = value
  }

  // Update the selected date with new time if a date is selected
  if (selectedDate.value) {
    const datePart = selectedDate.value.split(' ')[0] // Get date part only
    const newValue = `${datePart} ${selectedHour.value.toString().padStart(2, '0')}:${selectedMinute.value.toString().padStart(2, '0')}`
    selectedDate.value = newValue
    modelValue.value = newValue
  }
}

function validateAndUpdateHour(event: Event) {
  const target = event.target as HTMLInputElement
  let value = Number.parseInt(target.value)

  if (Number.isNaN(value) || value < 0) {
    value = 0
  }
  else if (value > 23) {
    value = 23
  }

  selectedHour.value = value
  updateTime('hour', value)
}

function validateAndUpdateMinute(event: Event) {
  const target = event.target as HTMLInputElement
  let value = Number.parseInt(target.value)

  if (Number.isNaN(value) || value < 0) {
    value = 0
  }
  else if (value > 59) {
    value = 59
  }

  selectedMinute.value = value
  updateTime('minute', value)
}

function incrementHour() {
  const newValue = selectedHour.value < 23 ? selectedHour.value + 1 : 0
  selectedHour.value = newValue
  updateTime('hour', newValue)
}

function decrementHour() {
  const newValue = selectedHour.value > 0 ? selectedHour.value - 1 : 23
  selectedHour.value = newValue
  updateTime('hour', newValue)
}

function incrementMinute() {
  const newValue = selectedMinute.value < 59 ? selectedMinute.value + 1 : 0
  selectedMinute.value = newValue
  updateTime('minute', newValue)
}

function decrementMinute() {
  const newValue = selectedMinute.value > 0 ? selectedMinute.value - 1 : 59
  selectedMinute.value = newValue
  updateTime('minute', newValue)
}

function selectPreset(value: any) {
  if (!value)
    return

  const days = Number(value)
  const dayjs = useDayjs()
  dayjs.extend(jalaliPlugin)

  const targetDate = dayjs().add(days, 'day')
  let dateString = targetDate.calendar('jalali').format('YYYY/MM/DD')

  if (props.enableTime) {
    dateString += ` ${selectedHour.value.toString().padStart(2, '0')}:${selectedMinute.value.toString().padStart(2, '0')}`
  }

  selectedDate.value = dateString
  modelValue.value = dateString

  // Update current view to the target month
  currentYear.value = Number.parseInt(targetDate.calendar('jalali').format('YYYY'))
  currentMonth.value = Number.parseInt(targetDate.calendar('jalali').format('MM'))
}

// Watch for external changes to modelValue
watch(modelValue, (newValue) => {
  if (newValue !== selectedDate.value) {
    selectedDate.value = newValue || ''

    // Parse time if enableTime is true
    if (props.enableTime && newValue) {
      const parts = newValue.split(' ')
      if (parts.length > 1) {
        const timePart = parts[parts.length - 1]
        if (timePart) {
          const timeParts = timePart.split(':')
          if (timeParts.length === 2 && timeParts[0] && timeParts[1]) {
            selectedHour.value = Number.parseInt(timeParts[0]) || 12
            selectedMinute.value = Number.parseInt(timeParts[1]) || 0
          }
        }
      }
    }
  }
}, { immediate: true })
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :disabled="disabled"
        :class="cn(
          'w-full justify-start text-right font-normal',
          !selectedDate && 'text-muted-foreground',
          props.class,
        )"
        dir="rtl"
      >
        <CalendarIcon class="ml-2 h-4 w-4" />
        {{ displayValue }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <div class="flex flex-col gap-2 p-2" dir="rtl">
        <!-- Presets -->
        <div v-if="showPresets" class="border-b pb-2">
          <Select @update:model-value="selectPreset">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="انتخاب سریع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="preset in presetItems"
                :key="preset.value"
                :value="preset.value.toString()"
              >
                {{ preset.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Calendar Content -->
        <div class="p-1">
          <!-- Year Picker View -->
          <div v-if="showYearPicker" class="space-y-4">
            <div class="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                @click="showYearPicker = false"
              >
                بازگشت
              </Button>
              <div class="text-sm font-medium">
                انتخاب سال
              </div>
              <div />
            </div>

            <div
              ref="yearScrollContainer"
              class="max-h-64 w-64 overflow-y-auto space-y-1 scrollbar-thin"
            >
              <button
                v-for="year in yearRange"
                :key="year"
                :data-year="year"
                type="button"
                :class="cn(
                  'w-full p-2 text-sm rounded-md transition-colors text-center',
                  'hover:bg-accent hover:text-accent-foreground',
                  {
                    'bg-primary text-primary-foreground': year === currentYear,
                    'font-medium': year === getCurrentPersianYear(),
                  },
                )"
                @click="selectYear(year)"
              >
                {{ year }}
              </button>
            </div>
          </div>

          <!-- Calendar View -->
          <div v-else>
            <!-- Header with navigation -->
            <div class="flex items-center justify-between mb-4">
              <button
                class="p-1 hover:bg-accent rounded-md transition-colors"
                type="button"
                @click="goToPreviousMonth"
              >
                <ChevronRight class="size-4" />
              </button>

              <button
                class="text-sm font-medium hover:bg-accent rounded-md px-2 py-1 transition-colors"
                type="button"
                @click="toggleYearPicker"
              >
                {{ currentMonthName }} {{ currentYear }}
              </button>

              <button
                class="p-1 hover:bg-accent rounded-md transition-colors"
                type="button"
                @click="goToNextMonth"
              >
                <ChevronLeft class="size-4" />
              </button>
            </div>

            <!-- Weekday headers -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              <div
                v-for="weekDay in persianWeekDays"
                :key="weekDay"
                class="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {{ weekDay }}
              </div>
            </div>

            <!-- Calendar grid -->
            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="(day, index) in calendarDays"
                :key="index"
                type="button"
                :disabled="day.disabled || !day.isCurrentMonth"
                :class="cn(
                  'h-8 w-8 text-sm rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                  {
                    'text-muted-foreground cursor-not-allowed': day.disabled || !day.isCurrentMonth,
                    'bg-primary text-primary-foreground': day.isSelected,
                    'hover:bg-primary/90': day.isSelected,
                  },
                )"
                @click="selectDate(day)"
              >
                {{ day.day }}
              </button>
            </div>

            <!-- Time Picker -->
            <div v-if="enableTime" class="mt-4 pt-3 border-t">
              <div class="flex items-center gap-2 mb-3">
                <Clock class="size-4" />
                <span class="text-sm font-medium">زمان</span>
              </div>

              <div class="flex items-center justify-center gap-4">
                <!-- Hours -->
                <div class="text-center">
                  <div class="text-xs text-muted-foreground mb-1">
                    ساعت
                  </div>
                  <div class="flex flex-col gap-1">
                    <button
                      type="button"
                      class="p-1 hover:bg-accent rounded text-xs"
                      @click="incrementHour"
                    >
                      +
                    </button>
                    <input
                      v-model="selectedHour"
                      type="number"
                      min="0"
                      max="23"
                      class="w-12 h-8 text-center bg-accent rounded text-sm font-mono border-0 focus:ring-2 focus:ring-primary focus:outline-none"
                      @input="validateAndUpdateHour"
                    >
                    <button
                      type="button"
                      class="p-1 hover:bg-accent rounded text-xs"
                      @click="decrementHour"
                    >
                      -
                    </button>
                  </div>
                </div>

                <div class="text-lg font-bold">
                  :
                </div>

                <!-- Minutes -->
                <div class="text-center">
                  <div class="text-xs text-muted-foreground mb-1">
                    دقیقه
                  </div>
                  <div class="flex flex-col gap-1">
                    <button
                      type="button"
                      class="p-1 hover:bg-accent rounded text-xs"
                      @click="incrementMinute"
                    >
                      +
                    </button>
                    <input
                      v-model="selectedMinute"
                      type="number"
                      min="0"
                      max="59"
                      class="w-12 h-8 text-center bg-accent rounded text-sm font-mono border-0 focus:ring-2 focus:ring-primary focus:outline-none"
                      @input="validateAndUpdateMinute"
                    >
                    <button
                      type="button"
                      class="p-1 hover:bg-accent rounded text-xs"
                      @click="decrementMinute"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
