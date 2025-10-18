import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Link } from "react-router-dom";
import Highlight from './Highlight';

/**
 * Full record view. Mobile-friendly, image on top, text below.
 */
export default function PublicDetail() {
  const { id } = useParams();
  const [row, setRow] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('SCP')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setRow(data);
    })();
  }, [id]);

  if (!row) return <p>Loading…</p>;

  return (
    <article>
      <div style={{float: "right", marginBottom: "5px"}}>
          <nav className="nav">
            <Link className="link" to="/">
              Public
            </Link>
            <Link className="link" to="/admin">
              Admin
            </Link>
          </nav>
        </div>
      {row.image && <img src={row.image} alt={row.item} style={{ width: '100%', borderRadius: 14, marginBottom: 12 }} />}
      <h2 style={{marginTop:0}}>{row.item}</h2>
      {row.clas && <p className="badge"><Highlight text={row.clas}/></p>}
      {row.containment && <p className="badge">{row.containment}</p>}
      <p style={{ lineHeight: 1.6 }}>{row.desc}</p>
      <p className="label">Created: {new Date(row.created_at).toLocaleString()}</p>
    </article>
    
  );
}