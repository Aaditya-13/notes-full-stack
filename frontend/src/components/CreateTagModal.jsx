import { useState } from "react";
import { X } from "lucide-react";

import { createTag } from "../api/tags.js";

import "./CreateTagModal.css";

function CreateTagModal({ onClose }) {

  const presetColors = [
    "#7C3AED",
    "#2563EB",
    "#16A34A",
    "#EAB308",
    "#EA580C",
    "#DC2626"
  ];

  const [name, setName] = useState("");

  const [color, setColor] = useState(
    "#7C3AED"
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await createTag({
          name,
          color
        });

      console.log(response);

      onClose();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="modal-backdrop"
      onClick={onClose}
    >

      <div
        className="tag-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="tag-modal-header">

          <div>

            <h2 className="tag-modal-title">
              Create Tag
            </h2>

            <p className="tag-modal-subtitle">
              Organize notes with reusable labels
            </p>

          </div>

          <button
            className="tag-close-btn"
            onClick={onClose}
          >
            <X size={20}/>
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="tag-field">

            <label className="tag-label">
              Tag Name
            </label>

            <input
              className="tag-input"
              placeholder="React"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          <div className="tag-field">

            <label className="tag-label">
              Choose Color
            </label>

            <div className="preset-colors">

              {
                presetColors.map((preset) => (

                  <button
                    key={preset}
                    type="button"
                    className={
                      color === preset
                        ? "color-circle selected-color"
                        : "color-circle"
                    }
                    style={{
                      backgroundColor: preset
                    }}
                    onClick={() =>
                      setColor(preset)
                    }
                  />

                ))
              }

            </div>

          </div>

          <div className="tag-preview-section">

            <span className="preview-label">
              Preview
            </span>

            <div
              className="tag-preview"
              style={{
                backgroundColor: color
              }}
            >
              {
                name.trim()
                  ? name
                  : "React"
              }
            </div>

          </div>

          <div className="tag-actions">

            <button
              type="button"
              className="tag-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="tag-submit"
              disabled={loading}
            >

              {
                loading
                  ? "Creating..."
                  : "Create Tag"
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateTagModal;