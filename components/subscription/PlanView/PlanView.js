import moment from "moment";
import { useMemo, useState } from "react";
import {
  createSubscription,
  updateSubscriptionPlanById,
  downgradeSubscription,
} from "../../../requests/subscription";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import alertContainer from "../../../utils/Alert";
import Plans from "./Plans";

const PlanView = ({
  subscription,
  plans,
  resources,
  fetchSubscriptionDetails,
  subscriptionSchedule,
}) => {
  const currentSubscriptionPlan = useMemo(() => {
    return subscription?.attributes?.plan;
  }, [subscription]);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [continueSpinner, setContinueSpinner] = useState(false);
  const [couponModal, setCouponModal] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const planSelected = ({ plan, update, downgrade = false }) => {
    if (resources.length == 0) {
      alertContainer({
        title: "Error de pago",
        text: "Necesitas agregar una tarjeta para poder suscribirte",
        icon: "warning",
        showConfirmButton: false,
      });
      return null;
    }
    if (subscriptionSchedule) {
      alertContainer({
        title: "Error de subscripcion",
        text: `Necesitas cancelar la actualizacion programada`,
        icon: "warning",
        showConfirmButton: false,
      });
      return;
    }
    setSelectedPlan(plan);
    if (update) {
      if (downgrade) {
        Swal.fire({
          title: "¿Estas seguro de querer degradar tu plan?",
          text: `Si degradas tu plan ${
            currentSubscriptionPlan.name
          } perderas todos los beneficios actuales despues del dia ${moment(
            subscription.attributes.current_period_end
          ).format("YYYY/MM/DD")}`,
          showDenyButton: false,
          showCancelButton: true,
          icon: "warning",
          confirmButtonColor: "#ff4d4f",
          confirmButtonText: "Si",
          cancelButtonText: "No",
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            setSpinner(true);
            downgradeSubscription(
              currentUser.accessToken,
              currentUser.uid,
              currentUser.client,
              { plan_id: plan.id },
              subscription.id
            ).then(
              (response) => {
                console.log(response);
                setSpinner(false);
                if (response.status === 200 && response.data.message) {
                  alertContainer({
                    title: response.data.message,
                    text: "",
                    icon: "success",
                    showConfirmButton: false,
                  });
                  fetchSubscriptionDetails();
                }
              },
              (error) => {
                setSpinner(false);
                const errorMessage = error?.response?.data?.errors[0] || [
                  "Error al degradar el plan",
                ];
                alertContainer({
                  title: "No se pudo degradar el plan",
                  text: errorMessage,
                  icon: "error",
                  showConfirmButton: false,
                });
              }
            );
          }
        });
        // Upgrade
      } else {
        handleSubscriptionPlanUpdate(plan, "");
      }
    } else {
      setCouponModal(true);
    }
  };

  const handleCancel = () => {
    setSelectedPlan(null);
    setCouponModal(false);
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const handleOk = (coupon) => {
    handlePlanSubscribe(selectedPlan, coupon);
  };

  const handlePlanSubscribe = async (plan, coupon) => {
    let payload = {
      plan_id: plan.id,
      coupon_id: coupon.id,
    };
    setContinueSpinner(true);
    try {
      const { data } = await createSubscription(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload
      );
      setContinueSpinner(false);
      alertContainer({
        title: data.message,
        text: "",
        icon: "success",
        showConfirmButton: false,
      });
      handleCancel();
      fetchSubscriptionDetails();
    } catch (e) {
      setContinueSpinner(false);
      console.log(e);
    }
  };

  const handleSubscriptionPlanUpdate = async (plan, coupon) => {
    if (!subscription || !subscription.id) return;
    let payload = {
      plan_id: plan.id,
      coupon_id: coupon.id,
    };
    setSpinner(true);
    try {
      const { data } = await updateSubscriptionPlanById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload,
        subscription.id
      );
      setSpinner(false);
      alertContainer({
        title: data.message,
        text: "",
        icon: "success",
        showConfirmButton: false,
      });
      handleCancel();
      fetchSubscriptionDetails();
    } catch (error) {
      setSpinner(false);
      const errorMessage = error?.response?.data?.errors[0] || [
        "Error al actualizar el plan!",
      ];
      alertContainer({
        title: "No se pudo actualizar el plan",
        text: errorMessage,
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <h4>Planes</h4>
      <Plans
        plans={plans}
        continueSpinner={continueSpinner}
        spinner={spinner}
        couponModal={couponModal}
        handleOk={handleOk}
        handleCancel={handleCancel}
        planSelected={planSelected}
        currentSubscriptionPlan={currentSubscriptionPlan}
        subscriptionSchedule={subscriptionSchedule}
      />
    </>
  );
};

export default PlanView;
