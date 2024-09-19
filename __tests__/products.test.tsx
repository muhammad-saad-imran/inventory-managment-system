import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";
import { renderWithProviders } from "@/utils/test-utils";
import { ProductRepo } from "@/utils/database/ProductRepo";
import database from "@/../__mocks__/database.json";
import ProductPage from "@/app/dashboard/products/page";
import CreateProductPage from "@/app/dashboard/products/create/page";
import ProductInfoPage from "@/app/dashboard/products/[id]/page";

jest.mock("next/navigation", () => {
  const actualImport = jest.requireActual("next/navigation");
  return {
    ...actualImport,
    usePathname() {
      return "/dashboard/products";
    },
  };
});

jest.mock("@/utils/supabase/client");
jest.mock("@/utils/database/ProductRepo");

describe("Products feature pages", () => {
  let getWithNameMock = jest.spyOn(ProductRepo.prototype, "getWithName");
  let getProductMock = jest.spyOn(ProductRepo.prototype, "get");
  let createProductMock = jest.spyOn(ProductRepo.prototype, "create");
  let updateProductMock = jest.spyOn(ProductRepo.prototype, "update");
  let deleteProductMock = jest.spyOn(ProductRepo.prototype, "delete");

  let useRouter = jest.spyOn(require("next/navigation"), "useRouter");
  let useParams = jest.spyOn(require("next/navigation"), "useParams");

  const routerPushMock = jest.fn();

  beforeEach(() => {
    // mock useRouter implemention
    useRouter.mockImplementation(() => ({ push: routerPushMock }));

    // mock useParams implemetation
    useParams.mockImplementation(() => ({ id: database.products[0].id }));

    // mock ProductRepo method
    getWithNameMock.mockResolvedValue(database.products);
    getProductMock.mockResolvedValue(database.products[0]);
    createProductMock.mockResolvedValue(database.products[0]);
    updateProductMock.mockResolvedValue(database.products[0]);
  });

  afterEach(() => {
    // Cleanup mocks after each test
    useRouter.mockClear();
    getWithNameMock.mockClear();
    getProductMock.mockClear();
    createProductMock.mockClear();
    deleteProductMock.mockClear();
    updateProductMock.mockClear();
  });

  describe("ProductPage - displays all products", () => {
    it("should match snapshot", async () => {
      let container;

      await act(async () => {
        ({ container } = renderWithProviders(<ProductPage />)); // ARRANGE
      });
      expect(container).toMatchSnapshot(); //ASSERT
    });

    it("should route on clicking product table row", async () => {
      renderWithProviders(<ProductPage />); // ARRANGE

      // ACT
      const elems = await screen.findAllByTestId("product-row");
      fireEvent.click(elems[0]);

      expect(routerPushMock).toHaveBeenCalledTimes(1); // ASSERT
    });
  });

  describe("CreateProductPage", () => {
    it("should match snapshot", async () => {
      let container;

      await act(async () => {
        ({ container } = await renderWithProviders(<CreateProductPage />)); // ARRANGE
      });
      expect(container).toMatchSnapshot(); //ASSERT
    });

    it("should create product", async () => {
      await act(() => renderWithProviders(<CreateProductPage />)); // ARRANGE

      await act(async () => {
        // ACT
        const nameInput = await screen.findByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "test product" } });

        const descInput = await screen.findByLabelText("Description");
        fireEvent.change(descInput, { target: { value: "test description" } });

        const submitBtn = await screen.findByTestId("submit-btn");
        fireEvent.click(submitBtn);
      });

      // ASSERT
      expect(createProductMock).toHaveBeenCalledTimes(1);
      expect(routerPushMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("ProductInfoPage", () => {
    it("should match snapshot", async () => {
      let container;

      await act(async () => {
        ({ container } = await renderWithProviders(<ProductInfoPage />)); // ARRANGE
      });
      expect(container).toMatchSnapshot(); //ASSERT
    });

    it("should delete product", async () => {
      await act(() => renderWithProviders(<ProductInfoPage />)); // ARRANGE

      await act(async () => {
        // ACT
        const deleteBtn = await screen.findByTestId("delete-btn");
        fireEvent.click(deleteBtn);
      });

      // ASSERT
      expect(deleteProductMock).toHaveBeenCalledTimes(1);
      expect(routerPushMock).toHaveBeenCalledTimes(1);
    });

    it("should update product", async () => {
      await act(() => renderWithProviders(<ProductInfoPage />)); // ARRANGE

      await act(async () => {
        // ACT
        const nameInput = await screen.findByLabelText("Name");
        fireEvent.change(nameInput, {
          target: { value: "Changed Test product" },
        });

        const updateBtn = await screen.findByTestId("update-btn");
        fireEvent.click(updateBtn);
      });

      // ASSERT
      expect(updateProductMock).toHaveBeenCalledTimes(1);
    });
  });
});
