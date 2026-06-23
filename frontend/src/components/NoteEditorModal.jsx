import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { createNote, updateNote } from "../api/notes.js";
import { getLastUpdatedLabel } from "../utility/formatDate.js";

import {
  Bold, Italic, Heading1, Heading2, List, ListOrdered, X, Undo2, Redo2, Pin, Archive, Trash2, Tags
} from "lucide-react";

import "./NoteEditorModal.css";

function NoteEditorModal({ note = null, tags = [], onClose, onSave }) {
  const [showTags, setShowTags] = useState(false);
  // const [showDates, setShowDates] = useState(false);

  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [isArchived, setIsArchived] = useState(note?.isArchived || false);
  const [isTrashed, setIsTrashed] = useState(note?.isTrashed || false);

  const [title, setTitle] = useState(note?.title || "");
  const [selectedTags, setSelectedTags] = useState(note?.tags?.map(tag => tag._id) || []);

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: note?.content || "",
    immediatelyRender: false
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(note?.content || "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(note?.title || "");
    setSelectedTags(note?.tags?.map(tag => tag._id) || []);
    setIsPinned(note?.isPinned || false);
    setIsArchived(note?.isArchived || false);
    setIsTrashed(note?.isTrashed || false);
  }, [note, editor]);

  const toggleTag = (tagId) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
  };

  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate({});
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const handleSave = async () => {
    if (!editor) return;
    try {
      const markdown = editor.storage.markdown.getMarkdown();
      const payload = { title, content: markdown, tags: selectedTags, isPinned, isArchived, isTrashed };
      if (note) {
        await updateNote(note._id, payload);
      } else {
        await createNote(payload);
      }
      await onSave();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  if (!editor) return null;

  return (
    <div className="editor-backdrop" onClick={onClose}>
      <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="editor-header">
          <input
            type="text"
            className="note-title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="editor-close-btn" onClick={onClose}>
            <X strokeWidth={3} size={24} />
          </button>
        </div>

        {/* EDITOR CANVAS */}
        <div className="editor-main">
          <EditorContent editor={editor} className="editor-content" />
        </div>

        {/* BRUTALIST TOOLBAR (Keep Style) */}
        <div className="editor-footer">
          <div className="toolbar-group">
            {/* History */}
            <button className="toolbar-btn" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={18} /></button>
            <button className="toolbar-btn" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={18} /></button>
            <div className="toolbar-divider"></div>
            
            {/* Formatting */}
            <button className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></button>
            <button className={`toolbar-btn ${editor.isActive("italic") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></button>
            <button className={`toolbar-btn ${editor.isActive("heading", { level: 1 }) ? "active" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={18} /></button>
            <button className={`toolbar-btn ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={18} /></button>
            <button className={`toolbar-btn ${editor.isActive("bulletList") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></button>
            <button className={`toolbar-btn ${editor.isActive("orderedList") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></button>
            <div className="toolbar-divider"></div>

            {/* Actions */}
            <div className="tag-wrapper">
                <button className="toolbar-btn" onClick={() => setShowTags(!showTags)}><Tags size={18} /></button>
                {showTags && (
                    <div className="brutalist-popup">
                        <h4>Tags</h4>
                        <div className="popup-tags">
                            {tags.map(tag => (
                                <button key={tag._id} className={`popup-tag-btn ${selectedTags.includes(tag._id) ? 'selected' : ''}`} style={{ backgroundColor: tag.color }} onClick={() => toggleTag(tag._id)}>
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button className={`toolbar-btn ${isPinned ? "active-pin" : ""}`} onClick={() => { setIsPinned(!isPinned); setIsArchived(false); setIsTrashed(false); }}><Pin size={18} /></button>
            <button className={`toolbar-btn ${isArchived ? "active-archive" : ""}`} onClick={() => { setIsArchived(!isArchived); setIsPinned(false); setIsTrashed(false); }}><Archive size={18} /></button>
            <button className={`toolbar-btn ${isTrashed ? "active-trash" : ""}`} onClick={() => { setIsTrashed(!isTrashed); setIsPinned(false); setIsArchived(false); }}><Trash2 size={18} /></button>
          </div>

          <button className="editor-save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
        
        {/* META DATES */}
        {note && (
            <div className="editor-meta">
                Edited {getLastUpdatedLabel(note.updatedAt)}
            </div>
        )}

      </div>
    </div>
  );
}

export default NoteEditorModal;