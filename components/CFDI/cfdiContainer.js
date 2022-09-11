import { Alert, Button, Col, Modal, Row, Table, Tooltip } from "antd";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Cards } from "../cards/frame/cards-frame";
import { PageHeader } from "../page-headers/page-headers";
// import { Button } from '../buttons/buttons';
import { Main } from "./styled";
// import { getAllFigures } from '../../requests/carta-porte';
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Tabs } from "antd";
import FeatherIcon from "feather-icons-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelCFDI,
  downlodCFDI,
  getAllCDFI,
  getEmittedData,
  getReceivedData,
} from "../../requests/cfdi";
import alertContainer from "../../utils/Alert";
import ReasonModal from "../Common/Modals/cfdiReason";
import RFCModal from "../Common/Modals/rfcModal";
import EmittedForm from "./emittedForm";
import ReceiverForm from "./receiverForm";
import Swal from "sweetalert2";
import {
  getSessionItem,
  removeSessionItem,
  setSessionItem,
} from "../Helper/session";
import { SocketContext } from "../Layouts/layout/socketContext";

const { TabPane } = Tabs;

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const CFDIContainer = () => {
  const socketContext = useContext(SocketContext);
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [receiverSpinner, setReceiverSpinner] = useState(false);
  const [emitter, setEmitters] = useState([]);
  const [receiver, setReceivers] = useState([]);
  const [cfdiData, setCDFIData] = useState([]);
  const [cfdiSpinner, setCfdiSpinner] = useState(false);
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [dataSubmittedReceiver, setDataSubmittedReceiver] = useState(false);
  const [selectedCFDI, setSelectedCFDI] = useState("");
  const [reasonModal, setReasonModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [reason, setReason] = useState(null);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [rfcModal, setRFCModal] = useState(false);
  const [downloadSpinner, setDownloadSpinner] = useState(0);
  const [temporaryData, setTemporaryData] = useState(null);
  const [cancelErrors, setCancelErrors] = useState([]);
  const [showCertWarning, setShowCertWarning] = useState(false);
  const [startSocket, setStartSocket] = useState(false);

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [selectedEmitter, setSelectedEmitter] = useState("");

  const columnSort = [
    {
      title: "RFC Emisor",
      dataIndex: "emitter_rfc",
      key: "emitter_rfc",
    },
    {
      title: "Razon Social Emisor",
      dataIndex: "emitter_reason",
      key: "emitter_reason",
    },
    {
      title: "RFC Receptor",
      dataIndex: "receiver_rfc",
      key: "receiver_rfc",
    },
    {
      title: "Razon Social Receptor",
      dataIndex: "receiver_reason",
      key: "receiver_reason",
    },
    {
      title: "Dia Emitido",
      dataIndex: "emitted_date",
      key: "emitted_date",
    },
    {
      title: "Tipo de Comprobante",
      dataIndex: "effect",
      key: "effect",
    },
  ];

  const constant_variables = {
    tipo: {
      moving: "Traslado",
      incoming: "Ingreso",
    },
    international: {
      no_apply: "No aplica",
      key_a1: "Definitiva clave A1",
      temporary: "Temporal",
      different_key_a1: "Definitiva clave distinta A1",
    },
  };

  const cdfiColumn = [
    {
      title: "Cliente",
      dataIndex: "customer.name",
      key: "customer",
      render: (_, record) => {
        return record.customer.name;
      },
    },
    {
      title: "Tipo",
      dataIndex: "cfdi_type",
      key: "cfdi_type",
      render: (_, record) => {
        return constant_variables.tipo[record.cfdi_type];
      },
    },
    {
      title: "Carta Porte",
      dataIndex: "moving_note",
      key: "moving_note",
      render: (_, record) => {
        return (
          <img
            src={record.freight ? "/images/right.png" : "/images/wrong.png"}
            width={record.freight ? "15px" : "20px"}
          />
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (_, record) => {
        return (
          <Tooltip title={record.status === "is_valid" ? "Valid" : "Canceled"}>
            <img
              src={
                record.status === "is_valid"
                  ? "/images/right.png"
                  : "/images/wrong.png"
              }
              width={record.status === "is_valid" ? "15px" : "20px"}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, record) => {
        return record.total;
      },
    },
    {
      title: "Internacional",
      dataIndex: "international",
      key: "international",
      render: (_, record) => {
        return constant_variables.international[record.export];
      },
    },
    {
      title: "Fecha expedicion",
      dataIndex: "fetch",
      key: "fetch",
      render: (_, record) => {
        return moment(record.date).format("YYYY-MM-DD");
      },
    },
    {
      title: "Accion",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        if (!record.status.includes("canceled")) {
          return (
            <span className="d-flex">
              <Button
                size="middle"
                key="00"
                type="danger"
                className="marginRight1"
                onClick={(e) => cancelHandler(record)}
              >
                Cancelar
              </Button>
              <Button
                size="middle"
                key="8"
                type="primary"
                className="marginLeft1"
                onClick={(e) => download(record.id)}
              >
                {downloadSpinner === record.id ? (
                  <LoadingOutlined
                    style={{ fontSize: 18, color: "white" }}
                    spin
                  />
                ) : (
                  "Descargar"
                )}
              </Button>
            </span>
          );
        } else {
          return (
            <span className="d-flex">
              <span className="red-color marginRight8">
                <b>Cancelada</b>
              </span>
              <Button
                size="middle"
                key="8"
                type="primary"
                className="marginLeft1"
                onClick={(e) => download(record.id)}
              >
                {downloadSpinner === parseInt(record.id) ? (
                  <LoadingOutlined
                    style={{ fontSize: 18, color: "white" }}
                    spin
                  />
                ) : (
                  "Descargar"
                )}
              </Button>
            </span>
          );
        }
      },
    },
  ];

  const cancelHandler = (obj) => {
    setSelectedCFDI(obj.id);
    setReasonModal(true);
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      localStorage.removeItem("selectedCartaPorte");
      fetchCFDI();
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    setShowCertWarning(!currentUser.certsValidated);
  }, [currentUser.certsValidated]);

  const fetchCFDI = () => {
    setCfdiSpinner(true);
    getAllCDFI(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        console.log(response);
        setCfdiSpinner(false);
        response.data.map((val, index) => {
          val["key"] = index;
        });
        setCDFIData(response.data);
      },
      (error) => {
        setCfdiSpinner(false);
      }
    );
  };

  const getEmitterData = (startDate, endDate, statusEmitted, actionEmitted) => {
    let sessionKey = getSessionItem("satSessionKey");
    if (sessionKey) {
      fetchEmitter(
        startDate,
        endDate,
        statusEmitted,
        actionEmitted,
        sessionKey
      );
    } else {
      setTemporaryData({
        startDate,
        endDate,
        statusEmitted,
        actionEmitted,
        type: 1,
      });
      setRFCModal(true);
    }
  };

  const fetchEmitter = (
    startDate,
    endDate,
    statusEmitted,
    actionEmitted,
    sessionKey
  ) => {
    setSpinner(true);
    setDataSubmitted(true);
    setSelectedReceiver(null);
    setSelectedEmitter(null);
    setTemporaryData(null);
    getEmittedData(
      currentUser.client,
      currentUser.accessToken,
      currentUser.uid,
      sessionKey,
      statusEmitted,
      actionEmitted,
      moment(startDate).format("DD/MM/YYYY"),
      moment(endDate).format("DD/MM/YYYY")
    ).then(
      (response) => {
        setSpinner(false);
        if (response.data.data.length > 0) {
          const results = response.data.data.map((row, index) => {
            row["key"] = index;
            row["emitter_reason"] = row.emitter_reason.substr(0, 35);
            row["receiver_reason"] = row.receiver_reason.substr(0, 35);
            return row;
          });
          setEmitters(results);
        }
      },
      (error) => {
        setSpinner(false);
        if (error.response.data.errors.length) {
          error.response.data.errors.map((item) => {
            if (item.includes("Invalid session key")) {
              setTemporaryData({
                startDate,
                endDate,
                statusEmitted,
                actionEmitted,
                type: 1,
              });
              setRFCModal(true);
            }
          });
        }
      }
    );
  };

  const fetchReceiver = (
    year,
    month,
    statusReceived,
    actionEmitted,
    sessionKey
  ) => {
    setReceiverSpinner(true);
    setDataSubmittedReceiver(true);
    setSelectedReceiver(null);
    setSelectedEmitter(null);
    setTemporaryData(null);
    getReceivedData(
      currentUser.client,
      currentUser.accessToken,
      currentUser.uid,
      sessionKey,
      statusReceived,
      actionEmitted,
      year,
      month
    ).then(
      (response) => {
        setReceiverSpinner(false);
        if (response.data.data.length > 0) {
          const results = response.data.data.map((row, index) => {
            row["key"] = index;
            row["emitter_reason"] = row.emitter_reason.substr(0, 35);
            row["receiver_reason"] = row.receiver_reason
              ? row.receiver_reason.substr(0, 35)
              : "";
            return row;
          });
          setReceivers(results);
        }
      },
      (error) => {
        setReceiverSpinner(false);
        if (error.response.data.errors.length) {
          error.response.data.errors.map((item) => {
            if (item.includes("Invalid session key")) {
              setTemporaryData({
                year,
                month,
                statusReceived,
                actionEmitted,
                type: 2,
              });
              setRFCModal(true);
            }
          });
        }
      }
    );
  };

  const getReceiverData = (year, month, statusReceived, actionEmitted) => {
    let sessionKey = getSessionItem("satSessionKey");
    if (sessionKey) {
      fetchReceiver(year, month, statusReceived, actionEmitted, sessionKey);
    } else {
      setTemporaryData({
        startDate,
        endDate,
        statusEmitted,
        actionEmitted,
        type: 2,
      });
      setRFCModal(true);
    }
  };

  function onChange(pagination, filters, sorter, extra) {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  }

  // const receiverRowSelection = {
  //     onChange: (index, val) => {
  //         setSelectedReceiver(val[0]);
  //     },
  //     type:'radio'
  // }

  // const emitterRowSelection = {
  //     onChange: (index, val) => {
  //         setSelectedEmitter(val[0]);
  //     },
  //     type:'radio'
  // }

  const redirectCFDI = (value) => {
    localStorage.setItem("selectedCartaPorte", JSON.stringify(value));
    router.push("/cfdi/carta-porte");
  };

  const handleOpen = (e, ingreso) => {
    router.push(ingreso ? "/cfdi/income" : "/cfdi/moving");
  };

  const handleReasonCancel = () => {
    setSelectedCFDI("");
    setReason(null);
    setReasonModal(false);
    setConfirmModal(false);
    setCancelErrors([]);
  };

  const handleReasonOk = (values) => {
    setReasonModal(false);
    setConfirmModal(true);
    setReason(values);
  };

  const confirmCancel = () => {
    setBtnSpinner(true);
    cancelCFDI(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      selectedCFDI,
      reason
    ).then(
      (response) => {
        setBtnSpinner(false);
        if (response.status === 200) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          handleReasonCancel();
          fetchCFDI();
        }
      },
      (error) => {
        setBtnSpinner(false);
        if (error.response.data.errors.length) {
          setCancelErrors(error.response.data.errors);
        }
      }
    );
  };

  const handleDeleteClose = () => {
    handleReasonCancel();
  };

  const handleRFCHandler = () => {
    setRFCModal(false);
    setStartSocket(true);
  };

  useEffect(() => {
    if (startSocket) {
      Swal.fire({
        title: "Sat process authentication has started.",
        text: "",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      Swal.showLoading();
    }
  }, [startSocket]);

  const handleRFCCancel = () => {
    setTemporaryData(null);
    setRFCModal(false);
  };

  const download = (id) => {
    setDownloadSpinner(id);
    downlodCFDI(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setDownloadSpinner(0);
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
        setDownloadSpinner(0);
        console.log(error);
      }
    );
  };

  const receiveHandler = (data) => {
    Swal.close();
    setStartSocket(false);
    console.log(data);
    if (data && data.sat_session) {
      setSessionItem("satSessionKey", data.sat_session);
      if (temporaryData.type === 1) {
        let { startDate, endDate, statusEmitted, actionEmitted } =
          temporaryData;
        fetchEmitter(
          startDate,
          endDate,
          statusEmitted,
          actionEmitted,
          data.sat_session
        );
      } else {
        let { year, month, statusReceived, actionEmitted } = temporaryData;
        fetchReceiver(
          year,
          month,
          statusReceived,
          actionEmitted,
          data.sat_session
        );
      }
    } else {
      removeSessionItem("satSessionKey");
      alertContainer({
        title: "Error",
        text: data.errors[0],
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <PageHeader
        ghost
        title="CFDI"
        buttons={[
          <Fragment key={"123"}>
            {!showCertWarning && (
              <div className="page-header-actions" key={123}>
                <Button
                  size="small"
                  type="primary"
                  onClick={(e) => handleOpen(e, false)}
                >
                  <FeatherIcon icon="plus" size={14} />
                  CFDI Traslado
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={(e) => handleOpen(e, true)}
                >
                  <FeatherIcon icon="plus" size={14} />
                  CFDI Ingreso
                </Button>
              </div>
            )}
          </Fragment>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: "calc(100vh - 320px)" }}>
                {startSocket && socketContext ? (
                  <>
                    <socketContext.ActionCableConsumer
                      channel={{ channel: "SatAuthenticationChannel" }}
                      onReceived={receiveHandler}
                    />
                  </>
                ) : null}
                {rfcModal ? (
                  <RFCModal
                    visible={rfcModal}
                    handleOk={handleRFCHandler}
                    cfdi={true}
                    handleCancel={handleRFCCancel}
                  />
                ) : null}
                {reasonModal ? (
                  <ReasonModal
                    visible={reasonModal}
                    handleCancel={handleReasonCancel}
                    handleOk={handleReasonOk}
                  />
                ) : null}
                {confirmModal && (
                  <Modal
                    title="Confirm"
                    visible={confirmModal}
                    footer={[
                      <Button
                        onClick={confirmCancel}
                        disabled={btnSpinner}
                        className="bgPurple"
                        key={1}
                      >
                        {btnSpinner ? (
                          <LoadingOutlined
                            style={{ fontSize: 18, color: "white" }}
                            spin
                          />
                        ) : (
                          "Yes"
                        )}
                      </Button>,
                      <Button onClick={handleDeleteClose} key={2}>
                        No
                      </Button>,
                    ]}
                    onCancel={handleDeleteClose}
                  >
                    <p>Está seguro de que desea cancel este CFDI invoice?</p>
                    {cancelErrors.length > 0 ? (
                      <Row>
                        {cancelErrors.map((item, index) => {
                          return (
                            <Col md={24} key={index}>
                              <div className={"alert alert-danger m-0 mt-2"}>
                                {item.message}
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    ) : (
                      <></>
                    )}
                  </Modal>
                )}
                {showCertWarning && (
                  <Row className="ant-row">
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2 mb-3">
                      <Alert
                        className="p-3"
                        message="Necesitas configurar la informacion y certificados de tu empresa para poder crear CFDI"
                        type="error"
                      />
                    </div>
                  </Row>
                )}
                <Tabs
                  defaultActiveKey="1"
                  onChange={(e) => {
                    if (e === "1") {
                      fetchCFDI();
                    }
                  }}
                >
                  <TabPane tab="CFDI" key="1">
                    {cfdiSpinner ? (
                      <div className="text-center pt-4">
                        <Spin indicator={antIcon} />
                      </div>
                    ) : (
                      <Table
                        className="table-responsive mt-4"
                        pagination={{
                          defaultPageSize: 10,
                          total: cfdiData.length,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                        }}
                        columns={cdfiColumn}
                        dataSource={cfdiData}
                        onChange={onChange}
                        rowKey={(record) => record.id}
                      />
                    )}
                  </TabPane>
                  <TabPane tab="CFDI Emitidos SAT" key="2">
                    <EmittedForm
                      selectedEmitter={selectedEmitter}
                      redirectCFDI={redirectCFDI}
                      getEmitterData={getEmitterData}
                      spinner={spinner}
                    />
                    {dataSubmitted ? (
                      <>
                        {spinner ? (
                          <div className="text-center pt-4">
                            <Spin indicator={antIcon} />
                          </div>
                        ) : (
                          <Table
                            // rowSelection={emitterRowSelection}
                            className="table-responsive mt-4"
                            pagination={{
                              defaultPageSize: 10,
                              total: emitter.length,
                              showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            columns={columnSort}
                            dataSource={emitter}
                            onChange={onChange}
                          />
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </TabPane>
                  <TabPane tab="CFDI Recibidos SAT" key="3">
                    <ReceiverForm
                      selectedReceiver={selectedReceiver}
                      redirectCFDI={redirectCFDI}
                      getReceiverData={getReceiverData}
                      spinner={receiverSpinner}
                    />
                    {dataSubmittedReceiver ? (
                      <>
                        {receiverSpinner ? (
                          <div className="text-center pt-4">
                            <Spin indicator={antIcon} />
                          </div>
                        ) : (
                          <Table
                            // rowSelection={receiverRowSelection}
                            className="table-responsive mt-4"
                            pagination={{
                              defaultPageSize: 10,
                              total: receiver.length,
                              showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            columns={columnSort}
                            dataSource={receiver}
                            onChange={onChange}
                          />
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </TabPane>
                </Tabs>
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default CFDIContainer;
