import React, { Component } from 'react';
import ScrollAnimation from 'react-animate-on-scroll';
import { Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
class Features extends Component {
    render() {
        return (
            <section id="services" className="features-area pt-100 pb-70 bg-f4f6fc">
                <div className="container max-width-1290">
                    <div className="section-title">
                        <h2>Caracteristicas</h2>
                    </div>
                    <div className="row">
												<div className="col-lg-3 col-md-3">
														<ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
																<div className="features-box-one">
																		<i className='bx bx-file-blank bg-6610f2'></i>
																		<h3>Carta Porte</h3>
																		<p>Emite CFDI's de traslasdo con complemento carta porte en menos de 1 minuto.</p>
																</div>
														</ScrollAnimation>
												</div>
												<div className="col-lg-3 col-md-3">
														<ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
																<div className="features-box-one">
																		<i className='bx bxs-truck bg-e91e63'></i>
																		<h3>Fletes</h3>
																		<p>Lleva un control detallado de cada uno de los traslados de tu empresa transportista.</p>
																</div>
														</ScrollAnimation>
												</div>
                        <div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={100} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bxs-file bg-13c4a1'></i>
                                    <h3>CFDI 4.0</h3>
                                    <p>Emite CFDI's de ingreso o traslado, desde cualquier dispositivo, lugar y hora los 365 dias del año.</p>
                                </div>
                            </ScrollAnimation>
                        </div>
												<div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bx-file-find bg-ffb700' ></i>
                                    <h3>CFDI's Externos</h3>
                                    <p>Consulta todas las facturas emitidas o recibidas de tu empresa sin importar donde fueron creadas.</p>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bx-check bg-13c4a1'></i>
                                    <h3>Validez Fiscal</h3>
                                    <p>Nuestros comprobantes son timbrados por un proveedor de certificacion (PCCFDI, antes PAC).</p>
                                </div>
                            </ScrollAnimation>
                        </div>

                        <div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={100} animateOnce={true}>
																<Tag color={'warning'} className='float-end mr-0'>
																	Hasta 30 de Julio 2022 
																</Tag>
                                <div className="features-box-one">
                                    <i className='bx bxs-file bg-6610f2'></i>
                                    <h3>CFDI 3.3</h3>
                                    <p>Emite CFDI's de traslado, desde cualquier dispositivo, vigente hasta el 30 de Julio 2022.</p>
                                </div>
                            </ScrollAnimation>
                        </div>

                        <div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bx-x bg-ffb700'></i>
                                    <h3>Cancelaciones</h3>
                                    <p>Cancela cualquier factura emitida en porteton de una manera facil y rapida.</p>
                                </div>
                            </ScrollAnimation>
                        </div>
												<div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bx-line-chart bg-e91e63' ></i>
                                    <h3>Panel</h3>
                                    <p>Panel de informacion con detalles de tus ingresos, traslados, graficas estadisticas y mas.</p>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>

                    <div className="row">
										<div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bx-sync bg-ffb700' ></i>
                                    <h3>Actualizaciones SAT</h3>
                                    <p>Estamos atentos a cualquier cambio del SAT en la reforma fiscal.</p>
                                </div>
                            </ScrollAnimation>
                        </div>
												<div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bx-customize bg-e91e63' ></i>
                                    <h3>Personalizaciones</h3>
                                    <p>Desarrollamos funcionalidades a la medida dependiendo las necesidades de tu empresa.</p>
                                </div>
                            </ScrollAnimation>
                        </div>
												<div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bxs-cog bg-6610f2'></i>
                                    <h3>Herramientas</h3>
                                    <p>Notificaciones push, SMS, tiempo real, automatizaciones, mapas de google y mas.</p>
                                </div>
                            </ScrollAnimation>
                        </div>
												<div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
                                <div className="features-box-one">
                                    <i className='bx bx-support bg-13c4a1'></i>
                                    <h3>Soporte Tecnico</h3>
                                    <p>Obten ayuda mediante chat, email o llamadas telefonicas en menos de 24 horas.</p>
                                </div>
                            </ScrollAnimation>
                        </div>
											</div>
											<div className='row'>
                        <div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
															<Tag color={'processing'} className='float-end mr-0' icon={<SyncOutlined className='align-text-top' spin />}>
																proximamente
															</Tag>
															<div className="features-box-one">
																	<i className='bx bx-buildings bg-e91e63'></i>
																	<h3>Multi Compañia</h3>
																	<p>Emite facturas desde una misma cuenta con diferentes razones sociales.</p>
															</div>
                            </ScrollAnimation>
                        </div>
												<div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
															<Tag color={'processing'} className='float-end mr-0' icon={<SyncOutlined className='align-text-top' spin />}>
																proximamente
															</Tag>
															<div className="features-box-one">
																	<i className='bx bx-group bg-ffb700'></i>
																	<h3>Multi Usuarios</h3>
																	<p>Da de alta a tus contadores para permitirles gestionar ciertas actividades.</p>
															</div>
                            </ScrollAnimation>
                        </div>
                        <div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={100} animateOnce={true}>
															<Tag color={'processing'} className='float-end mr-0' icon={<SyncOutlined className='align-text-top' spin />}>
																proximamente
															</Tag>
															<div className="features-box-one">
																	<i className='bx bx-current-location bg-13c4a1'></i>
																	<h3>Rastrea Mercancias</h3>
																	<p>Como administrador es importante saber el status de tus mercancias y operador en tiempo real.</p>
															</div>
                            </ScrollAnimation>
                        </div>
                        <div className="col-lg-3 col-md-3">
                            <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
															<Tag color={'processing'} className='float-end mr-0' icon={<SyncOutlined className='align-text-top' spin />}>
																proximamente
															</Tag>
															<div className="features-box-one">
																	<i className='bx bx-mobile-alt bg-6610f2'></i>
																	<h3>App Movil</h3>
																	<p>Todos los operadores podran actualizar informacion relacionada al traslado en tiempo real.</p>
															</div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Features;