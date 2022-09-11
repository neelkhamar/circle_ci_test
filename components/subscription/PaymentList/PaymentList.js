import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import FeatherIcon from "feather-icons-react";
import { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useSelector } from "react-redux";
import { deletePaymentCard } from "../../../requests/payment-methods";
import alertContainer from "../../../utils/Alert";
import confirmContainer from "../../../utils/SwalConfirm";
import CardItem from "./CardItem/CardItem";
import PaymentCardModal from "./CardModal";
import PaymentListWrapper from "./style";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const PaymentList = ({
  paymentCards,
  fetchSubscriptionDetails,
  spinner,
  setSpinner,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const handleOk = () => {
    setVisible(false);
    fetchSubscriptionDetails();
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedCard(null);
  };

  const handleOpen = (e) => {
    setVisible(true);
  };

  const onCardEditClick = (item) => {
    setVisible(true);
    setSelectedCard(item);
  };

  const onCardDeleteClick = (item) => {
    confirmContainer(
      `Eliminar Tarjeta - terminacion ${item.last4}`,
      `Estas seguro de eliminar querer eliminar la tarjeta?`
    ).then((result) => {
      if (result.isConfirmed) {
        handleCardDelete(item.id);
      }
    });
  };

  const handleCardDelete = async (id) => {
    setSpinner(true);
    try {
      const response = await deletePaymentCard(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      );
      alertContainer({
        title: response.data.message,
        text: "",
        icon: "success",
        showConfirmButton: false,
      });
      fetchSubscriptionDetails();
    } catch (e) {
      console.log(e);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <PaymentListWrapper>
      {visible && (
        <PaymentCardModal
          visible={visible}
          selectedCard={selectedCard}
          handleCancel={handleCancel}
          handleOk={handleOk}
        />
      )}
      <div className="d-flex align-items-center justify-content-between">
        <h5>Tarjetas</h5>
        <Button type="primary" onClick={handleOpen}>
          <FeatherIcon icon="plus" size={14} />
          Agregar
        </Button>
      </div>
      <div className="paymentMethod mt-3">
        <Scrollbars autoHeight autoHeightMin={260}>
          <div className="d-flex">
            {spinner ? (
              <div className="text-center pt-4">
                <Spin indicator={antIcon} />
              </div>
            ) : (
              paymentCards.map((paymentCard, index) => (
                <CardItem
                  card={paymentCard}
                  key={`payment-card-${index}`}
                  onEdit={onCardEditClick}
                  onDelete={onCardDeleteClick}
                />
              ))
            )}
          </div>
        </Scrollbars>
      </div>
    </PaymentListWrapper>
  );
};

export default PaymentList;
