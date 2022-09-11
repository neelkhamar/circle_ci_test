import { Select, Tooltip } from "antd";
import FeatherIcon from "feather-icons-react";
import React, { Fragment, useEffect, useState } from "react";
import { FormGroup, Label, Row } from "reactstrap";
import { Button } from "../../buttons/buttons";

const Figures = ({
  transportTypes,
  setFigureList,
  figureList,
  figureOptions,
  figureError,
  setFigureError,
}) => {
  const [currentFigure, setCurrentFigure] = useState({
    figure: null,
    type: null,
    operator: false,
  });
  const selectHandler = (key, value, isOperator, operatorValue) => {
    if (isOperator) {
      setCurrentFigure({
        ...currentFigure,
        [key]: value,
        operator: operatorValue.includes("operator") ? true : false,
      });
    } else {
      setCurrentFigure({
        ...currentFigure,
        [key]: value,
      });
    }
  };

  const removeRow = (id) => {
    let list = figureList.filter((item) => item.id !== id);
    setFigureList(list);
  };

  const addRow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let showRequired = false;
    if (!currentFigure.operator && !currentFigure.type) {
      showRequired = true;
    }
    setFigureError({
      required: false,
      message: "",
    });
    let list = [...figureList];
    let valid = true;
    list.map((val) => {
      if (val.figure === currentFigure.figure) {
        valid = false;
      }
    });
    if (valid) {
      if (showRequired) {
        setFigureError({
          required: true,
          message: "Please select the type",
        });
      } else {
        list.push({
          figure: currentFigure.figure,
          type: currentFigure.type,
          operator: currentFigure.operator,
          id: Date.now(),
        });
        setFigureList(list);
        resetFigure();
      }
    } else {
      setFigureError({
        required: false,
        message: "Figure is already used. Please select a new figure",
      });
    }
  };

  const resetFigure = () => {
    setCurrentFigure({
      figure: null,
      type: null,
      operator: false,
    });
  };

  const getRow = (item) => {
    return (
      <Row className="ant-row">
        <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
          <FormGroup>
            <Label className="form-label">
              Figura<span className="red-color">*</span>
            </Label>
            <Select
              name="figure"
              placeholder="Figura"
              disabled={true}
              className={
                "form-control p-0" +
                (figureError.required && !item.figure ? " is-invalid" : "")
              }
              value={item.figure}
              onChange={
                (val, e) => selectHandler("figure", val, true, e.key)
                // selectHandler(item.id, "figure", val, true, item.kind)
              }
            >
              {figureOptions.map((item, index) => {
                return (
                  <Select.Option value={item.id} key={item.kind + "-" + index}>
                    {item.kind + "-" + item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </FormGroup>
        </div>
        {!item.operator ? (
          <>
            <div className="ant-col ant-col-xs-22 ant-col-xl-11 mt-3">
              <FormGroup>
                <Label className="form-label">
                  Transporte rentado o prestado
                  <span className="red-color">*</span>
                </Label>
                <Select
                  name="type"
                  disabled={true}
                  placeholder="Seleccionar tipo de transporte"
                  className={
                    "form-control p-0" +
                    (figureError.required && !item.type ? " is-invalid" : "")
                  }
                  value={item.type}
                  onChange={(val) => selectHandler("type", val, false, "")}
                >
                  {transportTypes.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-2 ant-col-xl-1 mt-3">
              <Label className="form-label opacity0"></Label>
              <div className="pt-3 pb-2 pl-1">
                <Tooltip title="Remove">
                  <FeatherIcon
                    icon="trash"
                    onClick={(e) => removeRow(item.id)}
                    size={16}
                  />
                </Tooltip>
              </div>
            </div>
          </>
        ) : (
          <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
            <Label className="form-label opacity0"></Label>
            <div className="pt-3 pb-2 pl-1">
              <Tooltip title="Remove">
                <FeatherIcon
                  icon="trash"
                  onClick={(e) => removeRow(item.id)}
                  size={16}
                />
              </Tooltip>
            </div>
          </div>
        )}
      </Row>
    );
  };

  return (
    <Row className="ant-row mt-4 card_container">
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
        <span className="ant-page-header-heading-title">
          Figuras (Operadores, propietarios y arrendatarios)
        </span>
      </div>
      {figureList.map((item, index) => {
        return <Fragment key={index}>{getRow(item)}</Fragment>;
      })}
      <Row className="ant-row">
        <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
          <FormGroup>
            <Label className="form-label">
              Figura<span className="red-color">*</span>
            </Label>
            <Select
              name="figure"
              placeholder="Figura"
              className={
                "form-control p-0" +
                (figureError.required && !currentFigure.figure
                  ? " is-invalid"
                  : "")
              }
              value={currentFigure.figure}
              onChange={(val, e) => selectHandler("figure", val, true, e.key)}
            >
              {figureOptions.map((item, index) => {
                return (
                  <Select.Option value={item.id} key={item.kind + "-" + index}>
                    {item.kind + "-" + item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </FormGroup>
        </div>
        {!currentFigure.operator ? (
          <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
            <FormGroup>
              <Label className="form-label">
                Transporte rentado o prestado
                <span className="red-color">*</span>
              </Label>
              <Select
                name="type"
                placeholder="Seleccionar tipo de transporte"
                className={
                  "form-control p-0" +
                  (figureError.required && !currentFigure.type
                    ? " is-invalid"
                    : "")
                }
                value={currentFigure.type}
                onChange={(val) => selectHandler("type", val, false, "")}
              >
                {transportTypes.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormGroup>
          </div>
        ) : null}
      </Row>
      {figureError.message ? (
        <div className="ant-col ant-col-xs-24 ant-col-xl-24" id="figure_error">
          <div className={"alert alert-danger m-0 mt-3"}>
            {figureError.message}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="ant-col ant-col-xs-24 ant-col-xl-24">
        <Button
          size="small"
          key="4"
          className="add_file_btn"
          onClick={addRow}
          type="primary"
        >
          Agregar
        </Button>
      </div>
    </Row>
  );
};

export default React.memo(Figures);
