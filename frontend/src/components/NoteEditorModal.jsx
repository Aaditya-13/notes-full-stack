import { useEffect, useState } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Markdown } from "tiptap-markdown";

import { createNote, updateNote } from "../api/notes.js";

import { formatFullDate, getLastUpdatedLabel } from "../utility/formatDate.js";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  //CheckSquare,
  Save,
  X,
  Undo2,
  Redo2,
  Pin,
  Archive,
  Trash2
} from "lucide-react";

import "./NoteEditorModal.css";

function NoteEditorModal({
  note = null,
  tags = [],
  onClose,
  onSave
}) {

  const [showTags, setShowTags] = useState(false);

  const [showDates, setShowDates] = useState(false);

  //usestate for pin, archive & trash
  const [isPinned, setIsPinned] =
    useState(note?.isPinned || false);

  const [isArchived, setIsArchived] =
    useState(note?.isArchived || false);

  const [isTrashed, setIsTrashed] =
    useState(note?.isTrashed || false);



  // usestate for set title, select tags
  const [title, setTitle] = useState(
    note?.title || ""
  );

  const [selectedTags, setSelectedTags] =
    useState(
      note?.tags?.map(tag => tag._id) || []
    );


  // tip tap editor => starterkit & markdown
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown
    ],
    //load when clicked on existing note or blank note
    content: note?.content || "",

    immediatelyRender: false
  });

  //to set content, title, tags, pin, archive, trash for note
  useEffect(() => {

    if (!editor) return;

    editor.commands.setContent(
      note?.content || ""
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(
      note?.title || ""
    );

    setSelectedTags(
      note?.tags?.map(tag => tag._id) || []
    );

    setIsPinned(
      note?.isPinned || false
    );

    setIsArchived(
      note?.isArchived || false
    );

    setIsTrashed(
      note?.isTrashed || false
    );
  }, [note, editor]);


  // select or toggle tags
  const toggleTag = (tagId) => {

    setSelectedTags(prev => {

      if (prev.includes(tagId)) {

        return prev.filter(
          id => id !== tagId
        );
      }

      return [...prev, tagId];

    });
  };


  //to manage bold, italic, h1 etc states and force react re-render
  const [, forceUpdate] = useState({});

  useEffect(() => {

    if (!editor) return;

    const update = () => {
      forceUpdate({});
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };

  }, [editor]);

  // click on save note button to save
  const handleSave = async () => {

    if (!editor) return;

    console.log("submit triggered!!");

    try {

      const markdown = editor.storage.markdown.getMarkdown();

      const payload = {
        title,
        content: markdown,
        tags: selectedTags,
        isPinned,
        isArchived,
        isTrashed
      };

      if (note) {

        await updateNote(
          note._id,
          payload
        );

      } else {

        await createNote(
          payload
        );

      }

      await onSave()
      onClose();

    }
    catch (error) {

      console.log(error);

    }

  };

  if (!editor) {
    return null;
  }

return (

  <div
    className="editor-backdrop"
    onClick={onClose}
  >

    <div
      className="editor-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* TOP */}

      <div className="editor-top">

        <div className="editor-title-row">

          <input
            type="text"
            className="note-title-input"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <button
            className="close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        <div className="editor-meta-row">

          <div className="tag-preview-wrapper">

            <button
              className="tag-preview-btn"
              onClick={() =>
                setShowTags(prev => !prev)
              }
            >

              {
                selectedTags.length > 0
                  ? tags
                    .filter(tag =>
                      selectedTags.includes(tag._id)
                    )
                    .slice(0, 3)
                    .map(tag => `#${tag.name}`)
                    .join(" ")
                  : "+ Add Tags"
              }

            </button>

            {
              showTags && (

                <div className="tag-popup">

                  <div className="tag-popup-title">
                    Tags
                  </div>

                  <div className="tag-popup-list">

                    {
                      tags.map(tag => (

                        <button
                          key={tag._id}
                          className={`tag-pill ${
                            selectedTags.includes(tag._id)
                              ? "selected-tag"
                              : ""
                          }`}
                          style={{
                            backgroundColor: tag.color
                          }}
                          onClick={() =>
                            toggleTag(tag._id)
                          }
                        >
                          {tag.name}
                        </button>

                      ))
                    }

                  </div>

                </div>

              )
            }

          </div>

          {
            note && (

              <div className="note-meta-container">

                <button
                  type="button"
                  className="note-meta-btn"
                  onClick={() =>
                    setShowDates(prev => !prev)
                  }
                >
                  {getLastUpdatedLabel(note.updatedAt)}
                </button>

                {
                  showDates && (

                    <div className="note-meta-popup">

                      <p>
                        <strong>Created:</strong>{" "}
                        {formatFullDate(note.createdAt)}
                      </p>

                      <p>
                        <strong>Updated:</strong>{" "}
                        {formatFullDate(note.updatedAt)}
                      </p>

                    </div>

                  )
                }

              </div>

            )
          }

        </div>

      </div>

      {/* EDITOR */}

      <div className="editor-main">

        <div className="editor-wrapper">

          <EditorContent
            editor={editor}
            className="editor-content"
          />

        </div>

      </div>

      {/* FOOTER */}

      <div className="editor-footer">

        <div className="footer-left">

          <button
            className="toolbar-btn"
            onClick={() =>
              editor.chain().focus().undo().run()
            }
          >
            <Undo2 size={18} />
          </button>

          <button
            className="toolbar-btn"
            onClick={() =>
              editor.chain().focus().redo().run()
            }
          >
            <Redo2 size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              editor.isActive("bold")
                ? "toolbar-btn-clicked"
                : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
          >
            <Bold size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              editor.isActive("italic")
                ? "toolbar-btn-clicked"
                : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
          >
            <Italic size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              editor.isActive("heading", { level: 1 })
                ? "toolbar-btn-clicked"
                : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({
                level: 1
              }).run()
            }
          >
            <Heading1 size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              editor.isActive("heading", { level: 2 })
                ? "toolbar-btn-clicked"
                : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({
                level: 2
              }).run()
            }
          >
            <Heading2 size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              editor.isActive("bulletList")
                ? "toolbar-btn-clicked"
                : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              editor.isActive("orderedList")
                ? "toolbar-btn-clicked"
                : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              isPinned
                ? "pin-active"
                : ""
            }`}
            onClick={() => {

              setIsPinned(prev => !prev);

              setIsArchived(false);

              setIsTrashed(false);

            }}
          >
            <Pin size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              isArchived
                ? "archive-active"
                : ""
            }`}
            onClick={() => {

              setIsArchived(prev => !prev);

              setIsPinned(false);

              setIsTrashed(false);

            }}
          >
            <Archive size={18} />
          </button>

          <button
            className={`toolbar-btn ${
              isTrashed
                ? "trash-active"
                : ""
            }`}
            onClick={() => {

              setIsTrashed(prev => !prev);

              setIsPinned(false);

              setIsArchived(false);

            }}
          >
            <Trash2 size={18} />
          </button>

        </div>

        <button
          className="save-btn"
          onClick={handleSave}
        >

          <Save size={18} />

          Save

        </button>

      </div>

    </div>

  </div>

);
}

export default NoteEditorModal;