"""
Deterministic contract risk scoring.

The LLM is used only for extraction (per-clause severity, which critical
protections are missing) - the final 0-100 score and Low/Medium/High level
are computed here from a fixed, documented rubric instead of being asked
of the model directly. This makes the score reproducible and auditable:
same extracted signals always produce the same score.

The weights below are our own rubric, not derived from a labeled dataset -
they're modeled on standard contract due-diligence practice (severity of
identified issues + presence of protections a well-drafted contract is
expected to have), and are documented here so they can be defended and
tuned explicitly rather than hidden inside a model's judgment.
"""

# Points contributed per flagged clause, by severity. Ordinal weighting
# (High > Medium > Low) reflects that severity matters more than raw count.
# Calibrated so severity alone can reach every band: one High clause is
# enough for Medium; two or more High clauses (or one High plus several
# Medium/missing findings) reach High on their own.
SEVERITY_WEIGHTS = {"high": 30, "medium": 15, "low": 5}

# Caps the severity component so a long tail of low-severity clauses can't
# outweigh a couple of high-severity ones (diminishing marginal risk), while
# still leaving headroom for severity alone to reach the High band.
SEVERITY_CAP = 90

# Fixed checklist of protections a well-drafted contract is generally
# expected to include. The LLM is constrained (see ai_service.py prompt) to
# only report items from this exact list as missing.
CRITICAL_CLAUSES = [
    "Termination Clause",
    "Limitation of Liability",
    "Indemnification",
    "Governing Law",
    "Confidentiality",
    "Dispute Resolution",
]

MISSING_CLAUSE_PENALTY = 10
MISSING_CLAUSE_CAP = 40

# Score-to-level bands: <=20 Low, <=55 Medium, else High.
LOW_MAX = 20
MEDIUM_MAX = 55


def compute_risk_score(risky_clauses, missing_clauses):
    """Return (score: int 0-100, level: "Low"|"Medium"|"High")."""

    severity_points = 0
    for clause in risky_clauses or []:
        severity = str(clause.get("severity", "")).strip().lower()
        severity_points += SEVERITY_WEIGHTS.get(severity, 0)
    severity_points = min(severity_points, SEVERITY_CAP)

    matched_missing = {
        item for item in (missing_clauses or []) if item in CRITICAL_CLAUSES
    }
    missing_points = min(len(matched_missing) * MISSING_CLAUSE_PENALTY, MISSING_CLAUSE_CAP)

    score = min(100, severity_points + missing_points)

    if score <= LOW_MAX:
        level = "Low"
    elif score <= MEDIUM_MAX:
        level = "Medium"
    else:
        level = "High"

    return score, level
