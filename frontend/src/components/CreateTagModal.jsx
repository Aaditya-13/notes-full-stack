import { useState } from "react";
import { Tags } from "lucide-react";
import { createTag } from "../api/tags.js";
import { useToast } from "../utility/ToastContext.jsx";
import BrutalModal from "./BrutalModal.jsx";

export default function CreateTagModal({ onClose, onSave }) {
  const { showToast } = useToast();

  const presetColors = [
    "#7C3AED", // Violet
    "#2563EB", // Blue
    "#16A34A", // Green
    "#EAB308", // Yellow
    "#EA580C", // Orange
    "#DC2626", // Red
  ];

  const [name, setName] = useState("");
  const [color, setColor] = useState("#7C3AED");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Tag name cannot be empty.", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await createTag({ name: name.trim(), color });
      if (response && response.success) {
        showToast(`Tag "${name.trim()}" forged successfully!`, "success");
        await onSave();
        onClose();
      } else {
        showToast(response?.message || "Failed to create tag.", "error");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create tag.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrutalModal
      onClose={onClose}
      title="Create Tag"
      icon={<Tags size={28} strokeWidth={3} className="text-brutal-purple" />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-bold">
        
        {/* Tag Name Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-black uppercase tracking-wider text-gray-700">
            Tag Name
          </label>
          <input
            className="w-full border-3 border-brutal-dark p-3 text-lg font-bold bg-gray-50 outline-none transition-all focus:bg-white focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0px_#7c3aed]"
            placeholder="e.g., React Ideas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            disabled={loading}
            required
          />
        </div>

        {/* Color Palette Choice */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-black uppercase tracking-wider text-gray-700">
            Paint Color
          </label>
          <div className="flex flex-wrap gap-3">
            {presetColors.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`w-10 h-10 border-3 border-brutal-dark transition-all cursor-pointer ${
                  color === preset
                    ? "scale-105 shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#1c1b1b]"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: preset }}
                onClick={() => setColor(preset)}
                disabled={loading}
                aria-label={`Select color ${preset}`}
              />
            ))}
          </div>
        </div>

        {/* Tag Preview */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-black uppercase tracking-wider text-gray-700">
            Preview
          </span>
          <div className="border-3 border-brutal-dark bg-gray-100 p-4 brutal-shadow flex justify-center items-center">
            <div
              className="px-4 py-2 border-2 border-brutal-dark text-white font-black uppercase tracking-wide text-sm"
              style={{ backgroundColor: color }}
            >
              # {name.trim() ? name.trim() : "React Ideas"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            className="px-5 py-3 border-3 border-brutal-dark bg-white font-black uppercase text-sm cursor-pointer hover:bg-gray-150 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-5 py-3 border-3 border-brutal-dark bg-brutal-yellow text-brutal-dark font-black uppercase text-sm cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Forging..." : "Create Tag"}
          </button>
        </div>

      </form>
    </BrutalModal>
  );
}