import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  amount: Yup.number()
    .required("Amount is required")
    .moreThan(0, "Amount must be greater than 0"),
  currency: Yup.string().required("Currency is required"),
  interval: Yup.string().required("Interval is required"),
});

export default schema;
