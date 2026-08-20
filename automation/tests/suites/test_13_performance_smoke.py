import pytest
import time
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage
from automation.data.test_matrices import get_perf_test_cases

@pytest.mark.parametrize("test_id, name, priority, path, max_duration_sec", get_perf_test_cases())
def test_performance_smoke_suite(driver, request, test_id, name, priority, path, max_duration_sec):
    request.node.test_id = test_id
    request.node.module_name = "Performance Smoke"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    start = time.time()
    page.navigate_to(path)
    page.wait_for_page_ready()
    duration = time.time() - start

    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
    if max_duration_sec > 0:
        assert duration < (max_duration_sec * 3), f"Page load exceeded threshold: {duration:.2f}s"
