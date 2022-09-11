import moment from "moment";
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
// import "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap";

function PdfTemplate({ data }) {
  const tipoOptions = {
    1: "Autotransporte Federal",
    2: "Transporte Maritimo",
    3: "Transporte Aereo",
    4: "Transporte Ferroviario",
    5: "Ducto",
  };
  const [remolque, setRemolque] = useState({
    tipo1: "",
    tipo2: "",
    placa1: "",
    placa2: "",
  });

  const getGoodsKg = (freight_goods) => {
    if (freight_goods && freight_goods.length) {
      let sum = 0;
      freight_goods.map((item) => {
        sum = sum + parseInt(item.attributes.kg);
      });
      return sum;
    } else {
      return 0;
    }
  };

  const calculateDistance = (locations) => {
    if (locations && locations.length) {
      let distance = 0;
      locations.map((item) => {
        if (item.attributes.location_type === "destination") {
          distance = item.attributes.km;
        }
      });
      return distance;
    } else {
      return 0;
    }
  };

  const capitalCase = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    if (data && data.attributes.freight_vehicles?.data.length) {
      let val = { ...remolque };
      data.attributes.freight_vehicles.data.map((item, index) => {
        val[`tipo${index + 1}`] =
          item.attributes.vehicle.brand + " " + item.attributes.vehicle.model;
        val[`placa${index + 1}`] = item.attributes.vehicle.license_plate;
      });
      setRemolque(val);
    }
  }, [data]);

  return (
    <>
      <div className="container-fluid p-0">
        <table className="invoice-container">
          <tbody>
            <tr>
              <td colSpan="4" className="col-4"></td>
              <td colSpan="4" className="col-4"></td>
              <td colSpan="4" className="col-4">
                <h5 className="title-1 background-1 p-1 pl-3">
                  FACTURA CON COMPLEMENTO CARTA PORTE
                </h5>
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="col-4 p-2 text-center">
                <img
                  src="/img/pdf_logo.png"
                  className="opacity0"
                  width="100%"
                />
              </td>
              <td colSpan="4" className="col-4 p-1">
                <span className="d-flex">
                  <span className="bold-points">Folio: </span>{" "}
                  <span className="values">FLE00000</span>
                </span>
                <span className="d-flex">
                  <span className="bold-points">Folio Fiscal: </span>{" "}
                  <span className="values">Value</span>
                </span>
                <span className="d-flex">
                  <span className="bold-points">Fecha emisión: </span>{" "}
                  <span className="values">Value</span>
                </span>
              </td>
              <td colSpan="4" className="col-4">
                <span className="d-flex">
                  <span className="values">
                    <span className="bold-points pr-1">Tipo permiso SCT: </span>
                    {data?.attributes.catalog_sct_type.name}
                  </span>
                </span>
                <span className="d-flex">
                  <span className="values">
                    <span className="bold-points pr-1">
                      Número de permiso SCT:{" "}
                    </span>
                    {data?.attributes.sct_number}
                  </span>
                </span>
              </td>
            </tr>
            <tr>
              <td colSpan="6" className="col-6">
                <h5 className="title-1 background-2 p-1 text-center">EMISOR</h5>
              </td>
              <td colSpan="6" className="col-6">
                <h5 className="title-1 background-2 p-1 text-center">
                  RECEPTOR
                </h5>
              </td>
            </tr>
            <tr>
              <td colSpan="6" className="col-6 p-2">
                <h6 className="bold-points">
                  {data?.attributes.my_company.name}
                </h6>
                {/* <p className="values">The King in the North SA de CV</p> */}
                <p className="values">{data?.attributes.my_company.rfc}</p>
                <p className="values">{data?.attributes.my_company.address}</p>
                <p className="values">TEL: 7822209027</p>
                <span className="d-flex">
                  <span className="values">
                    <span className="bold-points pr-1">Régimen Fiscal: </span>
                    612
                  </span>
                </span>
              </td>
              <td colSpan="6" className="col-6 p-2">
                <h6 className="bold-points">
                  {data?.attributes.customer.name}
                </h6>
                <p className="values">{data?.attributes.customer.rfc}</p>
                <p className="values">{data?.attributes.customer.address}</p>
                {/* <p className="values">C.P. 80020</p>
                                <p className="values">Sinaloa</p> */}
                <p className="values">
                  TEL: {data?.attributes.customer.telephone}
                </p>
              </td>
            </tr>
            <tr>
              <td colSpan="12" className="col-12">
                <h4 className="title-1 background-2 p-2 text-center">
                  DATOS GENERALES
                </h4>
              </td>
            </tr>
            <tr>
              <td className="col-3 p-2" colSpan="3">
                <h6 className="bold-points text-center">
                  Transporte Internacional
                </h6>
                <p className="values text-center">
                  {data?.attributes.international_flag ? "Yes" : "No"}
                </p>
              </td>
              <td className="col-3 p-1" colSpan="3">
                <h6 className="bold-points text-center">
                  Entrada/Salida de territorio nacional
                </h6>
                <p className="values text-center">
                  {data?.attributes.international_moving_type === 1
                    ? "Entrada"
                    : "Salida"}
                </p>
              </td>
              <td className="col-3 p-1" colSpan="3">
                <h6 className="bold-points text-center">
                  País origen/destino internacional
                </h6>
                <p className="values text-center">
                  {data?.attributes.catalog_country?.name}
                </p>
              </td>
              <td className="col-3 p-1" colSpan="3">
                <h6 className="bold-points text-center">
                  Vía de Transporte Internacional
                </h6>
                <p className="values text-center">
                  {tipoOptions[data?.attributes.international_note_type]}
                </p>
              </td>
            </tr>
            <tr>
              <td className="col-4 p-1" colSpan="4">
                <h6 className="bold-points text-center">
                  Peso bruto total de la mercancia
                </h6>
                <p className="values text-center">
                  {getGoodsKg(data?.attributes.freight_goods.data)}
                </p>
                {/* kg (unidad: KGM) */}
              </td>
              <td className="col-4 p-1" colSpan="4">
                <h6 className="bold-points text-center">
                  Numero total de mercancias
                </h6>
                <p className="values text-center">
                  {data?.attributes.freight_goods.data.length || 0}
                </p>
              </td>
              <td className="col-4 p-1" colSpan="4">
                <h6 className="bold-points text-center">
                  Total distancia recorrida
                </h6>
                <p className="values text-center">
                  {calculateDistance(data?.attributes.freight_locations.data)}{" "}
                  km
                </p>
              </td>
            </tr>
            <tr>
              <td colSpan="12" className="col-12">
                <h4 className="title-1 background-2 p-2 text-center">
                  DATOS DEL VEHICULO
                </h4>
              </td>
            </tr>
            <tr>
              <td className="col-8 p-1" colSpan="8">
                <h6 className="bold-points text-center">
                  Configuración vehicular
                </h6>
                <p className="values text-center">
                  {data?.attributes.vehicle.brand +
                    " - " +
                    data?.attributes.vehicle.model}
                </p>
              </td>
              <td className="col-2 p-1" colSpan="2">
                <h6 className="bold-points text-center">Placa</h6>
                <p className="values text-center">
                  {data?.attributes.vehicle.license_plate}
                </p>
              </td>
              <td className="col-2 p-1" colSpan="2">
                <h6 className="bold-points text-center">Año</h6>
                <p className="values text-center">
                  {data?.attributes.vehicle.year}
                </p>
              </td>
            </tr>
            <tr>
              <td className="col-3 p-1" colSpan="3">
                <h6 className="bold-points text-center">Remolque 1 tipo</h6>
                <p className="values text-center">{remolque.tipo1 || "---"}</p>
              </td>
              <td className="col-3 p-1" colSpan="3">
                <h6 className="bold-points text-center">Remolque 1 placa</h6>
                <p className="values text-center">{remolque.placa1 || "---"}</p>
              </td>
              <td className="col-3 p-1" colSpan="3">
                <h6 className="bold-points text-center">Remolque 2 tipo</h6>
                <p className="values text-center">{remolque.tipo2 || "---"}</p>
              </td>
              <td className="col-3 p-1" colSpan="3">
                <h6 className="bold-points text-center">Remolque 2 placa</h6>
                <p className="values text-center">{remolque.placa2 || "---"}</p>
              </td>
            </tr>
            <tr>
              <td colSpan="12" className="col-12">
                <h4 className="title-1 p-2 text-center">
                  CONCEPTOS DEL SERVICIO
                </h4>
              </td>
            </tr>
            <tr>
              <td className="col-2 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">ClaveProdServ</h6>
              </td>
              <td className="col-2 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">Cantidad</h6>
              </td>
              <td className="col-2 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">Unidad</h6>
              </td>
              <td className="col-6 p-2 background-2" colSpan="6">
                <h6 className="bold-points text-center">Descripción</h6>
              </td>
            </tr>
            {data &&
              data.attributes.cfdi_concepts.data.map((val, index) => {
                return (
                  <tr key={index}>
                    <td className="col-2 p-2" colSpan="2">
                      <h6 className="values text-center">
                        {
                          val.attributes.product_service.data.attributes
                            .catalog_product_service.code
                        }
                      </h6>
                    </td>
                    <td className="col-2 p-2" colSpan="2">
                      <h6 className="values text-center">
                        {val.attributes.quantity}
                      </h6>
                    </td>
                    <td className="col-2 p-2" colSpan="2">
                      <h6 className="values text-center">
                        {
                          val.attributes.product_service.data.attributes
                            .catalog_measurement_unit.name
                        }
                      </h6>
                    </td>
                    <td className="col-6 p-2" colSpan="6">
                      <h6 className="values text-center">
                        {val.attributes.description}
                      </h6>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan="12" className="col-12">
                <h4 className="title-1 p-2 text-center">
                  DESCRIPCIÓN DE LAS MERCANCIAS A TRANSPORTAR
                </h4>
              </td>
            </tr>
            <tr>
              <td className="col-1 p-2 background-2" colSpan="1">
                <h6 className="bold-points text-center">BienesTransp</h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="1">
                <h6 className="bold-points text-center">Cantidad</h6>
              </td>
              <td className="col-2 p-2 background-2" colSpan="3">
                <h6 className="bold-points text-center">Descripción</h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">Unidad</h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="1">
                <h6 className="bold-points text-center">Peso kg</h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="1">
                <h6 className="bold-points text-center">Material peligroso</h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="1">
                <h6 className="bold-points text-center">Embalaje</h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="1">
                <h6 className="bold-points text-center">
                  Fraccion arancelaria
                </h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="1">
                <h6 className="bold-points text-center">Pedimento</h6>
              </td>
            </tr>
            {data &&
              data.attributes.freight_goods.data.map((val, index) => {
                return (
                  <tr key={index}>
                    <td className="col-1 p-2" colSpan="1">
                      <h6 className="values text-center">
                        {
                          val.attributes.product_service.data.attributes
                            .catalog_product_service.code
                        }
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="1">
                      <h6 className="values text-center">
                        {val.attributes.quantity}
                      </h6>
                    </td>
                    <td className="col-2 p-2" colSpan="3">
                      <h6 className="values text-center">
                        {val.attributes.description}
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="2">
                      <h6 className="values text-center">
                        {
                          val.attributes.product_service.data.attributes
                            .catalog_measurement_unit.name
                        }
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="1">
                      <h6 className="values text-center">
                        {val.attributes.kg}
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="1">
                      <h6 className="values text-center">
                        {val.attributes.catalog_hazardous_material?.name}
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="1">
                      <h6 className="values text-center">
                        {val.attributes.catalog_packaging?.name}
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="1">
                      <h6 className="values text-center">
                        {val.attributes.catalog_tariff_fraction?.name}
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="1">
                      <h6 className="values text-center">
                        {val.attributes.importation_request_number}
                      </h6>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan="12" className="col-12">
                <h4 className="title-1 p-2 text-center">
                  ORIGENES, DESTINOS Y PUNTOS INTERMEDIOS
                </h4>
              </td>
            </tr>
            <tr>
              <td className="col-1 p-2 background-2" colSpan="1">
                <h6 className="bold-points text-center">Tipo</h6>
              </td>
              <td className="col-4 p-2 background-2" colSpan="6">
                <h6 className="bold-points text-center">Dirección</h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="3">
                <h6 className="bold-points text-center">
                  Fecha Salida/Llegada
                </h6>
              </td>
              <td className="col-1 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">Kms. Recorridos</h6>
              </td>
            </tr>
            {data &&
              data.attributes.freight_locations.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="col-1 p-2" colSpan="1">
                      <h6 className="values text-center">
                        {capitalCase(item.attributes.location_type)}
                      </h6>
                    </td>
                    <td className="col-4 p-2" colSpan="6">
                      <h6 className="values text-center">
                        {item.attributes.location.address}
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="3">
                      <h6 className="values text-center">
                        {moment(item.attributes.departure_time).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </h6>
                    </td>
                    <td className="col-1 p-2" colSpan="2">
                      <h6 className="values text-center">
                        {item.attributes.km}
                      </h6>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan="12" className="col-12">
                <h4 className="title-1 p-2 text-center">SEGUROS</h4>
              </td>
            </tr>
            <tr>
              <td className="col-4 p-2 background-2" colSpan="4">
                <h6 className="bold-points text-center">Tipo</h6>
              </td>
              <td className="col-4 p-2 background-2" colSpan="4">
                <h6 className="bold-points text-center">Aseguradora</h6>
              </td>
              <td className="col-4 p-2 background-2" colSpan="4">
                <h6 className="bold-points text-center">Póliza</h6>
              </td>
            </tr>
            {data?.attributes.merchandise_insurance_name ? (
              <tr>
                <td className="col-4 p-2" colSpan="4">
                  <h6 className="values text-center">Mercancias</h6>
                </td>
                <td className="col-4 p-2" colSpan="4">
                  <h6 className="values text-center">
                    {data?.attributes.merchandise_insurance_name}
                  </h6>
                </td>
                <td className="col-4 p-2" colSpan="4">
                  <h6 className="values text-center">
                    {data?.attributes.merchandise_insurance_number}
                  </h6>
                </td>
              </tr>
            ) : null}
            {data?.attributes.environmental_damage_insurance_name ? (
              <tr>
                <td className="col-4 p-2" colSpan="4">
                  <h6 className="values text-center">Daño ambiental</h6>
                </td>
                <td className="col-4 p-2" colSpan="4">
                  <h6 className="values text-center">
                    {data?.attributes.environmental_damage_insurance_name}
                  </h6>
                </td>
                <td className="col-4 p-2" colSpan="4">
                  <h6 className="values text-center">
                    {data?.attributes.environmental_damage_insurance_number}
                  </h6>
                </td>
              </tr>
            ) : null}
            <tr>
              <td colSpan="12" className="col-12">
                <h4 className="title-1 p-2 text-center">
                  FIGURAS DE TRANSPORTE
                </h4>
              </td>
            </tr>
            <tr>
              <td className="col-2 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">Tipo</h6>
              </td>
              <td className="col-2 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">RFC/IdTrib</h6>
              </td>
              <td className="col-4 p-2 background-2" colSpan="4">
                <h6 className="bold-points text-center">Nombre</h6>
              </td>
              <td className="col-2 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">Licencia</h6>
              </td>
              <td className="col-2 p-2 background-2" colSpan="2">
                <h6 className="bold-points text-center">Residencia fiscal</h6>
              </td>
            </tr>
            {data &&
              data.attributes.freight_figures.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="col-2 p-2" colSpan="2">
                      <h6 className="values text-center">
                        {capitalCase(item.attributes.figure.kind)}
                      </h6>
                    </td>
                    <td className="col-2 p-2" colSpan="2">
                      <h6 className="values text-center">
                        {item.attributes.figure.rfc}
                      </h6>
                    </td>
                    <td className="col-4 p-2" colSpan="4">
                      <h6 className="values text-center">
                        {item.attributes.figure.name +
                          " " +
                          item.attributes.figure.last_name}
                      </h6>
                    </td>
                    <td className="col-2 p-2" colSpan="2">
                      <h6 className="values text-center">
                        {item.attributes.figure.license_number}
                      </h6>
                    </td>
                    <td className="col-2 p-2" colSpan="2">
                      <h6 className="values text-center">---</h6>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td
                colSpan="12"
                className="col-12 p-2 background-2 border-bottom-2"
              >
                <h4 className="title-1 text-center">
                  Sello Digital del Emisor
                </h4>
              </td>
            </tr>
            {data && data.attributes.cfdi.data ? (
              <tr>
                <td colSpan="12" className="col-12 border-bottom-2">
                  <span className="values">
                    <div className="bold-points p-2 fixed-width">
                      {data && data.attributes.cfdi.data
                        ? data.attributes.cfdi.data.attributes.stamp.signature
                        : ""}
                    </div>
                  </span>
                </td>
              </tr>
            ) : null}
            <tr>
              <td
                colSpan="12"
                className="col-12 p-2 background-2 border-bottom-2"
              >
                <h4 className="title-1 text-center">Sello Digital del SAT</h4>
              </td>
            </tr>
            {data && data.attributes.cfdi.data ? (
              <tr>
                <td colSpan="12" className="col-12 border-bottom-2 text-center">
                  <span className="values">
                    <span className="bold-points p-2">
                      {data && data.attributes.cfdi.data
                        ? data.attributes.cfdi.data.attributes.stamp
                            .sat_signature
                        : ""}
                    </span>
                  </span>
                </td>
              </tr>
            ) : null}
            <tr>
              <td
                colSpan="12"
                className="col-12 p-2 background-2 border-bottom-2"
              >
                <h4 className="title-1 text-center">Cadena Original</h4>
              </td>
            </tr>
            {data && data.attributes.cfdi.data ? (
              <tr>
                <td colSpan="12" className="col-12 text-left">
                  <span className="values">
                    <div className="bold-points p-2 fixed-width">
                      {data && data.attributes.cfdi.data
                        ? data.attributes.cfdi.data.attributes.stamp
                            .complement_string
                        : ""}
                    </div>
                  </span>
                </td>
              </tr>
            ) : null}
            <tr>
              <td className="col-6 p-1" colSpan="6">
                <span className="d-flex">
                  <span className="values">
                    <span className="bold-points pr-1">Certificado SAT: </span>
                    {data && data.attributes.cfdi.data
                      ? data.attributes.cfdi.data.attributes.stamp
                          .sat_cert_number
                      : ""}
                  </span>
                </span>
                {/* <span className="d-flex">
                                    <span className="values">
                                        <span className="bold-points pr-1">Certificado del emisor: </span> Value
                                    </span>
                                </span> */}
                <span className="d-flex">
                  <span className="values">
                    <span className="bold-points pr-1">
                      Fecha certificación:{" "}
                    </span>
                    {data && data.attributes.cfdi.data
                      ? moment(
                          data.attributes.cfdi.data.attributes.stamp.date
                        ).format("DD-MM-YYYY hh:mm")
                      : ""}
                  </span>
                </span>
              </td>
              <td className="col-6 p-1" colSpan="6">
                <span className="d-flex">
                  <span className="values">
                    <span className="bold-points pr-1">
                      Uso del comprobante:{" "}
                    </span>
                    {data && data.attributes.cfdi.data
                      ? data.attributes.cfdi.data.attributes.catalog_cfdi_use
                          .code +
                        "-" +
                        data.attributes.cfdi.data.attributes.catalog_cfdi_use
                          .name
                      : ""}
                  </span>
                </span>
                <span className="d-flex">
                  <span className="values">
                    <span className="bold-points pr-1">Tipo comprobante: </span>
                    {data && data.attributes.cfdi.data
                      ? data.attributes.cfdi.data.attributes.cfdi_type
                      : ""}
                  </span>
                </span>
                <span className="d-flex">
                  <span className="values">
                    <span className="bold-points pr-1">Moneda: </span>{" "}
                    {data?.attributes.catalog_currency.code}
                  </span>
                </span>
              </td>
            </tr>
            <tr>
              <td className="col-2 pt-3 pb-3 text-center" colSpan="2">
                {data && data.attributes.cfdi.data ? (
                  <QRCodeSVG
                    value={
                      data.attributes.cfdi.data.attributes.verification_url
                    }
                  />
                ) : null}
              </td>
              <td className="col-10 pt-3 pb-3" colSpan="10">
                {/* <span className="d-flex p-1">
                                    <span className="values">
                                        <span className="bold-points pr-1">Registró: </span> Cesar
                                    </span>
                                </span> */}
                <span className="d-flex background-2 p-1">
                  <span className="values">
                    <span className="bold-points pr-1">
                      Efectos Fiscales al pago{" "}
                    </span>
                  </span>
                </span>
                <span className="d-flex p-1">
                  <span className="values">
                    <span className="bold-points pr-1">
                      Este documento es una representación impresa de un CFDI{" "}
                    </span>
                  </span>
                </span>
                <div className="p-1 text-right porteton">
                  Documento emitido por porteton.com
                </div>
              </td>
            </tr>
            <tr className="col-12">
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
              <td className="col-1"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PdfTemplate;
