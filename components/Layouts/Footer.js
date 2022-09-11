import React, { Component } from "react";
import Link from "next/link";

class Footer extends Component {
  render() {
    let currentYear = new Date().getFullYear();
    return (
      <footer className="footer-area">
        <div className="divider"></div>
        <div className="container">
          <div className="copyright-area">
            <p>Copyright &copy; {currentYear} Porteton.</p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
