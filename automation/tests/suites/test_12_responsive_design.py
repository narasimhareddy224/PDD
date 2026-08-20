import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage
from automation.data.test_matrices import get_resp_test_cases

@pytest.mark.parametrize("test_id, name, priority, path, width, height", get_resp_test_cases())
def test_responsive_design_suite(driver, request, test_id, name, priority, path, width, height):
    request.node.test_id = test_id
    request.node.module_name = "Responsive Design"
    request.node.priority = priority
    request.node.test_title = name

    driver.set_window_size(width, height)
    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed to load at {width}x{height}"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
