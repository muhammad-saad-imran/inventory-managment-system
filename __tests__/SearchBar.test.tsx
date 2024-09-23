import { act, fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "@/components/dashboard/SearchBar";

jest.mock("next/navigation", () => {
  const actualImport = jest.requireActual("next/navigation");
  return {
    ...actualImport,
    usePathname() {
      return "/dashboard/suppliers";
    },
  };
});

describe("SearchBar Component", () => {
  let useRouter = jest.spyOn(require("next/navigation"), "useRouter");
  const routerPushMock = jest.fn();
  const setSearchMock = jest.fn();

  const renderComponent = () =>
    render(<SearchBar label="Test" search="Test" setSearch={setSearchMock} />);

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: routerPushMock,
    }));
  });

  afterEach(() => {
    useRouter.mockClear();
  });

  it("should search input", async () => {
    renderComponent();

    await act(async () => {
      fireEvent.change(await screen.findByPlaceholderText(/Search/i), {
        target: { value: "Testing component" },
      });
    });

    expect(setSearchMock).toHaveBeenCalled();
  });

  it("should route when clicked on create button", async () => {
    renderComponent();

    await act(async () => {
      fireEvent.click(await screen.findByRole("button", { name: /\+/i }));
    });

    expect(routerPushMock).toHaveBeenCalled();
  });
});
