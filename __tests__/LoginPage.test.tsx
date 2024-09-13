import LoginPage from "@/app/page";
import { renderWithProviders } from "@/utils/test-utils";

jest.mock("@/utils/supabase/client");

describe("Login Page", () => {
  it("should match snapshot", () => {
    const { container } = renderWithProviders(<LoginPage />);
    expect(container).toMatchSnapshot();
  });
});
