<!DOCTYPE html>
<html lang="de-DE">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<h2>Willkommen bei Mobilot!</h2>

		<p>Folge folgenden Link, um deinen Account zu aktivieren:</p>

		<p>{{ URL::to('activateAccount', $token) }}</p>
	</body>
</html>
