import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import FeatherIcon from "feather-icons-react";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../Layouts/layout/socketContext";
import { Col, FormGroup, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import {
  createFlete,
  getDropdownOptions,
  getFleteById,
  updateFleteById,
} from "../../requests/flete";
import alertContainer from "../../utils/Alert";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import {
  fetchHelperConceptos,
  fetchHelperGoods,
  fetchHelperRemolque,
} from "../Helper/flete";
import { PageHeader } from "../page-headers/page-headers";
import FleteConcepts from "./fleteConcepts";
import FleteGoods from "./fleteGoods";
import Carrier from "./sections/carrier";
import Figures from "./sections/figures";
import General from "./sections/general";
import Information from "./sections/information";
import Location from "./sections/location";
import Policies from "./sections/policies";
import ToastMessage from "../../utils/toastContainer";
import { ToastContainer } from "react-toastify";
import { Main } from "./styled";

const FleteContainer = () => {
  const socketContext = useContext(SocketContext);
  const router = useRouter();
  const [schema, setSchema] = useState({
    client: Yup.string().required("Se requiere la Cliente"),
    type: Yup.string().required("Se requiere la Licencia de Tipo Carta Porte"),
    currency: Yup.string().required("Se requiere la Licencia de Moneda"),
    sct: Yup.string().required("Se requiere la Tipo Permiso SCT"),
    numberSct: Yup.string().required("Se requiere la Tipo Permiso SCT"),
    vehicles: Yup.string().required("Se requiere la Vehiculo"),
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [socket, setSocket] = useState(true);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [currency, setCurrency] = useState(false);
  const [customers, setCustomers] = useState(false);
  const [country, setCountry] = useState([]);
  const [sctTypes, setSctTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [transportTypes, setTransportTypes] = useState([]);
  const [goodsTableData, setGoodsTableData] = useState([]);
  const [conceptTableData, setConceptTableData] = useState([]);
  const [packagingOption, setPackagingOption] = useState([]);
  const [trafficOptions, setTrafficOptions] = useState([]);
  const [figureOptions, setFigureOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [taxRateOptions, setTaxRateOptions] = useState([]);
  const [cacheData, setCacheData] = useState(null);
  const [errorList, setErrorList] = useState([]);
  const [selectedFlete, setSelectedFlete] = useState("");
  const [figureList, setFigureList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [uploadError, setUploadError] = useState([]);
  const [uploadExcelLoader, setUploadExcelLoader] = useState(false);
  const [uploadModal, setUploadModal] = useState(0);
  const [excelXmlUpload, setExcelXmlUpload] = useState(0);
  const [data, setData] = useState({
    numberSct: "",
    company_name: "",
    currency: undefined,
    client: undefined,
    internationalType: undefined,
    internationalEntry: undefined,
    destInternational: undefined,
    sct: undefined,
    vehicles: undefined,
    remolque: undefined,
    type: 1,
    international: false,
  });
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });
  const [figureError, setFigureError] = useState({
    required: false,
    message: "",
  });
  const [locationError, setLocationError] = useState({
    required: false,
    message: "",
  });
  const [goodsError, setGoodsError] = useState({
    required: false,
    message: "",
  });
  const [conceptosError, setConceptosError] = useState({
    required: false,
    message: "",
  });

  const locationValues = {
    origin: "1",
    destination: "3",
  };
  const typeOptions = [
    {
      value: 1,
      label: "Autotransporte Federal",
    },
    {
      value: 2,
      label: "Transporte Maritimo",
    },
    {
      value: 3,
      label: "Transporte Aereo",
    },
    {
      value: 4,
      label: "Transporte Ferroviario",
    },
    {
      value: 5,
      label: "Ducto",
    },
  ];

  const goodsTableColumns = [
    {
      label: "Producto",
      key: "product",
    },
    {
      label: "Descripción",
      key: "description",
    },
    {
      label: "Cantidad",
      key: "quantity",
    },
    {
      label: "Peso en KG",
      key: "kg",
    },
    {
      label: "Valor",
      key: "value",
    },
    {
      label: "Material Peligroso",
      key: "material",
    },
    {
      label: "Embalaje",
      key: "packaging",
    },
    {
      label: "Fraccion Arancelaria",
      key: "tariff_fraction",
    },
    {
      label: "UUID de comercio exterior",
      key: "exterior",
    },
    {
      label: "Pedimento",
      key: "importation_request_number",
    },
  ];

  const conceptTableColumns = [
    {
      label: "Producto",
      key: "product",
    },
    {
      label: "Descripción",
      key: "description",
    },
    {
      label: "Cantidad",
      key: "quantity",
    },
    {
      label: "Precio unitario",
      key: "unit_price",
    },
    {
      label: "Tasas de impuestos (%)",
      key: "tax_rate",
    },
    {
      label: "Impuestos",
      key: "tax",
    },
    {
      label: "Porcentaje descuento",
      key: "discount",
    },
    {
      label: "Subtotal",
      key: "subtotal",
    },
  ];

  useEffect(() => {
    let mounted = true;
    // Create Scenario
    if (mounted && router.route.includes("create")) {
      getOptionList();
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (router.query.id) {
      getOptionList();
    }
  }, [router.query]);

  useEffect(() => {
    if (goodsTableData.length) {
      resetGoodsError();
    }
  }, [goodsTableData]);

  useEffect(() => {
    if (conceptTableData.length) {
      resetConceptosError();
    }
  }, [conceptTableData]);

  useEffect(() => {
    if (locationList.length) {
      let validation = {
        1: false,
        3: false,
      };
      locationList.map((item) => {
        if (parseInt(item.type) === 1 || parseInt(item.type) === 3) {
          validation[item.type] = true;
        }
      });
      if (validation["1"] && validation["3"]) {
        resetLocationError();
      }
    }
  }, [locationList]);

  const fetchSocket = () => {
    if (socketContext.ActionCableConsumer) {
      return (
        <socketContext.ActionCableConsumer
          channel={{ channel: "FreightGoodChannel" }}
          onReceived={retrieveHandler}
        />
      );
    }
  };

  const routeBack = () => {
    router.push("/freights/");
  };

  const customSubmit = (values, isFormValid) => {
    let scrollError = [];
    let requiredFields = { ...schema };
    if (values.international) {
      requiredFields["destInternational"] = "";
      requiredFields["internationalEntry"] = "";
      requiredFields["internationalType"] = "";
    } else {
      delete requiredFields.destInternational;
      delete requiredFields.internationalEntry;
      delete requiredFields.internationalType;
    }
    if (!isFormValid) {
      Object.keys(requiredFields).map((val) => {
        if (!values[val]) {
          scrollError.push(val);
        }
      });
    }
    let isValid = true;
    let figuraRequired = false;
    let operatorPresent = false;
    let duplicate = false;
    let usedList = [];
    if (conceptTableData.length === 0) {
      isValid = false;
      setConceptosError({
        ...conceptosError,
        required: true,
        message: "Please fill atleast one row to create flete",
      });
      scrollError.push("conceptos_error");
    } else {
      resetConceptosError();
    }
    if (goodsTableData.length === 0) {
      isValid = false;
      setGoodsError({
        ...goodsError,
        required: true,
        message: "Please fill atleast one row to create flete",
      });
      scrollError.push("goods_error");
    } else {
      resetGoodsError();
    }
    if (figureList.length) {
      figureList.map((item) => {
        if (usedList.includes(item.figure)) {
          duplicate = true;
        } else {
          usedList.push(item.figure);
        }
        if (item.operator) {
          operatorPresent = true;
        }
      });
    } else {
      figuraRequired = true;
    }
    if (figuraRequired || !operatorPresent || duplicate) {
      isValid = false;
      setFigureError({
        ...figureError,
        required: figuraRequired,
        message: operatorPresent
          ? duplicate
            ? "You should not use duplicate figura"
            : ""
          : "Please select atleast one operador",
      });
      scrollError.push("figure_error");
    } else {
      resetFigureError();
    }
    let locationRequired = false;
    let originPresent = false;
    let destinationPresent = false;
    locationList.map((item) => {
      if (item.location && item.type && item.date && item.time) {
        if (item.type === "1") {
          originPresent = true;
        }
        if (item.type === "3") {
          destinationPresent = true;
        }
      } else {
        locationRequired = true;
      }
    });
    if (locationRequired || !originPresent || !destinationPresent) {
      isValid = false;
      setLocationError({
        ...locationError,
        required: locationRequired,
        message:
          originPresent && destinationPresent
            ? ""
            : "Please select atleast one Origen & Destino",
      });
    } else {
      resetLocationError();
    }
    if (isValid && scrollError.length === 0) {
      saveFlete(values);
    } else {
      if (scrollError.length) {
        const firstError = scrollError[0];
        let el = document.querySelector(`#${firstError}`);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
      return null;
    }
  };

  const getFleteDetails = (id, request) => {
    setSpinner(true);
    getFleteById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          console.log(response);
          let result = response.data;
          setCacheData(result);
          let remolqueList = [];
          let figureArr = [];
          let conceptosArr = [];
          let locationArr = [];
          let goodsArr = [];
          if (result.freight_vehicles.length) {
            result.freight_vehicles.map((val) => {
              remolqueList.push(val.vehicle.id);
            });
          }
          if (result.freight_figures.length) {
            result.freight_figures.map((val) => {
              figureArr.push({
                figure: val.figure.id,
                type: val.catalog_transport_type || "",
                operator: val.figure.kind === "operator",
                new: false,
                id: val.id,
              });
            });
          }
          if (result.freight_locations.length) {
            result.freight_locations.map((item) => {
              locationArr.push({
                id: item.id,
                new: false,
                location: item.location.id,
                type: locationValues[item.location_type],
                date: moment.utc(item.departure_time),
                time: moment.utc(item.departure_time),
                distance: item.km,
              });
            });
          }
          if (result.freight_goods.length) {
            result.freight_goods.map((item) => {
              goodsArr.push({
                id: item.id,
                new: false,
                product: item.product_service.id || "",
                description: item.description || "",
                quantity: item.quantity || "",
                kg: item.kg || "",
                value: item.price || "",
                material: item.catalog_hazardous_material?.id.toString() || "",
                packaging: item.catalog_packaging?.id.toString() || "",
                tariff_fraction:
                  item.catalog_tariff_fraction?.id.toString() || "",
                exterior: item.cfdi_invoice_number || "",
                importation_request_number:
                  item.importation_request_number || "",
              });
            });
          }
          if (result.cfdi_concepts.length) {
            result.cfdi_concepts.map((val) => {
              let rates = [];
              val.tax_rates.map((item) => {
                rates.push(item.catalog_tax_rate.id);
              });
              let obj = {
                product: val.product_service.id || "",
                description: val.description || "",
                quantity: val.quantity,
                unit_price: val.price,
                tax_rate: rates,
                tax: val.tax,
                discount: val.discount_percentage,
                subtotal: val.subtotal,
                new: false,
                id: val.id,
              };
              conceptosArr.push(obj);
            });
            console.log(conceptosArr);
          }
          let obj = {
            client: result.customer.id || "",
            type: result.note_type || "",
            currency: result.catalog_currency.id || "",
            international: result.international_flag,
            internationalType: result.international_moving_type || undefined,
            internationalEntry: result.international_note_type || undefined,
            destInternational: result.catalog_country?.id || "",
            sct: result.catalog_sct_type.id || "",
            numberSct: result.sct_number || "",
            vehicles: result.vehicle.id || "",
            insuranceName: result.merchandise_insurance_name || "",
            insuranceNumber: result.merchandise_insurance_number || "",
            environmentDamage: result.environmental_damage_insurance_name || "",
            insuranceEnvironment:
              result.environmental_damage_insurance_number || "",
            remolque: remolqueList,
          };
          setData({
            ...request,
            ...obj,
          });
          setFigureList(figureArr);
          setConceptTableData(conceptosArr);
          setLocationList(locationArr);
          setGoodsTableData(goodsArr);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const getOptionList = () => {
    setSpinner(true);
    getDropdownOptions(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        console.log(response.data);
        if (response.status === 200 && response.data) {
          let requestData = { ...data };
          setCurrency(response.data.currencies);
          requestData["company_name"] = response.data.my_company.name || "";
          setCountry(response.data.countries);
          setCustomers(response.data.customers);
          setSctTypes(response.data.sct_types);
          setVehicles(response.data.vehicles);
          setTransportTypes(response.data.transport_types);
          setPackagingOption(response.data.packagings);
          setFigureOptions(response.data.figures);
          setTrafficOptions(response.data.tariff_fractions);
          setLocationOptions(response.data.locations);
          setMaterialOptions(response.data.hazardous_materials);
          setProductOptions(response.data.current_product_services);
          setTaxRateOptions(response.data.tax_rates);
          if (response.data.insurance_policy_commodity_active) {
            requestData["insuranceName"] =
              response.data.insurance_policy_commodity_active.name || "";
            requestData["insuranceNumber"] =
              response.data.insurance_policy_commodity_active.number || "";
          }
          if (response.data.insurance_policy_environment_active) {
            requestData["environmentDamage"] =
              response.data.insurance_policy_environment_active.name || "";
            requestData["insuranceEnvironment"] =
              response.data.insurance_policy_environment_active.number || "";
          }
          if (response.data.sct_type_active) {
            requestData["sct"] =
              response.data.sct_type_active?.catalog_sct_type.id || "";
            requestData["numberSct"] =
              response.data.sct_type_active?.number || "";
          }
          if (router.query.id) {
            setSelectedFlete(router.query.id);
            getFleteDetails(router.query.id, requestData);
          } else {
            setData({ ...requestData });
          }
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const resetFigureError = () => {
    setFigureError({
      ...figureError,
      required: false,
      message: "",
    });
  };

  const resetLocationError = () => {
    setLocationError({
      ...locationError,
      required: false,
      message: "",
    });
  };

  const resetGoodsError = () => {
    setGoodsError({
      ...goodsError,
      required: false,
      message: "",
    });
  };

  const resetConceptosError = () => {
    setConceptosError({
      ...conceptosError,
      required: false,
      message: "",
    });
  };

  const saveFlete = async (values) => {
    // setBtnSpinner(true)
    let remolque = [];
    let conceptos = [];
    let goods = [];
    let figureArr = [];
    let locationArr = [];
    let isEdit = router.query.id ? true : false;
    let units = {};
    productOptions.map((val) => {
      units[val.id] = val.catalog_measurement_unit.id;
    });
    if (conceptTableData.length) {
      if (isEdit) {
        conceptos = await fetchHelperConceptos(
          conceptTableData,
          cacheData,
          units
        );
      } else {
        conceptTableData.map((val) => {
          let obj = {
            product_service_id: val.product,
            catalog_measurement_unit_id: units[val.product],
            description: val.description,
            quantity: val.quantity,
            price: val.unit_price,
            percentage: val.discount,
            tax: val.tax,
            subtotal: val.subtotal,
            tax_rates_attributes: [],
          };
          if (val.tax_rate.length) {
            val.tax_rate.map((item) => {
              obj["tax_rates_attributes"].push({
                tax_rateable_type: "CfdiConcept",
                catalog_tax_rate_id: item,
              });
            });
          }
          conceptos.push(obj);
        });
      }
    }
    if (values.remolque) {
      if (isEdit) {
        remolque = await fetchHelperRemolque(values, cacheData);
      } else {
        values.remolque.map((item) => {
          remolque.push({
            vehicle_id: item,
          });
        });
      }
    }
    if (goodsTableData.length) {
      if (isEdit) {
        goods = await fetchHelperGoods(
          goodsTableData,
          cacheData,
          trafficOptions
        );
      } else {
        goodsTableData.map((val) => {
          let fraction = "";
          trafficOptions.map((item) => {
            if (item.id === val.tariff_fraction) {
              fraction = item.id;
            }
          });
          let obj = {
            product_service_id: val.product,
            catalog_hazardous_material_id: val.material,
            catalog_packaging_id: val.packaging,
            catalog_tariff_fraction_id: fraction,
            description: val.description,
            quantity: val.quantity,
            kg: val.kg,
            price: val.value,
            cfdi_invoice_number: val.exterior,
            importation_request_number: val.importation_request_number,
          };
          goods.push(obj);
        });
      }
    }

    if (figureList.length) {
      if (isEdit) {
        let usedFigures = [];
        figureList.map((item) => {
          let obj = {
            figure_id: item.figure,
            catalog_transport_type_id: item.type || "",
          };
          if (!item.new) {
            obj["id"] = item.id;
          }
          usedFigures.push(item.id);
          figureArr.push(obj);
        });
        cacheData.freight_figures.map((item) => {
          if (!usedFigures.includes(item.id)) {
            figureArr.push({
              figure_id: item.figure.id,
              catalog_transport_type_id: item.catalog_transport_type || "",
              id: item.id,
              _destroy: "1",
            });
          }
        });
      } else {
        figureList.map((item) => {
          figureArr.push({
            figure_id: item.figure,
            catalog_transport_type_id: item.type || "",
          });
        });
      }
    }
    if (locationList.length) {
      if (isEdit) {
        let usedLocation = [];
        locationList.map((item) => {
          let obj = {
            location_id: item.location,
            location_type: parseInt(item.type),
            km: item.distance,
            departure_time: `${moment(item.date).format("YYYY/MM/DD")} ${moment(
              item.time
            ).format("h:mm:ss")}`,
          };
          if (!item.new) {
            obj["id"] = item.id;
          }
          usedLocation.push(item.id);
          locationArr.push(obj);
        });
        cacheData.freight_locations.map((item) => {
          if (!usedLocation.includes(item.id)) {
            locationArr.push({
              location_id: item.location.id,
              location_type: locationValues[item.location_type],
              departure_time: item.departure_time,
              km: item.km,
              id: item.id,
              _destroy: "1",
            });
          }
        });
      } else {
        locationList.map((item) => {
          let finalDate = `${moment(item.date).format("YYYY/MM/DD")} ${moment(
            item.time
          ).format("h:mm:ss")}`;
          locationArr.push({
            location_id: item.location,
            location_type: parseInt(item.type),
            departure_time: finalDate,
            km: item.distance,
          });
        });
      }
    }

    let payload = {
      freight: {
        customer_id: values.client || "",
        note_type: values.type || "",
        catalog_currency_id: values.currency,
        international_flag: values.international,
        international_moving_type: values.internationalType,
        international_note_type: values.internationalEntry,
        catalog_country_id: values.destInternational,
        catalog_sct_type_id: values.sct,
        sct_number: values.numberSct,
        vehicle_id: values.vehicles,
        merchandise_insurance_name: values.insuranceName,
        merchandise_insurance_number: values.insuranceNumber,
        environmental_damage_insurance_name: values.environmentDamage || "",
        environmental_damage_insurance_number:
          values.insuranceEnvironment || "",
        freight_vehicles_attributes: remolque || [],
        cfdi_concepts_attributes: conceptos || [],
        freight_goods_attributes: goods,
        freight_figures_attributes: figureArr,
        freight_locations_attributes: locationArr,
      },
    };
    if (isEdit) {
      updateFleteById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        router.query.id,
        payload
      ).then(
        (response) => {
          setBtnSpinner(false);
          if (response.status === 200) {
            alertContainer({
              title: response.data.message,
              text: "",
              icon: "success",
              showConfirmButton: false,
            });
            router.push("/freights");
          }
        },
        (error) => {
          setBtnSpinner(false);
          if (error?.response?.data?.errors) {
            setErrorList(error.response.data.errors);
          } else {
            setErrorList(["Something went wrong"]);
          }
        }
      );
    } else {
      createFlete(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload
      ).then(
        (response) => {
          setBtnSpinner(false);
          if (response.status === 201) {
            alertContainer({
              title: response.data.message,
              text: "",
              icon: "success",
              showConfirmButton: false,
            });
            router.push("/freights");
          }
        },
        (error) => {
          setBtnSpinner(false);
          if (error?.response?.data?.errors) {
            setErrorList(error.response.data.errors);
          } else {
            setErrorList(["Something went wrong"]);
          }
        }
      );
    }
  };

  const retrieveHandler = (data) => {
    console.log(data);
    if (data && data.info) {
      if (data.info.length) {
        setUploadExcelLoader(false);
        setExcelXmlUpload(uploadModal);
        resetUploadModal();
        setFileData(data.info);
      } else {
        ToastMessage(
          "Something went wrong. Uploaded file does not contain data",
          false
        );
      }
    } else {
      ToastMessage("Something went wrong. Try again", false);
      if (data && data.errors) {
        setUploadError(data.errors);
      }
      setUploadExcelLoader(false);
    }
  };

  const setFileData = (data) => {
    console.log(data);
    let productList = productOptions.map((val) => val.id);
    let options = [...productOptions];
    data.forEach((item) => {
      if (!productList.includes(item.data.attributes.product_service.data.id)) {
        options.push(item.data.attributes.product_service.data);
      }
    });
    let tData = data.map((item) => {
      return {
        product: item.data.attributes.product_service.data.id,
        description:
          item.data.attributes.product_service.data.attributes
            .catalog_product_service.name,
        quantity: item.data.attributes.quantity,
        kg: 0,
        value: item.data.attributes.price,
        material: "",
        packaging: "",
        tariff_fraction: "",
        exterior: "",
        importation_request_number: "",
        id: Date.now(),
      };
    });
    setGoodsTableData(tData);
    setProductOptions(options);
  };

  const resetUploadModal = () => {
    setUploadModal(0);
  };

  {
    return (
      <>
        <PageHeader
          ghost
          title="Fletes"
          subTitle={selectedFlete ? "Actualizar" : "Crear"}
          buttons={[
            <div key="6" className="page-header-actions">
              <Button size="small" key="4" type="primary" onClick={routeBack}>
                <FeatherIcon icon="arrow-left" size={14} />
                Back
              </Button>
            </div>,
          ]}
        />
        {fetchSocket()}
        <Main>
          <Row gutter={25}>
            <Col lg={24} xs={24}>
              <Cards headless>
                <div style={{ minHeight: "calc(100vh - 320px)" }}>
                  <ToastContainer theme="colored" />
                  {spinner ? (
                    <div className="text-center pt-4">
                      <Spin indicator={antIcon} />
                    </div>
                  ) : (
                    <Formik
                      initialValues={data}
                      enableReinitialize={true}
                      validationSchema={() =>
                        Yup.lazy((values) => {
                          let validate = { ...schema };
                          if (values.international) {
                            validate["destInternational"] =
                              Yup.string().required(
                                "Se requiere la origen/destino internacional"
                              );
                            validate["internationalEntry"] =
                              Yup.string().required(
                                "Se requiere la salida Internacional"
                              );
                            validate["internationalType"] =
                              Yup.string().required(
                                "Se requiere la Traslado internacional tipo"
                              );
                          } else {
                            delete validate.destInternational;
                            delete validate.internationalEntry;
                            delete validate.internationalType;
                          }
                          setSchema(validate);
                          return Yup.object().shape(validate);
                        })
                      }
                      onSubmit={(values, { setStatus, setSubmitting }) => {
                        setStatus();
                      }}
                      render={({
                        values,
                        errors,
                        status,
                        touched,
                        handleChange,
                        handleSubmit,
                        handleBlur,
                        isValid,
                      }) => (
                        <Form>
                          <>
                            <Row className="ant-row card_container">
                              <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                                <span className="ant-page-header-heading-title">
                                  Proveedor
                                </span>
                              </div>
                              <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                                <FormGroup>
                                  <Field
                                    name="company_name"
                                    type="text"
                                    disabled={true}
                                    className={"form-control heyover"}
                                    value={values.company_name || ""}
                                    // onChange={handleChange}
                                    placeholder="Empresa"
                                  />
                                </FormGroup>
                              </div>
                            </Row>
                            <Row className="ant-row mt-4 card_container">
                              <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                                <span className="ant-page-header-heading-title">
                                  Cliente
                                </span>
                              </div>
                              <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                                <FormGroup>
                                  <FormItem name="client">
                                    <Select
                                      name="client"
                                      id="client"
                                      onBlur={handleBlur}
                                      placeholder="Cliente*"
                                      className={"form-control p-0"}
                                      value={
                                        customers.length ? values.client : ""
                                      }
                                      onChange={handleChange}
                                    >
                                      {customers.length > 0 ? (
                                        customers.map((item, index) => {
                                          return (
                                            <Select.Option
                                              value={item.id}
                                              key={index}
                                            >
                                              {item.name}
                                            </Select.Option>
                                          );
                                        })
                                      ) : (
                                        <Select.Option value="">
                                          Select
                                        </Select.Option>
                                      )}
                                    </Select>
                                  </FormItem>
                                </FormGroup>
                              </div>
                            </Row>
                            {/* General Section Starts Here */}
                            <General
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              touched={touched}
                              values={values}
                              errors={errors}
                              currency={currency}
                              typeOptions={typeOptions}
                            />
                            {/* General Section Ends Here */}

                            {/* Information Section Starts Here */}
                            <Information
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              data={data}
                              setData={setData}
                              touched={touched}
                              values={values}
                              errors={errors}
                              typeOptions={typeOptions}
                              country={country}
                            />
                            {/* Information Section Ends Here */}

                            {/* Carrier Section Starts Here */}
                            <Carrier
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              touched={touched}
                              values={values}
                              errors={errors}
                              vehicles={vehicles}
                              sctTypes={sctTypes}
                            />
                            {/* Carrier Section Ends Here */}

                            {/* Conceptos Section Starts Here */}
                            <FleteConcepts
                              columns={conceptTableColumns}
                              requiredFields={[
                                "description",
                                "quantity",
                                "unit_price",
                                "product",
                              ]}
                              tableData={conceptTableData}
                              isFlete={true}
                              setTableData={setConceptTableData}
                              productOptions={productOptions}
                              taxRateOptions={taxRateOptions}
                              conceptosError={conceptosError}
                            />
                            {/* Conceptos Section Ends Here */}

                            {/* Marcancias Section Starts Here */}
                            <FleteGoods
                              columns={goodsTableColumns}
                              materialOptions={materialOptions}
                              packagingOption={packagingOption}
                              values={values}
                              touched={touched}
                              isFileUploaded={isFileUploaded}
                              setIsFileUploaded={setIsFileUploaded}
                              tableData={goodsTableData}
                              trafficOptions={trafficOptions}
                              setTableData={setGoodsTableData}
                              selectedFiles={selectedFiles}
                              goodsError={goodsError}
                              setSelectedFiles={setSelectedFiles}
                              productOptions={productOptions}
                              resetUploadModal={resetUploadModal}
                              setUploadExcelLoader={setUploadExcelLoader}
                              uploadExcelLoader={uploadExcelLoader}
                              uploadError={uploadError}
                              excelXmlUpload={excelXmlUpload}
                              setExcelXmlUpload={setExcelXmlUpload}
                              setUploadError={setUploadError}
                              uploadModal={uploadModal}
                              setUploadModal={setUploadModal}
                            />
                            {/* Marcancias Section Ends Here */}

                            {/* Policies Section Starts Here */}
                            <Policies
                              handleChange={handleChange}
                              values={values}
                            />
                            {/* Policies Section Ends Here */}

                            {/* Figures Section Starts Here */}
                            <Figures
                              figureOptions={figureOptions}
                              figureError={figureError}
                              setFigureError={setFigureError}
                              figureList={figureList}
                              setFigureList={setFigureList}
                              transportTypes={transportTypes}
                            />
                            {/* Figures Section Ends Here */}

                            {/* Location Section Starts Here */}
                            <Location
                              locationOptions={locationOptions}
                              currentUser={currentUser}
                              locationList={locationList}
                              setLocationList={setLocationList}
                              locationError={locationError}
                            />
                            {/* Location Section Ends Here */}

                            <Row className="mt-4">
                              <Col md={24}>
                                {errorList.length > 0 &&
                                  errorList.map((err, index) => {
                                    return (
                                      <Row key={index}>
                                        <Col md={24}>
                                          <div
                                            className={
                                              "alert alert-danger m-0 mt-3"
                                            }
                                          >
                                            {err}
                                          </div>
                                        </Col>
                                      </Row>
                                    );
                                  })}
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col md={24}>
                                <FormGroup className="text-left">
                                  {btnSpinner ? (
                                    <Button
                                      className="entityBtnDuplicate"
                                      disabled={true}
                                    >
                                      <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                      ></Spinner>
                                    </Button>
                                  ) : (
                                    <input
                                      key="back"
                                      className="entityBtn"
                                      type="submit"
                                      onClick={() =>
                                        customSubmit(values, isValid)
                                      }
                                      value={
                                        selectedFlete ? "Actualizar" : "Crear"
                                      }
                                    />
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                          </>
                        </Form>
                      )}
                    />
                  )}
                </div>
              </Cards>
            </Col>
          </Row>
        </Main>
      </>
    );
  }
};

export default React.memo(FleteContainer);
