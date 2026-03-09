# Updates — Cardio Timer

---

## Update 1 — Sistem Font Scaling Terpusat

### Apa yang dilakukan

#### 1. Tambah file config font: `src/styles/theme.css`

File baru sebagai **satu-satunya tempat** untuk mengatur ukuran font dan elemen UI secara global.

```css
:root {
  --ct-base-size: 18px;
}
```

Untuk mengubah skala seluruh website, cukup ubah nilai `--ct-base-size` di file ini — tidak perlu menyentuh komponen manapun.

File ini di-import di `src/app/globals.css`:

```css
@import "../styles/theme.css";
```

Dan nilai variabel langsung dipakai oleh `html`:

```css
html {
  font-size: var(--ct-base-size);
}
```

Karena semua ukuran Tailwind (`text-sm`, `text-xl`, dll.) berbasis `rem`, dan `rem` dihitung relatif terhadap `font-size` pada `html` — maka **satu perubahan di `--ct-base-size` cukup untuk scale seluruh UI**.

#### 2. Konversi semua font ke ukuran relatif (`em`)

Semua nilai font-size di komponen-komponen berikut diubah dari `rem` / class Tailwind fixed ke `em`:

- **`src/components/TimerRing.tsx`** — badge, hint text, progress label, timer number
- **`src/components/DifficultyPills.tsx`** — label section, teks tombol pill
- **`src/components/ExerciseList.tsx`** — nama latihan, deskripsi, label status

**Catatan khusus untuk elemen form HTML (`<button>`, `<input>`, `<select>`):**
Browser menetapkan `font-size: medium` secara default pada elemen-elemen ini, sehingga mereka tidak otomatis mewarisi `font-size` dari parent. Solusinya: gunakan nilai `em` secara eksplisit (bukan `rem` atau class Tailwind berbasis `rem`) agar cascade berfungsi dengan benar.

Contoh di `DifficultyPills.tsx`:

```tsx
// Sebelum (tidak scale):
className = "... text-xs ...";

// Sesudah (scale mengikuti --ct-base-size):
className = "... text-[0.8em] ...";
```

### Cara pakai

Buka `src/styles/theme.css` dan ubah nilai `--ct-base-size`:

| Nilai  | Efek                     |
| ------ | ------------------------ |
| `14px` | Lebih kecil dari default |
| `16px` | Default browser          |
| `18px` | Sedikit lebih besar      |
| `20px` | Besar                    |

Simpan file — seluruh teks dan elemen UI akan menyesuaikan secara otomatis.

---

## Update 2 — Penggantian Emoji ke Lucide Icons & Penyesuaian Default

### Apa yang dilakukan

#### 1. Tombol kontrol (`src/components/CardioTimer.tsx`)

Teks/karakter unicode pada tombol diganti dengan Lucide icons:

| Tombol | Sebelum    | Sesudah            |
| ------ | ---------- | ------------------ |
| Mulai  | `▶ Mulai`  | `Play` + teks      |
| Ulangi | `↺ Ulangi` | `RotateCcw` + teks |
| Jeda   | `⏸ Jeda`   | `Pause` + teks     |
| Lanjut | `▶ Lanjut` | `Play` + teks      |
| Reset  | `↺`        | `RotateCcw`        |

Ditambahkan juga efek hover pada semua tombol aktif:

- `hover:brightness-110` + `hover:scale-[1.02]` — tombol orange (Mulai/Ulangi)
- `hover:brightness-125` + `hover:scale-[1.02]` — tombol Jeda/Lanjut
- `hover:brightness-150` + `hover:scale-[1.05]` — tombol Reset
- `active:scale-[0.97]` — efek "ditekan" pada semua tombol
- `disabled:hover:brightness-100 disabled:hover:scale-100` — memastikan tombol disabled tidak punya efek hover

#### 2. Daftar gerakan (`src/components/ExerciseList.tsx`)

Semua emoji diganti dengan Lucide icons:

| Posisi                   | Sebelum                        | Sesudah                                                                 |
| ------------------------ | ------------------------------ | ----------------------------------------------------------------------- |
| Header section           | `📋`                           | `ListOrdered`                                                           |
| Icon gerakan per kartu   | emoji (`⭐`, `🦵`, `💪`, `🧗`) | mapping per index: `Zap`, `ChevronsUp`, `Dumbbell`, `Mountain`, `Flame` |
| Durasi — clock           | `⏱`                            | `Clock`                                                                 |
| Durasi — istirahat       | `💤`                           | `Moon`                                                                  |
| Durasi — selesai         | `🏁`                           | `Flag`                                                                  |
| Status — sedang aktif    | `🔥`                           | `Flame`                                                                 |
| Status — istirahat aktif | `💤`                           | `Moon`                                                                  |
| Status — selesai         | `✅`                           | `CheckCircle2`                                                          |
| Status — belum giliran   | `—`                            | `Minus`                                                                 |

#### 3. Tampilan tengah ring (`src/components/TimerRing.tsx`)

Icon di tengah SVG ring diganti dari emoji ke Lucide icons:

| Phase    | Sebelum                  | Sesudah                                                                 | Warna         |
| -------- | ------------------------ | ----------------------------------------------------------------------- | ------------- |
| Exercise | `ex.emoji` (⭐/🦵/💪/🧗) | mapping per index: `Zap`, `ChevronsUp`, `Dumbbell`, `Mountain`, `Flame` | Orange        |
| Rest     | `😮‍💨`                     | `BatteryCharging`                                                       | Abu-abu       |
| Done     | `🎉`                     | `Trophy`                                                                | Hijau         |
| Idle     | `🏁`                     | `Timer`                                                                 | Abu-abu gelap |

#### 4. Default durasi latihan (`src/store/timerStore.ts`)

Nilai default `selectedDuration` diubah dari `600` (10 menit) menjadi `300` (5 menit).

---

## Update 3 — Sound Effects & Keyboard Shortcut

### Apa yang dilakukan

#### 1. Sound effect transisi fase (`public/sounds/bong.mp3`)

Suara diputar setiap kali fase berpindah ke `exercise` atau `rest`, memberi tahu user tanpa perlu menatap layar.

Implementasi di `src/components/CardioTimer.tsx`:
- `audioRef` — menyimpan instance `Audio` agar tidak di-recreate setiap render
- `prevPhaseRef` — melacak fase sebelumnya sehingga suara hanya play saat ada transisi, bukan saat pertama render

#### 2. Sound effect ticking (`public/sounds/timer-fixed.mp3`)

Suara denting waktu yang loop terus-menerus selama timer berjalan (fase `exercise` atau `rest`, tidak di-pause). Berhenti otomatis saat dijeda, di-reset, atau selesai.

Implementasi:
- `tickAudioRef` — instance `Audio` dengan `loop = true`
- `useEffect` yang watch `phase` dan `isPaused` — play/pause berdasarkan kondisi timer

#### 3. Keyboard shortcut Spasi

User dapat menekan `Space` untuk mengontrol timer tanpa menyentuh mouse:

| Kondisi | Efek tekan Spasi |
|---------|-----------------|
| `idle` / `done` | Mulai / Ulangi |
| `exercise` / `rest` (berjalan) | Jeda |
| `exercise` / `rest` (dijeda) | Lanjut |

Catatan: jika fokus ada di `<button>`, spasi tidak di-intercept agar tidak konflik dengan native browser behavior.
