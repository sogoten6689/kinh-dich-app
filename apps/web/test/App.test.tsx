import { hexagramByNumber } from "@kinh-dich/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";
import { HexagramFigure } from "../src/components/HexagramFigure";

describe("web app", () => {
  it("F-CAST-01 gieo đồng xu hiển thị quẻ chủ", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Lập quẻ" }));
    expect(screen.getByTestId("reading")).toBeInTheDocument();
    expect(screen.getByText("Quẻ chủ")).toBeInTheDocument();
  });

  it("F-CAST-03 Mai Hoa theo hai số 5, 3 → Phong Hỏa Gia Nhân", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "numbers" } });
    fireEvent.change(screen.getByLabelText("Số thứ nhất"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Số thứ hai"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Lập quẻ" }));
    expect(screen.getByText(/37\. Phong Hỏa Gia Nhân/)).toBeInTheDocument();
    expect(screen.getByText(/Thể sinh Dụng/)).toBeInTheDocument();
  });

  it("số không hợp lệ hiện thông báo lỗi", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "numbers" } });
    fireEvent.click(screen.getByRole("button", { name: "Lập quẻ" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("F-LIB-02 tìm quẻ trong danh sách 64 quẻ", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "64 quẻ" }));
    fireEvent.change(screen.getByLabelText("Tìm quẻ"), { target: { value: "vi te" } });
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("vẽ hào thượng ở trên, hào sơ ở dưới", () => {
    render(<HexagramFigure hexagram={hexagramByNumber(3)} changingLines={[1]} />);
    const lines = screen.getAllByTestId(/^line-/);
    expect(lines.map((l) => l.dataset.testid)).toEqual(["line-6", "line-5", "line-4", "line-3", "line-2", "line-1"]);
    expect(screen.getByTestId("line-1")).toHaveClass("yang", "changing");
  });
});
