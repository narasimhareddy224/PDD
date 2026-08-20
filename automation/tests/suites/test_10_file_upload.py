import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage
from automation.data.test_matrices import get_up_test_cases

@pytest.mark.parametrize("test_id, name, priority, path, target_css", get_up_test_cases())
def test_file_upload_suite(driver, request, test_id, name, priority, path, target_css):
    request.node.test_id = test_id
    request.node.module_name = "File Upload"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
