import React, { useEffect } from "react";
import Link from "next/link";
import { confirmation } from "../../requests/authentication";
import Router, { useRouter } from "next/router";

const Confirmation = () => {
  const router = useRouter();
  useEffect(() => {
    const params = router.query;
    confirmation(
      params.config,
      params.confirmation_token,
      params.redirect_url
    ).then(
      (response) => {
        console.log(response);
        Router.push("/login");
      },
      (error) => {
        console.log(error.response);
      }
    );
  });

  return (
    <section className="login-area">
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

                  <h3 className="text-center">Confirmar Cuenta</h3>
                  <p className="text-center">Error: Token Invalido</p>
                  <div className="text-center mt-3">
                    <Link href="/signup">
                      <a className="default-btn">Crear cuenta</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;
