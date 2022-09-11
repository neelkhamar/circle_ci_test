import React, { Component } from "react";
import Link from "../../utils/ActiveLink";

class NavbarTwo extends Component {
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
        <div id="navbar" className="navbar-area bg-white">
          <div className="main-nav">
            <div className="container">
              <nav className="navbar navbar-expand-md navbar-light">
                <Link href="/">
                  <a className="navbar-brand">
                    <img src="/images/logo/porteton435x160.png" alt="logo" />
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
                  <ul className="navbar-nav mx-auto">
                    <li className="nav-item">
                      <Link href="/" activeClassName="active">
                        <a className="nav-link">Inicio</a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a href="#services" className="nav-link">
                        Caracteristicas
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="#pricing" className="nav-link">
                        Precio
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="#contact" className="nav-link">
                        Contacto
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="others-options">
                  <Link href="/signup">
                    <a className="default-btn mr-3">
                      <i className="bx bx-user-plus"></i> Registrarse{" "}
                      <span></span>
                    </a>
                  </Link>

                  <Link href="/login">
                    <a className="default-btn black-btn">
                      <i className="bx bx-log-in"></i> Iniciar Sesion{" "}
                      <span></span>
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

export default NavbarTwo;
