import { useState } from "react";
import { User, Image as ImageIcon, KeyRound, LogOut, ArrowLeft, X, Eye, EyeOff } from "lucide-react";
import { logoutUser, updateAvatar, updateDetails, changePassword } from "../api/auth.js";
import "./ProfileModal.css";
import { useNavigate } from "react-router-dom";

export default function ProfileModal({ user, onClose, onUserUpdate}) {

  const navigate = useNavigate();
  
  // UI Status State: "idle" | "saving" | "saved"
  const [status, setStatus] = useState("idle");

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

  // change views and reset button states
  const handleViewChange = (newView) => {
    setView(newView);
    setStatus("idle"); // Reset status when switching forms
  };

  const changeDetails = async (e) => {
      e.preventDefault();
      setStatus("saving");
      try {
        const response = await updateDetails({
          fullName: fullName,
          email: email
        });
        if (response.success) {
          await onUserUpdate(); 
          setStatus("saved");
          setTimeout(() => setStatus("idle"), 2000);
        } else {
          setStatus("idle");
        }
      } catch (error) {
        console.log(error);
        setStatus("idle");
      }
    };

  const updateAvatarImage = async (e) => {
      e.preventDefault();
      setStatus("saving");

      const formData = new FormData();
      if (avatar) {
        formData.append("avatar", avatar);
      }

      try {
        const response = await updateAvatar(formData);
        if (response.success) {
          await onUserUpdate();
          setStatus("saved");
          setTimeout(() => setStatus("idle"), 2000);
        } else {
          setStatus("idle");
        }
      } catch (error) {
        console.log(error);
        setStatus("idle");
      }
    };

  const updatePassword = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const response = await changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword
      });
      if (response.success) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
        
        // clear the password fields after success
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setStatus("idle");
      }
    } catch (error) {
      console.log(error);
      setStatus("idle");
    }
  };

  const logout = async (e) => {
   e.preventDefault();
   try {
    const response = await logoutUser();
    if (response.success) {
        navigate("/users/login");
    }
   } catch (error) {
    console.log(error);
   }
  };

  // dynamic button rendering, save => saving... => saved! again save
  const renderSaveButton = (onClickAction, defaultText) => {
    const isProcessing = status !== "idle";
    let btnText = defaultText;
    
    if (status === "saving") btnText = "Saving...";
    if (status === "saved") btnText = "Saved!!";

    return (
      <button 
        className="save-btn" 
        onClick={onClickAction}
        disabled={isProcessing}
        style={{ 
            opacity: isProcessing ? 0.8 : 1, 
            cursor: isProcessing ? "not-allowed" : "pointer" 
        }}
      >
        {btnText}
      </button>
    );
  };

  return (
    <div className="profile-backdrop" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="profile-header">
          {view !== "menu" ? (
            <button className="header-back-btn" onClick={() => handleViewChange("menu")}>
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
              <button className="brutal-action-btn primary" onClick={() => handleViewChange("details")}>
                <User strokeWidth={2.5} size={20} /> Update Details
              </button>
              <button className="brutal-action-btn" onClick={() => handleViewChange("avatar")}>
                <ImageIcon strokeWidth={2.5} size={20} /> Change Avatar
              </button>
              <button className="brutal-action-btn" onClick={() => handleViewChange("password")}>
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
              <button className="cancel-btn" onClick={() => handleViewChange("menu")} disabled={status !== "idle"}>Cancel</button>
              {renderSaveButton(changeDetails, "Save Changes")}
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
              <button className="cancel-btn" onClick={() => handleViewChange("menu")} disabled={status !== "idle"}>Cancel</button>
              {renderSaveButton(updateAvatarImage, "Upload Avatar")}
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
              <button className="cancel-btn" onClick={() => handleViewChange("menu")} disabled={status !== "idle"}>Cancel</button>
              {renderSaveButton(updatePassword, "Update Password")}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}