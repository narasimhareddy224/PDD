from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class CalendarPage(BasePage):
    PATH = "calendar"

    PAGE_TITLE = (By.CSS_SELECTOR, ".page-title, h1")
    SCHEDULE_EVENT_BTN = (By.CSS_SELECTOR, "button:has(.fa-plus), .btn-primary")
    SCHEDULE_CARDS = (By.CSS_SELECTOR, ".timeline-item, .schedule-card, .event-card")
    MODAL_TITLE = (By.CSS_SELECTOR, ".modal-title, h3")
    DATE_INPUT = (By.CSS_SELECTOR, "input[type='date']")
    TIME_INPUT = (By.CSS_SELECTOR, "input[type='time']")
    SAVE_BTN = (By.CSS_SELECTOR, "button[type='submit'], .modal-card button.btn-primary")
    CLOSE_MODAL_BTN = (By.CSS_SELECTOR, ".btn-close, button:has(.fa-xmark)")

    def load(self) -> "CalendarPage":
        self.navigate_to(self.PATH)
        return self

    def is_calendar_loaded(self) -> bool:
        return self.is_visible(self.PAGE_TITLE, timeout=8)

    def open_new_schedule_modal(self) -> None:
        self.click(self.SCHEDULE_EVENT_BTN)
