import { useState } from "react";
import { User, Image as ImageIcon, KeyRound, LogOut, ArrowLeft, X, Eye, EyeOff } from "lucide-react";
import "./ProfileModal.css";

export default function ProfileModal({ user, onClose }) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [view, setView] = useState("menu");

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateDetails = () => {
    console.log({ fullName, email });
    // PATCH /users/update-account
  };

  const updateAvatar = () => {
    console.log(avatar);
    // PATCH /users/avatar
  };

  const updatePassword = () => {
    console.log({ oldPassword, newPassword, confirmPassword });
    // PATCH /users/change-password
  };

  const logout = () => {
    console.log("logout");
    // POST /users/logout
  };

  return (
    <div className="profile-backdrop" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="profile-header">
          {view !== "menu" ? (
            <button className="header-back-btn" onClick={() => setView("menu")}>
              <ArrowLeft strokeWidth={3} size={24} />
              <span>
                {view === "details" ? "Update Details" : view === "avatar" ? "Change Avatar" : "Change Password"}
              </span>
            </button>
          ) : (
            <>
              <h2 className="profile-title">Profile Settings</h2>
              <button className="profile-close-btn" onClick={onClose}>
                <X strokeWidth={3} size={24} />
              </button>
            </>
          )}
        </div>

        {/* MENU VIEW */}
        {view === "menu" && (
          <>
            <div className="profile-user-card">
              <div className="profile-avatar-wrapper">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="profile-user-info">
                <h3>{user?.fullName || "User"}</h3>
                <p>{user?.email || "email@example.com"}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button className="brutal-action-btn primary" onClick={() => setView("details")}>
                <User strokeWidth={2.5} size={20} /> Update Details
              </button>
              <button className="brutal-action-btn" onClick={() => setView("avatar")}>
                <ImageIcon strokeWidth={2.5} size={20} /> Change Avatar
              </button>
              <button className="brutal-action-btn" onClick={() => setView("password")}>
                <KeyRound strokeWidth={2.5} size={20} /> Change Password
              </button>
              <button className="brutal-action-btn danger" onClick={logout}>
                <LogOut strokeWidth={2.5} size={20} /> Logout
              </button>
            </div>
          </>
        )}

        {/* DETAILS VIEW */}
        {view === "details" && (
          <div className="profile-form">
            <div className="input-group">
                <label>Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setView("menu")}>Cancel</button>
              <button className="save-btn" onClick={updateDetails}>Save Changes</button>
            </div>
          </div>
        )}

        {/* AVATAR VIEW */}
        {view === "avatar" && (
          <div className="profile-form">
            <div className="input-group">
                <label>Choose New Avatar</label>
                <input type="file" accept="image/*" className="file-input" onChange={(e) => setAvatar(e.target.files[0])} />
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setView("menu")}>Cancel</button>
              <button className="save-btn" onClick={updateAvatar}>Upload Avatar</button>
            </div>
          </div>
        )}

        {/* PASSWORD VIEW */}
        {view === "password" && (
          <div className="profile-form">
            <div className="input-group">
                <label>Old Password</label>
                <div className="password-wrapper">
                  <input type={showOld ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                  <button type="button" className="password-toggle" onClick={() => setShowOld(!showOld)}>
                    {showOld ? <EyeOff strokeWidth={2.5} size={20} /> : <Eye strokeWidth={2.5} size={20} />}
                  </button>
                </div>
            </div>

            <div className="input-group">
                <label>New Password</label>
                <div className="password-wrapper">
                  <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <button type="button" className="password-toggle" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff strokeWidth={2.5} size={20} /> : <Eye strokeWidth={2.5} size={20} />}
                  </button>
                </div>
            </div>

            <div className="input-group">
                <label>Confirm Password</label>
                <div className="password-wrapper">
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff strokeWidth={2.5} size={20} /> : <Eye strokeWidth={2.5} size={20} />}
                  </button>
                </div>
            </div>

            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setView("menu")}>Cancel</button>
              <button className="save-btn" onClick={updatePassword}>Update Password</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}