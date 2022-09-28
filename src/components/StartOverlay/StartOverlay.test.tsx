import { render, screen } from "@testing-library/react";

import { StartOverlay } from "./";

describe("Initial overlay", () => {
  it("should render with a button containing 'Lets go' text", () => {
    render(<StartOverlay />);

    expect(screen.getByRole("button")).toHaveTextContent("Lets go");
  });
});
