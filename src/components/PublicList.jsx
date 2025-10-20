import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Highlight from "./Highlight";

/**
 * Home page: simple grid list of trucks (model + tagline).
 * Users can click through to see the full record.
 */
export default function PublicList() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

useEffect(() => {
  // Focus the search input if it exists
  if (searchInputRef.current) {
    searchInputRef.current.focus();
  }

  // Fetch SCP data from Supabase
  (async () => {
    const { data, error } = await supabase
      .from("SCP")
      .select("id, item, containment, clas, desc, image")
      .order("item", { ascending: true });
    if (!error) setRows(data ?? []);
  })();
}, []);
  // Filters displayed cards to only include searched items
  const filteredRows = rows.filter(
    (r) =>
      r.item.toLowerCase().includes(search.toLowerCase()) ||
      (r.clas && r.clas.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        {/* Public and Admin buttons */}
        <h2 style={{ marginTop: 0 }}>View SCPs</h2>
        <div>
          <nav className="nav">
            <Link className="link" to="/">
              Public
            </Link>
            <Link className="link" to="/admin">
              Admin
            </Link>
          </nav>
        </div>
      </div>
      {/* Search Bar */}
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search SCP by Item or Class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "8px",
          width: "100%",
          maxWidth: "300px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      {/* Scrollable area*/}
      <div
        className="grid container-2"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Displays the searched item cards */}
         {filteredRows.length === 0 ? (
          <p>No SCPs found.</p>
        ) : (
          filteredRows.map(r => (
            <Link
              key={r.id}
              className="card link"
              to={`/SCP/${r.id}`}
              style={{ display: "block" }}
            >
              <div style={{ fontWeight: 700 }}>{r.item}</div>
              {/* Cards */}
              <div className="badge">
                <Highlight text={r.clas || "—"} />
              </div>
              {r.image && (
                <img
                  src={r.image}
                  alt={r.item}
                  style={{ width: "100%", borderRadius: 12, marginBottom: 10 }}
                />
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
