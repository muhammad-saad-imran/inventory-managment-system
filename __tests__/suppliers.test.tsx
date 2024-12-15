import { act } from "@testing-library/react";
import { fireEvent, screen } from "@testing-library/dom";
import { renderWithProviders } from "@/utils/test-utils";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import database from "@/../__mocks__/database.json";
import SupplierPage from "@/app/dashboard/suppliers/page";
import CreateSupplierPage from "@/app/dashboard/suppliers/create/page";
import SupplierInfoPage from "@/app/dashboard/suppliers/[id]/page";

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
jest.mock("@/utils/database/SupplierRepo");

describe("Supplier features", () => {
  let getWithNameMock = jest.spyOn(SupplierRepo.prototype, "getWithName");
  let getSupplierMock = jest.spyOn(SupplierRepo.prototype, "get");
  let createSupplierMock = jest.spyOn(SupplierRepo.prototype, "create");
  let updateSupplierMock = jest.spyOn(SupplierRepo.prototype, "update");
  let deleteSupplierMock = jest.spyOn(SupplierRepo.prototype, "delete");

  let useRouter = jest.spyOn(require("next/navigation"), "useRouter");
  let useParams = jest.spyOn(require("next/navigation"), "useParams");
  const routerPushMock = jest.fn();

  beforeEach(() => {
    // mock useRouter implementation
    useRouter.mockImplementation(() => ({
      push: routerPushMock,
    }));

    // mock useParams implementation
    useParams.mockImplementation(() => ({ id: database.suppliers[0].id }));

    // mock Supplier Repo methods
    getWithNameMock.mockResolvedValue(database.suppliers);
    getSupplierMock.mockResolvedValue(database.suppliers[0]);
    createSupplierMock.mockResolvedValue(database.suppliers[0]);
    updateSupplierMock.mockResolvedValue(database.suppliers[0]);
  });

  afterEach(() => {
    // Cleanup mocks after each test
    getWithNameMock.mockClear();
    getSupplierMock.mockClear();
    createSupplierMock.mockClear();
    updateSupplierMock.mockClear();
    useRouter.mockClear();
    useParams.mockClear();
  });

  describe("SupplierPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<SupplierPage />);
      expect(container).toMatchSnapshot();
    });

    it("should route on clicking supplier table row", async () => {
      renderWithProviders(<SupplierPage />); // ARRANGE

      // ACT
      const elems = await screen.findAllByTestId("supplier-row");
      fireEvent.click(elems[0]);

      expect(routerPushMock).toHaveBeenCalledTimes(1); // ASSERT
    });
  });

  describe("CreateSupplierPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<CreateSupplierPage />);
      expect(container).toMatchSnapshot();
    });

    it("should create supplier", async () => {
      await act(() => renderWithProviders(<CreateSupplierPage />)); // ARRANGE

      await act(async () => {
        // ACT
        const nameInput = await screen.findByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "test supplier" } });

        const emailInput = await screen.findByLabelText("Email");
        fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });

        const phoneInput = await screen.findByLabelText("Phone Number");
        fireEvent.change(phoneInput, { target: { value: "10101010100101" } });

        const submitBtn = await screen.findByTestId("submit-btn");
        fireEvent.click(submitBtn);
      });

      // ASSERT
      expect(createSupplierMock).toHaveBeenCalledTimes(1);
      expect(routerPushMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("SupplierInfoPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<SupplierInfoPage />);
      expect(container).toMatchSnapshot();
    });

    it("should delete supplier", async () => {
      await act(() => renderWithProviders(<SupplierInfoPage />)); // ARRANGE

      await act(async () => {
        // ACT
        const deleteBtn = await screen.findByTestId("delete-btn");
        fireEvent.click(deleteBtn);
      });

      // ASSERT
      expect(deleteSupplierMock).toHaveBeenCalledTimes(1);
      expect(routerPushMock).toHaveBeenCalledTimes(1);
    });

    it("should update supplier", async () => {
      await act(() => renderWithProviders(<SupplierInfoPage />)); // ARRANGE

      await act(async () => {
        // ACT
        const nameInput = await screen.findByLabelText("Name");
        fireEvent.change(nameInput, {
          target: { value: "Changed Test supplier" },
        });

        const updateBtn = await screen.findByTestId("update-btn");
        fireEvent.click(updateBtn);
      });

      // ASSERT
      expect(updateSupplierMock).toHaveBeenCalledTimes(1);
    });
  });
});
