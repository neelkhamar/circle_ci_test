import { Col, Row } from "reactstrap";
import { Field, FormItem, Select } from "formik-antd";
import React, { useEffect, useState } from "react";
import { FormGroup, Label } from "reactstrap";
import { LoadingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Tree } from "antd";

function ProductCategory({
  handleBlur,
  values,
  productOptions,
  productCategoryOptions,
  setLocation,
  location,
  searchCategoryList,
  searchSpinner,
  productCategoryList,
  expandedKeys,
  setExpandedKeys,
  checkedKeys,
  setCheckedKeys,
  setTreeData,
  treeData,
  selectedProduct,
  setSelectedProduct,
}) {
  const [productError, setProductError] = useState("");

  const submitSearch = () => {
    if (location.class || location.group || location.search) {
      setProductError("");
      searchCategoryList();
    } else {
      setProductError(
        "Select at least Tipo, Division and Grupo or type something in the search to fetch the results."
      );
    }
  };

  const resetProduct = () => {
    setLocation({
      ...values,
      type: "",
      division: "",
      class: "",
      group: "",
      search: "",
    });
  };
  useEffect(() => {
    if (productCategoryList.length) {
      let list = [];
      let expanded = [];
      productCategoryList.map((item) => {
        if (!item.name.includes("no existe")) {
          let obj = {
            title: <span className="fweightBold">{item.name}</span>,
            key: item.code,
            checkable: false,
            children: [],
          };
          expanded.push(item.code);
          item.groups.map((group) => {
            let currentGroup = {
              title: (
                <span className="fweightBold greenColor">
                  {group.code + " - " + group.name}
                </span>
              ),
              key: group.code,
              children: [],
            };
            expanded.push(group.code);
            group.classes.map((clase) => {
              let currentClass = {
                title: (
                  <span className="fweightBold orangeColor">
                    {clase.code + " - " + clase.name}
                  </span>
                ),
                key: clase.id + "|class|" + group.code,
                children: [],
              };
              clase.products.map((product) => {
                currentClass.children.push({
                  title: (
                    <span className="fweightBold">
                      <span className="greenColor">{product.code}</span> -{" "}
                      <span className="blueColor">{product.name}</span>
                    </span>
                  ),
                  checkable: false,
                  key: product.code,
                });
              });
              currentGroup.children.push(currentClass);
            });
            obj.children.push(currentGroup);
          });
          list.push(obj);
        }
      });
      setTreeData(list);
      setExpandedKeys(expanded);
    }
  }, [productCategoryList]);

  const checkHandler = (list, change) => {
    let container = {};
    list.map((val) => {
      if (val.includes("class")) {
        let key = val.split("|class|")[1];
        if (!container[key]) {
          container[val.split("|class|")[1]] = [];
        }
        container[val.split("|class|")[1]].push({
          catalog_product_category_id: val.split("|class")[0],
        });
      }
    });

    if (change && change.halfCheckedKeys.length === 0 && !change.checked) {
      if (change.node.key.includes("|class|")) {
        container[change.node.key.split("|class|")[1]] = [];
      } else {
        container[change.node.key] = [];
      }
    }

    let products = { ...selectedProduct };
    Object.keys(container).map((val) => {
      products[val] = container[val];
    });
    setSelectedProduct({
      ...products,
    });
  };

  useEffect(() => {
    checkHandler(checkedKeys);
  }, [checkedKeys]);

  return (
    <Row gutter={25}>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-1 w-50">
        <FormGroup>
          <div>
            <Label className="form-label">Tipo</Label>
            <FormItem name="type">
              <Select
                showSearch
                name="type"
                onBlur={handleBlur}
                placeholder="Tipo"
                className={"form-control p-0"}
                value={values.type}
                onChange={(val) => {
                  setLocation({
                    ...values,
                    type: val,
                  });
                  productCategoryOptions("division", val);
                }}
                filterOption={(input, option) => {
                  let str = "";
                  option.children.map((item) => {
                    str = str + item;
                  });
                  return str.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {productOptions.type.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.code} - {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-1 w-50">
        <FormGroup>
          <div>
            <Label className="form-label">Division</Label>
            <FormItem name="division">
              <Select
                showSearch
                name="division"
                onBlur={handleBlur}
                placeholder="Division"
                className={"form-control p-0"}
                value={values.division}
                onChange={(val) => {
                  setLocation({
                    ...values,
                    division: val,
                  });
                  productCategoryOptions("group", val);
                }}
                filterOption={(input, option) => {
                  let str = "";
                  option.children.map((item) => {
                    str = str + item;
                  });
                  return str.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {productOptions.division.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.code} - {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 w-50">
        <FormGroup>
          <div>
            <Label className="form-label">Grupo</Label>
            <FormItem name="group">
              <Select
                showSearch
                name="group"
                onBlur={handleBlur}
                placeholder="Grupo"
                className={"form-control p-0"}
                value={values.group}
                onChange={(val) => {
                  setLocation({
                    ...values,
                    group: val,
                  });
                  productCategoryOptions("class", val);
                }}
                filterOption={(input, option) => {
                  let str = "";
                  option.children.map((item) => {
                    str = str + item;
                  });
                  return str.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {productOptions.group.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.code} - {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 w-50">
        <FormGroup>
          <div>
            <Label className="form-label">Clase</Label>
            <FormItem name="class">
              <Select
                showSearch
                name="class"
                onBlur={handleBlur}
                placeholder="Clase"
                className={"form-control p-0 w50"}
                value={values.class}
                onChange={(val) => {
                  setLocation({
                    ...values,
                    class: val,
                  });
                }}
                filterOption={(input, option) => {
                  let str = "";
                  option.children.map((item) => {
                    str = str + item;
                  });
                  return str.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {productOptions.class.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.code} - {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-24">
        <FormGroup>
          <div>
            <Label className="form-label">Producto o Servicio</Label>
            <FormItem name="search">
              <Field
                name="search"
                type="text"
                className={"form-control"}
                placeholder="escribir nombre o clave"
                value={values.search}
                onChange={(e) => {
                  setLocation({
                    ...values,
                    search: e.currentTarget.value,
                  });
                }}
              />
            </FormItem>
          </div>
        </FormGroup>
      </div>
      {productError && (
        <Col md={24}>
          <div className={"alert alert-danger m-0 mt-1 mb-3"}>
            {productError}
          </div>
        </Col>
      )}
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 d-flex">
        <FormGroup className="mr-3">
          {searchSpinner ? (
            <Button className="entityBtnDuplicate" disabled={true}>
              <LoadingOutlined style={{ fontSize: 20 }} spin />
            </Button>
          ) : (
            <input
              key="back"
              className={`entityBtn`}
              type="button"
              onClick={submitSearch}
              value={"Buscar"}
            />
          )}
        </FormGroup>
        <FormGroup>
          {
            <input
              key="back"
              className={`entityBtn`}
              type="button"
              onClick={resetProduct}
              value={"Limpiar resultados"}
            />
          }
        </FormGroup>
      </div>

      {treeData.length ? (
        <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-4">
          <Tree
            checkable
            showLine={true}
            defaultExpandedKeys={expandedKeys}
            // defaultSelectedKeys={['0-0-0', '0-0-1']}
            defaultCheckedKeys={checkedKeys}
            // onSelect={onSelect}
            onChange={(e) => console.log(e)}
            onCheck={checkHandler}
            treeData={treeData}
          />
        </div>
      ) : null}
    </Row>
  );
}

export default ProductCategory;
