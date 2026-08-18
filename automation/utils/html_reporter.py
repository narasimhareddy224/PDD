import os
import json
from typing import List, Dict, Any
from automation.config.config import Config
from automation.utils.logger import get_logger

logger = get_logger("HTMLReporter")

class HTMLReporter:
    def __init__(self, results: List[Dict[str, Any]], metrics: Dict[str, Any]):
        self.results = results
        self.metrics = metrics
        self.output_dir = os.path.join(Config.REPORTS_DIR, "HTML")
        os.makedirs(self.output_dir, exist_ok=True)

    def generate(self) -> Dict[str, str]:
        report_path = os.path.join(self.output_dir, "execution-report.html")
        dashboard_path = os.path.join(self.output_dir, "dashboard.html")
        json_path = os.path.join(Config.REPORTS_DIR, "JSON", "execution-results.json")
        os.makedirs(os.path.dirname(json_path), exist_ok=True)

        # Write JSON Results
        with open(json_path, "w", encoding="utf-8") as jf:
            json.dump({
                "metrics": self.metrics,
                "results": self.results
            }, jf, indent=2)

        # Build Module Analytics
        modules: Dict[str, Dict[str, int]] = {}
        for r in self.results:
            m = r.get("module", "General")
            if m not in modules:
                modules[m] = {"total": 0, "passed": 0, "failed": 0, "skipped": 0}
            modules[m]["total"] += 1
            st = r.get("status", "PASSED").lower()
            if st == "passed":
                modules[m]["passed"] += 1
            elif st == "failed":
                modules[m]["failed"] += 1
            else:
                modules[m]["skipped"] += 1

        # Generate HTML Dashboard Content
        html_content = self._render_template(modules)
        
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        with open(dashboard_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        logger.info(f"HTML execution report generated: {report_path}")
        return {"report": report_path, "dashboard": dashboard_path, "json": json_path}

    def _render_template(self, modules: Dict[str, Dict[str, int]]) -> str:
        total = self.metrics.get("total", len(self.results))
        passed = self.metrics.get("passed", 0)
        failed = self.metrics.get("failed", 0)
        skipped = self.metrics.get("skipped", 0)
        pass_rate = self.metrics.get("pass_rate", 0.0)
        duration = self.metrics.get("total_duration", 0.0)
        timestamp = self.metrics.get("timestamp", "")
        base_url = Config.BASE_URL

        # Module table rows
        module_rows = ""
        for mod_name, stat in sorted(modules.items(), key=lambda x: x[0]):
            m_pass_rate = (stat["passed"] / stat["total"] * 100) if stat["total"] > 0 else 0
            badge_class = "badge-pass" if m_pass_rate >= 95 else ("badge-warn" if m_pass_rate >= 80 else "badge-fail")
            module_rows += f"""
            <tr>
                <td><strong>{mod_name}</strong></td>
                <td>{stat['total']}</td>
                <td class="text-pass">{stat['passed']}</td>
                <td class="text-fail">{stat['failed']}</td>
                <td class="text-skip">{stat['skipped']}</td>
                <td><span class="badge {badge_class}">{m_pass_rate:.1f}%</span></td>
            </tr>
            """

        # Test Case rows (interactive)
        test_rows = ""
        for t in self.results:
            st = t.get("status", "PASSED")
            st_class = "status-pass" if st == "PASSED" else ("status-fail" if st == "FAILED" else "status-skip")
            test_rows += f"""
            <tr class="test-row" data-status="{st}" data-module="{t.get('module', 'General')}">
                <td class="font-mono">{t.get('id', '')}</td>
                <td><span class="mod-pill">{t.get('module', '')}</span></td>
                <td>{t.get('name', '')}</td>
                <td><span class="priority-pill">{t.get('priority', 'P2')}</span></td>
                <td><span class="status-badge {st_class}">{st}</span></td>
                <td>{round(t.get('duration', 0.0), 3)}s</td>
                <td class="error-col">{t.get('error', '-')}</td>
            </tr>
            """

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NextFit AI – Enterprise Live E2E Automation Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {{
            --bg-base: #07090E;
            --bg-surface: #0E131F;
            --bg-card: rgba(18, 24, 38, 0.75);
            --border-subtle: rgba(255, 255, 255, 0.08);
            --border-accent: rgba(244, 63, 94, 0.3);
            --accent-rose: #F43F5E;
            --accent-emerald: #10B981;
            --accent-gold: #F59E0B;
            --accent-blue: #38BDF8;
            --accent-violet: #8B5CF6;
            --text-primary: #FFFFFF;
            --text-secondary: #94A3B8;
            --text-muted: #64748B;
        }}
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--bg-base);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 2.5rem 2rem 5rem;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(244, 63, 94, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 40%);
        }}
        .container {{ max-width: 1400px; margin: 0 auto; }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-subtle);
        }}
        .brand-title {{
            font-family: 'Outfit', sans-serif;
            font-size: 2.2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #FFFFFF, #CBD5E1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .brand-subtitle {{
            color: var(--text-secondary);
            font-size: 0.92rem;
            margin-top: 0.35rem;
        }}
        .meta-pill {{
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            color: var(--accent-blue);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }}
        
        /* KPI Cards Grid */
        .kpi-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.25rem;
            margin-bottom: 2.5rem;
        }}
        .kpi-card {{
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border-subtle);
            border-radius: 1.25rem;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            transition: transform 0.2s ease;
        }}
        .kpi-card:hover {{ transform: translateY(-3px); }}
        .kpi-label {{ font-size: 0.82rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; }}
        .kpi-val {{ font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 800; line-height: 1.1; }}
        .text-pass {{ color: var(--accent-emerald); }}
        .text-fail {{ color: var(--accent-rose); }}
        .text-skip {{ color: var(--accent-gold); }}
        
        /* Panels */
        .panel {{
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 1.5rem;
            padding: 2rem;
            margin-bottom: 2.5rem;
            backdrop-filter: blur(16px);
        }}
        .panel-title {{
            font-family: 'Outfit', sans-serif;
            font-size: 1.35rem;
            font-weight: 700;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.6rem;
        }}
        
        /* Tables */
        table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
        }}
        th {{
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-secondary);
            text-align: left;
            padding: 0.9rem 1rem;
            font-weight: 600;
            border-bottom: 1px solid var(--border-subtle);
        }}
        td {{
            padding: 0.85rem 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            color: #E2E8F0;
        }}
        tr:hover td {{ background: rgba(255, 255, 255, 0.02); }}
        
        /* Badges */
        .status-badge {{
            padding: 0.25rem 0.65rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            display: inline-block;
        }}
        .status-pass {{ background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3); }}
        .status-fail {{ background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); border: 1px solid rgba(244, 63, 94, 0.3); }}
        .status-skip {{ background: rgba(245, 158, 11, 0.15); color: var(--accent-gold); border: 1px solid rgba(245, 158, 11, 0.3); }}
        .badge-pass {{ background: rgba(16, 185, 129, 0.2); color: #34D399; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700; }}
        .badge-warn {{ background: rgba(245, 158, 11, 0.2); color: #FBBF24; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700; }}
        .badge-fail {{ background: rgba(244, 63, 94, 0.2); color: #FB7185; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700; }}
        
        .mod-pill {{ background: rgba(139, 92, 246, 0.15); color: #C4B5FD; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.78rem; }}
        .priority-pill {{ background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }}
        .font-mono {{ font-family: monospace; font-size: 0.82rem; color: #38BDF8; }}
        .error-col {{ color: #FB7185; font-size: 0.8rem; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }}
        
        /* Filters */
        .filter-bar {{
            display: flex;
            gap: 1rem;
            margin-bottom: 1.25rem;
            flex-wrap: wrap;
        }}
        .search-input {{
            flex: 1;
            min-width: 250px;
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            padding: 0.65rem 1rem;
            border-radius: 0.75rem;
            color: #FFFFFF;
            font-size: 0.88rem;
        }}
        .filter-btn {{
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            padding: 0.65rem 1.25rem;
            border-radius: 0.75rem;
            color: var(--text-secondary);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        .filter-btn.active, .filter-btn:hover {{
            background: var(--accent-rose);
            color: #FFFFFF;
            border-color: var(--accent-rose);
        }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div>
                <h1 class="brand-title">NextFit AI Test Execution Dashboard</h1>
                <p class="brand-subtitle">Automated Live E2E Verification against GitHub Pages Deployment</p>
            </div>
            <div class="meta-pill">
                <i class="fa-solid fa-globe"></i>
                <span>Live Target: <strong>{base_url}</strong></span>
            </div>
        </header>

        <!-- KPI Summary Cards -->
        <div class="kpi-grid">
            <div class="kpi-card">
                <span class="kpi-label">Total Test Cases</span>
                <span class="kpi-val">{total}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-label">Passed Tests</span>
                <span class="kpi-val text-pass">{passed}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-label">Failed Tests</span>
                <span class="kpi-val text-fail">{failed}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-label">Skipped Tests</span>
                <span class="kpi-val text-skip">{skipped}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-label">Pass Percentage</span>
                <span class="kpi-val text-pass">{pass_rate:.1f}%</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-label">Execution Duration</span>
                <span class="kpi-val">{duration:.2f}s</span>
            </div>
        </div>

        <!-- Module Breakdown Panel -->
        <div class="panel">
            <h2 class="panel-title"><i class="fa-solid fa-cubes text-pass"></i> Module-Wise Test Distribution</h2>
            <table>
                <thead>
                    <tr>
                        <th>Module Name</th>
                        <th>Total Tests</th>
                        <th>Passed</th>
                        <th>Failed</th>
                        <th>Skipped</th>
                        <th>Pass Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {module_rows}
                </tbody>
            </table>
        </div>

        <!-- Executed Test Cases Table -->
        <div class="panel">
            <h2 class="panel-title"><i class="fa-solid fa-list-check" style="color: var(--accent-blue);"></i> Executed Test Cases</h2>
            <div class="filter-bar">
                <input type="text" id="searchInput" class="search-input" placeholder="Search by Test ID, Name, or Module..." onkeyup="filterTests()">
                <button class="filter-btn active" onclick="setStatusFilter('ALL', this)">All ({total})</button>
                <button class="filter-btn" onclick="setStatusFilter('PASSED', this)">Passed ({passed})</button>
                <button class="filter-btn" onclick="setStatusFilter('FAILED', this)">Failed ({failed})</button>
                <button class="filter-btn" onclick="setStatusFilter('SKIPPED', this)">Skipped ({skipped})</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Test ID</th>
                        <th>Module</th>
                        <th>Test Name</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Duration</th>
                        <th>Failure Reason</th>
                    </tr>
                </thead>
                <tbody id="testTableBody">
                    {test_rows}
                </tbody>
            </table>
        </div>
    </div>

    <script>
        let currentStatus = 'ALL';

        function setStatusFilter(status, btn) {{
            currentStatus = status;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterTests();
        }}

        function filterTests() {{
            const search = document.getElementById('searchInput').value.toLowerCase();
            const rows = document.querySelectorAll('.test-row');

            rows.forEach(row => {{
                const status = row.getAttribute('data-status');
                const text = row.innerText.toLowerCase();
                
                const statusMatches = (currentStatus === 'ALL' || status === currentStatus);
                const searchMatches = (!search || text.includes(search));

                if (statusMatches && searchMatches) {{
                    row.style.display = '';
                }} else {{
                    row.style.display = 'none';
                }}
            }});
        }}
    </script>
</body>
</html>
"""
