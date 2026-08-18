from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class RecommendationsPage(BasePage):
    PATH = "recommendations"

    PAGE_TITLE = (By.CSS_SELECTOR, ".page-title, h1")
    SEARCH_INPUT = (By.CSS_SELECTOR, "input[placeholder*='Search'], input[type='text']")
    OCCASION_CHIPS = (By.CSS_SELECTOR, ".filter-chip, .occasion-chip")
    OUTFIT_CARDS = (By.CSS_SELECTOR, "app-outfit-card, .outfit-card")
    FIRST_CARD_COMPARE_BTN = (By.CSS_SELECTOR, "app-outfit-card button:has(.fa-tags)")
    FIRST_CARD_DETAILS_BTN = (By.CSS_SELECTOR, "app-outfit-card a[routerlink*='outfits']")
    COMPARE_MODAL = (By.CSS_SELECTOR, "app-price-compare-modal, .modal-card")

    def load(self) -> "RecommendationsPage":
        self.navigate_to(self.PATH)
        return self

    def is_recommendations_loaded(self) -> bool:
        return self.is_visible(self.PAGE_TITLE, timeout=8)

    def search_outfit(self, query: str) -> None:
        self.type_text(self.SEARCH_INPUT, query)

    def get_outfit_cards_count(self) -> int:
        return len(self.find_all(self.OUTFIT_CARDS))

    def open_first_card_price_comparison(self) -> None:
        self.click(self.FIRST_CARD_COMPARE_BTN)
