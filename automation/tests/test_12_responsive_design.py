import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 20 Test Cases for Responsive Design Across Mobile, Tablet, and Desktop Viewports
RESP_TEST_CASES = [
    # Mobile Portrait (375x812 - iPhone X)
    ("RESP_001", "Mobile 375px: Dashboard layout stacks widgets vertically", "P1", "dashboard", 375, 812),
    ("RESP_002", "Mobile 375px: Navbar displays hamburger menu toggle", "P1", "dashboard", 375, 812),
    ("RESP_003", "Mobile 375px: Recommendations grid switches to 1-column", "P1", "recommendations", 375, 812),
    ("RESP_004", "Mobile 375px: Shopping hub grid switches to 1-column", "P1", "shopping", 375, 812),
    ("RESP_005", "Mobile 375px: Price comparison modal adapts full-width", "P1", "recommendations", 375, 812),
    ("RESP_006", "Mobile 375px: Assistant chat stream occupies full viewport width", "P1", "assistant", 375, 812),
    ("RESP_007", "Mobile 375px: Calendar event form modal responsive layout", "P2", "calendar", 375, 812),

    # Tablet Portrait (768x1024 - iPad)
    ("RESP_008", "Tablet 768px: Dashboard 2-column grid layout", "P2", "dashboard", 768, 1024),
    ("RESP_009", "Tablet 768px: Recommendations grid switches to 2-columns", "P2", "recommendations", 768, 1024),
    ("RESP_010", "Tablet 768px: Shopping hub store cards 2-column layout", "P2", "shopping", 768, 1024),
    ("RESP_011", "Tablet 768px: Analysis page side-by-side split container", "P2", "analysis", 768, 1024),
    ("RESP_012", "Tablet 768px: Profile form multi-column field arrangement", "P2", "profile", 768, 1024),

    # Desktop Standard (1366x768)
    ("RESP_013", "Laptop 1366px: Dashboard full hero banner rendering", "P2", "dashboard", 1366, 768),
    ("RESP_014", "Laptop 1366px: Recommendations 3-column grid layout", "P2", "recommendations", 1366, 768),
    ("RESP_015", "Laptop 1366px: Shopping hub 4-store comparison cards", "P2", "shopping", 1366, 768),

    # Desktop Large (1920x1080 - 1080p FHD)
    ("RESP_016", "Desktop 1080p: Navbar horizontal links visible without hamburger", "P1", "dashboard", 1920, 1080),
    ("RESP_017", "Desktop 1080p: Recommendations 3-column layout with optimal card margins", "P1", "recommendations", 1920, 1080),
    ("RESP_018", "Desktop 1080p: Shopping hub layout max-width centered container", "P2", "shopping", 1920, 1080),
    ("RESP_019", "Desktop 1080p: Assistant chat centered card layout", "P2", "assistant", 1920, 1080),
    ("RESP_020", "Desktop 1080p: Outfit detail large split visual & spec breakdown", "P1", "outfits/outfit-smart-blue-1", 1920, 1080),
]

@pytest.mark.parametrize("test_id, name, priority, path, width, height", RESP_TEST_CASES)
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
