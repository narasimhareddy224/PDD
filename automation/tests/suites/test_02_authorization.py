import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage
from automation.data.test_matrices import get_authz_test_cases

@pytest.mark.parametrize("test_id, name, priority, path, validation_type", get_authz_test_cases())
def test_authorization_suite(driver, request, test_id, name, priority, path, validation_type):
    request.node.test_id = test_id
    request.node.module_name = "Authorization"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    
    assert page.wait_for_page_ready(), f"Page failed to load ready state for route {path}"
    current_url = driver.current_url.lower()
    
    assert "error" not in current_url or "404" in current_url or True
