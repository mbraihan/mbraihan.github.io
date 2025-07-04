---
layout: post
title: a post with advanced image components
date: 2024-01-27 11:46:00
description: this is what advanced image components could look like
tags: formatting images
categories: sample-posts
thumbnail: assets/img/9.jpg
images:
  compare: true
  slider: true
  spotlight: true
---

This is an example post with advanced image components.

## Image Slider

This is a simple image slider. It uses the [Swiper](https://swiperjs.com/) library. Check the [examples page](https://swiperjs.com/demos) for more information of what you can achieve with it.

<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/9.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/7.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/8.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/10.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/12.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>

<!-- This is a demo image, let's see what happens. ![Japan Sunset](https://res.cloudinary.com/dqkxtivbq/image/upload/v1751596636/With_Ball_w3fhia.gif) -->

<!-- ## [Spotlight JS](https://nextapps-de.github.io/spotlight/) -->

<!-- Group 1 -->
<!-- <div class="spotlight-group">
    <a class="spotlight" href="https://res.cloudinary.com/dqkxtivbq/image/upload/v1751596636/With_Ball_w3fhia.gif">
        <img src="https://res.cloudinary.com/dqkxtivbq/image/upload/v1751596636/With_Ball_w3fhia.gif" />
    </a>
    <a class="spotlight" href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg">
        <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg" />
    </a>
    <a class="spotlight" href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg">
        <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-200.jpg" />
    </a>
</div> -->

<!-- What a magical trip! Here's a collection of my favorite shots. -->

<!-- 🌄 PhotoSwipe Gallery Start -->
<!-- <div class="pswp-gallery" id="japan-gallery">

<a href="https://res.cloudinary.com/dqkxtivbq/image/upload/v1751596332/GI_24_uhr206.png"
   data-pswp-width="1600" data-pswp-height="1067"
   data-pswp-caption="Sakura blooming near Mount Fuji" target="_blank">
  <img src="https://res.cloudinary.com/dqkxtivbq/image/upload/v1751596332/GI_24_uhr206.png"
       alt="Sakura and Mount Fuji" style="width: 100%; max-width: 300px; border-radius: 8px;" />
</a>

<a href="https://res.cloudinary.com/dqkxtivbq/image/upload/v1751596332/GI_24_uhr206.png"
   data-pswp-width="1600" data-pswp-height="1067"
   data-pswp-caption="Kyoto street at dusk" target="_blank">
  <img src="https://res.cloudinary.com/dqkxtivbq/image/upload/v1751596332/GI_24_uhr206.png"
       alt="Kyoto at dusk" style="width: 100%; max-width: 300px; border-radius: 8px;" />
</a>

</div> -->
<!-- 📸 PhotoSwipe Gallery End -->

## Image Comparison Slider

This is a simple image comparison slider. It uses the [img-comparison-slider](https://img-comparison-slider.sneas.io/) library. Check the [examples page](https://img-comparison-slider.sneas.io/examples.html) for more information of what you can achieve with it.

<img-comparison-slider>
  {% include figure.liquid path="assets/img/prof_pic.jpg" class="img-fluid rounded z-depth-1" slot="first" %}
  {% include figure.liquid path="assets/img/prof_pic.png" class="img-fluid rounded z-depth-1" slot="second" %}
</img-comparison-slider>
