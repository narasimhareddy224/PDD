from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class ShoppingHubPage(BasePage):
    PATH = "shopping"

    PAGE_TITLE = (By.CSS_SELECTOR, ".page-title, h1")
    SEARCH_INPUT = (By.CSS_SELECTOR, "input[placeholder*='Search'], input[type='text']")
    CATEGORY_CHIPS = (By.CSS_SELECTOR, ".category-chip, .filter-chip")
    PRODUCT_CARDS = (By.CSS_SELECTOR, ".product-card, .shopping-card")
    STORE_CARDS = (By.CSS_SELECTOR, ".store-card")
    AMAZON_STORE = (By.CSS_SELECTOR, ".store-name.amazon")
    FLIPKART_STORE = (By.CSS_SELECTOR, ".store-name.flipkart")
    MYNTRA_STORE = (By.CSS_SELECTOR, ".store-name.myntra")
    AJIO_STORE = (By.CSS_SELECTOR, ".store-name.ajio")

    def load(self) -> "ShoppingHubPage":
        self.navigate_to(self.PATH)
        return self

    def is_shopping_hub_loaded(self) -> bool:
        return self.is_visible(self.PAGE_TITLE, timeout=8)

    def search_product(self, query: str) -> None:
        self.type_text(self.SEARCH_INPUT, query)
