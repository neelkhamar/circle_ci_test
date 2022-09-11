import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Alert, Spin, Table, Tooltip } from "antd";
import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import {
  cloneFleteById,
  deleteFleteById,
  downloadFleteById,
  getAllFlete,
} from "../../requests/flete";
import alertContainer from "../../utils/Alert";
import confirmContainer from "../../utils/SwalConfirm";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";

const FleteIndex = () => {
  const router = useRouter();
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [checkedFlete, setCheckedFlete] = useState(0);
  const [deleteSpinner, setDeleteSpinner] = useState(0);
  const [showCertWarning, setShowCertWarning] = useState(false);
  const tipoOptions = {
    1: "Autotransporte Federal",
    2: "Transporte Maritimo",
    3: "Transporte Aereo",
    4: "Transporte Ferroviario",
    5: "Ducto",
  };

  const routeDetail = () => {
    router.push("/freights/create");
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const cloneFlete = (id) => {
    confirmContainer("Clon Flete", `Estas seguro de clonar el flete?`).then(
      (result) => {
        if (result.isConfirmed) {
          confirmClone(id);
        }
      }
    );
  };

  useEffect(() => {
    setShowCertWarning(!currentUser.certsValidated);
  }, [currentUser.certsValidated]);

  const confirmClone = (id) => {
    setSpinner(true);
    cloneFleteById(
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
          getFleteListing();
        }
      },
      (error) => {
        setSpinner(false);
        console.log(error);
      }
    );
  };

  const downloadPDF = (id) => {
    setDeleteSpinner(id);
    downloadFleteById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setDeleteSpinner(0);
        var blob = new Blob([response.data], { type: "application/pdf" });
        var url = window.URL.createObjectURL(blob) + "#view=FitW";
        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // window.open(url)
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "download.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      },
      (error) => {
        setDeleteSpinner(0);
      }
    );
  };

  const columnsSort = [
    {
      title: "Seleccionar",
      dataIndex: "select",
      render: (_, record, index) => {
        return (
          <input
            type="radio"
            name={record.id}
            key={index}
            className="flete-selection"
            onChange={(e) => setCheckedFlete(e.target.value)}
            checked={record.id === checkedFlete}
            value={record.id}
          />
        );
      },
    },
    {
      title: "Cliente",
      dataIndex: "client",
      render: (_, record) => {
        return <>{record.customer.name}</>;
      },
    },
    {
      title: "Tipo Carta Porte",
      dataIndex: "tipo",
      render: (_, record) => {
        return <>{tipoOptions[record.note_type]}</>;
      },
    },
    {
      title: "Moneda",
      dataIndex: "currency",
      render: (_, record) => {
        return <>{record.catalog_currency.code}</>;
      },
    },
    {
      title: "Translado Internacional",
      dataIndex: "international",
      render: (_, record) => {
        return (
          <span>
            <img
              src={
                record.international_flag
                  ? "/images/right.png"
                  : "/images/wrong.png"
              }
              width={record.international_flag ? "15px" : "20px"}
            />
          </span>
        );
      },
    },
    {
      title: "Figura",
      dataIndex: "figura",
      render: (_, record) => {
        return record.freight_figures.map((item, index) => {
          if (item.figure.kind === "operator") {
            return (
              <span key={index}>
                {item.figure.name + " " + item.figure.last_name}
              </span>
            );
          }
        });
      },
    },
    {
      title: "Vehiculo",
      dataIndex: "vehicle",
      render: (_, record) => {
        return <>{record.vehicle.brand + " - " + record.vehicle.model}</>;
      },
    },
    {
      title: "Timbrado",
      dataIndex: "cfdi",
      key: "cfdi",
      render: (_, record) => {
        return (
          <img
            src={record.cfdi ? "/images/right.png" : "/images/wrong.png"}
            width={record.cfdi ? "15px" : "20px"}
          />
        );
      },
    },
    {
      title: "Accion",
      dataIndex: "action",
      render: (_, item) => {
        return (
          <div>
            <Tooltip title="Edit">
              <EditOutlined
                className="editIcon mr-3"
                onClick={() => router.push("/freights/edit/" + item.id)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <DeleteOutlined
                className="editIcon ml-3 mr-3 red-color"
                onClick={() => deleteFlete(item.id)}
              />
            </Tooltip>
            <Tooltip title="Clone">
              <CopyOutlined
                className="editIcon ml-3 mr-3"
                onClick={() => cloneFlete(item.id)}
              />
            </Tooltip>
            {deleteSpinner && deleteSpinner === item.id ? (
              <LoadingOutlined style={{ fontSize: 20 }} spin />
            ) : (
              <Tooltip title="Download">
                <DownloadOutlined
                  className="editIcon ml-3"
                  onClick={() => downloadPDF(item.id)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const confirmDelete = (id) => {
    setSpinner(true);
    deleteFleteById(
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
          getFleteListing();
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const deleteFlete = (id) => {
    confirmContainer(
      "Eliminar Flete",
      `Está seguro de que desea eliminar este flete?`
    ).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getFleteListing();
    }

    return () => (mounted = false);
  }, []);

  const getFleteListing = () => {
    setSpinner(true);
    getAllFlete(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          setData(response.data);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const extractPDF = (e) => {
    window.open(window.location.href + "preview/" + checkedFlete, "_blank");
  };

  const cfdiHandler = (e) => {
    router.push(`/cfdi/moving/${checkedFlete}/create?backUrl=freights`);
  };

  return (
    <>
      <PageHeader
        ghost
        title="Fletes"
        buttons={
          showCertWarning
            ? [
                <div key="6" className="page-header-actions">
                  <Button
                    size="small"
                    key="10"
                    className={checkedFlete ? "normalBtn" : "disabledNavBtn"}
                    disabled={checkedFlete === 0}
                    onClick={extractPDF}
                  >
                    <FeatherIcon icon="file-text" size={14} />
                    Documento PDF
                  </Button>
                  <Button
                    size="small"
                    key="4"
                    type="primary"
                    onClick={routeDetail}
                  >
                    <FeatherIcon icon="plus" size={14} />
                    Nuevo
                  </Button>
                </div>,
              ]
            : [
                <div key="6" className="page-header-actions">
                  <Button
                    size="small"
                    key="11"
                    className={checkedFlete ? "normalBtn" : "disabledNavBtn"}
                    disabled={checkedFlete === 0}
                    onClick={cfdiHandler}
                  >
                    <FeatherIcon icon="file-text" size={14} />
                    CFDI Translado
                  </Button>
                  <Button
                    size="small"
                    key="12"
                    className={checkedFlete ? "normalBtn" : "disabledNavBtn"}
                    disabled={checkedFlete === 0}
                    onClick={extractPDF}
                  >
                    <FeatherIcon icon="file-text" size={14} />
                    Documento PDF
                  </Button>
                  <Button
                    size="small"
                    key="14"
                    type="primary"
                    onClick={routeDetail}
                  >
                    <FeatherIcon icon="plus" size={14} />
                    Nuevo
                  </Button>
                </div>,
              ]
        }
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: "calc(100vh - 320px)" }}>
                {spinner ? (
                  <div className="text-center pt-4">
                    <Spin indicator={antIcon} />
                  </div>
                ) : (
                  <>
                    {showCertWarning && (
                      <Row className="ant-row">
                        <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2 mb-3">
                          <Alert
                            className="p-3"
                            message="Necesitas configurar la informacion y certificados de tu empresa para poder timbrar CFDI con complemento Carta Porte"
                            type="error"
                          />
                        </div>
                      </Row>
                    )}
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
                      // onChange={onChange}
                    />
                  </>
                )}
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default FleteIndex;
