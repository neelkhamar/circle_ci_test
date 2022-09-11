import * as Yup from "yup";

const schema = Yup.object().shape({
  address_line1: Yup.string().nullable(),
  address_line2: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state: Yup.string().nullable(),
  country: Yup.string().nullable(),
  zip: Yup.string().nullable(),
  exp_year: Yup.number().min(
    new Date().getFullYear(),
    "Expire year must be greater than current year"
  ),
  exp_month: Yup.number().min(1).max(12),
});

export default schema;
