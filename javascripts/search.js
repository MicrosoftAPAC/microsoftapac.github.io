---
---

var customFilter = (function($){
    var mod = [];
    var msnry = null;

    mod.applyFilter = function (filters, keywords, callback) {

        if (typeof(Storage) !== null && sessionStorage.posts) {
            // Obtaining Posts data from local cache
            processJson(filters, keywords, sessionStorage.posts, callback);
        } else {
            // Obtaining Posts data from server
            $.get("posts.json", function(data){
                sessionStorage.posts = data;
                processJson(filters, keywords, data, callback);
            }, "text");
        }

        return false;
    }

    var processJson = function(filters, keywords, data, callback){
        var $articles = $(".grid-item");
        var matchingArticles = [];

        $.each(JSON.parse(data), function(key, val){

            // Check if matches all the filters
            var filterMatch = true;
            $.each(filters, function(name, filter) {
                filterMatch = filterMatch && searchByFilter(val, filter); 
            })

            // Perform a keyword search
            var keywordSearch = searchByKeyword(val, keywords);

            if (filterMatch && keywordSearch) {
                matchingArticles.push(val.id);
            }

        });

        $articles.addClass("hide");
        $.each(matchingArticles, function(key, data){
            $(".grid-item#" + data).removeClass("hide");
        });

        // Force layout
        callback();

        var filterResult = matchingArticles.length > 0;
        if (filterResult) {
            $("#no-results").addClass("hide");
            $(".sort-by").removeClass("hide");
        } else {
            $("#no-results").removeClass("hide");
            $(".sort-by").addClass("hide");
        }
        return (filterResult);
    }

    mod.sortGrid = function(sortField) {
        if (sortField == "featured") {
            $(".grid").append($(".grid-item").sort(function(a, b){
                var $a = $(a);
                var $b = $(b);
                var result = ($b.data("sticky")?1:0) - ($a.data("sticky")?1:0);
                if (result == 0) {
                    result = $b.data("date") - $a.data("date");
                }
                return result;
            }));
        } else {
            $(".grid").append($(".grid-item").sort(function(a, b){
                return $(b).data("date") - $(a).data("date");
            }))
        }
    }

    mod.refreshGrid = function() {
        var grid = getGridHandler();
        if (grid) {
            grid.reloadItems();
            grid.layout();
        }
    }

    var getGridHandler = function() {
        if (!msnry) {
            msnry = $('.grid').data('masonry');
        }

        return msnry;
    }

    var searchByFilter = function(post, filter) {
        if (filter.values.length == 0) {
            return true;
        }

        var postValues = [];
        var postElement = post[filter.metadataField];
        if (Array.isArray(postElement)) {
            postValues = postElement;
        } else {
            postValues.push(postElement);
        }

        var matchingElements = arrayIntersection(postValues, filter.values);
        if (matchingElements && matchingElements.length > 0) {
            return true;
        }

        return false;
    }

    var searchByKeyword = function(post, keywords) {
        if (!keywords) {
            return true 
        }

        // Search title and then in the excerpt
        var searchRegEx = new RegExp(keywords, "i");
        var result = post.title.search(searchRegEx);
    
        if (result < 0) {
            result = post.excerpt.search(searchRegEx);
    
            if (result < 0) {
                result = post.content.search(searchRegEx);
            }
        }

        return result >= 0;    
    }

    mod.removeFilters = function () {
        var $articles = $(".grid-item");
        $articles.removeClass("hide");
    }

    var arrayIntersection = function(array1, array2) {
        return array1.filter(function(n) {
            return array2.indexOf(n) != -1;
        });
    }

    return mod;
}(jQuery));

