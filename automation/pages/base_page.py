import os
import time
from typing import List, Tuple, Optional
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException,
    NoSuchElementException,
    StaleElementReferenceException,
    ElementClickInterceptedException
)
from automation.config.config import Config
from automation.utils.logger import get_logger

logger = get_logger("BasePage")

class BasePage:
    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, Config.EXPLICIT_WAIT)
        self.short_wait = WebDriverWait(driver, 5)

    def navigate_to(self, path: str = "") -> None:
        url = Config.get_url(path)
        logger.info(f"Navigating to live URL: {url}")
        self.driver.get(url)
        self.wait_for_page_ready()

    def wait_for_page_ready(self, timeout: int = 15) -> bool:
        """Wait for document.readyState == 'complete' and Angular root element to mount"""
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            return True
        except TimeoutException:
            logger.warning("Timed out waiting for document.readyState == 'complete'")
            return False

    def find(self, locator: Tuple[str, str], timeout: Optional[int] = None) -> WebElement:
        wait = WebDriverWait(self.driver, timeout) if timeout else self.wait
        return wait.until(EC.presence_of_element_located(locator))

    def find_visible(self, locator: Tuple[str, str], timeout: Optional[int] = None) -> WebElement:
        wait = WebDriverWait(self.driver, timeout) if timeout else self.wait
        return wait.until(EC.visibility_of_element_located(locator))

    def find_clickable(self, locator: Tuple[str, str], timeout: Optional[int] = None) -> WebElement:
        wait = WebDriverWait(self.driver, timeout) if timeout else self.wait
        return wait.until(EC.element_to_be_clickable(locator))

    def find_all(self, locator: Tuple[str, str], timeout: int = 5) -> List[WebElement]:
        try:
            WebDriverWait(self.driver, timeout).until(EC.presence_of_all_elements_located(locator))
            return self.driver.find_elements(*locator)
        except TimeoutException:
            return []

    def click(self, locator: Tuple[str, str], timeout: Optional[int] = None, retries: int = 3) -> bool:
        for attempt in range(retries):
            try:
                element = self.find_clickable(locator, timeout)
                self.scroll_into_view(element)
                element.click()
                return True
            except (ElementClickInterceptedException, StaleElementReferenceException) as e:
                logger.warning(f"Click attempt {attempt + 1} failed for {locator}. Retrying with JS click...")
                try:
                    elem = self.find(locator, timeout)
                    self.driver.execute_script("arguments[0].click();", elem)
                    return True
                except Exception:
                    time.sleep(0.5)
        raise ElementClickInterceptedException(f"Failed to click element: {locator} after {retries} attempts.")

    def type_text(self, locator: Tuple[str, str], text: str, clear_first: bool = True, timeout: Optional[int] = None) -> None:
        element = self.find_visible(locator, timeout)
        if clear_first:
            element.clear()
            # Double clear using backspace for Angular input bindings
            self.driver.execute_script("arguments[0].value = '';", element)
        element.send_keys(text)
        # Dispatch input event for Angular two-way binding
        self.driver.execute_script("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", element)

    def get_text(self, locator: Tuple[str, str], timeout: Optional[int] = None) -> str:
        element = self.find_visible(locator, timeout)
        return element.text.strip()

    def get_attribute(self, locator: Tuple[str, str], attribute: str, timeout: Optional[int] = None) -> str:
        element = self.find(locator, timeout)
        return element.get_attribute(attribute) or ""

    def is_visible(self, locator: Tuple[str, str], timeout: int = 3) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located(locator))
            return True
        except (TimeoutException, NoSuchElementException):
            return False

    def is_present(self, locator: Tuple[str, str], timeout: int = 3) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(EC.presence_of_element_located(locator))
            return True
        except (TimeoutException, NoSuchElementException):
            return False

    def scroll_into_view(self, element: WebElement) -> None:
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});", element)

    def get_current_path(self) -> str:
        current_url = self.driver.current_url
        base = Config.BASE_URL
        if current_url.startswith(base):
            return current_url[len(base):]
        return current_url

    def take_screenshot(self, name: str) -> str:
        os.makedirs(Config.SCREENSHOTS_DIR, exist_ok=True)
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"{name}_{timestamp}.png"
        filepath = os.path.join(Config.SCREENSHOTS_DIR, filename)
        self.driver.save_screenshot(filepath)
        logger.info(f"Captured screenshot: {filepath}")
        return filepath

    def get_browser_console_logs(self) -> List[dict]:
        try:
            return self.driver.get_log("browser")
        except Exception:
            return []
