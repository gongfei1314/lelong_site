/* ============================================================
   乐融建材门户网站 · 交互脚本
   纯原生 JS，无外部依赖
   ============================================================ */
(function () {
  "use strict";

  var d = document;

  /* ---------------- 1. 导航：滚动加阴影 ---------------- */
  var header = d.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- 2. 移动端菜单开关 ---------------- */
  var navToggle = d.getElementById("navToggle");
  var mainNav = d.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });
    // 点击链接后收起菜单（子菜单首次展开时已 preventDefault，跳过收起）
    mainNav.addEventListener("click", function (e) {
      if (e.defaultPrevented) return;
      if (e.target.closest("a") && window.innerWidth <= 768) {
        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
      }
    });
    // 移动端：点击带下拉的父项展开子菜单
    mainNav.querySelectorAll("li").forEach(function (li) {
      var drop = li.querySelector(".dropdown");
      var link = li.querySelector(":scope > a");
      if (drop && link) {
        link.addEventListener("click", function (e) {
          if (window.innerWidth <= 768) {
            // 若点击的是当前链接本身的跳转目标则放行；展开逻辑：首次点击展开
            if (!li.classList.contains("expand")) {
              e.preventDefault();
              li.classList.add("expand");
            }
          }
        });
      }
    });
  }

  /* ---------------- 3. 首页轮播 ---------------- */
  var hero = d.getElementById("hero");
  if (hero) {
    var slides = hero.querySelectorAll(".slide");
    var dotsBox = d.getElementById("heroDots");
    var cur = 0;
    var timer = null;

    // 生成指示点
    slides.forEach(function (_, i) {
      var b = d.createElement("button");
      if (i === 0) b.classList.add("active");
      b.setAttribute("aria-label", "第" + (i + 1) + "张");
      b.addEventListener("click", function () {
        go(i);
        restart();
      });
      dotsBox.appendChild(b);
    });
    var dots = dotsBox.querySelectorAll("button");

    function go(n) {
      slides[cur].classList.remove("active");
      dots[cur].classList.remove("active");
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add("active");
      dots[cur].classList.add("active");
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(cur + 1); }, 5500);
    }
    restart();
  }

  /* ---------------- 4. 滚动显现动画 ---------------- */
  var revealEls = d.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------------- 5. 数字滚动动画 ---------------- */
  var counters = d.querySelectorAll(".counter");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          runCounter(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-target");
    });
  }

  /* ---------------- 6. 返回顶部 ---------------- */
  var backTop = d.getElementById("backTop");
  if (backTop) {
    window.addEventListener("scroll", function () {
      backTop.classList.toggle("show", window.scrollY > 420);
    }, { passive: true });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- 7. 案例筛选（含 URL 参数） ---------------- */
  var caseFilter = d.getElementById("caseFilter");
  var caseGrid = d.getElementById("caseGrid");
  if (caseFilter && caseGrid) {
    var cards = caseGrid.querySelectorAll(".case-card");
    var btns = caseFilter.querySelectorAll("button");

    function applyFilter(f) {
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.style.display = show ? "" : "none";
        if (show) card.classList.add("visible");
      });
      btns.forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-f") === f);
      });
    }

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        applyFilter(b.getAttribute("data-f"));
      });
    });

    // 支持 cases.html?f=industrial 直达筛选
    var params = new URLSearchParams(window.location.search);
    var f = params.get("f");
    if (f) applyFilter(f);
  }

  /* ---------------- 8. 留言表单（校验 + FormSubmit 转发到邮箱） ---------------- */
  /* Server酱微信推送（可选）：在 https://sct.ftqq.com 微信扫码登录后，
     「Key&二维码」页复制 SendKey 填到下面，并关注「方糖」服务号，
     提交表单时除邮件外同步推送到微信。保持 HERE_ 前缀则只发邮件。 */
  var SC_SENDKEY = "SCT413192T6BmijLSHMviFXSDgoOeb17mZ";

  var form = d.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var okBox = d.getElementById("formOk");

      if (!name) {
        alert("请填写您的称呼，方便我们联系您。");
        form.name.focus();
        return;
      }
      if (!/^[\d\s\-+]{7,20}$/.test(phone)) {
        alert("请填写有效的联系电话（7-20位数字，可含 - +）。");
        form.phone.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "提交中…"; }

      var info =
        "称呼：" + name + "  \n" +
        "联系电话：" + phone + "  \n" +
        "项目类型：" + (form.type.value || "未选择") + "  \n" +
        "意向产品：" + (form.product.value || "未选择") + "  \n" +
        "项目描述：" + (form.msg.value.trim() || "无");

      /* Server酱微信推送：与邮件并行发送，失败静默（不影响邮件与页面反馈） */
      if (SC_SENDKEY.indexOf("HERE_") !== 0) {
        try {
          var scBody = new URLSearchParams();
          scBody.append("title", "【官网咨询】" + name + "（" + phone + "）");
          scBody.append("desp", info);
          fetch("https://sctapi.ftqq.com/" + SC_SENDKEY + ".send", { method: "POST", body: scBody })
            .catch(function () {});
        } catch (err) { /* 推送失败不影响主流程 */ }
      }

      /* 经 FormSubmit 免费服务转发到公司邮箱（首次使用需在邮箱里点一次激活链接，
         详见 README）。_captcha=false 避免国内无法加载 Google 验证码，
         _honey 蜜罐字段用于拦截机器人。 */
      fetch("https://formsubmit.co/ajax/976310867@qq.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "【官网咨询】" + name + "（" + phone + "）",
          _template: "table",
          _captcha: "false",
          _honey: "",
          message: info
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && String(data.success) === "true") {
            okBox.style.display = "block";
            form.reset();
            setTimeout(function () { okBox.style.display = "none"; }, 6000);
          } else {
            throw new Error(data && data.message ? data.message : "failed");
          }
        })
        .catch(function () {
          alert("提交暂时失败，请直接来电 18723377259，或发邮件至 976310867@qq.com，感谢您的信任！");
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = "提交咨询"; }
        });
    });
  }
})();
