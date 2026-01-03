'use client'

import { useState, useEffect } from 'react'
import { Plus, Calculator, Calendar, TrendingUp, Fuel, Utensils, Coffee, X, Trash2 } from 'lucide-react'
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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [showDeleteButton, setShowDeleteButton] = useState<string | null>(null)
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
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      setExpenses(expenses.filter(exp => exp.id !== deleteConfirm))
      setDeleteConfirm(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const toggleDeleteButton = (id: string) => {
    setShowDeleteButton(showDeleteButton === id ? null : id)
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

  // Get random quote
  const getRandomQuote = () => {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    return `"${quote.text}"\n- ${quote.author}`
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
        <p className="text-white/90 text-sm italic whitespace-pre-line">{randomQuote}</p>
        
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
                              <button
                                onClick={() => toggleDeleteButton(expense.id)}
                                className={`w-10 h-10 ${showDeleteButton === expense.id ? 'bg-red-500' : (category?.color || 'bg-gray-500')} rounded-xl flex items-center justify-center transition-all hover:scale-110`}
                              >
                                {showDeleteButton === expense.id ? (
                                  <Trash2 className="w-5 h-5 text-white" />
                                ) : (
                                  <Icon className="w-5 h-5 text-white" />
                                )}
                              </button>
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
                              {showDeleteButton === expense.id && (
                                <button
                                  onClick={() => deleteExpense(expense.id)}
                                  className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center justify-end animate-fade-in"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Hapus Pengeluaran</h3>
            <p className="text-slate-600 text-sm">Apakah Anda yakin ingin menghapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={cancelDelete}
              className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}
