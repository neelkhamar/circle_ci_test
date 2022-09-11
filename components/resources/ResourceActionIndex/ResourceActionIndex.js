import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Col, Row, Spin, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  deletePremiumResourceActionById,
  getPremiumResourceActionsByResource,
} from "../../../requests/resource-action";
import confirmContainer from "../../../utils/SwalConfirm";
import { Button } from "../../buttons/buttons";
import { Cards } from "../../cards/frame/cards-frame";
import { PageHeader } from "../../page-headers/page-headers";
import ResourceActionModal from "../ResourceActionModal";
import { Main } from "./styled";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const ResourceActionIndex = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [resourceId, setResourceId] = useState(null);
  const [selectedResourceAction, setSelectedResourceAction] = useState(null);

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    setResourceId(id);
    fetchPremiumResourceActions(id);
  }, [router.isReady]);

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  const columnsSort = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripcion",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Route path",
      dataIndex: "route_path",
      key: "route_path",
    },
    {
      title: "Accion",
      dataIndex: "Edit",
      render: (_, item) => {
        return (
          <>
            <EditOutlined
              className="editIcon mr-3"
              onClick={() => onResourceActionEditClick(item)}
            />
            <DeleteOutlined
              className="editIcon text-danger mr-3"
              onClick={() => onResourceActionDeleteClick(item)}
            />
          </>
        );
      },
      key: "resource_handle_actions",
    },
  ];

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const fetchPremiumResourceActions = (resourceId) => {
    setSpinner(true);
    getPremiumResourceActionsByResource(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      resourceId
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
    setSelectedResourceAction(null);
    fetchPremiumResourceActions(resourceId);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedResourceAction(null);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  };

  const onResourceActionEditClick = (item) => {
    setVisible(true);
    setSelectedResourceAction(item);
  };

  const onResourceActionDeleteClick = (item) => {
    confirmContainer(
      `Delete Resource Action- ${item.name}`,
      `Are you sure to delete this item?`
    ).then((result) => {
      if (result.isConfirmed) {
        handleResourceActionDelete(item.id);
      }
    });
  };

  const handleResourceActionDelete = async (id) => {
    setSpinner(true);
    try {
      await deletePremiumResourceActionById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      );
      fetchPremiumResourceActions(resourceId);
    } catch (e) {
      console.log(e);
    } finally {
      setSpinner(false);
    }
  };

  const routeBack = () => {
    router.push("/resources/");
  };

  return (
    <>
      <PageHeader
        ghost
        title="Modulos"
        subTitle="Acciones"
        buttons={[
          <div key="61" className="page-header-actions">
            <Button size="small" key="41" type="primary" onClick={routeBack}>
              <FeatherIcon icon="arrow-left" size={14} />
              Regresar
            </Button>
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
                  <ResourceActionModal
                    visible={visible}
                    resourceId={resourceId}
                    selectedResourceAction={selectedResourceAction}
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

export default ResourceActionIndex;
