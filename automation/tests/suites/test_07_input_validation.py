import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage
from automation.data.test_matrices import get_val_test_cases

@pytest.mark.parametrize("test_id, name, priority, path, field, payload, should_accept", get_val_test_cases())
def test_input_validation_suite(driver, request, test_id, name, priority, path, field, payload, should_accept):
    request.node.test_id = test_id
    request.node.module_name = "Input Validation"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body element missing"
