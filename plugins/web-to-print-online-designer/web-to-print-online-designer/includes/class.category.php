<?php
class NBD_Category extends Walker {
    public $tree_type = 'category';
    public $db_fields = array('parent' => 'parent', 'id' => 'term_id');    
    function start_lvl( &$output, $depth = 0, $args = array() ) {
        $indent = str_repeat( "\t", $depth );

        if ( $depth == 0 ) {
            $output .= $indent . '<ul class="children level-' . $depth . '">' . "\n";
        } else {
            $output .= "$indent<ul class='children level-$depth'>\n";
        }
    }
    function end_lvl( &$output, $depth = 0, $args = array() ) {
        $indent = str_repeat( "\t", $depth );
        if ( $depth == 0 ) {
            $output .= "$indent</ul> <!-- .sub-category -->\n";
        } else {
            $output .= "$indent</ul>\n";
        }
    }   
    function start_el( &$output, $category, $depth = 0, $args = array(), $id = 0 ) {
        extract( $args );
        $indent = str_repeat( "\t", $depth );

        $url = '?cat=' . $category->term_id;

        if ( $depth == 0 ) {
            $caret = $args['has_children'] ? ' ' : '';
            $class_name = $args['has_children'] ? ' class="has-children parent-cat-wrap"' : ' class="parent-cat-wrap"';
            $output .= $indent . '<li' . $class_name . '>' . "\n\t" .'<a href="' . $url . '">' . $category->name . $caret . '</a>' . "\n";
        } else {
            $caret = $args['has_children'] ? ' ' : '';
            $class_name = $args['has_children'] ? ' class="has-children"' : '';
            $output .= $indent . '<li' . $class_name . '><a href="' . $url . '">' . $category->name . $caret . '</a>';
        }
    }
    function end_el( &$output, $category, $depth = 0, $args = array() ) {
        $indent = str_repeat( "\t", $depth );
        if ( $depth == 1 ) {
            $output .= "$indent</li><!-- .sub-block -->\n";
        } else {
            $output .= "$indent</li>\n";
        }
    }    
}