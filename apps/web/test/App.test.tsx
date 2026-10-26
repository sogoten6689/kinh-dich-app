import { hexagramByNumber } from "@kinh-dich/core";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App";
import { HexagramFigure } from "../src/components/HexagramFigure";

beforeEach(() => {
  history.replaceState(null, "", "/");
});

function chooseMethod(name: RegExp) {
  fireEvent.click(screen.getByRole("radio", { name }));
}

describe("web app", () => {
  it("F-CAST-06 gieo từng hào: 6 lần bấm mới lập quẻ", () => {
    render(<App />);
    for (let i = 1; i <= 5; i++) {
      fireEvent.click(screen.getByRole("button", { name: `Gieo hào ${i}` }));
      expect(screen.queryByTestId("reading")).not.toBeInTheDocument();
    }
    expect(screen.getByText(/^Hào 5: /)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Gieo hào 6" }));
    expect(screen.getByTestId("reading")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đã đủ 6 hào" })).toBeDisabled();
  });

  it("F-CAST-01 gieo nhanh hiển thị quẻ chủ, giải thích và câu hỏi", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Điều bạn muốn hỏi/), { target: { value: "Có nên đổi việc?" } });
    fireEvent.click(screen.getByRole("button", { name: /Gieo nhanh/ }));
    const reading = screen.getByTestId("reading");
    expect(within(reading).getByText("Quẻ chủ")).toBeInTheDocument();
    expect(within(reading).getByText("Có nên đổi việc?")).toBeInTheDocument();
    expect(within(reading).getByText("Tình thế hiện tại")).toBeInTheDocument();
    expect(within(reading).getByText("Cấu tạo quẻ")).toBeInTheDocument();
  });

  it("F-CAST-02 gieo cỏ thi", () => {
    render(<App />);
    chooseMethod(/Cỏ thi/);
    fireEvent.click(screen.getByRole("button", { name: "Gieo cỏ thi" }));
    expect(screen.getByTestId("reading")).toBeInTheDocument();
  });

  it("F-CAST-03 Mai Hoa theo hai số 5, 3 → Phong Hỏa Gia Nhân, có các bước tính và Thể/Dụng", () => {
    render(<App />);
    chooseMethod(/Mai Hoa/);
    fireEvent.change(screen.getByLabelText("Số thứ nhất"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Số thứ hai"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Lập quẻ" }));
    expect(screen.getAllByText(/37\. Phong Hỏa Gia Nhân/).length).toBeGreaterThan(0);
    expect(screen.getByText("Thể sinh Dụng — Hao tổn")).toBeInTheDocument();
    expect(within(screen.getByRole("list", { name: "Các bước tính" })).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("img", { name: /ngũ hành/ })).toBeInTheDocument();
  });

  it("F-CAST-03 số không hợp lệ hiện thông báo lỗi", () => {
    render(<App />);
    chooseMethod(/Mai Hoa/);
    fireEvent.click(screen.getByRole("button", { name: "Lập quẻ" }));
    expect(screen.getByRole("alert")).toHaveTextContent("số nguyên dương");
  });

  it("F-LIB-05 bấm thuật ngữ để xem giải thích", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Gieo nhanh/ }));
    fireEvent.click(screen.getByRole("button", { name: /Diễn biến bên trong/ }));
    expect(screen.getByRole("note")).toHaveTextContent("hào 2-3-4");
  });

  it("F-LIB-02 tìm quẻ trong danh sách 64 quẻ", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "64 quẻ" }));
    fireEvent.change(screen.getByLabelText("Tìm quẻ"), { target: { value: "vi te" } });
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("F-LIB-03 chi tiết quẻ: sáu hào và quẻ liên quan", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "64 quẻ" }));
    fireEvent.click(screen.getByRole("button", { name: "Quẻ 63 Thủy Hỏa Ký Tế" }));
    const detail = screen.getByRole("article", { name: "Chi tiết quẻ 63" });
    expect(within(detail).getAllByText("Đắc chính")).toHaveLength(6);
    expect(within(detail).getByText(/Ngoại khắc nội/)).toBeInTheDocument();
    fireEvent.click(within(detail).getAllByRole("button", { name: "Quẻ 64 Hỏa Thủy Vị Tế" })[0]!);
    expect(screen.getByRole("article", { name: "Chi tiết quẻ 64" })).toBeInTheDocument();
  });

  it("F-LIB-04 bát quái: chọn quẻ đơn và đổi cách sắp xếp", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Bát quái" }));
    fireEvent.click(screen.getByRole("button", { name: /Khảm — Nước, phương Bắc/ }));
    expect(screen.getByText("Hãm — hiểm trở")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /Tiên Thiên/ }));
    expect(screen.getByRole("button", { name: /Khảm — Nước, phương Tây/ })).toBeInTheDocument();
  });

  it("F-ABOUT-01 trang giới thiệu có tác giả", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Giới thiệu" }));
    const author = screen.getByRole("region", { name: "Tác giả" });
    expect(author).toHaveTextContent("Lam Nguyen");
    expect(author).toHaveTextContent("Egitech");
  });

  it("vẽ hào thượng ở trên, hào sơ ở dưới, đánh dấu hào động", () => {
    render(<HexagramFigure hexagram={hexagramByNumber(3)} changingLines={[1]} />);
    const lines = screen.getAllByTestId(/^line-/);
    expect(lines.map((l) => l.dataset.testid)).toEqual(["line-6", "line-5", "line-4", "line-3", "line-2", "line-1"]);
    expect(screen.getByTestId("line-1")).toHaveClass("yang", "changing");
    expect(screen.getByTestId("line-1")).toHaveTextContent("○");
  });
});
