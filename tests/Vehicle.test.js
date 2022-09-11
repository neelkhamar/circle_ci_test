import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import VehicleModal from "../components/Common/Modals/vehicleModal";
import Vehicle from "../pages/moving-note/vehicles";
import { vehicleData, vehicleInputElements } from "../__mock__/data";
import server from "../__mock__/server/server";
import { renderWithStore } from "../__mock__/withReduxStore";

beforeAll(() => server.listen());

describe("Describe Vehicle Component", () => {
  beforeEach(async () => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(() => ({
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: jest.fn(),
      replace: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    }));

    await renderWithStore(<Vehicle />);
  });

  it("Test the title of the screen", async () => {
    const linkElement = screen.getByText(/Vehiculos/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("Check if create vehicle button is displayed on the screen", async () => {
    const linkElement = screen.getByText(/Nuevo/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("Test the fetch vehicle data and display vehicle data", async () => {
    const dataElement = await waitFor(() =>
      screen.getByTestId("vehicle-table")
    );
    expect(dataElement).toBeInTheDocument();

    // Check the row count for vehicle table
    const rowCount = screen.queryAllByTestId("vehicle-line-item");
    expect(rowCount.length).toBe(vehicleData.length);
  });

  it.each(vehicleData)(
    "Test if the delete icon is displayed/hidden properly for the vehicle that are linked to any flete",
    (item) => {
      // Check if delete icon is present or not
      const deleteElement = screen.queryByTestId(`delete-icon-${item.id}`);
      const dataElement = screen.queryByTestId(`action-container-${item.id}`);
      if (!item.has_freights) {
        expect(dataElement).toContainElement(deleteElement);
      } else {
        expect(dataElement).not.toContainElement(deleteElement);
      }
    }
  );

  it.each(vehicleData)("Test if the edit button is displayed in UI", (item) => {
    const dataElement = screen.queryByTestId(`action-container-${item.id}`);
    const editElement = screen.queryByTestId(`edit-icon-${item.id}`);
    expect(dataElement).toContainElement(editElement);
  });

  it("Test the create vehicle button functionality and modal", async () => {
    const linkElement = screen.getByTestId("create-vehicle");
    const baseElement = screen.baseElement;
    let modalElement = screen.queryByTestId("create-vehicle-modal");

    // Modal should be null before clicking on button
    expect(modalElement).toBeNull();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(linkElement);

    const modalSpinner = screen.queryByTestId("modal-spinner");
    expect(modalSpinner).toBeInTheDocument();

    await renderWithStore(<VehicleModal />);

    modalElement = screen.queryByTestId("create-vehicle-modal");
    expect(modalElement).toBeInTheDocument();
  });

  it("Test the on change functionality for all input boxes in vehicle modal", async () => {
    const linkElement = screen.getByTestId("create-vehicle");
    fireEvent.click(linkElement);

    await renderWithStore(<VehicleModal />);

    vehicleInputElements.forEach((el) => {
      const inputElement = screen.getByPlaceholderText(el.placeHolder);
      fireEvent.change(inputElement, { target: { value: el.value } });

      expect(inputElement).toHaveValue(el.value);
    });
  });

  it("Test the validations for all input boxes in vehicle modal", async () => {
    const linkElement = screen.getByTestId("create-vehicle");
    fireEvent.click(linkElement);

    await renderWithStore(<VehicleModal />);

    fireEvent.click(screen.getByTestId("vehicle-button"));

    vehicleInputElements.forEach(async (el) => {
      await waitFor(() => {
        const errorMessage = screen.queryByText(el.errorMessage);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  it("Test the delete modal dialog box on click of delete icon", async () => {
    const dataElement = await waitFor(() =>
      screen.getByTestId("vehicle-table")
    );
    expect(dataElement).toBeInTheDocument();

    vehicleData.forEach((val) => {
      if (!val.has_freights) {
        const deleteIcon = screen.getByTestId(`delete-icon-${val.id}`);

        expect(deleteIcon).toBeInTheDocument();
        fireEvent.click(deleteIcon);

        expect(document.querySelector(".swal2-container")).toBeInTheDocument();

        const textElement = screen.getByText("Eliminar Vehiculos");
        expect(textElement).toBeInTheDocument();
      }
    });
  });

  it("Test the edit modal on click of edit icon", async () => {
    const dataElement = await waitFor(() =>
      screen.getByTestId("vehicle-table")
    );
    expect(dataElement).toBeInTheDocument();

    const { id } = vehicleData[0];
    const editIcon = screen.getByTestId(`edit-icon-${id}`);

    expect(editIcon).toBeInTheDocument();
    fireEvent.click(editIcon);

    await renderWithStore(<VehicleModal selectedVehicle={id} />);

    const textElement = await waitFor(() =>
      screen.getByText("Actualizar vehículo")
    );

    // Check if the edit modal is displayed
    expect(textElement).toBeInTheDocument();

    let inputElement = {
      brand: null,
      model: null,
    };

    Object.keys(inputElement).forEach((input) => {
      vehicleInputElements.forEach((formEl) => {
        if (formEl.field === input) {
          inputElement[input] = vehicleData[0][input];
        }
      });
    });

    const { brandElement, modelElement } = await waitFor(() => {
      return {
        brandElement: screen.getByText(inputElement.brand),
        modelElement: screen.getByText(inputElement.model),
      };
    });

    expect(brandElement).toBeInTheDocument();
    expect(modelElement).toBeInTheDocument();
  });
});
