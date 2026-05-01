import sys


def solve_one(n: int):
    # 4a + 6b = n  =>  2a + 3b = n/2
    if n % 2 == 1:
        return None
    m = n // 2
    if m == 1:  # n == 2
        return None

    # Maximum spaceships: use as many A(4) as possible, i.e., minimize b while satisfying b ≡ m (mod 2)
    b_min = 0 if (m % 2 == 0) else 1
    if m - 3 * b_min < 0:
        return None
    a_max = (m - 3 * b_min) // 2
    y = a_max + b_min

    # Minimum spaceships: use as many B(6) as possible, i.e., maximize b while satisfying b ≡ m (mod 2)
    b_max = m // 3
    if (b_max % 2) != (m % 2):
        b_max -= 1
    if b_max < 0:
        return None
    a_min = (m - 3 * b_max) // 2
    x = a_min + b_max

    return x, y


def main() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    t = int(data[0])
    out_lines = []
    idx = 1
    for _ in range(t):
        n = int(data[idx])
        idx += 1
        ans = solve_one(n)
        if ans is None:
            out_lines.append("-1")
        else:
            x, y = ans
            out_lines.append(f"{x} {y}")
    sys.stdout.write("\n".join(out_lines))


if __name__ == "__main__":
    main()
