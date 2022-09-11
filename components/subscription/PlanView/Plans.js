import { Col, Row, Tag } from "antd";
import Spinner from "../../../utils/Spinner";
import { Button } from "../../buttons/buttons";
import Heading from "../../heading/heading";
import CouponModal from "./CouponModal";
import { List } from "./PlanItem";
import { Badge, ListGroup, PricingCard } from "./style";

const planBenefitsMuckData = [
  { label: "4 Operadores", visible: true, module: false },
  { label: "2 Vehiculos", visible: true, module: false },
  //{ label: '1 Empresa (Razon Social)', visible: true, module: false },
  //{ label: '1 Usuario', visible: true, module: false },
  { label: "5 Timbres gratuitos por mes", visible: true, module: false },
  { label: "1.93 MXN por CFDI extra", visible: true, module: false },
  { label: "Mapas de Google", visible: true, module: false },
  { label: "Notificaciones", visible: true, module: false },
  { label: "SMS", visible: true, module: false },
  { label: "Procesos Automatizados", visible: true, module: false },
  { label: "Soporte Tecnico", visible: true, module: false },
  { label: "Dashboard", visible: true, module: true },
  { label: "Fletes", visible: true, module: true },
  { label: "Carta Porte", visible: true, module: true },
  { label: "CFDI Ingreso & Traslado 4.0", visible: true, module: true },
  { label: "CFDI Traslado 3.3", visible: true, module: true },
  { label: "CFDIs Externos SAT", visible: true, module: true },
];

const Plans = ({
  plans,
  continueSpinner,
  spinner,
  couponModal,
  handleOk,
  planSelected,
  currentSubscriptionPlan,
  handleCancel,
  subscriptionSchedule,
}) => {
  const intervalLabel = (interval) => {
    if (interval == "month") {
      return "mes";
    }
  };

  return (
    <Row
      gutter={!planSelected ? 0 : 25}
      className={!planSelected ? `d-flex justify-content-between` : ""}
    >
      {plans.map((plan, index) => {
        const { name, currency, amount, interval, interval_count, color, id } =
          plan;
        return (
          <Col key={index} xxl={6} lg={8} sm={12} xs={24}>
            <Spinner visible={spinner ? true : false} />
            {couponModal && (
              <CouponModal
                visible={couponModal}
                handleCancel={handleCancel}
                handleOk={handleOk}
                continueSpinner={continueSpinner}
              />
            )}
            <PricingCard style={{ marginBottom: 30 }} key={`plan-${index}`}>
              <Badge
                className="pricing-badge text-white"
                style={{ backgroundColor: color }}
              >
                {name}
              </Badge>
              {currentSubscriptionPlan && currentSubscriptionPlan.id === id && (
                <Tag color={"green"} className="float-end">
                  Actual
                </Tag>
              )}
              {subscriptionSchedule &&
                subscriptionSchedule?.attributes?.downgrade_plan.id === id && (
                  <Tag color={"default"} className="float-end">
                    Proximamente
                  </Tag>
                )}
              <Heading className="price-amount" as="h3">
                <sup className="currency">$</sup>
                {parseInt(amount)}&nbsp;
                <sub className="pricing-validity">
                  <strong className="text-uppercase">{currency}</strong>{" "}
                  {interval_count > 1 ? interval_count : "por"}{" "}
                  {intervalLabel(interval)}
                </sub>
              </Heading>
              <ListGroup>
                {plan.plan_benefits.map((val, index) => {
                  return <List text={val.title} key={index} />;
                })}
              </ListGroup>
              {planSelected ? (
                currentSubscriptionPlan && currentSubscriptionPlan.id ? (
                  currentSubscriptionPlan.id === id ? (
                    <Button size="default" type="white" disabled={true}>
                      Plan Actual
                    </Button>
                  ) : parseInt(currentSubscriptionPlan.amount) >
                    parseInt(amount) ? (
                    <Button
                      size="default"
                      className="text-white"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        planSelected({
                          plan: plan,
                          update: true,
                          downgrade: true,
                        })
                      }
                      disabled={spinner}
                    >
                      Degradar
                    </Button>
                  ) : (
                    <Button
                      size="default"
                      className="text-white"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        planSelected({ plan: plan, update: true })
                      }
                      disabled={spinner}
                    >
                      Actualizar
                    </Button>
                  )
                ) : (
                  <Button
                    size="default"
                    className="text-white"
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      planSelected({ plan: plan.attributes, update: false })
                    }
                  >
                    Suscribirse
                  </Button>
                )
              ) : (
                ""
              )}
            </PricingCard>
          </Col>
        );
      })}
    </Row>
  );
};

export default Plans;
