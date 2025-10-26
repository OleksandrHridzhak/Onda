from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        electron_app = p._electron.launch(args=['.'])

        window = electron_app.first_window()

        # Navigate to settings
        window.click('a[href="#/settings"]')
        time.sleep(1)

        # Go to custom page settings
        window.click('button:has-text("Custom Page")')
        time.sleep(1)

        # Fill URL
        window.fill('input[type="text"]', 'https://www.wikipedia.org/')
        time.sleep(1)

        # Save
        window.click('button:has-text("Save")')
        time.sleep(1)

        # Go to custom page
        window.click('a[href="#/custom"]')
        time.sleep(2) # Wait for page to load

        # Screenshot
        window.screenshot(path='jules-scratch/verification/verification.png')

        electron_app.close()

run()
