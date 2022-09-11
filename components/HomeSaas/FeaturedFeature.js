import React, { Component } from 'react';
import ScrollAnimation from 'react-animate-on-scroll';

class FeaturedFeature extends Component {
    render() {
        return (
            <section className="services-area ptb-100">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="services-image">
                            <div className="image">
                                <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                    <img src="/images/home-saas/feature1.png" alt="image" />
                                </ScrollAnimation>
                            </div>
                        </div>
            
                        <div className="services-content it-service-content">
                            <div className="content">
                                <div className="features-inner-content">
                                    <div className="features-item">
                                        <i className='bx bx-phone-call bg-13c4a1 blt-radius-0'></i>
                                        <h3>Free Caliing Service</h3>
                                        <p>Plan ahead by day, week, or month, and see project status at a glance. Search and filter to focus in on anything form a single project to an individual person's workload.</p>
                                    </div>
                                    <div className="features-item">
                                        <i className='bx bx-gift bg-6610f2 blt-radius-0'></i>
                                        <h3>Daily Free Gift</h3>
                                        <p>Plan ahead by day, week, or month, and see project status at a glance. Search and filter to focus in on anything form a single project to an individual person's workload.</p>
                                        
                                    </div>
                                    <div className="features-item">
                                        <i className='bx bx-code-alt bg-ff612f blt-radius-0'></i>
                                        <h3>QR Code Scaner</h3>
                                        <p>Plan ahead by day, week, or month, and see project status at a glance. Search and filter to focus in on anything form a single project to an individual person's workload.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shape9">
                    <img src="/images/shape/shape9.png" alt="image" />
                </div>
            </section>
        );
    }
}

export default FeaturedFeature;