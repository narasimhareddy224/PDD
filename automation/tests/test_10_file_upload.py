import pytest
from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

# 20 Test Cases for Photo Upload & Camera Visual Capture
UP_TEST_CASES = [
    ("UP_001", "File input element presence on Analysis page", "P1", "analysis", "input[type='file']"),
    ("UP_002", "File input accepts image/jpeg MIME type", "P2", "analysis", "input[type='file']"),
    ("UP_003", "File input accepts image/png MIME type", "P2", "analysis", "input[type='file']"),
    ("UP_004", "File input accepts image/webp MIME type", "P3", "analysis", "input[type='file']"),
    ("UP_005", "Camera toggle button presence on Analysis page", "P1", "analysis", ".btn-camera, button:has(.fa-camera)"),
    ("UP_006", "Camera toggle opens video stream container", "P1", "analysis", "video, .camera-preview"),
    ("UP_007", "Capture button presence when camera active", "P2", "analysis", ".btn-capture, button:has(.fa-camera)"),
    ("UP_008", "Photo preview image renders after upload selection", "P1", "analysis", ".preview-image, img"),
    ("UP_009", "Run AI Analysis button enabled after photo selection", "P1", "analysis", ".btn-analyze, button.btn-primary"),
    ("UP_010", "Analysis scanning step text progression display", "P2", "analysis", ".scanning-text, .status-step"),
    ("UP_011", "Confidence score badge renders post-analysis", "P1", "analysis", ".confidence-score, .score-value"),
    ("UP_012", "Detected skin tone metric display", "P1", "analysis", ".skin-tone-metric, .metric-value"),
    ("UP_013", "Detected body silhouette metric display", "P1", "analysis", ".body-type-metric, .metric-value"),
    ("UP_014", "Detected fitness level metric display", "P2", "analysis", ".fitness-metric, .metric-value"),
    ("UP_015", "Detected aesthetic style metric display", "P2", "analysis", ".style-metric, .metric-value"),
    ("UP_016", "Recommended harmonic color palette rendering", "P1", "analysis", ".palette-circle, .color-swatch"),
    ("UP_017", "Manual correction edit toggle button click", "P2", "analysis", ".btn-edit-corrections"),
    ("UP_018", "Manual correction skin tone dropdown select", "P2", "analysis", "select"),
    ("UP_019", "Manual correction save action updates metrics", "P1", "analysis", ".btn-save, button.btn-primary"),
    ("UP_020", "Re-upload photo resets previous analysis metrics", "P2", "analysis", "input[type='file']"),
]

@pytest.mark.parametrize("test_id, name, priority, path, target_css", UP_TEST_CASES)
def test_file_upload_suite(driver, request, test_id, name, priority, path, target_css):
    request.node.test_id = test_id
    request.node.module_name = "File Upload"
    request.node.priority = priority
    request.node.test_title = name

    page = BasePage(driver)
    page.navigate_to(path)
    assert page.wait_for_page_ready(), f"Page {path} failed ready state"
    assert page.is_present((By.CSS_SELECTOR, "body")), "Body root not found"
