import React, { Component } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const OwlCarousel = dynamic(import("react-owl-carousel3"));

const options = {
  loop: true,
  nav: false,
  dots: false,
  autoplayHoverPause: true,
  autoplay: true,
  margin: 50,
  responsive: {
    0: {
      items: 2,
    },
    576: {
      items: 3,
    },
    768: {
      items: 3,
    },
    1200: {
      items: 4,
    },
  },
};

class Partner extends Component {
  _isMounted = false;
  state = {
    display: false,
  };
  componentDidMount() {
    this._isMounted = true;
    this.setState({ display: true });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <section className="partner-area ptb-100 bg-f8fbfa">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-12">
              <div className="partner-title">
                <h3>Featured by:</h3>
              </div>
            </div>

            <div className="col-lg-9 col-md-12">
              {this.state.display ? (
                <OwlCarousel
                  className="partner-slides owl-carousel owl-theme"
                  {...options}
                >
                  <div className="single-partner-item">
                    <a href="#" target="_blank">
                      <img src="/images/partner/partner1.png" alt="image" />
                    </a>
                  </div>

                  <div className="single-partner-item">
                    <a href="#" target="_blank">
                      <img src="/images/partner/partner2.png" alt="image" />
                    </a>
                  </div>

                  <div className="single-partner-item">
                    <a href="#" target="_blank">
                      <img src="/images/partner/partner3.png" alt="image" />
                    </a>
                  </div>

                  <div className="single-partner-item">
                    <a href="#" target="_blank">
                      <img src="/images/partner/partner4.png" alt="image" />
                    </a>
                  </div>
                </OwlCarousel>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Partner;
