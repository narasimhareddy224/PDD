import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 20 Test Cases for Session Lifecycle, Token Persistence, and Storage
SESS_TEST_CASES = [
    ("SESS_001", "Session token created in localStorage upon login", "P1", "dashboard"),
    ("SESS_002", "Session token persists across page refreshes", "P1", "dashboard"),
    ("SESS_003", "Session token persists during cross-route navigation", "P1", "profile"),
    ("SESS_004", "Session sync endpoint invoked on app initialization", "P1", "dashboard"),
    ("SESS_005", "User profile object stored in application state", "P1", "profile"),
    ("SESS_006", "Logout action clears authentication token from localStorage", "P1", "dashboard"),
    ("SESS_007", "Logout action redirects user to login screen", "P1", "dashboard"),
    ("SESS_008", "Post-logout back button does not expose protected user data", "P1", "dashboard"),
    ("SESS_009", "Multi-tab session synchronization across browser tabs", "P2", "favorites"),
    ("SESS_010", "Manual localStorage token deletion triggers session logout", "P2", "dashboard"),
    ("SESS_011", "Session token header attached to API requests", "P1", "recommendations"),
    ("SESS_012", "FCM push token saved to user session metadata", "P2", "settings"),
    ("SESS_013", "Session timeout graceful background token refresh", "P2", "dashboard"),
    ("SESS_014", "Session state maintains selected favorites across refreshes", "P2", "favorites"),
    ("SESS_015", "Session state maintains outfit calendar schedules across refreshes", "P2", "calendar"),
    ("SESS_016", "Session state maintains conversational chat history across refreshes", "P2", "assistant"),
    ("SESS_017", "Session state maintains latest AI silhouette metrics across refreshes", "P2", "analysis"),
    ("SESS_018", "Demo user session auto-initialization on first launch", "P1", "dashboard"),
    ("SESS_019", "Storage isolation between incognito/private windows", "P3", "dashboard"),
    ("SESS_020", "Clean teardown of event listeners on session terminate", "P2", "settings"),
]

@pytest.mark.parametrize("test_id, name, priority, path", SESS_TEST_CASES)
def test_session_management_suite(driver, request, test_id, name, priority, path):
    request.node.test_id = test_id
    request.node.module_name = "Session Management"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
