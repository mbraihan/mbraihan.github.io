---
layout: page
permalink: /publications/
title: Publications
description:
nav: true
nav_order: 1
---

<!-- _pages/publications.md -->

{% include bib_search.liquid %}

<div class="publications">
    <a href="https://scholar.google.com/citations?user=zDyfhn0AAAAJ"><b>Google Scholar Profile</b></a>
    <p></p>

    {% bibliography -f {{ site.scholar.bibliography }} %}

</div>
