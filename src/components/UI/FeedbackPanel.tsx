/**
 * Beta Feedback Gathering Panel
 * To collect feedback and requests from usersUI
 */

import React, { useState } from 'react';

interface FeedbackData {
  rating: number; // 1-5
  category: string; // 
  message: string; // 
  userAgent: string; // 
  timestamp: string; // 
}

interface FeedbackPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onDarkMode?: boolean;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  isVisible,
  onClose,
  onDarkMode = false
}) => {
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'usability', label: '' },
    { value: 'features', label: '' },
    { value: 'performance', label: '' },
    { value: 'ui', label: 'UI' },
    { value: 'bug', label: '' },
    { value: 'request', label: '' },
    { value: 'other', label: '' }
  ];

  const handleSubmit = async () => {
    if (!category || !message.trim()) {
      alert('Please enter a category and a message.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Google
      const formData = new FormData();
      formData.append('entry.1234567890', rating.toString()); // 
      formData.append('entry.1234567891', category); // 
      formData.append('entry.1234567892', message.trim()); // 
      formData.append('entry.1234567893', new Date().toISOString()); // 
      formData.append('entry.1234567894', navigator.userAgent); // 

      // GoogleURL(needs to be updated after the actual form is created)
      const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
      
      const response = await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // CORS
      });

      // 
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        // 
        setRating(0);
        setCategory('');
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error(':', error);
      alert('Submission failed, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="feedback-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div className="feedback-panel" style={{
        backgroundColor: onDarkMode ? '#2a2a2a' : '#ffffff',
        border: `1px solid ${onDarkMode ? '#444' : '#ddd'}`,
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {/*  */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: `1px solid ${onDarkMode ? '#444' : '#eee'}`
        }}>
          <h3 style={{
            margin: 0,
            color: onDarkMode ? '#fff' : '#333',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            🧪 
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: onDarkMode ? '#ccc' : '#666',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/*  */}
        {isSubmitted ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: onDarkMode ? '#4CAF50' : '#2E7D32'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ margin: '0 0 8px 0', color: onDarkMode ? '#fff' : '#333' }}>
              Feedback sent
            </h3>
            <p style={{ margin: 0, color: onDarkMode ? '#ccc' : '#666' }}>
              
            </p>
          </div>
        ) : (
          <>
            {/*  */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: onDarkMode ? '#fff' : '#333',
                fontWeight: '500'
              }}>
                
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: star <= rating ? '#FFD700' : onDarkMode ? '#666' : '#ccc',
                      padding: '4px'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/*  */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: onDarkMode ? '#fff' : '#333',
                fontWeight: '500'
              }}>
                 *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${onDarkMode ? '#555' : '#ddd'}`,
                  borderRadius: '6px',
                  backgroundColor: onDarkMode ? '#333' : '#fff',
                  color: onDarkMode ? '#fff' : '#333',
                  fontSize: '14px'
                }}
              >
                <option value=""></option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/*  */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: onDarkMode ? '#fff' : '#333',
                fontWeight: '500'
              }}>
                 *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: `1px solid ${onDarkMode ? '#555' : '#ddd'}`,
                  borderRadius: '6px',
                  backgroundColor: onDarkMode ? '#333' : '#fff',
                  color: onDarkMode ? '#fff' : '#333',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/*  */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  border: `1px solid ${onDarkMode ? '#555' : '#ddd'}`,
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: onDarkMode ? '#ccc' : '#666',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !category || !message.trim()}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: isSubmitting || !category || !message.trim() 
                    ? onDarkMode ? '#555' : '#ccc'
                    : '#007bff',
                  color: '#fff',
                  cursor: isSubmitting || !category || !message.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {isSubmitting ? '...' : ''}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
