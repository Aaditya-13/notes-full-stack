import { useEffect, useState } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Markdown } from "tiptap-markdown";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Save,
  X,
  Tag
} from "lucide-react";

import "./NoteEditorModal.css";

function NoteEditorModal({
  note = null,
  tags = [],
  onClose
}) {

  const [title, setTitle] = useState(
    note?.title || ""
  );

  const [selectedTags, setSelectedTags] =
    useState(
      note?.tags?.map(tag => tag._id) || []
    );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown
    ],

    content: note?.content || "",

    immediatelyRender: false
  });

  useEffect(() => {

    if (!editor) return;

    editor.commands.setContent(
      note?.content || ""
    );

    // setTitle(
    //   note?.title || ""
    // );

    // setSelectedTags(
    //   note?.tags?.map(tag => tag._id) || []
    // );

  }, [note, editor]);

  const toggleTag = (tagId) => {

    setSelectedTags(prev => {

      if(prev.includes(tagId)){

        return prev.filter(
          id => id !== tagId
        );
      }

      return [...prev, tagId];

    });
  };

  const handleSave = () => {

    if(!editor) return;

    const markdown =
      editor.storage.markdown.getMarkdown();

    const payload = {
      title,
      content: markdown,
      tags: selectedTags
    };

    console.log(payload);

    // later:
    // create note
    // update note
  };

  if(!editor){
    return null;
  }

  return (

    <div
      className="editor-backdrop"
      onClick={onClose}
    >

      <div
        className="editor-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="editor-header">

          <div>

            <h2 className="editor-heading">
              {
                note
                ? "Edit Note"
                : "New Note"
              }
            </h2>

            <p className="editor-description">
              Capture ideas, plans and knowledge.
            </p>

          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            <X size={20}/>
          </button>

        </div>

        <input
          type="text"
          className="note-title-input"
          placeholder="Untitled Note"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <div className="toolbar">

          <button
            className="toolbar-btn"
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
          >
            <Bold size={18}/>
          </button>

          <button
            className="toolbar-btn"
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
          >
            <Italic size={18}/>
          </button>

          <button
            className="toolbar-btn"
            onClick={() =>
              editor.chain().focus().toggleHeading({level:1}).run()
            }
          >
            <Heading1 size={18}/>
          </button>

          <button
            className="toolbar-btn"
            onClick={() =>
              editor.chain().focus().toggleHeading({level:2}).run()
            }
          >
            <Heading2 size={18}/>
          </button>

          <button
            className="toolbar-btn"
            onClick={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List size={18}/>
          </button>

          <button
            className="toolbar-btn"
            onClick={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered size={18}/>
          </button>

          <button
            className="toolbar-btn"
          >
            <CheckSquare size={18}/>
          </button>

        </div>

        <div className="editor-wrapper">

          <EditorContent
            editor={editor}
            className="editor-content"
          />

        </div>

        <div className="tag-section">

          <div className="tag-header">

            <Tag size={18}/>

            <span>
              Tags
            </span>

          </div>

          <div className="tag-container">

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

        <div className="editor-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
          >

            <Save size={18}/>

            Save Note

          </button>

        </div>

      </div>

    </div>
  );
}

export default NoteEditorModal;