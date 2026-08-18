from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class LoginPage(BasePage):
    PATH = "auth/login"

    # Locators
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[type='email']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[type='password']")
    SUBMIT_BTN = (By.CSS_SELECTOR, "button[type='submit']")
    DEMO_LOGIN_BTN = (By.CSS_SELECTOR, ".btn-outline, .btn-demo, button.btn-secondary")
    FORGOT_PASSWORD_LINK = (By.LINK_TEXT, "Forgot Password?")
    SIGNUP_LINK = (By.LINK_TEXT, "Create Account")
    CARD_TITLE = (By.CSS_SELECTOR, ".auth-title, h2")
    ERROR_ALERT = (By.CSS_SELECTOR, ".alert-danger, .toast-error, .text-danger")

    def load(self) -> "LoginPage":
        self.navigate_to(self.PATH)
        return self

    def login(self, email: str, password: str) -> None:
        self.type_text(self.EMAIL_INPUT, email)
        self.type_text(self.PASSWORD_INPUT, password)
        self.click(self.SUBMIT_BTN)

    def quick_demo_login(self) -> None:
        if self.is_present(self.DEMO_LOGIN_BTN, timeout=3):
            self.click(self.DEMO_LOGIN_BTN)
        else:
            self.login("alex.rivers@fashion.ai", "Password123!")

    def is_login_page_loaded(self) -> bool:
        return self.is_visible(self.EMAIL_INPUT) and self.is_visible(self.PASSWORD_INPUT)

    def get_email_value(self) -> str:
        return self.get_attribute(self.EMAIL_INPUT, "value")
