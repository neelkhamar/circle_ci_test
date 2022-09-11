import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Col, Row, Spin, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteSCTById, getSCTList } from "../../requests/carta-porte";
import alertContainer from "../../utils/Alert";
import confirmContainer from "../../utils/SwalConfirm";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import SctModal from "../Common/Modals/sctModal";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const SCTContainer = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [selectedSCT, setSelectedSCT] = useState("");

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  const columnsSort = [
    {
      title: "Tipo de permiso SCT",
      dataIndex: "type",
      key: "type",
      render: (_, item) => {
        return (
          <span>
            {item.catalog_sct_type.code + " - " + item.catalog_sct_type.name}
          </span>
        );
      },
    },
    {
      title: "Numero de permiso",
      dataIndex: "number",
      key: "number",
      render: (_, item) => {
        return <span>{item.number}</span>;
      },
    },
    {
      title: "Activo",
      dataIndex: "active",
      key: "active",
      render: (_, item) => {
        return (
          <span>
            <img
              src={item.active ? "/images/right.png" : "/images/wrong.png"}
              width={item.active ? "15px" : "20px"}
            />
          </span>
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
              onClick={() => setSelectedSCT(item.id)}
            />
            <DeleteOutlined
              className="editIcon ml-3 red-color"
              onClick={() => deleteSCT(item.id)}
            />
          </div>
        );
      },
    },
  ];

  const handleCancel = () => {
    setVisible(false);
    setSelectedSCT("");
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const deleteSCT = (id) => {
    confirmContainer(
      "Eliminar SCT",
      `Está seguro de que desea eliminar este SCT?`
    ).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      }
    });
  };

  useEffect(() => {
    if (selectedSCT) {
      setVisible(true);
    }
  }, [selectedSCT]);

  const confirmDelete = (id) => {
    setSpinner(true);
    deleteSCTById(
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
          getSct();
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
      getSct();
    }

    return () => (mounted = false);
  }, []);

  const getSct = () => {
    setSpinner(true);
    getSCTList(
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
    setSelectedSCT("");
    getSct();
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
        title="Permisos SCT"
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
                  <SctModal
                    visible={visible}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                    selectedSCT={selectedSCT}
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

export default SCTContainer;
