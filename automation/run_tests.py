#!/usr/bin/env python3
"""
NextFit AI – Unified E2E Test Automation Runner
Executes 400+ Selenium test cases against the Live GitHub Pages deployment,
generates multi-sheet Excel reports, interactive HTML dashboards, and evaluates
pass/fail quality gates.
"""

import sys
import os
import argparse
import pytest
from datetime import datetime

# Add automation directory to python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from automation.config.config import Config
from automation.utils.logger import get_logger

logger = get_logger("TestRunner")

def parse_args():
    parser = argparse.ArgumentParser(description="NextFit AI E2E Live Test Suite Runner")
    parser.add_argument("--url", default=None, help="Live deployment base URL (overrides BASE_URL env)")
    parser.add_argument("--headless", action="store_true", default=True, help="Run Chrome in headless mode")
    parser.add_argument("--no-headless", dest="headless", action="store_false", help="Run Chrome with GUI")
    parser.add_argument("--browser", default="chrome", help="Browser to execute tests (chrome)")
    parser.add_argument("--suite", default=None, help="Specific test suite file to run")
    parser.add_argument("-k", "--keyword", default=None, help="Pytest keyword expression")
    parser.add_argument("-n", "--workers", default=None, help="Number of parallel workers (requires pytest-xdist)")
    return parser.parse_args()

def main():
    args = parse_args()

    # Configure Environment
    if args.url:
        Config.BASE_URL = args.url.rstrip("/") + "/"
        os.environ["BASE_URL"] = Config.BASE_URL

    Config.HEADLESS = args.headless
    os.environ["HEADLESS"] = str(args.headless).lower()
    Config.BROWSER = args.browser

    logger.info("=================================================================")
    logger.info("       NEXTFIT AI – ENTERPRISE E2E AUTOMATION TEST RUNNER        ")
    logger.info("=================================================================")
    logger.info(f"Target Live URL    : {Config.BASE_URL}")
    logger.info(f"Browser Execution  : {Config.BROWSER} (Headless: {Config.HEADLESS})")
    logger.info(f"Pass Rate Threshold: {Config.MIN_PASS_PERCENTAGE}%")
    logger.info("=================================================================")

    # Assemble Pytest arguments
    pytest_args = [
        "-v",
        "--tb=short",
    ]

    if args.workers and args.workers != "1":
        pytest_args.extend(["-n", args.workers])

    if args.keyword:
        pytest_args.extend(["-k", args.keyword])

    test_target = os.path.join(current_dir, "tests")
    if args.suite:
        test_target = os.path.join(current_dir, "tests", args.suite)

    pytest_args.append(test_target)

    logger.info(f"Launching pytest execution with arguments: {pytest_args}")
    exit_code = pytest.main(pytest_args)

    logger.info("=================================================================")
    logger.info(f"Test Execution Completed with Pytest Exit Code: {exit_code}")
    logger.info(f"Excel Reports      : {os.path.join(Config.REPORTS_DIR, 'Excel')}")
    logger.info(f"HTML Dashboard     : {os.path.join(Config.REPORTS_DIR, 'HTML', 'dashboard.html')}")
    logger.info(f"Summary Markdown   : {os.path.join(Config.REPORTS_DIR, 'Summary', 'summary.md')}")
    logger.info("=================================================================")

    return exit_code

if __name__ == "__main__":
    sys.exit(main())
