import { useState } from "react";

import {
  User,
  Image,
  KeyRound,
  LogOut,
  ArrowLeft,
  X,
  Eye,
  EyeOff
} from "lucide-react";

import "./ProfileModal.css";

export default function ProfileModal({
  user,
  onClose
}) {

  const [showOld, setShowOld] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [view, setView] = useState("menu");

  const [fullName, setFullName] = useState(
    user?.fullName || ""
  );

  const [email, setEmail] = useState(
    user?.email || ""
  );

  const [avatar, setAvatar] = useState(null);

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const updateDetails = () => {

    console.log({
      fullName,
      email
    });

    // PATCH /users/update-account
  };

  const updateAvatar = () => {

    console.log(avatar);

    // PATCH /users/avatar
  };

  const updatePassword = () => {

    console.log({
      oldPassword,
      newPassword,
      confirmPassword
    });

    // PATCH /users/change-password
  };

  const logout = () => {

    console.log("logout");

    // POST /users/logout
  };

  return (

    <div
      className="profile-backdrop"
      onClick={onClose}
    >

      <div
        className="profile-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="profile-header">

          {
            view !== "menu" ? (

              <button
                className="header-back-btn"
                onClick={() =>
                  setView("menu")
                }
              >
                <ArrowLeft size={22} />
                <span>

                  {
                    view === "details"
                      ? "Update Details"
                      : view === "avatar"
                        ? "Change Avatar"
                        : "Change Password"
                  }

                </span>
              </button>

            ) : (

              <>
                <h2 className="profile-title">
                  Profile Settings
                </h2>

                <button
                  className="close-btn"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </>

            )
          }

        </div>

        {
          view === "menu" && (

            <>

              <div className="profile-user">

                {
                  user?.avatar ? (

                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="profile-avatar"
                    />

                  ) : (

                    <div className="profile-avatar-placeholder">

                      {
                        user?.fullName?.charAt(0) ||
                        "U"
                      }

                    </div>

                  )
                }

                <h3>
                  {
                    user?.fullName ||
                    "User"
                  }
                </h3>

                <p>
                  {
                    user?.email ||
                    "email@example.com"
                  }
                </p>

              </div>

              <div className="profile-actions">

                <button
                  className="profile-btn profile-primary"
                  onClick={() =>
                    setView("details")
                  }
                >
                  <User size={18} />
                  Update Details
                </button>

                <button
                  className="profile-btn"
                  onClick={() =>
                    setView("avatar")
                  }
                >
                  <Image size={18} />
                  Change Avatar
                </button>

                <button
                  className="profile-btn"
                  onClick={() =>
                    setView("password")
                  }
                >
                  <KeyRound size={18} />
                  Change Password
                </button>

                <button
                  className="profile-btn profile-danger"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>

            </>

          )
        }

        {
          view === "details" && (

            <div className="profile-form">

              <label>
                Full Name
              </label>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
              />

              <label>
                Email
              </label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <div className="form-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setView("menu")
                  }
                >
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={updateDetails}
                >
                  Save Changes
                </button>

              </div>

            </div>

          )
        }

        {
          view === "avatar" && (

            <div className="profile-form">

              <label>
                Choose New Avatar
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setAvatar(
                    e.target.files[0]
                  )
                }
              />

              <div className="form-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setView("menu")
                  }
                >
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={updateAvatar}
                >
                  Upload Avatar
                </button>

              </div>

            </div>

          )
        }

        {
          view === "password" && (

            <div className="profile-form">

              <label>Old Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) =>
                    setOldPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowOld(!showOld)}
                >
                  {
                    showOld
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                  }
                </button>
              </div>

              <label>New Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNew(!showNew)}
                >
                  {
                    showNew
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                  }
                </button>
              </div>

              <label>Confirm Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                >
                  {
                    showConfirm
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                  }
                </button>
              </div>

              <div className="form-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setView("menu")
                  }
                >
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={updatePassword}
                >
                  Update Password
                </button>

              </div>

            </div>

          )
        }

      </div>

    </div>
  );
}