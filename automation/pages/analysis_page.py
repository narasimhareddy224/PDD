from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class AnalysisPage(BasePage):
    PATH = "analysis"

    PAGE_TITLE = (By.CSS_SELECTOR, ".page-title, h1")
    UPLOAD_INPUT = (By.CSS_SELECTOR, "input[type='file']")
    START_CAMERA_BTN = (By.CSS_SELECTOR, ".btn-camera, button:has(.fa-camera)")
    RUN_ANALYSIS_BTN = (By.CSS_SELECTOR, ".btn-analyze, button:has(.fa-wand-magic-sparkles)")
    CONFIDENCE_SCORE = (By.CSS_SELECTOR, ".confidence-score, .score-value")
    SKIN_TONE_VAL = (By.CSS_SELECTOR, ".skin-tone-metric, .metric-value")
    BODY_TYPE_VAL = (By.CSS_SELECTOR, ".body-type-metric, .metric-value")
    EDIT_CORRECTIONS_BTN = (By.CSS_SELECTOR, ".btn-edit-corrections, button:has(.fa-pen)")

    def load(self) -> "AnalysisPage":
        self.navigate_to(self.PATH)
        return self

    def is_analysis_loaded(self) -> bool:
        return self.is_visible(self.PAGE_TITLE, timeout=8)

    def trigger_analysis(self) -> None:
        if self.is_visible(self.RUN_ANALYSIS_BTN):
            self.click(self.RUN_ANALYSIS_BTN)
