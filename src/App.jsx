import React from "react";
import { Outlet, Link } from "react-router-dom";
import NavMenu from "./components/NavMenu.jsx";

/**
 * App shell:
 * - Header with brand + Admin link
 * - Left nav menu (models) on large screens; collapses on mobile
 * - Right content area where nested routes render
 */
export default function App() {
  return (
    <div className="container">
      <header className="header">
        <div
          className="brand"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <img
            src="https://logos-world.net/wp-content/uploads/2021/10/SCP-Emblem.png"
            alt="SCP Logo"
            style={{
              width: "10vh",
              height: "10vh",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: "70%" }}>
              SCP Foundation
            </div>
            <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
              Secure, Contain, Protect
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2">
        {/* Menu is always visible (stacks on mobile) */}
        <div className="card">
          <NavMenu />
        </div>
        {/* Page content (list/detail/admin) */}
        <div className="card">
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}
