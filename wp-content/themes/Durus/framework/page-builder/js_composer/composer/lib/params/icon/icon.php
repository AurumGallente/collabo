<?php

function vc_icon_form_field($settings , $value) {
	global $ss_social , $ss_air , $fa_icons;
	
	$dependency = vc_generate_dependencies_attributes($settings);
    $return = '<div class="icongroup">'
                .'<input type="hidden" name="'.$settings['param_name'].'" class="wpb_vc_param_value wpb-textinput '.$settings['param_name'].' '.$settings['type'].'_field vc-icon-picker" value="'.$value.'" '.$dependency.'>';
	$icon_value = explode("|",$value);			
	$return .= '<div class="vc-icon-option wpb-icon-prefix">';
	if( !empty( $ss_air)){
		foreach( $ss_air as $k => $ss_icon){
			$return .= '<i class="ss-air '.$ss_icon.' '.($icon_value[0] == $k ? "selected" : "" ).'" data-icon="'.$k.'|ss-air"></i>';
		}
	}
	
	if( is_array($fa_icons ) && !empty($fa_icons)) {
	foreach( $fa_icons as $k => $fontawesome_icon) { 
	   $return .= '<i class="'.$fontawesome_icon.' '.($icon_value[0] == $k ? "selected" : "" ).'" data-icon="'.$k.'|fontawesome"></i>';
	 }
	}
	
	if( !empty( $ss_social)){
		foreach( $ss_social as $k => $ss_icon){
			$return .= '<i class="ss-social-regular '.$ss_icon.' '.($icon_value[0] == $k ? "selected" : "" ).'" data-icon="'.$k.'|ss-social"></i>';
		}
	}
	
	$return .= '</div></div>';
	return $return;
}

