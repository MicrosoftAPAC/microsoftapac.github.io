$(function () {
    // masonry
    var grid = $('.grid');
    grid.css('opacity', 0);         // make invisible as to not see raw positioning
    grid.masonry({              // apply masonry on items
        columnWidth: '.grid-sizer',
        itemSelector: '.grid-item',
        percentPosition: true,
        horizontalOrder: true
    });
    grid.css('opacity', 1);
    grid.imagesLoaded().progress( function() {
        grid.masonry('layout');
    });
});
