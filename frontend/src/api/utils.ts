export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function maybeFail({
  probability,
  message,
}: {
  probability: number
  message: string
}) {
  if (Math.random() < probability) {
    const err = new Error(message)
    ;(err as Error & { code?: string }).code = 'MOCK_FAIL'
    throw err
  }
}

