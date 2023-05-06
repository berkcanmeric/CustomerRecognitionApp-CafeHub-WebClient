$(document).ready(function(){
    // Add CSS styles to the back-to-top button
    $('#back-to-top').css({
        'position': 'fixed',
        'bottom': '25px',
        'right': '25px',
        'display': 'none',
        'color': '#fff',
        'background-color': '#212529',
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    // Scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
        return false;
    });
});