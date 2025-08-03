/**
 * A composable that compares two objects of the same type and returns a reactive boolean
 * indicating whether they are different.
 *
 * @param obj1 The first object (reactive or ref)
 * @param obj2 The second object (reactive or ref)
 * @param options Optional configuration for deep comparison
 * @returns A reactive ref indicating if the objects are different
 */

export function useObjectDiff<T extends object>(
  obj1: T | Ref<T>,
  obj2: T | Ref<T>,
  options: { deep?: boolean } = { deep: true },
): Ref<boolean> {
  const isDifferent = ref(false)

  const getValue = (obj: T | Ref<T>): T => {
    return (obj as Ref<T>).value ?? (obj as T)
  }

  // Custom deep comparison function
  const deepCompare = (obj1: any, obj2: any, visited = new WeakMap()): boolean => {
    // Handle non-object types and null
    if (obj1 === obj2)
      return true
    if (obj1 == null || obj2 == null)
      return false
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object')
      return false

    // Check for circular references
    if (visited.has(obj1) && visited.get(obj1) === obj2)
      return true
    visited.set(obj1, obj2)

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length)
      return false

    for (const key of keys1) {
      if (!keys2.includes(key) || !deepCompare(obj1[key], obj2[key], visited)) {
        return false
      }
    }

    return true
  }

  const compareObjects = () => {
    const value1 = getValue(obj1)
    const value2 = getValue(obj2)

    if (!options.deep) {
      isDifferent.value = Object.keys(value1).some(
        key => (value1 as any)[key] !== (value2 as any)[key],
      )
    }
    else {
      // Use custom deep comparison
      isDifferent.value = !deepCompare(value1, value2)
    }
  }

  watch(
    [() => getValue(obj1), () => getValue(obj2)],
    () => {
      compareObjects()
    },
    { deep: options.deep },
  )

  compareObjects()

  return isDifferent
}
