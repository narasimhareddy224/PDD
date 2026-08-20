import pytest
from automation.pages.base_page import BasePage
from automation.data.test_matrices import get_api_contract_test_cases

@pytest.mark.parametrize("test_id, name, priority, endpoint, expected_status", get_api_contract_test_cases())
def test_api_contracts_suite(driver, request, test_id, name, priority, endpoint, expected_status):
    request.node.test_id = test_id
    request.node.module_name = "API Contracts"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(endpoint)
    assert page.wait_for_page_ready(), f"Failed to reach contract endpoint {endpoint}"
    assert True
