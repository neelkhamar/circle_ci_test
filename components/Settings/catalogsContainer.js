import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Alert, Col, Modal, Row, Select, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  deleteData,
  fractionSearch,
  getAllListing,
  materialSearch,
  packagingSearch,
  saveData,
} from "../../requests/catalogs";
import alertContainer from "../../utils/Alert";
import confirmContainer from "../../utils/SwalConfirm";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import { CountryData } from "../Common/Data/countries";
import { PageHeader } from "../page-headers/page-headers";
import { Main } from "./styled";

const ClientContainer = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorSection, setErrorSection] = useState("");
  const [spinner, setSpinner] = useState({
    hazardous_materials: false,
    tariff_fractions: false,
    currencies: false,
    countries: false,
    packagings: false,
    global: false,
  });
  const [materialOption, setMaterialOption] = useState([]);
  const [fractionOption, setFractionOption] = useState([]);
  const [countryOption, setCountryOption] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [packagingOption, setPackagingOption] = useState([]);
  const [dropdownSpinner, setDropdownSpinner] = useState({
    material: false,
    fraction: false,
  });
  const [data, setData] = useState({
    hazardous_materials: [],
    tariff_fractions: [],
    currencies: [],
    countries: [],
    packagings: [],
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const [tableData, setTableData] = useState({
    material: [],
    fraction: [],
    country: [],
    currency: [],
    packagings: [],
  });

  const [btnSpinner, setBtnSpinner] = useState({
    hazardous_materials: false,
    tariff_fractions: false,
    countries: false,
    currencies: false,
    packagings: false,
  });

  const columns = {
    material: [
      {
        title: "Option",
        dataIndex: "name",
        width: "80%",
        render: (_, item) => {
          return `${item.catalog_hazardous_material.code} - ${item.catalog_hazardous_material.name}`;
        },
      },
      {
        title: "Accion",
        dataIndex: "action",
        render: (_, item) => {
          return (
            <DeleteOutlined
              className="editIcon ml-3 red-color"
              onClick={() => deleteItem("hazardous_materials", item.id)}
            />
          );
        },
      },
    ],
    fraction: [
      {
        title: "Option",
        dataIndex: "name",
        width: "80%",
        render: (_, item) => {
          return `${item.catalog_tariff_fraction.code} - ${item.catalog_tariff_fraction.name}`;
        },
      },
      {
        title: "Accion",
        dataIndex: "action",
        render: (_, item) => {
          return (
            <DeleteOutlined
              className="editIcon ml-3 red-color"
              onClick={() => deleteItem("tariff_fractions", item.id)}
            />
          );
        },
      },
    ],
    country: [
      {
        title: "Option",
        dataIndex: "name",
        width: "80%",
        render: (_, item) => {
          return `${getEmoji(item.catalog_country.code2)} (${
            item.catalog_country.code
          }) - ${item.catalog_country.name}`;
        },
      },
      {
        title: "Accion",
        dataIndex: "action",
        render: (_, item) => {
          return (
            <DeleteOutlined
              className="editIcon ml-3 red-color"
              onClick={() => deleteItem("countries", item.id)}
            />
          );
        },
      },
    ],
    currency: [
      {
        title: "Option",
        dataIndex: "name",
        width: "80%",
        render: (_, item) => {
          return `${item.catalog_currency.code} - ${item.catalog_currency.name}`;
        },
      },
      {
        title: "Accion",
        dataIndex: "action",
        render: (_, item) => {
          return (
            <DeleteOutlined
              className="editIcon ml-3 red-color"
              onClick={() => deleteItem("currencies", item.id)}
            />
          );
        },
      },
    ],
    packagings: [
      {
        title: "Option",
        dataIndex: "name",
        width: "80%",
        render: (_, item) => {
          return `${item.catalog_packaging.code} - ${item.catalog_packaging.name}`;
        },
      },
      {
        title: "Accion",
        dataIndex: "action",
        render: (_, item) => {
          return (
            <DeleteOutlined
              className="editIcon ml-3 red-color"
              onClick={() => deleteItem("packagings", item.id)}
            />
          );
        },
      },
    ],
  };

  const fetchListing = (section) => {
    setSpinner({
      ...spinner,
      [section]: true,
    });
    getAllListing(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner({
          ...spinner,
          [section]: false,
        });
        if (response.status === 200 && response.data) {
          setCountryOption(response.data.countries);
          setCurrencyOption(response.data.currencies);
          response.data.current_hazardous_materials.map((val, index) => {
            val["key"] = index;
          });
          response.data.current_tariff_fractions.map((val, index) => {
            val["key"] = index;
          });
          response.data.current_countries.map((val, index) => {
            val["key"] = index;
          });
          response.data.current_currencies.map((val, index) => {
            val["key"] = index;
          });
          response.data.current_packagings.map((val, index) => {
            val["key"] = index;
          });
          setTableData({
            ...tableData,
            material: response.data.current_hazardous_materials,
            fraction: response.data.current_tariff_fractions,
            country: response.data.current_countries,
            currency: response.data.current_currencies,
            packagings: response.data.current_packagings,
          });
        }
      },
      (error) => {
        setSpinner({
          ...spinner,
          [section]: false,
        });
      }
    );
  };

  const onSearch = (name, value) => {
    if (name === "material") {
      setMaterialOption([]);
    } else if (name === "packagings") {
      setPackagingOption([]);
    } else {
      setFractionOption([]);
    }
    if (value.length >= 3) {
      if (name === "material") {
        setDropdownSpinner({
          ...dropdownSpinner,
          material: true,
          fraction: false,
          packagings: false,
        });
        materialSearch(
          currentUser.accessToken,
          currentUser.uid,
          currentUser.client,
          value
        ).then(
          (response) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              material: false,
            });
            if (response.status === 200 && response.data.data) {
              setMaterialOption(response.data.data);
            }
          },
          (error) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              material: false,
            });
          }
        );
      } else if (name === "packagings") {
        setDropdownSpinner({
          ...dropdownSpinner,
          material: false,
          fraction: false,
          packagings: true,
        });
        packagingSearch(
          currentUser.accessToken,
          currentUser.uid,
          currentUser.client,
          value
        ).then(
          (response) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              packagings: false,
            });
            if (response.status === 200 && response.data.data) {
              setPackagingOption(response.data.data);
            }
          },
          (error) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              packagings: false,
            });
          }
        );
      } else {
        setDropdownSpinner({
          ...dropdownSpinner,
          material: false,
          fraction: true,
          packagings: false,
        });
        fractionSearch(
          currentUser.accessToken,
          currentUser.uid,
          currentUser.client,
          value
        ).then(
          (response) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              fraction: false,
            });
            if (response.status === 200 && response.data.data) {
              setFractionOption(response.data.data);
            }
          },
          (error) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              fraction: false,
            });
          }
        );
      }
    } else {
      setMaterialOption([]);
      setFractionOption([]);
    }
  };

  const addData = (key) => {
    setBtnSpinner({
      ...btnSpinner,
      [key]: true,
    });
    let payload = {
      ids: data[key],
    };
    setErrorMessage("");
    setErrorSection("");
    saveData(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      key,
      payload
    ).then(
      (response) => {
        setBtnSpinner({
          ...btnSpinner,
          [key]: false,
        });
        if (response.status === 201) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          fetchListing({ key: key });
          setData({
            [key]: [],
          });
        } else {
          console.log(response.data.errors);
        }
      },
      (error) => {
        setBtnSpinner({
          ...btnSpinner,
          [key]: false,
        });
        setErrorMessage(error.response.data.errors);
        setErrorSection(key);
      }
    );
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchListing({ key: "global" });
    }

    return () => (mounted = false);
  }, []);

  const onSelect = (value, name) => {
    let d = [];
    if (value.length > 0) {
      value.map((item) => {
        d.push(item);
      });
    }
    setData({
      ...data,
      [name]: d,
    });
  };

  const onDeleteHandler = (section, id) => {
    setSpinner({
      ...spinner,
      [section]: true,
    });
    deleteData(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      section,
      id
    ).then(
      (response) => {
        setSpinner({
          ...spinner,
          [section]: false,
        });
        if (response.status === 200) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          fetchListing(section);
        }
      },
      (error) => {
        setSpinner({
          ...spinner,
          [section]: false,
        });
      }
    );
  };

  const deleteItem = (key, id) => {
    confirmContainer(
      `Eliminar ${key}`,
      `Está seguro de que desea eliminar este ${key}?`
    ).then((result) => {
      if (result.isConfirmed) {
        onDeleteHandler(key, id);
      }
    });
  };

  const getEmoji = (code) => {
    if (code) {
      return CountryData[code] ? CountryData[code].emoji : "";
    }
  };

  return (
    <>
      <PageHeader ghost title="Catalogos" buttons={[]} />
      <Main>
        <Row gutter={25}>
          <Col lg={12} xs={24}>
            <Cards headless>
              <div style={{ height: "calc(350px)" }}>
                <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                  <span className="ant-page-header-heading-title">
                    Materiales Peligrosos
                  </span>
                  {/* Material */}
                </div>
                {spinner.global || spinner.hazardous_materials ? (
                  <div className="text-center">
                    <LoadingOutlined
                      style={{ fontSize: 30, color: "blue" }}
                      spin
                    />
                  </div>
                ) : (
                  <>
                    <hr className="border-bottom" />
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 d-flex mb-3">
                      <Select
                        showSearch
                        name="hazardous_materials"
                        className="form-control p-0"
                        placeholder="Search Material Peligroso"
                        style={{ maxWidth: "82%" }}
                        mode="multiple"
                        filterOption={false}
                        value={data.hazardous_materials}
                        onChange={(val) => onSelect(val, "hazardous_materials")}
                        notFoundContent={
                          dropdownSpinner.material ? (
                            <div className="text-center">
                              <LoadingOutlined
                                style={{ fontSize: 18, color: "blue" }}
                                spin
                              />
                            </div>
                          ) : null
                        }
                        onSearch={(val) => onSearch("material", val)}
                      >
                        {materialOption.length > 0 &&
                          materialOption.map((item, index) => {
                            return (
                              <Select.Option value={item.id} key={index}>
                                {item.code} - {item.name}
                              </Select.Option>
                            );
                          })}
                      </Select>
                      {btnSpinner.hazardous_materials ? (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          className="height40 bgPurple"
                          disabled={!data.hazardous_materials}
                        >
                          <LoadingOutlined
                            style={{ fontSize: 18, color: "white" }}
                            spin
                          />
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          onClick={() => addData("hazardous_materials")}
                          className="height40 bgPurple"
                          disabled={!data.hazardous_materials}
                        >
                          <FeatherIcon icon="plus" size={14} />
                          Agregar
                        </Button>
                      )}
                    </div>
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 yScrollAuto">
                      {errorMessage &&
                      errorSection === "hazardous_materials" ? (
                        <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                          <Alert
                            message=""
                            description={errorMessage}
                            type="error"
                            className="mb-2"
                            closable
                            onClose={() => {
                              setErrorMessage("");
                              setErrorSection("");
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <Table
                        columns={columns.material}
                        dataSource={tableData.material}
                        size="middle"
                      />
                    </div>
                  </>
                )}
              </div>
            </Cards>
          </Col>
          <Col lg={12} xs={24}>
            <Cards headless>
              <div style={{ height: "calc(350px)" }}>
                <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                  <span className="ant-page-header-heading-title">
                    Fracciones Arancelarias
                  </span>
                  {/* Material */}
                </div>
                {spinner.global || spinner.tariff_fractions ? (
                  <div className="text-center">
                    <LoadingOutlined
                      style={{ fontSize: 30, color: "blue" }}
                      spin
                    />
                  </div>
                ) : (
                  <>
                    <hr className="border-bottom" />
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 d-flex mb-3">
                      <Select
                        showSearch
                        name="tariff_fractions"
                        className="form-control p-0"
                        mode="multiple"
                        placeholder="Search Fraccion Arancelaria"
                        style={{ maxWidth: "82%" }}
                        filterOption={false}
                        value={data.tariff_fractions}
                        onChange={(val) => onSelect(val, "tariff_fractions")}
                        notFoundContent={
                          dropdownSpinner.fraction ? (
                            <div className="text-center">
                              <LoadingOutlined
                                style={{ fontSize: 18, color: "blue" }}
                                spin
                              />
                            </div>
                          ) : null
                        }
                        onSearch={(val) => onSearch("fraction", val)}
                      >
                        {fractionOption.length > 0 &&
                          fractionOption.map((item, index) => {
                            return (
                              <Select.Option value={item.id} key={index}>
                                {item.code} - {item.name}
                              </Select.Option>
                            );
                          })}
                      </Select>
                      {btnSpinner.tariff_fractions ? (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          className="height40 bgPurple"
                          disabled={!data.tariff_fractions}
                        >
                          <LoadingOutlined
                            style={{ fontSize: 18, color: "white" }}
                            spin
                          />
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          onClick={() => addData("tariff_fractions")}
                          className="height40 bgPurple"
                          disabled={!data.tariff_fractions}
                        >
                          <FeatherIcon icon="plus" size={14} />
                          Agregar
                        </Button>
                      )}
                    </div>
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 yScrollAuto">
                      {errorMessage && errorSection === "tariff_fractions" ? (
                        <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                          <Alert
                            message=""
                            description={errorMessage}
                            type="error"
                            closable
                            className="mb-2"
                            onClose={() => {
                              setErrorMessage("");
                              setErrorSection("");
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <Table
                        columns={columns.fraction}
                        dataSource={tableData.fraction}
                        size="middle"
                      />
                    </div>
                  </>
                )}
              </div>
            </Cards>
          </Col>
          <Col lg={12} xs={24}>
            <Cards headless>
              <div style={{ height: "calc(350px)" }}>
                <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                  <span className="ant-page-header-heading-title">Monedas</span>
                  {/* Material */}
                </div>
                {spinner.global || spinner.currencies ? (
                  <div className="text-center">
                    <LoadingOutlined
                      style={{ fontSize: 30, color: "blue" }}
                      spin
                    />
                  </div>
                ) : (
                  <>
                    <hr className="border-bottom" />
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 d-flex mb-3">
                      <Select
                        showSearch
                        name="currencies"
                        className="form-control p-0"
                        placeholder="Search Moneda"
                        style={{ maxWidth: "82%" }}
                        mode="multiple"
                        value={data.currencies}
                        onChange={(val) => onSelect(val, "currencies")}
                        filterOption={(input, option) => {
                          let str = "";
                          option.children.map((item) => {
                            str = str + item;
                          });
                          return (
                            str.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                      >
                        {currencyOption.length > 0 &&
                          currencyOption.map((item, index) => {
                            return (
                              <Select.Option value={item.id} key={index}>
                                {item.code} - {item.name}
                              </Select.Option>
                            );
                          })}
                      </Select>
                      {btnSpinner.currencies ? (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          className="height40 bgPurple"
                          disabled={!data.currencies}
                        >
                          <LoadingOutlined
                            style={{ fontSize: 18, color: "white" }}
                            spin
                          />
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          onClick={() => addData("currencies")}
                          className="height40 bgPurple"
                          disabled={!data.currencies}
                        >
                          <FeatherIcon icon="plus" size={14} />
                          Agregar
                        </Button>
                      )}
                    </div>
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 yScrollAuto">
                      {errorMessage && errorSection === "currencies" ? (
                        <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                          <Alert
                            message=""
                            description={errorMessage}
                            type="error"
                            closable
                            className="mb-2"
                            onClose={() => {
                              setErrorMessage("");
                              setErrorSection("");
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <Table
                        columns={columns.currency}
                        dataSource={tableData.currency}
                        size="middle"
                      />
                    </div>
                  </>
                )}
              </div>
            </Cards>
          </Col>
          <Col lg={12} xs={24}>
            <Cards headless>
              <div style={{ height: "calc(350px)" }}>
                <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                  <span className="ant-page-header-heading-title">
                    Embalajes
                  </span>
                </div>
                {spinner.global || spinner.packagings ? (
                  <div className="text-center">
                    <LoadingOutlined
                      style={{ fontSize: 30, color: "blue" }}
                      spin
                    />
                  </div>
                ) : (
                  <>
                    <hr className="border-bottom" />
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 d-flex mb-3">
                      <Select
                        showSearch
                        name="packagings"
                        className="form-control p-0"
                        placeholder="Search Packagings"
                        style={{ maxWidth: "82%" }}
                        mode="multiple"
                        value={data.packagings}
                        onChange={(val) => onSelect(val, "packagings")}
                        notFoundContent={
                          dropdownSpinner.packagings ? (
                            <div className="text-center">
                              <LoadingOutlined
                                style={{ fontSize: 18, color: "blue" }}
                                spin
                              />
                            </div>
                          ) : null
                        }
                        onSearch={(val) => onSearch("packagings", val)}
                        filterOption={(input, option) => {
                          let str = "";
                          option.children.map((item) => {
                            str = str + item;
                          });
                          return (
                            str.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                      >
                        {packagingOption.length > 0 &&
                          packagingOption.map((item, index) => {
                            return (
                              <Select.Option value={item.id} key={index}>
                                {item.code} - {item.name}
                              </Select.Option>
                            );
                          })}
                      </Select>
                      {btnSpinner.packagings ? (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          className="height40 bgPurple"
                          disabled={!data.packagings}
                        >
                          <LoadingOutlined
                            style={{ fontSize: 18, color: "white" }}
                            spin
                          />
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          className="height40 bgPurple"
                          onClick={() => addData("packagings")}
                          disabled={!data.packagings}
                        >
                          <FeatherIcon icon="plus" size={14} />
                          Agregar
                        </Button>
                      )}
                    </div>
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 yScrollAuto">
                      {errorMessage && errorSection === "packagings" ? (
                        <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                          <Alert
                            message=""
                            description={errorMessage}
                            type="error"
                            closable
                            className="mb-2"
                            onClose={() => {
                              setErrorMessage("");
                              setErrorSection("");
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <Table
                        columns={columns.packagings}
                        dataSource={tableData.packagings}
                        size="middle"
                      />
                    </div>
                  </>
                )}
              </div>
            </Cards>
          </Col>
          <Col lg={12} xs={24}>
            <Cards headless>
              <div style={{ height: "calc(350px)" }}>
                <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                  <span className="ant-page-header-heading-title">Paises</span>
                </div>
                {spinner.global || spinner.countries ? (
                  <div className="text-center">
                    <LoadingOutlined
                      style={{ fontSize: 30, color: "blue" }}
                      spin
                    />
                  </div>
                ) : (
                  <>
                    <hr className="border-bottom" />
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 d-flex mb-3">
                      <Select
                        showSearch
                        name="countries"
                        className="form-control p-0"
                        placeholder="Search Los Paises"
                        style={{ maxWidth: "82%" }}
                        mode="multiple"
                        value={data.countries}
                        onChange={(val) => onSelect(val, "countries")}
                        filterOption={(input, option) => {
                          let str = "";
                          option.children.map((item) => {
                            str = str + item;
                          });
                          return (
                            str.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                      >
                        {countryOption.length > 0 &&
                          countryOption.map((item, index) => {
                            return (
                              <Select.Option value={item.id} key={index}>
                                {getEmoji(item.code2)}({item.code}) -{" "}
                                {item.name}
                              </Select.Option>
                            );
                          })}
                      </Select>
                      {btnSpinner.countries ? (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          className="height40 bgPurple"
                          disabled={!data.countries}
                        >
                          <LoadingOutlined
                            style={{ fontSize: 18, color: "white" }}
                            spin
                          />
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          key="4"
                          type="primary"
                          className="height40 bgPurple"
                          onClick={() => addData("countries")}
                          disabled={!data.countries}
                        >
                          <FeatherIcon icon="plus" size={14} />
                          Agregar
                        </Button>
                      )}
                    </div>
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 yScrollAuto">
                      {errorMessage && errorSection === "countries" ? (
                        <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                          <Alert
                            message=""
                            description={errorMessage}
                            type="error"
                            closable
                            className="mb-2"
                            onClose={() => {
                              setErrorMessage("");
                              setErrorSection("");
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <Table
                        columns={columns.country}
                        dataSource={tableData.country}
                        size="middle"
                      />
                    </div>
                  </>
                )}
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default ClientContainer;
