export function useGetImageUrl(address: string) {
  const config = useRuntimeConfig()
  return `${config.public.baseStorage}${address}`
}
