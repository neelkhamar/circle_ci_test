import {
  BarsOutlined,
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
  deletePremiumResourceById,
  getPremiumResources,
} from "../../../requests/resource";
import confirmContainer from "../../../utils/SwalConfirm";
import { Button } from "../../buttons/buttons";
import { Cards } from "../../cards/frame/cards-frame";
import { PageHeader } from "../../page-headers/page-headers";
import ResourceModal from "../ResourceModal";
import { Main } from "./styled";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const ResourceIndex = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);

  const router = useRouter();

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  const columnsSort = [
    {
      title: "Nombre",
      dataIndex: ["attributes", "name"],
      key: "name",
    },
    {
      title: "Descripcion",
      dataIndex: ["attributes", "description"],
      key: "description",
    },
    {
      title: "Namespace",
      dataIndex: ["attributes", "namespace"],
      key: "namespace",
    },
    {
      title: "Accion",
      dataIndex: "Edit",
      render: (_, item) => {
        return (
          <>
            <EditOutlined
              className="editIcon mr-3"
              onClick={() => onResourceEditClick(item)}
            />
            <DeleteOutlined
              className="editIcon text-danger mr-3"
              onClick={() => onResourceDeleteClick(item)}
            />
            <BarsOutlined
              className="editIcon"
              onClick={() => goToResourceActions(item)}
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

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchPremiumResources();
    }

    return () => (mounted = false);
  }, []);

  const fetchPremiumResources = () => {
    setSpinner(true);
    getPremiumResources(
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
    setSelectedResource(null);
    fetchPremiumResources();
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedResource(null);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    setState({ ...state, values: { pagination, filters, sorter, extra } });
  };

  const onResourceEditClick = (item) => {
    setVisible(true);
    setSelectedResource(item);
  };

  const onResourceDeleteClick = (item) => {
    confirmContainer(
      `Delete Resource - ${item?.attributes?.name}`,
      `Are you sure to delete this item?`
    ).then((result) => {
      if (result.isConfirmed) {
        handleResourceDelete(item.id);
      }
    });
  };

  const handleResourceDelete = async (id) => {
    setSpinner(true);
    try {
      await deletePremiumResourceById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      );
      fetchPremiumResources();
    } catch (e) {
      console.log(e);
    } finally {
      setSpinner(false);
      setSelectedResource(null);
    }
  };

  const goToResourceActions = (resource) => {
    router.push(`/resources/${resource.id}/actions`);
  };

  return (
    <>
      <PageHeader
        ghost
        title="Modulos"
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
                  <ResourceModal
                    visible={visible}
                    selectedResource={selectedResource}
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

export default ResourceIndex;
