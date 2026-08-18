import os

class Config:
    # Deployment Base URL (Configurable via Environment Variable, defaults to Live GitHub Pages URL)
    BASE_URL = os.getenv("BASE_URL", "https://narasimhareddy224.github.io/PDD/").rstrip("/") + "/"
    
    # Execution Settings
    HEADLESS = os.getenv("HEADLESS", "true").lower() in ("true", "1", "yes")
    BROWSER = os.getenv("BROWSER", "chrome").lower()
    IMPLICIT_WAIT = int(os.getenv("IMPLICIT_WAIT", "10"))
    EXPLICIT_WAIT = int(os.getenv("EXPLICIT_WAIT", "15"))
    PAGE_LOAD_TIMEOUT = int(os.getenv("PAGE_LOAD_TIMEOUT", "30"))
    
    # Directory Paths
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    REPORTS_DIR = os.path.join(BASE_DIR, "reports")
    SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
    LOGS_DIR = os.path.join(BASE_DIR, "logs")
    DATA_DIR = os.path.join(BASE_DIR, "data")
    
    # Quality Gates & Pass Thresholds
    MIN_PASS_PERCENTAGE = float(os.getenv("MIN_PASS_PERCENTAGE", "95.0"))
    MAX_CRITICAL_FAIL_PERCENTAGE = float(os.getenv("MAX_CRITICAL_FAIL_PERCENTAGE", "5.0"))

    @classmethod
    def get_url(cls, path: str = "") -> str:
        """Dynamically resolve full URL from base_url without hardcoding"""
        path = path.lstrip("/")
        return f"{cls.BASE_URL}{path}"
