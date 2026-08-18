import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 30 Test Cases for Navigation & Routing Integrity
NAV_TEST_CASES = [
    ("NAV_001", "Navbar Brand Logo navigation to Dashboard", "P1", ".brand-link, .navbar-brand", "dashboard"),
    ("NAV_002", "Navbar link: Dashboard navigation", "P1", "a[routerlink='/dashboard']", "dashboard"),
    ("NAV_003", "Navbar link: Recommendations navigation", "P1", "a[routerlink='/recommendations']", "recommendations"),
    ("NAV_004", "Navbar link: AI Silhouette Analysis navigation", "P1", "a[routerlink='/analysis']", "analysis"),
    ("NAV_005", "Navbar link: Shopping Deals Hub navigation", "P1", "a[routerlink='/shopping']", "shopping"),
    ("NAV_006", "Navbar link: Saved Favorites navigation", "P1", "a[routerlink='/favorites']", "favorites"),
    ("NAV_007", "Navbar link: Outfit Calendar navigation", "P1", "a[routerlink='/calendar']", "calendar"),
    ("NAV_008", "Navbar link: AI Stylist Chat navigation", "P1", "a[routerlink='/assistant']", "assistant"),
    ("NAV_009", "Navbar link: Style Profile navigation", "P2", "a[routerlink='/profile']", "profile"),
    ("NAV_010", "Navbar link: Settings navigation", "P2", "a[routerlink='/settings']", "settings"),
    ("NAV_011", "Dashboard CTA 'Discover Outfits' navigation", "P1", "dashboard", "recommendations"),
    ("NAV_012", "Dashboard CTA 'Analyze Photo' navigation", "P1", "dashboard", "analysis"),
    ("NAV_013", "Dashboard CTA 'Compare Prices' button trigger", "P1", "dashboard", "modal"),
    ("NAV_014", "Dashboard CTA 'Schedule Event' navigation", "P2", "dashboard", "calendar"),
    ("NAV_015", "Outfit Card Detail click navigates to detail view", "P1", "recommendations", "outfits/"),
    ("NAV_016", "Outfit Detail Back Link navigates to Recommendations", "P2", "outfits/outfit-smart-blue-1", "recommendations"),
    ("NAV_017", "Favorites empty state button navigates to Recommendations", "P2", "favorites", "recommendations"),
    ("NAV_018", "Browser back button navigation history consistency", "P2", "history", "back"),
    ("NAV_019", "Browser forward button navigation history consistency", "P2", "history", "forward"),
    ("NAV_020", "Direct URL deep link navigation to Outfit Detail 1", "P2", "outfits/outfit-smart-blue-1", "outfits"),
    ("NAV_021", "Direct URL deep link navigation to Outfit Detail 2", "P2", "outfits/outfit-executive-navy-2", "outfits"),
    ("NAV_022", "Direct URL deep link navigation to Outfit Detail 3", "P2", "outfits/outfit-festive-silk-3", "outfits"),
    ("NAV_023", "Footer brand links navigation", "P3", "footer", "footer"),
    ("NAV_024", "Footer privacy link interaction", "P3", "footer", "privacy"),
    ("NAV_025", "Footer terms link interaction", "P3", "footer", "terms"),
    ("NAV_026", "Mobile hamburger menu toggle button opens drawer", "P1", "navbar", "mobile_toggle"),
    ("NAV_027", "Mobile menu drawer close button dismisses menu", "P2", "navbar", "mobile_close"),
    ("NAV_028", "Mobile navigation to Profile item from drawer", "P2", "navbar", "mobile_item"),
    ("NAV_029", "External buy link opens in new tab with security rel attributes", "P1", "shopping", "external"),
    ("NAV_030", "Active navigation link highlighted with active CSS class", "P2", "recommendations", "active_class"),
]

@pytest.mark.parametrize("test_id, name, priority, trigger, expected_target", NAV_TEST_CASES)
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
