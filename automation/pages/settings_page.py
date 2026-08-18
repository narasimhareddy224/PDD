from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class SettingsPage(BasePage):
    PATH = "settings"

    PAGE_TITLE = (By.CSS_SELECTOR, ".page-title, h1")
    TOGGLE_SWITCHES = (By.CSS_SELECTOR, "input[type='checkbox'], .toggle-switch")
    DELETE_ACCOUNT_BTN = (By.CSS_SELECTOR, ".danger-zone button, .text-danger")

    def load(self) -> "SettingsPage":
        self.navigate_to(self.PATH)
        return self

    def is_settings_loaded(self) -> bool:
        return self.is_visible(self.PAGE_TITLE, timeout=8)
