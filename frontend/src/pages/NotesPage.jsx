import { useState } from "react";
import "../styles/notes.css";

export default function NotesPage() {

  // fetch total count of notes associated with userId
  let totalPinned = 0;

  // fetch total pinned count of notes associated with userId
  let totalNotes = 0;

  // for sidebar
  const [activeTab, setActiveTab] = useState("all");

  // top 3 pinned notes
  const pinnedNotes = [];

  // top 4 recent notes (pinned can also be included)
  const recentNotes = [];

  return (
    <div className="notes-page">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="workspace-card">

          <div className="workspace-avatar">
            👨‍💻
          </div>

          <div>
            <h3 className="workspace-title">
              Creator Workspace
            </h3>

            <p className="workspace-subtitle">
              Premium Member
            </p>
          </div>

        </div>

        <button className="create-note-btn">
          + Create New Tag
        </button>

        <nav className="sidebar-nav">

          <button
            className={`sidebar-link ${
              activeTab === "all"
                ? "active-sidebar-link"
                : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Notes
          </button>

          <button
            className={`sidebar-link ${
              activeTab === "pinned"
                ? "active-sidebar-link"
                : ""
            }`}
            onClick={() => setActiveTab("pinned")}
          >
            Pinned
          </button>

          <button
            className={`sidebar-link ${
              activeTab === "trash"
                ? "active-sidebar-link"
                : ""
            }`}
            onClick={() => setActiveTab("trash")}
          >
            Trash
          </button>

          <button
            className={`sidebar-link ${
              activeTab === "archived"
                ? "active-sidebar-link"
                : ""
            }`}
            onClick={() => setActiveTab("archived")}
          >
            Archived
          </button>

        </nav>

      </aside>

      {/* MAIN */}

      <main className="notes-main">

        {/* TOPBAR */}

        <header className="topbar">

          <h1 className="logo">
            INK & IRON
          </h1>

          <div className="search-container">

            <input
              type="text"
              placeholder="Search notes..."
              className="search-input"
            />

          </div>

          <div className="reminder-bell">
            🔔
          </div>

        </header>

        {/* HERO */}

        <section className="hero-section">

          <div>

            <h1 className="hero-title">
              Good morning, Creator.
            </h1>

            <p className="hero-subtitle">
              You have {totalPinned} notes pinned and {totalNotes} total.
            </p>

          </div>

          <div className="hero-actions">

            <button className="new-note-btn">
              New Blank Note
            </button>

          </div>

        </section>

        {/* PINNED */}

        <section className="notes-section">

          <h2 className="section-title">
            Pinned Focus 📌 
          </h2>

          <div className="pinned-grid">

            {pinnedNotes.map((note) => (

              <div
                key={note.id}
                className={`note-card ${note.color}`}
              >

                <div className="card-top">

                  <span className="note-tag">
                    {note.tag}
                  </span>

                  <span className="note-date">
                    {note.date}
                  </span>

                </div>

                <h3 className="note-title">
                  {note.title}
                </h3>

                <p className="note-content">
                  {note.content}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* RECENT */}

        <section className="notes-section">

          <div className="recent-header">

            <h2 className="section-title">
              Recent Notes
            </h2>

            <div className="view-actions">

              <button className="filter-btn">
                Filter
              </button>

              <button className="grid-btn">
                ⊞
              </button>

            </div>

          </div>

          <div className="recent-grid">

            {recentNotes.map((note) => (

              <div
                key={note.id}
                className="recent-note-card"
              >

                <h3 className="note-title">
                  {note.title}
                </h3>

                <p className="note-content">
                  {note.content}
                </p>

                <span className="note-date">
                  {note.date}
                </span>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}