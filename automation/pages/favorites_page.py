from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class FavoritesPage(BasePage):
    PATH = "favorites"

    PAGE_TITLE = (By.CSS_SELECTOR, ".page-title, h1")
    FAVORITE_CARDS = (By.CSS_SELECTOR, "app-outfit-card, .outfit-card")
    EMPTY_STATE = (By.CSS_SELECTOR, ".empty-state, .fa-heart-crack")

    def load(self) -> "FavoritesPage":
        self.navigate_to(self.PATH)
        return self

    def is_favorites_loaded(self) -> bool:
        return self.is_visible(self.PAGE_TITLE, timeout=8)
