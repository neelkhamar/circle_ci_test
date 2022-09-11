import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Col, Row, Spin, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteCustomers, getCustomers } from "../../requests/cliente";
import alertContainer from "../../utils/Alert";
import confirmContainer from "../../utils/SwalConfirm";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import ClientModal from "../Common/Modals/clientModal";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";

const ClientContainer = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const columnsSort = [
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
      render: (_, record) => {
        return <>{record.rfc}</>;
      },
    },
    {
      title: "Razon social",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <>{record.name}</>;
      },
    },
    {
      title: "Tax Regime",
      key: "tax_regime",
      render: (_, item) => {
        return (
          <>
            {item.tax_regimes.length ? (
              <>
                {
                  item.tax_regimes[item.tax_regimes.length - 1]
                    .catalog_tax_regime.name
                }
              </>
            ) : (
              "--"
            )}
          </>
        );
      },
    },
    {
      title: "Colonia",
      key: "colony",
      render: (_, item) => {
        return <>{item.catalog_colony.name}</>;
      },
    },
    {
      title: "Código postal",
      key: "postalCode",
      render: (_, item) => {
        return <>{item.catalog_colony.catalog_postal_code.name}</>;
      },
    },
    {
      title: "Ciudad",
      key: "city",
      render: (_, item) => {
        return (
          <>
            {item.catalog_colony.catalog_postal_code.catalog_municipality.name}
          </>
        );
      },
    },
    {
      title: "Estado",
      key: "state",
      render: (_, item) => {
        return (
          <>
            {
              item.catalog_colony.catalog_postal_code.catalog_municipality
                .catalog_state.name
            }
          </>
        );
      },
    },
    {
      title: "Pais",
      key: "country",
      render: (_, item) => {
        return (
          <>
            {
              item.catalog_colony.catalog_postal_code.catalog_municipality
                .catalog_state.catalog_country.name
            }
          </>
        );
      },
    },
    {
      title: "Accion",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="d-flex">
            <EditOutlined
              className="editIcon mr-3"
              onClick={() => setSelectedCustomer(record.id)}
            />
            {!record.has_freights ? (
              <DeleteOutlined
                className="editIcon ml-3 red-color"
                onClick={() => handleDeleteOpen(record.id)}
              />
            ) : null}
          </div>
        );
      },
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  }

  const handleDeleteOpen = (id) => {
    confirmContainer(
      "Eliminar Cliente",
      `Estás segura de que quieres eliminar esta cliente?`
    ).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSubmit(id);
      }
    });
  };

  const handleCancel = () => {
    setSelectedCustomer("");
    setVisible(false);
  };

  const handleOk = () => {
    setSelectedCustomer("");
    setVisible(false);
    fetchCustomers();
  };

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    if (selectedCustomer) {
      setVisible(true);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchCustomers();
    }

    return () => (mounted = false);
  }, []);

  const fetchCustomers = () => {
    setSpinner(true);
    getCustomers(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          response.data.map((item, index) => {
            item["key"] = index;
          });
          setData(response.data);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleDeleteSubmit = (id) => {
    setSpinner(true);
    deleteCustomers(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          fetchCustomers();
        }
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
        title="Clientes"
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
                  <ClientModal
                    visible={visible}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                    selectedCustomer={selectedCustomer}
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
                    onChange={onChange}
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

export default ClientContainer;
