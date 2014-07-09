<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wordpress');

/** MySQL database password */
define('DB_PASSWORD', '1234');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '8^/=xoH8-;ZGtNmnyn%vAVMQlB&.BP)VfnB1yn{<RQ}R}$_bF5] Tu>@>4SQ3c)@');
define('SECURE_AUTH_KEY',  ',D}_$,EV!G6X?lkt1Y7J|Mw1qO9YI r+i.&!GG{-w1r#6#xpfj~0j[jv%#b^}1Zu');
define('LOGGED_IN_KEY',    'AI2h>W^%))6YLvTn3zA<+D(NgZcKxs$rh29y< -AL)LE^,vO,ZvUOD1MkVfhpzq@');
define('NONCE_KEY',        'k%W0o5aF|BAHb+`MS2NfK>h*G6^OxAl2&|h-cgQ,(P5[+|$-*F4mu~$J}|S,~5O5');
define('AUTH_SALT',        'sAV/`V|OFYb>5c]j<:Ed//CiPoLVyWE:EUF^/q=vu 5OQse<V}n! B:k_GzP-Qu(');
define('SECURE_AUTH_SALT', '5c*?-UXo^,C#ff_32 !M-TJlE|@rm1/^@cBU8DKC)}Yuft&C}Pvo$EB7:&?C`PA*');
define('LOGGED_IN_SALT',   '}UG[QaNWR:~o|mP1%tJaiK+w+-gBk KoS.(F]%|)iqCAa6dOl;*&*ORIBtgw(rv+');
define('NONCE_SALT',       'Zx)%Bx1H3B5fsRP-/8Yd,t{k=$CxQa/B$tTsZ<!?l-h-r1+/gf3m-~GJ5|28vQB+');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
