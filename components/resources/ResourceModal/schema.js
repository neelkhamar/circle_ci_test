import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  namespace: Yup.string().required('Namespace is required'),
});

export default schema;
