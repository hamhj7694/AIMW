import { useContext } from 'react'
import { ModuleLinkContext } from './moduleLinkContext'

export function useModuleLinks() {
  const context = useContext(ModuleLinkContext)
  if (!context) throw new Error('ModuleLinkProvider가 필요합니다.')
  return context
}
