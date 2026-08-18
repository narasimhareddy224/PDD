from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class OutfitDetailPage(BasePage):
    PATH_PREFIX = "outfits/"

    TITLE = (By.CSS_SELECTOR, ".outfit-detail-title, h1, .detail-title")
    PRICE_TAG = (By.CSS_SELECTOR, ".price-tag, .total-price")
    COMPARE_BTN = (By.CSS_SELECTOR, "button:has(.fa-tags)")
    FAVORITE_BTN = (By.CSS_SELECTOR, "button:has(.fa-heart)")
    BACK_LINK = (By.CSS_SELECTOR, ".back-link, a:has(.fa-arrow-left)")

    def load_outfit(self, outfit_id: str) -> "OutfitDetailPage":
        self.navigate_to(f"{self.PATH_PREFIX}{outfit_id}")
        return self

    def is_detail_loaded(self) -> bool:
        return self.is_visible(self.TITLE, timeout=8)
