import React, { Component } from "react";

class ContactInfo extends Component {
  render() {
    return (
      <div className="contact-info">
        <div className="contact-info-content">
          <h2>
            <span className="number">+782 220 90 27</span>
            <span className="or">O</span>
            <span className="email">admin@porteton.com</span>
          </h2>

          <ul className="social">
            <li>
              <a href="https://www.youtube.com/" target="_blank">
                <i className="bx bxl-youtube"></i>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/" target="_blank">
                <i className="bx bxl-facebook"></i>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/" target="_blank">
                <i className="bx bxl-linkedin"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/" target="_blank">
                <i className="bx bxl-instagram"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ContactInfo;
