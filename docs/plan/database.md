# DATABASE — WashCut SaaS

> Model data & aturan isolasi tenant. Target: PostgreSQL + Prisma (dipakai mulai v0.2).
> Bacalah bersama `plan.md`, `architecture.md`, `technology.md`, `api.md`.

## 1. Prinsip

- **Row-level tenancy**: hampir semua tabel punya `business_id` (UUID) → FK ke `businesses.id`.
- **Enum `business_type`**: `barbershop` | `car_wash` menentukan data vertikal yang aktif.
- **Soft delete** (`deleted_at`) untuk data operasional (customer, service, booking).
- Timestamp `created_at` / `updated_at` di semua tabel.
- Index `business_id` di setiap tabel tenant + index pada kolom yang sering difilter (status, tanggal).

## 2. ERD Ringkas

```
users 1—* businesses (owner) 
businesses 1—* services
businesses 1—* customers
customers 1—* vehicles            (car_wash)
customers 1—* hair_profiles       (barbershop)
businesses 1—* bookings
bookings   *—1 services
bookings   *—1 customers
bookings   *—1 staff
bookings   1—* payments
businesses 1—* memberships_plans
memberships_plans 1—* memberships (customer)
businesses 1—* settings
```

## 3. Tabel

### `users`
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| email | text UNIQUE | login |
| password_hash | text | bcrypt/argon2 |
| full_name | text | |
| role | enum(`super_admin`,`owner`,`staff`,`customer`) | |
| created_at / updated_at | timestamptz | |

### `businesses` (tenant)
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| owner_id | uuid FK→users | |
| name | text | |
| type | enum(`barbershop`,`car_wash`) | **diferensiasi vertikal** |
| slug | text UNIQUE | subdomain |
| status | enum(`trial`,`active`,`suspended`) | langganan |
| plan | text default 'free' | (nanti) tier |
| settings | jsonb | jam buka, notif on/off, dll |
| timestamps | | |

### `services`
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| business_id | uuid FK | tenant |
| name | text | |
| category | text nullable | mis. "Cuci", "Detailing" / "Potong", "Styling" |
| price | numeric(12,2) | |
| duration_min | int | untuk slot booking |
| active | bool default true | |
| deleted_at | timestamptz nullable | |

### `customers`
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| business_id | uuid FK | tenant |
| name | text | |
| phone | text nullable | notif |
| email | text nullable | |
| notes | text nullable | |
| timestamps / deleted_at | | |

### `vehicles` (vertikal car_wash)
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| business_id | uuid FK | tenant |
| customer_id | uuid FK→customers | |
| plate_number | text | unik per business |
| brand / model | text nullable | |
| vehicle_class | text nullable | sedan/suv/motor |
| color | text nullable | |

### `hair_profiles` (vertikal barbershop)
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| business_id | uuid FK | |
| customer_id | uuid FK | |
| hair_type | text nullable | lurus/keriting/dll |
| style_notes | text nullable | gaya & preferensi |
| last_style | text nullable | |

### `staff`
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| business_id | uuid FK | |
| user_id | uuid FK→users nullable | |
| name | text | |
| role_title | text nullable | "Barber", "Detailer" |
| commission_pct | numeric nullable | (P2) |
| active | bool | |

### `bookings`
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| business_id | uuid FK | tenant |
| customer_id | uuid FK | |
| service_id | uuid FK | |
| staff_id | uuid FK nullable | penugasan |
| vehicle_id | uuid FK nullable | car_wash |
| starts_at | timestamptz | slot |
| ends_at | timestamptz | = starts + duration |
| status | enum(`pending`,`confirmed`,`completed`,`cancelled`) | |
| walk_in | bool default false | |
| notes | text nullable | |
| timestamps | | |

### `payments`
| kolom | tipe | ket |
|-------|------|-----|
| id | uuid PK | |
| business_id | uuid FK | |
| booking_id | uuid FK nullable | |
| customer_id | uuid FK nullable | |
| amount | numeric(12,2) | |
| method | enum(`cash`,`qris`,`transfer`,`card`) | |
| status | enum(`paid`,`partial`,`refunded`) | |
| paid_at | timestamptz | |
| timestamps | | |

### `memberships_plans` + `memberships` (P3/P2 car_wash, P3 barbershop)
- `memberships_plans`: business_id, name, price, period (`monthly`,`yearly`), limits.
- `memberships`: business_id, customer_id, plan_id, starts_at, ends_at, status.

### `settings`
- `business_id` UNIQUE, key/value (jam buka, perpanjangan booking, footer invoice).

### `audit_logs` (P2, opsional)
- business_id, user_id, action, entity, before/after jsonb.

## 4. Index Wajib

- `bookings(business_id, starts_at)` — kalender/hari ini.
- `bookings(business_id, status)`.
- `services(business_id, active)`.
- `customers(business_id, name)` / `vehicles(business_id, plate_number)`.
- `payments(business_id, paid_at)` — laporan.

## 5. Aturan Isolasi (WAJIB)

1. Setiap SELECT/INSERT/UPDATE data tenant menyertakan `business_id` dari konteks (bukan dari body).
2. Validasi bahwa `customer`/`service`/dst milik business yang sama sebelum dipakai (cek `business_id`).
3. Tidak boleh ada query yang memuat data dua business sekaligus kecuali laporan super_admin.
4. Reviewer agent wajib memeriksa poin 1-3 (tenant isolation).

## 6. Migrasi

- Prisma Migrate; tiap perubahan schema = 1 migration file + update `packages/shared` tipe.
- Seed script untuk data contoh (2 bisnis: 1 barbershop, 1 car_wash + layanan + customer).
- Dev: SQLite (Prisma) agar tanpa install server; Production: PostgreSQL (env `DATABASE_URL`).