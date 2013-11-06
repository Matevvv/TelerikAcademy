<?php
register_sidebar(array(
		'name' => __( 'Right Hand Sidebar' ),
		'id' => 'right-sidebar',
		'description' => __( 'Widgets in this area will be shown on the right-hand side.' ),
		'before_title' => '<h5>',
		'after_title' => '</h5>'
		
));

register_nav_menu('top-menu', 'Menu');