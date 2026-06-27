import React, { useState } from "react";
import "./Use_Faq.css";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What file formats does DocRevisor support?",
      answer:
        "DocRevisor supports a wide range of engineering file formats including CAD (.dwg, .dxf), STEP (.stp, .step), DWP (.dwp), STL (.stl), OBJ (.obj), IGES (.igs, .iges), SolidWorks (.sldprt, .sldasm), and PDF (.pdf) for technical drawings.",
    },
    {
      question: "How does the file conversion process work?",
      answer:
        "Our conversion process uses advanced algorithms to maintain file integrity. Simply upload your file, select the target format, and our system will handle the conversion while preserving the critical engineering data and metadata.",
    },
    {
      question: "Is my data secure with DocRevisor?",
      answer:
        "Absolutely. We use industry-standard encryption (including date-of-birth based encryption for added security) and follow strict data protection protocols. Your files are never shared with third parties without your permission.",
    },
    {
      question: "Can I collaborate with team members on files?",
      answer:
        "Yes, depending on your plan. The Standard and Premium plans allow team collaboration with role-based access control. You can invite team members, assign editing or viewing permissions, and track changes collaboratively.",
    },
    {
      question: "What happens if I exceed my monthly file limit?",
      answer:
        "If you exceed your monthly file limit, you'll have the option to upgrade your plan or wait until your limit resets at the beginning of the next billing cycle. We'll send you notifications as you approach your limit.",
    },
    {
      question: "How does the file comparison feature work?",
      answer:
        "Our comparison tool highlights differences between two versions of engineering files, showing changes in dimensions, components, annotations, and metadata. It provides a visual diff and detailed change log for thorough review.",
    },
    {
      question: "Can I access my files offline?",
      answer:
        "Files stored in your local storage are accessible offline. However, for conversion and comparison features, an internet connection is required as these processes run on our secure servers.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed through secure, encrypted channels.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription at any time from your account settings. After cancellation, you'll retain access to paid features until the end of your billing period.",
    },
    {
      question: "Do you offer educational or nonprofit discounts?",
      answer:
        "Yes, we offer special discounts for educational institutions, students, and nonprofit organizations. Please contact our support team with proof of status to learn more about our educational and nonprofit pricing.",
    },
  ];

  return (
    <div className="faq-section">
      <div className="container">
        <h2>Frequently Asked Questions</h2>
        <p className="faq-intro">
          Find answers to common questions about DocRevisor. If you can't find
          what you're looking for, our support team is always ready to help.
        </p>

        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <span className="faq-toggle">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <h3>Still have questions?</h3>
          <p>
            Our support team is here to help you get the most out of DocRevisor
          </p>
          <div className="faq-contact-options">
            <a href="mailto:support@docrevisor.info" className="contact-option">
              <span className="contact-icon">✉️</span>
              <span>Email us at support@docrevisor.info</span>
            </a>
            <a href="tel:+44123456789" className="contact-option">
              <span className="contact-icon">📞</span>
              <span>Call us at +44 123 456 789</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
