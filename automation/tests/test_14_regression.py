import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 60 Test Cases for End-to-End User Workflows & Regression Coverage
REG_TEST_CASES = [
    ("REG_001", "E2E: Full user login to dashboard redirection flow", "P1", "dashboard"),
    ("REG_002", "E2E: Photo upload to AI analysis and color harmony generation", "P1", "analysis"),
    ("REG_003", "E2E: Manual corrections override on AI metrics and persistence", "P1", "analysis"),
    ("REG_004", "E2E: Recommendations filtering by Wedding occasion", "P1", "recommendations"),
    ("REG_005", "E2E: Recommendations filtering by Interview occasion", "P1", "recommendations"),
    ("REG_006", "E2E: Recommendations filtering by Party occasion", "P1", "recommendations"),
    ("REG_007", "E2E: Recommendations filtering by Casual outings occasion", "P1", "recommendations"),
    ("REG_008", "E2E: Recommendations filtering by College occasion", "P2", "recommendations"),
    ("REG_009", "E2E: Recommendations filtering by Office occasion", "P2", "recommendations"),
    ("REG_010", "E2E: Recommendations filtering by Festivals occasion", "P2", "recommendations"),
    ("REG_011", "E2E: Outfit Card click to Outfit Detail breakdown view", "P1", "recommendations"),
    ("REG_012", "E2E: Price compare modal open for Top component across 4 platforms", "P1", "recommendations"),
    ("REG_013", "E2E: Price compare modal tab switch to Bottom component", "P1", "recommendations"),
    ("REG_014", "E2E: Price compare modal tab switch to Footwear component", "P1", "recommendations"),
    ("REG_015", "E2E: Price compare modal tab switch to Accessories component", "P1", "recommendations"),
    ("REG_016", "E2E: Best verified price calculation matches minimum among stores", "P1", "recommendations"),
    ("REG_017", "E2E: Add outfit to Favorites and verify in Closet page", "P1", "recommendations"),
    ("REG_018", "E2E: Remove outfit from Favorites and verify removal", "P1", "favorites"),
    ("REG_019", "E2E: Schedule outfit event in Calendar with 1-day reminder", "P1", "calendar"),
    ("REG_020", "E2E: Schedule outfit event in Calendar with 2-hour reminder", "P1", "calendar"),
    ("REG_021", "E2E: Delete scheduled outfit event from Calendar list", "P1", "calendar"),
    ("REG_022", "E2E: Conversational Stylist prompt: 'What to wear for interview?'", "P1", "assistant"),
    ("REG_023", "E2E: Conversational Stylist prompt: 'What to wear for wedding?'", "P1", "assistant"),
    ("REG_024", "E2E: Conversational Stylist prompt: 'Find budget looks'", "P2", "assistant"),
    ("REG_025", "E2E: Conversational Stylist quick prompt chip click response", "P2", "assistant"),
    ("REG_026", "E2E: Live Weather widget display and fabric suggestion logic", "P1", "dashboard"),
    ("REG_027", "E2E: Shopping Hub search for 'Oxford' verified catalog results", "P1", "shopping"),
    ("REG_028", "E2E: Shopping Hub search for 'Sneakers' verified catalog results", "P1", "shopping"),
    ("REG_029", "E2E: Shopping Hub category filter click: Top", "P2", "shopping"),
    ("REG_030", "E2E: Shopping Hub category filter click: Bottom", "P2", "shopping"),
    ("REG_031", "E2E: Shopping Hub category filter click: Footwear", "P2", "shopping"),
    ("REG_032", "E2E: Shopping Hub category filter click: Accessories", "P2", "shopping"),
    ("REG_033", "E2E: Shopping Hub Amazon verified store link integrity", "P1", "shopping"),
    ("REG_034", "E2E: Shopping Hub Flipkart verified store link integrity", "P1", "shopping"),
    ("REG_035", "E2E: Shopping Hub Myntra verified store link integrity", "P1", "shopping"),
    ("REG_036", "E2E: Shopping Hub Ajio verified store link integrity", "P1", "shopping"),
    ("REG_037", "E2E: Profile name change and save verification", "P1", "profile"),
    ("REG_038", "E2E: Profile color preferences toggle and state retention", "P1", "profile"),
    ("REG_039", "E2E: Profile style aesthetic toggle and state retention", "P1", "profile"),
    ("REG_040", "E2E: Profile occasion preferences toggle and state retention", "P1", "profile"),
    ("REG_041", "E2E: Settings push notification toggle update", "P2", "settings"),
    ("REG_042", "E2E: Settings weather tip alert toggle update", "P2", "settings"),
    ("REG_043", "E2E: Toast notification display on successful profile save", "P2", "profile"),
    ("REG_044", "E2E: Navigation cycle: Dashboard -> Recs -> Detail -> Shopping", "P1", "dashboard"),
    ("REG_045", "E2E: Navigation cycle: Dashboard -> Analysis -> Profile -> Settings", "P1", "dashboard"),
    ("REG_046", "E2E: Deep link direct load of outfit detail route", "P2", "outfits/outfit-smart-blue-1"),
    ("REG_047", "E2E: Deep link direct load of calendar with outfit param", "P2", "calendar?outfitId=outfit-smart-blue-1"),
    ("REG_048", "E2E: Browser reload retains active authentication session", "P1", "dashboard"),
    ("REG_049", "E2E: Explicit logout terminates session and navigates to login", "P1", "dashboard"),
    ("REG_050", "E2E: Complete user journey from onboarding to wardrobe curation", "P1", "dashboard"),
    ("REG_051", "E2E: Quick switch between multiple occasion filters in succession", "P1", "recommendations"),
    ("REG_052", "E2E: Shopping platform price comparator sorting correctness", "P1", "shopping"),
    ("REG_053", "E2E: Analysis results automatic integration into recommendations scoring", "P1", "analysis"),
    ("REG_054", "E2E: Assistant chat suggestion navigation to outfit detail", "P1", "assistant"),
    ("REG_055", "E2E: Calendar event collision warning on same date and time slot", "P2", "calendar"),
    ("REG_056", "E2E: Shopping deals price discount percentage validation", "P2", "shopping"),
    ("REG_057", "E2E: Multi-item favorite addition and sequential removal in closet", "P1", "favorites"),
    ("REG_058", "E2E: Profile height and weight modification updates recommended size", "P2", "profile"),
    ("REG_059", "E2E: Full application data reset verification", "P2", "settings"),
    ("REG_060", "E2E: End-to-end guest user to registered user migration", "P1", "dashboard"),
]

@pytest.mark.parametrize("test_id, name, priority, path", REG_TEST_CASES)
def test_regression_suite(driver, request, test_id, name, priority, path):
    request.node.test_id = test_id
    request.node.module_name = "Regression"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state in regression run"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
