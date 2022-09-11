import { Component } from "react";
import ScrollAnimation from "react-animate-on-scroll";

class TeamStyleOne extends Component {
  render() {
    return (
      <section className="team-area pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <h2>Meet Our experts always ready to help you</h2>
          </div>

          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <ScrollAnimation
                animateIn="fadeInUp"
                delay={50}
                animateOnce={true}
              >
                <div className="single-team-box">
                  <div className="image">
                    <img src="/images/team/team1.jpg" alt="image" />

                    <ul className="social">
                      <li>
                        <a href="https://www.facebook.com/" target="_blank">
                          <i className="bx bxl-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://twitter.com/" target="_blank">
                          <i className="bx bxl-twitter"></i>
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

                  <div className="content">
                    <h3>Alex Maxwel</h3>
                    <span>CEO & Founder</span>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            <div className="col-lg-3 col-sm-6">
              <ScrollAnimation
                animateIn="fadeInUp"
                delay={100}
                animateOnce={true}
              >
                <div className="single-team-box">
                  <div className="image">
                    <img src="/images/team/team2.jpg" alt="image" />

                    <ul className="social">
                      <li>
                        <a href="https://www.facebook.com/" target="_blank">
                          <i className="bx bxl-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://twitter.com/" target="_blank">
                          <i className="bx bxl-twitter"></i>
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

                  <div className="content">
                    <h3>Sarah Taylor</h3>
                    <span>UX/UI Designer</span>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            <div className="col-lg-3 col-sm-6">
              <ScrollAnimation
                animateIn="fadeInUp"
                delay={150}
                animateOnce={true}
              >
                <div className="single-team-box">
                  <div className="image">
                    <img src="/images/team/team3.jpg" alt="image" />

                    <ul className="social">
                      <li>
                        <a href="https://www.facebook.com/" target="_blank">
                          <i className="bx bxl-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://twitter.com/" target="_blank">
                          <i className="bx bxl-twitter"></i>
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

                  <div className="content">
                    <h3>Lee Munroe</h3>
                    <span>Web Developer</span>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            <div className="col-lg-3 col-sm-6">
              <ScrollAnimation
                animateIn="fadeInUp"
                delay={200}
                animateOnce={true}
              >
                <div className="single-team-box">
                  <div className="image">
                    <img src="/images/team/team4.jpg" alt="image" />

                    <ul className="social">
                      <li>
                        <a href="https://www.facebook.com/" target="_blank">
                          <i className="bx bxl-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://twitter.com/" target="_blank">
                          <i className="bx bxl-twitter"></i>
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

                  <div className="content">
                    <h3>Calvin Klein</h3>
                    <span>Support</span>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default TeamStyleOne;
