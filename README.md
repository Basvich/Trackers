# Trackers

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.15.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Desplegar en gitHub
Forma anterior: 


ng build --prod --output-path docs --base-href /Trackers/


Forma nueva:
ver ejemplo en https://medium.com/tech-insights/how-to-deploy-angular-apps-to-github-pages-gh-pages-896c4e10f9b4

ng build --prod --base-href "https://Basvich.github.io/Trackers/"
npx angular-cli-ghpages — dir=dist/trackers


https://Basvich.github.io/Trackers/

otra mas y mas simple (https://www.npmjs.com/package/angular-cli-ghpages#prerequisites):
Esto instala el cliente para despliegue
```ng add angular-cli-ghpages```

//Esto lo despliega
```ng deploy --base-href=/Trackers/```


probar en: [Trackers](https://Basvich.github.io/Trackers/)  
## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
