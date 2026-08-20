# NextFit AI – Enterprise E2E Test Automation Framework

An enterprise-grade Selenium WebDriver + Pytest E2E automation framework designed for **670+ categorized test cases (minimum 500+ required)** executing directly against the live GitHub Pages deployment.

---

## 🌟 Key Features

1. **Strict Live Deployment Execution**: Tests run exclusively against `BASE_URL` (e.g. `https://narasimhareddy224.github.io/PDD/`).
2. **Page Object Model (POM)**: 12 modular page object classes with explicit waits, stale element recovery, and automatic DOM readiness synchronization.
3. **670+ Executable Test Cases** across 16 categories:
   - Authentication (50)
   - Authorization & Route Protection (50)
   - Navigation & Routing (40)
   - UI & Glassmorphism Validation (60)
   - Forms & Input Elements (60)
   - CRUD Operations (60)
   - Input Validation & Boundaries (50)
   - Error Handling & Fallbacks (30)
   - Session Lifecycle Management (30)
   - Photo Upload & Vision Capture (30)
   - Web Accessibility / a11y (30)
   - Responsive Design on Viewports (30)
   - Performance Smoke & Load Budgets (30)
   - End-to-End User Regression (60)
   - API Contracts & Schema Validation (30)
   - Mobile Device Emulation (30)
4. **Multi-Sheet Excel Reporting**: Generates `Automation_Test_Report.xlsx` with 6 detailed sheets:
   - Sheet 1: Executed Test Cases
   - Sheet 2: Passed Tests
   - Sheet 3: Failed Tests
   - Sheet 4: Skipped Tests
   - Sheet 5: Execution Metrics
   - Sheet 6: Defect Summary & Root Causes
5. **Interactive Glassmorphism HTML Dashboard**: Dark-mode, filterable HTML report with KPI metrics and failure analysis.
6. **Automatic GitHub Step Summary**: Markdown tables published directly to `$GITHUB_STEP_SUMMARY`.

---

## 🏗️ Folder Structure

```
automation/
├── config/
│   └── config.py               # BASE_URL, timeouts, headless configuration
├── pages/                      # Page Object Model (POM)
│   ├── base_page.py            # Explicit wait and retry wrappers
│   ├── login_page.py
│   ├── register_page.py
│   ├── dashboard_page.py
│   ├── profile_page.py
│   ├── analysis_page.py
│   ├── recommendations_page.py
│   ├── outfit_detail_page.py
│   ├── shopping_hub_page.py
│   ├── favorites_page.py
│   ├── calendar_page.py
│   ├── assistant_page.py
│   └── settings_page.py
├── data/
│   └── test_data.py            # Test matrices, boundary payloads, security vectors
├── utils/
│   ├── excel_reporter.py       # 6-sheet Excel report generator (openpyxl)
│   ├── html_reporter.py        # Glassmorphic HTML dashboard
│   ├── summary_generator.py    # GitHub Actions summary generator
│   └── logger.py               # Structured logging utility
├── tests/                      # 670+ Executable Pytest Test Cases
│   ├── conftest.py             # Driver fixture, failure screenshot hook
│   ├── test_01_authentication.py
│   ├── test_02_authorization.py
│   ├── test_03_navigation.py
│   ├── test_04_ui_validation.py
│   ├── test_05_forms.py
│   ├── test_06_crud_operations.py
│   ├── test_07_input_validation.py
│   ├── test_08_error_handling.py
│   ├── test_09_session_management.py
│   ├── test_10_file_upload.py
│   ├── test_11_accessibility.py
│   ├── test_12_responsive_design.py
│   ├── test_13_performance_smoke.py
│   ├── test_14_regression.py
│   ├── test_15_api_contracts.py
│   └── test_16_mobile_emulation.py
├── reports/                    # Generated Excel, HTML, JSON, and Markdown reports
├── screenshots/                # Failure screenshot evidence
├── logs/                       # Execution and browser logs
├── requirements.txt            # Python dependencies
└── run_tests.py                # Unified CLI Test Runner
```

---

## 🚀 Local Quick Start

### 1. Prerequisites
- Python 3.10+
- Google Chrome browser installed

### 2. Install Dependencies
```bash
cd automation
pip install -r requirements.txt
```

### 3. Execute Tests
```bash
# Run full 670+ test suite in Headless Chrome against default Live URL
python run_tests.py

# Run against custom base URL
python run_tests.py --url https://narasimhareddy224.github.io/PDD/

# Run specific module
python run_tests.py --suite test_01_authentication.py

# Run in parallel using 4 workers
python run_tests.py -n 4
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `BASE_URL` | Live Target URL for testing | `https://narasimhareddy224.github.io/PDD/` |
| `HEADLESS` | Run Chrome in headless mode (`true`/`false`) | `true` |
| `IMPLICIT_WAIT` | Implicit wait timeout in seconds | `10` |
| `EXPLICIT_WAIT` | Explicit WebDriverWait timeout in seconds | `15` |
| `PAGE_LOAD_TIMEOUT` | Page load timeout in seconds | `30` |
| `MIN_PASS_PERCENTAGE`| Minimum pass rate threshold for CI quality gate | `95.0` |
