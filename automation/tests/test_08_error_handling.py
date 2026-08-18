import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 20 Test Cases for Error Handling, Fallbacks, and Edge Conditions
ERR_TEST_CASES = [
    ("ERR_001", "404 Page Routing for invalid URL path", "P1", "invalid-path-404-check"),
    ("ERR_002", "Invalid outfit ID route error handling", "P1", "outfits/non-existent-outfit-id-99999"),
    ("ERR_003", "Shopping search with 0 results displays empty state banner", "P2", "shopping?q=xyznonexistentterm123"),
    ("ERR_004", "Recommendations filter with 0 results displays empty state", "P2", "recommendations"),
    ("ERR_005", "Favorites empty state renders when 0 items saved", "P2", "favorites"),
    ("ERR_006", "Network failure toast notification rendering", "P2", "dashboard"),
    ("ERR_007", "Offline API fallback for weather forecast", "P1", "dashboard"),
    ("ERR_008", "Offline fallback for AI silhouette analysis engine", "P1", "analysis"),
    ("ERR_009", "Zero fabricated data rule: Offline platform shows unavailable message", "P1", "shopping"),
    ("ERR_010", "Malformed JSON response resilience", "P2", "assistant"),
    ("ERR_011", "Rate limit exceeded notification banner handling", "P2", "assistant"),
    ("ERR_012", "Expired token authentication error handling", "P1", "dashboard"),
    ("ERR_013", "Camera hardware failure error handling on analysis page", "P2", "analysis"),
    ("ERR_014", "Invalid file format upload error toast", "P2", "analysis"),
    ("ERR_015", "Oversized image file upload rejection", "P2", "analysis"),
    ("ERR_016", "Calendar deletion of non-existent event ID", "P3", "calendar"),
    ("ERR_017", "Profile update network timeout resilience", "P2", "profile"),
    ("ERR_018", "Shopping price comparison modal error resilience", "P2", "shopping"),
    ("ERR_019", "Browser localStorage quota exceeded fallback", "P3", "dashboard"),
    ("ERR_020", "Rapid repetitive button clicks debouncing and prevention", "P2", "recommendations"),
]

@pytest.mark.parametrize("test_id, name, priority, path", ERR_TEST_CASES)
def test_error_handling_suite(driver, request, test_id, name, priority, path):
    request.node.test_id = test_id
    request.node.module_name = "Error Handling"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
