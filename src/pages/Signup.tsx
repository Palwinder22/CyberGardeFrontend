import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company: '',
    position: '',
    license_key: '',
  });

  const [progress, setProgress] = useState(0);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Start progress simulation
    setLogMessages([
      '🛡️ Initializing security system...',
    ]);
    setProgress(0);
    setLoading(true);
    setSuccessMessage('');

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      setLogMessages(prev => [...prev, `⏳ Progress: ${p}%`]);

      if (p >= 100) {
        clearInterval(interval);
        setLogMessages(prev => [
          ...prev,
          '✅ License successfully validated.',
          '🔒 Protection system activated.',
        ]);
      }
    }, 400);

    // Submit form data to backend
    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Include status in console error
        throw new Error(`Form submission failed (status ${response.status})`);
      }

      const result = await response.json();
      setSuccessMessage(result.message);
    } catch (error: any) {
      // Log full technical error in English to console only
      console.error('Form submission error:', error);

      // Show simple user-facing message in on-screen console
      setLogMessages(prev => [
        ...prev,
        '❌ Form submission failed. Please try again later.',
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="window">
        <header>
          <img src="/logo.png" width="50" alt="Logo" />
          <h2>Association Citoyenne pour la Lutte Contre la Cybercriminalité</h2>
          <p>Formulaire d'identification avant activation du SOC</p>
        </header>

        <form onSubmit={handleSubmit}>
          <input
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <br />
          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
          />
          <input
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          <br />
          <input
            name="license_key"
            placeholder="License Key"
            value={formData.license_key}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? '🔄 Processing...' : '🚀 Activate Protection'}
          </button>
        </form>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>

        {logMessages.length > 0 && (
          <div className="console">
            {logMessages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
