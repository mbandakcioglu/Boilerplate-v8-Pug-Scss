# Boilerplate

## Bilgisayarınızda Çalıştırın

Bilgisayarınızda nodejs kurulu olmalıdır. (https://nodejs.org/en/)

Terminal (windows cms veya powershell) kullanarak gerekli paketleri yükleyin

```bash
	npm install
```

## Settings

### **Projelerin Drupal ortamına uygun klasör yapısı olması için yapılması gerekenler**

gulpfile.js dosyasında settings.drupal değiştenini true yapılmalı

```javascript
	const settings = {
		urlBuild: true,
		htmlMinifying: true,
		portNo: 3099,
		drupal: true,
	}
```

src > pug > includes > general-variables.pug dosyasında - var drupal değeri "true" yapılmalı

```pug
	- var drupal = "true";
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

```bash
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
