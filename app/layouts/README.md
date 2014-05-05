Layouts
=======

Layouts are templates for placeholding content. The layout shouldn't contain any text(no labels nor content). We use doT templates for our templates and SASS/Compass for styles. Thereof one layout should consist of two files. One template file and one style file. Remember to compile the templates and styles everytime you make any changes.

Here is an exmaple of a template file `three-rows.dot`:

```html
<div class="three-rows" data-layout="three-rows">
  <nav class="three-rows-topbar">{{=it.topbar}}</nav>
  <main class="three-rows-body" data-region="body">{{=it.body}}</main>
  <footer class="three-rows-footer" data-region="footer">{{=it.footer}}</footer>
</div>
```

##Template
The template should have a root element. Also the name of the layout should be specified in the `data-layout` attribute.
```html
<div class="three-rows" data-layout="three-rows">
  ...
</div>
```
Each layout should define some regions to placehold the content. Define a region in the `data-region` attribute. The template should be interpolatable and use the region name as the interpolation variable name. For the CSS class always extend the layout name with the region name. See `three-rows-body` below.
```html
  <main class="three-rows-body" data-region="body">{{=it.body}}</main>
```
###Nested elements
Don't extend a container's CSS classes.

In the example below, we have a contaniner element called `middle`. That contains a `right panel` and a `body`. The layout is called `three-rows-left-right`.
```html
  <div class="three-rows-left-right-middle">
    <main class="three-rows-left-right-body" data-region="body">{{=it.body}}</main>
    <aside class="three-rows-left-right-right-panel"></aside>
  </div>
```
##Styles

##Layout naming
If there exist nested elements. Please don't extend CSS classes with  the container element.
```html
<div class="three-rows-left-right" data-layout="three-rows-left-right">
  <header class="three-rows-left-right-header" data-region="header">{{=it.header}}</header>
  <div class="three-rows-left-right-middle">
    <nav class="three-rows-left-right-left-navigation" data-region="left-navigation">{{=it.leftNavigation}}</nav> <!- We didn't extend the three-rows-left-right-middle CSS class ->
    <main class="three-rows-left-right-body" data-region="body">{{=it.body}}</main> <!-  We didn't extend the three-rows-left-right-middle CSS class ->
    <aside three-rows-left-right-right-panel data-region="body">{{=it.rightPanel}}</aside> <!- We didn't extend the three-rows-left-right-middle CSS class ->
  </div>
  <footer class="three-rows-left-right-footer" data-region="footer">{{=it.footer}}</footer>
</div>
```
