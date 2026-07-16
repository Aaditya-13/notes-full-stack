import { useState } from "react";
import { User, Image as ImageIcon, KeyRound, LogOut, ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import { updateAvatar, updateDetails, changePassword } from "../api/auth.js";
import { useAuth } from "../utility/AuthContext.jsx";
import { useToast } from "../utility/ToastContext.jsx";
import { useNavigate } from "react-router-dom";
import BrutalModal from "./BrutalModal.jsx";

export default function ProfileModal({ user, onClose, onUserUpdate }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [status, setStatus] = useState("idle"); // "idle" | "saving" | "saved"
  const [view, setView] = useState("menu"); // "menu" | "details" | "avatar" | "password"

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleViewChange = (newView) => {
    setView(newView);
    setStatus("idle");
  };

  const changeDetails = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      showToast("Fields cannot be empty.", "warning");
      return;
    }

    setStatus("saving");
    try {
      const response = await updateDetails({
        fullName: fullName.trim(),
        email: email.trim(),
      });
      if (response && response.success) {
        showToast("Profile details updated successfully.", "success");
        await onUserUpdate();
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1500);
      } else {
        showToast(response?.message || "Failed to update profile.", "error");
        setStatus("idle");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed.";
      showToast(msg, "error");
      setStatus("idle");
    }
  };

  const updateAvatarImage = async (e) => {
    e.preventDefault();
    if (!avatar) {
      showToast("Please choose an avatar file first.", "warning");
      return;
    }

    setStatus("saving");
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await updateAvatar(formData);
      if (response && response.success) {
        showToast("Profile avatar uploaded successfully.", "success");
        await onUserUpdate();
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1500);
        setAvatar(null);
      } else {
        showToast(response?.message || "Failed to upload avatar.", "error");
        setStatus("idle");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to upload avatar.";
      showToast(msg, "error");
      setStatus("idle");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("Please fill in all password fields.", "warning");
      return;
    }

    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters long.", "warning");
      return;
    }

    // UX validation: Mismatching new passwords
    if (newPassword !== confirmPassword) {
      showToast("Confirm password does not match new password.", "warning");
      return;
    }

    setStatus("saving");
    try {
      const response = await changePassword({
        oldPassword,
        newPassword,
      });
      if (response && response.success) {
        showToast("Password updated successfully.", "success");
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1500);
        
        // Reset fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(response?.message || "Failed to change password.", "error");
        setStatus("idle");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Password change failed. Verify your old password.";
      showToast(msg, "error");
      setStatus("idle");
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await logout();
      if (response && response.success) {
        showToast("Logged out from workspace. Safe travels!", "success");
        navigate("/users/login");
      } else {
        showToast("Logout failed.", "error");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      showToast("Logout error.", "error");
    }
  };

  // Helper for dynamic neobrutalist action save buttons
  const renderSaveButton = (onClickAction, defaultText) => {
    const isProcessing = status !== "idle";
    let btnText = defaultText;

    if (status === "saving") btnText = "Saving...";
    if (status === "saved") btnText = "Saved!!";

    return (
      <button
        type="button"
        className="px-6 py-2.5 border-3 border-brutal-dark bg-brutal-yellow text-brutal-dark font-black uppercase text-sm cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onClickAction}
        disabled={isProcessing}
      >
        {btnText}
      </button>
    );
  };

  // Render header titles dynamically in custom Header block
  const isSaving = status === "saving";
  const customHeader = (
    <div className="flex justify-between items-center border-b-4 border-brutal-dark p-5 bg-brutal-bg select-none">
      {view !== "menu" ? (
        <button
          onClick={() => handleViewChange("menu")}
          disabled={isSaving}
          className="flex items-center gap-2 font-black uppercase text-sm md:text-base hover:text-brutal-purple transition-colors cursor-pointer"
        >
          <ArrowLeft strokeWidth={3} size={20} />
          <span>
            {view === "details"
              ? "Update Details"
              : view === "avatar"
              ? "Change Avatar"
              : "Change Password"}
          </span>
        </button>
      ) : (
        <>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-brutal-dark">
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 border-3 border-transparent hover:border-brutal-dark hover:bg-brutal-danger hover:text-white hover:brutal-shadow flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </>
      )}
    </div>
  );

  return (
    <BrutalModal
      onClose={onClose}
      customHeader={customHeader}
    >
      <div className="flex flex-col gap-6 font-bold select-none text-brutal-dark">
        
        {/* MENU VIEW */}
        {view === "menu" && (
          <div className="flex flex-col gap-6">
            
            {/* Header User Card */}
            <div className="flex items-center gap-4 border-3 border-brutal-dark p-4 bg-gray-50 brutal-shadow">
              <div className="w-16 h-16 rounded-full border-3 border-brutal-dark bg-brutal-purple overflow-hidden shrink-0 flex items-center justify-center text-white text-2xl font-black">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-lg font-black truncate">{user?.fullName || "User"}</h3>
                <p className="text-xs font-bold text-gray-500 truncate">{user?.email || "email@example.com"}</p>
              </div>
            </div>

            {/* Menu options buttons */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full border-3 border-brutal-dark p-3.5 text-left flex items-center gap-3 bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all cursor-pointer"
                onClick={() => handleViewChange("details")}
              >
                <User strokeWidth={2.5} size={20} className="text-brutal-purple" />
                <span>Update Details</span>
              </button>
              
              <button
                className="w-full border-3 border-brutal-dark p-3.5 text-left flex items-center gap-3 bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all cursor-pointer"
                onClick={() => handleViewChange("avatar")}
              >
                <ImageIcon strokeWidth={2.5} size={20} className="text-brutal-purple" />
                <span>Change Avatar</span>
              </button>
              
              <button
                className="w-full border-3 border-brutal-dark p-3.5 text-left flex items-center gap-3 bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all cursor-pointer"
                onClick={() => handleViewChange("password")}
              >
                <KeyRound strokeWidth={2.5} size={20} className="text-brutal-purple" />
                <span>Change Password</span>
              </button>
              
              <button
                className="w-full border-3 border-brutal-dark p-3.5 text-left flex items-center gap-3 bg-white text-brutal-danger hover:bg-brutal-danger hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut strokeWidth={2.5} size={20} />
                <span>Logout</span>
              </button>
            </div>

          </div>
        )}

        {/* DETAILS VIEW */}
        {view === "details" && (
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-500">Full Name</label>
              <input
                className="w-full border-3 border-brutal-dark p-3 text-base bg-gray-50 outline-none transition-all focus:bg-white focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0px_#7c3aed]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSaving}
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-500">Email</label>
              <input
                className="w-full border-3 border-brutal-dark p-3 text-base bg-gray-50 outline-none transition-all focus:bg-white focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0px_#7c3aed]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSaving}
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-5 py-2.5 border-3 border-brutal-dark bg-white hover:bg-gray-150 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleViewChange("menu")}
                disabled={isSaving}
              >
                Cancel
              </button>
              {renderSaveButton(changeDetails, "Save Changes")}
            </div>

          </div>
        )}

        {/* AVATAR VIEW */}
        {view === "avatar" && (
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-500">Choose New Avatar</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border-3 border-brutal-dark p-2 text-base font-bold bg-gray-50 outline-none file:mr-4 file:py-1.5 file:px-4 file:border-2 file:border-brutal-dark file:bg-brutal-yellow file:font-black file:uppercase file:text-xs file:cursor-pointer hover:file:opacity-90"
                onChange={(e) => setAvatar(e.target.files[0])}
                disabled={isSaving}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-5 py-2.5 border-3 border-brutal-dark bg-white hover:bg-gray-150 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleViewChange("menu")}
                disabled={isSaving}
              >
                Cancel
              </button>
              {renderSaveButton(updateAvatarImage, "Upload Avatar")}
            </div>

          </div>
        )}

        {/* PASSWORD VIEW */}
        {view === "password" && (
          <div className="flex flex-col gap-4">
            
            {/* Old Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-500">Old Password</label>
              <div className="flex border-3 border-brutal-dark bg-gray-50 focus-within:bg-white focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-[3px_3px_0px_#7c3aed] transition-all">
                <input
                  className="flex-1 p-3 text-base outline-none bg-transparent"
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={isSaving}
                  required
                />
                <button
                  type="button"
                  className="w-12 border-l-3 border-brutal-dark bg-white flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setShowOld(!showOld)}
                  disabled={isSaving}
                >
                  {showOld ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-500">New Password</label>
              <div className="flex border-3 border-brutal-dark bg-gray-50 focus-within:bg-white focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-[3px_3px_0px_#7c3aed] transition-all">
                <input
                  className="flex-1 p-3 text-base outline-none bg-transparent"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSaving}
                  required
                />
                <button
                  type="button"
                  className="w-12 border-l-3 border-brutal-dark bg-white flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setShowNew(!showNew)}
                  disabled={isSaving}
                >
                  {showNew ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-500">Confirm Password</label>
              <div className="flex border-3 border-brutal-dark bg-gray-50 focus-within:bg-white focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-[3px_3px_0px_#7c3aed] transition-all">
                <input
                  className="flex-1 p-3 text-base outline-none bg-transparent"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSaving}
                  required
                />
                <button
                  type="button"
                  className="w-12 border-l-3 border-brutal-dark bg-white flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={isSaving}
                >
                  {showConfirm ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-5 py-2.5 border-3 border-brutal-dark bg-white hover:bg-gray-150 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleViewChange("menu")}
                disabled={isSaving}
              >
                Cancel
              </button>
              {renderSaveButton(updatePassword, "Update Password")}
            </div>

          </div>
        )}

      </div>
    </BrutalModal>
  );
}