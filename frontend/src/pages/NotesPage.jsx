import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth.js";
import { getNotes, deleteNote } from "../api/notes.js";
import "../styles/notes.css";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import { getTags, deleteTag } from "../api/tags";
import getGreeting from "../utility/greetings.js";

import {
  Plus, Tags, House, Pin, Archive, Trash2, Search, Menu, X
} from "lucide-react";

import CreateTagModal from "../components/CreateTagModal.jsx";
import NoteEditorModal from "../components/NoteEditorModal.jsx";
import ProfileModal from "../components/ProfileModal.jsx";

export default function NotesPage() {
    const [tags, setTags] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Modals & Selections
    const [showProfile, setShowProfile] = useState(false);
    const [showTagModal, setShowTagModal] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);
    const [showTagFilter, setShowTagFilter] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    // Fetch Notes from backend
    const fetchNotesData = async (searchText = "") => {
        try {
            const response = await getNotes(searchText);
            setNotes(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // for tags
    const updateTagsData = async () => {
        try {
            const tagsResponse = await getTags();
            setTags(tagsResponse.data);
        } catch (error) {
            console.log("Failed to refresh tags:", error);
        }
    };

    // permanent delete
    const handlePermanentDelete = async (e, noteId) => {
        e.stopPropagation(); 
        
        if (window.confirm("Are you sure you want to permanently obliterate this note?")) {
            try {
                await deleteNote(noteId); 
                fetchNotesData(search);
            } catch (error) {
                console.log("Failed to incinerate note:", error);
            }
        }
    };

    // delete tag
    const handleDeleteTag = async (e, tagId) => {
        e.stopPropagation(); 
        
        if (window.confirm("Are you sure? This will delete the tag globally and remove it from all notes.")) {
            try {
                await deleteTag(tagId);
                
                if (selectedTag === tagId) {
                    setSelectedTag(null);
                }
                
                await updateTagsData();
                fetchNotesData(search);
            } catch (error) {
                console.log("Failed to delete tag:", error);
            }
        }
    };

   
  // get current user data 
  const fetchUserData = async () => {
    try {
      const userResponse = await getCurrentUser();
      setUser(userResponse.data);
    } catch (error) {
      console.log("Failed to refresh user:", error);
    }
  };

  // Initial Load...
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchUserData(); 
        await fetchNotesData();
        await updateTagsData();
        const tagsResponse = await getTags();
        setTags(tagsResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

    // for searching...
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNotesData(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Handle Opening the Editor for a New Note
    const handleTriggerNewNote = () => {
        setSelectedNote(null);
        setShowEditor(true);
    };

    // Filtering Logic for pin, trash, archive  
    let filteredNotes = [...notes];
    if (activeTab === "pinned") filteredNotes = filteredNotes.filter(n => n.isPinned);
    if (activeTab === "archived") filteredNotes = filteredNotes.filter(n => n.isArchived);       
    if (activeTab === "trash") filteredNotes = filteredNotes.filter(n => n.isTrashed);
    if (selectedTag) filteredNotes = filteredNotes.filter(n => n.tags?.some(t => t._id === selectedTag));

    const pinnedNotes = filteredNotes.filter(n => n.isPinned);
    const recentNotes = [...filteredNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const isPinnedView = activeTab === "pinned";
    const isArchivedView = activeTab === "archived";
    const isTrashView = activeTab === "trash";
    const isDefaultView = activeTab === "all" && !selectedTag;

    // Helper to render Note Cards
const renderNoteCard = (note, isPinnedCard = false) => {
        // to pick tag color for upper border
        const primaryTagColor = note.tags && note.tags.length > 0 ? note.tags[0].color : "#1c1b1b";
        const tagColorWidth = note.tags && note.tags.length > 0 ? "8px": "3px";
        
        return (
            <div 
                key={note._id} 
                className={`note-card ${isPinnedCard ? "note-pinned" : ""}`} 
                onClick={() => { setSelectedNote(note); setShowEditor(true); }}
                style={{ borderTopColor: primaryTagColor, borderTopWidth: tagColorWidth}}
            >
                {note.tags && note.tags.length > 0 && (
                    <div className="card-tag-pill" style={{ backgroundColor: primaryTagColor }}>
                        {note.tags[0].name}
                    </div>
                )}
                
                {/* Wrapped Title and Delete Button in a flex row */}
                <div className="note-title-row">
                    <h3 className="note-title">{note.title || "Untitled"}</h3>
                    
                    {isTrashView && (
                        <button 
                            className="permanent-delete-btn" 
                            onClick={(e) => handlePermanentDelete(e, note._id)}
                            title="Permanently Delete"
                        >
                            <Trash2 size={16} strokeWidth={3} />
                        </button>
                  )}
                </div>

                <p className="note-content">{note.content}</p>
            </div>
        );
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="notes-page">
            {/* MINIMALIST SIDEBAR */}
            <aside className={`sidebar ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
                <div className="sidebar-top">
                    <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(prev => !prev)}>
                        <Menu strokeWidth={2.5} size={20} />
                    </button>

                    <button className="create-tag-btn" onClick={() => setShowTagModal(true)}>
                        {sidebarCollapsed ? <Plus strokeWidth={3} size={24} /> : `+ New Tag`}                  
                    </button>

                    <nav className="sidebar-nav">
                        <button className={`sidebar-link ${activeTab === "all" ? "active-sidebar-link" : ""}`} onClick={() => setActiveTab("all")}>
                            <House strokeWidth={2.5} size={20} />
                            {!sidebarCollapsed && <span>All Notes</span>}
                        </button>
                        <button className={`sidebar-link ${activeTab === "pinned" ? "active-sidebar-link" : ""}`} onClick={() => setActiveTab("pinned")}>
                            <Pin strokeWidth={2.5} size={20} />
                            {!sidebarCollapsed && <span>Pinned</span>}
                        </button>
                        <button className={`sidebar-link ${activeTab === "trash" ? "active-sidebar-link" : ""}`} onClick={() => setActiveTab("trash")}>
                            <Trash2 strokeWidth={2.5} size={20} />
                            {!sidebarCollapsed && <span>Trashed</span>}
                        </button>
                        <button className={`sidebar-link ${activeTab === "archived" ? "active-sidebar-link" : ""}`} onClick={() => setActiveTab("archived")}>
                            <Archive strokeWidth={2.5} size={20} />
                            {!sidebarCollapsed && <span>Archived</span>}
                        </button>
                    </nav>
                </div>

                <div className="sidebar-bottom">
                    <div className="workspace-card" onClick={() => setShowProfile(true)}>
                        <div className="workspace-avatar">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="workspace-avatar-img" />
                            ) : (
                                <span>{user?.fullName ? user.fullName.charAt(0).toUpperCase() : "👨‍💻"}</span>
                            )}
                        </div>
                        {!sidebarCollapsed && (
                            <div>
                                <h3 className="workspace-title">{user.username}</h3>
                                <p className="workspace-subtitle">Settings</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="notes-main">
                
                <header className="topbar">
                    <h1 className="logo">INK & IRON</h1>
                    
                    <div className="search-pill">
                        <Search strokeWidth={2.5} size={20} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="header-tags">
                        <button className={`tag-filter-btn ${showTagFilter || selectedTag ? 'active' : ''}`} onClick={() => setShowTagFilter((prev) => !prev)}>
                            <Tags strokeWidth={2.5} />
                        </button>
                        
                        {showTagFilter && (
                            <div className="tag-filter-popup">
                                <div className="tag-popup-header">Filter by Tag</div>
                                
                                <button 
                                    className={`filter-item ${selectedTag === null ? 'selected' : ''}`} 
                                    onClick={() => { setSelectedTag(null); setShowTagFilter(false); }}
                                    style={{ width: '100%' }}
                                >
                                    All Notes
                                </button>
                                
                                {tags.map((tag) => (
                                    <div key={tag._id} className="tag-item-wrapper">
                                        <button 
                                            className={`filter-item ${selectedTag === tag._id ? 'selected' : ''}`}
                                            onClick={() => { setSelectedTag(tag._id); setShowTagFilter(false); }}
                                        >
                                            <span className="filter-color-dot" style={{ backgroundColor: tag.color }}></span>
                                            <span className="filter-name">{tag.name}</span>
                                        </button>
                                        
                                        {/* THE NEW DELETE BUTTON */}
                                        <button 
                                            className="delete-tag-cross" 
                                            onClick={(e) => handleDeleteTag(e, tag._id)}
                                            title="Delete Tag"
                                        >
                                            <X size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                <div className="greeting-text">
                    {getGreeting()}, {`${user?.fullName ? user.fullName : user?.username}`}.
                </div>

                {/* TRIGGER INPUT (Opens Note editor Modal) */}
                <section className="quick-input-container">
                    <div className="quick-input-trigger" onClick={handleTriggerNewNote}>
                        <span className="trigger-text">Take a note...</span>
                        <div className="trigger-icon-box">
                            <Plus strokeWidth={3} size={20} />
                        </div>
                    </div>
                </section>

                {/* GRID SECTIONS */}
                {isDefaultView && pinnedNotes.length > 0 && (
                    <section className="notes-section">
                        <h2 className="section-title">Pinned 📌</h2>
                        <div className="masonry-grid">
                            {pinnedNotes.map((note) => renderNoteCard(note, true))}
                        </div>
                    </section>
                )}

                {isDefaultView && (
                    <section className="notes-section">
                        <h2 className="section-title">Others</h2>
                        <div className="masonry-grid">
                            {recentNotes.filter(n => !n.isPinned && !n.isArchived && !n.isTrashed).map((note) => renderNoteCard(note, false))}
                        </div>
                    </section>
                )}

                {!isDefaultView && (
                    <section className="notes-section">
                        <h2 className="section-title">
                            {isPinnedView ? "Pinned Notes" : isArchivedView ? "Archived Notes" : isTrashView ? "Trash" : `Filtered: ${tags.find(t => t._id === selectedTag)?.name}`}
                        </h2>
                        <div className="masonry-grid">
                            {filteredNotes.map((note) => renderNoteCard(note, false))}
                        </div>
                    </section>
                )}
            </main>

            {showTagModal && <CreateTagModal onClose={() => setShowTagModal(false)} onSave={() => updateTagsData()} />}
            {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onUserUpdate={fetchUserData}/>}
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