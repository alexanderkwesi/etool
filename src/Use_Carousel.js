import React, { useState, useEffect } from "react";
import "./Use_Carousel.css";

const FileTypeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Supported engineering file types
  const fileTypes = [
    { name: "CAD", extension: ".dwg .dxf", icon: "📐" },
    { name: "STEP", extension: ".stp .step", icon: "📦" },
    { name: "DWP", extension: ".dwp", icon: "📄" },
    { name: "PDF", extension: ".pdf", icon: "📝" },
    { name: "STL", extension: ".stl", icon: "🔺" },
    { name: "OBJ", extension: ".obj", icon: "🧊" },
    { name: "IGES", extension: ".igs .iges", icon: "🔄" },
    { name: "SolidWorks", extension: ".sldprt .sldasm", icon: "⚙️" },
  ];

  // Auto-rotate the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % fileTypes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [fileTypes.length]);

  // Calculate positions for each item in the carousel
  const calculatePosition = (index) => {
    const totalItems = fileTypes.length;
    const relativeIndex = (index - currentIndex + totalItems) % totalItems;

    // Calculate position in the 3D circle
    const angle = (relativeIndex / totalItems) * 360;
    const radius = 180; // Distance from center in pixels

    // Calculate transform values for 3D effect
    const translateZ = -radius * Math.cos((angle * Math.PI) / 180);
    const translateY = radius * Math.sin((angle * Math.PI) / 180);
    const rotateX = -angle;

    return {
      transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg)`,
      opacity: 1 - Math.abs(relativeIndex / (totalItems / 2)) * 0.5,
      zIndex: totalItems - relativeIndex,
    };
  };

  return (
    <div className="carousel-container">
      <h2>Supported File Formats</h2>
      <div className="carousel-wrapper">
        <div className="carousel">
          {fileTypes.map((fileType, index) => (
            <div
              key={index}
              className="carousel-item"
              style={calculatePosition(index)}
            >
              <div className="file-icon">{fileType.icon}</div>
              <div className="file-name">{fileType.name}</div>
              <div className="file-extension">{fileType.extension}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        {fileTypes.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Show ${fileTypes[index].name} format`}
          />
        ))}
      </div>
    </div>
  );
};

export default FileTypeCarousel;
