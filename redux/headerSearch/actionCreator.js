import actions from "./actions";
const initialState = [
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

const { searchHeaderBegin, searchHeaderSuccess, searchHeaderErr } = actions;

const headerSearchAction = (searchData) => {
  return async (dispatch) => {
    try {
      dispatch(searchHeaderBegin());
      const data = initialState.filter((item) => {
        return item.title.startsWith(searchData);
      });
      dispatch(searchHeaderSuccess(data));
    } catch (err) {
      dispatch(searchHeaderErr(err));
    }
  };
};

export { headerSearchAction };
