import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Col, Row, Spin, Table, Tag } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteProductById, getAllProducts } from "../../requests/product";
import alertContainer from "../../utils/Alert";
import confirmContainer from "../../utils/SwalConfirm";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import ProductModal from "../Common/Modals/productModal";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const ProductContainer = () => {
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(0);

  const [state, setState] = useState({
    selectionType: "checkbox",
    selectedRowKeys: null,
    selectedRows: null,
    values: {},
  });

  useEffect(() => {
    if (selectedProduct) {
      setVisible(true);
    }
  }, [selectedProduct]);

  const columnsSort = [
    {
      title: "Producto o Servicio",
      dataIndex: "catalog_product_service",
      key: "catalog_product_service",
    },
    {
      title: "Unidad de medida",
      dataIndex: "catalog_measurement_unit",
      key: "catalog_measurement_unit",
    },
    {
      title: "Precio de venta",
      dataIndex: "selling_price",
      key: "selling_price",
    },
    {
      title: "Precio de compra",
      dataIndex: "purchase_price",
      key: "purchase_price",
    },
    {
      title: "Tasas de impuestos (%)",
      dataIndex: "tax_rates",
      key: "tax_rates",
      render: (_, record) => {
        return (
          <div>
            {record.tax_rates.map((tag, index) => {
              return (
                <Tag color={"#6168F2"} style={{ fontSize: "13px" }} key={index}>
                  {tag.catalog_tax_rate.name}
                </Tag>
              );
            })}
          </div>
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
              onClick={() => setSelectedProduct(item.id)}
            />
            {!item.has_freights ? (
              <DeleteOutlined
                className="editIcon ml-3 red-color"
                onClick={() => deleteProduct(item.id)}
              />
            ) : null}
          </div>
        );
      },
    },
  ];

  const deleteProduct = (id) => {
    confirmContainer(
      "Eliminar Producto",
      `Está seguro de que desea eliminar este producto?`
    ).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      }
    });
  };

  const confirmDelete = (id) => {
    setSpinner(true);
    deleteProductById(
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
          getProducts();
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedProduct(0);
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getProducts();
    }

    return () => (mounted = false);
  }, []);

  const getProducts = () => {
    setSpinner(true);
    getAllProducts(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        const results = response.data.map((row, index) => {
          let obj = {};
          obj["key"] = index;
          obj["catalog_measurement_unit"] =
            "(" +
            row.catalog_measurement_unit.code +
            ") " +
            row.catalog_measurement_unit.name;
          obj["catalog_product_service"] =
            row.catalog_product_service.code +
            " - " +
            row.catalog_product_service.name;
          obj["purchase_price"] = row.purchase_price;
          obj["selling_price"] = row.selling_price;
          obj["tax_rates"] = row.tax_rates;
          obj["id"] = row.id;
          obj["has_freights"] = row.has_freights;
          return obj;
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
    setSelectedProduct(0);
    getProducts();
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
        title="Productos"
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
                  <ProductModal
                    visible={visible}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                    selectedProduct={selectedProduct}
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

export default ProductContainer;
