import { createContext } from 'react'

export type ModuleLink = {
  id: string
  from: string
  to: string
  createdAt: string
  createdBy: string
}

export type ModuleLinkContextValue = {
  links: ModuleLink[]
  connect: (from: string, to: string) => void
  disconnect: (id: string) => void
}

export const ModuleLinkContext = createContext<ModuleLinkContextValue | null>(null)
