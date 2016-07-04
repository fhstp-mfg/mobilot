# Mobilot

Mobilot is a system for creating intuitive mobile information systems.


## Setup

To get Mobilot running locally on your machine, do the following:


### Install dependencies

**Mac OS X**:
```
  sh setup.sh
```

**Windows**:
```
  setup.bat
```

**NOTE**: This might take a while, since `composer install` is executed.


### Database

Manually create a database named `mobilot`


### Database connection

Manually create `database.php` in `app/config/` (if necessary).
If your using **Homestead** instead, add the `database.php` in `app/config/local/database.php`.


### Migrations

Run:
```
  php artisan migrate
```


## Contributors
- [Iosif Miclaus](https://github.com/miclaus)
- [Simon Reinsperger](https://github.com/abisz)
- [Florian Grassinger](https://github.com/doomsayer2)
- [Patrick Kolar](https://github.com/DrFritzi)
- [Peter Alexander Kopciak](https://github.com/rikkuporta)

## License

[MIT license](http://opensource.org/licenses/MIT)
