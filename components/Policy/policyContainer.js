import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Col, Row, Spin, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deletePolicyById, getPolicyList } from "../../requests/carta-porte";
import alertContainer from "../../utils/Alert";
import confirmContainer from "../../utils/SwalConfirm";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import PolicyModal from "../Common/Modals/policyModal";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const PolicyContainer = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState("");

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  const policyTypes = {
    1: "Seguro de Mercancias",
    2: "Seguro Daño Ambiental",
  };

  const columnsSort = [
    {
      title: "Aseguradora",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Numero de poliza",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Tipo de seguro",
      dataIndex: "insurance_type",
      key: "insurance_type",
      render: (_, record) => {
        return <span>{policyTypes[record.insurance_type]}</span>;
      },
    },
    {
      title: "Activo",
      dataIndex: "active",
      key: "active",
      render: (_, item) => {
        return (
          <img
            src={item.active ? "/images/right.png" : "/images/wrong.png"}
            width={item.active ? "15px" : "20px"}
          />
        );
      },
    },
    {
      title: "Accion",
      dataIndex: "action",
      key: "action",
      render: (_, item) => {
        return (
          <div>
            <EditOutlined
              className="editIcon mr-3"
              onClick={() => setSelectedPolicy(item.id)}
            />
            <DeleteOutlined
              className="editIcon ml-3 red-color"
              onClick={() => deletePolicy(item.id)}
            />
          </div>
        );
      },
    },
  ];

  const handleCancel = () => {
    setVisible(false);
    setSelectedPolicy("");
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const deletePolicy = (id) => {
    confirmContainer(
      "Eliminar Polizas",
      `Está seguro de que desea eliminar este Polizas?`
    ).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      }
    });
  };

  const confirmDelete = (id) => {
    setSpinner(true);
    deletePolicyById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data.message) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          getPolicy();
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getPolicy();
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (selectedPolicy) {
      setVisible(true);
    }
  }, [selectedPolicy]);

  const getPolicy = () => {
    setSpinner(true);
    getPolicyList(
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
    setSelectedPolicy("");
    getPolicy();
  };

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
  };

  function onChange(pagination, filters, sorter, extra) {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  }

  return (
    <>
      <PageHeader
        ghost
        title="Polizas de seguros"
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
                  <PolicyModal
                    visible={visible}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                    selectedPolicy={selectedPolicy}
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

export default PolicyContainer;
