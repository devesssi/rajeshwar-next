'use client';
import { createContext, useContext, useEffect, useState } from 'react';
const C = createContext();
export const useCart = () => useContext(C);
export default function CartProvider({ children }) {
  const [items, set] = useState([]);
  useEffect(() => { try { set(JSON.parse(localStorage.cart || '[]')); } catch {} }, []);
  useEffect(() => { localStorage.cart = JSON.stringify(items); }, [items]);
  const add = p => set(a => a.some(i => i.id == p.id) ? a.map(i => i.id == p.id ? { ...i, qty: i.qty + 1 } : i) : [...a, { id: p.id, name: p.name, part_no: p.part_no, price: p.price, qty: 1 }]);
  const setQty = (id, q) => set(a => a.map(i => i.id == id ? { ...i, qty: Math.max(1, q) } : i));
  const remove = id => set(a => a.filter(i => i.id != id));
  return <C.Provider value={{ items, add, setQty, remove, clear: () => set([]) }}>{children}</C.Provider>;
}
