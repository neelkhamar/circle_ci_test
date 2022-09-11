import React, { Component } from "react";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

class ContactFormArea extends Component {
  render() {
    return (
      <section id="contact" className="contact-area ptb-100 mb-5">
        <div className="container">
          <div className="contact-inner">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <div className="contact-features-list">
                  <h3>Porteton</h3>
                  <p>
                    Somos un equipo altamente capacitado y dedicado que ayuda a
                    empresas transportistas, contadores, personas morales y
                    personas fisicas a optimizar el éxito. <br />
                    Le ayudamos a ahorrar tiempo para que se concentre en el
                    panorama general al ocuparnos de los pequeños detalles.
                    Ofrecemos la solución tecnológica adecuada al precio
                    adecuado para las pequeñas, medianas y grandes empresas.
                    Estamos altamente comprometidos en brindar servicios
                    estándar a todos nuestros clientes sin importar el nombre,
                    tamaño o ubicacion. Todos nuestros clientes son igualmente
                    importantes para nosotros.
                  </p>
                </div>
              </div>

              <div className="col-lg-6 col-md-12">
                {/* Contact Form */}
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <ContactInfo />
          </div>
        </div>
      </section>
    );
  }
}

export default ContactFormArea;
