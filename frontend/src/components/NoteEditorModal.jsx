import "./modals.css";

export default function NoteEditorModal({
  note,
  onClose
}) {

  return (
    <div className="modal-backdrop">

      <div className="editor-modal">

        <div className="modal-header">

          <h2>
            {note ? "Edit Note" : "New Note"}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <input
          className="note-title-input"
          placeholder="Note title..."
        />

        <div className="editor-toolbar">

          <button>B</button>
          <button>I</button>

          <button>H1</button>
          <button>H2</button>

          <button>•</button>

          <button>1.</button>

          <button>[]</button>

        </div>

        <textarea
          className="note-editor"
          placeholder="Write..."
        />

        <div className="tag-section">

          <span>Tags</span>

          <div className="tag-list">

            <button className="tag-pill">
              React
            </button>

            <button className="tag-pill">
              Backend
            </button>

          </div>

        </div>

        <div className="editor-actions">

          <button className="secondary-btn">
            Cancel
          </button>

          <button className="primary-modal-btn">
            Save Note
          </button>

        </div>

      </div>

    </div>
  );
}