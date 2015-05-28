# jskeleton-i18n

> Internationalization extension for JSkeleton applications throught the [i18next](http://i18next.com/) library.

## Getting Started

If you haven't used [Bower](http://bower.io) before, be sure to check out the [Getting Started](http://bower.io/#getting-started) guide, as it explains how to create a [package](http://bower.io/docs/creating-packages/) as well as install and use Bower packages. Once you're familiar with that process, you may install this plugin with this command:

```shell
bower install jskeleton-i18n --save
```

Once the plugin has been installed, it may be used with this line of JavaScript to get the translated key:

## Usage

#### Using JavaScript
```js
JSkeleton.i18n.t('key', {count: 2});
```

#### Using the helper
```html
<p>{{i18n "key" "{count: 2}"}}</p>
```


You can find all the i18next options in the [official documentation](http://i18next.com/pages/doc_features.html).