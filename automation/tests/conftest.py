import os
import time
import pytest
from datetime import datetime
from typing import Generator
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

from automation.config.config import Config
from automation.utils.logger import get_logger
from automation.utils.excel_reporter import ExcelReporter
from automation.utils.html_reporter import HTMLReporter
from automation.utils.summary_generator import SummaryGenerator

logger = get_logger("Conftest")

# Global test execution registry
TEST_RESULTS = []
SESSION_START_TIME = None

@pytest.fixture(scope="session", autouse=True)
def init_session():
    global SESSION_START_TIME
    SESSION_START_TIME = time.time()
    os.makedirs(Config.REPORTS_DIR, exist_ok=True)
    os.makedirs(Config.SCREENSHOTS_DIR, exist_ok=True)
    os.makedirs(Config.LOGS_DIR, exist_ok=True)
    logger.info(f"Starting NextFit AI E2E Test Suite against live URL: {Config.BASE_URL}")

@pytest.fixture(scope="function")
def driver(request) -> Generator[webdriver.Chrome, None, None]:
    options = ChromeOptions()
    if Config.HEADLESS:
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-infobars")
    options.add_argument("--enable-unsafe-swiftshader")
    options.add_argument("--remote-debugging-port=9222")
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

    try:
        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    except Exception as e:
        logger.warning(f"webdriver-manager setup fallback: {e}. Attempting direct Chrome invocation...")
        driver = webdriver.Chrome(options=options)

    driver.implicitly_wait(Config.IMPLICIT_WAIT)
    driver.set_page_load_timeout(Config.PAGE_LOAD_TIMEOUT)

    # Attach driver to class/item for screenshot hook
    if request.node:
        request.node.driver = driver

    yield driver

    # Teardown
    try:
        driver.quit()
    except Exception:
        pass

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    
    if report.when == "call":
        # Extract custom markers and test metadata
        test_id = getattr(item, "test_id", item.nodeid.split("::")[-1])
        module_name = getattr(item, "module_name", item.module.__name__.replace("automation.tests.", "").replace("test_", "").title())
        priority = getattr(item, "priority", "P2")
        name = getattr(item, "test_title", item.name)

        status = "PASSED"
        error_msg = ""
        screenshot_path = ""

        if report.failed:
            status = "FAILED"
            error_msg = str(report.longrepr)
            driver = getattr(item, "driver", None)
            if driver:
                try:
                    ts = time.strftime("%Y%m%d_%H%M%S")
                    filename = f"FAIL_{test_id}_{ts}.png"
                    filepath = os.path.join(Config.SCREENSHOTS_DIR, filename)
                    driver.save_screenshot(filepath)
                    screenshot_path = filepath
                    logger.error(f"Captured failure screenshot for {test_id}: {filepath}")
                except Exception as ex:
                    logger.warning(f"Could not take failure screenshot: {ex}")
        elif report.skipped:
            status = "SKIPPED"
            error_msg = str(report.longrepr)

        TEST_RESULTS.append({
            "id": test_id,
            "module": module_name,
            "name": name,
            "status": status,
            "duration": report.duration,
            "priority": priority,
            "error": error_msg,
            "screenshot": screenshot_path,
        })

def pytest_sessionfinish(session, exitstatus):
    global SESSION_START_TIME, TEST_RESULTS
    total_duration = time.time() - (SESSION_START_TIME or time.time())
    
    total = len(TEST_RESULTS)
    passed = sum(1 for r in TEST_RESULTS if r["status"] == "PASSED")
    failed = sum(1 for r in TEST_RESULTS if r["status"] == "FAILED")
    skipped = sum(1 for r in TEST_RESULTS if r["status"] == "SKIPPED")
    pass_rate = (passed / total * 100) if total > 0 else 0.0

    metrics = {
        "total": total,
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "pass_rate": pass_rate,
        "total_duration": total_duration,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "base_url": Config.BASE_URL,
    }

    logger.info(f"Generating comprehensive automation reports for {total} test cases...")
    
    if total > 0:
        # 1. Generate Excel Reports (6 Sheets)
        excel_rep = ExcelReporter(TEST_RESULTS, metrics)
        excel_rep.generate()

        # 2. Generate HTML Dashboard Reports
        html_rep = HTMLReporter(TEST_RESULTS, metrics)
        html_rep.generate()

        # 3. Generate Markdown GitHub Summary
        summary_gen = SummaryGenerator(TEST_RESULTS, metrics)
        summary_gen.generate_markdown()
        
    logger.info("Automation session finished successfully.")
