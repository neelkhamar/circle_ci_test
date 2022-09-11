import React, { useEffect, useState } from "react";
import { getLandingPlans } from "../../requests/plan";
import Plans from "../subscription/PlanView/Plans";
import { useSelector } from "react-redux";

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchPlans();
    }

    return () => (mounted = false);
  }, []);

  const fetchPlans = () => {
    getLandingPlans(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        console.log(response);
        setPlans(response.data);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <section id="pricing" className="pricing-area pt-100 pb-70 bg-f4f5fe p-5">
      <div className="section-title">
        <h2>Precios</h2>
      </div>
      <Plans plans={plans} />
    </section>
  );
};

export default Pricing;
