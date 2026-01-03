'use client'

import { useState, useEffect } from 'react'
import { Plus, Calculator, Calendar, TrendingUp, Fuel, Utensils, Coffee } from 'lucide-react'
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns'

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  date: string
}

const categories = [
  { name: 'Bensin', icon: Fuel, color: 'bg-emerald-500' },
  { name: 'Makan', icon: Utensils, color: 'bg-green-500' },
  { name: 'Freeday', icon: Coffee, color: 'bg-teal-500' },
  { name: 'Lainnya', icon: Calculator, color: 'bg-slate-500' }
]

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [randomQuote, setRandomQuote] = useState('')
  const [newExpense, setNewExpense] = useState({
    category: 'Makan',
    amount: ''
  })

  // Load expenses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) {
      setExpenses(JSON.parse(saved))
    }
  }, [])

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const formatNumber = (value: string) => {
    if (!value) return ''
    const number = value.replace(/\D/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const addExpense = () => {
    if (!newExpense.amount) return

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseInt(newExpense.amount.replace(/\D/g, '')),
      description: `Pengeluaran ${newExpense.category}`,
      date: new Date().toISOString()
    }

    setExpenses([expense, ...expenses])
    setNewExpense({ category: 'Makan', amount: '' })
    setShowAddForm(false)
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  // Group expenses by week
  const groupExpensesByWeek = (expenses: Expense[]) => {
    const grouped: { [key: string]: Expense[] } = {}
    
    expenses.forEach(expense => {
      const expenseDate = parseISO(expense.date)
      const weekStart = startOfWeek(expenseDate, { weekStartsOn: 1 }) // Monday
      const weekEnd = endOfWeek(expenseDate, { weekStartsOn: 1 })
      const weekKey = `${format(weekStart, 'd MMM')} - ${format(weekEnd, 'd MMM yyyy')}`
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = []
      }
      grouped[weekKey].push(expense)
    })
    
    return grouped
  }

const motivationalQuotes = [
    "Setiap hari adalah kesempatan baru.",
    "Kecil konsisten lebih baik dari besar sesekali.",
    "Sukses adalah hasil dari kebiasaan kecil.",
    "Investasi terbaik adalah investasi pada diri sendiri.",
    "Disiplin hari ini menentukan masa depanmu.",
    "Setiap rupiah yang dihemat adalah langkah menuju kebebasan.",
    "Kontrol pengeluaran, kontrol hidupmu.",
    "Hari ini adalah hadiah, itulah mengapa disebut present.",
    "Keuangan yang sehat adalah fondasi kehidupan yang bahagia.",
    "Menabung bukan tentang mengurangi, tapi tentang menambah masa depan.",
    "Setiap keputusan finansianya adalah investasi pada dirimu.",
    "Konsistensi adalah kunci kebebasan finansial.",
    "Hemat hari ini, nikmati besok.",
    "Uang adalah alat, bukan tujuan akhir.",
    "Kontrol uangmu, jangan biarkan uang mengontrolmu.",
    "Setiap pengeluaran adalah pilihan, buatlah yang bijak.",
    "Kebiasaan kecil menghasilkan hasil besar.",
    "Financial freedom dimulai dari mindset yang benar.",
    "Investasi waktu sekarang, nikmati hasilnya nanti.",
    "Anggaran adalah rencana, bukan batasan.",
    "Setiap sen yang dihitung adalah sen yang dihargai.",
    "Kesuksesan finansial adalah maraton, bukan sprint.",
    "Prioritaskan kebutuhan, bukan keinginan.",
    "Hari ini adalah kesempatan untuk menjadi lebih baik.",
    "Disiplin finansial adalah bentuk cinta pada masa depan.",
    "Setiap catatan pengeluaran adalah langkah kesadaran.",
    "Uang tidak bisa membeli kebahagiaan, tapi mengelolanya bisa.",
    "Kontrol emosi, kontrol dompet.",
    "Investasi pengetahuan adalah investasi terbaik.",
    "Setiap hari adalah kesempatan untuk belajar.",
    "Kebebasan finansial dimulai dari pengendalian diri.",
    "Anggaran adalah peta menuju tujuan finansial.",
    "Setiap penghematan adalah kemenangan kecil.",
    "Konsistensi mengalahkan intensitas.",
    "Pikirkan panjang, bertindak sekarang.",
    "Uang adalah energi, arahkan dengan bijak.",
    "Setiap keputusan kecil membentuk masa depan besar.",
    "Kontrol hari ini, nikmati besok.",
    "Investasi pada diri adalah yang paling menguntungkan.",
    "Setiap rupiah memiliki tujuan.",
    "Kebiasaan finansial yang baik menciptakan kehidupan yang baik.",
    "Sadari setiap pengeluaran, sadari setiap pilihan.",
    "Financial peace dimulai dari clarity.",
    "Setiap hari adalah kesempatan untuk memperbaiki.",
    "Kontrol pengeluaran, bebaskan masa depan.",
    "Investasi terbaik adalah pada kebiasaan baik.",
    "Setiap keputusan finansial mencerminkan prioritasmu.",
    "Anggaran adalah alat untuk mencapai impian.",
    "Konsistensi dalam menabung membentuk kekayaan.",
    "Setiap hari adalah langkah menuju tujuan.",
    "Kontrol keuangan, kontrol kehidupan.",
    "Investasi waktu dan uang dengan bijak.",
    "Setiap penghematan adalah investasi pada masa depan."
  ]

  // Get random quote
  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  }

  // Set random quote after hydration
  useEffect(() => {
    setRandomQuote(getRandomQuote())
  }, [])

 // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 10) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  const groupedExpenses = groupExpensesByWeek(expenses)
  const today = new Date().toDateString()
  const todayExpenses = expenses.filter(exp => 
    new Date(exp.date).toDateString() === today
  )
  const dailyTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date)
    return expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear
  })
  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-lg font-semibold mb-1">{getGreeting()}, Asdar 👋</h1>
        <p className="text-white/90 text-sm italic">{randomQuote || 'Loading...'}</p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm opacity-90">Hari Ini</span>
            </div>
            <div className="text-xl font-bold">Rp {dailyTotal.toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm opacity-90">Bulan Ini</span>
            </div>
            <div className="text-xl font-bold">Rp {monthlyTotal.toLocaleString('id-ID')}</div>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Pengeluaran Baru</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Category Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">Kategori</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(cat => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setNewExpense({...newExpense, category: cat.name})}
                        className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
                          newExpense.category === cat.name
                            ? `${cat.color} text-white shadow-lg scale-105`
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">Jumlah (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                  <input
                    type="text"
                    value={formatNumber(newExpense.amount)}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-semibold text-slate-900"
                    placeholder="10.000"
                  />
                </div>
                
                {/* Quick Nominal Buttons */}
                <div className="mt-3">
                  <label className="text-xs text-gray-500 mb-2 block">Quick Nominal</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5000, 10000, 15000, 50000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setNewExpense({...newExpense, amount: amount.toString()})}
                        className="py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors"
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
                  className="flex-1 py-4 border border-slate-300 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={addExpense}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="px-6 mt-6">
        <h2 className="font-semibold text-slate-700 mb-4">Pengeluaran per Minggu</h2>
        <div className="space-y-6 pb-20">
          {Object.keys(groupedExpenses).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada pengeluaran</p>
            </div>
          ) : (
            Object.entries(groupedExpenses).map(([weekRange, weekExpenses]) => {
              const weekTotal = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0)
              
              return (
                <div key={weekRange} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Week Header */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">{weekRange}</h3>
                      <div className="text-sm font-semibold text-emerald-600">
                        Total: Rp {weekTotal.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Week Expenses */}
                  <div className="divide-y divide-slate-50">
                    {weekExpenses.map(expense => {
                      const category = categories.find(c => c.name === expense.category)
                      const Icon = category?.icon || Calculator
                      return (
                        <div key={expense.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 ${category?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-800">{expense.category}</div>
                                <div className="text-xs text-slate-400 mt-1">
                                  {new Date(expense.date).toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-slate-800">Rp {expense.amount.toLocaleString('id-ID')}</div>
                              <button
                                onClick={() => deleteExpense(expense.id)}
                                className="text-xs text-red-500 hover:text-red-700 mt-1"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
