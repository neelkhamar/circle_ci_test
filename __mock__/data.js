import { ErrorMessages } from "../components/Common/Data/errorMessages";

export const vehicleData = [
  {
    id: 1,
    brand: "Ford",
    model: "Figo",
    year: 2004,
    serie_number: "YDK8348HDI3847",
    catalog_vehicle_type: {
      code: "T_123",
      name: "Ford Figo",
    },
    license_plate: "YDK8348",
    has_freights: false,
    insurer_name: "LIC",
    insurance_policy_number: "Jeevan Bema",
  },
  {
    id: 2,
    brand: "BMW",
    model: "A5",
    year: 2018,
    serie_number: "YDK8348HDI3444",
    catalog_vehicle_type: {
      code: "T_521",
      name: "BMW A5",
    },
    license_plate: "SFK6041",
    has_freights: true,
    insurer_name: "Paisa Bazaar",
    insurance_policy_number: "Jeevan Raksha",
  },
];

export const vehicleInputElements = [
  {
    placeHolder: "Ingrese Placa",
    field: "license_plate",
    value: "YDJ2841",
    required: true,
    errorMessage: ErrorMessages.numberPlate_required,
  },
  {
    placeHolder: "Ingrese Identificacion Vehicular",
    field: "serie_number",
    value: "73248937428729189",
    required: true,
    errorMessage: ErrorMessages.seriel_number_required,
  },
  {
    placeHolder: "Ingrese Marca",
    field: "brand",
    value: "Ford",
    required: true,
    errorMessage: ErrorMessages.brand_required,
  },
  {
    placeHolder: "Ingrese Modelo",
    field: "model",
    value: "SX4",
    required: true,
    errorMessage: ErrorMessages.model_required,
  },
  {
    placeHolder: "Ingrese Ano",
    field: "year",
    value: 2004,
    required: true,
    errorMessage: ErrorMessages.year_required,
  },
  {
    placeHolder: "Ingrese Nombre Aseguradora",
    field: "insurer_name",
    value: "John Doe",
    required: true,
    errorMessage: ErrorMessages.insurer_name_required,
  },
  {
    placeHolder: "Ingrese Numero de Poliza",
    field: "insurance_policy_number",
    value: "6734628767",
    required: true,
    errorMessage: ErrorMessages.insurance_policy_number_required,
  },
];
