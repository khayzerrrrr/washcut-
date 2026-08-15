# API — WashCut SaaS

> Kontrak REST API. Bacalah bersama `plan.md`, `architecture.md`, `technology.md`, `database.md`.
> Base URL dev: `http://localhost:4000`. Semua response memakai envelope `ApiResponse<T>` dari `@washcut/shared`.

## 1. Konvensi

- REST, resource-oriented, JSON. Prefix `GET/POST/PUT/PATCH/DELETE /api/v1/...` (saat ini tanpa `/v1`, tambah saat rilis).
- Validasi semua input dengan **zod**; error → HTTP 400 dengan `code: 'VALIDATION'`.
- **Konteks tenant**: middleware menetapkan `businessId` dari header `X-Business-Id` ATAU token JWT owner/staff. `businessId` TIDAK boleh dipercaya dari body.
- Error format:
  ```json
  { "ok": false, "error": { "code": "NOT_FOUND", "message": "Business tidak ditemukan" } }
  ```
- Sukses: `{ "ok": true, "data": ... }`. List → `{ "ok": true, "data": { "items": [...], "total": n } }`.
- HTTP status: 200 OK, 201 Created, 400 Validasi, 401 Unauthorized, 403 Forbidden (bukan tenant), 404 Not Found, 409 Konflik (slot terisi), 500 Internal.

## 2. Autentikasi & Otorisasi

- `POST /api/auth/register` — buat user (role owner/customer).
- `POST /api/auth/login` → `{ accessToken, refreshToken, user }`.
- `POST /api/auth/refresh` — token baru.
- `POST /api/auth/logout`.
- Role di token: `super_admin`, `owner`, `staff`, `customer`. Guard: `requireRole(...)`.
- (Fase web) access token short-lived; refresh token di httpOnly cookie.

## 3. Endpoint per Modul

### Tenancy
| Method | Path | Keterangan |
|--------|------|------------|
| GET | `/api/businesses` | list punya owner |
| GET | `/api/businesses/:id` | detail |
| POST | `/api/businesses` | buat bisnis (`type` required: barbershop/car_wash) |
| PATCH | `/api/businesses/:id` | ubah nama/type/settings |
| POST | `/api/businesses/:id/activate` | (nanti) mulai langganan |

### Services
| Method | Path |
|--------|------|
| GET | `/api/businesses/:businessId/services` |
| POST | `/api/businesses/:businessId/services` |
| PATCH | `/api/businesses/:businessId/services/:serviceId` |
| DELETE | `/api/businesses/:businessId/services/:serviceId` (soft) |

### Customers (+ Vehicles untuk car_wash)
| Method | Path |
|--------|------|
| GET | `/api/businesses/:businessId/customers` |
| POST | `/api/businesses/:businessId/customers` |
| PATCH | `/api/businesses/:businessId/customers/:customerId` |
| GET | `/api/businesses/:businessId/customers/:customerId/vehicles` (car_wash) |
| POST | `/api/businesses/:businessId/customers/:customerId/vehicles` (car_wash) |

### Bookings
| Method | Path | Keterangan |
|--------|------|------------|
| GET | `/api/businesses/:businessId/bookings?date=&status=` | kalender/hari ini |
| POST | `/api/businesses/:businessId/bookings` | body: customerId, serviceId, startsAt, (staffId, vehicleId, walkIn, notes) |
| PATCH | `/api/businesses/:businessId/bookings/:bookingId` | ubah slot/status |
| POST | `/api/businesses/:businessId/bookings/:bookingId/cancel` | status → cancelled |
| POST | `/api/businesses/:businessId/bookings/:bookingId/checkout` | buat invoice + terima payment (v0.3) |

### Payments
| Method | Path |
|--------|------|
| GET | `/api/businesses/:businessId/payments?date=` |
| POST | `/api/businesses/:businessId/payments` | catat payment manual |
| GET | `/api/businesses/:businessId/reports/daily` | (P2) ringkasan pendapatan |

## 4. Validasi & Logika Penting

- **Booking**: `startsAt` datetime valid; `endsAt = startsAt + service.durationMin`; cek bentrok slot (same staff / same resource) → 409 `SLOT_CONFLICT`; `service.business_id === businessId` (isolasi).
- **Checkout**: total dari service price; partial → `payment.status='partial'`, lunas → booking `confirmed`; sisa = total - sum(payments).
- **Vehicle (car_wash)**: `plate_number` unik per business → 409 `DUPLICATE_PLATE`.
- **Type-specific**: endpoint vehicles hanya untuk business `type='car_wash'`; hair_profile hanya `barbershop` → 400 `WRONG_BUSINESS_TYPE`.

## 5. Contoh Request/Response

`POST /api/businesses/:businessId/bookings`
```json
{
  "customerId": "c1",
  "serviceId": "s1",
  "startsAt": "2026-08-16T09:00:00Z",
  "walkIn": false
}
```
Response `201`:
```json
{ "ok": true, "data": { "id": "b1", "status": "pending", "startsAt": "2026-08-16T09:00:00Z", "endsAt": "2026-08-16T09:30:00Z" } }
```

## 6. Aturan Implementasi (untuk agent)

1. Route → zod schema → service → response envelope. Jangan inline logika di route.
2. `ApiResponse<T>` dan tipe entity DIAMBIL dari `@washcut/shared`, jangan didefinisikan ulang.
3. Setiap modul ditambah file test smoke (1 file kecil) untuk logika non-trivial.
4. Run `npm run typecheck` && `npm run build` sebelum selesai.
5. Idempotensi pembayaran: `payment.idempotency_key` UNIQUE per business (anti double-charge).