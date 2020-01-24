;"use strict";
document.addEventListener("DOMContentLoaded", function () {
    /*=====================================================
        responsive embed
    =====================================================*/
    reframe('iframe');

    /*=====================================================
        copy permalink
    =====================================================*/
    new ClipboardJS('.js-copy-link')
    .on('success', function(e) {
        var message = document.getElementById('copy-alert');
        message.classList.add('show');
        setTimeout(function() {
            message.classList.remove('show');
        }, 5000);
    });

    /*=====================================================
        post loading
    =====================================================*/
    var nextLink, nextPageUrl, loadMoreButton, endMessage;
    nextLink = document.querySelector('link[rel=next]');
    if( nextLink !== null) {
        nextPageUrl = nextLink.getAttribute('href');
        loadMoreButton = document.getElementById('load-more');
        btnText = loadMoreButton.innerText;
    }
    if( typeof(nextPageUrl) !== 'undefined') {
        loadMoreButton.addEventListener('click', function (e) {
            e.preventDefault();
            loadMoreButton.innerText = loadingText;
            loadMoreButton.parentElement.classList.add('loading');
            loadMoreButton.disabled = true;
            if(parseInt(nextPage) <= parseInt(totalPages)){
                var url = nextPageUrl.split(/page/)[0] + 'page/' + nextPage + '/';
                fetch(url)
                .then(function (response) {
                    if(response.ok) {
                        return response.text();
                    }
                })
                .then(function(data) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data;
                    var wrapper = document.querySelector('.loop-wrap');
                    var html = tempDiv.querySelectorAll('.loop-item');
                    for(var i=0; i < html.length; i++) {
                        wrapper.appendChild(html.item(i));
                    }
                    nextPage++;
                    loadMoreButton.innerText = btnText;
                    loadMoreButton.disabled = false;
                    loadMoreButton.parentElement.classList.remove('loading');
                    if(nextPage> totalPages) {
                        document.getElementById('pagination-wrap').style.display = 'none';
                    }
                });
            }
        });
    };

    /*=====================================================
        Mobile menu
    =====================================================*/
    var tBtn = document.getElementById('menu-toggle');
    
    tBtn.onclick = function(e) {
        e.preventDefault();
        document.body.classList.toggle('js-mobile-menu-opened');
        tBtn.classList.toggle('menu-icon-close');
    };
    document.getElementById('backdrop')
    .onclick = function() {
        document.body.classList.toggle('js-mobile-menu-opened');
        tBtn.classList.toggle('menu-icon-close');
    };

    /*=====================================================
        notifications
    =====================================================*/
    // Parse the URL parameter
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Give the parameter a variable name
    var action = getParameterByName('action');
    var stripe = getParameterByName('stripe');

    if (action == 'subscribe') {
        document.body.classList.add('subscribe-success');
    }
    if (action == 'signup') {
        window.location = '/signup/?action=checkout';
    }
    if (action == 'checkout') {
        document.body.classList.add('signup-success');
    }
    if (action == 'signin') {
        document.body.classList.add('signin-success');
    }
    if (stripe == 'success') {
        document.body.classList.add('checkout-success');
    }

    var notifications = document.querySelectorAll('.notification');
    notifications.forEach(function(item) {
        var closelink = item.querySelector('.notification-close');
        closelink.addEventListener('click', function(e) {
            e.preventDefault();
            item.classList.add('closed');
            var uri = window.location.toString();
            if (uri.indexOf("?") > 0) {
                var clean_uri = uri.substring(0, uri.indexOf("?"));
                window.history.replaceState({}, document.title, clean_uri);
            }
        })

    });
    
    /*=====================================================
        gallery
    =====================================================*/
    var images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
        var container = image.closest('.kg-gallery-image');
        var width = image.attributes.width.value;
        var height = image.attributes.height.value;
        var ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    });
    mediumZoom('.kg-gallery-image img', {
        margin: 30
    });

    /*=====================================================
        Search
    =====================================================*/
    var searchForm = document.querySelector('#search-form');
    searchForm.onsubmit = function(e) {
        e.preventDefault()
    }
    var searchOpen = document.getElementById('search-btn')
    var searchPopup = document.querySelector('.js-search-popup');
    var searchClose = document.getElementById('search-close');
    var searchInput = document.getElementById('search-input');
    var searchResult =document.getElementById('search-results');
    var posts = [];
    searchOpen.addEventListener('keyup', function(e){
        if (e.keyCode == 13) {
            openSearch();
        }
    }) 
    searchOpen.onclick = openSearch;
    function openSearch(e) {
        searchPopup.classList.toggle('visible');
        document.body.classList.toggle('search-opened');
        window.setTimeout(function() {
            searchInput.focus();
        }, 1000);
        if(posts.length == 0 && typeof searchUrl !== 'undefined') {
            fetch(searchUrl)
            .then(function(response) {
               return response .json();
            })
            .then(function(data) {
                posts = data.posts;
                search();
            })
        }
    }
    document.addEventListener('keyup', function(e){
        if (e.keyCode == 27 && searchPopup.classList.contains('visible') && document.body.classList.contains('search-opened')) {
            closeSearch(e);
            searchOpen.focus();
        }
    });
    searchInput.addEventListener('keyup', function(e){
        if (e.keyCode == 27) {
            closeSearch(e);
            searchOpen.focus();
        }
    });
    searchClose.addEventListener('keyup', function(e){
        if (e.keyCode == 13) {
            closeSearch(e);
            searchOpen.focus();
        }
    });
    searchClose.onclick = closeSearch;
    function closeSearch(e) {
        searchPopup.classList.toggle('visible');
        document.body.classList.toggle('search-opened');
        searchInput.value = '';
        searchResult.innerHTML = '';
    }

    function search() {
        if (posts !== undefined && posts.length > 0) {
            var options = {
                shouldSort: true,
                tokenize: true,
                matchAllTokens: true,
                threshold: 0,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [{
                    name: 'title'
                }, {
                    name: 'plaintext'
                }, {
                    name: 'excerpt'
                }, {
                    name: 'custom_excerpt'
                }]
            }
            fuse = new Fuse(posts, options);
            searchInput.onkeyup = function () {
                var result = fuse.search(this.value);
                var output = '';
                var language = document.documentElement.lang;
                result.forEach(function (val, key) {
                    var pubDate = new Date(val.published_at).toLocaleDateString(language, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })
                    output += '<div id="' + val.id + '" class="result-item">';
                    output += '<a href="' + val.url + '"><div class="title">' + val.title + '</div>';
                    output += '<div class="date">' + pubDate + '</div></a>';
                    output += '</div>';
                });
                searchResult.innerHTML = output;
            }
        }
    }
    /*=====================================================
        scroll top
    =====================================================*/
    btnScrollTop = document.querySelector('#back-to-top');
    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            btnScrollTop.style.opacity = 1;
          } else {
            btnScrollTop.style.opacity = 0;
          }
    });
    btnScrollTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    })
});