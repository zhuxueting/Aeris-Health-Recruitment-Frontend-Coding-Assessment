# Spaceship Propulsion Unit Allocation (A=4, B=6)

## Problem
There are two types of spaceships:
- Type A: 4 propulsion units
- Type B: 6 propulsion units

Given the total number of propulsion units `n`, output the possible range of total spaceships in the fleet:
- `x`: minimum possible number of spaceships
- `y`: maximum possible number of spaceships

If it's impossible to form `n` using only A/B, output `-1`.

## Approach (Brief)
Equation: `4a + 6b = n` (`a, b` are non-negative integers).
Divide both sides by 2: `2a + 3b = n/2`, so **`n` must be even**.

- **Maximum spaceships**: use as many A as possible (4 is smaller), equivalent to minimizing `b` while satisfying feasibility and parity constraints.
- **Minimum spaceships**: use as many B as possible (6 is larger), equivalent to maximizing `b` while satisfying feasibility and parity constraints.

Implementation requires only constant time computation.

## Run

```bash
python3 main.py < input.txt
```