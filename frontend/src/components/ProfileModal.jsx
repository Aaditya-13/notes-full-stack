import "./modals.css";

export default function ProfileModal({user,onClose}){

  return (
    <div className="modal-backdrop">

      <div className="modal-card">

        <div className="modal-header">
          <h2>Profile Settings</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="profile-avatar-large">
          <img
            src={user?.avatar}
            alt=""
          />
        </div>

        <div className="modal-section">
          <button className="modal-btn">
            Update Details
          </button>

          <button className="modal-btn">
            Change Avatar
          </button>

          <button className="modal-btn">
            Change Password
          </button>

          <button className="modal-btn danger">
            Logout
          </button>
        </div>

      </div>

    </div>
  );
}