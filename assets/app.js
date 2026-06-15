
window.dataLayer = window.dataLayer || [];
window.HERMES_METRIKA_ID = window.HERMES_METRIKA_ID || 'YANDEX_METRIKA_ID';
window.hermesGoalLog = window.hermesGoalLog || [];

(function initYandexMetrika() {
  var id = String(window.HERMES_METRIKA_ID || '').trim();
  window.hermesGoal = function(goalName, params) {
    params = params || {};
    window.hermesGoalLog.push({ goal: goalName, params: params, ts: Date.now() });
    if (/^\d+$/.test(id) && typeof window.ym === 'function') {
      try { window.ym(Number(id), 'reachGoal', goalName, params); } catch (e) {}
    }
  };

  window.hermesEcommerce = function(payload) {
    window.dataLayer.push(payload);
  };

  if (!/^\d+$/.test(id)) return;

  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j=0;j<document.scripts.length;j++){ if(document.scripts[j].src===r){return;} }
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  window.ym(Number(id), 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    ecommerce: 'dataLayer'
  });
})();

function pageGoal() {
  var path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/' || /index\.html$/.test(path)) return 'page_home';
  if (path === '/catalog/') return 'page_catalog';
  if (/^\/catalog\/[^/]+\/$/.test(path)) return 'page_category';
  if (/^\/product\/[^/]+\/$/.test(path)) return 'page_product';
  if (path === '/articles/') return 'page_articles';
  if (path === '/delivery.html') return 'page_delivery';
  if (path === '/about.html') return 'page_about';
  return 'page_other';
}

function productFromJsonLd() {
  var json = document.querySelector('script[type="application/ld+json"]');
  if (!json) return null;
  try {
    var data = JSON.parse(json.textContent);
    if (data && data['@type'] === 'Product') return data;
  } catch (e) {}
  return null;
}

function attachScrollGoals() {
  var sent = {25:false,50:false,75:false,90:false};
  var body = document.documentElement;
  function fire() {
    var total = Math.max(body.scrollHeight - window.innerHeight, 1);
    var pct = Math.round((window.scrollY / total) * 100);
    [25,50,75,90].forEach(function(level) {
      if (!sent[level] && pct >= level) {
        sent[level] = true;
        window.hermesGoal('scroll_' + level, { path: location.pathname });
      }
    });
  }
  window.addEventListener('scroll', fire, {passive:true});
  fire();
}

function highlightSearch() {
  var input = document.getElementById('siteSearch');
  if (!input) return;
  var timer = null;
  input.addEventListener('input', function() {
    var q = input.value.toLowerCase().trim();
    document.querySelectorAll('[data-title]').forEach(function(card) {
      card.style.display = !q || card.dataset.title.includes(q) ? '' : 'none';
    });
    clearTimeout(timer);
    if (q.length >= 2) {
      timer = setTimeout(function() {
        window.hermesGoal('search_catalog', { query: q, path: location.pathname });
      }, 700);
    }
  });
}

function attachClicks() {
  document.addEventListener('click', function(e) {
    var el = e.target.closest ? e.target.closest('a,button') : null;
    if (!el) return;
    var goal = el.getAttribute('data-ym-goal');
    if (goal) {
      window.hermesGoal(goal, { text: (el.textContent || '').trim(), href: el.getAttribute('href') || '', path: location.pathname });
      return;
    }
    var href = el.getAttribute('href') || '';
    var text = (el.textContent || '').trim();
    if (href.indexOf('tel:') === 0) {
      window.hermesGoal('click_phone', { text: text, path: location.pathname });
      if (el.closest('header')) window.hermesGoal('click_header_phone', { path: location.pathname });
    }
    if (href.indexOf('/catalog/') >= 0) window.hermesGoal('click_catalog', { href: href, text: text, path: location.pathname });
    if (href.indexOf('/articles/') >= 0) window.hermesGoal('click_article', { href: href, text: text, path: location.pathname });
    if (href.indexOf('/product/') >= 0) window.hermesGoal('click_product_card', { href: href, text: text, path: location.pathname });
    if (/Позвонить Александру|Позвонить|Заказать|Запросить/i.test(text)) window.hermesGoal('click_product_call', { text: text, path: location.pathname });
  });
}

function trackProduct() {
  var product = productFromJsonLd();
  if (!product) return;
  window.hermesEcommerce({
    ecommerce: {
      detail: {
        products: [{
          id: product.sku || product.name,
          name: product.name,
          category: product.category,
          brand: product.brand && product.brand.name ? product.brand.name : 'ГЕРМЕС',
          price: product.offers && product.offers.price ? product.offers.price : undefined
        }]
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  window.hermesGoal(pageGoal(), { path: location.pathname, title: document.title });
  attachScrollGoals();
  attachClicks();
  highlightSearch();
  trackProduct();
});
