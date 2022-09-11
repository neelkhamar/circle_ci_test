import { Avatar, Button, List, Modal, Row, Skeleton, Switch } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "reactstrap";
import { downloadExcelFile } from "../../../requests/flete";
import { LoadingOutlined } from "@ant-design/icons";

function UploadModal(props) {
  const {
    visible,
    handleOk,
    handleCancel,
    sectionValue,
    uploadFile,
    uploadExcelLoader,
    uploadError,
  } = props;
  const [file, setFile] = useState(null);
  const [required, setRequired] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const options = {
    name: "file",
    multiple: false,
    defaultFileList: [],
    accept:
      sectionValue === 1
        ? ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        : "text/xml",
    onChange: (info) => {
      const { status } = info.file;
      if (status === "done" || status === "error") {
        setFile(info.file.originFileObj);
      }
      //   if (status === 'done') {
      //     console.log(info.file);
      //   } else if (status === 'error') {
      //     console.log("error")
      //   }
    },
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const downloadFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDownloadLoader(true);
    downloadExcelFile(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      required
    ).then(
      (response) => {
        setDownloadLoader(false);
        var blob = new Blob([response.data], { type: "application/pdf" });
        var url = window.URL.createObjectURL(blob) + "#view=FitW";
        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // window.open(url)
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "download.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
      },
      (error) => {
        setDownloadLoader(false);
        alertContainer({
          title: error.response.data.message,
          text: "",
          icon: "error",
          showConfirmButton: false,
        });
      }
    );
  };

  const upload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadFile(file);
  };

  return (
    <Modal
      className="uploadModalContainer"
      title={
        sectionValue === 1
          ? "Importar Informacion"
          : "Importar informacion de XML"
      }
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="content-1">
        <div className="inner-content">
          <h4>Importar archivo</h4>
          <p>
            Carga todos tus registros desde un archivo de{" "}
            {sectionValue === 1 ? "excel" : "XML"}.
          </p>
          <div className="p-3">
            <Dragger {...options} action={"/"}>
              <p className="ant-upload-drag-icon">
                <img
                  src={`/images/${
                    sectionValue === 1 ? "excel_icon.png" : "xml_icon.png"
                  }`}
                  width="55px"
                />
              </p>
              <p className="ant-upload-text">
                Arrastra tu archivo aqui o seleccionalo desde tu computadora.
              </p>
            </Dragger>
            {file ? (
              <ul className="upload-list-item mt-3">
                <li className="d-flex">
                  {file.name}
                  <img src="/images/close.png" onClick={() => setFile(null)} />
                </li>
              </ul>
            ) : null}
            {/* <List itemLayout="horizontal"
                            dataSource={[file]} 
                            renderItem={(item) => (
                                <List.Item>
                                    {item.name}
                                </List.Item>
                            )}/> */}
            {/* <div className='upload-section text-center'>
                            <img src="/images/excel_icon.png" width="55px" />
                            <p className='file_name mt-2 mb-4'>Arrastra tu archivo aqui o seleccionalo desde tu computadora.</p>
                            <Button size="small" key="4" className="freeWidthButton bgSuccess height38" onClick={() => console.log(1)}>Seleccionar archivo</Button>
                        </div> */}
          </div>
        </div>
        {sectionValue === 1 && (
          <div className="inner-content mt-4">
            <h4>Plantilla</h4>
            <p>
              Descarga la plantilla para hacer mas facil la carga de tus
              registros.
            </p>
            <div className="d-flex p-3 lower-section">
              <div className="d-flex inline-data">
                <Switch
                  defaultChecked={required}
                  onChange={(val) => setRequired(val)}
                />
                <p>Solo incluir registros obligatories</p>
              </div>
              <Button
                size="small"
                key="4"
                disabled={downloadLoader}
                className="freeWidthButton height38"
                onClick={downloadFile}
              >
                {downloadLoader ? (
                  <LoadingOutlined style={{ fontSize: 20 }} spin />
                ) : (
                  "Descargar plantilla"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      {uploadError && uploadError.length ? (
        <div className="m-3 mt-0 p-0">
          {uploadError.map((item, index) => {
            return (
              <div className={"alert alert-danger m-0 mb-3"} key={index}>
                {item}
              </div>
            );
          })}
        </div>
      ) : null}
      <div className="content-3 text-center">
        <Button
          size="small"
          key="4"
          disabled={!file}
          className="btn btn-primary height38"
          onClick={upload}
        >
          {uploadExcelLoader ? (
            <LoadingOutlined style={{ fontSize: 20 }} spin />
          ) : (
            "Siguiente"
          )}
        </Button>
      </div>
    </Modal>
  );
}

export default UploadModal;
