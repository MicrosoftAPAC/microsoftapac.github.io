---
---
var customSearch = (function ($) {
    var mod = [];

    mod.handleFilterChange = function(){
        window.location = "{{ site.baseurl }}/#SearchPhraseText=" + $("#SearchPhraseText").val()
        return false;
    }

    $(document).ready(function() {
        $('#container').packery();

        if (window.interactions) {
            window.interactions.setup();
        }
    });

    return mod;
}(jQuery));