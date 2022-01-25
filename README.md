
# Gulp Banner Workflow

This is an ongoing project to make banner developement more fluid.

## Getting Started

### Prerequisites
node.js<br>gulp.js
```

### Installing
After installing Prerequisites
```
npm install
```

## File Structure
    ├── gulpfile.js                 # gulp taks
    ├── config.json                 # project setup via json data
    ├── build                       # development build outputs
	├── package                     # packaged build + zips for deployment
    ├── src                     
	│   ├── global                  # global files to be populated in all builds
    │   │   ├── images              # global images
    │   │   ├── js                  # global js 
    │   │   ├── pug                 # global pug layout
    │   │   ├── sass                # global styles
    │   ├── creatives           
	│   │   ├── [creative name]     # creative execution
    │   │   │   ├── [size]          # size specific
    │   │	│   │   ├── assets      # psds for png sprites + images
    │   │	│   │   ├── js          # size specific js
    │   │	│   │   ├── pug         # size specific html template
    │   │	│   │   ├── sass        # size specific sass
    │   │   │   │   └── ...  
    │   │   │   └── ...  
    │   │   └── ...  
	│   └── ...           
	└── ...



## Gulp commands

```
gulp
```
default development mode
```
gulp package
```
minify files and optimize image assets for production build + zip files
```


## Built With

* SASS
* PUG (https://pugjs.org/api/getting-started.html)
* Sprite smith - sprite sheets (https://www.npmjs.com/package/spritesmith)
* Tiny PNG API (https://tinypng.com/developers)

## Author
Erik Peterson
erik@erik-id.com