var customSearch = (function($){
    var search = [];

    search.handleFilterChange = function() {
        closeSearch();
        // Fires popstate
        var query = buildQueryString("AdvancedSearch");
        window.location.hash = query;

        return false;
    }

    search.applyFilters = function (callback) {
        var selectedFilters = {};

        {% assign categories = site.data.categories %}
        {% for category in categories %}
        selectedFilters.{{ category.name }} = {};
        selectedFilters.{{ category.name }}.metadataField = '{{ category.metadataField }}';
        selectedFilters.{{ category.name }}.values = [];
        $.each( $("input[name={{ category.name }}]:checked"), function(){
            selectedFilters.{{ category.name }}.values.push($(this).val());
        });
        {% endfor %}

        var keywordSearch = $("#SearchPhraseText").val();
        
        var filterResult = customFilter.applyFilter(selectedFilters, keywordSearch, callback);

        return false;
    }

    search.removeFilters = function(updateHash){

        customFilter.removeFilters();

        if (updateHash) {
            var query = buildQueryString("AdvancedSearch");
            window.location.hash = query;
        }

        // Close search
        closeSearch();

        return false;
    }

    search.handleSortChange = function() {
        var query = buildQueryString("AdvancedSearch");
        window.location.hash = query;

        return false;
    }

    search.sortResults = function(sortField) {

        customFilter.sortGrid(sortField);

        return false;
    }

    search.updateUrlHash = function() {
        var query = buildQueryString("AdvancedSearch");
        window.location.hash = query;
    }

    var buildQueryString = function(formId){
        return $.map($("#" + formId).serializeArray().concat($("#QuickSearch").serializeArray()), function(val) {
            // ignore empty textboxes
            if (val.value != "" )
                return [val.name, encodeURIComponent(val.value)].join('=');
        }).join('&');
    }

    var closeSearch = function() {
        $('.dropdown.open').removeClass('open');
    }

    return search;
  }(jQuery));


