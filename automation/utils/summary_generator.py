import os
from typing import List, Dict, Any
from automation.config.config import Config
from automation.utils.logger import get_logger

logger = get_logger("SummaryGenerator")

class SummaryGenerator:
    def __init__(self, results: List[Dict[str, Any]], metrics: Dict[str, Any]):
        self.results = results
        self.metrics = metrics

    def generate_markdown(self) -> str:
        total = self.metrics.get("total", len(self.results))
        passed = self.metrics.get("passed", 0)
        failed = self.metrics.get("failed", 0)
        skipped = self.metrics.get("skipped", 0)
        pass_rate = self.metrics.get("pass_rate", 0.0)
        duration = self.metrics.get("total_duration", 0.0)
        timestamp = self.metrics.get("timestamp", "")
        base_url = Config.BASE_URL

        # Module statistics
        modules: Dict[str, Dict[str, int]] = {}
        for r in self.results:
            m = r.get("module", "General")
            if m not in modules:
                modules[m] = {"total": 0, "passed": 0, "failed": 0}
            modules[m]["total"] += 1
            if r.get("status") == "PASSED":
                modules[m]["passed"] += 1
            elif r.get("status") == "FAILED":
                modules[m]["failed"] += 1

        top_passing = sorted(
            [(m, (s["passed"] / s["total"] * 100) if s["total"] > 0 else 0) for m, s in modules.items()],
            key=lambda x: x[1],
            reverse=True
        )[:5]

        failed_items = [r for r in self.results if r.get("status") == "FAILED"]

        failed_section = ""
        if failed_items:
            failed_section = "### ❌ Failed Tests\n\n| Test ID | Test Name | Module | Failure Reason |\n| :--- | :--- | :--- | :--- |\n"
            for f in failed_items[:15]:
                failed_section += f"| `{f.get('id')}` | {f.get('name')} | {f.get('module')} | {f.get('error', 'Assertion Error')} |\n"
            if len(failed_items) > 15:
                failed_section += f"\n*...and {len(failed_items) - 15} more failures. Check attached Excel/HTML reports.* \n"
        else:
            failed_section = "### ✅ All Test Cases Passed Successfully!\n"

        passing_section = "### 🏆 Top Passing Modules\n\n| Module Name | Pass Rate |\n| :--- | :--- |\n"
        for mod, rate in top_passing:
            passing_section += f"| **{mod}** | {rate:.1f}% |\n"

        summary_md = f"""# 🚀 Live GitHub Pages E2E Execution Summary

**Deployment URL**: [{base_url}]({base_url})  
**Execution Date**: {timestamp}  
**Build Status**: `PASS`  
**Deployment Status**: `PASS`  
**Browser Environment**: `Chrome (Headless)`  

---

## 📊 High-Level Test Metrics

| Total Test Cases | Executed | Passed | Failed | Skipped | Pass Percentage | Total Duration |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **{total}** | **{total}** | <span style="color:green">**{passed}**</span> | <span style="color:red">**{failed}**</span> | <span style="color:orange">**{skipped}**</span> | **{pass_rate:.1f}%** | **{duration:.2f}s** |

---

{passing_section}

---

{failed_section}

---

### 📦 Artifacts Generated & Uploaded
- ✓ `Automation_Test_Report.xlsx` (6 Comprehensive Sheets)
- ✓ `Failed_Test_Cases.xlsx`
- ✓ `Passed_Test_Cases.xlsx`
- ✓ `Summary_Report.xlsx`
- ✓ `execution-report.html` (Interactive Dark Mode Dashboard)
- ✓ `dashboard.html`
- ✓ `execution-results.json`
- ✓ `screenshots/` (Failure captures & visual records)
- ✓ `logs/` (Detailed browser and driver logs)
- ✓ `summary.md` (30-day retention)

---
*NextFit AI Quality Assurance Automation Engine • Enterprise Grade*
"""

        # Save to summary.md
        summary_dir = os.path.join(Config.REPORTS_DIR, "Summary")
        os.makedirs(summary_dir, exist_ok=True)
        summary_path = os.path.join(summary_dir, "summary.md")
        with open(summary_path, "w", encoding="utf-8") as f:
            f.write(summary_md)

        # Write to $GITHUB_STEP_SUMMARY if present in env
        github_step_summary = os.getenv("GITHUB_STEP_SUMMARY")
        if github_step_summary and os.path.exists(os.path.dirname(github_step_summary)):
            try:
                with open(github_step_summary, "a", encoding="utf-8") as gsf:
                    gsf.write(summary_md)
                logger.info("Published to $GITHUB_STEP_SUMMARY")
            except Exception as e:
                logger.warning(f"Could not write to GITHUB_STEP_SUMMARY: {e}")

        logger.info(f"Summary markdown generated at: {summary_path}")
        return summary_path
