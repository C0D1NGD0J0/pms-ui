import React, { useState } from "react";

export interface PropertyImage {
  src: string;
  alt: string;
}

export interface PropertyGalleryProps {
  images: PropertyImage[];
  title?: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="sidebar-section">
      {title && <h4>{title}</h4>}
      <div className="sidebar-gallery">
        <div className="sidebar-gallery-main">
          <img
            src={images[activeImageIndex].src}
            alt={images[activeImageIndex].alt}
            className="img-responsive"
          />
        </div>
        {images.length > 1 && (
          <div className="sidebar-gallery-thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                className={`sidebar-thumbnail ${
                  index === activeImageIndex ? "active" : ""
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="img-responsive"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
