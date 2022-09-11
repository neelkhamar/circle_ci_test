export const fetchHelperConceptos = (conceptTableData, cacheData, units) => {
  return new Promise((resolve, reject) => {
    let usedConceptos = [];
    let conceptos = [];
    conceptTableData.map((val) => {
      cacheData.cfdi_concepts.map((item) => {
        if (val.id === item.id) {
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
          if (!val.new) {
            obj["id"] = val.id;
          }
          let usedRates = [];
          val.tax_rate.map((x) => {
            item.tax_rates.map((y) => {
              if (x === y.catalog_tax_rate.id) {
                obj["tax_rates_attributes"].push({
                  tax_rateable_type: "CfdiConcept",
                  catalog_tax_rate_id: x,
                  id: y.id,
                });
                usedRates.push(x);
              }
            });
          });
          val.tax_rate.map((x) => {
            if (!usedRates.includes(x)) {
              obj["tax_rates_attributes"].push({
                tax_rateable_type: "CfdiConcept",
                catalog_tax_rate_id: x,
              });
              usedRates.push(x);
            }
          });
          item.tax_rates.map((y) => {
            if (!usedRates.includes(y.catalog_tax_rate.id)) {
              obj["tax_rates_attributes"].push({
                tax_rateable_type: "CfdiConcept",
                catalog_tax_rate_id: y.catalog_tax_rate.id,
                id: y.id,
                _destroy: "1",
              });
            }
          });
          conceptos.push(obj);
          usedConceptos.push(val.id);
        }
      });
    });

    conceptTableData.map((val) => {
      if (!usedConceptos.includes(val.id)) {
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
      }
    });

    cacheData.cfdi_concepts.map((item) => {
      if (!usedConceptos.includes(item.id)) {
        let obj = {
          product_service_id: item.product_service.data.id,
          catalog_measurement_unit_id: units[item.product_service.data.id],
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          percentage: item.discount_percentage,
          tax: item.tax,
          subtotal: item.subtotal,
          tax_rates_attributes: [],
          id: item.id,
          _destroy: "1",
        };
        conceptos.push(obj);
      }
    });
    resolve(conceptos);
  });
};

export const fetchHelperRemolque = (values, cacheData) => {
  return new Promise((resolve, reject) => {
    let usedRemolque = [];
    let remolque = [];
    values.remolque.map((item) => {
      cacheData.freight_vehicles.map((val) => {
        if (item === val.vehicle.id) {
          usedRemolque.push(item);
          remolque.push({
            id: val.id,
            vehicle_id: item,
          });
        }
      });
    });
    values.remolque.map((item) => {
      if (!usedRemolque.includes(item)) {
        usedRemolque.push(item);
        remolque.push({
          vehicle_id: item,
        });
      }
    });
    cacheData.freight_vehicles.map((val) => {
      if (!usedRemolque.includes(val.vehicle.id)) {
        usedRemolque.push(val.vehicle.id);
        remolque.push({
          id: val.id,
          vehicle_id: val.vehicle.id,
          _destroy: "1",
        });
      }
    });
    resolve(remolque);
  });
};

export const fetchHelperGoods = (goodsTableData, cacheData, trafficOptions) => {
  return new Promise((resolve, reject) => {
    let usedGoods = [];
    let goods = [];
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
      if (!val.new) {
        obj["id"] = val.id;
      }
      usedGoods.push(val.id);
      goods.push(obj);
    });
    cacheData.freight_goods.map((item) => {
      if (!usedGoods.includes(item.id)) {
        let obj = {
          product_service_id: item.product_service.data.id,
          catalog_hazardous_material_id: "",
          catalog_packaging_id: "",
          catalog_tariff_fraction_id: "",
          description: item.description,
          quantity: item.quantity,
          kg: item.kg,
          price: item.price,
          cfdi_invoice_number: item.cfdi_invoice_number,
          importation_request_number: item.importation_request_number,
          id: item.id,
          _destroy: "1",
        };
        goods.push(obj);
      }
    });
    resolve(goods);
  });
};
