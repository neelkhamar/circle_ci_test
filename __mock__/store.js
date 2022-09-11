import configureStore from "redux-mock-store";

export const mockStore = (initialState) => {
  const mockStore = configureStore();

  return mockStore(initialState);
};
