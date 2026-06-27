import PptxGenJS from "pptxgenjs";

export const generatePptx = async (data) => {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";

  // Theme colors
  const ACCENT_COLOR = "1D4ED8"; // blue-700
  const TEXT_COLOR = "334155"; // slate-700;

  // Collection of relevant AI/IDP/Design images (unsplash URLs)
  const imageUrls = [
    // AI & Technology
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop&auto=format",
    // Universal Design & Accessibility
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&auto=format",
    // Business & Investment
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format",
  ];

  data.slides.forEach((slideContent, index) => {
    const slide = pres.addSlide();

    // ---- Background (solid fallback) ----
    const bgColors = ["FFFFFF"];
    slide.background = { color: bgColors[index % bgColors.length] };

    // ---- Header bar ----
    slide.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 0.8,
      fill: { color: ACCENT_COLOR },
      line: { width: 0 },
    });

    // ---- Title ----
    slide.addText(slideContent.title, {
      x: 0.5,
      y: 0.15,
      w: "90%",
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: "FFFFFF",
      fontFace: "Arial",
    });

    // ---- Subtitle ----
    let contentY = 1.2;
    if (slideContent.subtitle) {
      slide.addText(slideContent.subtitle, {
        x: 0.5,
        y: 1.0,
        w: "90%",
        h: 0.4,
        fontSize: 20,
        bold: true,
        color: ACCENT_COLOR,
        fontFace: "Arial",
      });
      contentY = 1.6;
    }

    // ---- Bullet points ----
    slideContent.points.forEach((point, i) => {
      slide.addText(point, {
        x: 1.5,
        y: contentY + i * 0.5,
        w: "60%",
        h: 0.4,
        fontSize: 16,
        color: TEXT_COLOR,
        bullet: true,
        fontFace: "Arial",
      });
    });

    // ---- Add relevant image instead of placeholder ----
    try {
      let imageIndex = index;
      const slideTitle = slideContent.title.toLowerCase();

      if (slideTitle.includes("ai") || slideTitle.includes("intelligent")) {
        imageIndex = index % 5;
      } else if (
        slideTitle.includes("design") ||
        slideTitle.includes("accessibility")
      ) {
        imageIndex = 5 + (index % 5);
      } else if (
        slideTitle.includes("market") ||
        slideTitle.includes("business")
      ) {
        imageIndex = 10 + (index % 5);
      }

      slide.addImage({
        path: imageUrls[imageIndex % imageUrls.length],
        x: 6.8,
        y: 4.2,
        w: 2.5,
        h: 2.0,
        sizing: { type: "cover", w: 2.5, h: 2.0 },
      });

      slide.addText(
        `Visual: ${slideContent.visualHint || "AI-powered document processing"}`,
        {
          x: 7.0,
          y: 6.4,
          w: 5.0,
          h: 0.4,
          fontSize: 10,
          italic: true,
          color: "64748B",
          align: "center",
        },
      );
    } catch (error) {
      console.log(
        `Could not load image for slide ${index}, using fallback:`,
        error,
      );

      slide.addShape(pres.ShapeType.rect, {
        x: 6.8,
        y: 4.2,
        w: 5.5,
        h: 5.0,
        fill: { color: "F1F5F9" },
        line: { color: "CBD5E1", width: 1 },
      });

      slide.addText(
        `Visual Concept:\n${slideContent.visualHint || "Professional business visual"}`,
        {
          x: 7.0,
          y: 1.5,
          w: 5.0,
          h: 4.5,
          fontSize: 14,
          italic: true,
          color: "64748B",
          align: "center",
          valign: "middle",
        },
      );
    }

    // ---- Footer ----
    slide.addText(`© 2024 ${data.companyName} | Warrington | SEIS Ready`, {
      x: 0.5,
      y: 6.9,
      w: "80%",
      h: 0.3,
      fontSize: 14,
      color: "94A3B8",
    });

    slide.addText(`Slide ${index + 1}`, {
      x: "88%",
      y: 6.9,
      w: 1.2,
      h: 0.3,
      fontSize: 14,
      color: "94A3B8",
      align: "right",
    });
  });

  try {
    await pres.writeFile({
      fileName: `${data.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_Pitch_Deck.pptx`,
    });
    console.log("Presentation generated successfully!");
    return true;
  } catch (error) {
    console.error("Error generating presentation:", error);
    throw error;
  }
};
