import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { Cards } from "../../../cards/frame/cards-frame";
import PaymentCardItemWrapper, { Figure2 } from "./style";

const PaymentCardItem = ({ card = {}, onDelete, onEdit }) => {
  return (
    <Badge.Ribbon
      text={card.default_source ? "Primaria" : "Secundaria"}
      placement="start"
      color={card.default_source ? "blue" : "pink"}
    >
      <PaymentCardItemWrapper>
        <Cards
          className="mb-70"
          bodyStyle={{ background: "#12C49A", borderRadius: "10px" }}
          headless
        >
          <Figure2>
            <div className="card-top">
              <div className="card-brand">{card.brand}</div>
            </div>
            <div className="card-middle">
              <div className="card-chip">
                <svg
                  width="51"
                  height="46"
                  viewBox="0 0 51 45"
                  className="CardGraphic__chip"
                >
                  <defs>
                    <linearGradient
                      id="chip-gradient"
                      y1="40%"
                      y2="58%"
                      data-js-target="CardGraphic.chipGradient"
                    >
                      <stop offset="0%" stopColor="#FFF"></stop>
                      <stop offset="18%" stopColor="#CFCFCF"></stop>
                      <stop offset="50%" stopColor="#FAFCFF"></stop>
                      <stop offset="68%" stopColor="#CFCFCF"></stop>
                      <stop offset="100%" stopColor="#FFF"></stop>
                    </linearGradient>
                    <mask id="chip-mask">
                      <path
                        d="M12 36v9H7.7c-2.68 0-3.65-.28-4.63-.8A5.45 5.45 0 0 1 .8 41.93c-.52-.98-.8-1.95-.8-4.62V36h12zm21.07-6a7 7 0 0 0 4.68 5.63l.25.08V45H13v-9.29a7.01 7.01 0 0 0 4.89-5.45l.04-.26h15.14zM51 36v1.3c0 2.68-.28 3.65-.8 4.63a5.45 5.45 0 0 1-2.27 2.27c-.98.52-1.95.8-4.62.8H39v-9h12zm0-13v12H40a6 6 0 0 1-6-6v-6h17zm-34 0v6a6 6 0 0 1-5.78 6H0V23h17zm16-7v13H18V16h15zm18-6v12H34v-6a6 6 0 0 1 5.78-6H51zm-40 0a6 6 0 0 1 6 6v6H0V10h11zM38 0v9.29A7 7 0 0 0 33.07 15H17.93A7 7 0 0 0 13 9.29V0h25zm5.3 0c2.68 0 3.65.28 4.63.8a5.45 5.45 0 0 1 2.27 2.27c.52.98.8 1.95.8 4.62V9H39V0h4.3zM12 0v9H0V7.7c0-2.68.28-3.65.8-4.63A5.45 5.45 0 0 1 3.07.8C4.05.28 5.02 0 7.69 0H12z"
                        fill="#fff"
                      ></path>
                    </mask>
                  </defs>

                  <rect
                    x="0"
                    y="0"
                    width="51"
                    height="45"
                    fill="#828396"
                    rx="6"
                  ></rect>
                  <rect
                    x="-51"
                    y="-45"
                    width="102"
                    height="98"
                    fill="url(#chip-gradient)"
                    mask="url(#chip-mask)"
                    data-js-target="CardGraphic.chip"
                  ></rect>
                </svg>
              </div>
              <div className="card-number">
                <span>****</span>
                <span>****</span>
                <span>****</span>
                <span>{card.last4}</span>
              </div>
            </div>
            <div className="card-bottom">
              <div className="card-expire-at">
                <div className="expire-at-text">Dia de Expiracion</div>
                <div>
                  {card.exp_year}-{card.exp_month}
                </div>
              </div>
              <div className="card-actions">
                <EditOutlined
                  className="icon-btn"
                  onClick={() => onEdit(card)}
                />
                <DeleteOutlined
                  className="icon-btn"
                  onClick={() => onDelete(card)}
                />
              </div>
            </div>
          </Figure2>
        </Cards>
      </PaymentCardItemWrapper>
    </Badge.Ribbon>
  );
};

export default PaymentCardItem;
