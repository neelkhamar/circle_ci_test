import React, { Component } from "react";
import Link from "../../utils/ActiveLink";

class Navbar extends Component {
  // Navbar
  _isMounted = false;
  state = {
    display: false,
    collapsed: true,
  };
  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  componentDidMount() {
    let elementId = document.getElementById("navbar");
    document.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        elementId.classList.add("is-sticky");
      } else {
        elementId.classList.remove("is-sticky");
      }
    });
    window.scrollTo(0, 0);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { collapsed } = this.state;
    const classOne = collapsed
      ? "collapse navbar-collapse"
      : "collapse navbar-collapse show";
    const classTwo = collapsed
      ? "navbar-toggler navbar-toggler-right collapsed"
      : "navbar-toggler navbar-toggler-right";

    return (
      <>
        <div id="navbar" className="navbar-area">
          <div className="main-nav">
            <div className="container">
              <nav className="navbar navbar-expand-md navbar-light">
                <Link href="/">
                  <a className="navbar-brand">
                    <img src="/images/logo.png" alt="logo" />
                  </a>
                </Link>

                <button
                  onClick={this.toggleNavbar}
                  className={classTwo}
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="icon-bar top-bar"></span>
                  <span className="icon-bar middle-bar"></span>
                  <span className="icon-bar bottom-bar"></span>
                </button>

                <div className={classOne} id="navbarSupportedContent">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link href="#">
                        <a
                          className="nav-link"
                          onClick={(e) => e.preventDefault()}
                        >
                          Home <i className="bx bx-chevron-down"></i>
                        </a>
                      </Link>

                      <ul className="dropdown-menu mega-dropdown-menu">
                        <li className="nav-item">
                          <h3>With Animation</h3>

                          <Link href="/" activeClassName="active">
                            <a className="nav-link">Home One (IT Startup)</a>
                          </Link>

                          <Link href="/index-it-2" activeClassName="active">
                            <a className="nav-link">Home Two (IT Startup)</a>
                          </Link>

                          <Link href="/index-it-3" activeClassName="active">
                            <a className="nav-link">Home Three (IT Startup)</a>
                          </Link>

                          <Link href="/index-saas" activeClassName="active">
                            <a className="nav-link">Home Four (SaaS Startup)</a>
                          </Link>

                          <Link href="/index-chatbot" activeClassName="active">
                            <a className="nav-link">Home Five (Chatbot)</a>
                          </Link>

                          <Link
                            href="/index-chatbot-2"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home Six (Chatbot)</a>
                          </Link>

                          <Link
                            href="/index-chatbot-3"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home Seven (Chatbot)</a>
                          </Link>

                          <Link
                            href="/index-digital-marketing"
                            activeClassName="active"
                          >
                            <a className="nav-link">
                              Home Eight (Digital Marketing)
                              <span className="new">New</span>
                            </a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <h3>Without Animation</h3>

                          <Link
                            href="/without-animation"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home One (IT Startup)</a>
                          </Link>

                          <Link
                            href="/without-animation/index-it-2"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home Two (IT Startup)</a>
                          </Link>

                          <Link
                            href="/without-animation/index-it-3"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home Three (IT Startup)</a>
                          </Link>

                          <Link
                            href="/without-animation/index-saas"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home Four (SaaS Startup)</a>
                          </Link>

                          <Link
                            href="/without-animation/index-chatbot"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home Five (Chatbot)</a>
                          </Link>

                          <Link
                            href="/without-animation/index-chatbot-2"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home Six (Chatbot)</a>
                          </Link>

                          <Link
                            href="/without-animation/index-chatbot-3"
                            activeClassName="active"
                          >
                            <a className="nav-link">Home Seven (Chatbot)</a>
                          </Link>

                          <Link
                            href="/without-animation/index-digital-marketing"
                            activeClassName="active"
                          >
                            <a className="nav-link">
                              Home Eight (Digital Marketing)
                              <span className="new">New</span>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item">
                      <Link href="/about" activeClassName="active">
                        <a className="nav-link">About</a>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link href="/pricing" activeClassName="active">
                        <a className="nav-link">Pricing</a>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link href="#">
                        <a
                          className="nav-link"
                          onClick={(e) => e.preventDefault()}
                        >
                          Pages <i className="bx bx-chevron-down"></i>
                        </a>
                      </Link>

                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link href="/services" activeClassName="active">
                            <a className="nav-link">Services</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/services2" activeClassName="active">
                            <a className="nav-link">Services Two</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/services3" activeClassName="active">
                            <a className="nav-link">Services Three</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/service-details"
                            activeClassName="active"
                          >
                            <a className="nav-link">Service Details</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="#">
                            <a
                              className="nav-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              Features{" "}
                              <i className="bx bx-chevron-right float-right"></i>
                            </a>
                          </Link>

                          <ul className="dropdown-menu">
                            <li className="nav-item">
                              <Link href="/features" activeClassName="active">
                                <a className="nav-link">Features One</a>
                              </Link>
                            </li>

                            <li className="nav-item">
                              <Link href="/features2" activeClassName="active">
                                <a className="nav-link">Features Two</a>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        <li className="nav-item">
                          <Link href="/team" activeClassName="active">
                            <a className="nav-link">Team</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/pricing" activeClassName="active">
                            <a className="nav-link">Pricing</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/faq" activeClassName="active">
                            <a className="nav-link">FAQ</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/login" activeClassName="active">
                            <a className="nav-link">Log In</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/signup" activeClassName="active">
                            <a className="nav-link">Sign Up</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/404" activeClassName="active">
                            <a className="nav-link">404 Error Page</a>
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item">
                      <Link href="#">
                        <a
                          className="nav-link"
                          onClick={(e) => e.preventDefault()}
                        >
                          Blog <i className="bx bx-chevron-down"></i>
                        </a>
                      </Link>

                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link href="/blog" activeClassName="active">
                            <a className="nav-link">Blog Grid</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/blog2" activeClassName="active">
                            <a className="nav-link">Blog Right Sidebar</a>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link href="/blog-details" activeClassName="active">
                            <a className="nav-link">Blog Details</a>
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item">
                      <Link href="/contact" activeClassName="active">
                        <a className="nav-link">Contact</a>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="others-options ms-auto">
                  <Link href="/login">
                    <a className="optional-btn">
                      <i className="bx bx-log-in"></i> Log In <span></span>
                    </a>
                  </Link>
                  <Link href="/contact">
                    <a className="default-btn">
                      <i className="bx bxs-hot"></i> Get Started <span></span>
                    </a>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Navbar;
