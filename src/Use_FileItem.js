// File: src/components/FileManager/FileItem.js
import React from "react";
import "./Use_FileManager.css";

const FileItem = ({ file, onEdit, onDelete, onView }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case "js":
        return "📄";
      case "css":
        return "🎨";
      case "html":
        return "🌐";
      default:
        return "📁";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="file-item">
      <div className="file-info" onClick={() => onView(file)}>
        <span className="file-icon">{getFileIcon(file.type)}</span>
        <div className="file-details">
          <h3 className="file-name">{file.name}</h3>
          <p className="file-meta">
            Updated: {formatDate(file.updatedAt)} | Created:{" "}
            {formatDate(file.createdAt)}
          </p>
        </div>
      </div>

      <div className="file-actions">
        <button
          className="btn btn-view"
          onClick={() => onView(file)}
          title="View file"
        >
          👁️ View
        </button>
        <button
          className="btn btn-edit"
          onClick={() => onEdit(file)}
          title="Rename file"
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-delete"
          onClick={() => onDelete(file.id)}
          title="Delete file"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default FileItem;
