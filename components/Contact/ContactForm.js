import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import baseUrl from "../../utils/baseUrl";

const alertContent = () => {
  MySwal.fire({
    title: "Congratulations!",
    text: "Your message was successfully send and will back to you soon",
    icon: "success",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

// Form initial state
const INITIAL_STATE = {
  name: "",
  email: "",
  number: "",
  subject: "",
  text: "",
};

const ContactForm = () => {
  const [contact, setContact] = useState(INITIAL_STATE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${baseUrl}/api/contact`;
      const { name, email, number, subject, text } = contact;
      const payload = { name, email, number, subject, text };
      const response = await axios.post(url, payload);
      setContact(INITIAL_STATE);
      alertContent();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="contact-form">
      <h3>Contactanos</h3>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Nombres"
                className="form-control"
                value={contact.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <input
                type="text"
                name="email"
                placeholder="Apellidos"
                className="form-control"
                value={contact.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <input
                type="text"
                name="number"
                placeholder="Telefono"
                className="form-control"
                value={contact.number}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Correo electronico"
                className="form-control"
                value={contact.subject}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="form-group">
              <textarea
                name="text"
                cols="30"
                rows="6"
                placeholder="Mensaje"
                className="form-control"
                value={contact.text}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-12 col-sm-12 text-center">
            <button type="submit" className="default-btn">
              <i className="bx bxs-paper-plane"></i>
              Enviar <span></span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
