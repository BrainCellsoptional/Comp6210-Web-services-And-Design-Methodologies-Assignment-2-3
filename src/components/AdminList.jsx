import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Highlight from "./Highlight";

/**
 * Read + Delete list. Delete is protected by RLS (authed only).
 */
export default function AdminList() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  const load = async () => {
    const { data } = await supabase
      .from("SCP")
      .select("id, item, containment, clas, desc, image")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from("SCP").delete().eq("id", id);
    if (error) alert(error.message);
    else window.location.reload();
  };

  const filteredRows = rows.filter(
    (r) =>
      r.item.toLowerCase().includes(search.toLowerCase()) ||
      (r.clas && r.clas.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
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

      <div
        className="card"
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Object Class</th>
              <th className="hide">Containment</th>
              <th className="hide">Description</th>
              <th className="hide">Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td>{r.item}</td>
                <td>
                  <Highlight text={r.clas} />
                </td>
                <td className="hide">
                  {r.containment ? r.containment.substring(0, 80) + "…" : ""}
                </td>
                <td className="hide">
                  {r.desc ? r.desc.substring(0, 80) + "…" : ""}
                </td>

                <td className="hide" style={{ verticalAlign: "top" }}>
                  {r.image ? <span>Yes</span> : "No"}
                </td>
                <td>
                  <Link className="link" to={`/admin/edit/${r.id}`}>
                    Edit
                  </Link>{" "}
                  <button className="btn" onClick={() => onDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="6">No rows match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
