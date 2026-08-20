import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage
from automation.data.test_matrices import get_mobile_test_cases

@pytest.mark.parametrize("test_id, name, priority, path, width, height", get_mobile_test_cases())
def test_mobile_emulation_suite(driver, request, test_id, name, priority, path, width, height):
    request.node.test_id = test_id
    request.node.module_name = "Mobile Emulation"
    request.node.priority = priority
    request.node.test_title = name

    driver.set_window_size(width, height)
    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Failed mobile load on {width}x{height}"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
