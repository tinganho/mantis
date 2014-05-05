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
###Regions
Each layout should define some regions to placehold the content. Define a region in the `data-region` attribute. The template should be interpolatable and use the region name as the interpolation variable name. For the CSS class always extend the layout name with the region name. See `three-rows-body` below.
```html
  <main class="three-rows-body" data-region="body">{{=it.body}}</main>
```
###Nested elements
Don't extend a container's CSS classes.

In the example below, we have a contaniner element called `middle`. That contains a `right panel` and a `body`. The layout is called `three-rows`.
```html
  <div class="three-rows-middle">
    <main class="three-rows-body" data-region="body">{{=it.body}}</main>
    <aside class="three-rows-right-panel"></aside>
  </div>
```
##Styles

##Layout naming
There might not exist a perfect solution to naming a layout. Many are naming the layout based on the page they are in, like landing, app etc. The good things are that the names are short. The bad thing is that you can't reuse the layout on other pages. We think the most optimal solution is to have a name that represent all regions of a layout.

If there is layout that has three rows. It should be called `three-rows`.

If there is layout that has three columns. It should be called `three-columns`.

###Handling long names
There is a big downside with naming layouts using regions. The name of the layout might be very long if we have many regions. To solve this we introduce something called `with-group`.

####With-group
Try to group regions together and try to find out which group of region is the main group. And use the `with` group to add a group to the main group. A `with` group name have the syntax `with-GROUP-NAME`. You add a `with-group` to an another group by appending the `with-group` name with a space first. When we add the group `with-right-panel` to `three-rows`. The resulting name will be `three-rows with-right-panel`. For nested elements just extend the main group's CSS class.

####Example:

We have a very complex layout with header, middle, footer. In the middle consist of a left navigation, body and a right panel.
```
________________
|              |
|    HEADER    | 
|______________|
|   |      |   |
| L | BODY | R |
|___|______|___|
|              |
|    FOOTER    |
|______________|
```
We can group this down to header, middle and body and call the group `three-rows`:
```
________________
|              |
|    HEADER    | 
|______________|
|              |
|     BODY     |
|______________|
|              |
|    FOOTER    |
|______________|
```
We can call the left over regions `left navigation` and `right panel` as `with-left-right`. And the resulting HTML for `three-rows with-left-right`. Notice that we just extend the main group's CSS class in all nested elements.

```html
<div class="three-rows with-left-right" data-layout="three-rows with-left-right">
  <header class="three-rows-header" data-region="header">{{=it.header}}</header>
  <div class="three-rows-middle">
    <nav class="three-rows-left-navigation" data-region="left-navigation">{{=it.leftNavigation}}</nav>
    <main class="three-rows-body" data-region="body">{{=it.body}}</main>
    <aside class="three-rows-right-panel" data-region="body">{{=it.rightPanel}}</aside>
  </div>
  <footer class="three-rows-footer" data-region="footer">{{=it.footer}}</footer>
</div>
```
