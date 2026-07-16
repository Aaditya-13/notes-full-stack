export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex bg-brutal-bg text-brutal-dark font-sans select-none overflow-hidden">
      
      {/* SIDEBAR SILHOUETTE */}
      <aside className="w-20 md:w-60 flex flex-col justify-between bg-brutal-bg border-r-4 border-brutal-dark p-4 shrink-0 h-screen">
        <div>
          {/* Sidebar Toggle & New Tag Button Placeholder */}
          <div className="flex flex-col gap-3 mb-8 items-center md:items-stretch">
            <div className="w-12 h-12 border-3 border-brutal-dark brutal-pulse"></div>
            <div className="w-12 md:w-full h-12 border-3 border-brutal-dark bg-brutal-yellow brutal-pulse"></div>
          </div>
          
          {/* Navigation link placeholders */}
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-12 md:w-full h-12 border-3 border-brutal-dark brutal-pulse"></div>
            ))}
          </div>
        </div>

        {/* Profile Card Placeholder */}
        <div className="w-12 md:w-full h-14 border-3 border-brutal-dark brutal-pulse"></div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto">
        
        {/* TOPBAR */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="w-36 md:w-48 h-10 border-3 border-brutal-dark brutal-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="w-40 md:w-96 h-12 border-3 border-brutal-dark brutal-pulse"></div>
            <div className="w-12 h-12 border-3 border-brutal-dark brutal-pulse"></div>
          </div>
        </div>

        {/* GREETING */}
        <div className="w-48 md:w-64 h-8 border-3 border-brutal-dark mb-8 brutal-pulse"></div>

        {/* QUICK INPUT */}
        <div className="max-w-2xl mx-auto h-16 border-4 border-brutal-dark mb-12 brutal-pulse"></div>

        {/* MASONRY GRID SILHOUETTE */}
        <div className="w-24 md:w-32 h-6 border-3 border-brutal-dark mb-6 brutal-pulse"></div>
        
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6">
          {[180, 260, 140, 300, 200, 220].map((height, i) => (
            <div
              key={i}
              className="break-inside-avoid mb-6 border-3 border-brutal-dark brutal-pulse"
              style={{ height: `${height}px` }}
            ></div>
          ))}
        </div>

      </main>
    </div>
  );
}