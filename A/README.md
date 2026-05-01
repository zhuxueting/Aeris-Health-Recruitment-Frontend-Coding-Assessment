# Alternating Energy Wave Summation (Python)

## Problem Description
Generate n energy waves starting from x, with values alternating between x and -x:
For example, when n = 5: x, -x, x, -x, x.
Calculate the total sum after n waves.

## Conclusion
- If n is even: Pairs cancel each other out, sum is 0
- If n is odd: One extra x remains, sum is x

## Running the Program

```bash
python main.py < input.txt
```

nput Format:
- First line: t (number of test cases)
- Next t lines: x n (each line contains two integers x and n)

