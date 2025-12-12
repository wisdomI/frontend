const noop = () => {}

const suppressConsoleForProduction = () => {
  if (process.env.NODE_ENV !== 'production') return

  const blockedMethods: Array<keyof Console> = ['log', 'info', 'debug', 'warn']

  blockedMethods.forEach(method => {
    if (typeof console[method] === 'function') {
      console[method] = noop as any
    }
  })
}

suppressConsoleForProduction()

export {}

