export const fetchHelperRegime = (
  regime,
  requiredRegime,
  selectedRegimeOption
) => {
  return new Promise((resolve, reject) => {
    let regimes = [];
    let usedRegime = [];
    if (regime.length) {
      regime.map((val) => {
        if (!usedRegime.includes(val)) {
          usedRegime.push(val);
          if (requiredRegime.includes(val)) {
            let objId = "";
            selectedRegimeOption.map((item) => {
              if (val === item.catalog_tax_regime.id) {
                objId = item.id;
              }
            });
            regimes.push({
              tax_regimeable_type: "Customer",
              catalog_tax_regime_id: val,
              id: objId,
            });
          } else {
            regimes.push({
              tax_regimeable_type: "Customer",
              catalog_tax_regime_id: val,
            });
          }
        }
      });
      selectedRegimeOption.map((item) => {
        if (!usedRegime.includes(item.catalog_tax_regime.id)) {
          regimes.push({
            tax_regimeable_type: "Customer",
            catalog_tax_regime_id: item.catalog_tax_regime.id,
            id: item.id,
            _destroy: 1,
          });
        }
      });
    }
    resolve(regimes);
  });
};

export const fetchHelperProduct = (selectedProduct, originalList) => {
  return new Promise((resolve, reject) => {
    let occupiedClass = [];
    let usedClass = [];
    let finalClasses = [];
    Object.keys(selectedProduct).map((key) => {
      if (selectedProduct[key].length) {
        selectedProduct[key].map((val) => {
          if (!occupiedClass.includes(val.catalog_product_category_id)) {
            occupiedClass.push(val.catalog_product_category_id);
          }
        });
      }
    });
    // Already present categories
    originalList.map((div) => {
      div.groups.map((group) => {
        group.classes.map((clase) => {
          occupiedClass.map((occupied) => {
            if (clase.id === occupied) {
              usedClass.push(occupied);
              finalClasses.push({
                id: clase.customer_product_category_id,
                catalog_product_category_id: clase.id.toString(),
              });
            }
          });
        });
      });
    });

    // New categories
    occupiedClass.map((selected) => {
      if (!usedClass.includes(selected)) {
        usedClass.push(selected);
        finalClasses.push({
          catalog_product_category_id: selected,
        });
      }
    });

    // Removed categories
    originalList.map((div) => {
      div.groups.map((group) => {
        group.classes.map((clase) => {
          if (!usedClass.includes(clase.id)) {
            finalClasses.push({
              catalog_product_category_id: clase.id,
              id: clase.customer_product_category_id,
              _destroy: "1",
            });
          }
        });
      });
    });
    resolve(finalClasses);
  });
};
