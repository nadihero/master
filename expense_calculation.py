#!/usr/bin/env python3
"""
Daily and Monthly Expense Calculator
Indonesian Rupiah (IDR)
"""

def calculate_expenses():
    # Daily expenses
    bensin_per_3_hari = 50000
    bensin_per_hari = bensin_per_3_hari / 3
    
    makan_per_hari = 10000
    
    freeday_per_2_minggu = 50000
    freeday_per_hari = freeday_per_2_minggu / 14
    
    # Calculate totals
    total_harian = bensin_per_hari + makan_per_hari + freeday_per_hari
    
    # Monthly calculations (assuming 30 days)
    total_bulanan = total_harian * 30
    
    # Print results
    print("=== RINCIAN PENGELUARAN HARIAN ===")
    print(f"Bensin: Rp {bensin_per_hari:,.0f}/hari (Rp {bensin_per_3_hari:,} / 3 hari)")
    print(f"Makan: Rp {makan_per_hari:,.0f}/hari (Nasi Bungkus)")
    print(f"Freeday: Rp {freeday_per_hari:,.0f}/hari (Rp {freeday_per_2_minggu:,} / 2 minggu)")
    print()
    print("=== TOTAL ===")
    print(f"Total Estimasi Harian: Rp {total_harian:,.0f}")
    print(f"Total Estimasi Bulanan (30 hari): Rp {total_bulanan:,.0f}")
    
    # Verify with your estimates
    print()
    print("=== PERBANDINGAN DENGAN ESTIMASI ANDA ===")
    print(f"Estimasi Anda Harian: Rp30,300")
    print(f"Kalkulasi Harian: Rp {total_harian:,.0f}")
    print(f"Estimasi Anda Bulanan: Rp900,000 - Rp950,000")
    print(f"Kalkulasi Bulanan: Rp {total_bulanan:,.0f}")

if __name__ == "__main__":
    calculate_expenses()
