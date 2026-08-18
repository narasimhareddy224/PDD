from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class AssistantPage(BasePage):
    PATH = "assistant"

    PAGE_TITLE = (By.CSS_SELECTOR, ".stylist-name, h2")
    CHAT_INPUT = (By.CSS_SELECTOR, "input[placeholder*='Ask'], input[type='text']")
    SEND_BTN = (By.CSS_SELECTOR, "button:has(.fa-paper-plane), button[type='submit']")
    PROMPT_CHIPS = (By.CSS_SELECTOR, ".prompt-chip, .quick-prompt")
    MESSAGE_BUBBLES = (By.CSS_SELECTOR, ".msg-bubble, .msg-row")
    THINKING_INDICATOR = (By.CSS_SELECTOR, ".typing-indicator, .thinking")

    def load(self) -> "AssistantPage":
        self.navigate_to(self.PATH)
        return self

    def is_assistant_loaded(self) -> bool:
        return self.is_visible(self.PAGE_TITLE, timeout=8)

    def send_message(self, message: str) -> None:
        self.type_text(self.CHAT_INPUT, message)
        self.click(self.SEND_BTN)
