/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { createNote, updateNote } from "../api/notes.js";
import { getLastUpdatedLabel } from "../utility/formatDate.js";
import { useToast } from "../utility/ToastContext.jsx";
import BrutalModal from "./BrutalModal.jsx";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  X,
  Undo2,
  Redo2,
  Pin,
  Archive,
  Trash2,
  Tags,
} from "lucide-react";

export default function NoteEditorModal({ note = null, tags = [], onClose, onSave }) {
  const { showToast } = useToast();

  const [showTags, setShowTags] = useState(false);
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [isArchived, setIsArchived] = useState(note?.isArchived || false);
  const [isTrashed, setIsTrashed] = useState(note?.isTrashed || false);
  const [title, setTitle] = useState(note?.title || "");
  const [selectedTags, setSelectedTags] = useState(note?.tags?.map((tag) => tag._id) || []);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: note?.content || "",
    immediatelyRender: false,
  });

  // Re-sync modal when note or editor updates
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(note?.content || "");
    setTitle(note?.title || "");
    setSelectedTags(note?.tags?.map((tag) => tag._id) || []);
    setIsPinned(note?.isPinned || false);
    setIsArchived(note?.isArchived || false);
    setIsTrashed(note?.isTrashed || false);
  }, [note, editor]);

  // Toggle selection of tags
  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // Listen to editor updates to force re-render toolbar active states
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

    const markdownContent = editor.storage.markdown.getMarkdown().trim();
    const noteTitle = title.trim();

    // UX validation: Note must have either a title or some body content
    if (!noteTitle && !markdownContent) {
      showToast("Cannot save empty note. Please enter a title or write content.", "warning");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: noteTitle,
        content: markdownContent,
        tags: selectedTags,
        isPinned,
        isArchived,
        isTrashed,
      };

      let response;
      if (note) {
        response = await updateNote(note._id, payload);
      } else {
        response = await createNote(payload);
      }

      if (response && response.success) {
        showToast(note ? "Note saved." : "Note forged successfully!", "success");
        await onSave();
        onClose();
      } else {
        showToast(response?.message || "Failed to save note. Please Enter Content to Save", "error");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save note. Please Enter Content to Save";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) return null;

  // Custom modal header layout with embedded title input
  const customHeader = (
    <div className="flex justify-between items-center border-b border-gray-150 p-6 bg-white select-none">
      <input
        type="text"
        className="flex-1 border-none bg-transparent text-2xl font-black outline-none text-brutal-dark placeholder-gray-400 font-sans"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSaving}
      />
      <button
        onClick={onClose}
        className="w-10 h-10 border-3 border-transparent hover:border-brutal-dark hover:bg-brutal-danger hover:text-white hover:brutal-shadow flex items-center justify-center transition-all cursor-pointer"
        aria-label="Close editor"
        disabled={isSaving}
      >
        <X size={20} strokeWidth={3} />
      </button>
    </div>
  );

  const extraOutside = note && (
    <div className="flex justify-end select-none pr-1 md:pr-0">
      <span className="inline-block border-2 border-brutal-dark text-xs font-black uppercase tracking-wider text-white bg-brutal-dark px-3 py-1 brutal-shadow">
        Edited {getLastUpdatedLabel(note.updatedAt)}
      </span>
    </div>
  );

  return (
    <BrutalModal
      onClose={onClose}
      size="lg"
      customHeader={customHeader}
      extraOutside={extraOutside}
    >
      <div className="flex flex-col h-full">

        {/* Editor Writing Area */}
        <div className="flex-1 min-h-[380px] overflow-y-auto px-4 py-4 md:px-6 md:py-6 font-medium text-gray-800 text-lg leading-relaxed">
          <EditorContent editor={editor} className="editor-content focus:outline-none" />
        </div>

        {/* Toolbar Footer */}
        <div className="mt-auto border-t border-gray-150 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none bg-white">

          <div className="flex flex-wrap items-center gap-1">

            {/* History Undo / Redo */}
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center border-2 border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer rounded"
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo"
              disabled={isSaving}
            >
              <Undo2 size={18} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center border-2 border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer rounded"
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo"
              disabled={isSaving}
            >
              <Redo2 size={18} strokeWidth={2.5} />
            </button>

            <div className="w-0.5 h-6 bg-brutal-dark mx-2" />

            {/* Formatting tools */}
            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${editor.isActive("bold")
                ? "bg-brutal-dark text-white border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
              disabled={isSaving}
            >
              <Bold size={18} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${editor.isActive("italic")
                ? "bg-brutal-dark text-white border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
              disabled={isSaving}
            >
              <Italic size={18} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${editor.isActive("heading", { level: 1 })
                ? "bg-brutal-dark text-white border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              title="Heading 1"
              disabled={isSaving}
            >
              <Heading1 size={18} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${editor.isActive("heading", { level: 2 })
                ? "bg-brutal-dark text-white border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading 2"
              disabled={isSaving}
            >
              <Heading2 size={18} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${editor.isActive("bulletList")
                ? "bg-brutal-dark text-white border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
              disabled={isSaving}
            >
              <List size={18} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${editor.isActive("orderedList")
                ? "bg-brutal-dark text-white border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered List"
              disabled={isSaving}
            >
              <ListOrdered size={18} strokeWidth={2.5} />
            </button>

            <div className="w-0.5 h-6 bg-brutal-dark mx-2" />

            {/* Tags dropdown trigger */}
            <div className="relative">
              <button
                type="button"
                className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${showTags
                  ? "bg-brutal-dark text-white border-brutal-dark"
                  : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                  }`}
                onClick={() => setShowTags(!showTags)}
                title="Tags"
                disabled={isSaving}
              >
                <Tags size={18} strokeWidth={2.5} />
              </button>

              {showTags && (
                <div className="absolute bottom-12 left-0 w-60 bg-white border-3 border-brutal-dark p-4 brutal-shadow z-[100] flex flex-col gap-3 font-bold">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 border-b-2 border-gray-100 pb-1">
                    Assign Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <button
                          key={tag._id}
                          type="button"
                          className={`px-2 py-1 text-xs border-2 border-brutal-dark font-black uppercase text-white transition-all cursor-pointer ${selectedTags.includes(tag._id)
                            ? "scale-105 shadow-[2px_2px_0px_#1c1b1b]"
                            : "opacity-80 hover:opacity-100"
                            }`}
                          style={{ backgroundColor: tag.color }}
                          onClick={() => toggleTag(tag._id)}
                          disabled={isSaving}
                        >
                          {tag.name}
                        </button>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 py-1">No tags registered.</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Workspace Action modifiers (Pin, Archive, Trash) */}
            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${isPinned
                ? "bg-blue-600 text-white border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => {
                setIsPinned(!isPinned);
                setIsArchived(false);
                setIsTrashed(false);
              }}
              title="Pin Note"
              disabled={isSaving}
            >
              <Pin size={18} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${isArchived
                ? "bg-brutal-yellow text-brutal-dark border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => {
                setIsArchived(!isArchived);
                setIsPinned(false);
                setIsTrashed(false);
              }}
              title="Archive Note"
              disabled={isSaving}
            >
              <Archive size={18} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-all cursor-pointer ${isTrashed
                ? "bg-brutal-danger text-white border-brutal-dark"
                : "border-transparent hover:border-brutal-dark hover:bg-white hover:shadow-[2px_2px_0px_#1c1b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              onClick={() => {
                setIsTrashed(!isTrashed);
                setIsPinned(false);
                setIsArchived(false);
              }}
              title="Trash Note"
              disabled={isSaving}
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </button>

          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 border-3 border-brutal-dark bg-brutal-yellow text-brutal-dark font-black uppercase text-sm tracking-wider cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

        </div>

      </div>
    </BrutalModal>
  );
}