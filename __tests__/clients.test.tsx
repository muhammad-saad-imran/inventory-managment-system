import { renderWithProviders } from "@/utils/test-utils";
import { ClientRepo } from "@/utils/database/ClientRepo";
import database from "@/../__mocks__/database.json";
import ClientsPage from "@/app/dashboard/clients/page";
import CreateClientPage from "@/app/dashboard/clients/create/page";
import ClientInfoPage from "@/app/dashboard/clients/[id]/page";

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
jest.mock("@/utils/database/ClientRepo");

describe("Client features", () => {
  let getWithNameMock = jest.spyOn(ClientRepo.prototype, "getWithName");
  let getClientMock = jest.spyOn(ClientRepo.prototype, "get");
  let createClientMock = jest.spyOn(ClientRepo.prototype, "create");
  let updateClientMock = jest.spyOn(ClientRepo.prototype, "update");

  let useRouter = jest.spyOn(require("next/navigation"), "useRouter");
  let useParams = jest.spyOn(require("next/navigation"), "useParams");
  const routerPushMock = jest.fn();

  beforeEach(() => {
    // mock useRouter implementation
    useRouter.mockImplementation(() => ({
      push: routerPushMock,
    }));

    // mock useParams implementation
    useParams.mockImplementation(() => ({ id: database.clients[0].id }));

    // mock Supplier Repo methods
    getWithNameMock.mockResolvedValue(database.clients);
    getClientMock.mockResolvedValue(database.clients[0]);
    createClientMock.mockResolvedValue(database.clients[0]);
    updateClientMock.mockResolvedValue(database.clients[0]);
  });

  afterEach(() => {
    // Cleanup mocks after each test
    getWithNameMock.mockClear();
    getClientMock.mockClear();
    createClientMock.mockClear();
    updateClientMock.mockClear();
    useRouter.mockClear();
    useParams.mockClear();
  });

  describe("ClientsPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<ClientsPage />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("CreateClientPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<CreateClientPage />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("ClientInfoPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<ClientInfoPage />);
      expect(container).toMatchSnapshot();
    });
  });
});
