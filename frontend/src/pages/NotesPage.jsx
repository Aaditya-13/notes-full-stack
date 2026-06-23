import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth.js";
import { getNotes } from "../api/notes.js";
import "../styles/notes.css";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import { getTags } from "../api/tags";
import getGreeting from "../utility/greetings.js";
import { Tags } from "lucide-react";

import CreateTagModal from "../components/CreateTagModal.jsx";
// pass onClose
import NoteEditorModal from "../components/NoteEditorModal.jsx";
// pass note, tags, onClose
import ProfileModal from "../components/ProfileModal.jsx";
// pass user and onClose

export default function NotesPage() {
    // set tags
    const [tags, setTags] = useState([]);

    // sidebar filter
    const [activeTab, setActiveTab] = useState("all");

    // user
    const [user, setUser] = useState(null);

    // notes
    const [notes, setNotes] = useState([]);

    // search
    const [search, setSearch] = useState("");

    // loading
    const [loading, setLoading] = useState(true);

    // modals
    const [showProfile, setShowProfile] = useState(false);

    const [showTagModal, setShowTagModal] = useState(false);

    const [showEditor, setShowEditor] = useState(false);

    // selected note
    const [selectedNote, setSelectedNote] = useState(null);

    // tag filter
    const [selectedTag, setSelectedTag] = useState(null);

    const [showTagFilter, setShowTagFilter] = useState(false);

    // fetch notes
    const fetchNotesData = async (searchText = "") => {
        try {
            const response = await getNotes(searchText);

            setNotes(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // initial page load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await getCurrentUser();

                setUser(userResponse.data);

                await fetchNotesData();

                const tagsResponse = await getTags();

                setTags(tagsResponse.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // search notes
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNotesData(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);


    // filtered notes array
    let filteredNotes = [...notes];

    // sidebar filter
    if (activeTab === "pinned") {
        filteredNotes = filteredNotes.filter((note) => note.isPinned);
    }

    if (activeTab === "archived") {
        filteredNotes = filteredNotes.filter((note) => note.isArchived);       
    }

    if (activeTab === "trash") {
        filteredNotes = filteredNotes.filter((note) => note.isTrashed);
    }

    // tag filter
    if (selectedTag) {
        filteredNotes = filteredNotes.filter((note) => note.tags?.some((tag) => tag._id === selectedTag));
    }

    // counts
    const totalNotes = filteredNotes.length;

    const totalPinned = filteredNotes.filter((note) => note.isPinned).length;

    // pinned notes section
    const pinnedNotes = filteredNotes.filter((note) => note.isPinned);

    // recent notes section
    const recentNotes = [...filteredNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const isPinnedView = activeTab === "pinned";

    const isArchivedView = activeTab === "archived";

    const isTrashView = activeTab === "trash";

    const isDefaultView = activeTab === "all" && !selectedTag;

    if (loading) {
        return <LoadingSkeleton />;
    }
    return (
        <div className="notes-page">
            {/* SIDEBAR */}

            <aside className="sidebar">
                <div className="workspace-card" onClick={() => setShowProfile(true)}>
                    <div className="workspace-avatar">👨‍💻</div>

                    <div>
                        <h3 className="workspace-title">{user.username} Workspace</h3>

                        <p className="workspace-subtitle">{user.email}</p>
                    </div>
                </div>

                <button className="create-note-btn" onClick={() => setShowTagModal(true)}>
                    + Create New Tag
                </button>

                {/* side bar filters */}

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-link ${activeTab === "all" ? "active-sidebar-link" : ""}`}
                        onClick={() => setActiveTab("all")}
                    >
                        All Notes
                    </button>

                    <button
                        className={`sidebar-link ${activeTab === "pinned" ? "active-sidebar-link" : ""}`}
                        onClick={() => setActiveTab("pinned")}
                    >
                        Pinned
                    </button>

                    <button
                        className={`sidebar-link ${activeTab === "trash" ? "active-sidebar-link" : ""}`}
                        onClick={() => setActiveTab("trash")}
                    >
                        Trash
                    </button>

                    <button
                        className={`sidebar-link ${activeTab === "archived" ? "active-sidebar-link" : ""}`}
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
                    <h1 className="logo">INK & IRON</h1>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="search-input"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        />
                    </div>

                    {selectedTag && (
                        <div className="active-tag-filter">
                            {tags.find((tag) => tag._id === selectedTag)?.name}

                            <button onClick={() => setSelectedTag(null)}>×</button>
                        </div>
                    )}

                    <div className="header-tags">
                        <button className="tag-filter-btn" onClick={() => setShowTagFilter((prev) => !prev)}>
                            <Tags />
                        </button>

                        {showTagFilter && (
                            <div className="tag-filter-popup">
                                <button onClick={() => setSelectedTag(null)}>All Notes</button>

                                {tags.map((tag) => (
                                    <button key={tag._id} onClick={() => setSelectedTag(tag._id)}>
                                        # {tag.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                {/* HERO */}

                <section className="hero-section">
                    <div>
                        <h1 className="hero-title">
                            {getGreeting()}, {`${user.fullName ? user.fullName : user.username}`}.
                        </h1>

                        <p className="hero-subtitle">
                            You have {totalPinned} notes pinned and {totalNotes} total.
                        </p>
                    </div>

                    <div className="hero-actions">
                        <button
                            className="new-note-btn"
                            onClick={() => {
                                setSelectedNote(null);

                                setShowEditor(true);
                            }}
                        >
                            New Blank Note
                        </button>
                    </div>
                </section>

                {/* PINNED */}

                {isDefaultView && (
                    <section className="notes-section">
                        <h2 className="section-title">Pinned Focus 📌</h2>

                        <div className="pinned-grid">
                            {pinnedNotes.map((note) => (
                                <div
                                    key={note._id}
                                    className="recent-note-card"
                                    onClick={() => {
                                        setSelectedNote(note);

                                        setShowEditor(true);
                                    }}
                                >
                                    <div className="card-top">
                                        {/* <span className="note-tag">
                                            {note.tag}
                                          </span>

                                          <span className="note-date">
                                            {note.date}
                                          </span> */}
                                    </div>

                                    <h3 className="note-title">{note.title}</h3>

                                    <p className="note-content">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {/* RECENT */}

                {isDefaultView && (
                    <section className="notes-section">
                        <div className="recent-header">
                            <h2 className="section-title">Recent Notes</h2>
                        </div>

                        <div className="recent-grid">
                            {recentNotes.map((note) => (
                                <div
                                    key={note._id}
                                    className="recent-note-card"
                                    onClick={() => {
                                        setSelectedNote(note);

                                        setShowEditor(true);
                                    }}
                                >
                                    <h3 className="note-title">{note.title}</h3>

                                    <p className="note-content">{note.content}</p>

                                    <span className="note-date">{note.date}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {!isDefaultView && (
                    <section className="notes-section">
                        <h2 className="section-title">
                            {isPinnedView
                                ? "Pinned Notes"
                                : isArchivedView
                                  ? "Archived Notes"
                                  : isTrashView
                                    ? "Trash"
                                    : `# ${tags.find((tag) => tag._id === selectedTag)?.name}`}
                        </h2>

                        <div className="recent-grid">
                            {filteredNotes.map((note) => (
                                <div
                                    key={note._id}
                                    className="recent-note-card"
                                    onClick={() => {
                                        setSelectedNote(note);
                                        setShowEditor(true);
                                    }}
                                >
                                    <h3 className="note-title">{note.title}</h3>

                                    <p className="note-content">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {showTagModal && <CreateTagModal onClose={() => setShowTagModal(false)} />}

            {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
            {/* tag is missing */}
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
