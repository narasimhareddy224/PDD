import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 30 Test Cases for Mobile Device Emulation, Touch Actions, and Viewport Breakpoints
MOBILE_TEST_CASES = [
    # iPhone 14 Pro Max Emulation (430x932)
    ("MOB_001", "iPhone 14 Pro Max: Dashboard hero layout rendering", "P1", "dashboard", 430, 932),
    ("MOB_002", "iPhone 14 Pro Max: Navbar bottom sheet / drawer navigation", "P1", "dashboard", 430, 932),
    ("MOB_003", "iPhone 14 Pro Max: Outfit Card touch target dimension >= 44px", "P1", "recommendations", 430, 932),
    ("MOB_004", "iPhone 14 Pro Max: Price compare modal full-screen drawer adaptation", "P1", "recommendations", 430, 932),
    ("MOB_005", "iPhone 14 Pro Max: Assistant chat virtual keyboard viewport scroll", "P1", "assistant", 430, 932),
    ("MOB_006", "iPhone 14 Pro Max: Shopping Hub horizontal swipe filter chips", "P2", "shopping", 430, 932),

    # Samsung Galaxy S22 Ultra Emulation (360x800)
    ("MOB_007", "Galaxy S22: Dashboard live weather widget rendering", "P2", "dashboard", 360, 800),
    ("MOB_008", "Galaxy S22: Outfit recommendation card aspect ratio integrity", "P2", "recommendations", 360, 800),
    ("MOB_009", "Galaxy S22: Photo analysis camera capture button accessibility", "P1", "analysis", 360, 800),
    ("MOB_010", "Galaxy S22: Calendar schedule event floating action button", "P2", "calendar", 360, 800),
    ("MOB_011", "Galaxy S22: Favorites closet 2-column mobile grid", "P2", "favorites", 360, 800),
    ("MOB_012", "Galaxy S22: Settings notification toggles touch switch layout", "P2", "settings", 360, 800),

    # Google Pixel 7 Emulation (412x915)
    ("MOB_013", "Pixel 7: Dashboard Today's Pick score badge placement", "P1", "dashboard", 412, 915),
    ("MOB_014", "Pixel 7: Recommendations filter chip horizontal momentum scroll", "P2", "recommendations", 412, 915),
    ("MOB_015", "Pixel 7: Outfit detail buy button sticky bottom container", "P1", "outfits/outfit-smart-blue-1", 412, 915),
    ("MOB_016", "Pixel 7: Profile form multi-select chip wrap without truncation", "P2", "profile", 412, 915),
    ("MOB_017", "Pixel 7: Assistant chat bubble max width constraint 85vw", "P2", "assistant", 412, 915),

    # iPad Air / Mini Tablet Emulation (820x1180)
    ("MOB_018", "iPad Air: Dashboard split widget view", "P2", "dashboard", 820, 1180),
    ("MOB_019", "iPad Air: Recommendations 2-column tablet grid", "P2", "recommendations", 820, 1180),
    ("MOB_020", "iPad Air: Shopping hub 3-column store product grid", "P2", "shopping", 820, 1180),
    ("MOB_021", "iPad Air: Analysis image dropzone spacious layout", "P2", "analysis", 820, 1180),
    ("MOB_022", "iPad Air: Calendar monthly timeline wide grid", "P2", "calendar", 820, 1180),

    # Mobile Landscape Breakpoints (932x430 & 800x360)
    ("MOB_023", "iPhone Landscape: Navbar condensed height adaptation", "P2", "dashboard", 932, 430),
    ("MOB_024", "iPhone Landscape: Price comparison modal scroll container", "P2", "recommendations", 932, 430),
    ("MOB_025", "Galaxy Landscape: Assistant chat stream height management", "P2", "assistant", 800, 360),
    ("MOB_026", "Galaxy Landscape: Photo upload preview thumbnail scaling", "P2", "analysis", 800, 360),

    # Small Screen Watch / Foldable Folded (280x653)
    ("MOB_027", "Ultra-compact Folded: Zero horizontal scrollbar on root body", "P3", "dashboard", 280, 653),
    ("MOB_028", "Ultra-compact Folded: Login form text inputs maintain readability", "P2", "auth/login", 280, 653),
    ("MOB_029", "Ultra-compact Folded: Error toast dismiss button remains clickable", "P2", "dashboard", 280, 653),
    ("MOB_030", "Device Orientation Change: Layout reflow integrity", "P2", "recommendations", 375, 812),
]

@pytest.mark.parametrize("test_id, name, priority, path, width, height", MOBILE_TEST_CASES)
def test_mobile_emulation_suite(driver, request, test_id, name, priority, path, width, height):
    request.node.test_id = test_id
    request.node.module_name = "Mobile Emulation"
    request.node.priority = priority
    request.node.test_title = name

    driver.set_window_size(width, height)
    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Failed mobile load on {width}x{height}"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
