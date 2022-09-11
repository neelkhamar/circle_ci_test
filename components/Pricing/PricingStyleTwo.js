import React, { Component } from "react";
import Link from "next/link";

class PricingStyleTwo extends Component {
  openTabSection = (evt, tabNmae) => {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabs_item");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByTagName("li");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("current", "");
    }

    document.getElementById(tabNmae).style.display = "block";
    evt.currentTarget.className += "current";
  };

  render() {
    return (
      <section className="pricing-area pt-100 pb-70 bg-f4f5fe">
        <div className="container">
          <div className="section-title">
            <h2>Choose The Pricing Plan</h2>
          </div>

          <div className="tab pricing-list-tab">
            {/* Pricing Tab List */}
            <ul className="tabs">
              <li
                className="current"
                onClick={(e) => this.openTabSection(e, "tab1")}
              >
                <span>
                  <i className="bx bxs-calendar-check"></i> Monthly
                </span>
              </li>

              <li onClick={(e) => this.openTabSection(e, "tab2")}>
                <span>
                  <i className="bx bxs-calendar-check"></i> Yearly
                </span>
              </li>
            </ul>

            <div className="tab_content">
              <div id="tab1" className="tabs_item">
                <div className="row">
                  {/* Single pricing table */}
                  <div className="col-lg-4 col-sm-6">
                    <div className="single-pricing-table center-align">
                      <div className="pricing-header">
                        <h3>Free</h3>
                      </div>

                      <div className="price">
                        <sup>$</sup>0 <sub>/ monthly</sub>
                      </div>

                      <ul className="pricing-features">
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Up to 3 chat operators
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          100 ChatBot Triggers
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          24/7 Live Chat
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Email Integration
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Messenger Integration
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Info
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Mobile + Desktop Apps
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Quick Responses
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i> Drag & Drop
                          Widgets
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Notes
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i> Google
                          Analytics
                        </li>
                      </ul>

                      <div className="btn-box">
                        <Link href="/login">
                          <a className="default-btn">
                            <i className="bx bxs-hot"></i>
                            Try It Free Now
                            <span></span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Single pricing table */}
                  <div className="col-lg-4 col-sm-6">
                    <div className="single-pricing-table center-align">
                      <div className="pricing-header">
                        <h3>Starter</h3>
                      </div>

                      <div className="price">
                        <sup>$</sup>49 <sub>/ monthly</sub>
                      </div>

                      <ul className="pricing-features">
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Up to 4 chat operators
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          150 ChatBot Triggers
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          24/7 Live Chat
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Email Integration
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Messenger Integration
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Info
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Mobile + Desktop Apps
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Quick Responses
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i> Drag & Drop
                          Widgets
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Notes
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Google Analytics
                        </li>
                      </ul>

                      <div className="btn-box">
                        <Link href="/login">
                          <a className="default-btn">
                            <i className="bx bxs-hot"></i>
                            Try It Free Now
                            <span></span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Single pricing table */}
                  <div className="col-lg-4 col-sm-6 offset-lg-0 offset-sm-3">
                    <div className="single-pricing-table center-align">
                      <div className="pricing-header">
                        <h3>Professional</h3>
                      </div>

                      <div className="price">
                        <sup>$</sup>79<sub> / monthly</sub>
                      </div>

                      <ul className="pricing-features">
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Up to 5 chat operators
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          200 ChatBot Triggers
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          24/7 Live Chat
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Email Integration
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Messenger Integration
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Info
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Mobile + Desktop Apps
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Quick Responses
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Drag & Drop Widgets
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Notes
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Google Analytics
                        </li>
                      </ul>

                      <div className="btn-box">
                        <Link href="/login">
                          <a className="default-btn">
                            <i className="bx bxs-hot"></i>
                            Try It Free Now
                            <span></span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="tab2" className="tabs_item">
                <div className="row">
                  {/* Single pricing table */}
                  <div className="col-lg-4 col-md-6">
                    <div className="single-pricing-table center-align">
                      <div className="pricing-header">
                        <h3>Free</h3>
                      </div>

                      <div className="price">
                        <sup>$</sup>0 <sub>/ yearly</sub>
                      </div>

                      <ul className="pricing-features">
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Up to 5 chat operators
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          150 ChatBot Triggers
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          24/7 Live Chat
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Email Integration
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Messenger Integration
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Info
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Mobile + Desktop Apps
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Quick Responses
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Drag & Drop Widgets
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Notes{" "}
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Google Analytics
                        </li>
                      </ul>

                      <div className="btn-box">
                        <Link href="/login">
                          <a className="default-btn">
                            <i className="bx bxs-hot"></i>
                            Try It Free Now
                            <span></span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Single pricing table */}
                  <div className="col-lg-4 col-md-6">
                    <div className="single-pricing-table center-align">
                      <div className="pricing-header">
                        <h3>Starter</h3>
                      </div>

                      <div className="price">
                        <sup>$</sup>79 <sub>/ yearly</sub>
                      </div>

                      <ul className="pricing-features">
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Up to 6 chat operators
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          200 ChatBot Triggers
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          24/7 Live Chat
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Email Integration
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Messenger Integration
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Info
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Mobile + Desktop Apps
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Quick Responses
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Drag & Drop Widgets
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Notes
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Google Analytics
                        </li>
                      </ul>

                      <div className="btn-box">
                        <Link href="/login">
                          <a className="default-btn">
                            <i className="bx bxs-hot"></i>
                            Try It Free Now
                            <span></span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Single pricing table */}
                  <div className="col-lg-4 col-md-6 offset-lg-0 offset-md-3">
                    <div className="single-pricing-table center-align">
                      <div className="pricing-header">
                        <h3>Professional</h3>
                      </div>

                      <div className="price">
                        <sup>$</sup>99 <sub>/ yearly</sub>
                      </div>

                      <ul className="pricing-features">
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Up to 7 chat operators
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          250 ChatBot Triggers
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          24/7 Live Chat
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Email Integration
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Messenger Integration
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Info
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Mobile + Desktop Apps
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Quick Responses
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Drag & Drop Widgets
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Visitor Notes
                          <span
                            className="tooltips bx bxs-info-circle"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Tight pants next level keffiyeh you probably haven't heard of them."
                          ></span>
                        </li>
                        <li>
                          <i className="bx bxs-badge-check"></i>
                          Google Analytics
                        </li>
                      </ul>

                      <div className="btn-box">
                        <Link href="/login">
                          <a className="default-btn">
                            <i className="bx bxs-hot"></i>
                            Try It Free Now
                            <span></span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default PricingStyleTwo;
