
Installation

- Download fusemobile from http://drupal.org/project/fusemobile
- Unpack the downloaded file and place the fusemobile folder in your Drupal installation under
  one of the following locations:

    * sites/all/themes
    * sites/default/themes
    * sites/example.com/themes

- Log in as an administrator on your Drupal site and go to
  Administer > Site building > Themes (admin/build/themes) and make fusemobile the default theme.

- if you want to change the name of the theme from 'fusemobile' to another name like 'mytheme',
follow these steps (to do BEFORE enabling the theme) :

	- rename the theme folder to 'mytheme'
	- rename fusemobile.info to mytheme.info
	- Edit fusemobile.info and change the name, description, projet (can be deleted)
	- In fusemobile.info replace [fusemobile_block_editing] and [fusemobile_rebuild_registry]
	  by [mytheme_block_editing] and [mytheme_rebuild_registry]
	- In template.php change each iteration of 'fusemobile' to 'mytheme'
	- In theme-settings.php change each iteration of 'fusemobile' to 'mytheme'

__________________________________________________________________________________________

What are the files for ?
------------------------

- fusemobile.info => provide informations about the theme, like regions, css, settings, js ...
- block-system-main.tpl.php => template to edit the content
- block.tpl.php => template to edit the blocks
- comment.tpl.php => template to edit the comments
- node.tpl.php => template to edit the nodes (in content)
- page.tpl.php => template to edit the page
- template.php => used to modify drupal's default behavior before outputting HTML through
  the theme
- theme-settings => used to create additional settings in the theme settings page

In /CSS
-------

- default.css => define default classes, browser resets and admin styles
- ie6 => used to debug IE6
- ie7 => used to debug IE7
- layout.css => define the layout of the theme
- print.css => define the way the theme look like when printed
- style.css => contains some default font styles. that's where you can add custom css
- tabs.css => styles for the admin tabs (from ZEN)

__________________________________________________________________________________________

Changing the Layout

The layout used in fusemobile is fairly similar to the Holy Grail method. It has been tested on
all major browser including IE (5>8), Opera, Firefox, Safari, Chrome ...
The purpose of this method is to have a minimal markup for an ideal display.
For accessibility and search engine optimization, the best order to display a page is ]
the following :

	1. header
	2. content
	3. sidebars
	4. footer

This is how the page template is buit in fusemobile, and it works in fluid and fixed layout.
Refers to the notes in layout.css to see how to modify the layout.

__________________________________________________________________________________________

UPDATING fusemobile

Once you start using fusemobile, you will massively change it until a point where it has nothing
to do with fusemobile anymore. Unlike ZEN, fusemobile is not intended to be use as a base theme for a
sub-theme (even though it is possible to do so). Because of this, it is not necessary to
update your theme when a new version of fusemobile comes out. Always see fusemobile as a STARTER, and
as soon as you start using it, it is not fusemobile anymore, but your own theme.

If you didn't rename your theme, but you don't want to be notified when fusemobile has a new version
by the update module, simply delete "project = "fusemobile" in fusemobile.info

__________________________________________________________________________________________

Thanks for using fusemobile, and remember to use the issue queue in drupal.org for any question
or bug report:

http://drupal.org/project/issues/fusemobile
