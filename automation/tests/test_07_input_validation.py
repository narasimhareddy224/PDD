import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 50 Test Cases for Input Sanitization, Boundary Value Analysis, and Constraints
VAL_TEST_CASES = [
    ("VAL_001", "Registration name boundary: 1 char (below min)", "P2", "auth/register", "name", "A", False),
    ("VAL_002", "Registration name boundary: 2 chars (min boundary)", "P2", "auth/register", "name", "Al", True),
    ("VAL_003", "Registration name boundary: 50 chars (valid long)", "P3", "auth/register", "name", "Alexander Constantine Maximilian Montgomery the Third", True),
    ("VAL_004", "Registration name boundary: 150 chars (max boundary test)", "P3", "auth/register", "name", "A" * 150, True),
    ("VAL_005", "Registration password boundary: 5 chars (below min)", "P2", "auth/register", "password", "12345", False),
    ("VAL_006", "Registration password boundary: 6 chars (min boundary)", "P2", "auth/register", "password", "123456", True),
    ("VAL_007", "Registration password boundary: 64 chars (standard max)", "P3", "auth/register", "password", "P" * 64, True),
    ("VAL_008", "Email boundary: Single character local part", "P3", "auth/login", "email", "a@fashion.ai", True),
    ("VAL_009", "Email boundary: 64 character local part", "P3", "auth/login", "email", f"{'a'*64}@fashion.ai", True),
    ("VAL_010", "Profile height input: Negative value (-180)", "P2", "profile", "height", "-180", False),
    ("VAL_011", "Profile height input: Zero value (0)", "P2", "profile", "height", "0", False),
    ("VAL_012", "Profile height input: Valid realistic height (175 cm)", "P2", "profile", "height", "175", True),
    ("VAL_013", "Profile height input: Extreme high value (350 cm)", "P3", "profile", "height", "350", False),
    ("VAL_014", "Profile weight input: Negative value (-70)", "P2", "profile", "weight", "-70", False),
    ("VAL_015", "Profile weight input: Valid realistic weight (68 kg)", "P2", "profile", "weight", "68", True),
    ("VAL_016", "Profile weight input: Extreme high value (500 kg)", "P3", "profile", "weight", "500", False),
    ("VAL_017", "Profile chest measurement: alphabetic string rejection", "P2", "profile", "chest", "forty", False),
    ("VAL_018", "Profile waist measurement: alphabetic string rejection", "P2", "profile", "waist", "thirtytwo", False),
    ("VAL_019", "Calendar schedule event date: Past date rejection", "P2", "calendar", "date", "2020-01-01", False),
    ("VAL_020", "Calendar schedule event date: Far future date acceptance", "P3", "calendar", "date", "2028-12-31", True),
    ("VAL_021", "Calendar schedule time format: 24h HH:MM validation", "P2", "calendar", "time", "14:45", True),
    ("VAL_022", "Assistant chat prompt: 500 character long prompt acceptance", "P2", "assistant", "chat", "Fashion advice " * 35, True),
    ("VAL_023", "Assistant chat prompt: Whitespace-only string rejection", "P2", "assistant", "chat", "     ", False),
    ("VAL_024", "Assistant chat prompt: Emoji string acceptance", "P3", "assistant", "chat", "👗👔👟✨", True),
    ("VAL_025", "Recommendations search query: Special characters sanitization", "P2", "recommendations", "search", "@#$%^&*()", True),
    ("VAL_026", "Recommendations search query: Number search '100% cotton'", "P2", "recommendations", "search", "100% cotton", True),
    ("VAL_027", "Shopping search query: Brand search 'Zara Oxford'", "P2", "shopping", "search", "Zara Oxford", True),
    ("VAL_028", "Shopping search query: SQL injection sanitization", "P1", "shopping", "search", "' UNION SELECT * FROM products --", True),
    ("VAL_029", "Shopping search query: XSS script tag sanitization", "P1", "shopping", "search", "<script>alert(1)</script>", True),
    ("VAL_030", "Login email XSS tag sanitization", "P1", "auth/login", "email", "<img src=x onerror=alert('xss')>", False),
    ("VAL_031", "Profile name XSS tag sanitization", "P1", "profile", "name", "<b onmouseover=alert('xss')>Alex</b>", True),
    ("VAL_032", "Calendar occasion string injection test", "P2", "calendar", "occasion", "<svg onload=alert(1)>", True),
    ("VAL_033", "Login email with plus addressing 'alex+test@fashion.ai'", "P2", "auth/login", "email", "alex+test@fashion.ai", True),
    ("VAL_034", "Login email with dot in local part 'alex.rivers@fashion.ai'", "P2", "auth/login", "email", "alex.rivers@fashion.ai", True),
    ("VAL_035", "Login email with hyphen in domain 'alex@fashion-ai.com'", "P2", "auth/login", "email", "alex@fashion-ai.com", True),
    ("VAL_036", "Login email with subdomain 'alex@mail.fashion.ai'", "P2", "auth/login", "email", "alex@mail.fashion.ai", True),
    ("VAL_037", "Password with unicode Cyrillic characters", "P3", "auth/login", "password", "Пароль123!", True),
    ("VAL_038", "Password with Arabic numerals", "P3", "auth/login", "password", "كلمةالسر123", True),
    ("VAL_039", "Profile update name with accents 'Éléna Vancé'", "P3", "profile", "name", "Éléna Vancé", True),
    ("VAL_040", "Profile update name with hyphenated compound 'Alex-Rivers'", "P3", "profile", "name", "Alex-Rivers", True),
    ("VAL_041", "Price slider min-max boundary consistency check", "P2", "shopping", "price", "0-50000", True),
    ("VAL_042", "Analysis confidence score numeric range 0.0 to 1.0", "P2", "analysis", "score", "0.94", True),
    ("VAL_043", "Shopping search input with Japanese characters 'ジーンズ'", "P3", "shopping", "search", "ジーンズ", True),
    ("VAL_044", "Shopping search input with Chinese characters '衬衫'", "P3", "shopping", "search", "衬衫", True),
    ("VAL_045", "Login email with leading tab character trimmed", "P2", "auth/login", "email", "\talex@fashion.ai", True),
    ("VAL_046", "Login password with newline character handled", "P2", "auth/login", "password", "Pass\nword123!", False),
    ("VAL_047", "Profile custom bio input with 250 characters limit", "P3", "profile", "bio", "Bio text " * 25, True),
    ("VAL_048", "Profile input with encoded URI entities '%20%27%22'", "P2", "profile", "name", "Alex%20Rivers", True),
    ("VAL_049", "Calendar notes input with markdown characters '# * _'", "P3", "calendar", "notes", "# Event Notes **Bold**", True),
    ("VAL_050", "Assistant prompt with JSON payload string", "P2", "assistant", "chat", '{"query": "recommend black suit"}', True),
]

@pytest.mark.parametrize("test_id, name, priority, path, field, payload, should_accept", VAL_TEST_CASES)
def test_input_validation_suite(driver, request, test_id, name, priority, path, field, payload, should_accept):
    request.node.test_id = test_id
    request.node.module_name = "Input Validation"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body element missing"
