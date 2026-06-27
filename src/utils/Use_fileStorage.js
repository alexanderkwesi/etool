// src/utils/Use_fileStorage.js

/**
 * File Storage Utility for DocRevisor
 * Handles file operations with respect to user plan limitations
 */

// Supported file formats based on the engineering file conversion context
const SUPPORTED_FORMATS = {
  CAD: [
    ".dwg",
    ".dxf",
    ".stp",
    ".step",
    ".iges",
    ".igs",
    ".sat",
    ".sldprt",
    ".sldasm",
    ".ipt",
    ".iam",
    ".prt",
    ".asm",
    ".catpart",
    ".catproduct",
    ".3dm",
    ".f3d",
  ],
  DOCUMENTS: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
  IMAGES: [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".svg"],
  ARCHIVE: [".zip", ".rar", ".7z"],
  OTHER: [".ifc", ".rvt", ".dgn", ".dwf"],
};

class FileStorage {
  constructor() {
    this.userPlan = this.getUserPlan();
    this.storageKey = "DocRevisor_Files";
  }

  /**
   * Get user's plan from localStorage
   */
  getUserPlan() {
    try {
      const priceData = localStorage.getItem("Price_Data");
      return priceData ? JSON.parse(priceData) : null;
    } catch (error) {
      console.error("Error retrieving user plan:", error);
      return null;
    }
  }

  /**
   * Check if a file format is supported
   */
  isFormatSupported(filename) {
    const extension = filename
      .toLowerCase()
      .substring(filename.lastIndexOf("."));
    return Object.values(SUPPORTED_FORMATS).some((formatArray) =>
      formatArray.includes(extension)
    );
  }

  /**
   * Get the category of a file based on its extension
   */
  getFileCategory(filename) {
    const extension = filename
      .toLowerCase()
      .substring(filename.lastIndexOf("."));

    for (const [category, extensions] of Object.entries(SUPPORTED_FORMATS)) {
      if (extensions.includes(extension)) {
        return category;
      }
    }

    return "UNSUPPORTED";
  }

  /**
   * Check if user has reached monthly file limit
   */
  hasReachedFileLimit() {
    const files = this.getStoredFiles();
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const monthlyCount = files.filter((file) =>
      file.uploadDate.startsWith(currentMonth)
    ).length;

    // Default to basic plan limits if no plan is found
    const fileLimit =
      this.userPlan?.planId === "standard"
        ? 10
        : this.userPlan?.planId === "premium"
        ? 50
        : 5;

    return monthlyCount >= fileLimit;
  }

  /**
   * Check if file size is within plan limits
   */
  isWithinSizeLimit(fileSize) {
    // Convert bytes to MB
    const sizeInMB = fileSize / (1024 * 1024);

    // Default to basic plan limits if no plan is found
    const maxSize =
      this.userPlan?.planId === "standard"
        ? 20
        : this.userPlan?.planId === "premium"
        ? 50
        : 10;

    return sizeInMB <= maxSize;
  }

  /**
   * Check if user has enough storage space
   */
  hasEnoughStorage(fileSize) {
    const usedStorage = this.getUsedStorage();

    // Default to basic plan limits if no plan is found
    const maxStorage =
      this.userPlan?.planId === "standard"
        ? 2.5
        : this.userPlan?.planId === "premium"
        ? 5
        : 1;

    // Convert GB to bytes
    const maxStorageBytes = maxStorage * 1024 * 1024 * 1024;

    return usedStorage + fileSize <= maxStorageBytes;
  }

  /**
   * Calculate total used storage
   */
  getUsedStorage() {
    const files = this.getStoredFiles();
    return files.reduce((total, file) => total + file.size, 0);
  }

  /**
   * Get all stored files from localStorage
   */
  getStoredFiles() {
    try {
      const storedFiles = localStorage.getItem(this.storageKey);
      return storedFiles ? JSON.parse(storedFiles) : [];
    } catch (error) {
      console.error("Error retrieving stored files:", error);
      return [];
    }
  }

  /**
   * Save file to storage
   */
  async saveFile(file, content) {
    return new Promise((resolve, reject) => {
      // Check plan limitations
      if (this.hasReachedFileLimit()) {
        reject(
          new Error(
            "Monthly file limit reached. Upgrade your plan to upload more files."
          )
        );
        return;
      }

      if (!this.isWithinSizeLimit(file.size)) {
        reject(
          new Error(
            `File size exceeds your plan's limit. Maximum file size: ${
              this.userPlan?.planId === "standard"
                ? 20
                : this.userPlan?.planId === "premium"
                ? 50
                : 10
            }MB`
          )
        );
        return;
      }

      if (!this.hasEnoughStorage(file.size)) {
        reject(
          new Error(
            "Not enough storage space. Upgrade your plan or delete some files."
          )
        );
        return;
      }

      if (!this.isFormatSupported(file.name)) {
        reject(new Error("File format not supported."));
        return;
      }

      try {
        const files = this.getStoredFiles();
        const fileData = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          category: this.getFileCategory(file.name),
          content: content,
          uploadDate: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
        };

        files.push(fileData);
        localStorage.setItem(this.storageKey, JSON.stringify(files));
        resolve(fileData);
      } catch (error) {
        console.error("Error saving file:", error);
        reject(new Error("Failed to save file."));
      }
    });
  }

  /**
   * Get file by ID
   */
  getFile(fileId) {
    const files = this.getStoredFiles();
    const file = files.find((f) => f.id === fileId);

    if (file) {
      // Update last accessed time
      file.lastAccessed = new Date().toISOString();
      this.updateFile(file);
    }

    return file;
  }

  /**
   * Update file in storage
   */
  updateFile(updatedFile) {
    try {
      const files = this.getStoredFiles();
      const index = files.findIndex((f) => f.id === updatedFile.id);

      if (index !== -1) {
        files[index] = updatedFile;
        localStorage.setItem(this.storageKey, JSON.stringify(files));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error updating file:", error);
      return false;
    }
  }

  /**
   * Delete file from storage
   */
  deleteFile(fileId) {
    try {
      const files = this.getStoredFiles();
      const filteredFiles = files.filter((f) => f.id !== fileId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredFiles));
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  getStorageStats() {
    const files = this.getStoredFiles();
    const usedStorage = this.getUsedStorage();

    // Default to basic plan limits if no plan is found
    const maxStorage =
      this.userPlan?.planId === "standard"
        ? 2.5
        : this.userPlan?.planId === "premium"
        ? 5
        : 1;

    // Convert GB to bytes
    const maxStorageBytes = maxStorage * 1024 * 1024 * 1024;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyCount = files.filter((file) =>
      file.uploadDate.startsWith(currentMonth)
    ).length;

    // Default to basic plan limits if no plan is found
    const fileLimit =
      this.userPlan?.planId === "standard"
        ? 10
        : this.userPlan?.planId === "premium"
        ? 50
        : 5;

    return {
      totalFiles: files.length,
      usedStorage,
      maxStorage: maxStorageBytes,
      storagePercentage: (usedStorage / maxStorageBytes) * 100,
      monthlyFiles: monthlyCount,
      monthlyLimit: fileLimit,
    };
  }

  /**
   * Get files by category
   */
  getFilesByCategory(category) {
    const files = this.getStoredFiles();
    return files.filter((file) => file.category === category);
  }

  /**
   * Clear all files (for testing or account reset)
   */
  clearAllFiles() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error("Error clearing files:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
const fileStorage = new FileStorage();
export default fileStorage;
