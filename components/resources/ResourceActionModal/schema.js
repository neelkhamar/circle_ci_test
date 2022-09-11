import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  route_path: Yup.string().required("Route path is required"),
  http_method: Yup.string().required("Method is required"),
});

export default schema;
