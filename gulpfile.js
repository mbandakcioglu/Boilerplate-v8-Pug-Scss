
import pkg from 'gulp';
const { gulp, src, dest, parallel, series, watch } = pkg;

import GulpRollup from 'gulp-better-rollup';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify-es'
import terser from '@rollup/plugin-terser';

import browserSync from 'browser-sync'
import GulpPug from 'gulp-pug';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import gulpCSSPurge from 'gulp-css-purge'
import GulpCleanCss from 'gulp-clean-css';
import gulpUrlBuilder from 'gulp-url-builder'
import autoPrefixer from 'gulp-autoprefixer';
import htmlbeautify from 'gulp-html-beautify'
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import imageminWebp from 'imagemin-webp'
import gulpExtReplace from 'gulp-ext-replace'
import GulpSvgmin from 'gulp-svgmin';
import Cache from 'gulp-cache';
import gulpIf from 'gulp-if';
import { deleteAsync } from 'del';

// variables
const locals = {},	
	settings = {
		urlBuild: true,
		htmlMinifying: true,
		portNo: 3099,
		buildType: "Drupal", // Drupal, Wordpress, Html
		themeName: "mbtheme" // Drupal, Wordpress 
	}

const {urlBuild, htmlMinifying, portNo, buildType, themeName} = settings;

let themeDest, filesDest = "";

if(buildType === "Wordpress") {
	themeDest = filesDest = `/wp-content/themes/${themeName}`;
} else if (buildType === "Drupal") {
	themeDest = `/themes/custom/${themeName}/`;
	filesDest = "/sites/default/files/";
} else {
	themeDest = filesDest = "/assets/";
}

// pug
function pugCompile() {
	return src([
			'src/pug/views/**/*.pug'
		]).pipe(GulpPug({ locals }))
		.pipe(htmlbeautify({
			"indent_size": 4,
			"indent_with_tabs": true
		}))
		.pipe(
			gulpIf(htmlMinifying, htmlmin({ collapseWhitespace: true }))
		)
		// .pipe(urlBuilder())
		.pipe(gulpIf(urlBuild, gulpUrlBuilder()))
		.pipe(dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
}

// sass
function sassCompile() {
	return src([
			'src/scss/**/*.+(sass|scss|css)',
			'!src/scss/**/_*.*',
			'!src/scss/normalize.css'
		])
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoPrefixer())
		.pipe(gulpCSSPurge({
			trim: true,
			shorten: true,
			verbose: false
		}))
		.pipe(GulpCleanCss())
		.pipe(dest(`dist/${themeDest}/styles`))
		.pipe(browserSync.reload({ stream: true }))
}

// javascript
function jsBundle(_beautify = true) {
	return src([
			'./src/js/app.js'
		])
		.pipe(GulpRollup({
			plugins: [
				uglify({
					compress: {
						comparisons: false,
						drop_console: false,
						// debug: true
					}
				}),
				babel(),
				resolve(),
				commonjs(),
				terser({
					output: {
						beautify: _beautify,
						comments: false,
						indent_level: 4
					}
				})
			]
		}, 'umd'))
		.pipe(concat('global.js'))
		.pipe(rename({ basename: 'app' }))
		.pipe(dest(`dist/${themeDest}/scripts`))
		.pipe(browserSync.reload({ stream: true }))
}

function jsBundleMinifyed() {
	return jsBundle(false);
}

async function customJsTransfer() {
	return src(
			[
				'src/js/transfer.js',
				'!src/js/app.js*'
			],
		)
		.pipe(dest(`dist/${themeDest}/scripts`))
		.pipe(browserSync.reload({ stream: true }))

}

// images
function webpConvert() {
	return src('src/images/**/*.+(png|jpg|jpeg)')
		.pipe(Cache(imagemin([
			imageminWebp({
				// lossless: true, if pngs turn out sucky uncomment this and redo just pngs
				quality: 75
			})
		])))
		.pipe(gulpExtReplace(".webp"))
		.pipe(dest(`dist/${filesDest}/images`))
}

function imgOptim() {
	return src('src/images/**/*.+(png|jpg|jpeg|gif)')
		.pipe(Cache(imagemin()))
		.pipe(dest(`dist/${filesDest}/images`))
}

function svgOptim() {
	return src('src/images/**/*.+(svg)')
		.pipe(Cache(GulpSvgmin()))
		.pipe(dest(`dist/${filesDest}/images`))
}

// file transfers
function fonts() {
	return src('src/fonts/**/*.+(ttf|woff|woff2)')
		.pipe(dest(`dist/${filesDest}/fonts`))
}

function videos() {
	return src('src/videos/**/*.+(mp4|ogv|webm)')
		.pipe(dest(`dist/${filesDest}/videos`))
}

function docs() {
	return src('src/docs/**/*.+(pdf|doc|docx|xls|xlsx)')
		.pipe(dest(`dist/${filesDest}/docs`))
}

function robots() {
	return src('src/robots.txt')
		.pipe(dest(`dist`))
}

// Cache clear
async function clearCache() {
	Cache.clearAll();
}

// browsersync
async function sync() {
	browserSync.init({
		server: {
			baseDir: `./dist`
		},
		port: portNo
	})
}

async function cleanDist() {
	clearCache();
	await deleteAsync('dist/**/*', { force: true })
	await deleteAsync('dist', { force: true })
}

function watchFiles() {
	watch(['src/pug/**/*.pug'], pugCompile)
	watch(['src/scss/**/*.+(sass|scss|css)'], sassCompile)
	watch('src/js/**/*.js', series(jsBundle, customJsTransfer))
	watch('src/images/**/*.+(png|jpg|jpeg)', webpConvert)
	watch('src/images/**/*.+(png|jpg|jpeg|gif)', imgOptim)
	watch('src/images/**/*.+(svg)', svgOptim)
	// cb()
}

// exports 
export {
	cleanDist,
	clearCache,
	pugCompile,
	sassCompile,
	jsBundle,
	customJsTransfer,
	webpConvert,
	imgOptim,
	svgOptim,
	robots,
	sync
}

// manuels
export let manuels = parallel(fonts, videos, docs)

export let clear = parallel(cleanDist, clearCache)
//
export let build = series(
	cleanDist,
	clearCache,
	pugCompile,
	sassCompile,
	// jsBundle,
	jsBundleMinifyed,
	// customJsTransfer,
	webpConvert,
	imgOptim,
	svgOptim,
	fonts,
	videos,
	docs,
	robots
);

export default series(
	pugCompile,
	sassCompile,
	jsBundle,
	// customJsTransfer, 
	webpConvert,
	imgOptim,
	svgOptim,
	fonts,
	videos,
	docs,
	robots,
	parallel(watchFiles, sync)
);
