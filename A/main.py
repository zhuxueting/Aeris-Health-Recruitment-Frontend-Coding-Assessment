import sys


def solve() -> None:
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    t = int(data[0])
    out_lines: list[str] = []
    idx = 1
    for _ in range(t):
        x = int(data[idx])
        n = int(data[idx + 1])
        idx += 2
        out_lines.append(str(x if (n & 1) else 0))
    sys.stdout.write("\n".join(out_lines))


if __name__ == "__main__":
    solve()

