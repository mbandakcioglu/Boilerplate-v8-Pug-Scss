import $ from 'jquery';
window.$ = window.jQuery = $;

// import 'magnific-popup';
import Aos from 'aos';
// import { Popover, Tooltip } from 'bootstrap';

import popup from './popup';
import sliders from './sliders';
import lightbox from './lightbox';
import kodzillaAccordion from './accordion';

$(function () {
	sliders();
	popup();
	lightbox();
	kodzillaAccordion();
	console.log('hello')
});
