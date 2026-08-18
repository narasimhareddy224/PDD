from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class RegisterPage(BasePage):
    PATH = "auth/register"

    NAME_INPUT = (By.CSS_SELECTOR, "input[name='name'], input[formcontrolname='name']")
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[type='email']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[type='password']")
    SUBMIT_BTN = (By.CSS_SELECTOR, "button[type='submit']")
    LOGIN_LINK = (By.CSS_SELECTOR, "a[routerlink='/auth/login']")

    def load(self) -> "RegisterPage":
        self.navigate_to(self.PATH)
        return self

    def register(self, name: str, email: str, password: str) -> None:
        self.type_text(self.NAME_INPUT, name)
        self.type_text(self.EMAIL_INPUT, email)
        self.type_text(self.PASSWORD_INPUT, password)
        self.click(self.SUBMIT_BTN)

    def is_register_page_loaded(self) -> bool:
        return self.is_visible(self.NAME_INPUT) and self.is_visible(self.EMAIL_INPUT)
