import { useMemo, useState, type ReactNode } from 'react'
import { ModuleLinkContext, type ModuleLink } from './moduleLinkContext'

let sequence = 0

export function ModuleLinkProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<ModuleLink[]>([])

  const value = useMemo(
    () => ({
      links,
      connect: (from: string, to: string) =>
        setLinks((previous) => {
          if (from === to) return previous
          if (previous.some((link) => link.from === from && link.to === to)) return previous
          sequence += 1
          return [
            ...previous,
            {
              id: `module-link-${sequence}`,
              from,
              to,
              createdAt: new Date().toISOString(),
              createdBy: '사용자 클릭',
            },
          ]
        }),
      disconnect: (id: string) => setLinks((previous) => previous.filter((link) => link.id !== id)),
    }),
    [links],
  )

  return <ModuleLinkContext.Provider value={value}>{children}</ModuleLinkContext.Provider>
}
