import { ClockCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { PageHeader } from "../page-headers/page-headers";
import { Cards } from "../cards/frame/cards-frame";
import { Main } from "./styled";
import {
  applySubscriptionCouponById,
  getAllPaymentDetails,
  cancelSubscription,
  activeSubscription,
  releaseSubscription,
} from "../../requests/subscription";
import { useSelector } from "react-redux";
import PlanView from "./PlanView";
import PaymentList from "./PaymentList";
import alertContainer from "../../utils/Alert";
import moment from "moment";
import Swal from "sweetalert2";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const SubscriptionSettingsContainer = () => {
  const [spinner, setSpinner] = useState(false);
  const [couponSpinner, setCouponSpinner] = useState(false);
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState({});
  const [subscriptionSchedule, setSubscriptionSchedule] = useState({});
  const [coupon, setCoupon] = useState("");
  const [paymentCards, setPaymentCards] = useState([]);
  const [errors, setErrors] = useState([]);
  const [btnSpinner, setBtnSpinner] = useState(false);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchSubscriptionDetails();
    }

    return () => (mounted = false);
  }, []);

  const fetchSubscriptionDetails = () => {
    setSpinner(true);
    getAllPaymentDetails(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        console.log(response);
        setSpinner(false);
        setPlans(response.data.plans);
        setSubscription(response.data.subscription);
        setPaymentCards(response.data.cards);
        setSubscriptionSchedule(response.data.subscription_schedule);
      },
      (error) => {
        setSpinner(false);
        console.error(error);
      }
    );
  };

  const handleCouponApply = async () => {
    setErrors([]);
    if (!subscription || !subscription.id) {
      alertContainer({
        title:
          "Necesitas adquirir una subscripcion para poder canjear un cupon",
        text: "",
        icon: "warning",
        showConfirmButton: false,
      });
      return;
    }
    setCouponSpinner(true);
    try {
      const { data } = await applySubscriptionCouponById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        coupon,
        subscription.id
      );
      setCouponSpinner(false);
      alertContainer({
        title: data.message,
        text: "",
        icon: "success",
        showConfirmButton: false,
      });
      setCoupon("");
    } catch (e) {
      setCouponSpinner(false);
      setErrors(e.response.data.errors);
    }
  };

  const onCancelSubscription = () => {
    Swal.fire({
      title: "¿Estás seguro de querer cancelar la suscripcion?",
      text: `Si cancelas tu subscripcion del plan ${
        subscription.attributes.plan.name
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
        confirmCancel();
      }
    });
  };

  const confirmCancel = () => {
    setBtnSpinner(true);
    cancelSubscription(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      subscription.id
    ).then(
      (response) => {
        setBtnSpinner(false);
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
        setBtnSpinner(false);
        const errorMessage = error?.response?.data?.errors[0] || [
          "Error al cancelar la subscripcion.",
        ];
        alertContainer({
          title: "No se pudo cancelar el plan",
          text: errorMessage,
          icon: "error",
          showConfirmButton: false,
        });
      }
    );
  };

  const onActiveSubscription = () => {
    setBtnSpinner(true);
    activeSubscription(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      subscription.id
    ).then(
      (response) => {
        setBtnSpinner(false);
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
        setBtnSpinner(false);
        const errorMessage = error?.response?.data?.errors[0] || [
          "Error al activar la subscripcion.",
        ];
        alertContainer({
          title: "No se pudo cancelar",
          text: errorMessage,
          icon: "error",
          showConfirmButton: false,
        });
      }
    );
  };

  const statusLabel = (status) => {
    if (status === "active") {
      return "activo";
    }
  };

  const statusColor = (status) => {
    if (status === "active") {
      return "green";
    }
  };

  const onReleaseSubscription = () => {
    setBtnSpinner(true);
    releaseSubscription(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      subscription.id
    ).then(
      (response) => {
        setBtnSpinner(false);
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
        setBtnSpinner(false);
        const errorMessage = error?.response?.data?.errors[0] || [
          "Error al cancelar la actualizacion programada.",
        ];
        alertContainer({
          title: "No se pudo cancelar",
          text: errorMessage,
          icon: "error",
          showConfirmButton: false,
        });
      }
    );
  };

  return (
    <>
      <PageHeader ghost title="Suscripciones" />
      <Main>
        <Row gutter={20}>
          <Col lg={8} xs={8}>
            <Cards headless>
              <div className="d-flex justify-content-between">
                <h5>Detalles</h5>
                {subscription && subscriptionSchedule && (
                  <Button
                    shape={"round"}
                    type={"primary"}
                    onClick={onReleaseSubscription}
                  >
                    {btnSpinner ? (
                      <LoadingOutlined
                        style={{ fontSize: 18, color: "white" }}
                        spin
                      />
                    ) : (
                      `Cancelar Actualizacion`
                    )}
                  </Button>
                )}
                {subscription &&
                  subscription.status === "active" &&
                  !subscription.cancel_at_period_end &&
                  !subscriptionSchedule && (
                    <Button
                      danger={true}
                      shape={"round"}
                      type={"primary"}
                      onClick={onCancelSubscription}
                    >
                      {btnSpinner ? (
                        <LoadingOutlined
                          style={{ fontSize: 18, color: "white" }}
                          spin
                        />
                      ) : (
                        "Cancelar Subscripcion"
                      )}
                    </Button>
                  )}

                {subscription &&
                  subscription.status === "active" &&
                  subscription.cancel_at_period_end &&
                  moment.now() < moment(subscription.current_period_end) &&
                  !subscriptionSchedule && (
                    <Button
                      shape={"round"}
                      disabled={btnSpinner}
                      type={"primary"}
                      onClick={onActiveSubscription}
                    >
                      {btnSpinner ? (
                        <LoadingOutlined
                          style={{ fontSize: 18, color: "white" }}
                          spin
                        />
                      ) : (
                        "Activar Subscripcion"
                      )}
                    </Button>
                  )}
              </div>
              <Divider />
              <div className="couponCode">
                <p className="m-0 p-0">Plan Actual</p>
                <h5>
                  {subscription && subscription.id
                    ? subscription.plan?.name
                    : "N/A"}
                </h5>
              </div>
              <div className="couponCode d-flex">
                <div className="w-50">
                  <p className="m-0 p-0">Dia de Inicio</p>
                  <p className="text-black">
                    {subscription && subscription.id
                      ? moment(subscription.current_period_start).format(
                          "YYYY-MM-DD"
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="w-50">
                  <p className="m-0 p-0">Dia Final</p>
                  <p className="text-black">
                    {subscription && subscription.id
                      ? moment(subscription.current_period_end).format(
                          "YYYY-MM-DD"
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="w-50">
                  <p className="m-0 p-0">Estado</p>
                  {subscription && subscription.id && (
                    <div className="d-flex">
                      <Tag color={statusColor(subscription.status)}>
                        {statusLabel(subscription.status)}
                      </Tag>
                      {subscription.cancel_at_period_end && (
                        <Tag>
                          <ClockCircleOutlined className="align-text-top" />{" "}
                          Cancela el{" "}
                          {moment(subscription.current_period_end)
                            .locale("es-mx")
                            .format("MMM Do")}
                        </Tag>
                      )}
                      {subscriptionSchedule && (
                        <Tag>
                          <ClockCircleOutlined className="align-text-top" />{" "}
                          Actualizacion Programada
                        </Tag>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {subscriptionSchedule && subscription && (
                <div className="mt-2">
                  <p className="m-0 p-0">Actualizacion</p>
                  <p className="text-black">
                    Al finalizar el periodo actual de subscripcion, se hara un
                    cambio de plan{" "}
                    {subscription.plan ? subscription.plan.name : ""} a{" "}
                    {subscriptionSchedule.downgrade_plan?.name}
                  </p>
                </div>
              )}

              <Divider />
              <div className="couponCode">
                <h5>Coupon</h5>
                <div className="d-flex">
                  <Input
                    placeholder="Enter code here"
                    className="marginRight-10 form-control"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button className="height38" onClick={handleCouponApply}>
                    {couponSpinner ? (
                      <LoadingOutlined style={{ fontSize: 16 }} spin />
                    ) : (
                      "Canjear"
                    )}
                  </Button>
                </div>
                {errors.length ? (
                  <>
                    {errors.map((item, index) => {
                      return (
                        <Row className="mt-2" key={index}>
                          <Col md={24}>
                            <div className={"alert alert-danger m-0"}>
                              {item}
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                ) : null}
              </div>
            </Cards>
          </Col>
          <Col lg={16} xs={16}>
            <Cards headless>
              <PaymentList
                spinner={spinner}
                setSpinner={setSpinner}
                paymentCards={paymentCards}
                fetchSubscriptionDetails={fetchSubscriptionDetails}
              />
            </Cards>
          </Col>
        </Row>
        <Divider />
        <PlanView
          subscription={subscription}
          plans={plans}
          resources={paymentCards}
          fetchSubscriptionDetails={fetchSubscriptionDetails}
          subscriptionSchedule={subscriptionSchedule}
        />
      </Main>
    </>
  );
};

export default SubscriptionSettingsContainer;
