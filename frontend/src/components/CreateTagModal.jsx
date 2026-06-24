import { useState } from "react";
import { X, Tags } from "lucide-react";
import { createTag } from "../api/tags.js";
import "./CreateTagModal.css";

function CreateTagModal({ onClose }) {
  // 6 preset colors
  const presetColors = [
    "#7C3AED", "#2563EB", "#16A34A",
    "#EAB308", "#EA580C", "#DC2626"
  ];

  // default color & tag name
  const [name, setName] = useState("");
  const [color, setColor] = useState("#7C3AED");
  const [loading, setLoading] = useState(false);

  // save function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const response = await createTag({ name, color });
      console.log(response);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tag-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* MODAL HEADER */}
        <div className="tag-modal-header">
          <div>
            <h2 className="tag-modal-title">
              <Tags size={28} strokeWidth={3} className="header-icon"/> 
              Create Tag
            </h2>
            <p className="tag-modal-subtitle">Forge a new label for your notes.</p>
          </div>
          <button className="tag-close-btn" onClick={onClose}>
            <X strokeWidth={3} size={24}/>
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="tag-form">
          
          <div className="tag-field">
            <label className="tag-label">Tag Name</label>
            <input
              className="tag-input"
              placeholder="e.g., React Ideas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="tag-field">
            <label className="tag-label">Paint Color</label>
            <div className="preset-colors">
              {presetColors.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`color-swatch ${color === preset ? "selected-swatch" : ""}`}
                  style={{ backgroundColor: preset }}
                  onClick={() => setColor(preset)}
                />
              ))}
            </div>
          </div>

          <div className="tag-preview-section">
            <span className="preview-label">Preview</span>
            <div className="tag-preview-box">
                <div 
                  className="tag-preview" 
                  style={{ backgroundColor: color }}
                >
                  # {name.trim() ? name : "React Ideas"}
                </div>
            </div>
          </div>

          <div className="tag-actions">
            <button type="button" className="tag-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="tag-submit-btn" disabled={loading}>
              {loading ? "Forging..." : "Create Tag"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateTagModal;