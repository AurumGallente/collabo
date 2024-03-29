<?php
class WPBakeryShortCode_Layerslider_Vc extends WPBakeryShortCode {
	
	protected function content ( $atts , $content = null , $helper = false ){
	$output = $title = $id = $el_class = '';
extract( shortcode_atts( array(
    'title' => '',
    'id' => '',
    'el_class' => ''
), $atts ) );

$el_class = $this->getExtraClass($el_class);
$css_class = apply_filters(VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, 'wpb_layerslider_element wpb_content_element'.$el_class, $this->settings['base']);

$output .= '<div class="'.$css_class.'">';
$output .= wpb_widget_title(array('title' => $title, 'extraclass' => 'wpb_layerslider_heading'));
$output .= do_shortcode('[layerslider id="'.$id.'"]');
$output .= '</div>'.$this->endBlockComment('wpb_layerslider_element')."\n";

echo $output;
	}


}