import {$} from '../common/vendor';

const API_URL = 'http://localhost:4000/api/';

$(function() {

    function createCarouselIndicator(index) {
        const first = index === 0;
        const indicator = $('<li></li>');
        indicator.attr('data-target', '#guides-carousel');
        indicator.attr('data-slide-to', index);

        if(first) {
            indicator.addClass('active');
        }
        return indicator;
    }

    function createCarouselItem(index, title, content, imageUrl) {
        const first = index === 0;

        const item = $('<div></div>');
        item.addClass('carousel-item');
        if(first) {
            item.addClass('active');
        }

        const img = $('<img />').addClass('d-block w-100').attr('src', imageUrl);

        const caption = $('<div></div>').addClass('carousel-caption d-block');
        caption.html('<h5>' + title + '</h5>' + '<p>' + content + '</p>');

        item.append([img, caption]);

        return item;
    }

    $('#guides-page').each(function() {
        const carousel = $('.carousel');
        const innerEl = carousel.find('.carousel-inner');
        const indicatorEl = carousel.find('.carousel-indicators');

        $.get(API_URL + 'guides', (data) => {
            data.forEach((guide, index) => {
                const imageUrl = API_URL + 'guides/image/' + guide.imageId;

                const indicator = createCarouselIndicator(index);
                const item = createCarouselItem(index, guide.title, guide.content, imageUrl);

                innerEl.append(item);
                indicatorEl.append(indicator);
            });
            carousel.carousel();
        });
    });
});
