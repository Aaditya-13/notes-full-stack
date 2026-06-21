import { useState } from "react";
import "./CreateTagModal.css";

function CreateTagModal({ onClose }) {

  const [name, setName] = useState("");
  const [color, setColor] = useState("#7c3aed");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      name,
      color
    });
  };

  return (
    <div className="modal-backdrop">

      <div className="tag-modal">

        <div className="tag-modal-header">

          <div>

            <h2 className="tag-modal-title">
              Create Tag
            </h2>

            <p className="tag-modal-subtitle">
              Organize your notes with reusable tags.
            </p>

          </div>

          <button
            className="tag-close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="tag-field">

            <label className="tag-label">
              Tag Name
            </label>

            <input
              className="tag-input"
              placeholder="Ex: React"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          <div className="tag-field">

            <label className="tag-label">
              Tag Color
            </label>

            <div className="color-row">

              <input
                type="color"
                value={color}
                onChange={(e) =>
                  setColor(e.target.value)
                }
                className="tag-color"
              />

              <div
                className="color-preview"
                style={{
                  backgroundColor: color
                }}
              />

              <button
                type="submit"
                className="tag-submit"
              >
                Create Tag
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateTagModal;