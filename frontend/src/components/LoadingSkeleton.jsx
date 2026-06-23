import "./LoadingSkeleton.css";

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-page">
      
      {/* MINIMALIST SIDEBAR SILHOUETTE */}
      <aside className="skeleton-sidebar">
        <div className="skeleton-top-actions">
          <div className="skeleton-toggle brutal-pulse"></div>
          <div className="skeleton-tag-btn brutal-pulse"></div>
          
          <div className="skeleton-nav">
            <div className="skeleton-nav-item brutal-pulse"></div>
            <div className="skeleton-nav-item brutal-pulse"></div>
            <div className="skeleton-nav-item brutal-pulse"></div>
            <div className="skeleton-nav-item brutal-pulse"></div>
          </div>
        </div>

        <div className="skeleton-bottom-actions">
          <div className="skeleton-workspace brutal-pulse"></div>
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="skeleton-main">
        
        {/* TOPBAR */}
        <div className="skeleton-topbar">
          <div className="skeleton-logo brutal-pulse"></div>
          <div className="skeleton-search brutal-pulse"></div>
          <div className="skeleton-icon brutal-pulse"></div>
        </div>

        {/* GREETING */}
        <div className="skeleton-greeting brutal-pulse"></div>

        {/* QUICK PUNCH INPUT */}
        <div className="skeleton-quick-input-container">
            <div className="skeleton-quick-input brutal-pulse"></div>
        </div>

        {/* MASONRY GRID SILHOUETTE */}
        <div className="skeleton-section-title brutal-pulse"></div>
        <div className="skeleton-masonry-grid">
          {/* Staggered heights to fake the masonry look */}
          <div className="skeleton-note-card brutal-pulse" style={{ height: "180px" }}></div>
          <div className="skeleton-note-card brutal-pulse" style={{ height: "260px" }}></div>
          <div className="skeleton-note-card brutal-pulse" style={{ height: "140px" }}></div>
          <div className="skeleton-note-card brutal-pulse" style={{ height: "300px" }}></div>
          <div className="skeleton-note-card brutal-pulse" style={{ height: "200px" }}></div>
          <div className="skeleton-note-card brutal-pulse" style={{ height: "220px" }}></div>
        </div>

      </main>
    </div>
  );
}