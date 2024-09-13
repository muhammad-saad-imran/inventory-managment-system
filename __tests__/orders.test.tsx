import { renderWithProviders } from "@/utils/test-utils";
import { Order } from "@/utils/database/types";
import { ClientRepo } from "@/utils/database/ClientRepo";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { OrderItemService } from "@/utils/services/OrderItemService";
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
jest.mock("@/utils/services/OrderItemService");

describe("Order feature", () => {
  // Order Repo mocks
  let getAllOrdersMock = jest.spyOn(OrderRepo.prototype, "getWithClientName");
  let getOrderMock = jest.spyOn(OrderRepo.prototype, "get");
  let createOrderMock = jest.spyOn(OrderRepo.prototype, "create");
  let updateOrderMock = jest.spyOn(OrderRepo.prototype, "create");

  // OrderItems service mocks
  let getAllOrderItemsMock = jest.spyOn(OrderItemService.prototype, "getAll");
  let getItemMock = jest.spyOn(OrderItemService.prototype, "get");
  let createOrderItemMock = jest.spyOn(OrderItemService.prototype, "create");
  let incrementItemMock = jest.spyOn(
    OrderItemService.prototype,
    "incrementQuantity"
  );
  let decrementItemMock = jest.spyOn(
    OrderItemService.prototype,
    "decrementQuantity"
  );

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
    decrementItemMock.mockResolvedValue(database.orders[0].order_items[0]);
    incrementItemMock.mockResolvedValue(database.orders[0].order_items[0]);

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
    decrementItemMock.mockClear();
    incrementItemMock.mockClear();
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
