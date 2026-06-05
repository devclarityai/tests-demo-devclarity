# Test Data Techniques (reference)

Loaded by the `qa-test-data` skill.

## Equivalence Partitioning (EP)

Group inputs that the system should treat the same way into a partition, then test **one representative per partition** instead of every value. If "1-99" is valid, you do not test 1, 2, 3... 99 - you test one value from the valid partition and one from each invalid partition (below 1, above 99, non-numeric).

Partitions come in two kinds:
- **Valid partitions** - should be accepted.
- **Invalid partitions** - should be rejected, each for its own reason.

## Boundary Value Analysis (BVA)

Bugs cluster at the edges of partitions. For each boundary test three points:
- **On** the boundary (the limit value itself)
- **Just inside** (one step toward valid)
- **Just outside** (one step toward invalid)

Example - a field that accepts 1 to 99:
- Lower edge: 0 (just outside), 1 (on), 2 (just inside)
- Upper edge: 98 (just inside), 99 (on), 100 (just outside)

Always do **both** ends. The classic miss is testing the lower bound and forgetting the upper.

### Boundaries are not only numbers

- **Dates** - first/last allowed day, and the day on either side. Watch for excluded days (e.g. weekends, holidays) - the boundary may be a *kind* of day, not just a range edge.
- **String length** - empty, 1 char, max, max+1.
- **Counts** - zero, one, the required minimum, one below the minimum.
- **Inclusive vs exclusive** - "on or after" includes the boundary day; "after" excludes it. The single most common off-by-one bug.

## Where AI helps and where it fails

- **Helps:** enumerates partitions and boundary triples fast once you state the rule.
- **Fails:** invents constraints that do not exist, misses a rule the schema only implies, or treats an inclusive boundary as exclusive. Always check the generated data against the *actual* rules.
