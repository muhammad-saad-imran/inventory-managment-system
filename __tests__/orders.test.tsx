import { act } from "@testing-library/react";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { renderWithProviders } from "@/utils/test-utils";
import { Order, ORDER_STATUS } from "@/utils/database/types";
import { ClientRepo } from "@/utils/database/ClientRepo";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { OrderItemRepo } from "@/utils/database/OrderItemRepo";
import database from "@/../__mocks__/database.json";
import OrderPage from "@/app/dashboard/orders/page";
import OrderInfoPage from "@/app/dashboard/orders/[id]/page";
import selectEvent from "react-select-event";

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
jest.mock("@/utils/database/InventoryRepo");

describe("Order feature", () => {
  // Order Repo mocks
  let getAllOrdersMock = jest.spyOn(OrderRepo.prototype, "getWithClientName");
  let getOrderMock = jest.spyOn(OrderRepo.prototype, "get");
  let createOrderMock = jest.spyOn(OrderRepo.prototype, "create");
  let updateOrderMock = jest.spyOn(OrderRepo.prototype, "update");

  // OrderItems service mocks
  let getAllOrderItemsMock = jest.spyOn(OrderItemRepo.prototype, "getAll");
  let getItemMock = jest.spyOn(OrderItemRepo.prototype, "get");
  let createOrderItemMock = jest.spyOn(OrderItemRepo.prototype, "create");
  let updateOrderItemMock = jest.spyOn(OrderItemRepo.prototype, "update");
  let deleteOrderItemMock = jest.spyOn(OrderItemRepo.prototype, "delete");

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

    it("should route on clicking order table row", async () => {
      renderWithProviders(<OrderPage />);

      const elems = await screen.findAllByTestId("order-row");
      fireEvent.click(elems[0]);

      expect(routerPushMock).toHaveBeenCalledTimes(1);
    });

    it("should create order with CreateOrderBar component", async () => {
      renderWithProviders(<OrderPage />);

      await screen.findByLabelText(/client/i);
      
      await selectEvent.select(
        await screen.findByLabelText(/client/i),
        /alice smith/i
      );

      await fireEvent.change(await screen.findByLabelText(/Order Date/i), {
        target: { value: "2025-12-12" },
      });

      await fireEvent.click(
        await screen.findByRole("button", { name: /create/i })
      );

      await waitFor(() => expect(createOrderMock).toHaveBeenCalled());
    });
  });

  describe("OrderInfoPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<OrderInfoPage />);
      expect(container).toMatchSnapshot();
    });

    it("should update order status", async () => {
      await act(() => renderWithProviders(<OrderInfoPage />));

      await act(async () => {
        fireEvent.change(await screen.findByLabelText(/Order Status/i), {
          target: { value: ORDER_STATUS.SHIPPED },
        });

        fireEvent.click(await screen.findByRole("button", { name: /update/i }));
      });

      expect(updateOrderMock).toHaveBeenCalled();
    });

    it("should increment orderItem", async () => {
      await act(() => renderWithProviders(<OrderInfoPage />));

      await act(async () => {
        fireEvent.click(await screen.getByText(/\+/i));
      });

      expect(updateOrderItemMock).toHaveBeenCalled();
    });

    it("should increment orderItem", async () => {
      await act(() => renderWithProviders(<OrderInfoPage />));

      await act(async () => {
        fireEvent.click(await screen.getByText(/\-/i));
      });

      expect(updateOrderItemMock).toHaveBeenCalled();
    });

    it("should delete orderItem", async () => {
      await act(() => renderWithProviders(<OrderInfoPage />));

      await act(async () => {
        fireEvent.click((await screen.findAllByTestId("delete-btn"))[0]);
      });

      expect(deleteOrderItemMock).toHaveBeenCalled();
    });
  });
});
