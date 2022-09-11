import { LoadingOutlined } from "@ant-design/icons";
import { Select, Tooltip } from "antd";
import FeatherIcon from "feather-icons-react";
import { Field } from "formik";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormGroup, Row } from "reactstrap";
import { uploadGoodsFile, uploadProducts } from "../../requests/flete";
import alertContainer from "../../utils/Alert";
import { Button } from "../buttons/buttons";
import UploadModal from "../Common/Modals/uploadModal";

const FleteGoods = ({
  columns,
  isFileUploaded,
  setIsFileUploaded,
  tableData,
  setTableData,
  packagingOption,
  values,
  selectedFiles,
  setSelectedFiles,
  materialOptions,
  trafficOptions,
  productOptions,
  goodsError,
  setUploadExcelLoader,
  uploadExcelLoader,
  uploadModal,
  setUploadModal,
  resetUploadModal,
  excelXmlUpload,
  setExcelXmlUpload,
  setUploadError,
  uploadError,
}) => {
  const { Option } = Select;
  const [selectedRow, setSelectedRow] = useState("");
  const [currentData, setCurrentData] = useState({
    product: "",
    description: "",
    quantity: "",
    kg: "",
    value: "",
    material: "",
    packaging: "",
    tariff_fraction: "",
    exterior: "",
    importation_request_number: "",
  });
  const [fileSelected, setFileSelected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const requiredList = ["description", "quantity", "kg", "value", "product"];
  const [validation, setValidation] = useState(false);

  const addRow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let valid = true;
    let keys = Object.keys(currentData);
    keys.map((item) => {
      if (requiredList.includes(item) && !currentData[item]) {
        valid = false;
      }
    });
    if (valid) {
      setShowError(false);
      let data = [...tableData];
      let payload = { ...currentData };
      if (selectedRow) {
        // Update Scenario
        data.map((val) => {
          if (val.id === selectedRow) {
            val["product"] = currentData.product;
            val["description"] = currentData.description;
            val["quantity"] = currentData.quantity;
            val["kg"] = currentData.kg;
            val["value"] = currentData.value;
            val["material"] = currentData.material;
            val["packaging"] = currentData.packaging;
            val["tariff_fraction"] = currentData.tariff_fraction;
            val["exterior"] = currentData.exterior;
            val["importation_request_number"] =
              currentData.importation_request_number;
          }
        });
        setTableData(data);
        resetForm();
      } else {
        // Add Scenario
        payload["id"] = Date.now();
        payload["new"] = true;
        data.push(payload);
        setTableData(data);
        resetForm();
      }
    } else {
      setShowError(true);
    }
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const resetForm = () => {
    setCurrentData({
      ...currentData,
      product: "",
      description: "",
      quantity: "",
      kg: "",
      value: "",
      material: "",
      packaging: "",
      tariff_fraction: "",
      exterior: "",
      importation_request_number: "",
    });
    setSelectedRow(0);
  };

  const inputHandler = (e) => {
    setCurrentData({
      ...currentData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const selectHandler = (key, val) => {
    setCurrentData({
      ...currentData,
      [key]: val,
    });
  };

  const removeRow = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFileUploaded) {
      let data = tableData.filter((val) => val.id !== item.id);
      if (!data.length && excelXmlUpload) {
        setExcelXmlUpload(0);
      }
      setTableData(data);
    }
  };

  const editRow = (e, data) => {
    setSelectedRow(data.id);
    setCurrentData({
      ...currentData,
      product: data.product,
      description: data.description,
      quantity: data.quantity,
      kg: data.kg,
      value: data.value,
      material: data.material,
      packaging: data.packaging,
      tariff_fraction: data.tariff_fraction,
      exterior: data.exterior,
      importation_request_number: data.importation_request_number,
    });
  };

  useEffect(() => {
    let error = false;
    if (
      (currentData.description && currentData.description.length > 255) ||
      (currentData.quantity && parseInt(currentData.quantity) === 0) ||
      (currentData.importation_request_number &&
        currentData.importation_request_number.length != 15) ||
      (currentData.exterior && currentData.exterior.length > 100)
    ) {
      error = true;
    }
    setValidation(error);
  }, [currentData]);

  const addUploadFile = (info) => {
    let files = [...selectedFiles];
    let currentFiles = [];
    selectedFiles.map((item) => {
      currentFiles.push(item.name);
    });
    for (let i = 0; i < info.target.files.length; i++) {
      if (!currentFiles.includes(info.target.files[i].name)) {
        files.push(info.target.files[i]);
      }
    }
    setSelectedFiles(files);
  };

  const removeUploadFile = (item) => {
    let selectedItems = selectedFiles.filter((x) => x.name !== item.name);
    setSelectedFiles(selectedItems);
  };

  const productChangeHandler = (val) => {
    let product = null;
    productOptions.map((item) => {
      if (val === item.id) {
        product = item;
      }
    });
    if (product) {
      setCurrentData({
        ...currentData,
        description: product.catalog_product_service.name,
        quantity: 1,
        value: product.selling_price,
        product: product.id,
      });
    }
  };

  const fetchRow = useCallback(
    (index) => {
      return (
        <Fragment key={index}>
          <tr>
            <td className="p-2">
              <FormGroup>
                <Select
                  showSearch
                  name="product"
                  disabled={
                    isFileUploaded || (excelXmlUpload && excelXmlUpload === 2)
                  }
                  className={
                    "form-control static-width p-0" +
                    (showError && !currentData.product ? " is-invalid" : "")
                  }
                  filterOption={(input, option) => {
                    return option.children
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  value={currentData.product}
                  onChange={(val) => productChangeHandler(val)}
                >
                  {productOptions.map((val, index) => {
                    return (
                      <Select.Option key={index} value={val.id}>
                        {val.catalog_product_service.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="description"
                  type="text"
                  disabled={
                    isFileUploaded || (excelXmlUpload && excelXmlUpload === 2)
                  }
                  className={
                    "form-control static-width" +
                    ((showError && !currentData.description) ||
                    (validation && currentData.description.length > 255)
                      ? " is-invalid"
                      : "")
                  }
                  onChange={inputHandler}
                  value={currentData.description}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="quantity"
                  type="number"
                  disabled={
                    isFileUploaded || (excelXmlUpload && excelXmlUpload === 2)
                  }
                  className={
                    "form-control static-width" +
                    ((showError && !currentData.quantity) ||
                    (validation && parseInt(currentData.quantity) === 0)
                      ? " is-invalid"
                      : "")
                  }
                  onChange={inputHandler}
                  value={currentData.quantity}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="kg"
                  type="text"
                  disabled={isFileUploaded}
                  className={
                    "form-control static-width" +
                    (showError && !currentData.kg ? " is-invalid" : "")
                  }
                  onChange={inputHandler}
                  value={currentData.kg}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="value"
                  type="number"
                  disabled={
                    isFileUploaded || (excelXmlUpload && excelXmlUpload === 2)
                  }
                  className={
                    "form-control static-width" +
                    (showError && !currentData.value ? " is-invalid" : "")
                  }
                  onChange={inputHandler}
                  value={currentData.value}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Select
                  name="material"
                  showSearch
                  disabled={excelXmlUpload && excelXmlUpload === 2}
                  filterOption={(input, option) => {
                    return option.children
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  className={"form-control static-width p-0"}
                  value={currentData.material}
                  onChange={(val) => selectHandler("material", val)}
                >
                  {materialOptions.map((item, index) => {
                    return (
                      <Select.Option
                        style={{ width: "400px" }}
                        key={index}
                        value={item.id}
                      >
                        {item.catalog_hazardous_material.code +
                          " - " +
                          item.catalog_hazardous_material.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Select
                  name="packaging"
                  showSearch
                  className={"form-control static-width p-0"}
                  disabled={excelXmlUpload && excelXmlUpload === 2}
                  filterOption={(input, option) => {
                    return option.children
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  dropdownStyle={{ minWidth: "400px" }}
                  value={currentData.packaging}
                  onChange={(val) => selectHandler("packaging", val)}
                >
                  {packagingOption.map((item, index) => {
                    return (
                      <Select.Option
                        style={{ width: "400px" }}
                        key={index}
                        value={item.id}
                      >
                        {item.catalog_packaging.code +
                          " - " +
                          item.catalog_packaging.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Select
                  showSearch
                  name="tariff_fraction"
                  disabled={
                    isFileUploaded || (excelXmlUpload && excelXmlUpload === 2)
                  }
                  className={"form-control static-width p-0"}
                  filterOption={(input, option) => {
                    return option.children
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  value={currentData.tariff_fraction}
                  onChange={(val) => selectHandler("tariff_fraction", val)}
                >
                  {trafficOptions.map((item, index) => {
                    return (
                      <Select.Option
                        style={{ width: "400px" }}
                        key={index}
                        value={item.id}
                      >
                        {item.catalog_tariff_fraction.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="exterior"
                  type="text"
                  disabled={
                    isFileUploaded || (excelXmlUpload && excelXmlUpload === 2)
                  }
                  className={
                    "form-control static-width" +
                    ((showError && !currentData.exterior) ||
                    (validation && currentData.exterior.length > 100)
                      ? " is-invalid"
                      : "")
                  }
                  onChange={inputHandler}
                  value={currentData.exterior}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="importation_request_number"
                  type="text"
                  disabled={
                    isFileUploaded || (excelXmlUpload && excelXmlUpload === 2)
                  }
                  className={
                    "form-control static-width" +
                    (currentData.importation_request_number &&
                    currentData.importation_request_number.length != 15
                      ? " is-invalid"
                      : "")
                  }
                  onChange={inputHandler}
                  value={currentData.importation_request_number}
                />
              </FormGroup>
            </td>
            <td>
              {selectedRow ? (
                <p className="cancel_btn" onClick={resetForm}>
                  Cancel
                </p>
              ) : (
                ""
              )}
            </td>
          </tr>
          {selectedRow ? (
            <tr>
              <td colSpan={8}>
                <Button
                  size="small"
                  key="41"
                  className="add_file_btn mt-0"
                  onClick={addRow}
                  type="primary"
                >
                  Editar Registro
                </Button>
              </td>
            </tr>
          ) : (
            <></>
          )}
        </Fragment>
      );
    },
    [
      tableData,
      currentData,
      productOptions,
      materialOptions,
      packagingOption,
      trafficOptions,
    ]
  );

  const uploadProductsPDF = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadLoader(true);
    let fd = new FormData();
    selectedFiles.map((item, index) => {
      fd.append(`file${index + 1}`, item);
    });
    uploadProducts(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      fd
    ).then(
      (response) => {
        setUploadLoader(false);
        if (response.status === 200) {
          let list = [];
          response.data.data.map((item) => {
            list.push({
              id: item.index,
              product: "0",
              description: item.description || "",
              quantity: parseInt(item.quantity) || "",
              kg: item.kg || "",
              value: item.price || "",
              material: "",
              packaging: "",
              tariff_fraction: item.catalog_tariff_fraction.code,
              exterior: item.invoice_id || "",
              importation_request_number: item.importation_request_number || "",
            });
          });
          setTableData(list);
          setIsFileUploaded(true);
        }
      },
      (error) => {
        setUploadLoader(false);
      }
    );
  };

  const handleUploadFile = () => {
    resetUploadModal();
  };

  const openUploadModal = (val) => {
    setUploadModal(val);
  };

  const uploadFile = (file) => {
    setUploadError([]);
    setUploadExcelLoader(true);
    let fd = new FormData();
    fd.append("file", file);
    uploadGoodsFile(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      fd,
      uploadModal
    ).then(
      (response) => {
        if (response.status === 200) {
          console.log("success");
        }
      },
      (error) => {
        alertContainer({
          title: error.response.data.message,
          text: "",
          icon: "error",
          showConfirmButton: false,
        });
        setUploadExcelLoader(false);
      }
    );
  };

  const clearTableData = () => {
    setTableData([]);
    setSelectedRow("");
    setExcelXmlUpload(0);
  };

  return (
    <Row className="mt-4 card_container">
      {uploadModal > 0 ? (
        <UploadModal
          visible={true}
          handleOk={handleUploadFile}
          uploadError={uploadError}
          uploadFile={uploadFile}
          sectionValue={uploadModal}
          uploadExcelLoader={uploadExcelLoader}
          handleCancel={resetUploadModal}
        />
      ) : null}
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3 d-flex justify-content-between">
        <div className="d-flex">
          <span className="ant-page-header-heading-title pt-1 mr-3">
            Mercancias del Flete
          </span>
          {/* Upload File disabled for first release */}
          {/* {
                        values.international ? (
                            <div>
                                <input type={"file"} multiple={true} className="entityBtn uploadBtnPDF" accept=".pdf,.PDF" onChange={addUploadFile} />
                                <Button size="small" key="4" className="entityBtn mt-0">
                                    Cargar Pedimento
                                </Button>
                            </div>
                        ) : null
                    } */}
        </div>
        <div className="d-flex">
          <Button
            size="small"
            key="4"
            className="freeWidthButton marginRight10"
            onClick={() => openUploadModal(2)}
          >
            Cargar Mercancias XML
          </Button>
          <Button
            size="small"
            key="42"
            className="freeWidthButton"
            onClick={() => openUploadModal(1)}
          >
            Cargar Mercancias Excel
          </Button>
        </div>
        {/* Upload File disabled for first release */}
        {/* {
                    selectedFiles.length > 0 && (
                        <div>
                            <Button size="small" key="4" className="entityUploadButton mt-0" onClick={uploadProductsPDF}>
                                {
                                    uploadLoader ? (
                                        <LoadingOutlined style={{ fontSize: 20 }} spin />
                                    ) : (
                                        <>
                                            <FeatherIcon icon="upload" className="pr-2" size={14} />
                                            Subir ({selectedFiles.length})
                                        </>
                                    )
                                }
                            </Button>
                        </div>
                    )
                } */}
      </div>
      {/* {
                selectedFiles.length > 0 && (
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-4">
                        {
                            selectedFiles.map((item, index) => {
                                return (
                                    <div key={index} className='ant-upload-list-picture-container d-flex'>
                                        <img src="/images/pdf_icon.png" className='ant-upload-icon' />
                                        <span className='pdf-name'>{item.name}</span>
                                        <FeatherIcon icon="trash" onClick={(e) => removeUploadFile(item)} size={15} className="pdf-remove" />
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            } */}
      <div
        className={`ant-col ant-col-xs-24 ant-col-xl-24 mt-3 table_pdf_container`}
      >
        <table className="flete_pdf_table mt-4">
          <thead>
            <tr className="title">
              {
                columns.map((item, index) => (
                  <th className="table_column_header" key={index}>
                    {requiredList.includes(item.key) ? (
                      <>
                        {item.label}
                        <span className="red-color">*</span>
                      </>
                    ) : (
                      item.label
                    )}
                  </th>
                ))
                // columns.map((item, index) => <th className='table_column_header' key={index}>{item.label}</th>)
              }
              <th className="table_column_header"></th>
            </tr>
          </thead>
          <tbody className={tableData.length === 0 ? "minHeight50" : ""}>
            {tableData.map((item, index) => {
              if (selectedRow === item.id) {
                return fetchRow(index);
              } else {
                return (
                  <tr
                    key={index}
                    className="border_bottom verticalAlignInitial"
                  >
                    <td className="static-width text-center p-2">
                      <Select
                        name="product"
                        className={"form-control static-width p-0"}
                        disabled={true}
                        value={item.product}
                      >
                        {productOptions.map((val, index) => {
                          return (
                            <Select.Option key={index} value={val.id}>
                              {val.catalog_product_service.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="description"
                        type="text"
                        className={"form-control static-width"}
                        disabled={true}
                        value={item.description}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="quantity"
                        type="number"
                        className={"form-control static-width"}
                        disabled={true}
                        value={item.quantity}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="kg"
                        type="text"
                        className={"form-control static-width"}
                        disabled={true}
                        value={item.kg}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="value"
                        type="number"
                        className={"form-control static-width"}
                        disabled={true}
                        value={item.value}
                      />
                    </td>
                    <td>
                      <Select
                        name="material"
                        className={"form-control static-width p-0"}
                        disabled={true}
                        value={item.material ? item.material.toString() : ""}
                      >
                        {materialOptions.map((val, index) => {
                          return (
                            <Select.Option
                              style={{ width: "400px" }}
                              key={index}
                              value={val.id}
                            >
                              {val.catalog_hazardous_material.code +
                                " - " +
                                val.catalog_hazardous_material.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </td>
                    <td className="static-width text-center p-2">
                      <Select
                        name="packaging"
                        className={"form-control static-width p-0"}
                        disabled={true}
                        value={item.packaging ? item.packaging.toString() : ""}
                      >
                        {packagingOption.map((item, index) => {
                          return (
                            <Select.Option
                              style={{ width: "400px" }}
                              key={index}
                              value={item.id}
                            >
                              {item.catalog_packaging.code +
                                " - " +
                                item.catalog_packaging.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </td>
                    <td className="static-width text-center p-2">
                      <Select
                        name="tariff_fraction"
                        className={"form-control static-width p-0"}
                        disabled={true}
                        value={item.tariff_fraction}
                      >
                        {trafficOptions.map((item, index) => {
                          return (
                            <Select.Option
                              style={{ width: "400px" }}
                              key={index}
                              value={item.id}
                            >
                              {item.catalog_tariff_fraction.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="exterior"
                        type="text"
                        className={"form-control static-width"}
                        disabled={true}
                        value={item.exterior}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="importation_request_number"
                        type="text"
                        className={"form-control static-width"}
                        disabled={true}
                        value={item.importation_request_number}
                      />
                    </td>
                    <td className="static-width text-center pt-3 d-flex">
                      <Tooltip title="Edit">
                        <FeatherIcon
                          icon="edit"
                          onClick={(e) => editRow(e, item)}
                          size={15}
                        />
                      </Tooltip>
                      {!isFileUploaded ? (
                        <Tooltip title="Remove">
                          <FeatherIcon
                            icon="trash"
                            onClick={(e) => removeRow(e, item)}
                            size={15}
                          />
                        </Tooltip>
                      ) : null}
                    </td>
                  </tr>
                );
              }
            })}
            {!isFileUploaded && !selectedRow ? fetchRow() : null}
          </tbody>
        </table>
      </div>
      {goodsError.message ? (
        <div className="ant-col ant-col-xs-24 ant-col-xl-24" id="goods_error">
          <div className={"alert alert-danger m-0 mt-3"}>
            {goodsError.message}
          </div>
        </div>
      ) : (
        <></>
      )}
      {validation ? (
        <div className="mt-3 conceptos-error">
          <p className="p-0 m-0">Please resolve below errors</p>
          <ul>
            {currentData.description.length > 255 && (
              <li className="text-danger">
                Description should not be more than 255 characters
              </li>
            )}
            {parseInt(currentData.quantity) === 0 && (
              <li className="text-danger">Quantity should be greater than 0</li>
            )}
            {currentData.importation_request_number &&
              currentData.importation_request_number.length != 15 && (
                <li className="text-danger">
                  Pedimento should contain 15 characters
                </li>
              )}
            {currentData.exterior.length > 100 && (
              <li className="text-danger">
                UUID de comercio exterior should not be more than 100 characters
              </li>
            )}
          </ul>
        </div>
      ) : (
        <></>
      )}
      <div className="ant-col ant-col-xs-24 ant-col-xl-24">
        {!selectedRow ? (
          <Button
            size="small"
            key="45"
            className="add_file_btn mr-3"
            disabled={isFileUploaded}
            onClick={addRow}
            type="primary"
          >
            Agregar
          </Button>
        ) : (
          <></>
        )}
        {excelXmlUpload > 0 ? (
          <Button
            size="small"
            key="47"
            className="add_file_btn"
            onClick={clearTableData}
            type="primary"
          >
            Clear
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3 text-right">
        <p className="text-left">
          <b>Filas: {tableData.length}</b>
        </p>
      </div>
    </Row>
  );
};

export default React.memo(FleteGoods);
