import { renderWithProviders } from "@/utils/test-utils";
import { Order } from "@/utils/database/types";
import { ClientRepo } from "@/utils/database/ClientRepo";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { OrderItemRepo } from "@/utils/database/OrderItemRepo";
import database from "@/../__mocks__/database.json";
import OrderPage from "@/app/dashboard/orders/page";
import OrderInfoPage from "@/app/dashboard/orders/[id]/page";

jest.mock("next/navigation", () => {
  const actualImport = jest.requireActual("next/navigation");
  return {
    ...actualImport,
    usePathname() {
      return "/dashboard/orders";
    },
  };
});

jest.mock("@/utils/supabase/client");
jest.mock("@/utils/database/OrderRepo");
jest.mock("@/utils/database/ClientRepo");
jest.mock("@/utils/database/OrderItemRepo");

describe("Order feature", () => {
  // Order Repo mocks
  let getAllOrdersMock = jest.spyOn(OrderRepo.prototype, "getWithClientName");
  let getOrderMock = jest.spyOn(OrderRepo.prototype, "get");
  let createOrderMock = jest.spyOn(OrderRepo.prototype, "create");
  let updateOrderMock = jest.spyOn(OrderRepo.prototype, "create");

  // OrderItems service mocks
  let getAllOrderItemsMock = jest.spyOn(OrderItemRepo.prototype, "getAll");
  let getItemMock = jest.spyOn(OrderItemRepo.prototype, "get");
  let createOrderItemMock = jest.spyOn(OrderItemRepo.prototype, "create");
  let updateOrderItemMock = jest.spyOn(OrderItemRepo.prototype, "update");

  // Cliets Repo mocks
  let getClientsMock = jest.spyOn(ClientRepo.prototype, "getWithName");

  let useRouter = jest.spyOn(require("next/navigation"), "useRouter");
  let useParams = jest.spyOn(require("next/navigation"), "useParams");
  const routerPushMock = jest.fn();

  beforeEach(() => {
    // mock useRouter implementation
    useRouter.mockImplementation(() => ({
      push: routerPushMock,
    }));

    // mock useParams implementation
    useParams.mockImplementation(() => ({ id: database.orders[0].id }));

    // mock Order Repo methods
    getOrderMock.mockResolvedValue(database.orders[0] as Order);
    getAllOrdersMock.mockResolvedValue(database.orders as Order[]);
    createOrderMock.mockResolvedValue(database.orders[0] as Order);
    updateOrderMock.mockResolvedValue(database.orders[0] as Order);

    // mock OrderItemService methods
    getAllOrderItemsMock.mockResolvedValue(database.orders[0].order_items);
    getItemMock.mockResolvedValue(database.orders[0].order_items[0]);
    createOrderItemMock.mockResolvedValue(database.orders[0].order_items[0]);
    updateOrderItemMock.mockResolvedValue(database.orders[0].order_items[0]);

    // mock Client Repo methods
    getClientsMock.mockResolvedValue(database.clients);
  });

  afterEach(() => {
    // Clean up mocks after each test
    useRouter.mockClear();
    useParams.mockClear();
    getOrderMock.mockClear();
    getAllOrdersMock.mockClear();
    createOrderMock.mockClear();
    updateOrderMock.mockClear();
    getAllOrderItemsMock.mockClear();
    getItemMock.mockClear();
    createOrderItemMock.mockClear();
    updateOrderItemMock.mockClear();
    getClientsMock.mockClear();
  });

  describe("OrderPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<OrderPage />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("OrderInfoPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<OrderInfoPage />);
      expect(container).toMatchSnapshot();
    });
  });
});
