// File: src/components/EditModal/EditModal.js
import React, { useState, useEffect } from "react";
import "./Use_EditModal.css";

const EditModal = ({ isOpen, onClose, file, onSave }) => {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (file) {
      setFileName(file.name || "");
    }
  }, [file]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileName.trim()) {
      onSave(fileName);
      setFileName("");
    }
  };

  const handleClose = () => {
    setFileName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Rename File</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="fileName">File Name:</label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
