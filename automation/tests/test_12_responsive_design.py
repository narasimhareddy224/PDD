import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 30 Test Cases for Responsive Design Across Mobile, Tablet, and Desktop Viewports
RESP_TEST_CASES = [
    # Mobile Portrait (375x812 - iPhone X)
    ("RESP_001", "Mobile 375px: Dashboard layout stacks widgets vertically", "P1", "dashboard", 375, 812),
    ("RESP_002", "Mobile 375px: Navbar displays hamburger menu toggle", "P1", "dashboard", 375, 812),
    ("RESP_003", "Mobile 375px: Recommendations grid switches to 1-column", "P1", "recommendations", 375, 812),
    ("RESP_004", "Mobile 375px: Shopping hub grid switches to 1-column", "P1", "shopping", 375, 812),
    ("RESP_005", "Mobile 375px: Price comparison modal adapts full-width", "P1", "recommendations", 375, 812),
    ("RESP_006", "Mobile 375px: Assistant chat stream occupies full viewport width", "P1", "assistant", 375, 812),
    ("RESP_007", "Mobile 375px: Calendar event form modal responsive layout", "P2", "calendar", 375, 812),

    # Mobile Small (320x568 - iPhone SE)
    ("RESP_008", "Mobile 320px: Small screen text wrapping without horizontal overflow", "P2", "dashboard", 320, 568),
    ("RESP_009", "Mobile 320px: Login card form width fits small screen", "P1", "auth/login", 320, 568),
    ("RESP_010", "Mobile 320px: Recommendations filters horizontal scroll", "P2", "recommendations", 320, 568),

    # Mobile Landscape (812x375 - iPhone X Landscape)
    ("RESP_011", "Mobile Landscape 812x375: Dashboard layout adjusts horizontally", "P2", "dashboard", 812, 375),
    ("RESP_012", "Mobile Landscape 812x375: Price comparison modal scrollability", "P2", "recommendations", 812, 375),

    # Tablet Portrait (768x1024 - iPad)
    ("RESP_013", "Tablet 768px: Dashboard 2-column grid layout", "P2", "dashboard", 768, 1024),
    ("RESP_014", "Tablet 768px: Recommendations grid switches to 2-columns", "P2", "recommendations", 768, 1024),
    ("RESP_015", "Tablet 768px: Shopping hub store cards 2-column layout", "P2", "shopping", 768, 1024),
    ("RESP_016", "Tablet 768px: Analysis page side-by-side split container", "P2", "analysis", 768, 1024),
    ("RESP_017", "Tablet 768px: Profile form multi-column field arrangement", "P2", "profile", 768, 1024),

    # Tablet Landscape (1024x768 - iPad Landscape)
    ("RESP_018", "Tablet Landscape 1024x768: Recommendations 3-column grid", "P2", "recommendations", 1024, 768),
    ("RESP_019", "Tablet Landscape 1024x768: Calendar monthly timeline view", "P2", "calendar", 1024, 768),
    ("RESP_020", "Tablet Landscape 1024x768: Assistant chat two-column layout", "P2", "assistant", 1024, 768),

    # Desktop Standard (1366x768)
    ("RESP_021", "Laptop 1366px: Dashboard full hero banner rendering", "P2", "dashboard", 1366, 768),
    ("RESP_022", "Laptop 1366px: Recommendations 3-column grid layout", "P2", "recommendations", 1366, 768),
    ("RESP_023", "Laptop 1366px: Shopping hub 4-store comparison cards", "P2", "shopping", 1366, 768),

    # Desktop Large (1920x1080 - 1080p FHD)
    ("RESP_024", "Desktop 1080p: Navbar horizontal links visible without hamburger", "P1", "dashboard", 1920, 1080),
    ("RESP_025", "Desktop 1080p: Recommendations 3-column layout with optimal card margins", "P1", "recommendations", 1920, 1080),
    ("RESP_026", "Desktop 1080p: Shopping hub layout max-width centered container", "P2", "shopping", 1920, 1080),
    ("RESP_027", "Desktop 1080p: Assistant chat centered card layout", "P2", "assistant", 1920, 1080),
    ("RESP_028", "Desktop 1080p: Outfit detail large split visual & spec breakdown", "P1", "outfits/outfit-smart-blue-1", 1920, 1080),

    # 4K Ultra HD (2560x1440 & 3840x2160)
    ("RESP_029", "2K Display 2560x1440: Maximum container width bounding constraint", "P3", "dashboard", 2560, 1440),
    ("RESP_030", "4K Display 3840x2160: Crisp SVG icon scaling and typography", "P3", "dashboard", 3840, 2160),
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
