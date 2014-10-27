<?php

/**
 * Hide the Input Format Fieldset
 *
 * @todo MIGRATE. Because the field body is now a field using the Field API
 * I don't know how to do this
 */
function _option_nfs_inputformat(&$form, &$form_state, $settings, $node) {
  if (isset($form['body']) && $settings['nfs_inputformat'] == 1) {
    unset($form['body']['format']);
  }

  return $form;
}

