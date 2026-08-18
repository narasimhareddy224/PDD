from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class DashboardPage(BasePage):
    PATH = "dashboard"

    HERO_GREETING = (By.CSS_SELECTOR, ".greeting-badge, .hero-title, h1")
    USER_NAME_DISPLAY = (By.CSS_SELECTOR, ".user-name-highlight, .hero-title")
    WEATHER_CARD = (By.CSS_SELECTOR, ".weather-widget, .weather-card, .widget-card")
    TODAY_PICK_CARD = (By.CSS_SELECTOR, ".today-pick-card, .featured-outfit, app-outfit-card")
    RECS_GRID = (By.CSS_SELECTOR, ".recs-carousel, .grid-cols-3, app-outfit-card")
    ANALYSIS_METRICS_CARD = (By.CSS_SELECTOR, ".metrics-card, .analysis-preview")
    DISCOVER_BTN = (By.CSS_SELECTOR, "a[routerlink='/recommendations']")
    COMPARE_PRICES_BTN = (By.CSS_SELECTOR, "button:has(.fa-tags), .btn-primary")
    NAV_LINKS = (By.CSS_SELECTOR, ".nav-link")
    COMPARE_MODAL = (By.CSS_SELECTOR, "app-price-compare-modal, .modal-card")

    def load(self) -> "DashboardPage":
        self.navigate_to(self.PATH)
        return self

    def is_dashboard_loaded(self) -> bool:
        return self.is_visible(self.HERO_GREETING, timeout=8)

    def get_greeting_text(self) -> str:
        return self.get_text(self.HERO_GREETING)

    def click_discover_outfits(self) -> None:
        self.click(self.DISCOVER_BTN)
