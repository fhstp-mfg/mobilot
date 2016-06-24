<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="msapplication-TileColor"  content="#FFFFFF">
        <meta name="msapplication-TileImage"  content="../../favicon/favicon-144.png">
        <meta name="msapplication-config"     content="../../favicon/browserconfig.xml">
        <meta name="apple-mobile-web-app-title" content="Mobilot: <?php echo $mobidul; ?>">

        <script src="../js/constants.js"></script>

		<script>
            document.write ('<' + 'script src="../elements/bower_components/webcomponentsjs/webcomponents.min.js"></script' + '>');
        </script>

        <script src="/config.js"></script>
		<script>
			if ( ! useVulcanizedVersion )
			{
				document.write(
    				'<meta http-equiv="cache-control" content="max-age=0">' +
    				'<meta http-equiv="cache-control" content="no-cache">' +
    				'<meta http-equiv="expires" content="0">' +
    				'<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">' +
    				'<meta http-equiv="pragma" content="no-cache">');
			}

            var viewSrc  = '../elements/views/mobi-site';
                viewSrc += (useVulcanizedVersion) ? 'v' : '';
            document.write('<link rel="import" href="' + viewSrc + '.html">');
		</script>
        <title>Mobilot: <?php echo $mobidulName; ?></title>


        <!-- ****** faviconit.com Favicons ****** -->
        <link rel="shortcut icon"                         href="../../favicon/favicon.ico">
        <link rel="icon" sizes="16x16 32x32 64x64"        href="../../favicon/favicon.ico">
        <link rel="icon" type="image/png" sizes="196x196" href="../../favicon/favicon-196.png">
        <link rel="icon" type="image/png" sizes="160x160" href="../../favicon/favicon-160.png">
        <link rel="icon" type="image/png" sizes="96x96"   href="../../favicon/favicon-96.png">
        <link rel="icon" type="image/png" sizes="64x64"   href="../../favicon/favicon-64.png">
        <link rel="icon" type="image/png" sizes="32x32"   href="../../favicon/favicon-32.png">
        <link rel="icon" type="image/png" sizes="16x16"   href="../../favicon/favicon-16.png">

        <link rel="apple-touch-icon" sizes="152x152" href="../../favicon/favicon-152.png">
        <link rel="apple-touch-icon" sizes="144x144" href="../../favicon/favicon-144.png">
        <link rel="apple-touch-icon" sizes="120x120" href="../../favicon/favicon-120.png">
        <link rel="apple-touch-icon" sizes="114x114" href="../../favicon/favicon-114.png">
        <link rel="apple-touch-icon" sizes="76x76"   href="../../favicon/favicon-76.png">
        <link rel="apple-touch-icon" sizes="72x72"   href="../../favicon/favicon-72.png">
        <link rel="apple-touch-icon"                 href="../../favicon/favicon-57.png">
        <!-- ****** faviconit.com Favicons ****** -->


        <style>
            /* @note - No Content shown because it should be placed in :unresolved:after but there is no polyfill for this. */
            body[unresolved]
            {
                display            : flex;
                justify-content    : center;

                background          : url('../css/img/loading.gif') no-repeat;
                background-size     : 64px 64px;
                background-position : center 128px;
            }

            #supporter
            {
                position : fixed;
                z-index  : 99;
                left     : 0;
                top      : 0;
                width    : 100%;
                height   : 100%;
                display  : none;
            }
        </style>
    </head>

    <body id="body" onload="load()" unresolved style="-webkit-tap-highlight-color: rgba(0,0,0,0);">
        <mobi-site id="mobi_site"
                       mobidul="<?php echo $mobidul; ?>"
                       heading="<?php echo $mobidul; ?>"
                       startid="<?php echo isset($stationCode) ? $stationCode : ''; ?>"
                       startAbility="<?php echo isset($startAbility) ? $startAbility : ''; ?>"
                       startItemId="<?php echo isset($startItemId) ? $startItemId : ''; ?>"
                       touch-action="scroll"
                       style="-webkit-tap-highlight-color: rgba(0,0,0,0);">
        </mobi-site>


        <div id="supporter">
            <h3>Hopala!!</h3>
            <p>Ihr Browser unterstützt die neusten Technologien nicht. :(</p>
            <p>Um Mobilot verwenden zu können versuchen Sie folgendes:</p>
            <ul>
                <li>Chrome Browser <a href="http://www.google.at/intl/de/chrome/browser/">herunterladen</a>.</li>
            </ul>
        </div>


        <script src="../js/mobile_imports.js"></script>

        <script>
            function load ()
            {
                var body = document.getElementById('body');

                // @source - http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
                if ( ! ('registerElement' in document) )
                {
                    document.getElementById('body').style.background   = 'none';
                    document.getElementById('supporter').style.display = 'block';
                }
            }
        </script>

        <script>
            document.addEventListener('polymer-ready', function (e)
            {
                console.log('Hello Mobilot. Everything is Loaded');

                var mobidulcode = document.querySelector('mobi-site').mobidul;
                var startid     = document.querySelector('mobi-site').startid;

                // var ud          = new UserData();
                // var lastpage    = ud.getLastPage();
                // ud.setLastPage('none', 'home', mobidulcode);
                //
                // if ( lastpage.link !== 'home' && lastpage.mobidul === mobidulcode && startid == '' )
                // {
                //     document.querySelector('mobi-site').changeContent(null, lastpage, null);
                // }
            });
        </script>
    </body>
</html>
