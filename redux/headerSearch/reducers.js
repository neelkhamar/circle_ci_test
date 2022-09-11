import actions from "./actions";

const { SEARCH_HEADER_SUCCESS, SEARCH_HEADER_ERR } = actions;
const staticData = [
  {
    id: 1,
    title: "AntDesign",
    count: 10000,
  },
  {
    id: 2,
    title: "Design UI",
    count: 10600,
  },

  {
    id: 3,
    title: "Bootstrap Design UI",
    count: 60100,
  },
  {
    id: 4,
    title: "Meterial design",
    count: 30010,
  },

  {
    id: 5,
    title: "AntDesign design language",
    count: 100000,
  },
];

const headerSearchReducer = (state = staticData, action) => {
  const { type, data, err } = action;
  switch (type) {
    case SEARCH_HEADER_SUCCESS:
      return data;
    case SEARCH_HEADER_ERR:
      return err;
    default:
      return state;
  }
};

export { headerSearchReducer };
