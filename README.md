# Boilerplate v8
Wordpress, Drupal ortamlarını da destekleyen HTML boilerplate.

## Bilgisayarınızda Çalıştırın

Bilgisayarınızda nodejs kurulu olmalıdır. (https://nodejs.org/en/)

Terminal (windows cms veya powershell) kullanarak gerekli paketleri yükleyin

```bash
	npm install
```

## Settings

### **Klasör Yapısı Seçimi**
1. 
	- gulpfile.js dosyasında settings.buildType değişken değeri seçilmeli: *Drupal, Wordpress, Html*

	-  Wordpress ve Drupal  seçiminde Tema adı girilmeli
		```javascript
			const settings = {
				urlBuild: true,
				htmlMinifying: true,
				portNo: 3099,
				drupal: "Html,
				themeName: "TestTheme"
			}
		```

	
1. 
	- src > pug > includes > general-variables.pug dosyasında *buildType* değişken değeri seçilmeli: *Drupal, Wordpress, Html*
	- Wordpress ve Drupal seçiminde Tema adı girilmeli


		```bash
			- var buildType = "Wordpress";
			- var themeName = "TestTheme"
		```

## Tasks

Local Sunucuyu çalıştırın ve projenin ilk derlemesini gerçekleştirin.

```bash
  gulp
```

### **Js Dosyası Minify Ederek Build Etmek**

```bash
    gulp build
```

### **Cache Temizleme Ve Dist Dizinini Silme**

```bash
    gulp clear
```

### **Sadece Cache Temizleme**

Görselleri her kayıt sonrasın watch taski ile tekrar tekrar derlenmesini engellemek için kullanılan cache temizliği

```bash
    gulp clearCache
```

### **Sadece Dist Dizinini Silme**

```bash
    gulp cleandist
```

### **Özel Oluşturulmuş JS/JSON dosyaları**

customJsTransfer task'ında /dist dizinine taşınmasını istediğiniz js/json dosyalarının yanımlamasın yapıp, default ve build altında bu task'ı yorum satırı olmaktan çıkartın.

```javascript
	async function customJsTransfer() {
		return src(
				[
					'src/js/custom.js',
					'!src/js/app.js*'
				],
			)
			.pipe(dest(`dist/${themeDest}/scripts`))
			.pipe(browserSync.reload({ stream: true }))
	}
```

## Task Listesi

```text
	├─┬ build
	│ └─┬ <series>
	│   ├── cleandist
	│   ├── clearCache
	│   ├── pugCompile
	│   ├── sassCompile
	│   ├── jsBundleMinifyed
	│   ├── webpConvert
	│   ├── imgOptim
	│   ├── svgOptim
	│   ├── fonts
	│   ├── videos
	│   ├── docs
	│   └── robots
	├── cleandist
	├─┬ clear
	│ └─┬ <parallel>
	│   ├── cleandist
	│   └── clearCache
	├── clearCache
	├── customJsTransfer
	├─┬ default
	│ └─┬ <series>
	│   ├── pugCompile
	│   ├── sassCompile
	│   ├── jsBundle
	│   ├── webpConvert
	│   ├── imgOptim
	│   ├── svgOptim
	│   ├── fonts
	│   ├── videos
	│   ├── docs
	│   ├── robots
	│   └─┬ <parallel>
	│     ├── watchFiles
	│     └── sync
	├── imgOptim
	├── jsBundle
	├─┬ manuels
	│ └─┬ <parallel>
	│   ├── fonts
	│   ├── videos
	│   └── docs
	├── pugCompile
	├── robots
	├── sassCompile
	├── svgOptim
	├── sync
	└── webpConvert
```
