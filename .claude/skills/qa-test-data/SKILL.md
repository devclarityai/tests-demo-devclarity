---
name: qa-test-data
description: Generates valid, boundary, and invalid test data sets for a feature by applying equivalence partitioning and boundary value analysis to a field schema or form spec. Use when a tester needs data to drive cases. Day 2 test-data block of the QA Foundational training.
argument-hint: "[field schema, form spec, or description of the inputs]"
---

# QA Test Data

> Core principle: **Define the rules. AI finds the edges.** Give AI the field rules and it generates the partitions and boundaries fast. You check that it found the *real* edges and did not invent constraints that do not exist.

Input: a field schema / form spec (field names, types, rules, constraints).
Output: three labeled data sets - valid, boundary, invalid - built with real test-design technique, not vibes. See `reference/test-data-techniques.md`.

## Workflow

```
Test Data Progress:
- [ ] Step 1: Read the field schema and restate the rules
- [ ] Step 2: Partition each field (equivalence classes)
- [ ] Step 3: Find boundaries (boundary value analysis)
- [ ] Step 4: Emit valid / boundary / invalid sets
- [ ] Step 5: Self-critique against the actual rules
```

### Step 1: Restate the rules

For each field, restate: type, required?, allowed range/format, and any business rule (forbidden values, dependencies on other fields). If a rule is missing from the schema, say so - do not assume one.

### Step 2: Equivalence partitioning

Group each field's inputs into classes that should behave the same way. One representative per class. Note which classes are valid and which are invalid.

### Step 3: Boundary value analysis

For every ordered field (numbers, dates, lengths), test the edges: **on** the boundary, **just inside**, **just outside**. Most bugs live here. Include both ends of every range.

### Step 4: Emit the three sets

    ## Valid set
    | Field | Value | Class it represents |

    ## Boundary set
    | Field | Value | Boundary (on / just-inside / just-outside) | Expected |

    ## Invalid set
    | Field | Value | Rule it violates | Expected error |

Each invalid row names the rule it breaks and the expected rejection - that is the oracle.

### Step 5: Self-critique

**-> STOP.** Judge your own output:
- Did I find the **real** boundaries the schema implies?
- Did I **invent** any constraint the schema never stated?
- Did I **miss** a rule the schema implies but does not spell out (e.g. a cross-field dependency, a hidden domain restriction)?

Present the three sets plus this critique. Wait for the tester to confirm against the actual rules.

## Critical rules

- Every boundary value is labeled on / just-inside / just-outside.
- Every invalid value names the rule it violates and the expected error.
- Flag any constraint you assumed that the schema did not state.
- Cover both ends of every range - do not stop at the lower bound.

## Anti-patterns

- "Some valid data" with no partition reasoning.
- Boundaries only on one side of a range.
- Inventing limits (max lengths, ranges) the schema never gave.
- Accepting the data without checking it against the real rules.
