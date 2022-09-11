import React, { useState } from "react";
import Link from "next/link";
import SignUp from "../components/Authentication/SignUp";
import Spinner from "../utils/Spinner";
import publicCheck from "../components/utilities/checkAuth/publicCheck";

const Signup = () => {
  const [spinner, setSpinner] = useState(false);

  return (
    <section className="signup-area">
      <Spinner visible={spinner} />
      <div className="row m-0">
        <div className="col-lg-12 col-md-12 p-0">
          <div className="signup-content">
            <div className="d-table">
              <div className="d-table-cell">
                <div className="signup-form">
                  <div className="logo text-center">
                    <a href="/">
                      <img src="/images/logo.png" alt="image" />
                    </a>
                  </div>

                  <h3 className="text-center">Crear Cuenta</h3>
                  <p className="text-center">
                    Ya tienes cuenta?{" "}
                    <Link href="/login">
                      <a>Iniciar sesion</a>
                    </Link>
                  </p>
                  <SignUp spinner={spinner} setSpinner={setSpinner} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default publicCheck(Signup);
