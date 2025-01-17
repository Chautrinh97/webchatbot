import {NextUIProvider} from '@nextui-org/react'

export function NextUI({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}