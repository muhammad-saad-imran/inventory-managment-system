import { fireEvent, screen } from "@testing-library/dom";
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
    updateProductMock.mockClear();
  });

  describe("ProductPage - displays all products", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<ProductPage />); // ARRANGE
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
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<CreateProductPage />); // ARRANGE
      expect(container).toMatchSnapshot(); //ASSERT
    });
  });

  describe("ProductInfoPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<ProductInfoPage />); // ARRANGE
      expect(container).toMatchSnapshot(); //ASSERT
    });
  });
});
