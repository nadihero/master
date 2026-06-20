'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, Calculator, Calendar, TrendingUp, Fuel, Utensils, Coffee, X, Trash2, Loader2 } from 'lucide-react'
import { format, startOfWeek, endOfWeek, parseISO } from 'date-fns'

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  created_at: string
}

const categories = [
  { name: 'Bensin', icon: Fuel, color: 'bg-emerald-500' },
  { name: 'Makan', icon: Utensils, color: 'bg-green-500' },
  { name: 'Freeday', icon: Coffee, color: 'bg-teal-500' },
  { name: 'Lainnya', icon: Calculator, color: 'bg-slate-500' }
]

const motivationalQuotes = [
  { text: "Setiap hari adalah kesempatan baru.", author: "Anonim" },
  { text: "Kecil konsisten lebih baik dari besar sesekali.", author: "James Clear" },
  { text: "Sukses adalah hasil dari kebiasaan kecil.", author: "Darren Hardy" },
  { text: "Investasi terbaik adalah investasi pada diri sendiri.", author: "Zig Ziglar" },
  { text: "Disiplin hari ini menentukan masa depanmu.", author: "Anonim" },
  { text: "Setiap rupiah yang dihemat adalah langkah menuju kebebasan.", author: "Anonim" },
  { text: "Kontrol pengeluaran, kontrol hidupmu.", author: "Anonim" },
  { text: "Hari ini adalah hadiah, itulah mengapa disebut present.", author: "Eleanor Roosevelt" },
  { text: "Keuangan yang sehat adalah fondasi kehidupan yang bahagia.", author: "Anonim" },
  { text: "Menabung bukan tentang mengurangi, tapi tentang menambah masa depan.", author: "Anonim" },
  { text: "Setiap keputusan finansianya adalah investasi pada dirimu.", author: "Anonim" },
  { text: "Konsistensi adalah kunci kebebasan finansial.", author: "Anonim" },
  { text: "Hemat hari ini, nikmati besok.", author: "Anonim" },
  { text: "Uang adalah alat, bukan tujuan akhir.", author: "Tony Robbins" },
  { text: "Kontrol uangmu, jangan biarkan uang mengontrolmu.", author: "Anonim" },
  { text: "Setiap pengeluaran adalah pilihan, buatlah yang bijak.", author: "Anonim" },
  { text: "Kebiasaan kecil menghasilkan hasil besar.", author: "Stephen Covey" },
  { text: "Financial freedom dimulai dari mindset yang benar.", author: "Robert Kiyosaki" },
  { text: "Investasi waktu sekarang, nikmati hasilnya nanti.", author: "Anonim" },
  { text: "Anggaran adalah rencana, bukan batasan.", author: "Anonim" },
  { text: "Setiap sen yang dihitung adalah sen yang dihargai.", author: "Anonim" },
  { text: "Kesuksesan finansial adalah maraton, bukan sprint.", author: "Anonim" },
  { text: "Prioritaskan kebutuhan, bukan keinginan.", author: "Anonim" },
  { text: "Hari ini adalah kesempatan untuk menjadi lebih baik.", author: "Anonim" },
  { text: "Disiplin finansial adalah bentuk cinta pada masa depan.", author: "Anonim" },
  { text: "Setiap catatan pengeluaran adalah langkah kesadaran.", author: "Anonim" },
  { text: "Uang tidak bisa membeli kebahagiaan, tapi mengelolanya bisa.", author: "Anonim" },
  { text: "Kontrol emosi, kontrol dompet.", author: "Anonim" },
  { text: "Investasi pengetahuan adalah investasi terbaik.", author: "Benjamin Franklin" },
  { text: "Setiap hari adalah kesempatan untuk belajar.", author: "Anonim" },
  { text: "Kebebasan finansial dimulai dari pengendalian diri.", author: "Anonim" },
  { text: "Anggaran adalah peta menuju tujuan finansial.", author: "Anonim" },
  { text: "Setiap penghematan adalah kemenangan kecil.", author: "Anonim" },
  { text: "Konsistensi mengalahkan intensitas.", author: "Anonim" },
  { text: "Pikirkan panjang, bertindak sekarang.", author: "Anonim" },
  { text: "Uang adalah energi, arahkan dengan bijak.", author: "Anonim" },
  { text: "Setiap keputusan kecil membentuk masa depan besar.", author: "Anonim" },
  { text: "Kontrol hari ini, nikmati besok.", author: "Anonim" },
  { text: "Investasi pada diri adalah yang paling menguntungkan.", author: "Anonim" },
  { text: "Setiap rupiah memiliki tujuan.", author: "Anonim" },
  { text: "Kebiasaan finansial yang baik menciptakan kehidupan yang baik.", author: "Anonim" },
  { text: "Sadari setiap pengeluaran, sadari setiap pilihan.", author: "Anonim" },
  { text: "Financial peace dimulai dari clarity.", author: "Dave Ramsey" },
  { text: "Setiap hari adalah kesempatan untuk memperbaiki.", author: "Anonim" },
  { text: "Kontrol pengeluaran, bebaskan masa depan.", author: "Anonim" },
  { text: "Investasi terbaik adalah pada kebiasaan baik.", author: "Anonim" },
  { text: "Setiap keputusan finansial mencerminkan prioritasmu.", author: "Anonim" },
  { text: "Anggaran adalah alat untuk mencapai impian.", author: "Anonim" },
  { text: "Konsistensi dalam menabung membentuk kekayaan.", author: "Anonim" },
  { text: "Setiap hari adalah langkah menuju tujuan.", author: "Anonim" },
  { text: "Kontrol keuangan, kontrol kehidupan.", author: "Anonim" },
  { text: "Investasi waktu dan uang dengan bijak.", author: "Anonim" },
  { text: "Setiap penghematan adalah investasi pada masa depan.", author: "Anonim" }
]

