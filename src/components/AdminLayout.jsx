import React from 'react';
import { Link, Outlet } from 'react-router-dom';

/**
 * Admin shell. In a real app you'd gate this behind auth.
 * For now, rely on RLS to block writes unless the user is authenticated.
 */
export default function AdminLayout() {
  return (
    <div style={{maxWidth: "70vw"}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 0 }}>Admin</h2>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link className="link" to="/">
            Public
          </Link>
          <Link className="link" to="/admin">
            Admin
          </Link>
        </nav>
      </div>

      <nav className="nav" style={{ marginBottom: 12, display: 'flex', gap: '8px' }}>
        <Link className="btn" to="/admin">
          All SCPs
        </Link>
        <Link className="btn" to="/admin/new">
          Add New
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}
