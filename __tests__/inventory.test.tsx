import { act } from "@testing-library/react";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import selectEvent from "react-select-event";
import { renderWithProviders } from "@/utils/test-utils";
import { InventoryRepo } from "@/utils/database/InventoryRepo";
import { ProductRepo } from "@/utils/database/ProductRepo";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import database from "@/../__mocks__/database.json";
import InventoryPage from "@/app/dashboard/inventory/page";
import CreateInventoryPage from "@/app/dashboard/inventory/create/page";
import InventoryInfoPage from "@/app/dashboard/inventory/[id]/page";

jest.mock("next/navigation", () => {
  const actualImport = jest.requireActual("next/navigation");
  return {
    ...actualImport,
    usePathname() {
      return "/dashboard/suppliers";
    },
  };
});

jest.mock("@/utils/supabase/client");
jest.mock("@/utils/database/InventoryRepo");
jest.mock("@/utils/database/ProductRepo");
jest.mock("@/utils/database/SupplierRepo");

describe("Inventory features", () => {
  // Inventory Repo spies
  let getWithProductNameMock = jest.spyOn(
    InventoryRepo.prototype,
    "getWithProductName"
  );
  let getInventoryMock = jest.spyOn(InventoryRepo.prototype, "get");
  let createInventoryMock = jest.spyOn(InventoryRepo.prototype, "create");
  let updateInventoryMock = jest.spyOn(InventoryRepo.prototype, "update");
  let deleteInventoryMock = jest.spyOn(InventoryRepo.prototype, "delete");

  // Product Repo spies
  let getProductWithNameMock = jest.spyOn(ProductRepo.prototype, "getWithName");

  // Supplier repo spies
  let getSupplierWithNameMock = jest.spyOn(
    SupplierRepo.prototype,
    "getWithName"
  );

  let useRouter = jest.spyOn(require("next/navigation"), "useRouter");
  let useParams = jest.spyOn(require("next/navigation"), "useParams");
  const routerPushMock = jest.fn();

  beforeEach(() => {
    // mock useRouter implementation
    useRouter.mockImplementation(() => ({
      push: routerPushMock,
    }));

    // mock useParams implementation
    useParams.mockImplementation(() => ({ id: database.inventory[0].id }));

    // mock Inventory Repo methods
    getWithProductNameMock.mockResolvedValue(database.inventory);
    getInventoryMock.mockResolvedValue(database.inventory[0]);
    createInventoryMock.mockResolvedValue(database.inventory[0]);
    updateInventoryMock.mockResolvedValue(database.inventory[0]);

    // mock Product repo methods
    getProductWithNameMock.mockResolvedValue(database.products);

    // mock Supplier repo methods
    getSupplierWithNameMock.mockResolvedValue(database.suppliers);
  });

  afterEach(() => {
    // Cleanup mocks after each test
    getWithProductNameMock.mockClear();
    getInventoryMock.mockClear();
    createInventoryMock.mockClear();
    updateInventoryMock.mockClear();
    getProductWithNameMock.mockClear();
    getSupplierWithNameMock.mockClear();
    useRouter.mockClear();
    useParams.mockClear();
  });

  describe("InventoryPage", () => {
    it("should match snapshot", async () => {
      let container;

      await act(async () => {
        ({ container } = await renderWithProviders(<InventoryPage />)); // ARRANGE
      });
      expect(container).toMatchSnapshot();
    });

    it("should route on clicking inventory table row", async () => {
      renderWithProviders(<InventoryPage />); // ARRANGE

      // ACT
      const elems = await screen.findAllByTestId("inventory-row");
      fireEvent.click(elems[0]);

      expect(routerPushMock).toHaveBeenCalledTimes(1); // ASSERT
    });
  });

  describe("CreateInventoryPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<CreateInventoryPage />);
      expect(container).toMatchSnapshot();
    });

    it("should create inventory", async () => {
      // Render the component
      renderWithProviders(<CreateInventoryPage />);

      // Wait for the product input to be available, ensuring that async operations (like data fetching) have completed
      await screen.findByLabelText(/product/i);
      // Simulate selecting product and supplier asynchronously
      await selectEvent.select(await screen.findByLabelText(/product/i), [
        /product a/i,
      ]);
      await selectEvent.select(await screen.findByLabelText(/supplier/i), [
        /supplier one/i,
      ]);

      // Simulate other user interactions
      fireEvent.change(await screen.findByLabelText("Cost"), {
        target: { value: 50.69 },
      });
      fireEvent.change(await screen.findByLabelText("Supply date"), {
        target: { value: "2030-03-15" },
      });
      fireEvent.change(await screen.findByLabelText("Stock"), {
        target: { value: 100 },
      });
      fireEvent.change(await screen.findByLabelText("Reorder limit"), {
        target: { value: 10 },
      });

      // Click the create button
      fireEvent.click(await screen.findByRole("button", { name: /Create/i }));

      // Check that mocks were called as expected
      await waitFor(() => {
        expect(createInventoryMock).toHaveBeenCalledTimes(1);
        expect(routerPushMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("InventoryInfoPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<InventoryInfoPage />);
      expect(container).toMatchSnapshot();
    });

    it("should delete inventory", async () => {
      await act(() => renderWithProviders(<InventoryInfoPage />));

      await act(async () => {
        fireEvent.click(await screen.findByRole("button", { name: /delete/i }));
      });

      expect(deleteInventoryMock).toHaveBeenCalledTimes(1);
      expect(routerPushMock).toHaveBeenCalledTimes(1);
    });

    it("should update inventory", async () => {
      await act(() => renderWithProviders(<InventoryInfoPage />));

      await act(async () => {
        fireEvent.change(await screen.findByLabelText(/stock/i), {
          target: { value: 200 },
        });

        fireEvent.click(await screen.findByRole("button", { name: /update/i }));
      });

      expect(updateInventoryMock).toHaveBeenCalledTimes(1);
    });
  });
});
