<?php 
	get_header();
?>
<div id="main">
	<div class="news">
	<div class="date"></div>
	<?php 
		if(have_posts()):
			while(have_posts()):
				the_post();
	?>
		<div class="article">
			<ul>
				<li><a href="#">web design</a></li>
				<li><a href="#">online marketing</a></li>
				<li><a href="#">admin</a></li>
			</ul>
			<span> <strong class="month"><?php the_time('M'); ?></strong> <br /> <strong class="day"><?php the_time('d'); ?></strong>
			</span>
			<h1><?php the_title(); ?></h1>
			<img src="<?php echo get_template_directory_uri(); ?>/images/article-psych.png" width="180" height="180"
				alt="place" />
			<p><?php the_content(); ?></p>
		</div>

		<div class="article">
			<ul>
				<li><a href="#">web design</a></li>
				<li><a href="#">online marketing</a></li>
				<li><a href="#">admin</a></li>
			</ul>
			<span> <strong class="month">feb</strong> <br /> <strong class="day">11</strong>
			</span>
			<h1><?php the_title(); ?></h1>
			<img src="<?php echo get_template_directory_uri(); ?>/images/article-angel.png" width="180" height="180"
				alt="place" />
			<p>Nam turpis leo, condimentum non ultricies non, condimentum ac
				risus. Curabitur a sem vel sapien facilisis dictum. Donec porta
				neque vitae dui tristique luctus. Phasellus in laoreet purus. Duis
				pellentesque massa a quam vestibulum venenatis. Donec felis nibh,
				tempus faucibus semper quis, facilisis et sapien.</p>
		</div>
		<div class="article">
			<ul>
				<li><a href="#">web design</a></li>
				<li><a href="#">online marketing</a></li>
				<li><a href="#">admin</a></li>
			</ul>
			<span> <strong class="month">jan</strong> <br /> <strong class="day">05</strong>
			</span>
			<h1><?php the_title(); ?></h1>
			<img src="<?php echo get_template_directory_uri(); ?>/images/article-negative.png" width="180" height="180"
				alt="place" />
			<p>Duis feugiat turpis vitae diam viverra rhoncus. Suspendisse eu est
				quis diam accumsan consectetur vel eget ligula. Nullam condimentum
				consectetur magna, vitae volutpat turpis vehicula non. Nunc
				tincidunt consectetur erat, at rutrum ligula scelerisque ac. Etiam a
				dui est.</p>
		</div>
	<?php 
		endwhile;
		endif;
	?>		
	</div>
	<div class="side">

		<div class="cell">
			<div class="separator"></div>
			<div class="shadow-top"></div>
			<div class="shadow-angle"></div>
			<div class="shadow-left"></div>
		</div>
		<div class="cell">
			<div class="separator"></div>
			<div class="shadow-top"></div>
			<div class="shadow-angle"></div>
			<div class="shadow-left"></div>
		</div>
		<div class="cell">
			<div class="separator"></div>
			<div class="shadow-top"></div>
			<div class="shadow-angle"></div>
			<div class="shadow-left"></div>
			<div class="side-navi">
				<?php if(!dynamic_sidebar('Right Hand Sidebar')): ?>
					<nav>
					<a href="#">Example</a>
					</nav>
				<?php endif; ?>
			</div>	
		</div>
	</div>
	<div class="bottom">
		<ul>
			<li class="backw"><a href="#">Backward</a></li>
			<li class="forw"><a href="#">Forward</a></li>
		</ul>
	</div>
</div>
<?php 
	get_footer();
?>
