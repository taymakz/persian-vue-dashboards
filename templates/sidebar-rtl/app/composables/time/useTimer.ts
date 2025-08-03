/**
 * Interface for specifying timer configuration options
 * 
 * @property second - Number of seconds for the timer (default: 0)
 * @property minute - Number of minutes for the timer (default: 0)
 * @property hour - Number of hours for the timer (default: 0)
 */
interface UseTimerArgs {
  second?: number
  minute?: number
  hour?: number
}

/**
 * Reactive timer utility.
 * Useful for scenarios like OTP resend timers.
 *
 * @param option - Configuration object specifying hours, minutes, and seconds
 * @returns Reactive properties and controls for the timer
 */
export function useTimer(option: UseTimerArgs) {
  // Calculate total time in milliseconds
  const totalTimeInMilliseconds
    = (option.second || 0) * 1000
    + (option.minute || 0) * 60 * 1000
    + (option.hour || 0) * 60 * 60 * 1000

  // Calculate total time in seconds
  const totalTimeInSeconds
    = (option.second || 0)
    + (option.minute || 0) * 60
    + (option.hour || 0) * 60 * 60

  // Reactive control for pending state and start method
  const { isPending, start: startTimer } = useTimeoutFn(
    () => {},
    totalTimeInMilliseconds,
  )

  // Interval control for updating counter
  const { counter, reset, pause } = useInterval(1000, { controls: true })

  // Pause the interval when the timer is no longer pending
  watch(
    () => isPending,
    (oldVal, newVal) => {
      if (oldVal && !newVal)
        pause()
    },
  )

  /**
   * Reset the timer and restart the countdown
   */
  function resetTimer() {
    reset()
    startTimer()
  }

  // Computed property for remaining time in seconds
  const getCounter = computed((): number => totalTimeInSeconds - counter.value)

  // Computed property for formatted time as "MM:SS"
  const getFormattedCounter = computed(() => {
    const remainingTimeInSeconds = getCounter.value
    const formattedMinutes = Math.floor(remainingTimeInSeconds / 60)
    const formattedSeconds = remainingTimeInSeconds % 60
    return `${formattedSeconds.toString().padStart(2, '0')} : ${formattedMinutes}`
  })

  return {
    isPending,
    getFormattedCounter,

    startTimer,
    resetTimer,
  }
}
