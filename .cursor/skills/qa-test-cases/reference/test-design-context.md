# Test Design Context (reference)

Loaded by the `qa-test-cases` skill. Keep this lean - progressive disclosure, not a data dump. Relevant context beats more context.

## The five roads, and what each lens is good at

| Road | Input | Strong at | Blind to |
|---|---|---|---|
| 1 | Ticket + AC | Documented happy path, stated requirements | Anything the writer left out; unstated rules |
| 2 | Existing test cases | Building on inherited coverage | The same gaps the original author had |
| 3 | Screenshot | Fields/controls actually on screen, layout | Behavior, validation, server-side rules |
| 4 | Observed behavior (Playwright) | Real states, real validation messages, real errors | Requirements that are not yet built |
| 5 | Recorded walkthrough | The exact path a real user took | Paths the recorder did not walk |

Spec-driven (road 1) gives expectations from the *document*. Behavior-driven (roads 3-5) gives expectations from the *app itself* - rules nobody wrote down. The two disagree more often than teams expect.

## What makes a test case strong

- **Oracle** - an explicit, checkable expected result. No oracle, no test.
- **One reason to fail** - a case that checks five things tells you nothing when it goes red.
- **Real data** - boundary and invalid values beat "some valid input."
- **Names the risk** - tie the case to who is hurt if it breaks.

## Common AI failure modes to watch for

- **Hallucinated fields / messages** - invents inputs or error text that do not exist.
- **Weak oracles** - "should work correctly" instead of the actual expected value.
- **Hidden assumptions** - assumes a rule (e.g. a date restriction) the input never stated.
- **Non-determinism** - re-running gives a different set; pin down what you keep.

## Formal case vs scenario

Formal = explicit steps + data + expected, for compliance/handoff/reproduce-exactly.
Scenario = charter + rationale, for fast-moving low-risk work.
AI makes both cheap. The skill is choosing, not typing.
