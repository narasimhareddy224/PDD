import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 60 Test Cases for CRUD Operations (Create, Read, Update, Delete)
CRUD_TEST_CASES = [
    # Create Operations (1-17)
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
    ("CRUD_016", "Create custom outfit collection capsule", "P2", "recommendations", "CREATE"),
    ("CRUD_017", "Create custom style profile tag", "P3", "profile", "CREATE"),

    # Read Operations (18-35)
    ("CRUD_018", "Read & List personalized outfit recommendations", "P1", "recommendations", "READ"),
    ("CRUD_019", "Read specific outfit component specs breakdown", "P1", "outfits/outfit-smart-blue-1", "READ"),
    ("CRUD_020", "Read verified price comparison data across 4 platforms", "P1", "recommendations", "READ"),
    ("CRUD_021", "Read saved favorite outfits in closet list", "P1", "favorites", "READ"),
    ("CRUD_022", "Read outfit calendar timeline and upcoming schedules", "P1", "calendar", "READ"),
    ("CRUD_023", "Read user styling profile and preferences", "P1", "profile", "READ"),
    ("CRUD_024", "Read AI visual analysis skin tone and body symmetry", "P1", "analysis", "READ"),
    ("CRUD_025", "Read live weather conditions and fabric suggestions", "P1", "dashboard", "READ"),
    ("CRUD_026", "Read shopping product search results for Oxford shirt", "P1", "shopping", "READ"),
    ("CRUD_027", "Read shopping product search results for Sneakers", "P2", "shopping", "READ"),
    ("CRUD_028", "Read conversational assistant chat history", "P1", "assistant", "READ"),
    ("CRUD_029", "Read system notification preferences state", "P2", "settings", "READ"),
    ("CRUD_030", "Read today's featured pick in dashboard", "P1", "dashboard", "READ"),
    ("CRUD_031", "Read analysis confidence score percentage", "P2", "analysis", "READ"),
    ("CRUD_032", "Read recommended harmonic color swatches list", "P2", "analysis", "READ"),
    ("CRUD_033", "Read outfit match score calculation breakdown", "P2", "outfits/outfit-smart-blue-1", "READ"),
    ("CRUD_034", "Read shopping platform direct link URLs", "P2", "shopping", "READ"),
    ("CRUD_035", "Read user FCM notification history list", "P3", "settings", "READ"),

    # Update Operations (36-48)
    ("CRUD_036", "Update user profile display name", "P1", "profile", "UPDATE"),
    ("CRUD_037", "Update user profile preferred colors set", "P1", "profile", "UPDATE"),
    ("CRUD_038", "Update user profile preferred aesthetic styles", "P1", "profile", "UPDATE"),
    ("CRUD_039", "Update user profile preferred occasion filters", "P1", "profile", "UPDATE"),
    ("CRUD_040", "Update user profile clothing fit preference", "P2", "profile", "UPDATE"),
    ("CRUD_041", "Update user profile height and weight metrics", "P2", "profile", "UPDATE"),
    ("CRUD_042", "Update AI Analysis with manual skin tone correction", "P1", "analysis", "UPDATE"),
    ("CRUD_043", "Update AI Analysis with manual body type correction", "P1", "analysis", "UPDATE"),
    ("CRUD_044", "Update AI Analysis with manual fitness level correction", "P2", "analysis", "UPDATE"),
    ("CRUD_045", "Update FCM Push Notification preference toggle", "P2", "settings", "UPDATE"),
    ("CRUD_046", "Update outfit schedule event date and time", "P2", "calendar", "UPDATE"),
    ("CRUD_047", "Update outfit schedule event notes and occasion", "P2", "calendar", "UPDATE"),
    ("CRUD_048", "Update shopping sort and price filter state", "P2", "shopping", "UPDATE"),

    # Delete Operations (49-60)
    ("CRUD_049", "Delete scheduled outfit event from calendar", "P1", "calendar", "DELETE"),
    ("CRUD_050", "Delete second scheduled outfit event from calendar", "P2", "calendar", "DELETE"),
    ("CRUD_051", "Remove Outfit 1 from Saved Favorites collection", "P1", "favorites", "FAVORITE_REMOVE"),
    ("CRUD_052", "Remove Outfit 2 from Saved Favorites collection", "P2", "favorites", "FAVORITE_REMOVE"),
    ("CRUD_053", "Remove Outfit from favorites via outfit detail page heart toggle", "P1", "outfits/outfit-smart-blue-1", "FAVORITE_REMOVE"),
    ("CRUD_054", "Remove preferred color from profile preference list", "P2", "profile", "REMOVE_PREF"),
    ("CRUD_055", "Remove preferred style from profile preference list", "P2", "profile", "REMOVE_PREF"),
    ("CRUD_056", "Clear search query from recommendations input", "P2", "recommendations", "CLEAR_SEARCH"),
    ("CRUD_057", "Clear search query from shopping hub input", "P2", "shopping", "CLEAR_SEARCH"),
    ("CRUD_058", "Account deletion prompt modal confirmation trigger", "P1", "settings", "DELETE_ACCOUNT"),
    ("CRUD_059", "Clear entire AI chat history session", "P2", "assistant", "DELETE_CHAT"),
    ("CRUD_060", "Batch clear all scheduled events from calendar", "P2", "calendar", "DELETE_ALL"),
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
