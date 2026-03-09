# Bug Fixes — Cardio Timer

---

## Bug 1 — Timer tidak realtime saat resume

**File:** `src/components/CardioTimer.tsx`

**Masalah:**
Ketika timer dijeda di tengah detik (misal 0.5s setelah tick terakhir), lalu dilanjutkan, `go()` membuat `setInterval` baru dengan delay penuh 1000ms. Akibatnya detik yang sedang berjalan menjadi 1.5 detik, bukan 0.5 detik — timer "kecolongan" waktu.

**Root cause:**
`go()` selalu memanggil `startInterval()` yang langsung membuat interval baru dari nol, tanpa memperhitungkan berapa lama detik sudah berjalan saat tombol Jeda ditekan.

**Fix:**
Tambah 3 ref di `CardioTimer.tsx`:
- `lastTickRef` — timestamp saat tick terakhir terjadi
- `elapsedRef` — ms yang sudah berlalu sejak tick terakhir (disimpan saat pause)
- `timeoutRef` — untuk setTimeout partial detik pertama saat resume

Saat **Jeda**: simpan `elapsedRef = Date.now() - lastTickRef`
Saat **Lanjut**: tick pertama hanya menunggu `1000 - elapsed` ms via `setTimeout`, lalu lanjut `setInterval` biasa.

---

## Bug 2 — Font di komponen DifficultyPills tidak scale

**File:** `src/components/DifficultyPills.tsx`

**Masalah:**
Ketika ukuran font global diubah via `--ct-base-size` di `src/styles/theme.css`, teks pada 3 tombol pill (Pemula / Menengah / Lanjut) tidak ikut membesar.

**Root cause:**
Elemen `<button>` HTML tidak otomatis mewarisi `font-size` dari parent — user-agent stylesheet browser menetapkan `font-size: medium` yang bersifat fixed. Class Tailwind `text-xs` (berbasis `rem`) seharusnya scale, tapi terblokir oleh perilaku default button.

**Fix:**
Ganti `text-xs` → `text-[0.75em]` pada elemen `<button>` pill. Nilai `em` bersifat eksplisit relatif terhadap parent, memaksa cascade bekerja dengan benar.

**Catatan umum:**
Elemen form HTML (`<button>`, `<select>`, `<input>`) tidak inherit `font-size` secara default. Selalu gunakan `em` atau `font-size: inherit` secara eksplisit untuk memastikan scaling berfungsi.
