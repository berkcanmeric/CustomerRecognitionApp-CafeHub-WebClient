document.addEventListener("DOMContentLoaded", function () {

    const customers = document.getElementById('customers');
    const payment = document.getElementById('payment');
    const spotify = document.getElementById('spotify');
    const product = document.getElementById('product');


    customers.addEventListener('click', () => {
        // Do something here when the card is clicked
        console.log('Kart1 tıklandı!');
        Swal.fire({
            icon: 'success',
            title: 'Müşteri sayfasına başarıyla erişildi!',
            text: 'Müşteri sayfasına yönlendiriliyorsunuz.',
            timer: 1500,
            timerProgressBar: true
        }).then(() => {
            console.log('Müşteri sayfasına yönlendiriliyor...');
            window.location.href = "/CafeManagement/Customers";
        });
    });

    payment.addEventListener('click', () => {
        // Do something here when the card is clicked
        console.log('Kart2 tıklandı!');
        Swal.fire({
            icon: 'success',
            title: 'Ödeme sayfasına başarıyla erişildi!',
            text: 'Ödeme sayfasına yönlendiriliyorsunuz.',
            timer: 1500,
            timerProgressBar: true
        }).then(() => {
            console.log('Ödeme sayfasına yönlendiriliyor...');
            window.location.href = "/CafeManagement/Payment";
        });
    });

    // spotify.addEventListener('click', () => {
    //     // Do something here when the card is clicked
    //     console.log('Kart3 tıklandı!');
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Spotify sayfasına başarıyla erişildi!',
    //         text: 'Spotify sayfasına yönlendiriliyorsunuz.',
    //         timer: 1500,
    //         timerProgressBar: true
    //     }).then(() => {
    //         console.log('Spotify sayfasına yönlendiriliyor...');
    //         window.location.href = "/Spotify/Index";
    //     });
    // });
    product.addEventListener('click', () => {
        // Do something here when the card is clicked
        console.log('Kart4 tıklandı!');
        Swal.fire({
            icon: 'success',
            title: 'Ürün sayfasına başarıyla erişildi!',
            text: 'Ürün sayfasına yönlendiriliyorsunuz.',
            timer: 1500,
            timerProgressBar: true
        }).then(() => {
            console.log('Ürün sayfasına yönlendiriliyor...');
            window.location.href = "/CafeManagement/Products";
        });
    });
});