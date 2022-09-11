import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { downloadFleteById, getFleteById } from "../../requests/flete";
import alertContainer from "../../utils/Alert";
import PdfTemplate from "../Common/pdfTemplate";
import { PageHeader } from "../page-headers/page-headers";

const PreviewContainer = () => {
  const router = useRouter();
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const [spinner, setSpinner] = useState(false);
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [data, setData] = useState(null);
  const [selectedID, setSelectedID] = useState(0);

  useEffect(() => {
    if (router.query.id) {
      fetchFleteData(router.query.id);
      setSelectedID(router.query.id);
    }
  }, [router.query]);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const printPDF = () => {
    window.print();
  };

  const fetchFleteData = (id) => {
    setSpinner(true);
    getFleteById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data.data) {
          console.log(response.data.data);
          setData(response.data.data);
        } else {
          alertContainer({
            title: "Flete not found for ID: " + id,
            text: "",
            icon: "error",
            showConfirmButton: false,
          });
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const downloadFlete = () => {
    setDeleteSpinner(true);
    downloadFleteById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      selectedID
    ).then(
      (response) => {
        setDeleteSpinner(false);
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
        setDeleteSpinner(false);
      }
    );
  };

  return (
    <>
      <div className="print-disable">
        <PageHeader
          ghost
          title="Preview"
          buttons={[
            <div key="5" className="page-header-actions">
              <Button size="small" key="6" type="primary" onClick={printPDF}>
                <FeatherIcon icon="printer" size={14} />
                Print
              </Button>
              <Button
                size="small"
                key="7"
                type="primary"
                onClick={downloadFlete}
              >
                {deleteSpinner ? (
                  <LoadingOutlined style={{ fontSize: 20 }} spin />
                ) : (
                  <>
                    <FeatherIcon icon="download" size={14} />
                    Download
                  </>
                )}
              </Button>
            </div>,
          ]}
        />
      </div>
      <div className="pdf-viewer">
        {spinner ? (
          <div className="text-center pt-4">
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <div className="outer-pdf-template">
            <PdfTemplate data={data} />
          </div>
        )}
      </div>
    </>
  );
};

export default PreviewContainer;
