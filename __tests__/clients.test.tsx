import { act } from "@testing-library/react";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
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
  let deleteClientMock = jest.spyOn(ClientRepo.prototype, "delete");

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

    it("should route on clicking clients table row", async () => {
      renderWithProviders(<ClientsPage />); // ARRANGE

      // ACT
      const elems = await screen.findAllByTestId("client-row");
      fireEvent.click(elems[0]);

      expect(routerPushMock).toHaveBeenCalledTimes(1); // ASSERT
    });
  });

  describe("CreateClientPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<CreateClientPage />);
      expect(container).toMatchSnapshot();
    });

    it("should create client", async () => {
      await act(() => renderWithProviders(<CreateClientPage />)); // ARRANGE

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
      expect(createClientMock).toHaveBeenCalledTimes(1);
      expect(routerPushMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("ClientInfoPage", () => {
    it("should match snapshot", () => {
      const { container } = renderWithProviders(<ClientInfoPage />);
      expect(container).toMatchSnapshot();
    });

    it("should delete client", async () => {
      await act(() => renderWithProviders(<ClientInfoPage />)); // ARRANGE

      await act(async () => {
        // ACT
        fireEvent.click(await screen.findByRole("button", { name: /delete/i }));
      });

      // ASSERT
      expect(deleteClientMock).toHaveBeenCalledTimes(1);
      expect(routerPushMock).toHaveBeenCalledTimes(1);
    });

    it("should update client", async () => {
      await act(() => renderWithProviders(<ClientInfoPage />)); // ARRANGE

      // ACT
      await act(async () => {
      fireEvent.change(await screen.findByLabelText(/name/i), {
        target: { value: "Changed Test Client" },
      });

      fireEvent.click(await screen.findByRole("button", { name: /update/i }));
      });

      // ASSERT
        expect(updateClientMock).toHaveBeenCalledTimes(1);
    });
  });
});
