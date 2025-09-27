(function ($) {
  "use strict";

  var pxl_scroll_top;
  var pxl_window_height;
  var pxl_window_width;
  var pxl_scroll_status = "";
  var pxl_last_scroll_top = 0;
  var pxl_post_slip = false;

  $(window).on("load", function () {
    let preloader = $('.preloader');
    if (preloader.length) {
        if(preloader.hasClass('loader-style3')) {
            setTimeout(function () {
                $(".preloader").addClass("loaded").removeClass("loading");
            }, 3000);
        }else {
            $(".preloader").addClass("loaded").removeClass("loading");
        }
    }
    $(".pxl-loader").addClass("is-loaded");
    $(".pxl-swiper-slider, .pxl-header-mobile-elementor").css("opacity", "1");
    $(".pxl-gallery-scroll").parents("body").addClass("body-overflow").addClass("body-visible-sm");
    pxl_window_width = $(window).width();
    pxl_window_height = $(window).height();
    brighthub_header_sticky();
    brighthub_header_mobile();
    brighthub_scroll_to_top();
    brighthub_footer_fixed();
    brighthub_submenu_responsive();
    brighthub_panel_anchor_toggle();
    brighthub_post_grid();
    brighthub_header_left_scroll();
    brighthub_menu_divider_move();
  });

  $(window).on("scroll", function () {
    pxl_scroll_top = $(window).scrollTop();
    pxl_window_height = $(window).height();
    pxl_window_width = $(window).width();
    if (pxl_scroll_top < pxl_last_scroll_top) {
      pxl_scroll_status = "up";
    } else {
      pxl_scroll_status = "down";
    }
    pxl_last_scroll_top = pxl_scroll_top;
    brighthub_header_sticky();
    brighthub_scroll_to_top();
    brighthub_footer_fixed();
    brighthub_ptitle_scroll_opacity();
    brighthub_header_left_scroll();
    if (pxl_scroll_top < 100) {
      $(".elementor > .pin-spacer").removeClass("scroll-top-active");
    }
  });

  $(window).on("resize", function () {
    pxl_window_height = $(window).height();
    pxl_window_width = $(window).width();
    brighthub_submenu_responsive();
    brighthub_header_mobile();
    brighthub_post_grid();
    setTimeout(function () {
      brighthub_menu_divider_move();
    }, 500);
  });

  $(document).ready(function () {
    $(".preloader").addClass("loading");
    brighthub_el_parallax();
    brighthub_backtotop_progess_bar();
    brighthub_zoom_point();
    brighthub_smother_scroll();
    setInterval(updateAllMarquees, 200);

    $(".pxl-marquee").each(function () {
      var $marquee = $(this);
      var $list = $marquee.find("ul");
      var $items = $marquee.find("li.pxl-marquee__item");
    
      if ($items.length === 0) return;
    
      for (var i = 0; i < $items.length; i++) {
        $items.eq(i).clone(true).appendTo($list);
      }
    
      if ($marquee.hasClass("pxl-marquee__pause-on-hover")) {
        $list
          .on("mouseenter", function () {
            $(this).css("animation-play-state", "paused");
          })
          .on("mouseleave", function () {
            $(this).css("animation-play-state", "running");
          });
      }
    
      var totalItems = $marquee.find("li.pxl-marquee__item").length;
      var currentDuration =
        parseFloat($list.css("animation-duration")) ||
        (function () {
          var inlineStyle = $list.attr("style");
          if (inlineStyle && inlineStyle.indexOf("animation-duration") !== -1) {
            var match = inlineStyle.match(/animation-duration:\s*([0-9.]+)s/);
            return match ? parseFloat(match[1]) : 10;
          }
          return 10;
        })();
    
      var adjustedDuration = (currentDuration * totalItems) / $items.length;
      $list.css("animation-duration", adjustedDuration + "s");
    });
    

    $(document).on("click", ".pxl-copy__button", function () {
      var $container = $(this).closest(".pxl-copy");
      var textToCopy = $container.find(".pxl-copy__text").text().trim();
      var successMsg = $container.data("success") || "Copied!";
      var $temp = $("<textarea>");

      $("body").append($temp);
      $temp.val(textToCopy).select();
      document.execCommand("copy");
      $temp.remove();
      var originalContent = $(this).html();
      $(this).css("pointer-events", "none");
      $container.find(".pxl-copy__notify").remove();
      $(this)
        .parent()
        .append('<span class="pxl-copy__notify">' + successMsg + "</span>");

      var $thisButton = $(this);
      setTimeout(function () {
        $container.find(".pxl-copy__notify").remove();

        $thisButton.css("pointer-events", "auto");
      }, 2000);
    });

    let $step_2 = $(".pxl-step__style-2");

    if ($step_2.length > 0) {
      $step_2.each(function (index, item) {
        const $step = $(item);
        const $line = $step.find(".pxl-step__feature-line");
        const $items = $step.find(".pxl-step__feature-item");

        let autoRotateInterval;
        let isUserInteracting = false;

        function handleItemClick($clickedItem) {
          let index = $clickedItem.index();
          let $listItems = $clickedItem.closest(".e-con-inner").find(".pxl-step-image__list li");

          $listItems.removeClass("active");
          if (index >= 0 && index <= $listItems.length) {
            $($listItems[index]).addClass("active");
          }

          if (index >= $items.length) {
            index = $items.length - 1;
          }

          $items.removeClass("active");
          $items.each(function (i) {
            const item_height = $(this).find(".pxl-step__feature-content").outerHeight();
            if (i <= index) {
              $(this).addClass("active");
            }
          });

          let $lastActive = $items.eq(index);
          let offsetTop = $lastActive.position().top;
          let itemHeight = $lastActive.outerHeight();
          let totalHeight = $step.outerHeight();
          let newHeightPx = offsetTop + itemHeight / 2;
          let newHeightPercent = (0.3 + newHeightPx / totalHeight) * 100;

          if (newHeightPercent >= 95) {
            $line.css({
              height: "100%",
              background: "#2E90FA"
            });
          } else {
            $line.css({
              height: newHeightPercent + "%",
              background: "linear-gradient(180deg, #2E90FA 0%, #252B37 100%)"
            });
          }
        }

        function autoRotate() {
          let $activeItems = $items.filter(".active");
          let lastActiveIndex = $activeItems.length > 0 ? $activeItems.last().index() : -1;

          let nextIndex = -1;
          for (let i = lastActiveIndex + 1; i < $items.length; i++) {
            if (!$items.eq(i).hasClass("active")) {
              nextIndex = i;
              break;
            }
          }

          if (nextIndex === -1) {
            $items.removeClass("active");
            nextIndex = 0;
          }

          if (nextIndex >= 0 && nextIndex < $items.length) {
            handleItemClick($items.eq(nextIndex));
          }
        }

        function startAutoRotate() {
          stopAutoRotate();
          autoRotateInterval = setInterval(autoRotate, 3000);
        }

        function stopAutoRotate() {
          if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
          }
        }

        function resetAutoRotateTimer() {
          isUserInteracting = true;
          stopAutoRotate();

          setTimeout(function () {
            isUserInteracting = false;
            startAutoRotate();
          }, 3000);
        }

        $items.on("click", function () {
          handleItemClick($(this));
          resetAutoRotateTimer();
        });

        $step.on("mouseenter", function () {
          if (!isUserInteracting) {
            stopAutoRotate();
          }
        });

        $step.on("mouseleave", function () {
          if (!isUserInteracting) {
            startAutoRotate();
          }
        });

        startAutoRotate();
      });
    }

    // Pricing swap price
    $(document).on("click", ".pxl-pricing__style-4 .pxl-pricing__option", function () {
      const $this = $(this);
      const $card = $this.prev();
      const isActive = $this.hasClass("active");

      const dataText = isActive ? $this.data("st") : $this.data("nd");
      const price = isActive
        ? $card.find(".pxl-pricing__price-detail span").data("price-st")
        : $card.find(".pxl-pricing__price-detail span").data("price-nd");
      const period = isActive
        ? $card.find(".pxl-pricing__price-period").data("period-st")
        : $card.find(".pxl-pricing__price-period").data("period-nd");

      $this.toggleClass("active").find(".pxl-pricing__option-text").text(dataText);
      $card.find(".pxl-pricing__price-detail span").text(price);
      $card.find(".pxl-pricing__price-period").text(period);
    });

    // Style 5 pricing toggle
    $(document).on("click", ".pxl-pricing__style-5 .pxl-pricing__option", function () {
      const $this = $(this);
      const $pricing = $this.closest(".pxl-pricing");
      const isActive = $this.hasClass("active");

      const dataText = isActive
        ? $this.find(".pxl-pricing__option-text").data("tb-st")
        : $this.find(".pxl-pricing__option-text").data("tb-nd");
      const price = isActive
        ? $pricing.find(".pxl-pricing__price-currency").data("price-st")
        : $pricing.find(".pxl-pricing__price-currency").data("price-nd");
      const salePrice = isActive
        ? $pricing.find(".pxl-pricing__price-sale").data("price-sale-st")
        : $pricing.find(".pxl-pricing__price-sale").data("price-sale-nd");
      const period = isActive
        ? $pricing.find(".pxl-pricing__price-period").data("period-st")
        : $pricing.find(".pxl-pricing__price-period").data("period-nd");

      $this.toggleClass("active").find(".pxl-pricing__option-text").text(dataText);
      $pricing.find(".pxl-pricing__price-currency").text(`$${price}`);
      $pricing.find(".pxl-pricing__price-sale").text(`$${salePrice}`);
      $pricing.find(".pxl-pricing__price-period").text(period);
    });


    // Select Tel
    let $select_national_tel = document.querySelector("#your-phone");

    if ($select_national_tel) {
      let iti = window.intlTelInput($select_national_tel, {
        initialCountry: "us",
        preferredCountries: ["us"],
        utilsScript: "./libs/intlTelInput-utils.min.js"
      });

      const countryPlaceholders = {
        us: "+1 (201) 555-0123",
        ca: "+1 (416) 555-0123",
        mx: "+52 55 5123 4567",
        gt: "+502 2123 4567",
        bz: "+501 612 3456",
        sv: "+503 2123 4567",
        hn: "+504 9123 4567",
        ni: "+505 8123 4567",
        cr: "+506 8123 4567",
        pa: "+507 6123 4567",
        cu: "+53 5123 4567",
        jm: "+1 876 123 4567",
        ht: "+509 3123 4567",
        do: "+1 809 123 4567",
        pr: "+1 787 123 4567",
        bs: "+1 242 123 4567",
        bb: "+1 246 123 4567",
        tt: "+1 868 123 4567",
        dm: "+1 767 123 4567",
        lc: "+1 758 123 4567",
        vc: "+1 784 123 4567",
        gd: "+1 473 123 4567",
        kn: "+1 869 123 4567",
        ag: "+1 268 123 4567",
        ai: "+1 264 123 4567",
        ms: "+1 664 123 4567",
        vg: "+1 284 123 4567",
        vi: "+1 340 123 4567",
        ky: "+1 345 123 4567",
        tc: "+1 649 123 4567",
        bm: "+1 441 123 4567",
        sx: "+1 721 123 4567",
        br: "+55 11 91234-5678",
        ar: "+54 9 11 1234-5678",
        co: "+57 300 123 4567",
        pe: "+51 987 654 321",
        cl: "+56 9 1234 5678",
        ve: "+58 414 123 4567",
        ec: "+593 99 123 4567",
        bo: "+591 71234567",
        py: "+595 971 234567",
        uy: "+598 94 123 456",
        gy: "+592 623 4567",
        sr: "+597 812 3456",
        gf: "+594 694 12 34 56",
        fk: "+500 12345",
        gb: "+44 7700 900123",
        fr: "+33 6 12 34 56 78",
        de: "+49 170 1234567",
        it: "+39 320 123 4567",
        es: "+34 612 345 678",
        pt: "+351 912 345 678",
        ie: "+353 85 123 4567",
        be: "+32 470 12 34 56",
        nl: "+31 6 12345678",
        lu: "+352 621 123 456",
        ch: "+41 78 123 45 67",
        at: "+43 664 123456",
        mc: "+377 6 12 34 56 78",
        li: "+423 661 12 34",
        sm: "+378 66 12 34 56",
        va: "+39 06 698 12345",
        se: "+46 70-123 45 67",
        no: "+47 400 12 345",
        fi: "+358 40 1234567",
        ax: "+358 18 12345",
        dk: "+45 20 12 34 56",
        is: "+354 661 2345",
        fo: "+298 212 345",
        sj: "+47 79 12 34 56",
        pl: "+48 512 345 678",
        cz: "+420 601 123 456",
        sk: "+421 905 123 456",
        hu: "+36 20 123 4567",
        ro: "+40 712 345 678",
        bg: "+359 87 123 4567",
        ua: "+380 50 123 4567",
        by: "+375 29 123 45 67",
        ru: "+7 912 345-67-89",
        md: "+373 62 123456",
        ee: "+372 5123 456",
        lv: "+371 21 234 567",
        lt: "+370 6 123 4567",
        hr: "+385 91 234 5678",
        si: "+386 30 123 456",
        ba: "+387 61 123 456",
        rs: "+381 60 1234567",
        me: "+382 67 123 456",
        mk: "+389 70 123 456",
        al: "+355 69 123 4567",
        xk: "+383 44 123 456",
        gr: "+30 690 123 4567",
        cy: "+357 96 123 456",
        mt: "+356 9612 3456",
        gi: "+350 57123456",
        tr: "+90 530 123 45 67",
        il: "+972 50-123-4567",
        sa: "+966 50 123 4567",
        ae: "+971 50 123 4567",
        qa: "+974 3312 3456",
        bh: "+973 3312 3456",
        kw: "+965 500 12345",
        om: "+968 9123 4567",
        jo: "+962 7 9012 3456",
        lb: "+961 71 123 456",
        sy: "+963 944 123 456",
        iq: "+964 750 123 4567",
        ir: "+98 912 345 6789",
        ye: "+967 71 123 4567",
        ps: "+970 59 123 4567",
        kz: "+7 701 123 4567",
        uz: "+998 90 123 45 67",
        tm: "+993 65 123456",
        tj: "+992 917 123 456",
        kg: "+996 700 123 456",
        in: "+91 98765 43210",
        pk: "+92 301 2345678",
        bd: "+880 1712 345678",
        np: "+977 984 1234567",
        lk: "+94 71 234 5678",
        mv: "+960 771 2345",
        bt: "+975 17 123 456",
        af: "+93 70 123 4567",
        cn: "+86 131 2345 6789",
        jp: "+81 90-1234-5678",
        kr: "+82 10-1234-5678",
        kp: "+850 192 123 4567",
        tw: "+886 912 345 678",
        hk: "+852 9123 4567",
        mo: "+853 6123 4567",
        mn: "+976 8812 3456",
        th: "+66 8 1234 5678",
        vn: "+84 91 234 56 78",
        id: "+62 812 345 6789",
        my: "+60 12 345 6789",
        sg: "+65 8123 4567",
        ph: "+63 917 123 4567",
        mm: "+95 9 123 456 789",
        kh: "+855 12 345 678",
        la: "+856 20 2345 6789",
        bn: "+673 712 3456",
        tl: "+670 7723 4567",
        au: "+61 412 345 678",
        nz: "+64 21 123 4567",
        pg: "+675 7012 3456",
        fj: "+679 701 2345",
        sb: "+677 74 12345",
        vu: "+678 5912 345",
        ws: "+685 72 12345",
        to: "+676 7712 345",
        nr: "+674 555 1234",
        ki: "+686 72 12345",
        fm: "+691 350 1234",
        mh: "+692 235 1234",
        pw: "+680 779 1234",
        ck: "+682 55 123",
        nu: "+683 4123",
        tk: "+690 7012",
        nf: "+672 3 12345",
        nc: "+687 75 12 34",
        pf: "+689 87 12 34 56",
        wf: "+681 50 12 34",
        as: "+1 684 733 1234",
        gu: "+1 671 300 1234",
        mp: "+1 670 234 5678",
        cx: "+61 8 9164 1234",
        cc: "+61 8 9162 1234",
        eg: "+20 100 123 4567",
        ly: "+218 91 2345678",
        tn: "+216 20 123 456",
        dz: "+213 551 23 45 67",
        ma: "+212 612 345678",
        eh: "+212 5288 12345",
        ng: "+234 701 234 5678",
        gh: "+233 24 123 4567",
        ci: "+225 01 23 45 67 89",
        sn: "+221 70 123 45 67",
        gm: "+220 301 2345",
        gn: "+224 601 12 34 56",
        ml: "+223 65 01 23 45",
        bf: "+226 70 12 34 56",
        ne: "+227 90 12 34 56",
        tg: "+228 90 12 34 56",
        bj: "+229 90 12 34 56",
        lr: "+231 77 012 3456",
        sl: "+232 76 123456",
        gw: "+245 955 012 345",
        cv: "+238 991 2345",
        cm: "+237 6 71 23 45 67",
        ga: "+241 6 12 34 56",
        cg: "+242 06 123 4567",
        cd: "+243 991 234 567",
        cf: "+236 70 01 23 45",
        td: "+235 60 12 34 56",
        gq: "+240 222 123 456",
        st: "+239 990 1234",
        ke: "+254 712 345678",
        et: "+251 91 234 5678",
        tz: "+255 712 345678",
        ug: "+256 712 345678",
        rw: "+250 722 123 456",
        bi: "+257 79 123 456",
        so: "+252 612 345678",
        dj: "+253 77 83 12 34",
        er: "+291 7 123 456",
        ss: "+211 977 123 456",
        sd: "+249 91 123 4567",
        za: "+27 71 123 4567",
        na: "+264 81 123 4567",
        bw: "+267 71 123 456",
        zw: "+263 71 234 5678",
        mz: "+258 82 123 4567",
        mg: "+261 32 12 345 67",
        mu: "+230 5 123 4567",
        zm: "+260 955 123456",
        ls: "+266 5012 3456",
        sz: "+268 7612 3456",
        km: "+269 321 23 45",
        sc: "+248 2 510 123",
        io: "+246 379 1234",
        sh: "+290 12345",
        ac: "+247 12345",
        pm: "+508 55 12 34",
        bl: "+590 690 12 34 56",
        mf: "+590 690 12 34 56",
        re: "+262 692 12 34 56",
        yt: "+262 639 12 34 56",
        mq: "+596 696 12 34 56",
        gp: "+590 690 12 34 56",
        gg: "+44 7781 123456",
        je: "+44 7797 123456",
        im: "+44 7624 123456"
      };

      iti.setCountry("us");

      $select_national_tel.addEventListener("countrychange", function () {
        const countryCode = iti.getSelectedCountryData().iso2;
        setCountryPlaceholder(countryCode);
      });

      function setCountryPlaceholder(countryCode) {
        const phoneInput = document.querySelector("#your-phone");
        if (phoneInput && countryPlaceholders[countryCode]) {
          phoneInput.setAttribute("placeholder", countryPlaceholders[countryCode]);
        }
      }
    }

    // Map
    let $office_info = document.querySelectorAll(".pxl-office");
    if ($office_info.length > 0) {
      $office_info.forEach(function (item) {
        $(item)
          .find(".pxl-office__pos-item")
          .on("click", function () {
            let $item_idx = $(this).index();
            $(item).find(".pxl-office__pos-item").removeClass("active");
            $(item).find(".pxl-office__content-item").removeClass("active");
            $(this).addClass("active");
            $(item).find(".pxl-office__content-item").eq($item_idx).addClass("active");
          });
      });
    }

    // Load More Button For Standard Blog
    let page = parseInt(loadmore_params.startPage) + 1;
    let loading = false;

    $(".pxl-posts__loadmore").on("click", function (e) {
      e.preventDefault();
      if (loading) return;

      loading = true;
      var button = $(this);
      button.addClass("loading");

      $.ajax({
        type: "POST",
        url: loadmore_params.ajax_url,
        data: {
          action: "load_more_posts",
          page: page
        },
        success: function (res) {
          if (res.success && res.data.trim() !== "") {
            page++;
            checkIfMorePosts(page, button, function () {
              $("#pxl-content-main").append(res.data);
              loading = false;
              button.removeClass("loading");
            });
          }
        }
      });
    });

    $(".pxl-banner-box__style-3, .pxl-banner-box__style-4, .pxl-banner-box__style-5").each(
      function () {
        let $box = $(this);
        let $items = $box.find(".pxl-banner-box__feature-item");
        let index = 0;

        if ($items.length === 0) return;

        $items.removeClass("active").first().addClass("active");

        let limit = $items.length;
        if ($box.hasClass("pxl-banner-box__style-5")) {
          limit = $items.length + 1;
        }

        setInterval(function () {
          $items.removeClass("active");
          if (index < $items.length) {
            $items.eq(index).addClass("active");
          }
          index = (index + 1) % limit;
        }, 2000);
      }
    );

    /* Login */
    $(".pxl-modal-close").on("click", function () {
      $(this).parent().removeClass("open").addClass("remove");
      $(this).parents("body").removeClass("ov-hidden");
    });
    $(".btn-sign-up").on("click", function () {
      $(".pxl-user-register").addClass("u-open").removeClass("u-close");
      $(".pxl-user-login").addClass("u-close").removeClass("u-open");
    });
    $(".btn-sign-in").on("click", function () {
      $(".pxl-user-register").addClass("u-close").removeClass("u-open");
      $(".pxl-user-login").addClass("u-open").removeClass("u-close");
    });
    $(".pxl-user-have-an-account").on("click", function () {
      $(this)
        .parents(".pxl-modal-content")
        .find(".pxl-user-register")
        .addClass("u-close")
        .removeClass("u-open");
      $(this)
        .parents(".pxl-modal-content")
        .find(".pxl-user-login")
        .addClass("u-open")
        .removeClass("u-close");
    });
    $(".btn-user").on("click", function (e) {
      const href = $(this).attr("href");

      if (!href || href !== "#") {
        $(".pxl-user-popup").addClass("open").removeClass("remove");
        $(this).find(".pxl-user-account").toggleClass("active");
      }
    });

    // End typewriter

    /* Start Menu Mobile */
    $(".pxl-header-menu li.menu-item-has-children").append('<span class="pxl-menu-toggle"></span>');
    $(".pxl-menu-toggle").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).closest("ul").find(".pxl-menu-toggle.active").toggleClass("active");
        $(this).closest("ul").find(".sub-menu.active").toggleClass("active").slideToggle();
      } else {
        $(this).closest("ul").find(".pxl-menu-toggle.active").toggleClass("active");
        $(this).closest("ul").find(".sub-menu.active").toggleClass("active").slideToggle();
        $(this).toggleClass("active");
        $(this).parent().find("> .sub-menu").toggleClass("active");
        $(this).parent().find("> .sub-menu").slideToggle();
      }
    });

    $(".pxl-nav").each(function () {
      $(this).closest(".e-con-inner").find(".pxl-swiper__nav").hide();
      $(this)
        .closest(".e-con-inner")
        .find(".pxl-nav__item")
        .on("click", function () {
          if ($(this).hasClass("pxl-nav__prev")) {
            $(this).closest(".e-con-inner").find(".pxl-swiper__nav-prev").trigger("click");
          }
          if ($(this).hasClass("pxl-nav__next")) {
            $(this).closest(".e-con-inner").find(".pxl-swiper__nav-next").trigger("click");
          }
        });
    });

    $("#pxl-nav-mobile, .pxl-anchor-mobile-menu").on("click", function () {
      $(this).toggleClass("active");
      $("body").toggleClass("body-overflow");
      $(".pxl-header-menu").toggleClass("active");
    });

    $(
      ".pxl-menu-close, .pxl-header-menu-backdrop, #pxl-header-mobile .pxl-menu__primary a.is-one-page"
    ).on("click", function () {
      $(this).parents(".pxl-header-main").find(".pxl-header-menu").removeClass("active");
      $("#pxl-nav-mobile").removeClass("active");
      $("body").toggleClass("body-overflow");
    });
    /* End Menu Mobile */

    /* Menu Vertical */
    $(".pxl-nav-vertical li.menu-item-has-children > a").append(
      '<span class="pxl-arrow-toggle"><i class="caseicon-right-arrow"></i></span>'
    );
    $(".pxl-nav-vertical li.menu-item-has-children > a").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).next().toggleClass("active").slideToggle();
      } else {
        $(this).closest("ul").find(".sub-menu.active").toggleClass("active").slideToggle();
        $(this).closest("ul").find("a.active").toggleClass("active");
        $(this).find(".pxl-menu-toggle.active").toggleClass("active");
        $(this).toggleClass("active");
        $(this).next().toggleClass("active").slideToggle();
      }
    });

    /* Menu Hidden Sidebar Popup */
    $(".pxl-menu-hidden-sidebar li.menu-item-has-children > a").append(
      '<span class="pxl-arrow-toggle"><i class="caseicon-right-arrow"></i></span>'
    );
    $(".pxl-menu-hidden-sidebar li.menu-item-has-children > a").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).next().toggleClass("active").slideToggle();
      } else {
        $(this).closest("ul").find(".sub-menu.active").toggleClass("active").slideToggle();
        $(this).closest("ul").find("a.active").toggleClass("active");
        $(this).find(".pxl-menu-toggle.active").toggleClass("active");
        $(this).toggleClass("active");
        $(this).next().toggleClass("active").slideToggle();
      }
    });

    $(".pxl-menu-hidden-sidebar .pxl-menu-button").on("click", function () {
      $(this).parents(".pxl-menu-hidden-sidebar").toggleClass("active");
      $(this).parents(".pxl-menu-hidden-sidebar").removeClass("boxOut");
      $(this).parents("body").toggleClass("body-overflow");
    });
    $(".pxl-menu-popup-overlay").on("click", function () {
      $(this).parent().removeClass("active");
      $(this).parent().addClass("boxOut");
      $(this).parents("body").removeClass("body-overflow");
    });
    $(".pxl-menu-popup-close, .pxl-menu-hidden-sidebar .pxl-menu-hidden a.is-one-page").on(
      "click",
      function () {
        $(this).parents(".pxl-menu-hidden-sidebar").removeClass("active");
        $(this).parents(".pxl-menu-hidden-sidebar").addClass("boxOut");
        $(this).parents("body").removeClass("body-overflow");
      }
    );

    // Safari
    if (
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome") &&
      !navigator.userAgent.includes("Edg")
    ) {
      $(".pxl-blob__overlay").addClass("safari");
      $(".pxl-marquee--coin").addClass("safari");
      setTimeout(() => {
        $(".pxl-marquee--coin").addClass("safari");
      }, 1000);
    }
    

    /* Mega Menu Max Height */
    var m_h_mega = $("li.pxl-megamenu > .sub-menu > .pxl-mega-menu-elementor").outerHeight();
    var w_h_mega = $(window).height();
    var w_h_mega_css = w_h_mega - 120;
    if (m_h_mega > w_h_mega) {
      $("li.pxl-megamenu > .sub-menu > .pxl-mega-menu-elementor").css(
        "max-height",
        w_h_mega_css + "px"
      );
      $("li.pxl-megamenu > .sub-menu > .pxl-mega-menu-elementor").css("overflow-x", "scroll");
    }
    /* End Mega Menu Max Height */

    // Back to top
    let isScrollingToTop = false;

    $(document).on("click", ".pxl-scroll-top", function () {
      if($('html').hasClass('html-smooth-scroll')){
        setTimeout(() => {
          $("html").css("scroll-behavior", "smooth");
          isScrollingToTop = true;
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1000);
      }

      return false;
    });

    window.addEventListener("scroll", function () {
      if (isScrollingToTop && window.scrollY === 0) {
        $("html").css("scroll-behavior", "auto");
        isScrollingToTop = false;
      }
    });

    /* Animate Time Delay */
    $(".pxl-grid__masonry").each(function () {
      var eltime = 80;
      var elt_inner = $(this).children().length;
      var _elt = elt_inner - 1;
      $(this)
        .find("> .pxl-grid__item > .wow")
        .each(function (index, obj) {
          $(this).css("animation-delay", eltime + "ms");
          if (_elt === index) {
            eltime = 80;
            _elt = _elt + elt_inner;
          } else {
            eltime = eltime + 80;
          }
        });
    });

    $(".btn-text-nina").each(function () {
      var eltime = 0.045;
      var elt_inner = $(this).children().length;
      var _elt = elt_inner - 1;
      $(this)
        .find("> .pxl--btn-text > span")
        .each(function (index, obj) {
          $(this).css("transition-delay", eltime + "s");
          eltime = eltime + 0.045;
        });
    });

    $(".btn-text-nanuk").each(function () {
      var eltime = 0.05;
      var elt_inner = $(this).children().length;
      var _elt = elt_inner - 1;
      $(this)
        .find("> .pxl--btn-text > span")
        .each(function (index, obj) {
          $(this).css("animation-delay", eltime + "s");
          eltime = eltime + 0.05;
        });
    });

    $(".btn-text-smoke").each(function () {
      var eltime = 0.05;
      var elt_inner = $(this).children().length;
      var _elt = elt_inner - 1;
      $(this)
        .find("> .pxl--btn-text > span > span > span")
        .each(function (index, obj) {
          $(this).css("--d", eltime + "s");
          eltime = eltime + 0.05;
        });
    });

    $(".btn-text-reverse .pxl-text--front, .btn-text-reverse .pxl-text--back").each(function () {
      var eltime = 0.05;
      var elt_inner = $(this).children().length;
      var _elt = elt_inner - 1;
      $(this)
        .find(".pxl-text--inner > span")
        .each(function (index, obj) {
          $(this).css("transition-delay", eltime + "s");
          eltime = eltime + 0.05;
        });
    });

    /* End Animate Time Delay */

    /* Lightbox Popup */
    setTimeout(function () {
      $(".pxl-video__popup").magnificPopup({
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
      });
    }, 300);

    $(".pxl-gallery-lightbox").each(function () {
      $(this).magnificPopup({
        delegate: "a.lightbox",
        type: "image",
        gallery: {
          enabled: true
        },
        mainClass: "mfp-fade"
      });
    });

    /* Start Icon Bounce */
    var boxEls = $(".el-bounce, .pxl-image-effect1, .el-effect-zigzag");
    $.each(boxEls, function (boxIndex, boxEl) {
      loopToggleClass(boxEl, "active");
    });

    function loopToggleClass(el, toggleClass) {
      el = $(el);
      let counter = 0;
      if (el.hasClass(toggleClass)) {
        waitFor(
          function () {
            counter++;
            return counter == 2;
          },
          function () {
            counter = 0;
            el.removeClass(toggleClass);
            loopToggleClass(el, toggleClass);
          },
          "Deactivate",
          1000
        );
      } else {
        waitFor(
          function () {
            counter++;
            return counter == 3;
          },
          function () {
            counter = 0;
            el.addClass(toggleClass);
            loopToggleClass(el, toggleClass);
          },
          "Activate",
          1000
        );
      }
    }

    function waitFor(condition, callback, message, time) {
      if (message == null || message == "" || typeof message == "undefined") {
        message = "Timeout";
      }
      if (time == null || time == "" || typeof time == "undefined") {
        time = 100;
      }
      var cond = condition();
      if (cond) {
        callback();
      } else {
        setTimeout(function () {
          waitFor(condition, callback, message, time);
        }, time);
      }
    }
    /* End Icon Bounce */

    /* Image Effect */
    if ($(".pxl-image__tilt").length) {
      $(".pxl-image__tilt").parents(".e-con-inner").addClass("pxl-image__tilt-active");
      $(".pxl-image__tilt").each(function () {
        var pxl_maxtilt = $(this).data("maxtilt"),
          pxl_speedtilt = $(this).data("speedtilt"),
          pxl_perspectivetilt = $(this).data("perspectivetilt");
        VanillaTilt.init(this, {
          max: pxl_maxtilt,
          speed: pxl_speedtilt,
          perspective: pxl_perspectivetilt
        });
      });
    }

    $(".pxl-image__3d-ui").each(function () {
      const img = $(this).find("img")[0];
      const $item = $(this).find(".pxl-image__item");

      const rotateX_from = $item.data("rotatex_from") || 0;
      const rotateY_from = $item.data("rotatey_from") || 0;
      const rotateX_to = $item.data("rotatex_to") || 0;
      const rotateY_to = $item.data("rotatey_to") || 0;

      gsap.set(img, {
        rotateX: rotateX_from,
        rotateY: rotateY_from,
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "transform 0.3s ease"
      });
      gsap.to(img, {
        scrollTrigger: {
          trigger: this,
          start: "top 90%",
          end: "top 40%",
          scrub: 0.3
        }
      });
      gsap.to(img, {
        rotateX: rotateX_to,
        rotateY: rotateY_to,
        scrollTrigger: {
          trigger: this,
          start: "top bottom",
          end: "center center",
          scrub: 0
        }
      });
    });

    $(".pxl-variant").each(function () {
      const $item = $(this).find(".pxl-variant__item");

      gsap.to($item, {
        scrollTrigger: {
          trigger: this,
          start: "top bottom",
          end: "center center",
          scrub: 0,
          onEnter: () => {
            $(this).addClass("active");
          },
          onEnterBack: () => {
            $(this).addClass("active");
          },
          onLeave: () => {},
          onLeaveBack: () => {
            $(this).removeClass("active");
          }
        }
      });
    });

    $(".add-active").each(function () {
      const $item = $(this);
      gsap.to($item, {
        scrollTrigger: {
          trigger: this,
          start: "top bottom",
          end: "center center",
          scrub: 0,
          onEnter: () => {
            $item.addClass("active");
          },
          onEnterBack: () => {
            $item.addClass("active");
          },
          onLeave: () => {},
          onLeaveBack: () => {
            $item.removeClass("active");
          }
        }
      });
    });
  // Menu Sticky
    $(".pxl-link__menu-sticky").each(function () {
      const $this = $(this);
      const $navLinks = $this.find(".pxl-link__item a");

      $(window).on("scroll", function () {
        const scrollTop = $(window).scrollTop();
        let currentSection = null;

        $navLinks.each(function () {
          const $link = $(this);
          const targetId = $link.attr("href");
          const offset = parseInt($link.parent().data("onepage-offset")) || 0;

          if (targetId.startsWith("#") && $(targetId).length) {
            const sectionTop = $(targetId).offset().top;

            if (scrollTop + offset >= sectionTop) {
              currentSection = $link.parent();
            }
          }
        });

        if (currentSection) {
          $navLinks.parent().removeClass("active");
          currentSection.addClass("active");
        }
      });

      $(window).trigger("scroll");
    });
  

    $("a:not(.tabs a, .is-one-page)").on("click", function () {
      if ($("html").hasClass("html-smooth-scroll")) {
        setTimeout(() => {
          $("html").css("scroll-behavior", "auto");
        }, 800);
        $("html").css("scroll-behavior", "smooth");
      }
    });

    /* Select*/
    $(".wpcf7-form .wpcf7-select").each(function () {
      var $this = $(this),
        numberOfOptions = $this.children("option").length;

      if ($this.hasClass("pxl-select-hidden")) {
        return;
      }

      $this.addClass("pxl-select-hidden");
      $this.wrap('<div class="pxl-select"></div>');
      $this.after('<div class="pxl-select-higthlight"></div>');

      var $styledSelect = $this.next("div.pxl-select-higthlight");
      $styledSelect.text($this.children("option").eq(0).text());

      var $list = $("<ul />", {
        class: "pxl-select-options"
      }).insertAfter($styledSelect);

      for (var i = 0; i < numberOfOptions; i++) {
        $("<li />", {
          text: $this.children("option").eq(i).text(),
          rel: $this.children("option").eq(i).val()
        }).appendTo($list);
      }

      var $listItems = $list.children("li");

      $styledSelect.on("click", function (e) {
        e.stopPropagation();
        $("div.pxl-select-higthlight.active")
          .not(this)
          .each(function () {
            $(this)
              .removeClass("active")
              .next("ul.pxl-select-options")
              .addClass("pxl-select-lists-hide");
          });
        $(this).toggleClass("active");
      });

      $listItems.on("click", function (e) {
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass("active");
        $this.val($(this).attr("rel"));
      });

      $(document).on("click", function () {
        $styledSelect.removeClass("active");
      });
    });

    /* Nice Select */
    $(
      ".woocommerce-ordering .orderby, #pxl-sidebar-area select, .variations_form.cart .variations select, .pxl-open-table select, .pxl-nice-select"
    ).each(function () {
      $(this).niceSelect();
    });
    $(".nice-select").each(function () {
      var $select = $(this);

      var $current = $select.find("span.current");
      if ($current.length && /\(\d+$/.test($current.text())) {
        $current.text($current.text() + ")");
      }

      $select.find("li.option").each(function () {
        var $option = $(this);
        if (/\(\d+$/.test($option.text())) {
          $option.text($option.text() + ")");
        }
      });
    });
    // Overlay
    $(".pxl-overlay").on("click", function () {
      $(".pxl-overlay").removeClass("active");
      $(".pxl-filter__form").removeClass("active");
    });
    /* Scroll to content */
    $(".pxl-link-to-section .btn").on("click", function (e) {
      var id_scroll = $(this).attr("href");
      var offsetScroll = $(".pxl-header-elementor-sticky").outerHeight();
      e.preventDefault();
      $("html, body").animate({ scrollTop: $(id_scroll).offset().top - offsetScroll }, 600);
    });

    // Hover Overlay Effect
    $(".pxl-overlay-shake").on("mousemove", function (event) {
      var $this = $(this);
      var offset = $this.offset();
      var x = event.pageX - offset.left;
      var y = event.pageY - offset.top;

      $this.find(".pxl-overlay--color").css({
        transform: `translate(${x}px, ${y}px)`
      });
    });

    /* Item Hover Active */
    $(".pxl-hover-item").on("mouseenter", function () {
      $(this).closest(".pxl-hover-wrap").find(".pxl-hover-item").removeClass("pxl-active");
      $(this).addClass("pxl-active");
    });

    // Active Mega Menu Hover
    $("li.pxl-megamenu").on("mouseenter", function () {
      $(this).closest(".elementor-container").addClass("section-mega-active");
    });

    $("li.pxl-megamenu").on("mouseleave", function () {
      $(this).closest(".elementor-container").removeClass("section-mega-active");
    });
  });

  /* Header Sticky */
  function brighthub_header_sticky() {
    if ($("#pxl-header-elementor").hasClass("is-sticky")) {
      if (pxl_scroll_top > 100) {
        $(".pxl-header-elementor-sticky.pxl-sticky-stb").addClass("pxl-header-fixed");
        $("#pxl-header-mobile").addClass("pxl-header-mobile-fixed");
      } else {
        $(".pxl-header-elementor-sticky.pxl-sticky-stb").removeClass("pxl-header-fixed");
        $("#pxl-header-mobile").removeClass("pxl-header-mobile-fixed");
      }

      if (pxl_scroll_status == "up" && pxl_scroll_top > 100) {
        $(".pxl-header-elementor-sticky.pxl-sticky-stt").addClass("pxl-header-fixed");
      } else {
        $(".pxl-header-elementor-sticky.pxl-sticky-stt").removeClass("pxl-header-fixed");
      }
    }

    $(".pxl-header-elementor-sticky").parents("body").addClass("pxl-header-sticky");
  }

  /* Header Left Scroll */
  function brighthub_header_left_scroll() {
    if ($(".px-header--left_sidebar").hasClass("px-header-sidebar-style2")) {
      var h_section_top = $(".h5-section-top").outerHeight() + 50;
      console.log(h_section_top);
      if (pxl_scroll_top > h_section_top) {
        $(".px-header--left_sidebar").addClass("px-header--left_shadow");
      } else {
        $(".px-header--left_sidebar").removeClass("px-header--left_shadow");
      }
    }
  }

  /* Header Mobile */
  function brighthub_header_mobile() {
    var h_header_mobile = $("#pxl-header-elementor").outerHeight();
    if (pxl_window_width < 1199) {
      $("#pxl-header-elementor").css("min-height", h_header_mobile + "px");
    }
  }

  /* Scroll To Top */
  function brighthub_scroll_to_top() {
    if (pxl_scroll_top < pxl_window_height) {
      $(".pxl-scroll-top").addClass("pxl-off").removeClass("pxl-on");
    }
    if (pxl_scroll_top > pxl_window_height) {
      $(".pxl-scroll-top").addClass("pxl-on").removeClass("pxl-off");
    }
  }

  /* Footer Fixed */
  function brighthub_footer_fixed() {
    setTimeout(function () {
      var h_footer = $(".pxl-footer-fixed #pxl-footer-elementor").outerHeight() - 1;
      $(".pxl-footer-fixed #pxl-main").css("margin-bottom", h_footer + "px");
    }, 600);
  }

  /* Menu Responsive Dropdown */
  function brighthub_submenu_responsive() {
    var $brighthub_menu = $(".pxl-header-elementor-main, .pxl-header-elementor-sticky");
    $brighthub_menu.find(".pxl-menu__primary li").each(function () {
      var $brighthub_submenu = $(this).find("> ul.sub-menu");
      if ($brighthub_submenu.length == 1) {
        if ($brighthub_submenu.offset().left + $brighthub_submenu.width() + 0 > $(window).width()) {
          $brighthub_submenu.addClass("pxl-sub-reverse");
        }
      }
    });
  }

  // Menu Divider Move
  function brighthub_menu_divider_move() {
    $('.pxl-menu.divider-move').each(function () {
        var current = $(this).find('.pxl-menu__primary > .current-menu-item, .pxl-menu__primary > .current-menu-parent, .pxl-menu__primary > .current-menu-ancestor');
        if(current.length > 0) {
            var marker = $(this).find('.pxl-menu__divider');
            marker.css({
                left: current.position().left,
                width: current.outerWidth(),
                display: "block"
            });
            marker.addClass('active');
            current.addClass('pxl-shape-active');
            if (Modernizr.csstransitions) {
                $(this).find('.pxl-menu__primary > li').mouseover(function () {
                    var self = $(this),
                    offsetLeft = self.position().left,
                    width = self.outerWidth() || current.outerWidth(),
                    left = offsetLeft == 0 ? 0 : offsetLeft || current.position().left;
                    marker.css({
                        left: left,
                        width: width,
                    });
                    marker.addClass('active');
                    current.removeClass('pxl-shape-active');
                });
                $(this).find('.pxl-menu__primary').mouseleave(function () {
                    marker.css({
                        left: current.position().left,
                        width: current.outerWidth()
                    });
                    current.addClass('pxl-shape-active');
                });
            }
        } else {
            var marker = $(this).find('.pxl-menu__divider');
            var current = $(this).find('.pxl-menu__primary > li:nth-child(1)');
            marker.css({
                left: current.position().left,
                width: current.outerWidth(),
                display: "block"
            });
            if (Modernizr.csstransitions) {
                $(this).find('.pxl-menu__primary > li').mouseover(function () {
                    var self = $(this),
                    offsetLeft = self.position().left,
                    width = self.outerWidth() || current.outerWidth(),
                    left = offsetLeft == 0 ? 0 : offsetLeft || current.position().left;
                    marker.css({
                        left: left,
                        width: width,
                    });
                    marker.addClass('active');
                });
                $(this).find('.pxl-menu__primary').mouseleave(function () {
                    marker.css({
                        left: current.position().left,
                        width: current.outerWidth()
                    });
                    marker.removeClass('active');
                });
            }
        }
    });
  }

  // Panel Anchor Toggle
  function brighthub_panel_anchor_toggle() {
    "use strict";
    $(document).on("click", ".pxl-anchor-button", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var target = $(this).attr("data-target");
      $(target).toggleClass("active");
      $("body").addClass("body-overflow");
      if ($(target).find(".pxl-search-form").length > 0) {
        setTimeout(function () {
          $(target).find(".pxl-search-form .pxl-search-field").focus();
        }, 1000);
      }
    });

    $(".pxl-anchor-button").each(function () {
      var t_target = $(this).attr("data-target");
      var t_delay = $(this).attr("data-delay-hover");
      $(t_target)
        .find(".pxl-popup__content")
        .css("transition-delay", t_delay + "ms");
      $(t_target)
        .find(".pxl-popup__overlay")
        .css("transition-delay", t_delay + "ms");
    });

    $(document).on("click", ".pxl-popup__overlay, .pxl-popup__close", function () {
      $("body").removeClass("body-overflow");
      $(this).parents(".pxl-popup").removeClass("active");
    });

    $(".pxl-button.btn__popup").on("click", function () {
      $("body").addClass("body-overflow");
      $(this).closest(".pxl-wapper").find(".pxl-popup--page").addClass("active");
    });

    $(document).on("click", ".pxl-popup--close, .pxl-popup__overlay, .pxl-popup__close", function () {
        $("body").removeClass("body-overflow");
        $(this).closest(".pxl-popup--page").removeClass("active");
    });
  }

  /* Post Grid */
  function brighthub_post_grid() {
    setTimeout(function () {
      $(".pxl-swiper-slider__item-inner").each(function () {
        var item_w = $(this).outerWidth();
        var item_h = $(this).outerHeight();
        $(this)
          .find(".pxl-item--imgfilter")
          .css("width", item_w + "px");
        $(this)
          .find(".pxl-item--imgfilter")
          .css("height", item_h + "px");
      });
    }, 300);
  }

  /* Page Title Scroll Opacity */
  function brighthub_ptitle_scroll_opacity() {
    var divs = $("#pxl-ptit-elementor.pxl-scroll-opacity .elementor-widget"),
      limit = $("#pxl-ptit-elementor.pxl-scroll-opacity").outerHeight();
    if (pxl_scroll_top <= limit) {
      divs.css({ opacity: 1 - pxl_scroll_top / limit });
    }
  }

  /* Preloader Default */
  $.fn.extend({
    jQueryImagesLoaded: function () {
      var $imgs = this.find('img[src!=""]');

      if (!$imgs.length) {
        return $.Deferred().resolve().promise();
      }

      var dfds = [];

      $imgs.each(function () {
        var dfd = $.Deferred();
        dfds.push(dfd);
        var img = new Image();
        img.onload = function () {
          dfd.resolve();
        };
        img.onerror = function () {
          dfd.resolve();
        };
        img.src = this.src;
      });

      return $.when.apply($, dfds);
    }
  });

  /* Button Parallax */
  function brighthub_el_parallax() {
    $(".btn-text-parallax").on("mouseenter", function () {
      $(this).addClass("hovered");
    });
    $(".btn-text-parallax").on("mouseleave", function () {
      $(this).removeClass("hovered");
    });
    $(".btn-text-parallax").on("mousemove", function (e) {
      const bounds = this.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height;
      const deltaX = Math.floor(centerX - e.clientX) * 0.172;
      const deltaY = Math.floor(centerY - e.clientY) * 0.273;
      $(this)
        .find(".pxl--btn-text")
        .css({
          transform: "translate3d(" + deltaX * 0.32 + "px, " + deltaY * 0.32 + "px, 0px)"
        });
      $(this).css({
        transform: "translate3d(" + deltaX * 0.25 + "px, " + deltaY * 0.25 + "px, 0px)"
      });
    });

    $(".el-parallax-wrap").each(function () {
      $(this).on("mouseenter", function () {
        $(this).addClass("hovered");
      });

      $(this).on("mouseleave", function () {
        $(this).removeClass("hovered");
      });

      $(this).on("mousemove", function (e) {
        const bounds = this.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height;
        const deltaX = Math.floor(centerX - e.clientX) * 0.222;
        const deltaY = Math.floor(centerY - e.clientY) * 0.333;
        $(this)
          .find(".el-parallax-item")
          .css({
            transform: "translate3d(" + deltaX * 0.32 + "px, " + deltaY * 0.32 + "px, 0px)"
          });
      });
    });

    $(".pxl-hover-parallax").on("mousemove", function (e) {
      const bounds = this.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height;
      const deltaX = Math.floor(centerX - e.clientX) * 0.222;
      const deltaY = Math.floor(centerY - e.clientY) * 0.333;
      $(this)
        .find(".pxl-item-parallax")
        .css({
          transform: "translate3d(" + deltaX * 0.32 + "px, " + deltaY * 0.32 + "px, 0px)"
        });
    });
  }

  /* Back To Top Progress Bar */
  function brighthub_backtotop_progess_bar() {
    const $scrollTop = $(".pxl-scroll-top");

    if ($scrollTop.length > 0) {
      const progressPath = document.querySelector(".pxl-scroll-progress-circle path");
      const pathLength = progressPath.getTotalLength();

      progressPath.style.transition = "none";
      progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
      progressPath.style.strokeDashoffset = pathLength;
      progressPath.getBoundingClientRect();
      progressPath.style.transition = "stroke-dashoffset 10ms linear";

      const updateProgress = () => {
        const scroll = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = pathLength - (scroll * pathLength) / height;
        progressPath.style.strokeDashoffset = progress;
      };

      const toggleVisibility = () => {
        const offset = 50;
        if (window.scrollY > offset) {
          $scrollTop.addClass("active-progress");
        } else {
          $scrollTop.removeClass("active-progress");
        }
      };

      $(window).on("scroll", () => {
        updateProgress();
        toggleVisibility();
      });

      updateProgress();
      toggleVisibility();
    }
  }

  // Zoom Point
  function brighthub_zoom_point() {
    $(".pxl-zoom-point").each(function () {
      let scaleOffset = $(this).data("offset");
      let scaleAmount = $(this).data("scale-mount");

      function scrollZoom() {
        const images = document.querySelectorAll("[data-scroll-zoom]");
        let scrollPosY = 0;
        scaleAmount = scaleAmount / 100;

        const observerConfig = {
          rootMargin: "0% 0% 0% 0%",
          threshold: 0
        };

        images.forEach((image) => {
          let isVisible = false;
          const observer = new IntersectionObserver((elements, self) => {
            elements.forEach((element) => {
              isVisible = element.isIntersecting;
            });
          }, observerConfig);

          observer.observe(image);

          image.style.transform = `scale(${1 + scaleAmount * percentageSeen(image)})`;

          window.addEventListener("scroll", () => {
            if (isVisible) {
              scrollPosY = window.pageYOffset;
              image.style.transform = `scale(${1 + scaleAmount * percentageSeen(image)})`;
            }
          });
        });

        function percentageSeen(element) {
          const parent = element.parentNode;
          const viewportHeight = window.innerHeight;
          const scrollY = window.scrollY;
          const elPosY = parent.getBoundingClientRect().top + scrollY + scaleOffset;
          const borderHeight =
            parseFloat(getComputedStyle(parent).getPropertyValue("border-bottom-width")) +
            parseFloat(getComputedStyle(element).getPropertyValue("border-top-width"));
          const elHeight = parent.offsetHeight + borderHeight;

          if (elPosY > scrollY + viewportHeight) {
            return 0;
          } else if (elPosY + elHeight < scrollY) {
            return 100;
          } else {
            const distance = scrollY + viewportHeight - elPosY;
            let percentage = distance / ((viewportHeight + elHeight) / 100);
            percentage = Math.round(percentage);

            return percentage;
          }
        }
      }

      scrollZoom();
    });
  }

  // Zoom Point
  function brighthub_smother_scroll() {
    if ($("body").hasClass("body-smooth-scroll")) {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      const smoother = ScrollSmoother.create({
        smooth: 1,
        effects: true,
        smoothTouch: 0.1
      });
    }
  }

  function checkVisibleItemsForMarquee($container) {
    const visibleCount = parseInt($container.data("show")) || 3;
    const $items = $container.find(".pxl-marquee__item");
    const containerRect = $container[0].getBoundingClientRect();
    const centerX = (containerRect.left + containerRect.right) / 2;

    let visibleItems = [];

    $items.each(function () {
      const $el = $(this);
      const rect = this.getBoundingClientRect();
      const itemCenter = (rect.left + rect.right) / 2;
      let distance = Math.abs(itemCenter - centerX);

      if (rect.right < containerRect.left) {
        distance -= rect.width * 0.5;
      }

      if (rect.right > containerRect.left && rect.left < containerRect.right) {
        visibleItems.push({ el: $el, distance });
      }
    });

    visibleItems.sort((a, b) => a.distance - b.distance);

    $items.removeClass("active");
    visibleItems.slice(0, visibleCount).forEach((item) => item.el.addClass("active"));
  }

  function updateAllMarquees() {
    $(".pxl-marquee__style-2").each(function () {
      checkVisibleItemsForMarquee($(this));
    });
  }

  function checkIfMorePosts(nextPage, button, callback) {
    $.ajax({
      type: "POST",
      url: loadmore_params.ajax_url,
      data: {
        action: "check_more_posts",
        page: nextPage
      },
      success: function (res) {
        if (!res.success) {
          $(".pxl-posts").css("padding-bottom", "0");
          button.remove();
        }
        if (callback) callback();
      },
      error: function (error) {
        console.log(error);
      }
    });
  }
})(jQuery);
