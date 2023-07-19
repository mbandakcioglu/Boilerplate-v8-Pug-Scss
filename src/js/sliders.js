import 'slick-carousel';

function sliders() {
	 $('.single-item').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 3
	 });

}

export default sliders;