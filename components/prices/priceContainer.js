import React, { useEffect, useState } from "react";
import { Row, Col, Table, Tag, Modal } from "antd";
import { PageHeader } from "../page-headers/page-headers";
import { Cards } from "../cards/frame/cards-frame";
import { getAllPrices } from "../../requests/price";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import {
  LoadingOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button } from "../buttons/buttons";
import FeatherIcon from "feather-icons-react";
import { Main } from "./styled";
import PriceModal from "../Common/Modals/priceModal";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const PriceContainer = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [data, setData] = useState([]);
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const columnsSort = [
    {
      title: "Plan",
      key: "plan",
      render: (_, item) => {
        return <>{item.attributes.plan.name}</>;
      },
    },
    {
      title: "Nombre",
      key: "name",
      render: (_, item) => {
        return <>{item.attributes.name}</>;
      },
    },
    {
      title: "Precio",
      key: "unit_amount",
      render: (_, item) => {
        return <>{item.attributes.unit_amount}</>;
      },
    },
    {
      title: "Moneda",
      key: "currency",
      render: (_, item) => {
        return <>{item.attributes.currency}</>;
      },
    },
    {
      title: "Activo",
      key: "active",
      render: (_, item) => {
        return (
          <img
            src={
              item.attributes.active ? "/images/right.png" : "/images/wrong.png"
            }
            width={item.attributes.active ? "15px" : "20px"}
          />
        );
      },
    },
    {
      title: "Accion",
      key: "action",
      render: (_, item) => {
        return (
          <div className="d-flex">
            <EditOutlined
              className="editIcon mr-3"
              onClick={() => setSelectedPrice(item.attributes.id)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchPrices();
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (selectedPrice) {
      setVisible(true);
    }
  }, [selectedPrice]);

  const handleOpen = (e) => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedPrice("");
  };

  const handleOk = () => {
    setVisible(false);
    setSelectedPrice("");
    fetchPrices();
  };

  const fetchPrices = () => {
    setSpinner(true);
    getAllPrices(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        console.log(response);
        setSpinner(false);
        setData(response.data.data);
      },
      (error) => {
        setSpinner(false);
      }
    );
  };
  return (
    <>
      <PageHeader
        ghost
        title="Precios"
        buttons={[
          <div key="6" className="page-header-actions">
            <Button size="small" key="4" type="primary" onClick={handleOpen}>
              <FeatherIcon icon="plus" size={14} />
              Nuevo
            </Button>
          </div>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: "calc(100vh - 320px)" }}>
                {visible && (
                  <PriceModal
                    visible={visible}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                    selectedPrice={selectedPrice}
                  />
                )}
                {spinner ? (
                  <div className="text-center pt-4">
                    <Spin indicator={antIcon} />
                  </div>
                ) : (
                  <Table
                    className="table-responsive"
                    pagination={{
                      defaultPageSize: 10,
                      total: data.length,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    columns={columnsSort}
                    dataSource={data}
                    rowKey={(record) => record.id}
                  />
                )}
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default PriceContainer;
