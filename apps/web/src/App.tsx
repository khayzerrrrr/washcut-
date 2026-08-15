import { useEffect, useState } from 'react';
import { Business, BusinessType } from '@washcut/shared';

const API = '/api';

export function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<BusinessType>('barbershop');
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch(`${API}/businesses`);
    const json = await res.json();
    if (json.ok) setBusinesses(json.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API}/businesses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, slug: name.toLowerCase().replace(/\s+/g, '-'), ownerId: 'demo-owner' }),
    });
    const json = await res.json();
    if (!json.ok) return setError(json.error.message);
    setError('');
    setName('');
    await load();
  }

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
      <h1>WashCut SaaS</h1>
      <p>Satu sistem, dua jenis bisnis: Barbershop &amp; Car Wash.</p>

      <form onSubmit={create} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama bisnis" required />
        <select value={type} onChange={(e) => setType(e.target.value as BusinessType)}>
          <option value="barbershop">Barbershop</option>
          <option value="car_wash">Car Wash</option>
        </select>
        <button type="submit">Tambah</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {businesses.map((b) => (
          <li key={b.id}>
            {b.name} — <strong>{b.type === 'barbershop' ? 'Barbershop' : 'Car Wash'}</strong> ({b.status})
          </li>
        ))}
      </ul>
    </main>
  );
}