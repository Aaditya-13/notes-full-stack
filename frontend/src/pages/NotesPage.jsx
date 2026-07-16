import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../api/notes.js";
import { getTags, deleteTag } from "../api/tags.js";
import getGreeting from "../utility/greetings.js";
import { useAuth } from "../utility/AuthContext.jsx";
import { useToast } from "../utility/ToastContext.jsx";

import {
  Plus,
  Tags as TagsIcon,
  House,
  Pin,
  Archive,
  Trash2,
  Search,
  Menu,
  X,
  FileText
} from "lucide-react";

import CreateTagModal from "../components/CreateTagModal.jsx";
import NoteEditorModal from "../components/NoteEditorModal.jsx";
import ProfileModal from "../components/ProfileModal.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";

export default function NotesPage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [tags, setTags] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals & Selections States
  const [showProfile, setShowProfile] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch Notes from API
  const fetchNotesData = async (searchText = "") => {
    try {
      const response = await getNotes(searchText);
      if (response && response.success) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load notes. Please reload.", "error");
    }
  };

  // Fetch Tags from API
  const updateTagsData = async () => {
    try {
      const tagsResponse = await getTags();
      if (tagsResponse && tagsResponse.success) {
        setTags(tagsResponse.data);
      }
    } catch (error) {
      console.log("Failed to refresh tags:", error);
    }
  };

  // Permanent Delete Handler
  const handlePermanentDelete = async (e, noteId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to permanently obliterate this note?")) {
      try {
        const response = await deleteNote(noteId);
        if (response && response.success) {
          showToast("Note permanently incinerated.", "success");
          fetchNotesData(search);
        } else {
          showToast(response?.message || "Failed to delete note.", "error");
        }
      } catch (error) {
        console.error(error);
        showToast("Error deleting note.", "error");
      }
    }
  };

  // Delete Tag Handler
  const handleDeleteTag = async (e, tagId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure? This will delete the tag globally and remove it from all notes.")) {
      try {
        const response = await deleteTag(tagId);
        if (response && response.success) {
          showToast("Tag globally deleted.", "success");
          if (selectedTag === tagId) {
            setSelectedTag(null);
          }
          await updateTagsData();
          fetchNotesData(search);
        } else {
          showToast(response?.message || "Failed to delete tag.", "error");
        }
      } catch (error) {
        console.error(error);
        showToast("Error deleting tag.", "error");
      }
    }
  };

  // Initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchNotesData(), updateTagsData()]);
      } catch (error) {
        console.error(error);
        showToast("Failed to initialize workspace data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search Debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotesData(search);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Handle Opening the Editor for a New Note
  const handleTriggerNewNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  // Filtering Business Logic
  // Hide trashed and archived notes from standard view
  let filteredNotes = notes.filter((n) => {
    if (activeTab === "pinned") return n.isPinned && !n.isTrashed && !n.isArchived;
    if (activeTab === "archived") return n.isArchived && !n.isTrashed;
    if (activeTab === "trash") return n.isTrashed;
    // Default activeTab === "all"
    return !n.isTrashed && !n.isArchived;
  });

  if (selectedTag) {
    filteredNotes = filteredNotes.filter((n) => n.tags?.some((t) => t._id === selectedTag));
  }

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const recentNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const isPinnedView = activeTab === "pinned";
  const isArchivedView = activeTab === "archived";
  const isTrashView = activeTab === "trash";
  const isDefaultView = activeTab === "all" && !selectedTag;

  // Render Individual Note Card
  const renderNoteCard = (note, isPinnedCard = false) => {
    const primaryTagColor = note.tags && note.tags.length > 0 ? note.tags[0].color : "#1c1b1b";
    const tagColorWidth = note.tags && note.tags.length > 0 ? "8px" : "3px";

    return (
      <div
        key={note._id}
        className={`break-inside-avoid mb-6 bg-white border-3 border-brutal-dark p-5 brutal-shadow hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-[10px_10px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#1c1b1b] transition-all cursor-pointer relative select-none ${
          isPinnedCard ? "bg-amber-50/20" : ""
        }`}
        onClick={() => {
          setSelectedNote(note);
          setShowEditor(true);
        }}
        style={{ borderTopColor: primaryTagColor, borderTopWidth: tagColorWidth }}
      >
        {note.tags && note.tags.length > 0 && (
          <div
            className="inline-block px-2.5 py-1 border-2 border-brutal-dark text-white font-black text-xs uppercase mb-3 brutal-shadow"
            style={{ backgroundColor: primaryTagColor }}
          >
            {note.tags[0].name}
          </div>
        )}

        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-black text-lg text-brutal-dark truncate flex-1">
            {note.title || "Untitled"}
          </h3>

          {isTrashView && (
            <button
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-brutal-dark bg-white hover:bg-red-200 text-brutal-danger hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              onClick={(e) => handlePermanentDelete(e, note._id)}
              title="Permanently Delete Note"
            >
              <Trash2 size={16} strokeWidth={3} />
            </button>
          )}
        </div>

        <p className="text-sm font-bold text-gray-500 line-clamp-6 leading-relaxed whitespace-pre-wrap">
          {note.content || "Empty content"}
        </p>
      </div>
    );
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brutal-bg text-brutal-dark font-sans select-none bg-pattern">
      
      {/* RESPONSIVE SIDEBAR */}
      <aside
        className={`w-full md:sticky md:top-0 md:h-screen shrink-0 transition-all duration-200 z-30 bg-brutal-bg border-b-4 md:border-b-0 md:border-r-4 border-brutal-dark flex flex-col justify-between ${
          sidebarCollapsed ? "md:w-20" : "md:w-60"
        }`}
      >
        <div className="flex flex-col w-full">
          {/* Toggle Sidebar (Desktop Only) */}
          <button
            className="hidden md:flex w-12 h-12 items-center justify-center border-3 border-transparent hover:border-brutal-dark hover:bg-brutal-yellow hover:brutal-shadow transition-all cursor-pointer m-4 rounded self-start"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label="Toggle Navigation Drawer"
          >
            <Menu strokeWidth={2.5} size={20} />
          </button>

          {/* New Tag Action */}
          <button
            className={`m-3 p-3 flex justify-center items-center bg-brutal-yellow border-3 border-brutal-dark font-black text-xs md:text-sm cursor-pointer brutal-shadow-hover rounded-none ${
              sidebarCollapsed ? "md:w-12 md:h-12 md:rounded-full md:p-0 md:mx-auto md:mb-6" : ""
            }`}
            onClick={() => setShowTagModal(true)}
          >
            {sidebarCollapsed ? <Plus strokeWidth={3} size={24} /> : `+ New Tag`}
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-row md:flex-col gap-1.5 px-3 pb-3 md:pb-0 md:px-4 justify-around md:justify-start">
            <button
              className={`flex items-center gap-3 p-2 md:p-3 border-3 border-transparent font-black text-xs md:text-sm cursor-pointer transition-all hover:bg-white hover:text-brutal-dark hover:border-brutal-dark hover:shadow-[3px_3px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 rounded-none ${
                activeTab === "all" ? "bg-brutal-purple text-white border-brutal-dark shadow-[3px_3px_0px_#1c1b1b]" : ""
              } ${sidebarCollapsed ? "md:justify-center md:w-12 md:h-12 md:p-0 md:rounded-full" : ""}`}
              onClick={() => {
                setActiveTab("all");
                setSelectedTag(null);
              }}
            >
              <House strokeWidth={2.5} size={20} />
              {!sidebarCollapsed && <span className="hidden md:inline">All Notes</span>}
            </button>

            <button
              className={`flex items-center gap-3 p-2 md:p-3 border-3 border-transparent font-black text-xs md:text-sm cursor-pointer transition-all hover:bg-white hover:text-brutal-dark hover:border-brutal-dark hover:shadow-[3px_3px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 rounded-none ${
                activeTab === "pinned" ? "bg-brutal-purple text-white border-brutal-dark shadow-[3px_3px_0px_#1c1b1b]" : ""
              } ${sidebarCollapsed ? "md:justify-center md:w-12 md:h-12 md:p-0 md:rounded-full" : ""}`}
              onClick={() => {
                setActiveTab("pinned");
                setSelectedTag(null);
              }}
            >
              <Pin strokeWidth={2.5} size={20} />
              {!sidebarCollapsed && <span className="hidden md:inline">Pinned</span>}
            </button>

            <button
              className={`flex items-center gap-3 p-2 md:p-3 border-3 border-transparent font-black text-xs md:text-sm cursor-pointer transition-all hover:bg-white hover:text-brutal-dark hover:border-brutal-dark hover:shadow-[3px_3px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 rounded-none ${
                activeTab === "trash" ? "bg-brutal-purple text-white border-brutal-dark shadow-[3px_3px_0px_#1c1b1b]" : ""
              } ${sidebarCollapsed ? "md:justify-center md:w-12 md:h-12 md:p-0 md:rounded-full" : ""}`}
              onClick={() => {
                setActiveTab("trash");
                setSelectedTag(null);
              }}
            >
              <Trash2 strokeWidth={2.5} size={20} />
              {!sidebarCollapsed && <span className="hidden md:inline">Trash</span>}
            </button>

            <button
              className={`flex items-center gap-3 p-2 md:p-3 border-3 border-transparent font-black text-xs md:text-sm cursor-pointer transition-all hover:bg-white hover:text-brutal-dark hover:border-brutal-dark hover:shadow-[3px_3px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 rounded-none ${
                activeTab === "archived" ? "bg-brutal-purple text-white border-brutal-dark shadow-[3px_3px_0px_#1c1b1b]" : ""
              } ${sidebarCollapsed ? "md:justify-center md:w-12 md:h-12 md:p-0 md:rounded-full" : ""}`}
              onClick={() => {
                setActiveTab("archived");
                setSelectedTag(null);
              }}
            >
              <Archive strokeWidth={2.5} size={20} />
              {!sidebarCollapsed && <span className="hidden md:inline">Archived</span>}
            </button>
          </nav>
        </div>

        {/* Profile configuration toggle (Desktop bottom sidebar) */}
        <div className="p-4 border-t-4 border-brutal-dark hidden md:block bg-gray-50/50">
          <div
            className="flex items-center gap-3 p-1.5 border-3 border-transparent hover:bg-white hover:border-brutal-dark hover:shadow-[3px_3px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer w-full overflow-hidden"
            onClick={() => setShowProfile(true)}
          >
            <div className="w-10 h-10 border-3 border-brutal-dark bg-brutal-purple text-white flex items-center justify-center font-black rounded-full overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.fullName ? user.fullName.charAt(0).toUpperCase() : "👨‍💻"}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h3 className="text-xs font-black uppercase truncate">{user?.username}</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-wide">SETTINGS</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* TOPBAR */}
        <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-brutal-dark">
              INK & IRON
            </h1>
            
            {/* Mobile-only avatar configuration trigger */}
            <button
              className="md:hidden w-10 h-10 rounded-full border-3 border-brutal-dark bg-brutal-purple overflow-hidden flex items-center justify-center text-white text-sm font-black"
              onClick={() => setShowProfile(true)}
              aria-label="Profile Settings"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase() || "U"
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Pill */}
            <div className="flex-1 sm:w-80 md:w-96 border-3 border-brutal-dark p-3 flex items-center gap-3 bg-white brutal-shadow focus-within:shadow-[6px_6px_0px_#7c3aed] focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 transition-all">
              <Search strokeWidth={2.5} size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-none outline-none font-bold text-base bg-transparent text-brutal-dark placeholder-gray-400"
              />
            </div>

            {/* Tag Filter Popup Menu */}
            <div className="relative">
              <button
                className={`w-12 h-12 flex items-center justify-center border-3 border-brutal-dark bg-white cursor-pointer brutal-shadow-hover rounded-none ${
                  showTagFilter || selectedTag ? "bg-brutal-yellow" : ""
                }`}
                onClick={() => setShowTagFilter((prev) => !prev)}
                title="Filter by Tag"
                aria-haspopup="true"
                aria-expanded={showTagFilter}
              >
                <TagsIcon strokeWidth={2.5} size={20} />
              </button>

              {showTagFilter && (
                <div className="absolute right-0 top-14 w-60 bg-white border-4 border-brutal-dark brutal-shadow-lg z-50 flex flex-col font-bold">
                  <div className="p-3 bg-brutal-bg border-b-3 border-brutal-dark text-xs uppercase tracking-wider text-gray-500">
                    Filter by Tag
                  </div>

                  <button
                    className={`w-full text-left p-3 border-b-2 border-gray-100 flex items-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer text-sm ${
                      selectedTag === null ? "bg-brutal-dark text-white" : ""
                    }`}
                    onClick={() => {
                      setSelectedTag(null);
                      setShowTagFilter(false);
                    }}
                  >
                    All Notes
                  </button>

                  {tags.map((tag) => (
                    <div key={tag._id} className="flex items-center justify-between border-b-2 border-gray-100 last:border-b-0">
                      <button
                        className={`flex-1 text-left p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer text-sm overflow-hidden ${
                          selectedTag === tag._id ? "bg-brutal-dark text-white" : ""
                        }`}
                        onClick={() => {
                          setSelectedTag(tag._id);
                          setShowTagFilter(false);
                        }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border-2 border-brutal-dark shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="truncate">{tag.name}</span>
                      </button>

                      <button
                        className="w-10 h-10 shrink-0 border-l-2 border-gray-200 text-gray-400 hover:text-brutal-danger hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                        onClick={(e) => handleDeleteTag(e, tag._id)}
                        title="Delete Tag Globally"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Greetings */}
        <div className="text-lg font-black text-gray-500 mb-6 uppercase tracking-wider">
          {getGreeting()}, {user?.fullName || user?.username}.
        </div>

        {/* Add Note Trigger */}
        <section className="mb-10 max-w-2xl mx-auto">
          <div
            className="w-full h-16 bg-white border-4 border-brutal-dark brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_#7c3aed] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[4px_4px_0px_#7c3aed] transition-all flex items-center justify-between px-6 cursor-pointer"
            onClick={handleTriggerNewNote}
          >
            <span className="font-bold text-gray-400 text-lg">Take a note...</span>
            <div className="w-10 h-10 border-3 border-brutal-dark bg-brutal-yellow flex items-center justify-center">
              <Plus strokeWidth={3} size={20} />
            </div>
          </div>
        </section>

        {/* Notes Grid Sections */}
        {filteredNotes.length === 0 ? (
          /* Workspace Empty State */
          <div className="flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-gray-300 mt-8 max-w-lg mx-auto">
            <FileText size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
            <h3 className="font-black text-lg uppercase mb-2 text-gray-400">Workspace Empty</h3>
            <p className="text-sm font-bold text-gray-400">
              {search
                ? "No notes match your search string."
                : selectedTag
                ? "No notes tagged under this filter."
                : isPinnedView
                ? "You haven't pinned any notes yet."
                : isArchivedView
                ? "Your archive is currently clear."
                : isTrashView
                ? "Trash bin is completely clean."
                : "Forge your first note using the input box above!"}
            </p>
          </div>
        ) : (
          <>
            {isDefaultView && pinnedNotes.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xs uppercase tracking-widest text-gray-400 font-black mb-4">
                  Pinned 📌
                </h2>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                  {pinnedNotes.map((note) => renderNoteCard(note, true))}
                </div>
              </section>
            )}

            {isDefaultView && (
              <section className="mb-10">
                <h2 className="text-xs uppercase tracking-widest text-gray-400 font-black mb-4">
                  Others
                </h2>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                  {recentNotes
                    .filter((n) => !n.isPinned && !n.isArchived && !n.isTrashed)
                    .map((note) => renderNoteCard(note, false))}
                </div>
              </section>
            )}

            {!isDefaultView && (
              <section className="mb-10">
                <h2 className="text-xs uppercase tracking-widest text-gray-400 font-black mb-4">
                  {isPinnedView
                    ? "Pinned Notes"
                    : isArchivedView
                    ? "Archived Notes"
                    : isTrashView
                    ? "Trash"
                    : `Filtered Tag: ${tags.find((t) => t._id === selectedTag)?.name}`}
                </h2>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                  {filteredNotes.map((note) => renderNoteCard(note, false))}
                </div>
              </section>
            )}
          </>
        )}

      </main>

      {/* Modals Mounting */}
      {showTagModal && (
        <CreateTagModal
          onClose={() => setShowTagModal(false)}
          onSave={() => updateTagsData()}
        />
      )}
      
      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onUserUpdate={refreshUser}
        />
      )}

      {showEditor && (
        <NoteEditorModal
          note={selectedNote}
          tags={tags}
          onClose={() => setShowEditor(false)}
          onSave={() => fetchNotesData(search)}
        />
      )}

    </div>
  );
}