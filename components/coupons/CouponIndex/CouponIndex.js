import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Col, Row, Spin, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteCouponById, getCoupons } from "../../../requests/coupon";
import alertContainer from "../../../utils/Alert";
import confirmContainer from "../../../utils/SwalConfirm";
import { Button } from "../../buttons/buttons";
import { Cards } from "../../cards/frame/cards-frame";
import { PageHeader } from "../../page-headers/page-headers";
import CouponModal from "../CouponModal";
import CouponSendModal from "../CouponSendModal";
import { Main } from "./styled";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const CouponIndex = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [couponSendVisible, setCouponSendVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

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
      title: "Moneda",
      key: "currency",
      render: (_, item) => {
        return <>{item.attributes.currency}</>;
      },
    },
    {
      title: "Cantidad",
      key: "amount_off",
      render: (_, item) => {
        return <>{item.attributes.amount_off}</>;
      },
    },
    {
      title: "Porcentaje %",
      key: "percent_off",
      render: (_, item) => {
        if (!item.attributes) return null;
        if (!item.attributes.percent_off) return "N/A";

        return `${item.attributes.percent_off}%`;
      },
    },
    {
      title: "Duracion",
      key: "duration",
      render: (_, item) => {
        return <>{item.attributes.duration}</>;
      },
    },
    {
      title: "Meses de duracion",
      key: "duration_in_months",
      render: (_, item) => {
        return <>{item.attributes.duration_in_months}</>;
      },
    },
    {
      title: "Expiracion",
      key: "redeem_by",
      render: (_, record) => {
        return moment(record.attributes.redeem_by).format("YYYY-MM-DD");
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
              onClick={() => onCouponEditClick(item)}
            />
            <DeleteOutlined
              className="editIcon mr-3 text-danger"
              onClick={() => onCouponDeleteClick(item)}
            />
            <SendOutlined
              className="editIcon text-primary"
              onClick={() => onCouponSendClick(item)}
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
    let mounted = true;
    if (mounted) {
      fetchCoupons();
    }

    return () => (mounted = false);
  }, []);

  const fetchCoupons = () => {
    setSpinner(true);
    getCoupons(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
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
    setSelectedCoupon(null);
    fetchCoupons();
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedCoupon(null);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  };

  const onCouponEditClick = (item) => {
    setVisible(true);
    setSelectedCoupon(item);
  };

  const onCouponDeleteClick = (item) => {
    confirmContainer(
      `Eliminar Cupon - ${item.attributes.name}`,
      `Estas seguro de querer eliminar este cupon?`
    ).then((result) => {
      if (result.isConfirmed) {
        handleCouponDelete(item.id);
      }
    });
  };

  const handleCouponDelete = async (id) => {
    setSpinner(true);
    try {
      const response = await deleteCouponById(
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
      fetchCoupons();
    } catch (e) {
      console.log(e);
    } finally {
      setSpinner(false);
      setSelectedCoupon(null);
    }
  };

  const onCouponSendClick = (item) => {
    setSelectedCoupon(item);
    setCouponSendVisible(true);
  };

  const onCouponSendClose = () => {
    setCouponSendVisible(false);
    setSelectedCoupon(null);
  };

  const onCouponSendOk = () => {
    setCouponSendVisible(false);
    setSelectedCoupon(null);
  };

  return (
    <>
      <PageHeader
        ghost
        title="Cupones"
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
                  <CouponModal
                    visible={visible}
                    selectedCoupon={selectedCoupon}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                  />
                )}
                {couponSendVisible && (
                  <CouponSendModal
                    visible={couponSendVisible}
                    selectedCoupon={selectedCoupon}
                    handleCancel={onCouponSendClose}
                    handleOk={onCouponSendOk}
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

export default CouponIndex;
