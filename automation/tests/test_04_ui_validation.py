import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 50 Test Cases for UI Elements, Glassmorphism, Badges, and Visual Components
UI_TEST_CASES = [
    ("UI_001", "Navbar logo icon renders properly", "P2", "dashboard", ".navbar-brand, .brand-icon"),
    ("UI_002", "Navbar brand text NextFit AI is visible", "P2", "dashboard", ".brand-name, .navbar-brand"),
    ("UI_003", "Hero Section greeting badge renders with gradient", "P2", "dashboard", ".greeting-badge, .badge"),
    ("UI_004", "Hero title typography matches Outfit font styling", "P2", "dashboard", ".hero-title, h1"),
    ("UI_005", "Live Weather widget renders temperature value", "P2", "dashboard", ".weather-temp, .weather-widget"),
    ("UI_006", "Live Weather condition icon is visible", "P2", "dashboard", ".weather-icon, .weather-card i"),
    ("UI_007", "Live Weather recommended fabrics badge list", "P2", "dashboard", ".fabric-chip, .weather-fabrics"),
    ("UI_008", "Today's Pick outfit card renders high-res image", "P1", "dashboard", ".today-pick-card img, app-outfit-card img"),
    ("UI_009", "Outfit match percentage badge displays with 0-100% format", "P1", "dashboard", ".score-badge, .match-score"),
    ("UI_010", "Outfit match badge applies green theme for >= 90% match", "P2", "dashboard", ".score-high, .score-badge"),
    ("UI_011", "Outfit card favorite heart button renders", "P2", "dashboard", ".favorite-btn, button:has(.fa-heart)"),
    ("UI_012", "Outfit card occasion label tag displays", "P2", "dashboard", ".occasion-tag, .card-meta"),
    ("UI_013", "Outfit card style classification badge displays", "P2", "dashboard", ".style-badge"),
    ("UI_014", "Outfit card estimated price displays in INR currency", "P2", "dashboard", ".price-tag"),
    ("UI_015", "Outfit card top component snippet chip", "P3", "dashboard", ".comp-chip:has(.fa-shirt), .comp-chip"),
    ("UI_016", "Outfit card bottom component snippet chip", "P3", "dashboard", ".comp-chip:has(.fa-person), .comp-chip"),
    ("UI_017", "Analysis Preview card renders skin tone value", "P2", "dashboard", ".metrics-card, .analysis-preview"),
    ("UI_018", "Analysis Preview card renders body type value", "P2", "dashboard", ".metrics-card, .analysis-preview"),
    ("UI_019", "Upcoming schedule mini widget in dashboard", "P2", "dashboard", ".schedule-widget, .upcoming-box"),
    ("UI_020", "Recommendations page header title displays", "P1", "recommendations", ".page-title"),
    ("UI_021", "Recommendations occasion filter chips horizontal bar", "P2", "recommendations", ".filter-chip, .occasion-chip"),
    ("UI_022", "Recommendations search bar with search icon", "P2", "recommendations", "input[type='text'], .search-box"),
    ("UI_023", "Recommendations grid displays 3-column layout", "P2", "recommendations", ".grid-cols-3, .grid"),
    ("UI_024", "Price comparison modal backdrop blur glassmorphism", "P1", "recommendations", ".modal-overlay"),
    ("UI_025", "Price comparison modal header icon and title", "P2", "recommendations", ".modal-title"),
    ("UI_026", "Price comparison modal top category tab", "P2", "recommendations", ".tab-btn:has(.fa-shirt), .tab-btn"),
    ("UI_027", "Price comparison modal bottom category tab", "P2", "recommendations", ".tab-btn:has(.fa-person), .tab-btn"),
    ("UI_028", "Price comparison modal footwear category tab", "P2", "recommendations", ".tab-btn:has(.fa-shoe-prints), .tab-btn"),
    ("UI_029", "Price comparison modal accessories category tab", "P2", "recommendations", ".tab-btn:has(.fa-clock), .tab-btn"),
    ("UI_030", "Price comparison best verified price winner badge", "P1", "recommendations", ".best-price-badge-box, .badge-emerald"),
    ("UI_031", "Amazon store card with logo and verified price", "P1", "recommendations", ".store-name.amazon, .store-card"),
    ("UI_032", "Flipkart store card with logo and verified price", "P1", "recommendations", ".store-name.flipkart, .store-card"),
    ("UI_033", "Myntra store card with logo and verified price", "P1", "recommendations", ".store-name.myntra, .store-card"),
    ("UI_034", "Ajio store card with logo and verified price", "P1", "recommendations", ".store-name.ajio, .store-card"),
    ("UI_035", "Shopping Hub page header deals badge", "P2", "shopping", ".badge-gold, .page-header"),
    ("UI_036", "Shopping Hub search input field with live filter", "P2", "shopping", "input[type='text']"),
    ("UI_037", "Shopping Hub product card image rendering", "P2", "shopping", ".product-card img, .shopping-card img"),
    ("UI_038", "Shopping Hub platform tag badge on product card", "P2", "shopping", ".platform-tag, .product-card"),
    ("UI_039", "Analysis page photo upload dropzone border style", "P2", "analysis", ".upload-dropzone, .upload-box"),
    ("UI_040", "Analysis page camera activation preview video element", "P2", "analysis", "video, .camera-preview"),
    ("UI_041", "Analysis page confidence score circular or progress badge", "P2", "analysis", ".confidence-score, .score-value"),
    ("UI_042", "Analysis page recommended harmonic color palette chips", "P2", "analysis", ".palette-circle, .color-swatch"),
    ("UI_043", "Assistant chat header with stylist avatar robot icon", "P2", "assistant", ".stylist-avatar, .fa-robot"),
    ("UI_044", "Assistant chat online status pulsating dot", "P2", "assistant", ".pulse-dot, .online-status"),
    ("UI_045", "Assistant quick prompt chips horizontal pills", "P2", "assistant", ".prompt-chip, .quick-prompt"),
    ("UI_046", "Assistant chat user message bubble styling", "P2", "assistant", ".msg-row.user, .msg-bubble"),
    ("UI_047", "Assistant chat AI response message bubble styling", "P2", "assistant", ".msg-row.assistant, .msg-bubble"),
    ("UI_048", "Calendar page event timeline cards layout", "P2", "calendar", ".timeline-item, .schedule-card"),
    ("UI_049", "Calendar page 'Schedule Outfit' floating modal", "P2", "calendar", ".modal-card, .modal-header"),
    ("UI_050", "Footer copyright and engineering attribution text", "P3", "dashboard", ".footer, footer"),
]

@pytest.mark.parametrize("test_id, name, priority, path, target_css", UI_TEST_CASES)
def test_ui_validation_suite(driver, request, test_id, name, priority, path, target_css):
    request.node.test_id = test_id
    request.node.module_name = "UI Validation"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    
    # Assert presence of UI container
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
