export const fetchHelperTaxRate = (tax_rate, apiTaxRates) => {
    return new Promise((resolve, reject) => {
        let rateList = [];
        let usedList = [];
        tax_rate.map(item => {
            apiTaxRates.map(val => {
                if(val.attributes.catalog_tax_rate.id === item) {
                    rateList.push({
                        "tax_rateable_type": "ProductService",
                        "catalog_tax_rate_id": item,
                        "id": val.id
                    })
                    usedList.push(item);
                }
            })
        })
        tax_rate.map(item => {
            if(!usedList.includes(item)) {
                rateList.push({
                    "tax_rateable_type": "ProductService",
                    "catalog_tax_rate_id": item
                })
            }
        })
        apiTaxRates.map(val => {
            if(!usedList.includes(val.attributes.catalog_tax_rate.id)) {
                rateList.push({
                    "tax_rateable_type": "ProductService",
                    "catalog_tax_rate_id": val.attributes.catalog_tax_rate.id,
                    "id": val.id,
                    "_destroy": "1"
                })
                usedList.push(val.attributes.catalog_tax_rate.id);
            }
        })
        resolve(rateList);
    })
}