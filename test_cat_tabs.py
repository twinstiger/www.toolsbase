from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.goto('http://localhost:8081/dist/tools/index.html')
    page.wait_for_timeout(1000)

    # Get the bounding rect of the active tab
    rect_info = page.evaluate('''() => {
      const tab = document.querySelector('.category-tab.active');
      const rect = tab.getBoundingClientRect();
      const catTabs = document.querySelector('.cat-tabs');
      const catTabsRect = catTabs.getBoundingClientRect();
      return {
        tabRect: {left: rect.left, top: rect.top, width: rect.width, height: rect.height},
        catTabsRect: {left: catTabsRect.left, top: catTabsRect.top, width: catTabsRect.width, height: catTabsRect.height},
        // Get pixel at center of tab
        tabCenterX: rect.left + rect.width / 2,
        tabCenterY: rect.top + rect.height / 2,
        // Also check padding of cat-tabs-inner
        innerPaddingLeft: getComputedStyle(document.querySelector('.cat-tabs-inner')).paddingLeft
      };
    }''')

    print("Tab rect:", rect_info)

    # Take screenshot and check pixel at tab center
    page.screenshot(path='/tmp/tabs_check.png')
    from PIL import Image
    img = Image.open('/tmp/tabs_check.png')
    cx = int(rect_info['tabCenterX'])
    cy = int(rect_info['tabCenterY'])
    print(f"Checking pixel at center of tab: ({cx}, {cy})")
    pixel = img.convert('RGB').getpixel((cx * 2, cy * 2))  # 2x for retina
    print(f"Pixel at tab center (2x scaled): {pixel}")
    pixel_raw = img.convert('RGB').getpixel((cx, cy))
    print(f"Pixel at tab center (1x): {pixel_raw}")

    # Also try 1x
    page.set_viewport_size({'width': 640, 'height': 450})
    page.wait_for_timeout(100)
    page.screenshot(path='/tmp/tabs_check_1x.png')
    img_1x = Image.open('/tmp/tabs_check_1x.png')
    pixel_1x = img_1x.convert('RGB').getpixel((cx, cy))
    print(f"Pixel at tab center (1x viewport): {pixel_1x}")

    browser.close()