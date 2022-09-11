import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Col, Row, Spin, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteVehicle, getVehicles } from "../../requests/carta-porte";
import alertContainer from "../../utils/Alert";
import confirmContainer from "../../utils/SwalConfirm";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import VehicleModal from "../Common/Modals/vehicleModal";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const VehicleContainer = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  useEffect(() => {
    if (selectedVehicle) {
      setVisible(true);
    }
  }, [selectedVehicle]);

  const columnsSort = [
    {
      title: "Marca",
      dataIndex: "brand",
      key: "marca",
      render: (_, item) => {
        return <span data-testid="vehicle-line-item">{item.brand}</span>;
      },
    },
    {
      title: "Modelo",
      dataIndex: "model",
      key: "modelo",
      render: (_, item) => {
        return <span>{item.model}</span>;
      },
    },
    {
      title: "Año",
      dataIndex: "year",
      key: "ano",
      render: (_, item) => {
        return <span>{item.year}</span>;
      },
    },
    {
      title: "Numero de identificacion Vehicular",
      dataIndex: "serie_number",
      key: "numero_de_vehicular",
      render: (_, item) => {
        return <span>{item.serie_number}</span>;
      },
    },
    {
      title: "Tipo de vehiculo",
      dataIndex: "tipo",
      key: "tipo",
      render: (_, item) => {
        return (
          <span>
            {item.catalog_vehicle_type.code +
              " - " +
              item.catalog_vehicle_type.name}
          </span>
        );
      },
    },
    {
      title: "Placa",
      dataIndex: "license_plate",
      key: "placa",
      render: (_, item) => {
        return <span>{item.license_plate}</span>;
      },
    },
    {
      title: "Accion",
      dataIndex: "numero_de_puertas",
      render: (_, item) => {
        return (
          <div className="d-flex" data-testid={`action-container-${item.id}`}>
            <EditOutlined
              data-testid={`edit-icon-${item.id}`}
              className="editIcon mr-3"
              onClick={() => setSelectedVehicle(item.id)}
            />
            {!item.has_freights ? (
              <DeleteOutlined
                data-testid={`delete-icon-${item.id}`}
                className="editIcon ml-3 red-color"
                onClick={() => handleModalOpen(item.id)}
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
      key: "numero_de_puertas",
    },
  ];

  const handleCancel = () => {
    setVisible(false);
    setSelectedVehicle(0);
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchVehicles();
    }

    return () => (mounted = false);
  }, []);

  const fetchVehicles = () => {
    setSpinner(true);
    getVehicles(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        const results = response.data.map((row, index) => {
          row["key"] = index;
          return row;
        });
        setData(results);
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleOk = () => {
    setVisible(false);
    setSelectedVehicle(0);
    fetchVehicles();
  };

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
  };

  function onChange(pagination, filters, sorter, extra) {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  }

  const confirmDelete = (id) => {
    setSpinner(true);
    deleteVehicle(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 204) {
          alertContainer({
            title: "El vehículo fue eliminado con éxito",
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          fetchVehicles();
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleModalOpen = (value) => {
    confirmContainer(
      "Eliminar Vehiculos",
      `Estás segura de que quieres eliminar este vehículo?`
    ).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(value);
      }
    });
  };

  return (
    <>
      <PageHeader
        ghost
        title="Vehiculos"
        buttons={[
          <div key="6" className="page-header-actions">
            <Button
              size="small"
              key="4"
              data-testid="create-vehicle"
              type="primary"
              onClick={handleOpen}
            >
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
                  <VehicleModal
                    visible={visible}
                    selectedVehicle={selectedVehicle}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                  />
                )}
                {spinner ? (
                  <div
                    className="text-center pt-4"
                    data-testid="fetch-data-spinner"
                  >
                    <Spin indicator={antIcon} />
                  </div>
                ) : (
                  <Table
                    className="table-responsive"
                    data-testid="vehicle-table"
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

export default VehicleContainer;
