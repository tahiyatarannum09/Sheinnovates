import { createContext, useContext, useState } from 'react'

const EcoContext = createContext(null)

export function EcoProvider({ children }) {
  const [ecoCredits, setEcoCredits] = useState(120)
  const [co2Saved, setCo2Saved] = useState(14.7)
  const [packagesScanned, setPackagesScanned] = useState(3)
  const [plantsGrown, setPlantsGrown] = useState(2)
  const [wasteEntries, setWasteEntries] = useState([
    { id: 1, type: 'Agricultural Residue', kg: 5.2, date: '2026-11-25', value: 42, status: 'Processed' },
    { id: 2, type: 'Organic Waste', kg: 2.8, date: '2026-11-26', value: 22, status: 'Composted' },
    { id: 3, type: 'Plastic Waste', kg: 1.1, date: '2026-11-27', value: 15, status: 'Recycled' },
  ])

  const addCredits = (amount) => setEcoCredits(c => c + amount)
  const spendCredits = (amount) => setEcoCredits(c => Math.max(0, c - amount))
  const recordScan = () => {
    setPackagesScanned(n => n + 1)
    addCredits(25)
    setCo2Saved(c => +(c + 1.2).toFixed(1))
  }
  const recordPlant = () => setPlantsGrown(n => n + 1)
  const addWasteEntry = (entry) => {
    setWasteEntries(entries => [
      { id: Date.now(), ...entry, date: new Date().toISOString().slice(0, 10) },
      ...entries,
    ])
    addCredits(entry.value || 10)
  }

  return (
    <EcoContext.Provider value={{
      ecoCredits, co2Saved, packagesScanned, plantsGrown, wasteEntries,
      addCredits, spendCredits, recordScan, recordPlant, addWasteEntry,
    }}>
      {children}
    </EcoContext.Provider>
  )
}

export function useEco() {
  return useContext(EcoContext)
}
