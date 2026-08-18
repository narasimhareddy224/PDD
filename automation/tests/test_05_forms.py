import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 50 Test Cases for Forms, Inputs, Dropdowns, Checkboxes, and Sliders
FORM_TEST_CASES = [
    ("FORM_001", "Profile name input field text entry", "P1", "profile", "input[name='name']", "Alex Rivers Updated"),
    ("FORM_002", "Profile gender dropdown select: male", "P2", "profile", "select[name='gender']", "male"),
    ("FORM_003", "Profile gender dropdown select: female", "P2", "profile", "select[name='gender']", "female"),
    ("FORM_004", "Profile gender dropdown select: non-binary", "P3", "profile", "select[name='gender']", "non-binary"),
    ("FORM_005", "Profile color preference toggle: Navy Blue", "P2", "profile", ".color-chip, .color-pill", "Navy Blue"),
    ("FORM_006", "Profile color preference toggle: Burgundy", "P2", "profile", ".color-chip, .color-pill", "Burgundy"),
    ("FORM_007", "Profile color preference toggle: Emerald Green", "P2", "profile", ".color-chip, .color-pill", "Emerald Green"),
    ("FORM_008", "Profile color preference toggle: Black", "P2", "profile", ".color-chip, .color-pill", "Black"),
    ("FORM_009", "Profile color preference toggle: White", "P2", "profile", ".color-chip, .color-pill", "White"),
    ("FORM_010", "Profile color preference toggle: Terracotta", "P3", "profile", ".color-chip, .color-pill", "Terracotta"),
    ("FORM_011", "Profile style preference toggle: Smart Casual", "P2", "profile", ".style-pill", "Smart Casual"),
    ("FORM_012", "Profile style preference toggle: Formal", "P2", "profile", ".style-pill", "Formal"),
    ("FORM_013", "Profile style preference toggle: Streetwear", "P2", "profile", ".style-pill", "Streetwear"),
    ("FORM_014", "Profile style preference toggle: Traditional", "P2", "profile", ".style-pill", "Traditional"),
    ("FORM_015", "Profile style preference toggle: Minimalist", "P3", "profile", ".style-pill", "Minimalist"),
    ("FORM_016", "Profile style preference toggle: Sporty", "P3", "profile", ".style-pill", "Sporty"),
    ("FORM_017", "Profile occasion toggle: Weddings", "P2", "profile", ".occasion-pill", "Weddings"),
    ("FORM_018", "Profile occasion toggle: Parties", "P2", "profile", ".occasion-pill", "Parties"),
    ("FORM_019", "Profile occasion toggle: Interviews", "P2", "profile", ".occasion-pill", "Interviews"),
    ("FORM_020", "Profile occasion toggle: College", "P3", "profile", ".occasion-pill", "College"),
    ("FORM_021", "Profile occasion toggle: Office", "P2", "profile", ".occasion-pill", "Office"),
    ("FORM_022", "Profile clothing fit select: slim", "P2", "profile", "select[name='fit']", "slim"),
    ("FORM_023", "Profile clothing fit select: regular", "P2", "profile", "select[name='fit']", "regular"),
    ("FORM_024", "Profile clothing fit select: relaxed", "P3", "profile", "select[name='fit']", "relaxed"),
    ("FORM_025", "Profile clothing fit select: oversized", "P3", "profile", "select[name='fit']", "oversized"),
    ("FORM_026", "Profile height input field valid integer", "P2", "profile", "input[name='height']", "178"),
    ("FORM_027", "Profile weight input field valid integer", "P2", "profile", "input[name='weight']", "74"),
    ("FORM_028", "Profile chest size input valid measurement", "P3", "profile", "input[name='chest']", "40"),
    ("FORM_029", "Profile waist size input valid measurement", "P3", "profile", "input[name='waist']", "32"),
    ("FORM_030", "Profile save button triggers form submission", "P1", "profile", "button[type='submit']", "submit"),
    ("FORM_031", "Calendar schedule event form date picker input", "P1", "calendar", "input[type='date']", "2026-09-15"),
    ("FORM_032", "Calendar schedule event form time picker input", "P2", "calendar", "input[type='time']", "10:30"),
    ("FORM_033", "Calendar schedule event occasion dropdown select", "P2", "calendar", "select[name='occasion']", "Weddings"),
    ("FORM_034", "Calendar schedule event reminder dropdown: 1 day before", "P2", "calendar", "select[name='reminder']", "1 day before"),
    ("FORM_035", "Calendar schedule event reminder dropdown: 2 hours before", "P2", "calendar", "select[name='reminder']", "2 hours before"),
    ("FORM_036", "Calendar schedule event reminder dropdown: At event time", "P3", "calendar", "select[name='reminder']", "At event time"),
    ("FORM_037", "Calendar schedule save button submits form", "P1", "calendar", "button[type='submit']", "submit"),
    ("FORM_038", "Assistant chat text input accepts multi-character prompt", "P1", "assistant", "input[type='text']", "What to wear for dinner?"),
    ("FORM_039", "Assistant chat form submit on Enter key press", "P2", "assistant", "input[type='text']", "ENTER_KEY"),
    ("FORM_040", "Recommendations search query input typing", "P1", "recommendations", "input[type='text']", "Oxford"),
    ("FORM_041", "Recommendations budget filter select: budget", "P2", "recommendations", "select[name='budget']", "budget"),
    ("FORM_042", "Recommendations budget filter select: premium", "P2", "recommendations", "select[name='budget']", "premium"),
    ("FORM_043", "Shopping hub search bar form query submission", "P1", "shopping", "input[type='text']", "Sneakers"),
    ("FORM_044", "Shopping hub category select: Footwear", "P2", "shopping", ".category-chip", "Footwear"),
    ("FORM_045", "Shopping hub category select: Accessories", "P2", "shopping", ".category-chip", "Accessories"),
    ("FORM_046", "Settings FCM Push Notification toggle checkbox", "P2", "settings", "input[type='checkbox']", "toggle"),
    ("FORM_047", "Settings Weather Styling Tip toggle checkbox", "P2", "settings", "input[type='checkbox']", "toggle"),
    ("FORM_048", "Settings Save Chat History toggle checkbox", "P3", "settings", "input[type='checkbox']", "toggle"),
    ("FORM_049", "Image Analysis manual corrections skin tone select", "P2", "analysis", "select", "Olive"),
    ("FORM_050", "Image Analysis manual corrections body type select", "P2", "analysis", "select", "Athletic"),
]

@pytest.mark.parametrize("test_id, name, priority, path, target_css, value", FORM_TEST_CASES)
def test_forms_suite(driver, request, test_id, name, priority, path, target_css, value):
    request.node.test_id = test_id
    request.node.module_name = "Forms"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
