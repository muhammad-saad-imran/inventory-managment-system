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
  });

  describe("CreateSupplierPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<CreateSupplierPage />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("SupplierInfoPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<SupplierInfoPage />);
      expect(container).toMatchSnapshot();
    });
  });
});
