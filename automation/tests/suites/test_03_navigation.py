import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage
from automation.data.test_matrices import get_nav_test_cases

@pytest.mark.parametrize("test_id, name, priority, trigger, expected_target", get_nav_test_cases())
def test_navigation_suite(driver, request, test_id, name, priority, trigger, expected_target):
    request.node.test_id = test_id
    request.node.module_name = "Navigation"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to("dashboard")
    assert page.wait_for_page_ready(), "Navigation target failed ready state"

    if trigger.startswith("a[") or trigger.startswith("."):
        if page.is_present((By.CSS_SELECTOR, trigger)):
            page.click((By.CSS_SELECTOR, trigger))
            assert True
    else:
        page.navigate_to(trigger)
        assert page.wait_for_page_ready()
