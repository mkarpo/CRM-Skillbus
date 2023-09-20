// swiper
let swiperSlides = 4;
let swiperMargin = 30;
if (document.documentElement.clientWidth < 1300) { swiperSlides = 2; }
if (document.documentElement.clientWidth < 649.8) { swiperMargin = 15; }

const swiper = new Swiper('.swiper', {
  slidesPerView: swiperSlides,
  loop: true,
  spaceBetween: swiperMargin,

  navigation: {
    nextEl: '.swiper__btn-next',
    prevEl: '.swiper__btn-prev',
  },
});

// burger
let header = document.querySelector('.header');
let burger = document.querySelector('.header__burger');
burger.addEventListener('click', function () {
  header.classList.toggle('header--active');
  burger.classList.toggle('header__burger--active');
});

// search
let searchBtn = document.querySelector('.header__search-btn');
let searchInput = document.querySelector('.header__search-input');
searchBtn.addEventListener('click', function () {
  searchBtn.classList.toggle('header__search--active');
  searchInput.setAttribute("tabindex", "0");
});

// headerBroadcastMore
let headerBottom = document.querySelectorAll('.header__bottom');
let headerMore = document.querySelector('.header__more');
headerMore.addEventListener('click', function () {
  headerBottom.forEach(function (elem) {
    elem.classList.toggle('header__bottom--active');
  });
});

// select
const element = document.querySelector('#selectCustom');
const choices = new Choices(element, {
  searchEnabled: false,
  itemSelectText: "",
  shouldSort: false,
});
let choicesItem = document.querySelectorAll('.choices__item--choice');
choicesItem.forEach(function (elem) {
  elem.setAttribute("tabindex", "0");
})

// headerPlay
let headerPlay = document.querySelectorAll('.header__action-play');
headerPlay.forEach(function (elem) {
  elem.addEventListener("click", function () {
    elem.classList.toggle('header__action-play--active');
  });
});

// podcastPlay
let podcastPlay = document.querySelectorAll('.podcast__item-btn');
podcastPlay.forEach(function (elem) {
  elem.addEventListener('click', function () {
    elem.classList.toggle('podcast__item-btn--active');
  });
});

// podcastLike
let podcastLike = document.querySelectorAll('.podcast__like');
podcastLike.forEach(function (elem) {
  let likeCheck = 0;
  let likeAmount = elem.querySelector('.podcast__like-amount');
  elem.addEventListener('click', function () {
    elem.classList.toggle('podcast__like--active');
    if (likeCheck == 0) {
      likeAmount.innerHTML = likeAmount.innerHTML * 1 + 1;
      likeCheck++;
    } else {
      likeAmount.innerHTML = likeAmount.innerHTML * 1 - 1;
      likeCheck--;
    };
  });
});

// podcastLike
let podcastShare = document.querySelectorAll('.podcast__share');
podcastShare.forEach(function (elem) {
  let shareCheck = 0;
  let shareAmount = elem.querySelector('.podcast__share-amount');
  elem.addEventListener('click', function () {
    elem.classList.add('podcast__share--active');
    if (shareCheck == 0) {
      shareAmount.innerHTML = shareAmount.innerHTML * 1 + 1;
      shareCheck++;
    };
  });
});

// podcastMore
let podcastMore = document.querySelector('.podcast__btn');
let podcastItems = document.querySelectorAll('.podcast__wrap');
podcastMore.addEventListener('click', function () {
  podcastItems.forEach(function (elem) {
    elem.classList.add('podcast__item--open');
  });
  podcastMore.classList.add('podcast__btn--inactive');
});

// accordion
let accordionItem = document.querySelectorAll('.guests__accordion-item');
accordionItem.forEach(function (elem) {
  let n = 0;
  let accordionGuestBtn = elem.querySelectorAll('.guests__accordion-btn');
  let accordionBtn = elem.querySelector('.guests__accordion-up');
  accordionBtn.addEventListener('click', function () {
    elem.classList.toggle('guests__accordion-item--active');
    accordionGuestBtn.forEach(function (element) {
      if (n == 0) {
        element.setAttribute("tabindex", "0");
      } else {
        element.setAttribute("tabindex", "-1");
      }
    });
    n++;
    console.log(n);
  });
});

// accordion change guests
let accordionGuest = document.querySelectorAll(".guests__accordion-guest");
let guestBlock = document.querySelectorAll(".guests__card");
let noGuest = document.querySelector(".guests__card-wrap--no");

accordionGuest.forEach(function (elem) {
  elem.addEventListener("click", function (e) {
    const path = e.currentTarget.dataset.path;

    accordionGuest.forEach(function (btn) { btn.classList.remove("guests__accordion-guest--active") });
    e.currentTarget.classList.add("guests__accordion-guest--active");

    noGuest.classList.add('guest__card-no--inactive');

    guestBlock.forEach(function (elem) { elem.classList.remove("guests__card--active") });
    document.querySelector(`[data-target="${path}"]`).classList.add("guests__card--active");

  });
});
