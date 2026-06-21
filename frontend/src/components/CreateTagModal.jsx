import { useState } from "react";
import "./modals.css";

export default function CreateTagModal({onClose}) {

  const [name,setName] = useState("");
  const [color,setColor] = useState("#7c3aed");

  return (
    <div className="modal-backdrop">

      <div className="modal-card">

        <div className="modal-header">
          <h2>Create Tag</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          className="modal-input"
          placeholder="React"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="color"
          value={color}
          onChange={(e)=>setColor(e.target.value)}
          className="color-picker"
        />

        <button className="primary-modal-btn">
          Create Tag
        </button>

      </div>

    </div>
  );
}