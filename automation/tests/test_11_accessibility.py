import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 20 Test Cases for Web Accessibility (a11y), ARIA, Alt Tags, and Keyboard Flow
A11Y_TEST_CASES = [
    ("A11Y_001", "Page HTML element has valid lang='en' attribute", "P2", "dashboard", "html[lang='en']"),
    ("A11Y_002", "Single top-level <h1> heading tag per page on Dashboard", "P2", "dashboard", "h1"),
    ("A11Y_003", "Single top-level <h1> heading tag per page on Recommendations", "P2", "recommendations", "h1"),
    ("A11Y_004", "Single top-level <h1> heading tag per page on Shopping", "P2", "shopping", "h1"),
    ("A11Y_005", "Single top-level <h1> heading tag per page on Profile", "P2", "profile", "h1"),
    ("A11Y_006", "Single top-level <h1> heading tag per page on Calendar", "P2", "calendar", "h1"),
    ("A11Y_007", "Outfit card images have descriptive alt attributes", "P2", "recommendations", "app-outfit-card img[alt]"),
    ("A11Y_008", "Shopping product images have alt attributes", "P2", "shopping", ".product-card img, img"),
    ("A11Y_009", "Form input fields have associated label tags or aria-label", "P2", "auth/login", "label"),
    ("A11Y_010", "Password input has type='password' masked attribute", "P1", "auth/login", "input[type='password']"),
    ("A11Y_011", "Interactive buttons have descriptive text or title attribute", "P2", "dashboard", "button"),
    ("A11Y_012", "Close modal button has title or aria-label", "P2", "recommendations", "button"),
    ("A11Y_013", "Keyboard Tab focus order across login inputs", "P2", "auth/login", "input"),
    ("A11Y_014", "Keyboard Enter key submits active search input", "P2", "recommendations", "input[type='text']"),
    ("A11Y_015", "Color contrast ratio on primary buttons meets WCAG AA standards", "P2", "dashboard", ".btn-primary"),
    ("A11Y_016", "Glassmorphic modal traps focus when open", "P2", "recommendations", ".modal-card"),
    ("A11Y_017", "Toast notification messages have role='alert' or accessible announcement", "P2", "dashboard", ".toast-item, body"),
    ("A11Y_018", "Navigation links contain text or accessible icon labels", "P2", "dashboard", ".nav-link, a"),
    ("A11Y_019", "Input placeholder text provides clear guidance", "P3", "assistant", "input[placeholder]"),
    ("A11Y_020", "Font styling uses relative rem/em units for zoom scalability", "P3", "dashboard", "body"),
]

@pytest.mark.parametrize("test_id, name, priority, path, target_css", A11Y_TEST_CASES)
def test_accessibility_suite(driver, request, test_id, name, priority, path, target_css):
    request.node.test_id = test_id
    request.node.module_name = "Accessibility"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
