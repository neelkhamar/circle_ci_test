import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Col, Row, Spin, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteFigure, getAllFigures } from "../../requests/carta-porte";
import alertContainer from "../../utils/Alert";
import confirmContainer from "../../utils/SwalConfirm";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import EntityModal from "../Common/Modals/entity/entityModal";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";
import moment from "moment";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const EntityContainer = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState("");
  const [data, setData] = useState([]);

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  const columnsSort = [
    {
      title: "CURP",
      dataIndex: "curp",
      key: "curp",
    },
    {
      title: "Nombres",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Apellido Paterno",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Apellido Materno",
      dataIndex: "second_last_name",
      key: "second_last_name",
    },
    {
      title: "Sexo",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Fecha de nacimiento",
      dataIndex: "birthday",
      key: "birthday",
      render: (_, record) => {
        return <>{moment(record.birthday).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Tipo",
      dataIndex: "kind",
      key: "kind",
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
              onClick={() => {
                setSelectedFigure(record.id);
              }}
            />
            {!record.has_freights ? (
              <DeleteOutlined
                className="editIcon ml-3 red-color"
                onClick={() => handleDeleteOpen(record.id)}
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];

  const handleCancel = () => {
    setVisible(false);
    setSelectedFigure("");
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getFigures();
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (selectedFigure) {
      setVisible(true);
    }
  }, [selectedFigure]);

  const getFigures = () => {
    setSpinner(true);
    getAllFigures(
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
    setSelectedFigure("");
    getFigures();
  };

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
  };

  function onChange(pagination, filters, sorter, extra) {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  }

  const handleDeleteSubmit = (id) => {
    setSpinner(true);
    deleteFigure(
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
          getFigures();
        }
      },
      (error) => {
        alertContainer({
          title:
            error.response.data.message || "Something went wrong. Try again",
          text: "",
          icon: "error",
          showConfirmButton: false,
        });
        setSpinner(false);
      }
    );
  };

  const handleDeleteOpen = async (id) => {
    confirmContainer(
      "Eliminar Figuras",
      `Estás segura de que quieres eliminar esta figura?`
    ).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSubmit(id);
      }
    });
  };

  return (
    <>
      <PageHeader
        ghost
        title="Figuras"
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
                  <EntityModal
                    visible={visible}
                    selectedFigure={selectedFigure}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
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

export default EntityContainer;
