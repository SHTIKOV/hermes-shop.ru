# Яндекс Метрика для сайта ГЕРМЕС

Счётчик подключается через `assets/app.js`.

- замените `YANDEX_METRIKA_ID` на числовой ID счётчика;
- цели уже заложены в код: `page_home`, `page_catalog`, `page_category`, `page_product`, `page_articles`, `page_delivery`, `page_about`, `click_phone`, `click_header_phone`, `click_product_card`, `click_product_call`, `click_category`, `click_catalog`, `click_article`, `search_catalog`, а также `scroll_25`, `scroll_50`, `scroll_75`, `scroll_90`;
- пока ID не указан, события пишутся в `window.hermesGoalLog`;
- ecommerce-detail уже отправляется с карточек товаров через `dataLayer`.
