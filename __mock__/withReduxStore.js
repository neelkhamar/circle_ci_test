import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { mockStore } from "./store";

const initialState = {
  auth: {
    currentUser: {
      uid: "joel@gmail.com",
      accessToken: "2374983247",
      client: "78Yuiyaf3849BHJL",
      roles: [],
      userDetails: "",
      certsValidated: false,
    },
  },
};

export const store = mockStore(initialState);

export const renderWithStore = async (Component) => {
  let result = await act(async () =>
    render(<Provider store={store}>{Component}</Provider>)
  );
  return result;
};
