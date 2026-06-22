import "./LoadingSkeleton.css";

export default function LoadingSkeleton() {

  return (
    <div className="skeleton-page">

      {/* SIDEBAR */}

      <aside className="skeleton-sidebar">

        <div className="skeleton-workspace"></div>

        <div className="skeleton-tag-btn"></div>

        <div className="skeleton-nav">
          <div className="skeleton-nav-item"></div>
          <div className="skeleton-nav-item"></div>
          <div className="skeleton-nav-item"></div>
          <div className="skeleton-nav-item"></div>
        </div>

      </aside>

      {/* MAIN */}

      <main className="skeleton-main">

        {/* TOPBAR */}

        <div className="skeleton-topbar">

          <div className="skeleton-logo"></div>

          <div className="skeleton-search"></div>

          <div className="skeleton-bell"></div>

        </div>

        {/* HERO */}

        <div className="skeleton-hero">

          <div>

            <div className="skeleton-title"></div>

            <div className="skeleton-subtitle"></div>

          </div>

          <div className="skeleton-new-note"></div>

        </div>

        {/* PINNED */}

        <div className="skeleton-section-title"></div>

        <div className="skeleton-pinned-grid">

          <div className="skeleton-note-card large"></div>

          <div className="skeleton-note-card large"></div>

          <div className="skeleton-note-card large"></div>

        </div>

        {/* RECENT */}

        <div className="skeleton-recent-header">

          <div className="skeleton-section-title"></div>

          <div className="skeleton-actions">
            <div className="skeleton-action-btn"></div>
            <div className="skeleton-action-btn"></div>
          </div>

        </div>

        <div className="skeleton-recent-grid">

          <div className="skeleton-note-card"></div>
          <div className="skeleton-note-card"></div>
          <div className="skeleton-note-card"></div>
          <div className="skeleton-note-card"></div>

        </div>

      </main>

    </div>
  );
}