<?php
// $Id: forum-icon.tpl.php,v 1.2 2010/06/07 21:17:08 jarek Exp $

/**
 * @file
 * Default theme implementation to display an appropriate icon for a forum post.
 *
 * Available variables:
 * - $new_posts: Indicates whether or not the topic contains new posts.
 * - $icon: The icon to display. May be one of 'hot', 'hot-new', 'new',
 *   'default', 'closed', or 'sticky'.
 *
 * @see template_preprocess_forum_icon()
 * @see theme_forum_icon()
 */
?>
<?php if ($new_posts): ?>
  <a id="new">
<?php endif; ?>

<?php print theme('image', array('path' => $directory . "/images/forum-$icon.png", 'alt' => 'Default avatar')); ?>

<?php if ($new_posts): ?>
  </a>
<?php endif; ?>