const SWIPE_THRESHOLD = 80

function SwipeableExpenseItem({
  expense,
  onDelete,
  showDeleteButton,
  isLast
}: {
  expense: Expense
  onDelete: (id: string) => void
  showDeleteButton: boolean
  isLast: boolean
}) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isSwiped, setIsSwiped] = useState(showDeleteButton)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsSwiped(showDeleteButton)
    if (!showDeleteButton) {
      setTranslateX(0)
    }
  }, [showDeleteButton])

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
  }, [])

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return
    const diff = startX - clientX
    if (diff > 0) {
      setTranslateX(Math.min(diff, 100))
    } else {
      setTranslateX(Math.max(diff, 0))
    }
  }, [isDragging, startX])

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    if (translateX >= SWIPE_THRESHOLD) {
      setTranslateX(80)
      setIsSwiped(true)
      onDelete(expense.id)
    } else {
      setTranslateX(0)
      setIsSwiped(false)
    }
  }, [isDragging, translateX, expense.id, onDelete])

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseUpGlobal = () => handleEnd()
    const handleMouseMoveGlobal = (e: MouseEvent) => handleMove(e.clientX)

    window.addEventListener('mouseup', handleMouseUpGlobal)
    window.addEventListener('mousemove', handleMouseMoveGlobal)

    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal)
      window.removeEventListener('mousemove', handleMouseMoveGlobal)
    }
  }, [isDragging, handleEnd, handleMove])

  const category = categories.find(c => c.name === expense.category)
  const Icon = category?.icon || Calculator

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderBottom: isLast ? 'none' : '1px solid rgba(163, 177, 198, 0.15)'
      }}
    >
      {/* Delete Background */}
      <div
        className="absolute inset-0 flex items-center justify-end pr-6"
        style={{ background: '#ef4444' }}
      >
        <Trash2 className="w-5 h-5 text-white" />
      </div>

      {/* Content */}
      <div
        ref={itemRef}
        className="relative p-4 transition-transform"
        style={{
          transform: `translateX(-${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 300ms ease-out',
          touchAction: 'pan-y',
          background: '#E0E5EC',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { if (isDragging) handleEnd() }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 ${category?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium" style={{ color: '#3D4852' }}>{expense.category}</div>
              <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                {new Date(expense.created_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          <div className="font-semibold" style={{ color: '#3D4852' }}>
            Rp {expense.amount.toLocaleString('id-ID')}
          </div>
        </div>

        {translateX > 20 && (
          <div className="absolute top-2 right-2 text-xs font-medium text-red-400 animate-fade-in">
            Geser untuk hapus
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [randomQuote, setRandomQuote] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [swipedId, setSwipedId] = useState<string | null>(null)
  const [showSixMonth, setShowSixMonth] = useState(false)
  const [activeTab, setActiveTab] = useState<'expenses' | 'sixmonth'>('expenses')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: 'Makan',
    amount: ''
  })

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses')
      const json = await res.json()
      if (json.data) {
        setExpenses(json.data)
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  useEffect(() => {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setRandomQuote(`"${quote.text}"\n- ${quote.author}`)
  }, [])

  const formatNumber = (value: string) => {
    if (!value) return ''
    const number = value.replace(/\D/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const addExpense = async () => {
    if (!newExpense.amount) return

    setSaving(true)
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newExpense.category,
          amount: parseInt(newExpense.amount.replace(/\D/g, '')),
          description: `Pengeluaran ${newExpense.category}`,
          date: new Date().toISOString(),
        }),
      })

      const json = await res.json()
      if (json.data) {
        setExpenses([json.data, ...expenses])
        setNewExpense({ category: 'Makan', amount: '' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Failed to add expense:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSwipeDelete = (id: string) => {
    setSwipedId(id)
    setDeleteConfirm(id)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    try {
      const res = await fetch(`/api/expenses?id=${deleteConfirm}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setExpenses(expenses.filter(exp => exp.id !== deleteConfirm))
        setDeleteConfirm(null)
        setSwipedId(null)
      }
    } catch (error) {
      console.error('Failed to delete expense:', error)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
    setSwipedId(null)
  }

  const groupExpensesByWeek = (expenses: Expense[]) => {
    const grouped: { [key: string]: Expense[] } = {}
    
    expenses.forEach(expense => {
      const expenseDate = parseISO(expense.created_at)
      const weekStart = startOfWeek(expenseDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(expenseDate, { weekStartsOn: 1 })
      const weekKey = `${format(weekStart, 'd MMM')} - ${format(weekEnd, 'd MMM yyyy')}`
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = []
      }
      grouped[weekKey].push(expense)
    })
    
    return grouped
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 10) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  const groupedExpenses = groupExpensesByWeek(expenses)
  const today = new Date()
  const todayString = today.toDateString()
  const todayExpenses = expenses.filter(exp => 
    new Date(exp.created_at).toDateString() === todayString
  )
  const dailyTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const thisMonth = today.getMonth()
  const thisYear = today.getFullYear()
  
  const getMonthlyPeriodStart = () => {
    const start = new Date(thisYear, thisMonth, 28)
    if (start.getDate() !== 28) {
      return new Date(thisYear, thisMonth, 0)
    }
    if (today.getDate() >= 28) {
      return start
    }
    return new Date(thisYear, thisMonth - 1, 28)
  }
  
  const getMonthlyPeriodEnd = () => {
    const start = getMonthlyPeriodStart()
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 27)
    return end
  }
  
  const periodStart = getMonthlyPeriodStart()
  const periodEnd = getMonthlyPeriodEnd()
  
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.created_at)
    return expDate >= periodStart && expDate <= periodEnd
  })
  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  
  const getSixMonthExpenses = () => {
    if (!showSixMonth) return []
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())
    return expenses.filter(exp => {
      const expDate = new Date(exp.created_at)
      return expDate >= sixMonthsAgo && expDate <= today
    })
  }
  
  const sixMonthExpenses = getSixMonthExpenses()
  const sixMonthTotal = sixMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="min-h-screen" style={{ background: '#E0E5EC' }}>
      {/* Header */}
      <div className="p-6 pb-8">
        <div className="neu-card p-6">
          <h1 className="font-display text-xl font-extrabold tracking-tight mb-1" style={{ color: '#3D4852' }}>
            {getGreeting()}, Asdar
          </h1>
          <p className="text-sm italic whitespace-pre-line mb-6" style={{ color: '#6B7280' }}>
            {randomQuote}
          </p>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="neu-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="neu-icon-well w-8 h-8 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" style={{ color: '#6C63FF' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#6B7280' }}>Hari Ini</span>
              </div>
              <div className="font-display text-lg font-bold" style={{ color: '#3D4852' }}>
                Rp {dailyTotal.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="neu-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="neu-icon-well w-8 h-8 rounded-xl flex items-center justify-center">
                    <Calendar className="w-4 h-4" style={{ color: '#38B2AC' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#6B7280' }}>Bulan Ini</span>
                </div>
                <button
                  onClick={() => setShowSixMonth(!showSixMonth)}
                  className="text-xs font-medium transition-all duration-300 hover:scale-105"
                  style={{ color: '#6C63FF' }}
                >
                  {showSixMonth ? 'Sembunyi' : 'Tampilkan'}
                </button>
              </div>
              <div className="font-display text-lg font-bold" style={{ color: '#3D4852' }}>
                Rp {monthlyTotal.toLocaleString('id-ID')}
              </div>
              {showSixMonth && (
                <div className="mt-3 pt-3 animate-fade-in" style={{ borderTop: '1px solid rgba(163, 177, 198, 0.3)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3" style={{ color: '#6B7280' }} />
                    <span className="text-xs" style={{ color: '#6B7280' }}>6 Bulan</span>
                  </div>
                  <div className="font-display text-base font-semibold" style={{ color: '#6C63FF' }}>
                    Rp {sixMonthTotal.toLocaleString('id-ID')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="neu-inset-deep rounded-2xl p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeTab === 'expenses'
                  ? 'neu-extruded-small'
                  : ''
              }`}
              style={{ 
                color: activeTab === 'expenses' ? '#6C63FF' : '#6B7280',
              }}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setActiveTab('sixmonth')}
              className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeTab === 'sixmonth'
                  ? 'neu-extruded-small'
                  : ''
              }`}
              style={{ 
                color: activeTab === 'sixmonth' ? '#6C63FF' : '#6B7280',
              }}
            >
              Per 6 Bulan
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'expenses' ? (
        <>
          {/* Floating Add Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 neu-extruded"
            style={{ background: '#6C63FF' }}
          >
            <Plus className="w-6 h-6 text-white" />
          </button>

          {/* Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
              <div className="animate-slide-up w-full max-w-lg" style={{ background: '#E0E5EC', borderTopLeftRadius: '32px', borderTopRightRadius: '32px' }}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(163, 177, 198, 0.3)' }}>
                  <h3 className="font-display text-lg font-bold" style={{ color: '#3D4852' }}>Pengeluaran Baru</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="neu-button w-10 h-10 flex items-center justify-center hover:bg-transparent"
                  >
                    <X className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Category Selection */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block" style={{ color: '#3D4852' }}>Kategori</label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(cat => {
                        const Icon = cat.icon
                        return (
                          <button
                            key={cat.name}
                            onClick={() => setNewExpense({...newExpense, category: cat.name})}
                            className={`p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 ${
                              newExpense.category === cat.name
                                ? `${cat.color} text-white neu-extruded-hover scale-105`
                                : 'neu-button'
                            }`}
                            style={newExpense.category !== cat.name ? { color: '#3D4852' } : {}}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{cat.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block" style={{ color: '#3D4852' }}>Jumlah (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-medium" style={{ color: '#6B7280' }}>Rp</span>
                      <input
                        type="text"
                        value={formatNumber(newExpense.amount)}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        className="neu-input w-full pl-12 pr-4 py-4 text-lg font-semibold"
                        style={{ color: '#3D4852' }}
                        placeholder="10.000"
                      />
                    </div>
                    
                    {/* Quick Nominal Buttons */}
                    <div className="mt-3">
                      <label className="text-xs mb-2 block" style={{ color: '#6B7280' }}>Quick Nominal</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[5000, 10000, 15000, 50000].map(amount => (
                          <button
                            key={amount}
                            onClick={() => setNewExpense({...newExpense, amount: amount.toString()})}
                            className="neu-button py-3 px-3 text-sm font-medium transition-colors"
                            style={{ color: '#3D4852' }}
                          >
                            {amount.toLocaleString('id-ID')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="neu-button flex-1 py-4 font-semibold"
                      style={{ color: '#3D4852' }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={addExpense}
                      disabled={saving}
                      className="flex-1 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        background: 'linear-gradient(135deg, #6C63FF, #8B84FF)',
                        boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)'
                      }}
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Simpan'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expense List */}
          <div className="px-6 pb-20">
            <h2 className="font-display font-bold mb-4" style={{ color: '#3D4852' }}>
              Pengeluaran per Minggu
            </h2>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#6C63FF' }} />
                <p style={{ color: '#6B7280' }}>Memuat data...</p>
              </div>
            ) : Object.keys(groupedExpenses).length === 0 ? (
              <div className="text-center py-12 neu-card p-8">
                <Calculator className="w-12 h-12 mx-auto mb-4" style={{ color: '#6B7280', opacity: 0.5 }} />
                <p style={{ color: '#6B7280' }}>Belum ada pengeluaran</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedExpenses).map(([weekRange, weekExpenses]) => {
                  const weekTotal = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                  
                  return (
                    <div key={weekRange} className="neu-card overflow-hidden">
                      {/* Week Header */}
                      <div className="px-4 py-3" style={{ background: 'rgba(108, 99, 255, 0.05)', borderBottom: '1px solid rgba(163, 177, 198, 0.2)' }}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-semibold" style={{ color: '#3D4852' }}>{weekRange}</h3>
                          <div className="text-sm font-semibold" style={{ color: '#6C63FF' }}>
                            Total: Rp {weekTotal.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Week Expenses */}
                      <div style={{ borderTop: '1px solid rgba(163, 177, 198, 0.2)' }}>
                        {weekExpenses.map((expense, idx) => (
                          <SwipeableExpenseItem
                            key={expense.id}
                            expense={expense}
                            onDelete={handleSwipeDelete}
                            showDeleteButton={swipedId === expense.id}
                            isLast={idx === weekExpenses.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="neu-card p-6 max-w-sm mx-4 animate-fade-in">
                <div className="text-center mb-6">
                  <div className="neu-icon-well w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#3D4852' }}>Hapus Pengeluaran</h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Apakah Anda yakin ingin menghapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="neu-button flex-1 py-3 font-medium"
                    style={{ color: '#3D4852' }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-3 rounded-2xl font-medium text-white transition-all duration-300 hover:translate-y-[-1px]"
                    style={{ 
                      background: '#ef4444',
                      boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)'
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="px-6 pb-20">
          <div className="neu-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="neu-icon-well w-10 h-10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" style={{ color: '#6C63FF' }} />
              </div>
              <h2 className="font-display text-lg font-bold" style={{ color: '#3D4852' }}>Rekap 6 Bulan</h2>
            </div>
            
            <div className="text-center py-8">
              <div className="font-display text-3xl font-bold mb-2" style={{ color: '#3D4852' }}>
                Rp {sixMonthTotal.toLocaleString('id-ID')}
              </div>
              <p style={{ color: '#6B7280' }}>Total pengeluaran 6 bulan terakhir</p>
            </div>
            
            <div className="pt-6 animate-fade-in" style={{ borderTop: '1px solid rgba(163, 177, 198, 0.2)' }}>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#6B7280' }}>Rata-rata per bulan</h3>
              <div className="font-display text-xl font-semibold" style={{ color: '#6C63FF' }}>
                Rp {Math.round(sixMonthTotal / 6).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
