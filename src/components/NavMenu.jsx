// src/components/NavMenu.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function NavMenu() {
  const [items, setItems] = useState([]);
  const { pathname } = useLocation();

  // load all models
  const load = async () => {
    const { data, error } = await supabase
      .from('SCP')
      .select('id, item')
      .order('item', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    // guard against null/empty models
    setItems((data ?? []).filter(r => r.item && r.item.trim().length));
  };

  useEffect(() => {
    load();

    // subscribe to changes so the menu stays in sync
    const channel = supabase
      .channel('scp-menu')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scp' },
        () => load()
      )
      .subscribe();

    // cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container-2" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <h3 style={{ marginTop: 0 }}>SCPs</h3>
      <ul
        style={{
          display: "grid",
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}
      >
        {items.map(t => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <Link
              className="link"
              to={`/SCP/${t.id}`}
              aria-current={pathname === `/SCP/${t.id}` ? 'page' : undefined}
              style={{
                width: "100%",
                display: "flex",
                padding: "10px",
                borderRadius: "6px",
                textItems: "center",
                textDecoration: "none"
              }}
            >
              {t.item}
            </Link>
          </li>
        ))}
        {items.length === 0 && <li className="label">No SCPs yet.</li>}
      </ul>
    </div>
  );
}