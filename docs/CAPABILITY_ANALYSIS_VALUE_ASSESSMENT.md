# Manufacturing Capability Analysis - Value Assessment & Improvements

**Date:** February 2, 2026  
**Context:** Engineering Manager Decision-Making Value Analysis

## Executive Summary

Analysis of the manufacturing capability analysis feature revealed it provides basic feasibility assessment but lacks critical data for engineering managers to make informed quoting decisions. Current value: **4/10**. Target: **9/10**.

---

## ✅ Current Strengths

1. **Quick capability assessment** - Immediate "yes/no" on in-house feasibility
2. **Multiple machine options** - Shows compatible machines for capacity planning
3. **Clear contact info** - Easy customer follow-up
4. **Material/finish captured** - Materials and finishes documented
5. **Visual confidence indicators** - Quick scan of capability match

---

## 🚨 Critical Issues Identified

### 1. Machine Count Discrepancy
**Issue:** Header shows "12 compatible machine(s)" but display shows only 5  
**Impact:** Engineering manager can't trust capacity planning data  
**Solution:** Display all matched machines or clarify filtering logic

### 2. Missing Critical Decision Data
An engineering manager making a quote decision requires:

- ❌ **Cost estimate** (material + machining hours + setup)
- ❌ **Lead time** (beyond setup - actual production time)
- ❌ **Tolerance capabilities** (aerospace typically needs ±0.001" or tighter)
- ❌ **Part size vs work envelope** (fit validation)
- ❌ **Certification requirements** (AS9100, NADCAP for aerospace)

**Impact:** Cannot generate competitive quotes without this data  
**Solution:** Enhance analysis to calculate and display these metrics

### 3. Titanium-Specific Red Flags
Ti-6AL-4V is highly challenging to machine:

- ❌ No mention of titanium-specific capabilities:
  - High-pressure coolant (TSC/through-spindle coolant)
  - Carbide tooling requirements
  - Low surface speed (50-100 SFM)
  - High spindle torque needs
- ❌ **70% confidence seems low** for critical aerospace material
- ❌ **45min setup seems generic** - titanium requires specialized setup
- ⚠️ **"Black Oxide" finish on titanium?** - Typically for steel (validation needed)

**Impact:** Risk of accepting jobs beyond actual capability  
**Solution:** Add material difficulty ratings and specific capability checks

### 4. Operations Ambiguity
- Says "2/2 Operations Matched" but doesn't specify operations
- For "Control Arm" expect: roughing, finishing, hole drilling, threading
- Manager can't validate analysis correctness

**Impact:** Cannot verify if machines actually match job requirements  
**Solution:** Display explicit operation list and match details

### 5. Missing Risk/Quality Indicators
- No "difficult material" flags
- No scrap risk warnings (titanium is expensive)
- No quality certification traceability notes

**Impact:** Hidden risks lead to cost overruns and quality issues  
**Solution:** Add risk assessment and certification validation

---

## 📊 Improvement Roadmap

### High Priority (Critical for MVP)

1. **Fix machine count discrepancy**
   - Display all matched machines or clarify why subset shown
   - Add filtering/sorting explanation

2. **Add cost estimate range**
   - Calculate material cost (quantity × material price/unit)
   - Estimate machining time (operation hours)
   - Include setup cost allocation
   - Display as range: "$X - $Y per part"

3. **Add lead time estimate**
   - Calculate production time: (setup + run time) × quantity
   - Account for queue time
   - Display: "X days for quantity Y"

4. **Show operation details**
   - List required operations explicitly
   - Show which machines matched which operations
   - Display operation sequence

5. **Add material difficulty flag**
   - Classify materials: Standard / Moderate / Difficult / Exotic
   - Display warning: "⚠️ Titanium requires special tooling/setup"
   - Link to material handling guidelines

### Medium Priority (Enhance Value)

6. **Validate finish compatibility**
   - Check finish against material compatibility matrix
   - Flag incompatible combinations
   - Suggest alternatives

7. **Add tolerance achievability**
   - Compare required tolerances vs machine capabilities
   - Display: "±0.0005" achievable" or "⚠️ Tolerance tighter than standard"
   - Flag if special fixtures needed

8. **Show certification gaps**
   - Check: AS9100, ISO 9001, NADCAP, ITAR
   - Display: "AS9100 required? ✓ Available" or "❌ Not certified"
   - Add certification costs if applicable

9. **Add material cost impact**
   - Show material cost vs aluminum baseline
   - "Titanium: $30-50/lb vs Aluminum: $2-5/lb"
   - Help evaluate material substitution

### Nice to Have (Future Enhancements)

10. **Show confidence reasoning**
    - Explain why confidence is X%
    - List factors that increased/decreased confidence
    - Transparency for engineering validation

11. **Alternative material suggestions**
    - If confidence is low, suggest alternatives
    - "Consider 7075 Aluminum for cost savings"
    - Compare performance characteristics

12. **Capacity availability**
    - Check machine schedule
    - Display: "Machine available week of X"
    - Automatic lead time adjustment

13. **Estimated scrap rate**
    - Based on material difficulty + operation complexity
    - Add scrap cost to quote
    - Help with risk assessment

14. **Tooling cost amortization**
    - For custom fixtures/tooling
    - Amortize over quantity
    - Include in unit cost

---

## 🎯 Value Scoring Matrix

| Criterion | Current | Target | Priority |
|-----------|---------|--------|----------|
| Feasibility Check | ✅ 10/10 | 10/10 | - |
| Machine Selection | ⚠️ 6/10 | 9/10 | High |
| Cost Estimation | ❌ 0/10 | 9/10 | High |
| Lead Time | ❌ 2/10 | 9/10 | High |
| Risk Assessment | ❌ 1/10 | 8/10 | High |
| Material Handling | ❌ 3/10 | 8/10 | Medium |
| Quality/Certs | ❌ 0/10 | 7/10 | Medium |
| Operation Details | ❌ 2/10 | 8/10 | High |
| **Overall** | **4/10** | **9/10** | - |

---

## Implementation Notes

### Database Schema
- Current `capability_analysis` JSONB field can accommodate additional data
- No schema changes required for initial improvements
- Consider dedicated tables for material properties and cost models in future

### API Changes Required
- `api/analyze-capability.ts`: Enhance analysis logic
- Add cost calculation functions
- Add lead time estimation
- Add material difficulty assessment
- Add operation breakdown

### Frontend Changes Required
- `SubmissionHistory.tsx`: Enhanced display of analysis results
- Add cost range display
- Add lead time display
- Add material warning flags
- Add operation list display

### Data Requirements
- Material cost database ($/lb or $/unit)
- Machining time estimates per operation
- Setup time database by material/operation
- Material difficulty ratings
- Finish compatibility matrix

---

## Success Metrics

**Engineering Manager can answer:**
1. ✅ Can we make it? (Current)
2. ✅ What will it cost? (Target)
3. ✅ When can we deliver? (Target)
4. ✅ What are the risks? (Target)
5. ✅ Do we have capacity? (Target)
6. ✅ Are we certified? (Target)

**Business Impact:**
- Reduce quote preparation time: 2 hours → 30 minutes
- Increase quote accuracy: ±40% → ±15%
- Reduce "surprise" costs: 30% of jobs → 5% of jobs
- Faster customer response: 2 days → same day

---

## Revision History

- **2026-02-02**: Initial assessment and improvement roadmap created
- Future updates will be appended here

---

## Related Documentation
- `/docs/DESIGN_SYSTEM_FINAL.md` - UI/UX guidelines
- `/database/schema-postgres.sql` - Database schema
- `/api/analyze-capability.ts` - Analysis implementation
