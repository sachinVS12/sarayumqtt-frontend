import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const AuthLayout = ({ children, title, subtitle, footerText, footerLink, footerLinkText }) => {
  return (
    <div className="login_container">
      <div className="login_left">
        <div className="login_left_content">
          <h1>Welcome Back!</h1>
          <p>Streamline your IoT device management with our comprehensive dashboard.</p>
          <div className="login_image">
            <img 
              src="/images/auth-illustration.svg" 
              alt="Authentication Illustration" 
              style={{ maxWidth: '80%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
      
      <div className="login_right">
        <div className="login_form_container">
          <div className="login_header">
            <h2>{title}</h2>
            {subtitle && <p className="subtitle">{subtitle}</p>}
          </div>
          
          <div className="login_form">
            {children}
          </div>
          
          {footerText && (
            <div className="auth_footer">
              {footerText} <Link to={footerLink}>{footerLinkText}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
