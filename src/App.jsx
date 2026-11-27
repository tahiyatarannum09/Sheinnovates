import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/ui/BottomNav'
import HomePage from './pages/HomePage'
import ScanPage from './pages/ScanPage'
import GardenPage from './pages/GardenPage'
import MarketPage from './pages/MarketPage'
import ImpactPage from './pages/ImpactPage'
import WasteTrackerPage from './pages/WasteTrackerPage'
import { EcoProvider } from './contexts/EcoContext'

export default function App() {
  return (
    <EcoProvider>
      <HashRouter>
        <div className="min-h-screen bg-[#FAFAF7] max-w-md mx-auto relative pb-20 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/garden" element={<GardenPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/waste-tracker" element={<WasteTrackerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </div>
      </HashRouter>
    </EcoProvider>
  )
}
