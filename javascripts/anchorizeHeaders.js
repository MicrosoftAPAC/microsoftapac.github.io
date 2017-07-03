---
---
{% assign headerLinkClass = "header-link" %}
{% if site.use_fixed_header_links %}
{% assign headerLinkClass = headerLinkClass | append: " always-on" %}
{% endif %}
(function ($) {
    $(document).ready(function() {
        $(":header").filter('[id]').each(
            function(){
                $(this).html('<a href="#'+$(this).attr('id')+'" class="{{ headerLinkClass }}"><i class="fa fa-link" /></a>' + $(this).text())
            });
    });
}(jQuery));