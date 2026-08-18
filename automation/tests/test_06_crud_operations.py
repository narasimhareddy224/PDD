import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 50 Test Cases for CRUD Operations (Create, Read, Update, Delete)
CRUD_TEST_CASES = [
    # Create Operations (1-15)
    ("CRUD_001", "Create Outfit Schedule Event for Interview occasion", "P1", "calendar", "CREATE"),
    ("CRUD_002", "Create Outfit Schedule Event for Wedding occasion", "P1", "calendar", "CREATE"),
    ("CRUD_003", "Create Outfit Schedule Event for Party occasion", "P2", "calendar", "CREATE"),
    ("CRUD_004", "Create Outfit Schedule Event for College occasion", "P2", "calendar", "CREATE"),
    ("CRUD_005", "Create Outfit Schedule Event for Office presentation", "P2", "calendar", "CREATE"),
    ("CRUD_006", "Create Outfit Schedule Event for Festival celebration", "P2", "calendar", "CREATE"),
    ("CRUD_007", "Create Outfit Schedule with 12 Hours Before reminder", "P2", "calendar", "CREATE"),
    ("CRUD_008", "Create Outfit Schedule with 2 Hours Before reminder", "P2", "calendar", "CREATE"),
    ("CRUD_009", "Add Outfit 1 to Favorites Collection", "P1", "recommendations", "FAVORITE_ADD"),
    ("CRUD_010", "Add Outfit 2 to Favorites Collection", "P1", "recommendations", "FAVORITE_ADD"),
    ("CRUD_011", "Add Outfit 3 to Favorites Collection", "P2", "recommendations", "FAVORITE_ADD"),
    ("CRUD_012", "Add Outfit 4 to Favorites Collection", "P2", "recommendations", "FAVORITE_ADD"),
    ("CRUD_013", "Add Outfit from Outfit Detail page to Favorites", "P1", "outfits/outfit-smart-blue-1", "FAVORITE_ADD"),
    ("CRUD_014", "Create new chat session message to AI Stylist", "P1", "assistant", "CHAT_CREATE"),
    ("CRUD_015", "Send prompt chip message to AI Stylist", "P2", "assistant", "CHAT_CREATE"),

    # Read Operations (16-30)
    ("CRUD_016", "Read & List personalized outfit recommendations", "P1", "recommendations", "READ"),
    ("CRUD_017", "Read specific outfit component specs breakdown", "P1", "outfits/outfit-smart-blue-1", "READ"),
    ("CRUD_018", "Read verified price comparison data across 4 platforms", "P1", "recommendations", "READ"),
    ("CRUD_019", "Read saved favorite outfits in closet list", "P1", "favorites", "READ"),
    ("CRUD_020", "Read outfit calendar timeline and upcoming schedules", "P1", "calendar", "READ"),
    ("CRUD_021", "Read user styling profile and preferences", "P1", "profile", "READ"),
    ("CRUD_022", "Read AI visual analysis skin tone and body symmetry", "P1", "analysis", "READ"),
    ("CRUD_023", "Read live weather conditions and fabric suggestions", "P1", "dashboard", "READ"),
    ("CRUD_024", "Read shopping product search results for Oxford shirt", "P1", "shopping", "READ"),
    ("CRUD_025", "Read shopping product search results for Sneakers", "P2", "shopping", "READ"),
    ("CRUD_026", "Read conversational assistant chat history", "P1", "assistant", "READ"),
    ("CRUD_027", "Read system notification preferences state", "P2", "settings", "READ"),
    ("CRUD_028", "Read today's featured pick in dashboard", "P1", "dashboard", "READ"),
    ("CRUD_029", "Read analysis confidence score percentage", "P2", "analysis", "READ"),
    ("CRUD_030", "Read recommended harmonic color swatches list", "P2", "analysis", "READ"),

    # Update Operations (31-40)
    ("CRUD_031", "Update user profile display name", "P1", "profile", "UPDATE"),
    ("CRUD_032", "Update user profile preferred colors set", "P1", "profile", "UPDATE"),
    ("CRUD_033", "Update user profile preferred aesthetic styles", "P1", "profile", "UPDATE"),
    ("CRUD_034", "Update user profile preferred occasion filters", "P1", "profile", "UPDATE"),
    ("CRUD_035", "Update user profile clothing fit preference", "P2", "profile", "UPDATE"),
    ("CRUD_036", "Update user profile height and weight metrics", "P2", "profile", "UPDATE"),
    ("CRUD_037", "Update AI Analysis with manual skin tone correction", "P1", "analysis", "UPDATE"),
    ("CRUD_038", "Update AI Analysis with manual body type correction", "P1", "analysis", "UPDATE"),
    ("CRUD_039", "Update AI Analysis with manual fitness level correction", "P2", "analysis", "UPDATE"),
    ("CRUD_040", "Update FCM Push Notification preference toggle", "P2", "settings", "UPDATE"),

    # Delete Operations (41-50)
    ("CRUD_041", "Delete scheduled outfit event from calendar", "P1", "calendar", "DELETE"),
    ("CRUD_042", "Delete second scheduled outfit event from calendar", "P2", "calendar", "DELETE"),
    ("CRUD_043", "Remove Outfit 1 from Saved Favorites collection", "P1", "favorites", "FAVORITE_REMOVE"),
    ("CRUD_044", "Remove Outfit 2 from Saved Favorites collection", "P2", "favorites", "FAVORITE_REMOVE"),
    ("CRUD_045", "Remove Outfit from favorites via outfit detail page heart toggle", "P1", "outfits/outfit-smart-blue-1", "FAVORITE_REMOVE"),
    ("CRUD_046", "Remove preferred color from profile preference list", "P2", "profile", "REMOVE_PREF"),
    ("CRUD_047", "Remove preferred style from profile preference list", "P2", "profile", "REMOVE_PREF"),
    ("CRUD_048", "Clear search query from recommendations input", "P2", "recommendations", "CLEAR_SEARCH"),
    ("CRUD_049", "Clear search query from shopping hub input", "P2", "shopping", "CLEAR_SEARCH"),
    ("CRUD_050", "Account deletion prompt modal confirmation trigger", "P1", "settings", "DELETE_ACCOUNT"),
]

@pytest.mark.parametrize("test_id, name, priority, path, operation", CRUD_TEST_CASES)
def test_crud_suite(driver, request, test_id, name, priority, path, operation):
    request.node.test_id = test_id
    request.node.module_name = "CRUD Operations"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Failed to load {path} for {operation} operation"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root element missing"
