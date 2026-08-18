# Test data matrices and payloads for 400+ E2E tests

class TestData:
    VALID_USERS = [
        {"email": "alex.rivers@fashion.ai", "password": "Password123!", "name": "Alex Rivers"},
        {"email": "elena.vance@fashion.ai", "password": "Password123!", "name": "Elena Vance"},
        {"email": "marcus.sterling@fashion.ai", "password": "Password123!", "name": "Marcus Sterling"},
    ]

    INVALID_LOGIN_CREDENTIALS = [
        {"id": "AUTH_001", "email": "invalid.user@unknown.com", "password": "wrongpassword", "expected_err": "Invalid"},
        {"id": "AUTH_002", "email": "plainaddress", "password": "Password123!", "expected_err": "email format"},
        {"id": "AUTH_003", "email": "@missingusername.com", "password": "Password123!", "expected_err": "email format"},
        {"id": "AUTH_004", "email": "alex@.com", "password": "Password123!", "expected_err": "email format"},
        {"id": "AUTH_005", "email": "alex@domain..com", "password": "Password123!", "expected_err": "email format"},
        {"id": "AUTH_006", "email": "alex@domain.com", "password": "123", "expected_err": "password length"},
        {"id": "AUTH_007", "email": "alex@domain.com", "password": "a", "expected_err": "password length"},
        {"id": "AUTH_008", "email": "", "password": "Password123!", "expected_err": "required"},
        {"id": "AUTH_009", "email": "alex@domain.com", "password": "", "expected_err": "required"},
        {"id": "AUTH_010", "email": "", "password": "", "expected_err": "required"},
    ]

    SECURITY_PAYLOADS = [
        {"id": "SEC_001", "payload": "' OR '1'='1", "field": "email"},
        {"id": "SEC_002", "payload": "admin' --", "field": "email"},
        {"id": "SEC_003", "payload": "<script>alert(1)</script>", "field": "name"},
        {"id": "SEC_004", "payload": "javascript:alert('XSS')", "field": "search"},
        {"id": "SEC_005", "payload": "../../../../etc/passwd", "field": "search"},
        {"id": "SEC_006", "payload": "{{ 7*7 }}", "field": "assistant_chat"},
        {"id": "SEC_007", "payload": "${7*7}", "field": "assistant_chat"},
        {"id": "SEC_008", "payload": "<img src=x onerror=alert(1)>", "field": "name"},
        {"id": "SEC_009", "payload": "Robert'); DROP TABLE Students;--", "field": "name"},
        {"id": "SEC_010", "payload": "\x00\x01\x02\x03", "field": "name"},
    ]

    OCCASIONS = [
        "All Occasions",
        "Weddings",
        "Parties",
        "Interviews",
        "College",
        "Office",
        "Festivals",
        "Casual outings",
        "Dates",
        "Travel",
        "Smart casual",
    ]

    FASHION_STYLES = [
        "Smart Casual",
        "Casual",
        "Formal",
        "Streetwear",
        "Traditional",
        "Sporty",
        "Minimalist",
        "Trendy",
    ]

    SKIN_TONES = [
        "Very Fair",
        "Fair",
        "Medium",
        "Olive",
        "Brown",
        "Deep",
    ]

    BODY_TYPES = [
        "Rectangle",
        "Triangle",
        "Inverted Triangle",
        "Oval",
        "Hourglass",
    ]

    FITNESS_LEVELS = [
        "Lean",
        "Average",
        "Athletic",
        "Muscular",
        "Plus-size",
    ]

    MERCHANT_PLATFORMS = [
        "Amazon",
        "Flipkart",
        "Myntra",
        "Ajio",
    ]

    VIEWPORT_SIZES = [
        {"name": "Desktop 1080p", "width": 1920, "height": 1080},
        {"name": "Laptop 720p", "width": 1366, "height": 768},
        {"name": "Tablet Portrait", "width": 768, "height": 1024},
        {"name": "Mobile Portrait iPhone X", "width": 375, "height": 812},
        {"name": "Mobile Android Large", "width": 412, "height": 915},
    ]
