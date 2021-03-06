// Require libraries

// Vars
const stickyNav = $('#header');
const rootStyle = getComputedStyle(document.body);

// Initialisation
$(window).on('load', function() {
  $('[data-toggle="popover"]').popover();
  $('[data-toggle="tooltip"]').tooltip();
  tabsItemsToDropdown();
});

// Re-initialisation au resize
$(window).on('resize orientationchange', function() {
  //console.log('resize');
  tabsItemsToDropdown();
});

$(window).on('scroll', function() {
  //console.log('scroll');
});

$('[data-toggle=burger]').on('click tap', function(e) {
  e.preventDefault();
  stickyNav.data('top', stickyNav.offset().top);
  stickyNav.toggleClass('is-opened');
}).on('keypress', function(e) {
  if ( e.which == 13 ) {
    e.preventDefault();
    stickyNav.data('top', stickyNav.offset().top);
    stickyNav.toggleClass('is-opened');
 }
});

$('.input-group .form-control').on('focus', function(e) {
  e.preventDefault();
  $(this).parent('.input-group').toggleClass('has-focus');
}).on('blur', function(e) {
  e.preventDefault();
  $(this).parent('.input-group').toggleClass('has-focus');
});

$('body').on('keydown input', 'textarea[data-expandable]', function() {
  this.style.removeProperty('height');
  this.style.height = (this.scrollHeight+2) + 'px';
}).on('mousedown focus', 'textarea[data-expandable]', function() {
  this.style.removeProperty('height');
  this.style.height = (this.scrollHeight+2) + 'px';
});

$('[data-target-conseil]').on('focus', function(e) {
  e.preventDefault();
  let thisTarget = $(this).data('target-conseil');
  $(thisTarget).toggleClass('is-openable');
}).on('blur', function(e) {
  e.preventDefault();
  let thisTarget = $(this).data('target-conseil');
  $(thisTarget).toggleClass('is-openable');
});


function tabsItemsToDropdown() {
  if ($('.s-tabs-01__nav').length) {
    let sTabs01NavItemDropdown = $('.s-tabs-01__nav .nav-item-dropdown');
    let sTabs01NavItemsWidth = Math.round(sTabs01NavItemDropdown.outerWidth(true));
    let sTabs01NavWidth = ($('.s-tabs-01__nav').outerWidth(true));

    $('.s-tabs-01__nav .nav-item').each(function() {
      sTabs01NavItemsWidth += Math.round($(this).outerWidth(true));
    });

    if (sTabs01NavItemsWidth >= sTabs01NavWidth) {
      $('.s-tabs-01__nav .nav-item .nav-link').last().clone().removeClass('nav-link').prependTo('.s-tabs-01__nav .dropdown-menu');
      $('.s-tabs-01__nav .nav-item').last().remove();
      sTabs01NavItemDropdown.css('visibility', 'visible');
      tabsItemsToDropdown();
    }
  }
}
