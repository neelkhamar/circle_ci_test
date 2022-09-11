import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Col, Modal, Row, Spin, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  deleteBenefitById,
  deletePlanById,
  getBenefits,
} from "../../../requests/plan";
import alertContainer from "../../../utils/Alert";
import { Button } from "../../buttons/buttons";
import { Cards } from "../../cards/frame/cards-frame";
import { PageHeader } from "../../page-headers/page-headers";
import { Main } from "./styled";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import confirmContainer from "../../../utils/SwalConfirm";
import ToastMessage from "../../../utils/toastContainer";
import { useRouter } from "next/router";
import BenefitModal from "./BenefitModal";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const PlanBenefits = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(0);

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  const columnsSort = [
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Modulos",
      key: "module",
      render: (_, item) => {
        return (
          <img
            src={item.module ? "/images/right.png" : "/images/wrong.png"}
            width={item.module ? "15px" : "20px"}
          />
        );
      },
    },
    {
      title: "Visible",
      key: "visible",
      render: (_, item) => {
        return (
          <img
            src={item.visible ? "/images/right.png" : "/images/wrong.png"}
            width={item.visible ? "15px" : "20px"}
          />
        );
      },
    },
    {
      title: "Accion",
      key: "action",
      render: (_, item) => {
        return (
          <>
            <EditOutlined
              className="editIcon mr-3"
              onClick={() => onPlanEditClick(item)}
            />
            <DeleteOutlined
              className="editIcon text-danger mr-3"
              onClick={() => deleteBenefit(item)}
            />
          </>
        );
      },
    },
  ];

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    if (router.query.id) {
      setCurrentPlan(router.query.id);
      fetchBenefits(router.query.id);
    }
  }, [router.query]);

  const fetchBenefits = (id) => {
    setSpinner(true);
    getBenefits(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          setData(response.data.plan_benefits);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleOk = () => {
    setVisible(false);
    setSelectedBenefit(null);
    fetchBenefits(currentPlan);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedBenefit(null);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  };

  const onPlanEditClick = (item) => {
    setVisible(true);
    setSelectedBenefit(item);
  };

  const deleteBenefit = (item) => {
    confirmContainer(
      `Borrar Benefit - ${item.title}`,
      `Estas seguro de querer eliminar el benefit?`
    ).then((result) => {
      if (result.isConfirmed) {
        handleBenefitDelete(item.id);
      }
    });
  };

  const handleBenefitDelete = async (id) => {
    setErrors([]);
    setSpinner(true);
    try {
      const response = await deleteBenefitById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      );
      alertContainer({
        title: response.data.message,
        text: "",
        icon: "success",
        showConfirmButton: false,
      });
      fetchBenefits(currentPlan);
    } catch (e) {
      if (e.response.data.errors.length) {
        e.response.data.errors.map((err) => {
          ToastMessage(err, false);
        });
      }
    } finally {
      setSpinner(false);
    }
  };

  const routeBack = () => {
    router.push("/plans");
  };

  return (
    <>
      <PageHeader
        ghost
        title="Planes"
        subTitle="Beneficios"
        buttons={[
          <Button size="small" key="41" type="primary" onClick={routeBack}>
            <FeatherIcon icon="arrow-left" size={14} />
            Regresar
          </Button>,
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
                <ToastContainer theme="colored" />
                {visible && (
                  <BenefitModal
                    visible={visible}
                    selectedBenefit={selectedBenefit}
                    selectedPlan={currentPlan}
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
                    rowKey={(record) => record.id}
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

export default PlanBenefits;
