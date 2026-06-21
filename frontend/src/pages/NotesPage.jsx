import { useState } from "react";
import "../styles/notes.css";

export default function NotesPage() {

  const [activeTab, setActiveTab] = useState("all");

  const pinnedNotes = [
    {
      id: 1,
      title: "Design System Documentation",
      content:
        "Ensure that all shared components adhere strictly to the JSON specifications.",
      tag: "Project Alpha",
      color: "yellow",
      date: "2h ago"
    },
    {
      id: 2,
      title: "Grocery & Meal Prep",
      content:
        "Chicken breasts, Sweet potatoes, Broccoli...",
      tag: "Personal",
      color: "white",
      date: "Yesterday"
    },
    {
      id: 3,
      title: "Brutalist Arch Refs",
      content:
        "Collected references for the dashboard redesign.",
      tag: "Moodboard",
      color: "white",
      date: "Oct 12"
    }
  ];

  const recentNotes = [
    {
      id: 4,
      title: "Weekly Sync",
      content:
        "Discussed Q3 roadmap and backend milestones.",
      date: "Oct 10"
    },
    {
      id: 5,
      title: "App Restructure",
      content:
        "Move settings panel into modal component.",
      date: "Oct 08"
    },
    {
      id: 6,
      title: "Q4 OKRs",
      content:
        "Launch V2, increase retention.",
      date: "Oct 05"
    }
  ];

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
          + Create Note
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
            className="sidebar-link"
            onClick={() => setActiveTab("pinned")}
          >
            Pinned
          </button>

          <button
            className="sidebar-link"
            onClick={() => setActiveTab("trash")}
          >
            Trash
          </button>

          <button
            className="sidebar-link"
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

          <div className="profile-avatar">
            👨‍💻
          </div>

        </header>

        {/* HERO */}

        <section className="hero-section">

          <div>

            <h1 className="hero-title">
              Good morning, Creator.
            </h1>

            <p className="hero-subtitle">
              You have 12 notes pinned and 48 total.
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
            📌 Pinned Focus
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