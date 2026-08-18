from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class ProfilePage(BasePage):
    PATH = "profile"

    PAGE_TITLE = (By.CSS_SELECTOR, ".page-title, h1")
    NAME_INPUT = (By.CSS_SELECTOR, "input[name='name'], input[formcontrolname='name']")
    SAVE_PROFILE_BTN = (By.CSS_SELECTOR, "button[type='submit'], button.btn-primary")
    COLOR_PILLS = (By.CSS_SELECTOR, ".color-chip, .color-pill")
    STYLE_PILLS = (By.CSS_SELECTOR, ".style-pill, .style-chip")
    OCCASION_PILLS = (By.CSS_SELECTOR, ".occasion-pill, .occasion-chip")
    TOAST_SUCCESS = (By.CSS_SELECTOR, ".toast-success, .toast-item")

    def load(self) -> "ProfilePage":
        self.navigate_to(self.PATH)
        return self

    def is_profile_loaded(self) -> bool:
        return self.is_visible(self.PAGE_TITLE, timeout=8)

    def update_name(self, new_name: str) -> None:
        self.type_text(self.NAME_INPUT, new_name)
        self.click(self.SAVE_PROFILE_BTN)