(function ($) {

    $(document).ready(function() {

        // Added logic to re-apply filters when page is reloaded
        window.onhashchange = function(event) {
            reApplyFilters();
        };

        // disable closing of the dropdown as checkboxes are selected
        $('.dropdown-menu').click(function (e) {
            e.stopPropagation();
        });

        // select2
        $('.tcs-select').select2({
            placeholder: "Select",
            minimumResultsForSearch: Infinity
        });

        $('#showMoreFiltersToggle').on('click', function()
        {
            $('#showMoreFiltersToggle').toggle();
            $('#showLessFiltersToggle').toggle();
            $('.filter-box').toggleClass('expanded')
        });

        $('#showLessFiltersToggle').on('click', function()
        {
            $('#showLessFiltersToggle').toggle();
            $('#showMoreFiltersToggle').toggle();
            $('.filter-box').toggleClass('expanded')
        });

        // mobile search click
        $('#mobileToggleSearch').on('click', function () {
            $('#mobileToggleSearch').toggleClass('search-hidden');
            $('.search-box').toggleClass('search-hidden');
            $('.search-box input').focus()
        });

        // checkboxes selection toggle
        $('input[type="checkbox"]').on('change', function (e) {
            var element = $(this);
            var group = element.attr('group');
            var name = element.attr('name');
            var id = element.attr('id');
            var isChecked = element.is(':checked');

            var filter = filterMap[group];
            if (!filter) {
                filter = {};
                filterMap[group] = filter;
            }

            if (isChecked) {
                if (id.startsWith('select_all')) {
                    //select all checkboxes
                    $('#' + group + 'Dropdown input[type="checkbox"]:not([id^="select_all"])').prop('checked', true).trigger('change');
                }

                // apply filter
                filter[id] = true;
            } else if (filter[id]) {
                if (id.startsWith('select_all')) {
                    //deselect all checkboxes
                    $('#' + group + 'Dropdown input[type="checkbox"]:not([id^="select_all"])').prop('checked', false).trigger('change');
                }

                // remove filter
                delete filter[id];
            }

            // update labels..
            updateFilterLabls(group);
        });

        // reset filter click handler
        $('#resetFilters').on('click', function (e) {
            resetSearchForm();

            // Reload the page
            customSearch.updateUrlHash();
        });

        // apply filter click handler
        $('#applyFilters').on('click', function (e) {
            return customSearch.handleFilterChange();
        });

        // sort by dropbox change handle
        $('#sortBy').on('change', function(e) {
            return customSearch.handleFilterChange();
        })

        reApplyFilters();
    });

    var filterMap = {};
    var updateFilterLabls = function (group) {
        var filter_count = $('#' + group + 'Dropdown input[type="checkbox"]:not([id^="select_all"])').length;

        var filter = filterMap[group];
        var keys = Object.keys(filter);
        if (keys.length == 0) {
            $('#' + group + 'Dropdown button .truncate').text('Select');
        } else if (keys.length == filter_count + 1) {
            // ensure the select_all checkbox is still selected
            $('#' + group + 'Dropdown input[type="checkbox"][id^="select_all"]').prop('checked', true);
            $('#' + group + 'Dropdown button .truncate').text('All Selected');
        } else {
            // ensure the select_all checkbox is not selected
            $('#' + group + 'Dropdown input[type="checkbox"][id^="select_all"]').prop('checked', false);
            $('#' + group + 'Dropdown button .truncate').text(keys.length + ' Selected');
        }
    };

    // Reset the changes applied to the search form
    function resetSearchForm() {

        // reset all
        $('input[type="checkbox"]').prop('checked', false);

        $("#SearchPhraseText").val('');

        $("#sortBy").val("featured").trigger("change.select2");

        // truncate all filters in the map
        for (var group in filterMap) {
            filterMap[group] = {};
        }

        // update labels..
        for (var group in filterMap) {
            updateFilterLabls(group);
        }

        $("#no-results").addClass("hide");
        $(".sort-by").removeClass("hide");
    }

    function getQueryString() {

        var query_string = {};
        var query;

        if (window.location.hash) {
            query = window.location.hash.replace("#", "");
        } 
        
        if (!query) {
            query = window.location.search.substring(1); 
        }

        if (!query) 
            return "";

        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
                // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        } 
        return query_string;
    };

    var loadingIndicator;
    function turnLoadingIndicatorOn(){
        loadingIndicator = $("<div class='loading modal-backdrop'><div class='inner'><i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i></div></div>");
        loadingIndicator.appendTo(document.body);
    }

    function turnLoadingIndicatorOff(){
        loadingIndicator.remove();
    }

    function reApplyFilters() {
        // Apply the selected filters when the page is reloaded
        turnLoadingIndicatorOn();
        var queryString = getQueryString();
        resetSearchForm();

        if (queryString) {
            var hasFilterSelected = false;    
            $.each(queryString, function(param, value){
                var $element = $("[name=" + param + "]");
                if($element.prop("type")=="checkbox"){
                    hasFilterSelected = true;

                    var group = $element.first().attr('group');
                    var filter = filterMap[group];
                    if (!filter) {
                        filter = {};
                        filterMap[group] = filter;
                    }

                    if (Array.isArray(value)) {
                        $.each(value, function(key, val){
                            var element = $("input:checkbox[name='" + param + "'][value='" + val + "']");
                            element.prop("checked", true);
                            filter[element.attr('id')] = true;
                        });
                    } else {
                        var element = $("input:checkbox[name='" + param + "'][value='" + value + "']");
                        element.prop("checked", true);
                        filter[element.attr('id')] = true;
                    }
                    updateFilterLabls(group);
                } else {
                    $("[name=" + param + "]").val(value);
                    if (param === "sortBy") {
                        // Refresh select2 combobox
                        $("#sortBy").trigger("change.select2");
                    } else {
                        hasFilterSelected = true;
                    }
                }
            });

            if (!hasFilterSelected) {
                // Handle scenario where only Sort By was selected
                customSearch.sortResults($("#sortBy").val())
                customFilter.refreshGrid();
                customSearch.removeFilters(false);
                // Workaround issue with Masonry grid
                $('.grid').masonry();
                turnLoadingIndicatorOff();
            } else {
                customSearch.sortResults($("#sortBy").val())
                customFilter.refreshGrid();
                customSearch.applyFilters(function(){
                    // Workaround issue with Masonry grid
                    $('.grid').masonry();
                    turnLoadingIndicatorOff();
                });
            }
        } else {
            customSearch.sortResults($("#sortBy").val())
            customFilter.refreshGrid();
            customSearch.removeFilters(false);
            // Workaround issue with Masonry grid
            $('.grid').masonry();
            turnLoadingIndicatorOff();
        }
    }

}(jQuery));

if(!String.prototype.startsWith){
    String.prototype.startsWith = function (str) {
        return !this.indexOf(str);
    }
}
