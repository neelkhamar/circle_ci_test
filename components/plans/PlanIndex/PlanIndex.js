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
import { deletePlanById, getPlans } from "../../../requests/plan";
import alertContainer from "../../../utils/Alert";
import { Button } from "../../buttons/buttons";
import { Cards } from "../../cards/frame/cards-frame";
import { PageHeader } from "../../page-headers/page-headers";
import PlanModal from "../PlanModal";
import { Main } from "./styled";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import confirmContainer from "../../../utils/SwalConfirm";
import ToastMessage from "../../../utils/toastContainer";
import { useRouter } from "next/router";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const PlanIndex = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  const columnsSort = [
    {
      title: "Nombre",
      key: "name",
      render: (_, item) => {
        return <>{item.attributes.name}</>;
      },
    },
    {
      title: "Precio",
      key: "amount",
      render: (_, item) => {
        return <>{item.attributes.amount}</>;
      },
    },
    {
      title: "Moneda",
      key: "currency",
      render: (_, item) => {
        return <>{item.attributes.currency}</>;
      },
    },
    {
      title: "Intervalo",
      key: "interval",
      render: (_, item) => {
        return <>{item.attributes.interval}</>;
      },
    },
    {
      title: "Activo",
      key: "active",
      render: (_, item) => {
        return (
          <img
            src={
              item.attributes.active ? "/images/right.png" : "/images/wrong.png"
            }
            width={item.attributes.active ? "15px" : "20px"}
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
            {item.attributes.name !== "Basic Plan" && (
              <DeleteOutlined
                className="editIcon text-danger mr-3"
                onClick={() => onPlanDeleteClick(item)}
              />
            )}
            <BarsOutlined
              className="editIcon"
              onClick={() => goToBenefits(item)}
            />
          </>
        );
      },
    },
  ];

  const goToBenefits = (item) => {
    router.push(`/plans/${item.id}/benefits`);
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchPlans();
    }

    return () => (mounted = false);
  }, []);

  const fetchPlans = () => {
    setSpinner(true);
    getPlans(currentUser.accessToken, currentUser.uid, currentUser.client).then(
      (response) => {
        setSpinner(false);
        const results = response.data.data.map((row, index) => {
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
    setSelectedPlan(null);
    fetchPlans();
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedPlan(null);
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
    setSelectedPlan(item);
  };

  const onPlanDeleteClick = (item) => {
    confirmContainer(
      `Borrar Plan - ${item.attributes.name}`,
      `Estas seguro de querer eliminar el plan?`
    ).then((result) => {
      if (result.isConfirmed) {
        handlePlanDelete(item.attributes.id);
      }
    });
  };

  const handlePlanDelete = async (id) => {
    setErrors([]);
    setSpinner(true);
    try {
      const response = await deletePlanById(
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
      fetchPlans();
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

  return (
    <>
      <PageHeader
        ghost
        title="Planes"
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
                <ToastContainer theme="colored" />
                {visible && (
                  <PlanModal
                    visible={visible}
                    selectedPlan={selectedPlan}
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

export default PlanIndex;
