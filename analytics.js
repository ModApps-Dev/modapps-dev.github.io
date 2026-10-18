(function () {
  "use strict";

  function sendEvent(name, parameters) {
    if (typeof window.gtag !== "function") {
      return;
    }
    window.gtag("event", name, parameters);
  }

  function productFromPath(pathname) {
    if (pathname.includes("dashboard-studio")) {
      return "dashboard_studio";
    }
    if (pathname.includes("sales-order-amendments")) {
      return "sales_order_amendments";
    }
    return "website_home";
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) {
      return;
    }

    var href = link.getAttribute("href") || "";
    var label = (link.textContent || "").trim().slice(0, 80);
    var product = productFromPath(window.location.pathname);

    if (href.startsWith("mailto:")) {
      sendEvent("contact_click", {
        contact_method: "email",
        product: product,
        link_text: label,
      });
      return;
    }

    if (href.includes("apps.odoo.com/apps/modules/")) {
      var versionMatch = href.match(/modules\/(18\.0|19\.0)\//);
      sendEvent("odoo_app_click", {
        product: href.includes("modapps_insight_studio")
          ? "dashboard_studio"
          : "sales_order_amendments",
        odoo_version: versionMatch ? versionMatch[1] : "unknown",
        link_text: label,
      });
      return;
    }

    if (href.includes("youtu.be") || href.includes("youtube.com") || href === "#walkthrough" || href.endsWith("#walkthrough")) {
      sendEvent("video_demo_click", {
        product: product,
        link_text: label,
      });
      return;
    }

    if (href.includes("docs/")) {
      sendEvent("documentation_click", {
        product: product,
        link_text: label,
      });
    }
  });
})();
