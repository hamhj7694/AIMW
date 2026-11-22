import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ModuleLinkProvider } from './app/ModuleLinks'
import { AppShell } from './app/AppShell'
import { S0Collector } from './routes/S0Collector'
import { S1References, S2Studio, S3Publishing, S4Insights } from './routes/CoreFlow'
import { S5OwnContent, S6Forecast, S7Segments } from './routes/SupportModules'
import { S8VideoWorkbench } from './routes/S8VideoWorkbench'
import { S9SeoGrowth } from './routes/S9SeoGrowth'

export default function App() {
  return (
    <ModuleLinkProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/s0" replace />} />
            <Route path="/s0" element={<S0Collector />} />
            <Route path="/s1" element={<S1References />} />
            <Route path="/s2" element={<S2Studio />} />
            <Route path="/s3" element={<S3Publishing />} />
            <Route path="/s4" element={<S4Insights />} />
            <Route path="/s5" element={<S5OwnContent />} />
            <Route path="/s6" element={<S6Forecast />} />
            <Route path="/s7" element={<S7Segments />} />
            <Route path="/s8" element={<S8VideoWorkbench />} />
            <Route path="/s9" element={<S9SeoGrowth />} />
            <Route path="*" element={<Navigate to="/s0" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModuleLinkProvider>
  )
}
