import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Create/Update form with image upload to Storage.
 * - If editing, we load the row.
 * - For uploads we create a unique path and then set the `image` column to the public URL.
 * - You must be AUTHENTICATED for writes because of RLS write policies.
 *   In Supabase Dashboard → Auth, create a test user and sign in programmatically if needed.
 */
export default function AdminForm() {
  const { id } = useParams();              // if undefined → create
  const nav = useNavigate();

  // Form state
  const [item, setItem] = useState('');
  const [desc, setDesc] = useState('');
  const [containment, setContainment] = useState('');
  const [clas, setClas] = useState('');
  const [imageUrl, setImageUrl] = useState('');   // stored public URL
  const [file, setFile] = useState(null);         // selected File object
  const [saving, setSaving] = useState(false);

  // Load record on edit
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('SCP').select('*').eq('id', id).single();
          console.log('Loading entry with id:', id);
    console.log('Data:', data);
    console.log('Error:', error);
      if (!error && data) {
        setItem(data.item ?? '');
        setDesc(data.desc ?? '');
        setImageUrl(data.image ?? '');
        setContainment(data.containment ?? '');
        setClas(data.clas ?? '');
      }
    })();
  }, [id]);

  // Upload file to Storage and return public URL
  const uploadImage = async (file) => {
    // Create a unique path to avoid collisions
    const ext = file.name.split('.').pop();
    const path = `scp-${crypto.randomUUID()}.${ext}`;

    // Upload to the bucket
    const { error: upErr } = await supabase.storage.from('scp-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (upErr) throw upErr;

    // Build a public URL (bucket must be public)
    const { data } = supabase.storage.from('scp-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // If user selected a file, upload it and set imageUrl
      let finalImageUrl = imageUrl;
      if (file) finalImageUrl = await uploadImage(file);

      const payload = { item, clas, containment, desc, image: finalImageUrl };

      if (id) {
        // UPDATE
        const { error } = await supabase.from('SCP').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        // CREATE
        const { error } = await supabase.from('SCP').insert(payload);
        if (error) throw error;
      }

      nav('/admin');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
    nav('/admin');
  };

  return (
    <form onSubmit={onSubmit} className="grid" style={{maxWidth: "70vw"}}>
      <div>
        <label className="label">Item *</label>
        <input className="input" value={item} onChange={e=>setItem(e.target.value)} required />
      </div>

      <div>
        <label className="label">Class</label>
        <input className="input" value={clas} onChange={e=>setClas(e.target.value)} />
      </div>


      <div>
        <label className="label">Containment</label>
        <input className="input" value={containment} onChange={e=>setContainment(e.target.value)} />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="textarea" value={desc} onChange={e=>setDesc(e.target.value)} />
      </div>

      <div>
        <label className="label">Image file (optional)</label>
        <input className="file" type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        {imageUrl && (
          <div style={{marginTop:10}}>
            <span className="label">Current image:</span>
            <img src={imageUrl} alt="current" style={{maxWidth: 240, borderRadius: 10, display:'block'}} />
          </div>
        )}
      </div>

      <div style={{display:'flex', gap:10}}>
        <button className="btn" disabled={saving} type="submit">{id ? 'Update' : 'Create'}</button>
        <button className="btn" type="button" onClick={() => history.back()}>Cancel</button>
      </div>
    </form>
  );
}