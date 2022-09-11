import React, { useState } from "react";
import Link from "next/link";
import SignIn from "../components/Authentication/SignIn";
import Spinner from "../utils/Spinner";
import publicCheck from "../components/utilities/checkAuth/publicCheck";

const Login = () => {
  const [spinner, setSpinner] = useState(false);
  return (
    <section className="login-area">
      <Spinner visible={spinner} />
      <div className="row m-0">
        <div className="col-lg-12 col-md-12 p-0">
          <div className="login-content">
            <div className="d-table">
              <div className="d-table-cell">
                <div className="login-form">
                  <div className="logo text-center">
                    <a href="/">
                      <img src="/images/logo.png" alt="image" />
                    </a>
                  </div>

                  <h3 className="text-center">Iniciar Sesion</h3>
                  <p className="text-center">
                    No tienes cuenta?{" "}
                    <Link href="/signup">
                      <a>Crear cuenta</a>
                    </Link>
                  </p>

                  <SignIn spinner={spinner} setSpinner={setSpinner} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default publicCheck(Login);
