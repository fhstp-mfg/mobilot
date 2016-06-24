<!DOCTYPE html>
<html lang="de-DE">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<h2>Mobilot Passwort zurücksetzen</h2>

		<p>Folge folgenden Link, um dein Passwort zurückzusetzen:</p>

		<p>{{ URL::to('restorePassword', $token) }}</p>
	</body>
</html>
