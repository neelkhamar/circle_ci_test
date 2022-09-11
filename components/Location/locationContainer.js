import { Col, Row, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";
// import { Spin } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { deleteLocation, fetchAddress } from "../../requests/carta-porte";
import alertContainer from "../../utils/Alert";
import LocationModal from "../Common/Modals/locationModal";
import confirmContainer from "../../utils/SwalConfirm";

const LocationContainer = ({ message }) => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [selected, setSelected] = useState("");
  const [data, setData] = useState([]);
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getSavedLocation();
    }

    return () => (mounted = false);
  }, []);

  const getSavedLocation = () => {
    setSpinner(true);
    fetchAddress(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          response.data.map((item, index) => {
            item["key"] = index;
          });
          setData(response.data);
        }
      },
      (err) => {
        setSpinner(false);
      }
    );
  };

  const columns = [
    {
      title: "Calle",
      key: "street",
      render: (_, item) => {
        return <>{item.street}</>;
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
      render: (_, item) => {
        return (
          <div className="d-flex">
            <EditOutlined
              className="editIcon mr-3"
              onClick={(e) => clickHandler(e, item.id)}
            />
            {!item.has_freights ? (
              <DeleteOutlined
                className="editIcon ml-3 red-color"
                onClick={() => handleModalOpen(item.id)}
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (selected) {
      handleOpen();
    }
  }, [selected]);

  const handleModalOpen = (value) => {
    confirmContainer(
      "Eliminar Ubicaciones",
      `Está seguro de que desea eliminar esta ubicación?`
    ).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSubmit(value);
      }
    });
  };

  const clickHandler = (e, val) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(val);
  };

  const handleOpen = (e) => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelected("");
  };

  const handleOk = () => {
    setVisible(false);
    setSelected("");
    getSavedLocation();
  };

  const handleDeleteSubmit = (id) => {
    setSpinner(true);
    deleteLocation(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          console.log(response);
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          getSavedLocation();
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
        title="Ubicaciones"
        buttons={[
          <Button size="small" key="4" type="primary" onClick={handleOpen}>
            <FeatherIcon icon="plus" size={14} />
            Nuevo
          </Button>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: "calc(100vh - 320px)" }}>
                {visible && (
                  <LocationModal
                    visible={visible}
                    selected={selected}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                  />
                )}
                {spinner ? (
                  <div className="text-center pt-4">
                    <LoadingOutlined
                      style={{ fontSize: 30, color: "blue" }}
                      spin
                    />
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
                    columns={columns}
                    dataSource={data}
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

export default LocationContainer;
